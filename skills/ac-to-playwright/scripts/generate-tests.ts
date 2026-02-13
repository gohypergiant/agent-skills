#!/usr/bin/env node

// This cli script allows a user to specify the location of a json test plan
// and kick off creation of Playwright test files.

import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { testSuiteSchema } from "./plan-schema";
import { run as appendSummaryEntry } from "./append-json-summary-entry";
import { run as createMarkdownSummary } from "./create-markdown-summary";
import { type PlanFile, translatePlan } from "./translate-plan-to-tests";
import { handleCliCommonErrors } from "./utils/cli";

// Types
type FsSubset = Pick<
  typeof fs,
  "existsSync" | "statSync" | "readdirSync" | "readFileSync" | "mkdirSync" | "writeFileSync"
>;

type PathSubset = Pick<
  typeof path,
  "resolve" | "dirname" | "basename" | "join" | "isAbsolute" | "parse"
>;

export type CliRuntime = {
  fs: FsSubset;
  path: PathSubset;
  appendSummaryEntry: (argv: string[]) => number;
  createMarkdownSummary: (argv: string[]) => number;
  extractSourceDescription: (testContent: string) => string | null;
  now: () => Date;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

const defaultRuntime: CliRuntime = {
  fs,
  path,
  appendSummaryEntry,
  createMarkdownSummary,
  extractSourceDescription,
  now: () => new Date(),
  log: console.log,
  error: console.error,
};

// CLI entrypoint
if (require.main === module) {
  const code = run(process.argv);
  process.exit(code);
}

export function run(argv: string[], runtime: CliRuntime = defaultRuntime): number {
  // Parse args
  const parsed = parseArgs(argv.slice(2));
  const commonErrors = handleCliCommonErrors({
    parsed,
    runtime,
    printUsage,
    required: {
      testsDir: "Error: Missing required option: --tests-dir <path>",
      summaryDir: "Error: Missing required option: --summary-dir <path>",
    },
  });
  if (commonErrors !== null) return commonErrors;
  if (!parsed.testsDir || !parsed.summaryDir) return 1;

  const summaryJsonPath = runtime.path.join(
    parsed.summaryDir,
    formatSummaryFilename(runtime.now())
  );

  // Reads inputs
  const inputs = parsed.inputs;

  const files: string[] = [];
  
  for (const input of inputs) {
    let matches: string[] = [];

    try {
      matches = processInput(input, runtime);
    } catch (e) {
      runtime.error(e instanceof Error? e.message : String(e));
      return 1;
    }

    // Warn if any globs matched nothing
    if (input.includes("*") && matches.length === 0) {
      runtime.error(`Warning: Glob pattern matched no files: ${input}`);
    }
    files.push(...matches);
  }

  // Errors if no inputs were given or resolved from globs
  if (files.length === 0) {
    runtime.error("Error: Missing inputs. Please submit input file(s) separated by spaces.");
    printUsage(runtime.error);
    return 1;
  }

  // Normalize inputs (keep both original + resolved)
  const inputPairs = files.map((original) => ({
    original,
    resolved: runtime.path.resolve(original),
  }));
  
  // Deduplicate by resolved path (preserve first original)
  const seen = new Set<string>();
  const uniquePairs: typeof inputPairs = [];
  
  for (const pair of inputPairs) {
    if (!seen.has(pair.resolved)) {
      seen.add(pair.resolved);
      uniquePairs.push(pair);
    }
  }  

  // Errors if dotfiles or dotdirs are passed in as inputs
  const hidden = uniquePairs.filter((p) => hasHiddenSegment(p.original));
  if (hidden.length) {
    runtime.error("Error: Hidden files and dirs are not allowed as inputs:");
    for (const h of hidden) runtime.error(`  ${h.original}`);
    return 1;
  }

  // Errors if specific input files aren't found
  const missing = uniquePairs.filter((p) => !runtime.fs.existsSync(p.resolved));
  if (missing.length) {
    runtime.error("Error: Input file(s) not found.");
    for (const m of missing) runtime.error(`  ${m.original}`);
    return 1;
  }

  // Creates test files from inputs
  for (const { original, resolved } of uniquePairs) {
    const rawPlan = runtime.fs.readFileSync(resolved, "utf8");

    let parsedPlan: unknown;
    try {
      parsedPlan = JSON.parse(rawPlan);
    } catch {
      runtime.error(`Invalid JSON: ${original}`);
      return 1;
    }

    const validationResult = testSuiteSchema.safeParse(parsedPlan);
    if (!validationResult.success) {
      runtime.error(`Invalid test suite: ${original}`);
      runtime.error(z.prettifyError(validationResult.error));
      return 1;
    }

    const planFile = parsedPlan as PlanFile;
    const testFile = translatePlan(planFile, { outDir: parsed.testsDir });

    runtime.fs.mkdirSync(runtime.path.dirname(testFile.path), { recursive: true });
    runtime.fs.writeFileSync(testFile.path, testFile.content, "utf8");
    runtime.log(`-> Read:        ${original}`);
    runtime.log(`   Wrote:       ${testFile.path}`);
    runtime.log(`   To run, do:  npx playwright test ${testFile.path}`);

    const sourceFromAnnotation = runtime.extractSourceDescription(testFile.content);
    if (!sourceFromAnnotation) {
      runtime.error(
        "Error: Unable to read source annotation from generated test file."
      );
      return 1;
    }

    const appendCode = runtime.appendSummaryEntry([
      "node",
      "append-json-summary-entry.js",
      "--summary-json",
      summaryJsonPath,
      "--input",
      sourceFromAnnotation,
      "--plan",
      original,
      "--test",
      testFile.path,
    ]);
    if (appendCode !== 0) {
      runtime.error("Error: Failed to append summary entry.");
      return 1;
    }
  }

  const summaryMdPath = summaryJsonPath.replace(/\.json$/, ".md");
  const markdownCode = runtime.createMarkdownSummary([
    "node",
    "create-markdown-summary.js",
    "--summary-json",
    summaryJsonPath,
    "--summary-md",
    summaryMdPath,
  ]);
  if (markdownCode !== 0) {
    runtime.error("Error: Failed to create markdown summary.");
    return 1;
  }

  return 0;
}

// Helper functions

type ParsedArgs = {
  inputs: string[];
  testsDir?: string;
  summaryDir?: string;
  help: boolean;
  errors: string[];
};

function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    inputs: [],
    help: false,
    errors: [],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      return parsed;
    }

    if (arg === "--tests-dir") {
      const value = args[i + 1];
      if (!value) {
        parsed.errors.push("Error: Missing value for --tests-dir");
      } else {
        parsed.testsDir = value;
        i += 1;
      }
      continue;
    }

    if (arg.startsWith("--tests-dir=")) {
      const value = arg.slice("--tests-dir=".length);
      if (!value) parsed.errors.push("Error: Missing value for --tests-dir");
      else parsed.testsDir = value;
      continue;
    }

    if (arg === "--summary-dir") {
      const value = args[i + 1];
      if (!value) {
        parsed.errors.push("Error: Missing value for --summary-dir");
      } else {
        parsed.summaryDir = value;
        i += 1;
      }
      continue;
    }

    if (arg.startsWith("--summary-dir=")) {
      const value = arg.slice("--summary-dir=".length);
      if (!value) parsed.errors.push("Error: Missing value for --summary-dir");
      else parsed.summaryDir = value;
      continue;
    }

    if (arg.startsWith("-")) {
      parsed.errors.push(`Error: Unknown option: ${arg}`);
      continue;
    }

    parsed.inputs.push(arg);
  }

  return parsed;
}

