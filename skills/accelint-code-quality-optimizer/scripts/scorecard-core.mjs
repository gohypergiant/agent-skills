import path from "node:path";
import {
  SKILL_VERSION,
  countLines,
  discoverPackages,
  isSourceFile,
  isStoryFile,
  isTestFile,
  isToolConfig,
  listFiles,
  loadOverlay,
  loadTypescript,
  packageFor,
  parseSource,
  readJson,
  toPosix,
} from "./shared.mjs";

export const DEFAULT_THRESHOLDS = Object.freeze({ fileLinesWarn: 500, fileLinesMax: 1000 });

/** Metrics the ratchet enforces: a higher number is always worse. */
export const RATCHETED = Object.freeze([
  "explicitAny",
  "typeAssertions",
  "doubleAssertions",
  "nonNullAssertions",
  "tsSuppressions",
  "lintSuppressions",
  "enums",
  "consoleCalls",
  "nestedComponents",
  "looseAssertions",
  "filesOverWarn",
  "filesOverMax",
]);

/** Metrics reported for context only. Code size and effect counts are not good or bad on their own. */
export const INFORMATIONAL = Object.freeze([
  "sourceFiles",
  "testFiles",
  "sourceLines",
  "testLines",
  "effects",
  "maxFileLines",
]);

const LOOSE_MATCHERS = new Set(["toBeTruthy", "toBeFalsy", "toBeDefined"]);
const CONSOLE_METHODS = new Set(["log", "debug", "info", "warn", "error", "trace"]);
const EFFECT_HOOKS = new Set(["useEffect", "useLayoutEffect"]);
const PASCAL = /^[A-Z][A-Za-z0-9]*$/u;
const HOOK = /^use[A-Z0-9]/u;

function emptyMetrics() {
  return Object.fromEntries([...RATCHETED, ...INFORMATIONAL].map((key) => [key, 0]));
}

function calleeName(ts, expression) {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  return undefined;
}

function functionName(ts, node) {
  if ((ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.name) return node.name.text;
  if ((ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && ts.isVariableDeclaration(node.parent)) {
    return ts.isIdentifier(node.parent.name) ? node.parent.name.text : undefined;
  }
  if (
    (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) &&
    ts.isCallExpression(node.parent) &&
    ts.isVariableDeclaration(node.parent.parent) &&
    ts.isIdentifier(node.parent.parent.name)
  ) {
    // memo(() => ...), forwardRef(...) and similar wrappers
    return node.parent.parent.name.text;
  }
  return undefined;
}

/** True when `name` is used as a JSX tag (`<Name ...>`) somewhere inside `scope`. */
function usedAsJsxTag(ts, scope, name) {
  let found = false;
  const visit = (child) => {
    if (found) return;
    const tag = ts.isJsxOpeningElement(child) || ts.isJsxSelfClosingElement(child) ? child.tagName : undefined;
    if (tag && ts.isIdentifier(tag) && tag.text === name) {
      found = true;
      return;
    }
    ts.forEachChild(child, visit);
  };
  visit(scope);
  return found;
}

function containsJsx(ts, node) {
  let found = false;
  const visit = (child) => {
    if (found) return;
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) {
      found = true;
      return;
    }
    ts.forEachChild(child, visit);
  };
  ts.forEachChild(node, visit);
  return found;
}

function countComments(ts, source, text, metrics, location) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    source.languageVariant,
    text,
  );
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (token !== ts.SyntaxKind.SingleLineCommentTrivia && token !== ts.SyntaxKind.MultiLineCommentTrivia) continue;
    const comment = scanner.getTokenText();
    if (/@ts-(?:ignore|expect-error|nocheck)\b/u.test(comment)) {
      metrics.tsSuppressions += 1;
      location("tsSuppressions", scanner.getTokenPos());
    }
    if (/\b(?:eslint|oxlint)-disable/u.test(comment)) {
      metrics.lintSuppressions += 1;
      location("lintSuppressions", scanner.getTokenPos());
    }
  }
}

