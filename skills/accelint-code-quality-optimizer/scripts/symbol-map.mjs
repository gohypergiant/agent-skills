#!/usr/bin/env node
// Lists a file's top-level symbols, their line spans, whether each is exported, and which other top-level symbols it uses.
import path from "node:path";
import { SKILL_VERSION, fail, loadTypescript, parseArgs, parseSource, printJson, resolveRoot, toPosix } from "./shared.mjs";

const USAGE = "usage: symbol-map.mjs [repo-root] <file> [--typescript <path>]";
const args = parseArgs(process.argv.slice(2), { flags: ["help"], options: ["typescript"] });
if (args.help || args._.length === 0) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(args.help ? 0 : 2);
}
const [rootArg, fileArg] = args._.length === 1 ? [".", args._[0]] : args._;
const root = resolveRoot(rootArg);
const file = toPosix(path.relative(root, path.resolve(root, fileArg)));
const ts = loadTypescript(root, args.typescript);
let source;
try {
  source = parseSource(ts, root, file);
} catch (error) {
  fail(`cannot parse ${file}: ${error.message}`);
}

const lineOf = (pos) => source.getLineAndCharacterOfPosition(pos).line + 1;
const hasModifier = (node, kind) => (ts.canHaveModifiers?.(node) ? (ts.getModifiers(node) ?? []) : []).some((m) => m.kind === kind);

const symbols = [];
const reExports = [];
const sideEffects = [];
for (const statement of source.statements) {
  const exported = hasModifier(statement, ts.SyntaxKind.ExportKeyword);
  const isDefault = hasModifier(statement, ts.SyntaxKind.DefaultKeyword);
  const span = { start: lineOf(statement.getStart(source)), end: lineOf(statement.end) };
  const push = (name, kind) => symbols.push({ name, kind, exported: exported || false, default: isDefault, ...span, lines: span.end - span.start + 1, node: statement });
  if (ts.isFunctionDeclaration(statement)) push(statement.name?.text ?? "default", "function");
  else if (ts.isClassDeclaration(statement)) push(statement.name?.text ?? "default", "class");
  else if (ts.isInterfaceDeclaration(statement)) push(statement.name.text, "interface");
  else if (ts.isTypeAliasDeclaration(statement)) push(statement.name.text, "type");
  else if (ts.isEnumDeclaration(statement)) push(statement.name.text, "enum");
  else if (ts.isModuleDeclaration(statement)) push(statement.name.getText(source), "namespace");
  else if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      for (const name of bindingNames(declaration.name)) push(name, "variable");
    }
  } else if (ts.isExportAssignment(statement)) {
    symbols.push({ name: "default", kind: "export-assignment", exported: true, default: true, ...span, lines: span.end - span.start + 1, node: statement });
  } else if (ts.isExportDeclaration(statement)) {
    reExports.push({ text: statement.getText(source).replace(/\s+/gu, " "), line: span.start });
  } else if (!ts.isImportDeclaration(statement) && !ts.isImportEqualsDeclaration(statement)) {
    sideEffects.push({ text: statement.getText(source).slice(0, 120).replace(/\s+/gu, " "), ...span });
  }
}

// `export { a, b as c }` without a module specifier marks local symbols as exported.
for (const statement of source.statements) {
  if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
    for (const element of statement.exportClause.elements) {
      const local = (element.propertyName ?? element.name).text;
      for (const symbol of symbols) if (symbol.name === local) symbol.exported = true;
    }
  }
}

function bindingNames(name) {
  if (ts.isIdentifier(name)) return [name.text];
  return name.elements.flatMap((element) => (ts.isOmittedExpression(element) ? [] : bindingNames(element.name)));
}

const names = new Set(symbols.map((symbol) => symbol.name));
for (const symbol of symbols) {
  const uses = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node) && names.has(node.text) && node.text !== symbol.name) {
      const parent = node.parent;
      const isPropertyName = (ts.isPropertyAccessExpression(parent) && parent.name === node) || (ts.isPropertyAssignment(parent) && parent.name === node);
      if (!isPropertyName) uses.add(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(symbol.node);
  symbol.uses = [...uses].sort();
}
for (const symbol of symbols) {
  symbol.usedBy = symbols.filter((other) => other.uses.includes(symbol.name)).map((other) => other.name).sort();
}

printJson({
  tool: "symbol-map",
  version: SKILL_VERSION,
  file,
  lines: lineOf(source.end),
  symbols: symbols.map(({ node: _node, ...rest }) => rest),
  reExports,
  moduleSideEffects: sideEffects,
});
