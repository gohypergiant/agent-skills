#!/usr/bin/env node
// Classifies each export of a file as file-private, package-internal or package-public, from the import graph.
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import {
  SKILL_VERSION,
  discoverPackages,
  fail,
  isSourceFile,
  listFiles,
  loadOverlay,
  loadTypescript,
  packageFor,
  parseArgs,
  parseSource,
  printJson,
  readJson,
  resolveRoot,
  toPosix,
} from "./shared.mjs";

const USAGE = `usage: importers.mjs [repo-root] <file> [<file>...] [--typescript <path>]

For each file, lists its exports and who imports them, and gives each export a visibility:
  file-private      not exported (reported only for completeness)
  package-internal  exported, imported only from inside the same workspace package (or not imported
                    at all in an app package, one with no package.json entry points)
  package-public    reachable from the package's package.json exports/main/types/module,
                    re-exported by an entry file, or imported from another workspace package
  unknown           exported from a library package and no importer was found; treat as package-public

Imports are resolved with the TypeScript compiler using the nearest tsconfig (paths, baseUrl, exports,
workspace symlinks), with a plain relative/workspace-name fallback when dependencies are not installed.`;

const args = parseArgs(process.argv.slice(2), { flags: ["help"], options: ["typescript"] });
if (args.help || args._.length === 0) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(args.help ? 0 : 2);
}
const first = path.resolve(args._[0]);
const rootGiven = args._.length > 1 && existsSync(first) && !path.extname(first);
const root = resolveRoot(rootGiven ? args._[0] : ".");
let realRoot = root;
try {
  realRoot = realpathSync.native(root);
} catch {
  // keep root
}
const targets = (rootGiven ? args._.slice(1) : args._).map((file) => toPosix(path.relative(root, path.resolve(root, file))));
const ts = loadTypescript(root, args.typescript);
const overlay = loadOverlay(root);
const files = listFiles(root, overlay.ignore).filter(isSourceFile);
const fileSet = new Set(files);
const packages = discoverPackages(root, listFiles(root, overlay.ignore));
const byName = new Map(packages.filter((pkg) => !pkg.root).map((pkg) => [pkg.name, pkg]));

const EXTENSIONS = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];