/** Counts AST-level metrics for one file. Comment scanning can miss comments inside JSX text, which is rare. */
export function analyseFile(ts, root, file) {
  const source = parseSource(ts, root, file);
  const text = source.getFullText();
  const test = isTestFile(file) || isStoryFile(file);
  const metrics = emptyMetrics();
  const samples = {};
  const location = (metric, pos) => {
    samples[metric] ??= [];
    if (samples[metric].length < 5) samples[metric].push(source.getLineAndCharacterOfPosition(pos).line + 1);
  };
  const lines = countLines(text);

  // Enclosing component or hook function nodes; a nested PascalCase function counts only when the
  // enclosing component renders it as <Name />, because only then does React remount it each render.
  const components = [];
  const visit = (node) => {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      metrics.explicitAny += 1;
      location("explicitAny", node.getStart(source));
    } else if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
      const isConst = ts.isTypeReferenceNode(node.type) && node.type.typeName.getText(source) === "const";
      // `x as unknown as T` is one cast: count it on the outer node only.
      const isInnerOfDouble =
        (ts.isAsExpression(node.parent) || ts.isTypeAssertionExpression(node.parent)) && node.parent.expression === node;
      if (!isConst && !isInnerOfDouble) {
        metrics.typeAssertions += 1;
        location("typeAssertions", node.getStart(source));
        const inner = node.expression;
        if (
          (ts.isAsExpression(inner) || ts.isTypeAssertionExpression(inner)) &&
          (inner.type.kind === ts.SyntaxKind.UnknownKeyword || inner.type.kind === ts.SyntaxKind.AnyKeyword)
        ) {
          metrics.doubleAssertions += 1;
          location("doubleAssertions", node.getStart(source));
        }
      }
    } else if (ts.isNonNullExpression(node)) {
      metrics.nonNullAssertions += 1;
      location("nonNullAssertions", node.getStart(source));
    } else if (ts.isEnumDeclaration(node)) {
      metrics.enums += 1;
      location("enums", node.getStart(source));
    } else if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const name = calleeName(ts, callee);
      if (
        !test &&
        ts.isPropertyAccessExpression(callee) &&
        ts.isIdentifier(callee.expression) &&
        callee.expression.text === "console" &&
        CONSOLE_METHODS.has(callee.name.text)
      ) {
        metrics.consoleCalls += 1;
        location("consoleCalls", node.getStart(source));
      }
      if (name && EFFECT_HOOKS.has(name)) metrics.effects += 1;
      if (test && name && ts.isPropertyAccessExpression(callee)) {
        if (LOOSE_MATCHERS.has(name) || (name === "toHaveBeenCalled" && node.arguments.length === 0)) {
          metrics.looseAssertions += 1;
          location("looseAssertions", node.getStart(source));
        }
      }
    }

    const isFunction =
      ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node);
    const name = isFunction ? functionName(ts, node) : undefined;
    const isComponent = name !== undefined && (PASCAL.test(name) || HOOK.test(name));
    if (
      !test &&
      isComponent &&
      PASCAL.test(name) &&
      components.length > 0 &&
      containsJsx(ts, node) &&
      usedAsJsxTag(ts, components.at(-1), name)
    ) {
      metrics.nestedComponents += 1;
      location("nestedComponents", node.getStart(source));
    }
    if (isComponent) components.push(node);
    ts.forEachChild(node, visit);
    if (isComponent) components.pop();
  };
  visit(source);
  countComments(ts, source, text, metrics, location);

  if (test) {
    metrics.testFiles = 1;
    metrics.testLines = lines;
  } else {
    metrics.sourceFiles = 1;
    metrics.sourceLines = lines;
  }
  return { file, test, lines, metrics, samples };
}

/** Reads oxlint (`--format=json`) or ESLint (`--format json`) output and counts diagnostics by rule and file. */
export function readLintReport(root, file) {
  const raw = readJson(path.resolve(file));
  if (raw === undefined) throw new Error(`cannot read lint report ${file}`);
  const entries = [];
  if (Array.isArray(raw?.diagnostics)) {
    for (const diagnostic of raw.diagnostics) {
      entries.push({ rule: diagnostic.code ?? "unknown", file: diagnostic.filename });
    }
  } else if (Array.isArray(raw)) {
    for (const result of raw) {
      for (const message of result.messages ?? []) {
        entries.push({ rule: message.ruleId ?? "parse-error", file: result.filePath });
      }
    }
  } else {
    throw new Error(`${file} is neither oxlint nor ESLint JSON output`);
  }
  return entries.map((entry) => ({
    rule: entry.rule,
    file: toPosix(path.isAbsolute(entry.file ?? "") ? path.relative(root, entry.file) : (entry.file ?? "")),
  }));
}

