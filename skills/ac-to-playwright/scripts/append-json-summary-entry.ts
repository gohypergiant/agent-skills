#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { type TestSuite, testSuiteSchema } from "../references/plan-schema";
import { handleCliCommonErrors } from "./utils/cli";

type FsSubset = Pick<
  typeof fs,
  "existsSync" | "readFileSync" | "mkdirSync" | "writeFileSync"
>;

type PathSubset = Pick<typeof path, "dirname">;

export type CliRuntime = {
  fs: FsSubset;
  path: PathSubset;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

const defaultRuntime: CliRuntime = {
  fs,
  path,
  log: console.log,
  error: console.error,
};

type SummaryEntry = {
  input: string;
  outputs: {
    plan: string;
    test: string;
  };
  tests: Array<{
    name: string;
    requiredTestHooks: string[];
  }>;
};

type SummaryFile = {
  runDate: string;
  entries: SummaryEntry[];
};

type ParsedArgs = {
  summaryJson?: string;
  input?: string;
  plan?: string;
  test?: string;
  runDate?: string;
  help: boolean;
  errors: string[];
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
      summaryJson: "Error: Missing required option: --summary-json <path>",
      input: "Error: Missing required option: --input <ac-file>",
      plan: "Error: Missing required option: --plan <plan.json>",
      test: "Error: Missing required option: --test <spec.ts>",
    },
  });
  if (commonErrors !== null) return commonErrors;
  if (!parsed.summaryJson || !parsed.input || !parsed.plan || !parsed.test) {
    return 1;
  }

  // Reads inputs
  const summaryPath = parsed.summaryJson;
  const inputPath = parsed.input;
  const planPath = parsed.plan;
  const testPath = parsed.test;

  // Read the raw plan
  let planRaw: string;
  try {
    planRaw = runtime.fs.readFileSync(planPath, "utf8");
  } catch {
    runtime.error(`Error: Unable to read plan file: ${planPath}`);
    return 1;
  }

  // Parse the raw plan
  let parsedPlan: unknown;
  try {
    parsedPlan = JSON.parse(planRaw);
  } catch {
    runtime.error(`Error: Invalid JSON in plan file: ${planPath}`);
    return 1;
  }

  // Invalid plan per the schema
  const planValidation = testSuiteSchema.safeParse(parsedPlan);
  if (!planValidation.success) {
    runtime.error(`Error: Invalid test suite in plan file: ${planPath}`);
    runtime.error(z.prettifyError(planValidation.error));
    return 1;
  }

  // Build summary entry
  const plan = planValidation.data;
  const entry: SummaryEntry = {
    input: inputPath,
    outputs: {
      plan: planPath,
      test: testPath,
    },
    tests: buildTestSummaries(plan),
  };

  // Grab the existing summary file if present or start a new one
  let summary: SummaryFile;
  if (runtime.fs.existsSync(summaryPath)) {
    try {
      const existing = JSON.parse(runtime.fs.readFileSync(summaryPath, "utf8"));
      summary = normalizeSummaryFile(existing, summaryPath);
    } catch (error) {
      runtime.error(
        `Error: Unable to parse existing summary file: ${summaryPath}`
      );
      if (error instanceof Error) runtime.error(error.message);
      return 1;
    }
  } else {
    const runDate = parsed.runDate ?? new Date().toISOString();
    summary = { runDate, entries: [] };
  }

  // Add new entry and write file
  summary.entries.push(entry);

  runtime.fs.mkdirSync(runtime.path.dirname(summaryPath), { recursive: true });
  runtime.fs.writeFileSync(
    summaryPath,
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8"
  );

  runtime.log(`-> Appended entry: ${inputPath}`);
  runtime.log(`   Summary JSON:   ${summaryPath}`);

  return 0;
}

// Helper functions

