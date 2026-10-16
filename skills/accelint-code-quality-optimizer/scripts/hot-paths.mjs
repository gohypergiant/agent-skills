#!/usr/bin/env node
// Says whether each file is on a declared hot path (overlay `hotPaths`), so only those get performance changes.
import path from "node:path";
import { SKILL_VERSION, globToRegExp, loadOverlay, parseArgs, printJson, resolveRoot, toPosix } from "./shared.mjs";

const USAGE = "usage: hot-paths.mjs [repo-root] <file> [<file>...]";
const args = parseArgs(process.argv.slice(2), { flags: ["help"] });
if (args.help || args._.length === 0) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(args.help ? 0 : 2);
}
const [rootArg, ...rest] = args._.length > 1 && !path.extname(args._[0]) ? args._ : [".", ...args._];
const root = resolveRoot(rootArg);
const overlay = loadOverlay(root);
const globs = Array.isArray(overlay.hotPaths) ? overlay.hotPaths : [];
const patterns = globs.map((glob) => ({ glob, regex: globToRegExp(glob) }));

const files = rest.map((file) => {
  const rel = toPosix(path.relative(root, path.resolve(root, file)));
  const match = patterns.find((pattern) => pattern.regex.test(rel));
  return { file: rel, hotPath: match !== undefined, matchedBy: match?.glob ?? null };
});

printJson({
  tool: "hot-paths",
  version: SKILL_VERSION,
  overlay: overlay.path,
  hotPaths: globs,
  note:
    globs.length === 0
      ? "No hotPaths declared in the overlay: every performance finding is report-only."
      : "Performance changes are allowed only for files with hotPath: true, with a benchmark per references/performance.md.",
  files,
});
