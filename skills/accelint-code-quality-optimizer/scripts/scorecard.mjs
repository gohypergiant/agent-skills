#!/usr/bin/env node
// Per-package quality metrics for TypeScript/JavaScript sources, counted from the TypeScript AST.
import { writeFileSync } from "node:fs";
import { buildScorecard } from "./scorecard-core.mjs";
import { fail, parseArgs, printJson, resolveRoot } from "./shared.mjs";

const USAGE = `usage: scorecard.mjs [repo-root] [--scope <dir>] [--lint-report <oxlint-or-eslint.json>]
                    [--typescript <path>] [--out <file>]`;
const args = parseArgs(process.argv.slice(2), {
  flags: ["help"],
  options: ["scope", "lint-report", "typescript", "out"],
});
if (args.help) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(0);
}

const root = resolveRoot(args._[0]);
let scorecard;
try {
  scorecard = buildScorecard(root, {
    scope: args.scope,
    lintReport: args["lint-report"],
    typescript: args.typescript,
  });
} catch (error) {
  fail(error.message);
}
if (args.out) writeFileSync(args.out, `${JSON.stringify(scorecard, null, 2)}\n`);
printJson(scorecard);