/** The nearest tsconfig's compiler options for a file, parsed once per tsconfig, with a resolution cache. */
const configCache = new Map();
function compilerConfigFor(file) {
  const configFile = ts.findConfigFile(path.dirname(path.join(root, file)), ts.sys.fileExists, "tsconfig.json");
  if (!configFile) return undefined;
  if (!configCache.has(configFile)) {
    const parsed = ts.getParsedCommandLineOfConfigFile(configFile, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
    const options = parsed?.options ?? {};
    configCache.set(configFile, { options, cache: ts.createModuleResolutionCache(path.dirname(configFile), (name) => name, options) });
  }
  return configCache.get(configFile);
}

/**
 * Resolves a specifier the way the compiler does (paths, baseUrl, package exports, workspace symlinks) and
 * maps the result to a measured source file in this repo: a built `.d.ts` inside a workspace package is
 * mapped back to its source. Returns undefined for third-party modules or when resolution fails.
 */
function resolveWithTypescript(specifier, fromFile) {
  const config = compilerConfigFor(fromFile);
  if (!config) return undefined;
  const resolved = ts.resolveModuleName(specifier, path.join(root, fromFile), config.options, ts.sys, config.cache).resolvedModule;
  if (!resolved) return undefined;
  let real = resolved.resolvedFileName;
  try {
    real = realpathSync.native(real);
  } catch {
    // keep the resolved path
  }
  // Compare real paths on both sides: realpath expands Windows 8.3 names (KEVANV~1) and pnpm symlinks.
  const rel = toPosix(path.relative(realRoot, real));
  if (rel.startsWith("..") || path.isAbsolute(rel) || /(?:^|\/)node_modules\//u.test(rel)) return undefined;
  if (fileSet.has(rel)) return rel;
  const pkg = packageFor(rel, packages);
  if (pkg.root) return undefined;
  return toSource(pkg, rel.slice(pkg.path.length + 1));
}

/** Resolves a specifier to a source file in this repo, or undefined for third-party modules. */
function resolveSpecifier(specifier, fromFile) {
  const viaCompiler = resolveWithTypescript(specifier, fromFile);
  if (viaCompiler) return viaCompiler;
  if (specifier.startsWith(".")) return resolvePath(path.posix.join(path.posix.dirname(fromFile), specifier));
  const match = [...byName.keys()]
    .filter((name) => specifier === name || specifier.startsWith(`${name}/`))
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return undefined;
  const pkg = byName.get(match);
  const subpath = specifier === match ? "." : `./${specifier.slice(match.length + 1)}`;
  return entryForSubpath(pkg, subpath);
}

function resolvePath(candidate) {
  const base = candidate.replace(/\.(?:[cm]?js|jsx)$/u, "");
  const options = [candidate, ...EXTENSIONS.map((ext) => `${base}${ext}`), ...EXTENSIONS.map((ext) => `${base}/index${ext}`)];
  return options.map((option) => path.posix.normalize(option)).find((option) => fileSet.has(option));
}

/** package.json targets usually point at build output; map dist/x.js back to src/x.ts. */
function toSource(pkg, target) {
  const rel = target.replace(/^\.\//u, "");
  const candidates = [rel, rel.replace(/^(?:dist|build|lib|out)\//u, "src/"), rel.replace(/^(?:dist|build|lib|out)\//u, "")];
  for (const candidate of candidates) {
    const resolved = resolvePath(path.posix.join(pkg.path, candidate.replace(/\.d\.ts$/u, ".ts")));
    if (resolved) return resolved;
  }
  return undefined;
}

function exportTargets(value) {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(exportTargets);
  return [];
}

function packageEntries(pkg) {
  const manifest = readJson(path.join(root, pkg.path, "package.json")) ?? {};
  const entries = new Map();
  const add = (subpath, target) => {
    const source = toSource(pkg, target);
    if (source) entries.set(source, subpath);
  };
  if (manifest.exports !== undefined) {
    const exportsField = typeof manifest.exports === "string" || Array.isArray(manifest.exports) ? { ".": manifest.exports } : manifest.exports;
    const conditional = Object.keys(exportsField).every((key) => !key.startsWith("."));
    for (const [subpath, value] of Object.entries(conditional ? { ".": exportsField } : exportsField)) {
      if (subpath.includes("*")) continue;
      for (const target of exportTargets(value)) add(subpath, target);
    }
  }
  for (const field of ["main", "module", "types", "typings", "source"]) {
    if (typeof manifest[field] === "string") add(".", manifest[field]);
  }
  return entries;
}

const entryCache = new Map();
function entriesOf(pkg) {
  if (!entryCache.has(pkg.path)) entryCache.set(pkg.path, packageEntries(pkg));
  return entryCache.get(pkg.path);
}
function entryForSubpath(pkg, subpath) {
  for (const [file, entrySubpath] of entriesOf(pkg)) if (entrySubpath === subpath) return file;
  return resolvePath(path.posix.join(pkg.path, subpath === "." ? "src/index" : path.posix.join("src", subpath)));
}

/** One pass over every source file: imports and re-exports with the names they use. */
const edges = [];
for (const file of files) {
  let source;
  try {
    source = parseSource(ts, root, file);
  } catch {
    continue;
  }
  const record = (specifier, names, kind) => {
    const target = resolveSpecifier(specifier, file);
    if (target) edges.push({ from: file, to: target, names, kind });
  };
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause;
      const names = [];
      if (clause?.name) names.push("default");
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) names.push("*");
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) names.push((element.propertyName ?? element.name).text);
      }
      record(node.moduleSpecifier.text, names.length ? names : ["*"], "import");
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const names =
        node.exportClause && ts.isNamedExports(node.exportClause)
          ? node.exportClause.elements.map((element) => ({ local: (element.propertyName ?? element.name).text, as: element.name.text }))
          : "*";
      record(node.moduleSpecifier.text, names, "re-export");
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      record(node.arguments[0].text, ["*"], "dynamic-import");
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

function exportsOf(file) {
  const source = parseSource(ts, root, file);
  const names = [];
  const modifiers = (node) => (ts.canHaveModifiers?.(node) ? (ts.getModifiers(node) ?? []) : []);
  for (const statement of source.statements) {
    const mods = modifiers(statement);
    const exported = mods.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = mods.some((mod) => mod.kind === ts.SyntaxKind.DefaultKeyword);
    if (ts.isExportAssignment(statement)) names.push("default");
    else if (exported && isDefault) names.push("default");
    else if (exported && ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.push(declaration.name.text);
      }
    } else if (exported && statement.name && ts.isIdentifier(statement.name)) names.push(statement.name.text);
    else if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) names.push(element.name.text);
    }
  }
  return [...new Set(names)];
}

