#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { handleCliCommonErrors } from "../utils/cli";

type FsSubset = Pick<typeof fs, "readFileSync" | "mkdirSync" | "writeFileSync">;

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
  summaryMd?: string;
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
      summaryMd: "Error: Missing required option: --summary-md <path>",
    },
  });
  if (commonErrors !== null) return commonErrors;
  if (!parsed.summaryJson || !parsed.summaryMd) return 1;

  // Grab the summary file
  let summary: SummaryFile;
  try {
    const raw = runtime.fs.readFileSync(parsed.summaryJson, "utf8");
    const parsedJson = JSON.parse(raw);
    summary = normalizeSummaryFile(parsedJson, parsed.summaryJson);
  } catch (error) {
    runtime.error(
      `Error: Unable to read summary JSON file: ${parsed.summaryJson}`
    );
    if (error instanceof Error) runtime.error(error.message);
    return 1;
  }

  // Build the text and write the file
  const inputs = uniqueInOrder(summary.entries.map((entry) => entry.input));
  const outputs = uniqueInOrder(summary.entries.map((entry) => entry.outputs.test));
  const requiredHooksByTestFile = collectRequiredHooksByTestFile(summary.entries);

  const markdown = renderMarkdown({
    runDate: summary.runDate,
    inputs,
    outputs,
    requiredHooksByTestFile,
  });

  runtime.fs.mkdirSync(runtime.path.dirname(parsed.summaryMd), { recursive: true });
  runtime.fs.writeFileSync(parsed.summaryMd, markdown, "utf8");

  runtime.log(`-> Wrote: ${parsed.summaryMd}`);
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

    // Summary arg (json input)
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

    // Summary arg (md output)
    if (arg === "--summary-md") {
      const value = args[i + 1];
      if (!value) parsed.errors.push("Error: Missing value for --summary-md");
      else parsed.summaryMd = value;
      i += 1;
      continue;
    }
    if (arg.startsWith("--summary-md=")) {
      const value = arg.slice("--summary-md=".length);
      if (!value) parsed.errors.push("Error: Missing value for --summary-md");
      else parsed.summaryMd = value;
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
    "  npx create-markdown-summary --summary-json <path> --summary-md <path>"
  );
}

// Validates summary json structure
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

// Dedupes while preserving order
function uniqueInOrder(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}

// Writes the markdown
function renderMarkdown(data: {
  runDate: string;
  inputs: string[];
  outputs: string[];
  requiredHooksByTestFile: Map<string, Array<{ name: string; hooks: string[] }>>;
}): string {
  const lines: string[] = [];

  lines.push("# Post-creation summary");
  lines.push("");
  lines.push(`- Run date: ${data.runDate}`);
  lines.push("");
  lines.push("## Inputs: AC files");
  lines.push(...renderList(data.inputs));
  lines.push("");
  lines.push("## Outputs: Playwright test files");
  lines.push(...renderList(data.outputs));
  lines.push("");
  lines.push("## Next steps");
  lines.push(
    "- Copy the generated Playwright spec files into your project repo."
  );
  lines.push(
    "- Ensure the codebase includes the required test hooks (data-testid attributes on the appropriate elements). If there's any ambiguity, review the input AC file alongside the JSON plan to most easily see the intended test flow and targets."
  );
  lines.push(
    "- If Playwright isn't yet configured for your project and you requested the config template, copy it to your repo root and adjust baseURL, testDir, and reporter/output paths to match your project."
  );
  lines.push(
    "- Consider reviewing your Vitest (or other) test configs to make sure these new Playwright *.spec.ts files won't get picked up with other testing."
  );
  lines.push(
    "- Add a CI step to run Playwright and upload traces/screenshots on failure."
  );
  lines.push("");
  lines.push("## Required test hooks");
  if (data.requiredHooksByTestFile.size === 0) {
    lines.push("- (none)");
  } else {
    for (const [testFile, tests] of data.requiredHooksByTestFile) {
      lines.push(`- ${testFile}`);
      for (const test of tests) {
        lines.push(`  - ${test.name}`);
        for (const hook of test.hooks) {
          lines.push(`    - ${hook}`);
        }
      }
    }
  }
  lines.push("");

  return `${lines.join("\n")}`;
}

// Helps with bullets
function renderList(items: string[]): string[] {
  if (items.length === 0) {
    return ["- (none)"];
  }
  return items.map((item) => `- ${item}`);
}

// Collects required hooks grouped by output test file in entry order.
function collectRequiredHooksByTestFile(
  entries: SummaryEntry[]
): Map<string, Array<{ name: string; hooks: string[] }>> {
  const output = new Map<string, Array<{ name: string; hooks: string[] }>>();

  for (const entry of entries) {
    const testsWithHooks = entry.tests
      .filter((test) => test.requiredTestHooks.length > 0)
      .map((test) => ({ name: test.name, hooks: test.requiredTestHooks }));

    if (testsWithHooks.length === 0) continue;
    output.set(entry.outputs.test, testsWithHooks);
  }

  return output;
}

// @internal exports for unit tests
export {
  collectRequiredHooksByTestFile as _collectRequiredHooksByTestFile,
  normalizeSummaryFile as _normalizeSummaryFile,
  parseArgs as _parseArgs,
  renderMarkdown as _renderMarkdown,
  uniqueInOrder as _uniqueInOrder,
};
