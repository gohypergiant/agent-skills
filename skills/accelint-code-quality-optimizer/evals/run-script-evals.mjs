#!/usr/bin/env node
// Runs every script against a temporary copy of the synthetic fixtures and checks planted problems exactly.
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.join(here, "..", "scripts");
const argv = process.argv.slice(2);
const tsIndex = argv.indexOf("--typescript");
const typescript = tsIndex === -1 ? process.env.CQO_TYPESCRIPT : argv[tsIndex + 1];
const env = { ...process.env, ...(typescript ? { CQO_TYPESCRIPT: path.resolve(typescript) } : {}) };
const work = mkdtempSync(path.join(tmpdir(), "cqo-evals-"));
// Never mutate the committed fixture: every test works on this copy.
const fixture = path.join(work, "ts-monorepo");
cpSync(path.join(here, "fixtures", "ts-monorepo"), fixture, { recursive: true });

let failures = 0;
let passes = 0;
let skips = 0;
const skip = (name, why) => {
  skips += 1;
  process.stdout.write(`skip  ${name}: ${why}\n`);
};
const toolOk = (command, probe) => {
  const result = spawnSync(command, probe, { encoding: "utf8", shell: process.platform === "win32" });
  return result.error === undefined && result.status === 0;
};
const check = (name, condition, detail = "") => {
  if (condition) {
    passes += 1;
    process.stdout.write(`ok    ${name}\n`);
  } else {
    failures += 1;
    process.stdout.write(`FAIL  ${name}${detail ? `: ${detail}` : ""}\n`);
  }
};

function run(script, args, { expectExit } = {}) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], { encoding: "utf8", env });
  if (expectExit !== undefined && result.status !== expectExit) {
    check(`${script} ${args[0] ?? ""} exits ${expectExit}`, false, `got ${result.status}: ${result.stderr.trim().slice(0, 300)}`);
  }
  let json;
  try {
    json = JSON.parse(result.stdout);
  } catch {
    json = undefined;
  }
  return { status: result.status, json, stderr: result.stderr };
}

const write = (rel, text) => writeFileSync(path.join(fixture, rel), text);
const read = (rel) => readFileSync(path.join(fixture, rel), "utf8");