export function buildScorecard(root, { scope, lintReport, typescript } = {}) {
  const overlay = loadOverlay(root);
  const thresholds = {
    fileLinesWarn: overlay.thresholds.fileLinesWarn ?? DEFAULT_THRESHOLDS.fileLinesWarn,
    fileLinesMax: overlay.thresholds.fileLinesMax ?? DEFAULT_THRESHOLDS.fileLinesMax,
  };
  const allFiles = listFiles(root, overlay.ignore);
  const packages = discoverPackages(root, allFiles);
  const scopePrefix = scope ? toPosix(path.normalize(scope)).replace(/\/$/u, "") : undefined;
  const inScope = (file) => !scopePrefix || scopePrefix === "." || file === scopePrefix || file.startsWith(`${scopePrefix}/`);
  const files = allFiles.filter((file) => isSourceFile(file) && !isToolConfig(file) && inScope(file));
  const ts = loadTypescript(root, typescript);

  const byPackage = new Map();
  const largest = [];
  const parseErrors = [];
  for (const file of files) {
    let result;
    try {
      result = analyseFile(ts, root, file);
    } catch (error) {
      parseErrors.push({ file, error: String(error?.message ?? error) });
      continue;
    }
    const pkg = packageFor(file, packages);
    const entry = byPackage.get(pkg.path) ?? { name: pkg.name, metrics: emptyMetrics(), samples: {} };
    for (const [key, value] of Object.entries(result.metrics)) entry.metrics[key] += value;
    if (!result.test) {
      entry.metrics.maxFileLines = Math.max(entry.metrics.maxFileLines, result.lines);
      if (result.lines > thresholds.fileLinesWarn) entry.metrics.filesOverWarn += 1;
      if (result.lines > thresholds.fileLinesMax) entry.metrics.filesOverMax += 1;
      largest.push({ file, lines: result.lines, package: pkg.path });
    }
    for (const [metric, linesAt] of Object.entries(result.samples)) {
      entry.samples[metric] ??= [];
      for (const at of linesAt) {
        if (entry.samples[metric].length < 5) entry.samples[metric].push(`${file}:${at}`);
      }
    }
    byPackage.set(pkg.path, entry);
  }
  // A root entry with no files of its own is noise in a monorepo.
  if (byPackage.get(".")?.metrics.sourceFiles === 0 && byPackage.get(".")?.metrics.testFiles === 0) byPackage.delete(".");

  let lint = null;
  if (lintReport) {
    const entries = readLintReport(root, lintReport).filter((entry) => inScope(entry.file));
    lint = { source: toPosix(lintReport), byRule: {} };
    for (const entry of entries) {
      const pkg = packageFor(entry.file, packages);
      const target = byPackage.get(pkg.path) ?? { name: pkg.name, metrics: emptyMetrics(), samples: {} };
      target.lint ??= {};
      target.lint[entry.rule] = (target.lint[entry.rule] ?? 0) + 1;
      byPackage.set(pkg.path, target);
      lint.byRule[entry.rule] = (lint.byRule[entry.rule] ?? 0) + 1;
    }
  }

  const sortedPackages = Object.fromEntries(
    [...byPackage.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dir, entry]) => [
        dir,
        {
          name: entry.name,
          metrics: entry.metrics,
          testRatio: entry.metrics.sourceFiles === 0 ? null : round(entry.metrics.testFiles / entry.metrics.sourceFiles),
          ...(entry.lint ? { lint: sortObject(entry.lint) } : {}),
          samples: entry.samples,
        },
      ]),
  );
  const totals = emptyMetrics();
  for (const entry of Object.values(sortedPackages)) {
    for (const [key, value] of Object.entries(entry.metrics)) {
      totals[key] = key === "maxFileLines" ? Math.max(totals[key], value) : totals[key] + value;
    }
  }

  return {
    tool: "scorecard",
    version: SKILL_VERSION,
    scope: scopePrefix ?? ".",
    typescript: ts.version,
    thresholds,
    ratcheted: RATCHETED,
    packages: sortedPackages,
    totals,
    lint: lint ? { ...lint, byRule: sortObject(lint.byRule) } : null,
    largestFiles: largest.sort((a, b) => b.lines - a.lines || a.file.localeCompare(b.file)).slice(0, 20),
    parseErrors,
  };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
}
