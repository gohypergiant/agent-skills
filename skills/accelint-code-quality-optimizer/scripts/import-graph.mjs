// Static import graph of a repo's TypeScript/JavaScript sources, resolved with the compiler.
import { realpathSync } from "node:fs";
import path from "node:path";
import { discoverPackages, expandBraces, globToRegExp, isGeneratedFile, isSourceFile, listFiles, loadOverlay, loadTypescript, packageFor, parseSource, readJson, toPosix } from "./shared.mjs";

const EXTENSIONS = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];

/**
 * Builds the graph once: every import, re-export and literal dynamic import between measured source files,
 * resolved with the nearest tsconfig (paths, baseUrl, package exports, workspace symlinks), with a plain
 * relative/workspace-name fallback when dependencies are not installed.
 */
export function createImportGraph(root, { typescript } = {}) {
  let realRoot = root;
  try {
    realRoot = realpathSync.native(root);
  } catch {
    // keep root
  }
  const ts = loadTypescript(root, typescript);
  const overlay = loadOverlay(root);
  const allFiles = listFiles(root, overlay.ignore);
  const files = allFiles.filter(isSourceFile);
  const fileSet = new Set(files);
  // Generated sources are not measured, but what they import is in use (codegen registries, route trees).
  const generatedSources = allFiles.filter((file) => isGeneratedFile(file) && /\.(?:[cm]?[jt]sx?)$/u.test(file) && !/\.d\.[cm]?ts$/u.test(file));
  const packages = discoverPackages(root, allFiles);
  const byName = new Map(packages.filter((pkg) => !pkg.root).map((pkg) => [pkg.name, pkg]));

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

  const edges = [];
  const parseFailures = [];
  // import(expr) / require(expr) with a computed specifier: the static graph cannot follow them.
  const computedImports = [];
  for (const file of [...files, ...generatedSources]) {
    let source;
    try {
      source = parseSource(ts, root, file);
    } catch (error) {
      parseFailures.push({ file, error: String(error?.message ?? error) });
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
        (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require")) &&
        node.arguments[0]
      ) {
        if (ts.isStringLiteralLike(node.arguments[0])) record(node.arguments[0].text, ["*"], "dynamic-import");
        else computedImports.push({ file, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 });
      } else if (ts.isCallExpression(node) && isImportMetaGlob(node.expression)) {
        // Vite import.meta.glob: every file the literal patterns match is imported.
        const arg = node.arguments[0];
        const patterns = arg && ts.isArrayLiteralExpression(arg) ? arg.elements : arg ? [arg] : [];
        for (const pattern of patterns) {
          if (!ts.isStringLiteralLike(pattern) || pattern.text.startsWith("!")) continue;
          const pkgDir = packageFor(file, packages).path;
          const base = pattern.text.startsWith("/") ? (pkgDir === "." ? "" : pkgDir) : path.posix.dirname(file);
          const regexes = expandBraces(path.posix.normalize(path.posix.join(base, pattern.text)).replace(/^\/+/u, "")).map(globToRegExp);
          for (const target of files) {
            if (target !== file && regexes.some((regex) => regex.test(target))) edges.push({ from: file, to: target, names: ["*"], kind: "glob-import" });
          }
        }
      } else if (
        ts.isNewExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "URL" &&
        node.arguments?.[0] &&
        ts.isStringLiteralLike(node.arguments[0]) &&
        node.arguments[0].text.startsWith(".") &&
        node.arguments[1]?.getText(source) === "import.meta.url"
      ) {
        // new Worker(new URL("./worker.ts", import.meta.url))
        record(node.arguments[0].text, ["*"], "url-import");
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  function isImportMetaGlob(expression) {
    return ts.isPropertyAccessExpression(expression) && expression.name.text === "glob" && ts.isMetaProperty(expression.expression);
  }

  const edgesTo = new Map();
  for (const edge of edges) {
    if (!edgesTo.has(edge.to)) edgesTo.set(edge.to, []);
    edgesTo.get(edge.to).push(edge);
  }

  function exportsOf(file) {
    const source = parseSource(ts, root, file);
    const found = [];
    const modifiers = (node) => (ts.canHaveModifiers?.(node) ? (ts.getModifiers(node) ?? []) : []);
    const add = (name, node, kind = "value") => found.push({ name, kind, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 });
    const kindOf = (statement) => (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement) ? "type" : "value");
    for (const statement of source.statements) {
      const mods = modifiers(statement);
      const exported = mods.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
      const isDefault = mods.some((mod) => mod.kind === ts.SyntaxKind.DefaultKeyword);
      if (ts.isExportAssignment(statement)) add("default", statement);
      else if (exported && isDefault) add("default", statement);
      else if (exported && ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) add(declaration.name.text, declaration);
        }
      } else if (exported && statement.name && ts.isIdentifier(statement.name)) add(statement.name.text, statement, kindOf(statement));
      else if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) add(element.name.text, element, element.isTypeOnly || statement.isTypeOnly ? "type" : "value");
      }
    }
    const seen = new Set();
    return found.filter((entry) => !seen.has(entry.name) && seen.add(entry.name));
  }

  /** Every file that re-exposes `name` from `file` (named, renamed, `export *`, chained barrels), with the name used there. */
  function reExposures(file, name, seen = new Set()) {
    const key = `${file}\0${name}`;
    if (seen.has(key)) return [];
    seen.add(key);
    const found = [];
    for (const edge of edgesTo.get(file) ?? []) {
      if (edge.kind !== "re-export") continue;
      const aliases =
        edge.names === "*" ? (name === "default" ? [] : [name]) : edge.names.filter((element) => element.local === name).map((element) => element.as);
      for (const alias of aliases) found.push({ file: edge.from, as: alias }, ...reExposures(edge.from, alias, seen));
    }
    return found;
  }

  /** Who uses `name` from `file`, directly or through any barrel that re-exposes it. Re-exports themselves are not uses. */
  function importersOf(file, name) {
    const exposures = [{ file, as: name }, ...reExposures(file, name)];
    const all = [];
    for (const exposure of exposures) {
      for (const edge of edgesTo.get(exposure.file) ?? []) {
        if (edge.kind === "re-export") continue;
        if (!edge.names.includes(exposure.as) && !edge.names.includes("*")) continue;
        all.push({
          file: edge.from,
          package: packageFor(edge.from, packages).path,
          kind: exposure.file === file ? edge.kind : `${edge.kind} via ${exposure.file}`,
        });
      }
    }
    return { exposures, importers: all };
  }

  return { ts, root, overlay, allFiles, files, fileSet, generatedSources, packages, edges, edgesTo, computedImports, parseFailures, entriesOf, exportsOf, reExposures, importersOf };
}
