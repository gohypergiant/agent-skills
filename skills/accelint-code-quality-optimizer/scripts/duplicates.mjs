#!/usr/bin/env node
// Finds copy-pasted code: token sequences that repeat across or within files, identifiers and literals normalized.
import { writeFileSync } from "node:fs";
import path from "node:path";
import {
  SKILL_VERSION,
  discoverPackages,
  fail,
  isSourceFile,
  isStoryFile,
  isTestFile,
  isToolConfig,
  listFiles,
  loadOverlay,
  loadTypescript,
  packageFor,
  parseArgs,
  parseSource,
  printJson,
  resolveRoot,
  toPosix,
} from "./shared.mjs";

const USAGE = `usage: duplicates.mjs [repo-root] [--scope <dir>] [--min-tokens <n>] [--exact] [--include-tests]
                     [--typescript <path>] [--out <file>]

Reports clones: runs of at least --min-tokens tokens (default 60) that occur more than once.
By default identifiers and literals are normalized, so a copy with renamed variables still matches;
--exact keeps them. Imports and re-exports are skipped. Tests and stories are skipped unless
--include-tests. A clone is a candidate for consolidation, not a finding by itself (references/removal.md).`;

const args = parseArgs(process.argv.slice(2), {
  flags: ["help", "exact", "include-tests"],
  options: ["scope", "min-tokens", "typescript", "out"],
});
if (args.help) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(0);
}
const root = resolveRoot(args._[0]);
const minTokens = Number(args["min-tokens"] ?? 60);
if (!Number.isInteger(minTokens) || minTokens < 10) fail("--min-tokens must be an integer of at least 10");
const overlay = loadOverlay(root);
const allFiles = listFiles(root, overlay.ignore);
const packages = discoverPackages(root, allFiles);
const scope = args.scope ? toPosix(path.normalize(args.scope)).replace(/\/$/u, "") : ".";
const inScope = (file) => scope === "." || file === scope || file.startsWith(`${scope}/`);
const files = allFiles.filter(
  (file) => isSourceFile(file) && !isToolConfig(file) && inScope(file) && (args["include-tests"] || (!isTestFile(file) && !isStoryFile(file))),
);
const ts = loadTypescript(root, args.typescript);

const tokenIds = new Map();
const idFor = (text) => {
  if (!tokenIds.has(text)) tokenIds.set(text, tokenIds.size + 1);
  return tokenIds.get(text);
};

/** Tokens of one file with their lines, skipping trivia, imports and re-exports. */
function tokenize(file) {
  const source = parseSource(ts, root, file);
  const skip = [];
  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) || ts.isImportEqualsDeclaration(statement) || (ts.isExportDeclaration(statement) && statement.moduleSpecifier)) {
      skip.push([statement.getStart(source), statement.getEnd()]);
    }
  }
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, source.languageVariant, source.getFullText());
  const ids = [];
  const lines = [];
  let skipIndex = 0;
  for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
    const pos = scanner.getTokenStart?.() ?? scanner.getTokenPos();
    while (skipIndex < skip.length && pos >= skip[skipIndex][1]) skipIndex += 1;
    if (skipIndex < skip.length && pos >= skip[skipIndex][0]) continue;
    let text;
    if (!args.exact && kind === ts.SyntaxKind.Identifier) text = "$id";
    else if (
      !args.exact &&
      (kind === ts.SyntaxKind.StringLiteral ||
        kind === ts.SyntaxKind.NumericLiteral ||
        kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
        kind === ts.SyntaxKind.BigIntLiteral)
    ) {
      text = "$lit";
    } else {
      text = `${kind}:${scanner.getTokenText()}`;
    }
    ids.push(idFor(text));
    lines.push(source.getLineAndCharacterOfPosition(pos).line + 1);
  }
  return { ids, lines };
}

const BASE = 1000003;
let basePow = 1;
for (let index = 1; index < minTokens; index += 1) basePow = Math.imul(basePow, BASE) >>> 0;

const tokenized = [];
const parseErrors = [];
for (const file of files) {
  try {
    tokenized.push({ file, ...tokenize(file) });
  } catch (error) {
    parseErrors.push({ file, error: String(error?.message ?? error) });
  }
}