/**
 * Follows re-export chains (named, renamed, `export *`, intermediate barrels). Returns every file that
 * re-exposes `name` from `file`, with the name it is exposed under there.
 */
function reExposures(file, name, seen = new Set()) {
  const key = `${file}\0${name}`;
  if (seen.has(key)) return [];
  seen.add(key);
  const found = [];
  for (const edge of edges) {
    if (edge.kind !== "re-export" || edge.to !== file) continue;
    const aliases =
      edge.names === "*" ? (name === "default" ? [] : [name]) : edge.names.filter((element) => element.local === name).map((element) => element.as);
    for (const alias of aliases) {
      found.push({ file: edge.from, as: alias }, ...reExposures(edge.from, alias, seen));
    }
  }
  return found;
}

const results = [];
const skipped = [];
for (const target of targets) {
  if (!fileSet.has(target)) {
    skipped.push({ file: target, reason: "not a measured source file (missing, generated, declaration or ignored)" });
    continue;
  }
  const pkg = packageFor(target, packages);
  const entrySet = new Set(entriesOf(pkg).keys());
  const names = exportsOf(target);
  const exportsReport = names.map((name) => {
    // The file itself plus every barrel that re-exposes the name, each with the name used there.
    const exposures = [{ file: target, as: name }, ...reExposures(target, name)];
    const viaEntries = [...new Set(exposures.filter((exposure) => entrySet.has(exposure.file)).map((exposure) => exposure.file))];
    const all = [];
    for (const exposure of exposures) {
      for (const edge of edges) {
        if (edge.kind === "re-export" || edge.to !== exposure.file) continue;
        if (!edge.names.includes(exposure.as) && !edge.names.includes("*")) continue;
        all.push({
          file: edge.from,
          package: packageFor(edge.from, packages).path,
          kind: exposure.file === target ? edge.kind : `${edge.kind} via ${exposure.file}`,
        });
      }
    }
    const otherPackages = [...new Set(all.map((entry) => entry.package).filter((dir) => dir !== pkg.path))];
    const isRootPackage = pkg.root === true;
    let visibility = "package-internal";
    const reasons = [];
    if (viaEntries.length > 0 && !isRootPackage) {
      visibility = "package-public";
      reasons.push(`exposed by package entry ${viaEntries.join(", ")}`);
    }
    if (otherPackages.length > 0) {
      visibility = "package-public";
      reasons.push(`imported from ${otherPackages.join(", ")}`);
    }
    if (reasons.length === 0) {
      if (all.length > 0) reasons.push("imported only inside the package");
      else if (entrySet.size === 0 || isRootPackage) reasons.push("no importers found; app package without package entries");
      else {
        // A library export nothing imports is either dead or reached in a way the static graph cannot see.
        visibility = "unknown";
        reasons.push("no importers found in a library package: treat as package-public");
      }
    }
    return { name, visibility, reasons, importers: all.slice(0, 50), importerCount: all.length };
  });
  results.push({
    file: target,
    package: pkg.path,
    packageName: pkg.name,
    packageEntries: [...entrySet],
    isPackageEntry: entrySet.has(target),
    exports: exportsReport,
    summary: {
      "package-public": exportsReport.filter((entry) => entry.visibility === "package-public").length,
      "package-internal": exportsReport.filter((entry) => entry.visibility === "package-internal").length,
      unknown: exportsReport.filter((entry) => entry.visibility === "unknown").length,
    },
  });
}

printJson({
  tool: "importers",
  version: SKILL_VERSION,
  note: "Static import graph resolved with the compiler (tsconfig paths, package exports, workspace links). Dynamic imports with computed specifiers and runtime registries are not seen, so 'unknown' means unproven, not unused: never delete code on that basis.",
  results,
  skipped,
});
if (results.length === 0) fail("none of the given files are measured source files");
