#!/usr/bin/env node
// Snapshots what consumers of an entry module can see, per export, from emitted .d.ts text, and compares two snapshots.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SKILL_VERSION, fail, loadTypescript, parseArgs, printJson, resolveRoot, toPosix } from "./shared.mjs";

const USAGE = `usage: export-diff.mjs snapshot [repo-root] --entry <file> [--entry <file>...] [--tsconfig <file>]
                                   [--typescript <path>] --out <snapshot.json>
       export-diff.mjs compare <before.json> <after.json>

snapshot emits declarations (.d.ts) for each entry and for every local module it re-exports from or takes
types from. For each export of each entry it records the export's declaration text plus every local or
imported declaration that text references. Moving a declaration to another file and re-exporting it,
reordering declarations, formatting, comments and function bodies do not change the snapshot; a type,
member, parameter or enum value does.
compare exits 1 when any export of any entry was added, removed or changed.
snapshot exits 3 (status "incomplete") when imports did not resolve: their types become any, so the
snapshot cannot prove anything about them. Install and build the repo's workspace, then snapshot again.`;

const FORMAT = "exports-v2";

const argv = process.argv.slice(2);
const mode = argv[0];
if (!["snapshot", "compare"].includes(mode) || argv.includes("--help")) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(argv.includes("--help") ? 0 : 2);
}

if (mode === "compare") {
  const [beforeFile, afterFile] = argv.slice(1);
  if (!beforeFile || !afterFile) fail("compare needs <before.json> <after.json>");
  const read = (file) => JSON.parse(readFileSync(file, "utf8"));
  const before = read(beforeFile);
  const after = read(afterFile);
  if (before.format !== FORMAT || after.format !== FORMAT) fail("snapshots were made by another export-diff version; snapshot both again");
  const changes = [];
  const entries = new Set([...Object.keys(before.entries), ...Object.keys(after.entries)]);
  for (const entry of [...entries].sort()) {
    const was = before.entries[entry] ?? {};
    const now = after.entries[entry] ?? {};
    for (const name of [...new Set([...Object.keys(was), ...Object.keys(now)])].sort()) {
      if (!(name in now)) changes.push({ entry, name, change: "removed", before: was[name] });
      else if (!(name in was)) changes.push({ entry, name, change: "added", after: now[name] });
      else if (was[name] !== now[name]) changes.push({ entry, name, change: "changed", ...lineDiff(was[name], now[name]) });
    }
  }
  printJson({ tool: "export-diff", mode, status: changes.length === 0 ? "unchanged" : "changed", changes });
  process.exit(changes.length === 0 ? 0 : 1);
}

function lineDiff(a, b) {
  const left = a.split("\n");
  const right = b.split("\n");
  const removed = left.filter((line) => !right.includes(line));
  const added = right.filter((line) => !left.includes(line));
  return { removed: removed.slice(0, 40), added: added.slice(0, 40) };
}

const entries = [];
const rest = [];
for (let index = 1; index < argv.length; index += 1) {
  if (argv[index] === "--entry") {
    entries.push(argv[index + 1]);
    index += 1;
  } else if (argv[index].startsWith("--entry=")) {
    entries.push(argv[index].slice("--entry=".length));
  } else {
    rest.push(argv[index]);
  }
}
const args = parseArgs(rest, { options: ["tsconfig", "typescript", "out"] });
if (entries.length === 0) fail("--entry is required");
if (!args.out) fail("--out is required");

const root = resolveRoot(args._[0]);
const ts = loadTypescript(root, args.typescript);
const entryPaths = entries.map((entry) => path.resolve(root, entry));

let options = { allowJs: true, jsx: ts.JsxEmit.Preserve, skipLibCheck: true };
let projectReferences;
// The program is rooted at the entries plus the tsconfig's ambient declaration files (`next-env.d.ts`,
// module shims): TypeScript loads what the entries import, and nothing else needs checking. Rooting it at
// every source file of the tsconfig made one snapshot take minutes on a large package.
let rootNames = [...entryPaths];
const tsconfig = args.tsconfig
  ? path.resolve(root, args.tsconfig)
  : ts.findConfigFile(path.dirname(entryPaths[0]), ts.sys.fileExists, "tsconfig.json");