function printUsage(log: (...args: unknown[]) => void): void {
  log("Usage:");
  log(
    "  npx generate-tests <plan.json> [more plans...] --tests-dir <path> --summary-dir <path>"
  );
}

// Checks if a path has dotfiles or dotdirs
function hasHiddenSegment(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  const segments = normalized.split("/").filter(Boolean);
  return segments.some((s) => s.startsWith(".") && s !== "." && s !== "..");
}

// Escapes regex chars to make a string safe to include in regex
function escapeRegex(s: string): string {
  return s.replace(/[.*+^${}()|[\]\\]/g, "\\$&");
}

// Converts a filename with * into regex
function starPatternToRegex(pattern: string): RegExp {
  const escaped = escapeRegex(pattern).replace(/\\\*/g, ".*");
  return new RegExp(`^${escaped}$`);
}

// Checks input for globs and processes them appropriately
// Mac/most Linux (bash) does this automatically at the command line
// This ensures parallel functionality for Windows and Linux non-bash users
function processInput(input: string, runtime: CliRuntime): string[] {
  const { fs, path } = runtime;
  
  // It's a literal path
  if (!input.includes("*")) return [input];

  // No recursion
  if (input.includes("**")) {
    throw new Error(`Error: Unsupported: recursive glob (**): ${input}`);
  }

  const isAbs = path.isAbsolute(input);
  const root = isAbs ? path.parse(input).root : "";
  const normalizedInput = input.replace(/\\/g, "/");
  const normalizedRoot = root.replace(/\\/g, "/");

  const relativePart = isAbs
  ? normalizedInput.slice(normalizedRoot.length)
  : normalizedInput;

  // Expand wildcards
  const segments = relativePart.split("/").filter(Boolean);
  let currentPaths: string[] = [isAbs ? root : process.cwd()];

  for (const segment of segments) {
    currentPaths = expandSegment(currentPaths, segment, runtime);
    if (currentPaths.length === 0) return [];
  }

  // Keep only files (and exclude dotfiles defensively)
  const finalFiles = currentPaths
    .filter((p) => {
      const name = path.basename(p);
      if (name.startsWith(".")) return false;
      return fs.existsSync(p) && fs.statSync(p).isFile();
    })
    .sort();

  return finalFiles;
}

function formatSummaryFilename(now: Date): string {
  const iso = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  return `${iso.replace("T", "-").replace(/:/g, "-")}-summary.json`;
}

function extractSourceDescription(testContent: string): string | null {
  const match = testContent.match(/description:\s*("([^"\\\\]|\\\\.)*")/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as string;
  } catch {
    return null;
  }
}

// Expands a given segment of an input path that has a glob
function expandSegment(
  basePaths: string[],
  segment: string,
  runtime: CliRuntime
): string[] {
  const { fs, path } = runtime;

  // If no wildcard, just append this segment to every base path
  if (!segment.includes("*")) {
    return basePaths.map((base) => path.join(base, segment));
  }

  const segmentRegex = starPatternToRegex(segment);
  const matches: string[] = [];

  for (const base of basePaths) {
    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) continue;

    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue; // exclude dotfiles + dotdirs
      if (!segmentRegex.test(entry.name)) continue; // does it match?
      matches.push(path.join(base, entry.name));
    }
  }

  return matches.sort();
}

// @internal exports for unit tests
export {
  escapeRegex as _escapeRegex,
  expandSegment as _expandSegment,
  hasHiddenSegment as _hasHiddenSegment,
  processInput as _processInput,
  starPatternToRegex as _starPatternToRegex,
  parseArgs as _parseArgs,
  extractSourceDescription as _extractSourceDescription,
  formatSummaryFilename as _formatSummaryFilename,
};
