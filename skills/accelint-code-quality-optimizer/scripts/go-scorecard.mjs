#!/usr/bin/env node
// Per-package quality metrics for Go modules, from go vet, staticcheck, gofmt and the skill's ast-grep rules,
// in the same shape as scorecard.mjs so ratchet.mjs can compare it against a baseline.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SKILL_VERSION,
  countLines,
  discoverPackages,
  fail,
  info,
  isGoFile,
  listFiles,
  loadOverlay,
  parseArgs,
  printJson,
  readJson,
  resolveRoot,
  toPosix,
} from "./shared.mjs";

const USAGE = `usage: go-scorecard.mjs [repo-root] [--scope <dir>] [--golangci-report <file>] [--out <file>] [--no-tools]

Counts, per Go package directory: file sizes, go vet and staticcheck findings (by analyzer and check),
unformatted files (gofmt -l), and the skill's ast-grep rules (rules/go). --golangci-report reads
golangci-lint JSON output (run it yourself with the repo's own config) and counts issues by linter.
--no-tools skips every external tool and reports file metrics only. Missing tools are reported in
"warnings", never invented.`;

const args = parseArgs(process.argv.slice(2), { flags: ["help", "no-tools"], options: ["scope", "golangci-report", "out"] });
if (args.help) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(0);
}

const DEFAULT_THRESHOLDS = Object.freeze({ fileLinesWarn: 500, fileLinesMax: 1000 });

/** Metrics the ratchet enforces: a higher number is always worse. */
export const GO_RATCHETED = Object.freeze([
  "vetFindings",
  "staticcheckFindings",
  "unformattedFiles",
  "deferInLoop",
  "ignoredErrors",
  "errorfWithV",
  "emptyInterfaces",
  "contextTodo",
  "printCalls",
  "panicCalls",
  "lintSuppressions",
  "sleepInTests",
  "filesOverWarn",
  "filesOverMax",
]);

/** Reported for context only. */
export const GO_INFORMATIONAL = Object.freeze(["sourceFiles", "testFiles", "sourceLines", "testLines", "maxFileLines", "bareGoroutines"]);

/** ast-grep rule id -> metric, and which files the rule applies to. */
const RULE_METRICS = {
  "go-defer-in-loop": { metric: "deferInLoop", files: "all" },
  "go-ignored-error": { metric: "ignoredErrors", files: "all" },
  "go-errorf-wrap-v": { metric: "errorfWithV", files: "all" },
  "go-empty-interface": { metric: "emptyInterfaces", files: "all" },
  "go-context-todo": { metric: "contextTodo", files: "all" },
  "go-print-call": { metric: "printCalls", files: "source" },
  "go-panic-call": { metric: "panicCalls", files: "source" },
  "go-nolint": { metric: "lintSuppressions", files: "all" },
  "go-sleep-in-test": { metric: "sleepInTests", files: "test" },
  "go-bare-goroutine": { metric: "bareGoroutines", files: "source" },
};

const GENERATED_HEADER = /^\/\/ Code generated .* DO NOT EDIT\.$/mu;
const RULES_CONFIG = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "rules", "sgconfig.yml");

const root = resolveRoot(args._[0]);
const overlay = loadOverlay(root);
const thresholds = {
  fileLinesWarn: overlay.thresholds.fileLinesWarn ?? DEFAULT_THRESHOLDS.fileLinesWarn,
  fileLinesMax: overlay.thresholds.fileLinesMax ?? DEFAULT_THRESHOLDS.fileLinesMax,
};
const scope = args.scope ? toPosix(path.normalize(args.scope)).replace(/\/$/u, "") : ".";
const inScope = (file) => scope === "." || file === scope || file.startsWith(`${scope}/`);
const allFiles = listFiles(root, overlay.ignore);
const modules = discoverPackages(root, allFiles).filter((pkg) => pkg.go);
const warnings = [];

/** The module that owns a file is the deepest module directory containing it. */
function moduleFor(file) {
  let best;
  for (const module of modules) {
    const dir = module.path;
    if (dir === "." || file.startsWith(`${dir}/`)) {
      if (!best || best.path === "." || dir.length > best.path.length) best = module;
    }
  }
  return best;
}