// Parses the arguments sent in
function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    help: false,
    errors: [],
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      return parsed;
    }

    // Summary arg
    if (arg === "--summary-json") {
      const value = args[i + 1];
      if (!value) parsed.errors.push("Error: Missing value for --summary-json");
      else parsed.summaryJson = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("--summary-json=")) {
      const value = arg.slice("--summary-json=".length);
      if (!value) parsed.errors.push("Error: Missing value for --summary-json");
      else parsed.summaryJson = value;
      continue;
    }

    // Input arg
    if (arg === "--input") {
      const value = args[i + 1];
      if (!value) parsed.errors.push("Error: Missing value for --input");
      else parsed.input = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("--input=")) {
      const value = arg.slice("--input=".length);
      if (!value) parsed.errors.push("Error: Missing value for --input");
      else parsed.input = value;
      continue;
    }

    // Plan arg
    if (arg === "--plan") {
      const value = args[i + 1];
      if (!value) parsed.errors.push("Error: Missing value for --plan");
      else parsed.plan = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("--plan=")) {
      const value = arg.slice("--plan=".length);
      if (!value) parsed.errors.push("Error: Missing value for --plan");
      else parsed.plan = value;
      continue;
    }

    // Test arg
    if (arg === "--test") {
      const value = args[i + 1];
      if (!value) parsed.errors.push("Error: Missing value for --test");
      else parsed.test = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("--test=")) {
      const value = arg.slice("--test=".length);
      if (!value) parsed.errors.push("Error: Missing value for --test");
      else parsed.test = value;
      continue;
    }

    // Date arg
    if (arg === "--run-date") {
      const value = args[i + 1];
      if (!value) parsed.errors.push("Error: Missing value for --run-date");
      else parsed.runDate = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("--run-date=")) {
      const value = arg.slice("--run-date=".length);
      if (!value) parsed.errors.push("Error: Missing value for --run-date");
      else parsed.runDate = value;
      continue;
    }

    if (arg.startsWith("-")) {
      parsed.errors.push(`Error: Unknown option: ${arg}`);
      continue;
    }

    parsed.errors.push(`Error: Unexpected argument: ${arg}`);
  }

  return parsed;
}

// Prints usage instructions
function printUsage(log: (...args: unknown[]) => void): void {
  log("Usage:");
  log(
    "  npx append-json-summary-entry --summary-json <path> --input <ac-file> --plan <plan.json> --test <spec.ts>"
  );
  log("");
  log("Optional:");
  log("  --run-date <iso>");
}

// Converts each test in the plan into a summary entry
function buildTestSummaries(plan: TestSuite): SummaryEntry["tests"] {
  return plan.tests.map((test) => ({
    name: test.name,
    requiredTestHooks: extractHooks(test.steps),
  }));
}

// Collects all hooks a test uses, deduped, in the order seen
function extractHooks(steps: TestSuite["tests"][number]["steps"]): string[] {
  const hooks: string[] = [];
  const seen = new Set<string>();

  for (const step of steps) {
    if ("target" in step && typeof step.target === "string") {
      const hook = step.target;
      if (!seen.has(hook)) {
        seen.add(hook);
        hooks.push(hook);
      }
    }
  }

  return hooks;
}

// Extracts a summary file so more can be added to it
function normalizeSummaryFile(input: unknown, filePath: string): SummaryFile {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    !("runDate" in input) ||
    !("entries" in input)
  ) {
    throw new Error(`Invalid summary file format: ${filePath}`);
  }

  const runDate = (input as SummaryFile).runDate;
  const entries = (input as SummaryFile).entries;

  if (typeof runDate !== "string" || !Array.isArray(entries)) {
    throw new Error(`Invalid summary file format: ${filePath}`);
  }

  return { runDate, entries };
}

// @internal exports for unit tests
export {
  buildTestSummaries as _buildTestSummaries,
  extractHooks as _extractHooks,
  normalizeSummaryFile as _normalizeSummaryFile,
  parseArgs as _parseArgs,
};
