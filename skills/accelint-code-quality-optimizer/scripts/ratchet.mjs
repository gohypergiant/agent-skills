#!/usr/bin/env node
// Compares a scorecard against a committed baseline. Fails only when a ratcheted number gets worse.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { SKILL_VERSION, fail, info, parseArgs, printJson } from "./shared.mjs";

const USAGE = `usage: ratchet.mjs check  --baseline <file> --current <scorecard.json> [--report-only]
       ratchet.mjs update --baseline <file> --current <scorecard.json> [--allow-regressions]

check   exits 1 when any ratcheted metric or lint count rose (0 with --report-only).
update  rewrites the baseline from the current scorecard. Refuses when anything regressed.`;

const args = parseArgs(process.argv.slice(2), {
  flags: ["help", "report-only", "allow-regressions"],
  options: ["baseline", "current"],
});
const mode = args._[0];
if (args.help || !["check", "update"].includes(mode)) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(args.help ? 0 : 2);
}
if (!args.baseline || !args.current) fail("--baseline and --current are required");

const readScorecard = (file) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(`cannot read ${file}: ${error.message}`);
  }
  return undefined;
};

/** The baseline keeps only what the ratchet compares, so its diffs stay small and reviewable. */
function toBaseline(scorecard) {
  const packages = {};
  for (const [dir, entry] of Object.entries(scorecard.packages ?? {})) {
    packages[dir] = {
      metrics: Object.fromEntries(scorecard.ratcheted.map((key) => [key, entry.metrics?.[key] ?? 0])),
      ...(entry.lint ? { lint: entry.lint } : {}),
    };
  }
  return {
    tool: "ratchet-baseline",
    version: SKILL_VERSION,
    scope: scorecard.scope,
    thresholds: scorecard.thresholds,
    ratcheted: scorecard.ratcheted,
    lintTracked: scorecard.lint !== null,
    packages,
  };
}

/**
 * New packages have no history, so they cannot regress: they are reported with their counts and join the
 * ratchet at the next `update`. Removed packages are reported too, so a rename is visible.
 */
function compare(baseline, current) {
  const regressions = [];
  const improvements = [];
  const newPackages = [];
  // A metric the current run did not measure (report not passed) is skipped, not read as dropping to zero.
  const metrics = (baseline.ratcheted ?? current.ratcheted).filter((metric) => current.ratcheted.includes(metric));
  const compareLint = !(baseline.lintTracked && current.lint === null);
  for (const [dir, entry] of Object.entries(current.packages ?? {})) {
    const before = baseline.packages?.[dir];
    if (before === undefined) {
      const counts = Object.fromEntries(metrics.map((metric) => [metric, entry.metrics?.[metric] ?? 0]).filter(([, value]) => value > 0));
      newPackages.push({ package: dir, counts, ...(compareLint && entry.lint ? { lint: entry.lint } : {}) });
      continue;
    }
    for (const metric of metrics) {
      const was = before.metrics?.[metric] ?? 0;
      const now = entry.metrics?.[metric] ?? 0;
      const change = { package: dir, metric, baseline: was, current: now };
      if (now > was) regressions.push(change);
      else if (now < was) improvements.push(change);
    }
    if (!compareLint) continue;
    const rules = new Set([...Object.keys(before.lint ?? {}), ...Object.keys(entry.lint ?? {})]);
    for (const rule of rules) {
      const was = before.lint?.[rule] ?? 0;
      const now = entry.lint?.[rule] ?? 0;
      const change = { package: dir, metric: `lint:${rule}`, baseline: was, current: now };
      if (now > was) regressions.push(change);
      else if (now < was) improvements.push(change);
    }
  }
  const removedPackages = Object.keys(baseline.packages ?? {}).filter((dir) => !(dir in (current.packages ?? {})));
  return { regressions, improvements, newPackages, removedPackages };
}

const current = readScorecard(args.current);
if (current.tool !== "scorecard") fail(`${args.current} is not scorecard output`);
const warnings = [];

if (!existsSync(args.baseline)) {
  if (mode === "check") {
    info(`No baseline at ${args.baseline}. Create one with: ratchet.mjs update --baseline ${args.baseline} --current ${args.current}`);
    printJson({ tool: "ratchet", mode, status: "no-baseline", regressions: [], improvements: [] });
    process.exit(args["report-only"] ? 0 : 1);
  }
  writeFileSync(args.baseline, `${JSON.stringify(toBaseline(current), null, 2)}\n`);
  info(`Created baseline ${args.baseline}.`);
  printJson({ tool: "ratchet", mode, status: "created", regressions: [], improvements: [] });
  process.exit(0);
}

const baseline = readScorecard(args.baseline);
if (baseline.scope !== current.scope) warnings.push(`Baseline scope "${baseline.scope}" differs from current scope "${current.scope}".`);
if (JSON.stringify(baseline.thresholds) !== JSON.stringify(current.thresholds)) {
  warnings.push("File-size thresholds changed since the baseline; file counts are not comparable until the baseline is updated.");
}
const unmeasured = (baseline.ratcheted ?? []).filter((metric) => !current.ratcheted.includes(metric));
if (unmeasured.length > 0) {
  warnings.push(`The baseline tracks ${unmeasured.join(", ")} but the current scorecard does not (pass the same --unused-report/--duplicates-report); not compared.`);
}
if (baseline.lintTracked && current.lint === null) warnings.push("The baseline tracks lint counts but no --lint-report was given; lint was not compared.");

const { regressions, improvements, newPackages, removedPackages } = compare(baseline, current);
for (const change of regressions) info(`worse  ${change.package}  ${change.metric}: ${change.baseline} -> ${change.current}`);
for (const change of improvements) info(`better ${change.package}  ${change.metric}: ${change.baseline} -> ${change.current}`);
for (const entry of newPackages) {
  info(`new    ${entry.package}  ${JSON.stringify(entry.counts)} (not in the baseline; run update to start ratcheting it)`);
}
for (const dir of removedPackages) info(`gone   ${dir} (in the baseline, not in the current scorecard)`);
for (const warning of warnings) info(`warning: ${warning}`);
const report = { regressions, improvements, newPackages, removedPackages, warnings };

if (mode === "update") {
  if (regressions.length > 0 && !args["allow-regressions"]) {
    info("Refusing to update: some numbers got worse. Fix them, or pass --allow-regressions after the team agrees.");
    printJson({ tool: "ratchet", mode, status: "refused", ...report });
    process.exit(1);
  }
  writeFileSync(args.baseline, `${JSON.stringify(toBaseline(current), null, 2)}\n`);
  printJson({ tool: "ratchet", mode, status: "updated", ...report });
  process.exit(0);
}

const status = regressions.length > 0 ? "regressed" : "ok";
printJson({ tool: "ratchet", mode, status, ...report });
process.exit(status === "regressed" && !args["report-only"] ? 1 : 0);