const sameRun = (a, i, b, j, length) => {
  for (let k = 0; k < length; k += 1) if (a.ids[i + k] !== b.ids[j + k]) return false;
  return true;
};

/**
 * Rolling hash over every window of minTokens tokens. The first occurrence of a window is remembered; a later
 * equal window starts a clone that is extended token by token, and scanning resumes after it.
 */
const seen = new Map();
const clones = [];
for (const current of tokenized) {
  const { ids } = current;
  if (ids.length < minTokens) continue;
  let hash = 0;
  for (let k = 0; k < minTokens; k += 1) hash = (Math.imul(hash, BASE) + ids[k]) >>> 0;
  let index = 0;
  while (index + minTokens <= ids.length) {
    const prior = seen.get(hash);
    let advance = 1;
    if (prior && sameRun(prior.doc, prior.index, current, index, minTokens) && !(prior.doc === current && prior.index + minTokens > index)) {
      let length = minTokens;
      while (
        index + length < ids.length &&
        prior.index + length < prior.doc.ids.length &&
        prior.doc.ids[prior.index + length] === ids[index + length] &&
        !(prior.doc === current && prior.index + length >= index)
      ) {
        length += 1;
      }
      clones.push({ a: prior, b: { doc: current, index }, length });
      advance = length;
    } else if (!prior) {
      seen.set(hash, { doc: current, index });
    }
    for (let step = 0; step < advance && index + minTokens <= ids.length; step += 1) {
      const outgoing = ids[index];
      const incoming = ids[index + minTokens];
      index += 1;
      if (incoming === undefined) break;
      hash = (Math.imul((hash - Math.imul(outgoing, basePow)) >>> 0, BASE) + incoming) >>> 0;
    }
  }
}

const span = ({ doc, index }, length) => ({ file: doc.file, startLine: doc.lines[index], endLine: doc.lines[index + length - 1] });
const report = clones
  .map(({ a, b, length }) => {
    const first = span(a, length);
    const second = span(b, length);
    const pkgA = packageFor(first.file, packages).path;
    const pkgB = packageFor(second.file, packages).path;
    return {
      tokens: length,
      lines: Math.max(first.endLine - first.startLine, second.endLine - second.startLine) + 1,
      where: pkgA === pkgB ? (first.file === second.file ? "same-file" : "same-package") : "cross-package",
      first: { ...first, package: pkgA },
      second: { ...second, package: pkgB },
    };
  })
  .sort((x, y) => y.tokens - x.tokens);

// Duplicated lines per package: lines covered by the second (later) copy of each clone, counted once.
const covered = new Map();
for (const clone of report) {
  const key = clone.second.file;
  if (!covered.has(key)) covered.set(key, new Set());
  for (let line = clone.second.startLine; line <= clone.second.endLine; line += 1) covered.get(key).add(line);
}
const byPackage = {};
for (const [file, lines] of covered) {
  const pkg = packageFor(file, packages).path;
  const entry = (byPackage[pkg] ??= { clones: 0, duplicatedLines: 0 });
  entry.duplicatedLines += lines.size;
}
for (const clone of report) {
  byPackage[clone.second.package] ??= { clones: 0, duplicatedLines: 0 };
  byPackage[clone.second.package].clones += 1;
}

const result = {
  tool: "duplicates",
  version: SKILL_VERSION,
  scope,
  minTokens,
  mode: args.exact ? "exact" : "renamed",
  includeTests: Boolean(args["include-tests"]),
  note: "Token clones, not semantic duplicates. Similar shape is not the same responsibility: consolidate only when both copies must change together (references/removal.md).",
  summary: {
    files: tokenized.length,
    clones: report.length,
    duplicatedLines: [...covered.values()].reduce((sum, lines) => sum + lines.size, 0),
    crossPackage: report.filter((clone) => clone.where === "cross-package").length,
  },
  byPackage: Object.fromEntries(Object.entries(byPackage).sort(([a], [b]) => a.localeCompare(b))),
  clones: report.slice(0, 200),
  parseErrors,
};
if (args.out) writeFileSync(args.out, `${JSON.stringify(result, null, 2)}\n`);
printJson(result);