if (tsconfig) {
  const parsed = ts.getParsedCommandLineOfConfigFile(tsconfig, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
  if (parsed) {
    options = parsed.options;
    projectReferences = parsed.projectReferences;
    rootNames = [...new Set([...entryPaths, ...parsed.fileNames.filter((file) => /\.d\.[cm]?ts$/u.test(file))])];
  }
}
// Declarations only, in memory. Comments are stripped so doc edits are not API changes.
options = {
  ...options,
  declaration: true,
  emitDeclarationOnly: true,
  noEmit: false,
  removeComments: true,
  declarationMap: false,
  sourceMap: false,
  composite: false,
  incremental: false,
  noEmitOnError: false,
  isolatedDeclarations: false,
};

const program = ts.createProgram({ rootNames, options, projectReferences });
const isLocal = (file) => !file.includes("/node_modules/") && !file.endsWith(".d.ts") && toPosix(path.resolve(file)).startsWith(toPosix(root));
const rel = (file) => toPosix(path.relative(root, file));

function emitDeclaration(sourceFile) {
  let text = "";
  const result = program.emit(sourceFile, (name, data) => {
    if (/\.d\.[cm]?ts$/u.test(name)) text = data;
  }, undefined, true);
  if (result.emitSkipped) throw new Error(`declaration emit skipped for ${sourceFile.fileName}`);
  return text;
}

/** `{ file }` for a local source module, `{ external: true }` for a third-party or built module, `undefined` when nothing resolves. */
function resolveModule(specifier, fromFile) {
  const resolved = ts.resolveModuleName(specifier, fromFile, options, ts.sys).resolvedModule;
  if (!resolved) return undefined;
  const file = resolved.resolvedFileName;
  return program.getSourceFile(file) && isLocal(file) ? { file: toPosix(path.resolve(file)) } : { external: true };
}

/** Declaration text with the modifiers that depend on where it lives removed, so a move does not count. */
function declarationText(node, dts) {
  return node
    .getText(dts)
    .replace(/\r\n/gu, "\n")
    .replace(/^(?:export\s+)?(?:default\s+)?(?:declare\s+)?/u, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function bindingNames(name) {
  if (ts.isIdentifier(name)) return [name.text];
  return name.elements.flatMap((element) => (ts.isOmittedExpression(element) ? [] : bindingNames(element.name)));
}

/**
 * Reads one emitted .d.ts into: top-level declarations by name, what it exports, what it imports and
 * from where, and what it re-exports. Module specifiers are resolved to local source files when possible.
 */
function readDeclaration(text, fromFile) {
  const dts = ts.createSourceFile("x.d.ts", text, ts.ScriptTarget.Latest, true);
  const record = {
    file: fromFile,
    decls: new Map(), // local name -> [{ text, node }]
    exportedNames: new Set(), // names visible to importers, as exported
    localAlias: new Map(), // exported name -> local name (`export { a as b }`, `export default a`)
    imports: new Map(), // local binding -> { module, name } (name "*" for a namespace import)
    reExports: [], // { module, names: [{ local, as }] | "*" }
    links: new Set(),
    unresolved: [],
    dts,
  };
  const hasModifier = (node, kind) => (ts.canHaveModifiers(node) ? (ts.getModifiers(node) ?? []) : []).some((m) => m.kind === kind);
  const addDecl = (name, node) => {
    const list = record.decls.get(name) ?? [];
    list.push({ text: declarationText(node, dts), node });
    record.decls.set(name, list);
  };
  for (const statement of dts.statements) {
    if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
      const resolved = resolveModule(statement.moduleSpecifier.text, fromFile);
      if (!resolved) record.unresolved.push(statement.moduleSpecifier.text);
      // Third-party and built modules are not followed: their API belongs to another package or version.
      if (!resolved?.file) continue;
      const module = resolved.file;
      record.links.add(module);
      const clause = statement.importClause;
      if (clause?.name) record.imports.set(clause.name.text, { module, name: "default" });
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
        record.imports.set(clause.namedBindings.name.text, { module, name: "*" });
      }
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          record.imports.set(element.name.text, { module, name: (element.propertyName ?? element.name).text });
        }
      }
    } else if (ts.isExportDeclaration(statement)) {
      if (statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const resolved = resolveModule(statement.moduleSpecifier.text, fromFile);
        if (!resolved) record.unresolved.push(statement.moduleSpecifier.text);
        if (!resolved?.file) continue;
        const module = resolved.file;
        record.links.add(module);
        const names =
          statement.exportClause && ts.isNamedExports(statement.exportClause)
            ? statement.exportClause.elements.map((element) => ({ local: (element.propertyName ?? element.name).text, as: element.name.text }))
            : "*";
        record.reExports.push({ module, names });
      } else if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          record.exportedNames.add(element.name.text);
          record.localAlias.set(element.name.text, (element.propertyName ?? element.name).text);
        }
      }
    } else if (ts.isExportAssignment(statement)) {
      const name = statement.isExportEquals ? "export=" : "default";
      record.exportedNames.add(name);
      if (ts.isIdentifier(statement.expression)) record.localAlias.set(name, statement.expression.text);
      else addDecl(name, statement);
    } else if (ts.isVariableStatement(statement)) {
      const exported = hasModifier(statement, ts.SyntaxKind.ExportKeyword);
      for (const declaration of statement.declarationList.declarations) {
        for (const name of bindingNames(declaration.name)) {
          addDecl(name, declaration);
          if (exported) record.exportedNames.add(name);
        }
      }
    } else if (
      ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isEnumDeclaration(statement) ||
      ts.isModuleDeclaration(statement)
    ) {
      const isDefault = hasModifier(statement, ts.SyntaxKind.DefaultKeyword);
      const name = statement.name ? statement.name.getText(dts) : "default";
      addDecl(name, statement);
      if (hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
        record.exportedNames.add(isDefault ? "default" : name);
        if (isDefault && name !== "default") record.localAlias.set("default", name);
      }
    }
  }
  // `import("./y").X` inside types links modules the emitter did not import explicitly.
  const visit = (node) => {
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      const resolved = resolveModule(node.argument.literal.text, fromFile);
      if (resolved?.file) record.links.add(resolved.file);
      else if (!resolved) record.unresolved.push(node.argument.literal.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(dts);
  return record;
}

const records = new Map(); // absolute posix path -> record
const errors = [];
const queue = entryPaths.map((entry) => toPosix(path.resolve(entry)));
while (queue.length > 0) {
  const file = queue.shift();
  if (records.has(file)) continue;
  const sourceFile = program.getSourceFile(file);
  if (!sourceFile) {
    errors.push(`cannot load ${rel(file)}`);
    records.set(file, undefined);
    continue;
  }
  let text;
  try {
    text = emitDeclaration(sourceFile);
  } catch (error) {
    errors.push(error.message);
    records.set(file, undefined);
    continue;
  }
  const record = readDeclaration(text, sourceFile.fileName);
  records.set(file, record);
  queue.push(...record.links);
}
if (errors.length > 0 && [...records.values()].every((record) => record === undefined)) fail(errors.join("; "));

// Unresolved imports in the exposed modules make the checker fall back to `any`, which hides type changes.
const UNRESOLVED_CODES = new Set([2307, 2875, 7016]);
const unresolved = new Set();
for (const [file, record] of records) {
  if (!record) continue;
  for (const name of record.unresolved) unresolved.add(name);
  const sourceFile = program.getSourceFile(file);
  for (const diagnostic of program.getSemanticDiagnostics(sourceFile)) {
    if (!UNRESOLVED_CODES.has(diagnostic.code)) continue;
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
    const name = /['"]([^'"]+)['"]/u.exec(message)?.[1];
    if (name) unresolved.add(name);
  }
}

/** Names a module exposes to importers, following `export *` chains. */
function exportedNamesOf(file, seen = new Set()) {
  if (seen.has(file)) return new Set();
  seen.add(file);
  const record = records.get(file);
  if (!record) return new Set();
  const names = new Set(record.exportedNames);
  for (const reExport of record.reExports) {
    if (reExport.names === "*") {
      for (const name of exportedNamesOf(reExport.module, seen)) if (name !== "default") names.add(name);
    } else {
      for (const { as } of reExport.names) names.add(as);
    }
  }
  return names;
}

const PROPERTY_PARENTS = [
  ts.isPropertySignature,
  ts.isPropertyDeclaration,
  ts.isMethodSignature,
  ts.isMethodDeclaration,
  ts.isParameter,
  ts.isEnumMember,
  ts.isPropertyAccessExpression,
  ts.isPropertyAssignment,
  ts.isGetAccessor,
  ts.isSetAccessor,
];

/** Identifiers in a declaration that name another top-level declaration or an import of the same module. */
function referencesOf(record, node) {
  const found = [];
  const visit = (child) => {
    if (ts.isIdentifier(child)) {
      const parent = child.parent;
      const isProperty = PROPERTY_PARENTS.some((test) => test(parent) && parent.name === child);
      const isRightOfQualified = ts.isQualifiedName(parent) && parent.right === child;
      const isOwnName = parent === node && parent.name === child;
      if (!isProperty && !isRightOfQualified && !isOwnName) {
        const name = child.text;
        if (record.imports.has(name)) {
          const target = record.imports.get(name);
          if (target.name === "*") {
            const member = ts.isQualifiedName(parent) && parent.left === child ? parent.right.getText(record.dts) : undefined;
            if (member) found.push({ module: target.module, name: member });
          } else {
            found.push({ module: target.module, name: target.name });
          }
        } else if (record.decls.has(name)) {
          found.push({ local: name });
        }
      }
    }
    if (ts.isImportTypeNode(child) && ts.isLiteralTypeNode(child.argument) && ts.isStringLiteral(child.argument.literal) && child.qualifier) {
      const resolved = resolveModule(child.argument.literal.text, record.file);
      let qualifier = child.qualifier;
      while (ts.isQualifiedName(qualifier)) qualifier = qualifier.left;
      if (resolved?.file) found.push({ module: resolved.file, name: qualifier.text });
    }
    ts.forEachChild(child, visit);
  };
  ts.forEachChild(node, visit);
  return found;
}

/**
 * Everything a consumer sees through `name` of `file`: the declaration text, and transitively the text of
 * each declaration it references, wherever those live. The file is deliberately left out of the text.
 */
function describe(file, name, seen = new Set()) {
  const key = `${file}\0${name}`;
  if (seen.has(key)) return [];
  seen.add(key);
  const record = records.get(file);
  if (!record) return [`<unresolved module ${rel(file)}>`];
  const local = record.localAlias.get(name) ?? name;
  if (record.decls.has(local)) {
    const out = [];
    for (const { text, node } of record.decls.get(local)) {
      out.push(`${name === local ? name : `${name} = ${local}`}: ${text}`);
      for (const reference of referencesOf(record, node)) {
        out.push(...(reference.local ? describe(file, reference.local, seen) : describe(reference.module, reference.name, seen)));
      }
    }
    return out;
  }
  for (const reExport of record.reExports) {
    if (reExport.names === "*") {
      if (name !== "default" && exportedNamesOf(reExport.module).has(name)) return describe(reExport.module, name, seen);
    } else {
      const match = reExport.names.find((entry) => entry.as === name);
      if (match) return describe(reExport.module, match.local, seen);
    }
  }
  return [`<unresolved ${name}>`];
}

const snapshot = {
  tool: "export-diff",
  mode,
  format: FORMAT,
  version: SKILL_VERSION,
  typescript: ts.version,
  entries: {},
  modules: [...records.keys()].filter((file) => records.get(file)).map(rel).sort(),
  unresolvedImports: [...unresolved].sort(),
  errors,
};
for (const entry of entryPaths) {
  const file = toPosix(path.resolve(entry));
  const names = [...exportedNamesOf(file)].sort();
  snapshot.entries[rel(file)] = Object.fromEntries(
    names.map((name) => {
      const [own, ...references] = describe(file, name);
      return [name, [own, ...[...new Set(references)].sort()].join("\n")];
    }),
  );
}
writeFileSync(args.out, `${JSON.stringify(snapshot, null, 2)}\n`);
if (unresolved.size > 0) {
  process.stderr.write(
    `warning: ${unresolved.size} imports did not resolve (${[...unresolved].slice(0, 5).join(", ")}${unresolved.size > 5 ? ", ..." : ""}). ` +
      "Their types become any, so changes involving them are invisible. Install and build the workspace, then snapshot again.\n",
  );
}
printJson({
  tool: "export-diff",
  mode,
  out: args.out,
  status: unresolved.size > 0 ? "incomplete" : "complete",
  entries: Object.fromEntries(Object.entries(snapshot.entries).map(([entry, exports]) => [entry, Object.keys(exports).length])),
  modules: snapshot.modules,
  unresolvedImports: snapshot.unresolvedImports,
  errors,
});
process.exit(unresolved.size > 0 ? 3 : 0);