// Go packages are directories. Generated files are left out entirely, as are files outside the scope.
const goFiles = new Map(); // rel file -> { test, lines, package }
const packages = new Map(); // package dir -> entry
const emptyMetrics = () => Object.fromEntries([...GO_RATCHETED, ...GO_INFORMATIONAL].map((key) => [key, 0]));
const largest = [];
for (const file of allFiles) {
  if (!isGoFile(file) || !inScope(file)) continue;
  const module = moduleFor(file);
  if (!module) continue;
  const text = readFileSync(path.join(root, file), "utf8");
  if (GENERATED_HEADER.test(text.split("\n", 10).join("\n"))) continue;
  const dir = path.posix.dirname(file);
  const test = file.endsWith("_test.go");
  const lines = countLines(text);
  goFiles.set(file, { test, lines, package: dir });
  const entry = packages.get(dir) ?? { name: dir, module: module.path, metrics: emptyMetrics(), samples: {} };
  if (test) {
    entry.metrics.testFiles += 1;
    entry.metrics.testLines += lines;
  } else {
    entry.metrics.sourceFiles += 1;
    entry.metrics.sourceLines += lines;
    entry.metrics.maxFileLines = Math.max(entry.metrics.maxFileLines, lines);
    if (lines > thresholds.fileLinesWarn) entry.metrics.filesOverWarn += 1;
    if (lines > thresholds.fileLinesMax) entry.metrics.filesOverMax += 1;
    largest.push({ file, lines, package: dir });
  }
  packages.set(dir, entry);
}
if (packages.size === 0) fail(`no Go files found under ${scope === "." ? root : scope}`);

const sample = (entry, metric, file, line) => {
  entry.samples[metric] ??= [];
  if (entry.samples[metric].length < 5) entry.samples[metric].push(`${file}:${line}`);
};
const count = (file, metric, line, rule) => {
  const known = goFiles.get(file);
  if (!known) return false; // generated, ignored or out of scope
  const entry = packages.get(known.package);
  entry.metrics[metric] += 1;
  sample(entry, metric, file, line);
  if (rule) {
    entry.lint ??= {};
    entry.lint[rule] = (entry.lint[rule] ?? 0) + 1;
  }
  return true;
};
const relOf = (file, cwd) => toPosix(path.relative(root, path.isAbsolute(file) ? file : path.join(cwd, file)));

function run(command, commandArgs, cwd) {
  return spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 256 * 1024 * 1024,
  });
}
const available = (command, probe) => {
  const result = run(command, probe, root);
  return result.error === undefined && result.status === 0;
};

/** `go vet -json` and `go list -json` print one pretty-printed JSON object per package, concatenated. */
export function parseJsonStream(text) {
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (char === "\\") index += 1;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        objects.push(JSON.parse(text.slice(start, index + 1)));
        start = -1;
      }
    }
  }
  return objects;
}