try {
  // detect-stack
  const stack = run("detect-stack.mjs", [fixture], { expectExit: 0 }).json;
  check("detect-stack finds ts-react pack only", JSON.stringify(stack?.packs) === '["ts-react"]', JSON.stringify(stack?.packs));
  check("detect-stack finds both workspace packages", ["packages/alpha", "packages/beta"].every((dir) => stack?.packages.some((pkg) => pkg.path === dir)));
  check("detect-stack reads pnpm from packageManager", stack?.packageManager === "pnpm");
  check(
    "detect-stack maps lint, format-check, typecheck, test",
    ["lint", "format-check", "typecheck", "test"].every((role) => stack?.commands.some((command) => command.role === role)),
  );
  check("detect-stack reports astGrep as a boolean from --version, not from the sg name", typeof stack?.tools.astGrep === "boolean");

  // scorecard
  const scorecard = run("scorecard.mjs", [fixture, "--out", path.join(work, "scorecard.json")], { expectExit: 0 }).json;
  const expected = JSON.parse(readFileSync(path.join(here, "expected", "ts-monorepo-scorecard.json"), "utf8"));
  check("scorecard parses every file", scorecard?.parseErrors.length === 0);
  for (const [dir, metrics] of Object.entries(expected.packages)) {
    for (const [metric, value] of Object.entries(metrics)) {
      const actual = scorecard?.packages?.[dir]?.metrics?.[metric];
      check(`scorecard ${dir} ${metric} = ${value}`, actual === value, `got ${actual}`);
    }
  }
  const alphaSamples = scorecard?.packages?.["packages/alpha"]?.samples ?? {};
  check("scorecard measures a product file named config.ts", alphaSamples.explicitAny?.some((at) => at.startsWith("packages/alpha/src/config.ts")));
  check("scorecard excludes tool config files", !scorecard?.largestFiles.some((entry) => /vitest\.config/u.test(entry.file)));
  check("scorecard treats stories as non-product (no console or nested count)", !JSON.stringify(alphaSamples.consoleCalls ?? []).includes("stories"));
  check("scorecard ignores render helpers used as map(Row)", !(alphaSamples.nestedComponents ?? []).some((at) => at.includes("status-list")));

  // ratchet
  const baseline = path.join(work, "baseline.json");
  const current = path.join(work, "scorecard.json");
  check("ratchet check without baseline fails", run("ratchet.mjs", ["check", "--baseline", baseline, "--current", current]).status === 1);
  check("ratchet update creates baseline", run("ratchet.mjs", ["update", "--baseline", baseline, "--current", current]).json?.status === "created");
  check("ratchet check on unchanged scorecard passes", run("ratchet.mjs", ["check", "--baseline", baseline, "--current", current]).status === 0);
  const worse = JSON.parse(readFileSync(current, "utf8"));
  worse.packages["packages/alpha"].metrics.explicitAny += 2;
  worse.packages["packages/beta"].metrics.enums -= 1;
  const worseFile = path.join(work, "worse.json");
  writeFileSync(worseFile, JSON.stringify(worse));
  const regressed = run("ratchet.mjs", ["check", "--baseline", baseline, "--current", worseFile]);
  check("ratchet check flags a regression", regressed.status === 1 && regressed.json?.regressions.length === 1);
  check("ratchet check reports the improvement", regressed.json?.improvements.some((change) => change.metric === "enums"));
  check("ratchet --report-only exits 0 on regression", run("ratchet.mjs", ["check", "--baseline", baseline, "--current", worseFile, "--report-only"]).status === 0);
  check("ratchet update refuses a regression", run("ratchet.mjs", ["update", "--baseline", baseline, "--current", worseFile]).status === 1);
  const withNew = JSON.parse(readFileSync(current, "utf8"));
  withNew.packages["packages/gamma"] = { name: "@fixture/gamma", metrics: { ...withNew.packages["packages/beta"].metrics } };
  const newFile = path.join(work, "new-package.json");
  writeFileSync(newFile, JSON.stringify(withNew));
  const added = run("ratchet.mjs", ["check", "--baseline", baseline, "--current", newFile]);
  check("ratchet: a new package is reported, not a regression", added.status === 0 && added.json?.newPackages[0]?.package === "packages/gamma");

  // conventions
  const conventionsOut = run("conventions.mjs", [fixture], { expectExit: 0 }).json;
  const conventions = conventionsOut?.conventions ?? [];
  const byId = Object.fromEntries(conventions.map((entry) => [entry.id, entry]));
  check("conventions: file naming is a proposal (kebab-case)", byId["file-naming"]?.status === "proposal" && byId["file-naming"]?.dominant === "kebab-case");
  check("conventions: camelCase file is listed as deviating", byId["file-naming"]?.deviating.some((entry) => entry.where.endsWith("pickRecords.ts")));
  check("conventions: tsconfig strict is a conflict", byId["tsconfig:strict"]?.status === "conflict");
  check("conventions: strict resolved through extends", byId["tsconfig:strict"]?.observed.true === 1 && byId["tsconfig:strict"]?.observed.false === 1);
  check("conventions: vitest mock cleanup is a conflict", byId["vitest-mock-cleanup"]?.status === "conflict");
  check("conventions: enum majority contradicts guidance", byId["constant-sets"]?.majorityContradictsGuidance === true);
  check("conventions: every entry is labelled", conventions.every((entry) => ["uniform", "proposal", "conflict"].includes(entry.status)));
  check("conventions: story default export does not vote on module exports", conventionsOut?.excludedByFramework?.["module-exports"] >= 1);

  // importers
  const imported = run(
    "importers.mjs",
    [fixture, "packages/alpha/src/format-count.ts", "packages/beta/src/record-store.ts", "packages/beta/src/badge-for-record.ts", "packages/beta/src/orphan.ts"],
    { expectExit: 0 },
  ).json;
  const visibility = (file, name) => imported?.results.find((entry) => entry.file === file)?.exports.find((entry) => entry.name === name)?.visibility;
  check("importers: export re-exported by the package entry is package-public", visibility("packages/alpha/src/format-count.ts", "formatCount") === "package-public");
  check("importers: class exposed through index.ts is package-public", visibility("packages/beta/src/record-store.ts", "RecordStore") === "package-public");
  check("importers: export used only inside its package is package-internal", visibility("packages/beta/src/badge-for-record.ts", "badgeText") === "package-internal");
  check("importers: library export nothing imports is unknown, not package-internal", visibility("packages/beta/src/orphan.ts", "orphanHelper") === "unknown");
  const formatImporters = imported?.results.find((entry) => entry.file === "packages/alpha/src/format-count.ts")?.exports[0]?.importers ?? [];
  check("importers: cross-package import through the barrel is found", formatImporters.some((entry) => entry.package === "packages/beta"));
  check("importers: import through a tsconfig paths alias (@/format-count) is found", formatImporters.some((entry) => entry.file === "packages/alpha/src/status-list.tsx"));

  // export-diff
  const entry = "packages/beta/src/index.ts";
  const before = path.join(work, "exports-before.json");
  const after = path.join(work, "exports-after.json");
  const snapshot = () => run("export-diff.mjs", ["snapshot", fixture, "--entry", entry, "--out", after], { expectExit: 0 });
  const compare = () => run("export-diff.mjs", ["compare", before, after]);
  run("export-diff.mjs", ["snapshot", fixture, "--entry", entry, "--out", before], { expectExit: 0 });
  const parseSource = read("packages/beta/src/parse-record.ts");
  const storeSource = read("packages/beta/src/record-store.ts");
  const restore = () => {
    write("packages/beta/src/parse-record.ts", parseSource);
    write("packages/beta/src/record-store.ts", storeSource);
  };
  snapshot();
  check("export-diff: identical source is unchanged", compare().status === 0);
  write("packages/beta/src/parse-record.ts", parseSource.replace(/\n/gu, "\n\n").replace("  // @ts-ignore legacy payloads\n", "  // @ts-ignore legacy payloads (doc)\n"));
  write("packages/beta/src/record-store.ts", storeSource.replace("this.items.push(record);", "const next = record;\n    this.items.push(next);"));
  snapshot();
  check("export-diff: reformatting, comments and body edits are unchanged", compare().status === 0);
  restore();
  write("packages/beta/src/parse-record.ts", parseSource.replace("raw: any", "raw: unknown"));
  snapshot();
  const changed = compare();
  check(
    "export-diff: any -> unknown on an exported signature is a change, reported per export",
    changed.status === 1 && changed.json?.changes.length === 1 && changed.json?.changes[0]?.entry === entry && changed.json?.changes[0]?.name === "parseRecord",
  );
  restore();
  // A decomposition step: move the class to its own file and re-export it from the original path.
  write("packages/beta/src/record-store-impl.ts", storeSource);
  write("packages/beta/src/record-store.ts", 'export { RecordStore } from "./record-store-impl";\n');
  snapshot();
  check("export-diff: moving a declaration to another file and re-exporting it is unchanged", compare().status === 0);
  rmSync(path.join(fixture, "packages/beta/src/record-store-impl.ts"));
  restore();
  write("packages/beta/src/parse-record.ts", parseSource.split("\n\n").reverse().join("\n\n"));
  snapshot();
  check("export-diff: reordering declarations in a file is unchanged", compare().status === 0);
  restore();
  write("packages/beta/src/parse-record.ts", parseSource.replace('Point = "point",', 'Point = "point",\n  Area = "area",'));
  snapshot();
  check("export-diff: new enum member is a change", compare().status === 1);
  restore();
  write("packages/beta/src/record-store.ts", storeSource.replace("{ id: string; savedAt: number }", "{ id: number; savedAt: number; extra: boolean }"));
  snapshot();
  check("export-diff: non-exported type used in an exported signature is a change", compare().status === 1);
  restore();
  write("packages/beta/src/record-store.ts", storeSource.replace("static capacity = 100;", 'static capacity = "unbounded";'));
  snapshot();
  check("export-diff: static class member type change is a change", compare().status === 1);
  restore();
  write("packages/beta/src/record-store.ts", `import type { Clock } from "not-installed-package";\n${storeSource}\nexport const clock: Clock | null = null;\n`);
  const incomplete = run("export-diff.mjs", ["snapshot", fixture, "--entry", entry, "--out", after]);
  check(
    "export-diff: unresolved import in an exposed module makes the snapshot incomplete (exit 3)",
    incomplete.status === 3 && incomplete.json?.unresolvedImports.includes("not-installed-package"),
  );
  restore();

  // side-effect-diff
  const fileAt = (name, text) => {
    const file = path.join(work, name);
    writeFileSync(file, text);
    return file;
  };
  const save = fileAt("side-before.ts", 'export async function save(store: S, logger: L, r: R) {\n  logger.info("saving");\n  await store.save(r);\n}\n');
  const reordered = fileAt("side-reordered.ts", 'export async function save(store: S, logger: L, r: R) {\n  await store.save(r);\n  logger.info("saving");\n}\n');
  const addedFetch = fileAt("side-added.ts", 'export async function save(store: S, logger: L, r: R) {\n  logger.info("saving");\n  await store.save(r);\n  await fetch("/audit");\n}\n');
  const reorderAndAdd = fileAt("side-reorder-add.ts", 'export async function save(store: S, logger: L, r: R) {\n  await store.save(r);\n  logger.info("saving");\n  await loadThing(r);\n}\n');
  const pureBefore = fileAt("pure-before.ts", 'export function f(xs: number[], m: Map<string, string>) {\n  const out: number[] = [];\n  for (const x of xs) out.push(x * 2);\n  m.delete("a");\n  return [out, "a".replace("a", "b")];\n}\n');
  const pureAfter = fileAt("pure-after.ts", 'export function f(xs: number[], m: Map<string, string>) {\n  const out = xs.map((x) => x * 2);\n  m.delete("a");\n  return [out, "a".replace("a", "b")];\n}\n');
  check("side-effect-diff: same file is unchanged", run("side-effect-diff.mjs", [save, save]).status === 0);
  check("side-effect-diff: reorder is flagged", run("side-effect-diff.mjs", [save, reordered]).json?.findings[0]?.reordered === true);
  check("side-effect-diff: added fetch is flagged", run("side-effect-diff.mjs", [save, addedFetch]).json?.findings[0]?.added.includes("await fetch"));
  const both = run("side-effect-diff.mjs", [save, reorderAndAdd]).json?.findings[0];
  check("side-effect-diff: reorder is reported even when a call was added", both?.reordered === true && both?.added.includes("await loadThing"));
  check("side-effect-diff: pure array/map refactor is not flagged", run("side-effect-diff.mjs", [pureBefore, pureAfter]).status === 0);
  const navBefore = fileAt("nav-before.ts", 'export function go() {\n  navigate("/x");\n  useRouter().push("/y");\n}\n');
  const navAfter = fileAt("nav-after.ts", 'export function go() {\n  useRouter().push("/y");\n  navigate("/x");\n}\n');
  check("side-effect-diff: reordered navigation calls (bare navigate, useRouter().push) are flagged", run("side-effect-diff.mjs", [navBefore, navAfter]).json?.findings[0]?.reordered === true);

  // unused
  const unused = run("unused.mjs", [fixture, "--out", path.join(work, "unused.json")], { expectExit: 0 }).json;
  const unusedFile = (file) => unused?.unusedFiles.find((entry) => entry.file === file);
  const unusedExport = (file, name) => unused?.unusedExports.find((entry) => entry.file === file && entry.name === name);
  check("unused: file nothing imports is a likely candidate", unusedFile("packages/alpha/src/legacy-totals.ts")?.confidence === "likely");
  check("unused: library file with no importer is a candidate", unusedFile("packages/beta/src/orphan.ts") !== undefined);
  check("unused: file reached only through import.meta.glob is used", unusedFile("packages/alpha/src/widgets/clock.widget.tsx") === undefined);
  check("unused: tests, stories and tool configs are roots, never candidates", !unused?.unusedFiles.some((entry) => /\.(?:test|spec|stories)\.|vitest\.config/u.test(entry.file)));
  check("unused: files reached from a package entry are not candidates", unusedFile("packages/beta/src/record-store.ts") === undefined && unusedFile("packages/alpha/src/status-list.tsx") === undefined);
  check("unused: export used only in its own file is unexport, not remove", unusedExport("packages/beta/src/score-open.ts", "clampScore")?.action === "unexport");
  check("unused: export used nowhere is remove", unusedExport("packages/beta/src/score-open.ts", "scoreRows")?.action === "remove");
  check("unused: export imported elsewhere is not a candidate", unusedExport("packages/beta/src/score-open.ts", "topScore") === undefined);
  check("unused: library package candidates are review, not likely", unusedExport("packages/beta/src/score-open.ts", "scoreRows")?.confidence === "review");
  check("unused: name mentioned as text elsewhere is review", unusedFile("packages/alpha/src/config.ts")?.confidence === "review");

  // duplicates
  const dupes = run("duplicates.mjs", [fixture, "--out", path.join(work, "duplicates.json")], { expectExit: 0 }).json;
  const clone = dupes?.clones[0];
  check(
    "duplicates: renamed copy across packages is one clone",
    dupes?.summary.clones === 1 &&
      clone?.where === "cross-package" &&
      [clone.first.file, clone.second.file].sort().join() === "packages/alpha/src/legacy-totals.ts,packages/beta/src/score-open.ts",
    JSON.stringify(dupes?.summary),
  );
  check("duplicates: --exact does not match the renamed copy", run("duplicates.mjs", [fixture, "--exact"], { expectExit: 0 }).json?.summary.clones === 0);

  // scorecard with removal reports
  const withReports = run(
    "scorecard.mjs",
    [fixture, "--unused-report", path.join(work, "unused.json"), "--duplicates-report", path.join(work, "duplicates.json"), "--out", path.join(work, "scorecard-reports.json")],
    { expectExit: 0 },
  ).json;
  check(
    "scorecard: removal reports add ratcheted per-package counts",
    ["unusedFiles", "unusedExports", "duplicatedLines"].every((metric) => withReports?.ratcheted.includes(metric)) &&
      withReports?.packages["packages/alpha"]?.metrics.unusedFiles === 2 &&
      withReports?.packages["packages/beta"]?.metrics.duplicatedLines === 11,
    JSON.stringify(withReports?.packages["packages/alpha"]?.metrics),
  );
  const reportsBaseline = path.join(work, "baseline-reports.json");
  run("ratchet.mjs", ["update", "--baseline", reportsBaseline, "--current", path.join(work, "scorecard-reports.json")]);
  const withoutReports = run("ratchet.mjs", ["check", "--baseline", reportsBaseline, "--current", current]);
  check(
    "ratchet: a run without the removal reports skips those metrics with a warning, not a pass by dropping to zero",
    withoutReports.status === 0 && withoutReports.json?.improvements.length === 0 && withoutReports.json?.warnings.some((warning) => warning.includes("unusedFiles")),
  );

  // symbol-map
  const map = run("symbol-map.mjs", [fixture, "packages/beta/src/parse-record.ts"], { expectExit: 0 }).json;
  const parse = map?.symbols.find((symbol) => symbol.name === "parseRecord");
  check("symbol-map: lists three exported symbols", map?.symbols.filter((symbol) => symbol.exported).length === 3);
  check("symbol-map: parseRecord uses ParsedRecord and RecordKind", JSON.stringify(parse?.uses) === '["ParsedRecord","RecordKind"]');

  // Go pack: needs go (with gofmt), staticcheck and ast-grep. Missing tools skip these checks; they never pass silently.
  const goFixture = path.join(work, "go-service");
  cpSync(path.join(here, "fixtures", "go-service"), goFixture, { recursive: true });
  const goTools = { go: toolOk("go", ["version"]), staticcheck: toolOk("staticcheck", ["-version"]), "ast-grep": toolOk("ast-grep", ["--version"]) };
  const missingTools = Object.entries(goTools).filter(([, ok]) => !ok).map(([name]) => name);
  if (missingTools.length > 0) {
    skip("go-scorecard fixture metrics", `missing ${missingTools.join(", ")}`);
  } else {
    const goOut = path.join(work, "go-scorecard.json");
    const goScore = run("go-scorecard.mjs", [goFixture, "--out", goOut], { expectExit: 0 }).json;
    const goExpected = JSON.parse(readFileSync(path.join(here, "expected", "go-service-scorecard.json"), "utf8"));
    check("go-scorecard: every tool ran (no warnings)", goScore?.warnings.length === 0, JSON.stringify(goScore?.warnings));
    for (const [dir, expectedPkg] of Object.entries(goExpected.packages)) {
      for (const [metric, value] of Object.entries(expectedPkg.metrics)) {
        const actual = goScore?.packages?.[dir]?.metrics?.[metric];
        check(`go-scorecard ${dir} ${metric} = ${value}`, actual === value, `got ${actual}`);
      }
      const lint = goScore?.packages?.[dir]?.lint ?? null;
      check(`go-scorecard ${dir} lint by rule`, JSON.stringify(lint) === JSON.stringify(expectedPkg.lint), JSON.stringify(lint));
    }
    check("go-scorecard: generated file is not measured", !goScore?.largestFiles.some((entry) => entry.file.includes("zz_generated")));
    const goBaseline = path.join(work, "go-baseline.json");
    check(
      "ratchet accepts a Go scorecard as baseline and current",
      run("ratchet.mjs", ["update", "--baseline", goBaseline, "--current", goOut]).json?.status === "created" &&
        run("ratchet.mjs", ["check", "--baseline", goBaseline, "--current", goOut]).status === 0,
    );
    const noTools = run("go-scorecard.mjs", [goFixture, "--no-tools"], { expectExit: 0 }).json;
    check(
      "go-scorecard --no-tools reports file metrics only",
      noTools?.lint === null && noTools?.packages["internal/store"]?.metrics.filesOverWarn === 1 && noTools?.packages["internal/store"]?.metrics.deferInLoop === 0,
    );
  }
  if (!goTools["ast-grep"]) {
    skip("ast-grep rule tests", "missing ast-grep");
  } else {
    const ruleTests = spawnSync("ast-grep", ["test", "-c", path.join(here, "..", "rules", "sgconfig.yml"), "--skip-snapshot-tests"], {
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    check("ast-grep rule tests pass (rules/go-tests)", ruleTests.status === 0, `${ruleTests.stdout}${ruleTests.stderr}`.trim().slice(-400));
  }

  // shared helpers
  const shared = await import(`file://${path.join(scripts, "shared.mjs").replace(/\\/gu, "/")}`);
  check("glob: **/generated/** does not match ungenerated/", !shared.globToRegExp("**/generated/**").test("src/ungenerated/x.ts"));
  check("glob: **/generated/** matches generated/ at any depth", shared.globToRegExp("**/generated/**").test("src/generated/x.ts") && shared.globToRegExp("**/generated/**").test("generated/x.ts"));
  check("tool config: vitest.config.ts yes, src/config.ts and router.config.ts no", shared.isToolConfig("a/vitest.config.ts") && !shared.isToolConfig("src/config.ts") && !shared.isToolConfig("src/router.config.ts"));
  check(
    "tool config: tsdown.config.ts and named variants (vitest.acceptance.config.ts, playwright.batch-1.config.ts) are tool configs",
    ["p/tsdown.config.ts", "a/vitest.acceptance.config.ts", "a/playwright.batch-1.config.ts"].every((file) => shared.isToolConfig(file)),
  );
  const tricky = String.raw`[slug].(group)+a\b$-x/y`;
  check(
    "escapeRegExp: names with brackets, dots, parens, backslashes, hyphens and slashes compile in u mode and match only themselves",
    new RegExp(`(?<![\\w$])${shared.escapeRegExp(tricky)}(?![\\w$])`, "u").test(tricky) && !new RegExp(shared.escapeRegExp("[slug]"), "u").test("s"),
  );
  check("glob braces: expandBraces('*.{ts,tsx}') gives both", JSON.stringify(shared.expandBraces("src/*.{ts,tsx}")) === '["src/*.ts","src/*.tsx"]');
} finally {
  rmSync(work, { recursive: true, force: true });
}

process.stdout.write(`\n${passes} passed, ${failures} failed${skips > 0 ? `, ${skips} skipped (install go, staticcheck and ast-grep to run them)` : ""}\n`);
process.exit(failures === 0 ? 0 : 1);