const tools = { go: false, staticcheck: false, gofmt: false, astGrep: false };
const lintSources = [];
if (!args["no-tools"]) {
  tools.go = available("go", ["version"]);
  tools.gofmt = available("gofmt", ["-h"]) || available("gofmt", ["-l", "/dev/null"]);
  tools.staticcheck = available("staticcheck", ["-version"]);
  tools.astGrep = (() => {
    const result = run("ast-grep", ["--version"], root);
    return result.error === undefined && /ast-grep/u.test(`${result.stdout}${result.stderr}`);
  })();
  if (!tools.go) warnings.push("go is not on PATH: vet findings were not counted.");
  if (!tools.gofmt) warnings.push("gofmt is not on PATH: unformatted files were not counted.");
  if (!tools.staticcheck) warnings.push("staticcheck is not on PATH: install honnef.co/go/tools/cmd/staticcheck to count its findings.");
  if (!tools.astGrep) warnings.push("ast-grep is not on PATH: rule-based metrics (deferInLoop, ignoredErrors, ...) were not counted.");

  const scopedModules = modules.filter((module) => [...packages.values()].some((entry) => entry.module === module.path));
  for (const module of scopedModules) {
    const cwd = path.join(root, module.path);
    if (tools.go) {
      const vet = run("go", ["vet", "-json", "./..."], cwd);
      if (vet.stdout.trim() === "" && /cannot find|no Go files|go: /u.test(vet.stderr)) {
        warnings.push(`go vet failed in ${module.path}: ${vet.stderr.trim().split("\n")[0]}`);
      }
      for (const object of parseJsonStream(vet.stdout)) {
        for (const analyzers of Object.values(object)) {
          for (const [analyzer, findings] of Object.entries(analyzers)) {
            for (const finding of findings) {
              const [file, line] = (finding.posn ?? "").split(":");
              if (file) count(relOf(file, cwd), "vetFindings", Number(line), `vet:${analyzer}`);
            }
          }
        }
      }
      lintSources.push("go vet");
    }
    if (tools.staticcheck) {
      const sc = run("staticcheck", ["-f", "json", "./..."], cwd);
      for (const line of sc.stdout.split("\n")) {
        if (!line.trim().startsWith("{")) continue;
        try {
          const finding = JSON.parse(line);
          const file = finding.location?.file;
          if (file) count(relOf(file, cwd), "staticcheckFindings", finding.location.line, `staticcheck:${finding.code}`);
        } catch {
          // not a finding line
        }
      }
      if (sc.stdout.trim() === "" && sc.status !== 0 && sc.stderr.trim()) {
        warnings.push(`staticcheck failed in ${module.path}: ${sc.stderr.trim().split("\n")[0]}`);
      }
      lintSources.push("staticcheck");
    }
    if (tools.gofmt) {
      const fmt = run("gofmt", ["-l", "."], cwd);
      for (const line of fmt.stdout.split("\n")) {
        if (line.trim()) count(relOf(line.trim(), cwd), "unformattedFiles", 1);
      }
    }
  }
  if (tools.astGrep && scopedModules.length > 0) {
    const targets = scopedModules.map((module) => (module.path === "." ? "." : module.path));
    const scan = run("ast-grep", ["scan", "-c", RULES_CONFIG, "--json=compact", ...targets], root);
    let matches = [];
    try {
      matches = JSON.parse(scan.stdout || "[]");
    } catch {
      warnings.push(`ast-grep scan output could not be parsed: ${scan.stderr.trim().split("\n")[0]}`);
    }
    for (const match of matches) {
      const rule = RULE_METRICS[match.ruleId];
      if (!rule) continue;
      const file = toPosix(path.normalize(match.file));
      const known = goFiles.get(file);
      if (!known) continue;
      if (rule.files === "source" && known.test) continue;
      if (rule.files === "test" && !known.test) continue;
      count(file, rule.metric, (match.range?.start?.line ?? 0) + 1);
    }
  }
}

if (args["golangci-report"]) {
  const report = readJson(path.resolve(args["golangci-report"]));
  if (!report || !Array.isArray(report.Issues)) fail(`${args["golangci-report"]} is not golangci-lint JSON output`);
  for (const issue of report.Issues) {
    const filename = issue.Pos?.Filename;
    if (!filename) continue;
    const candidates = [relOf(filename, root), ...modules.map((module) => relOf(filename, path.join(root, module.path)))];
    const file = candidates.find((candidate) => goFiles.has(candidate));
    if (!file) continue;
    const entry = packages.get(goFiles.get(file).package);
    entry.lint ??= {};
    entry.lint[`golangci:${issue.FromLinter}`] = (entry.lint[`golangci:${issue.FromLinter}`] ?? 0) + 1;
  }
  lintSources.push(`golangci-lint (${toPosix(args["golangci-report"])})`);
}

const sortObject = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
const sortedPackages = Object.fromEntries(
  [...packages.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dir, entry]) => [
      dir,
      {
        name: entry.name,
        module: entry.module,
        metrics: entry.metrics,
        testRatio: entry.metrics.sourceFiles === 0 ? null : Math.round((entry.metrics.testFiles / entry.metrics.sourceFiles) * 100) / 100,
        ...(entry.lint ? { lint: sortObject(entry.lint) } : {}),
        samples: entry.samples,
      },
    ]),
);
const totals = emptyMetrics();
const byRule = {};
for (const entry of Object.values(sortedPackages)) {
  for (const [key, value] of Object.entries(entry.metrics)) {
    totals[key] = key === "maxFileLines" ? Math.max(totals[key], value) : totals[key] + value;
  }
  for (const [rule, value] of Object.entries(entry.lint ?? {})) byRule[rule] = (byRule[rule] ?? 0) + value;
}
for (const warning of warnings) info(`warning: ${warning}`);

const scorecard = {
  tool: "scorecard",
  stack: "go",
  version: SKILL_VERSION,
  scope,
  thresholds,
  ratcheted: GO_RATCHETED,
  tools,
  packages: sortedPackages,
  totals,
  lint: lintSources.length > 0 ? { source: lintSources.join(", "), byRule: sortObject(byRule) } : null,
  largestFiles: largest.sort((a, b) => b.lines - a.lines || a.file.localeCompare(b.file)).slice(0, 20),
  warnings,
};
if (args.out) writeFileSync(args.out, `${JSON.stringify(scorecard, null, 2)}\n`);
printJson(scorecard);
