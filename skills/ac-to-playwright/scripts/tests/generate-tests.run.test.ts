import { describe, expect, it } from "vitest";
import { type CliRuntime, run } from "../generate-tests";
import { addFile, makeRuntime } from "./generate-tests.test-utils";

const defaultArgs = [
  "node",
  "generate-tests.js",
  "--tests-dir",
  "tests",
  "--summary-dir",
  "summaries",
] as const;

function runWithDefaults(runtime: CliRuntime, extras: string[] = []): number {
  return run([...defaultArgs, ...extras], runtime);
}

describe("run()", () => {
  it("returns 1 and prints an error when no inputs are provided", () => {
    const { runtime, errors } = makeRuntime();

    const code = runWithDefaults(runtime);

    expect(code).toBe(1);
    expect(errors[0]).toContain("Missing inputs");
    expect(errors.join("\n")).toContain("Usage:");
  });

  it("returns 1 and prints an error when any input file does not exist", () => {
    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: (p) => String(p) === "exists.json",
      },
    });    
  
    const code = runWithDefaults(runtime, ["exists.json", "missing.json"]);
  
    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Input file(s) not found.");
    expect(errors.join("\n")).toContain("missing.json");
  });

  it("returns 1 and prints an error when an input file isn't valid json", () => {
    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => "{ not json }") as unknown as CliRuntime["fs"]["readFileSync"],
      },
      log: () => {},
    });

    const code = runWithDefaults(runtime, ["bad.json"]);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Invalid JSON: bad.json");
  });

  it("returns 1 and prints an error when an input file fails schema validation", () => {
    // valid JSON, invalid schema (missing startUrl, steps empty)
    const invalidPlan = JSON.stringify({
      suiteName: "Suite",
      tests: [{ name: "t", steps: [] }],
    });
  
    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => invalidPlan) as unknown as CliRuntime["fs"]["readFileSync"],
      },
    });
  
    const code = runWithDefaults(runtime, ["invalid.json"]);
  
    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Invalid test suite:");
    expect(errors.join("\n").toLowerCase()).toMatch(/starturl|steps/);
  });  

  it("returns 0 and writes a generated test file for a valid plan", () => {
    const validPlan = makeValidPlanJson();
  
    let mkdirCalledWith = "";
    let writtenPath = "";
    let writtenContent = "";
  
    let appendArgs: string[] = [];
    let markdownArgs: string[] = [];
    const { runtime, logs, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => validPlan) as unknown as CliRuntime["fs"]["readFileSync"],
        mkdirSync: (p) => {
          mkdirCalledWith = String(p);
        },
        writeFileSync: (p, data) => {
          writtenPath = String(p);
          writtenContent = String(data);
        },
      },
      appendSummaryEntry: (argv) => {
        appendArgs = argv.map(String);
        return 0;
      },
      createMarkdownSummary: (argv) => {
        markdownArgs = argv.map(String);
        return 0;
      },
    });
  
    const code = runWithDefaults(runtime, ["plan.json"]);
  
    expect(code).toBe(0);
    expect(errors.length).toBe(0);
  
    expect(mkdirCalledWith).toContain("tests");
    expect(writtenPath).toBe("tests/my-suite.spec.ts");
  
    expect(writtenContent).toContain(`import { expect, test } from "@playwright/test";`);
    expect(writtenContent).toContain(`test.describe("My Suite", {`);
    expect(writtenContent).toContain(`annotation: {`);
    expect(writtenContent).toContain(`type: "source",`);
    expect(writtenContent).toContain(`description: "some-repo/path/to/file.md"`);
    expect(writtenContent).toContain(`test("Suite name", async ({ page }, testInfo) => {`);
    expect(logs.join("\n")).toContain("Wrote:");
    expect(appendArgs).toContain("--summary-json");
    expect(appendArgs).toContain("summaries/2026-01-28-14-03-52Z-summary.json");
    expect(appendArgs).toContain("--input");
    expect(appendArgs).toContain("some-repo/path/to/file.md");
    expect(appendArgs).toContain("--plan");
    expect(appendArgs).toContain("plan.json");
    expect(appendArgs).toContain("--test");
    expect(appendArgs).toContain("tests/my-suite.spec.ts");
    expect(markdownArgs).toContain("--summary-json");
    expect(markdownArgs).toContain("summaries/2026-01-28-14-03-52Z-summary.json");
    expect(markdownArgs).toContain("--summary-md");
    expect(markdownArgs).toContain("summaries/2026-01-28-14-03-52Z-summary.md");
  });  

  it("returns 1 when summary append fails", () => {
    const validPlan = makeValidPlanJson();

    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => validPlan) as unknown as CliRuntime["fs"]["readFileSync"],
        mkdirSync: () => {},
        writeFileSync: () => {},
      },
      appendSummaryEntry: () => 1,
    });

    const code = runWithDefaults(runtime, ["plan.json"]);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Failed to append summary entry");
  });

  it("returns 1 when markdown summary creation fails", () => {
    const validPlan = makeValidPlanJson();

    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => validPlan) as unknown as CliRuntime["fs"]["readFileSync"],
        mkdirSync: () => {},
        writeFileSync: () => {},
      },
      appendSummaryEntry: () => 0,
      createMarkdownSummary: () => 1,
    });

    const code = runWithDefaults(runtime, ["plan.json"]);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Failed to create markdown summary");
  });

  it("returns 1 when source annotation is missing from generated test", () => {
    const validPlan = makeValidPlanJson();

    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => validPlan) as unknown as CliRuntime["fs"]["readFileSync"],
        mkdirSync: () => {},
        writeFileSync: () => {},
      },
      appendSummaryEntry: () => 0,
    });

    runtime.extractSourceDescription = () => null;

    const code = runWithDefaults(runtime, ["plan.json"]);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unable to read source annotation");
  });
  it("deduplicates inputs", () => {
    const validPlan = makeValidPlanJson();
  
    let readCount = 0;
    let writeCount = 0;
  
    const { runtime, logs, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: (() => {
          readCount += 1;
          return validPlan;
        }) as unknown as CliRuntime["fs"]["readFileSync"],
        mkdirSync: () => {},
        writeFileSync: () => {
          writeCount += 1;
        },
      },
    });
  
    const code = runWithDefaults(runtime, ["plan.json", "plan.json"]);
  
    expect(code).toBe(0);
    expect(errors.length).toBe(0);
  
    expect(readCount).toBe(1);
    expect(writeCount).toBe(1);
    expect(logs.filter((l) => l.includes("-> Read:")).length).toBe(1);
  });
  
  it("processes multiple unique inputs", () => {
    const planA = makeValidPlanJson({ suiteName: "Suite A", testName: "A test" });
    const planB = makeValidPlanJson({ suiteName: "Suite B", testName: "B test" });
  
    const fileContents: Record<string, string> = {
      "a.json": planA,
      "b.json": planB,
    };
  
    const writtenPaths: string[] = [];
  
    const { runtime, logs, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: ((p: Parameters<CliRuntime["fs"]["readFileSync"]>[0]) => {
          const name = runtime.path.basename(String(p));
          return fileContents[name];
        }) as unknown as CliRuntime["fs"]["readFileSync"],           
        mkdirSync: () => {},
        writeFileSync: (p) => {
          writtenPaths.push(String(p));
        },
      },
    });
  
    const code = runWithDefaults(runtime, ["a.json", "b.json"]);
  
    expect(code).toBe(0);
    expect(errors.length).toBe(0);
  
    expect(writtenPaths).toContain("tests/suite-a.spec.ts");
    expect(writtenPaths).toContain("tests/suite-b.spec.ts");
    expect(writtenPaths.length).toBe(2);
    expect(logs.filter((l) => l.includes("-> Read:")).length).toBe(2);
  });  

  it("prints a warning when a glob matches no files and then errors for missing inputs", () => {
    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
        statSync: (() => ({
          isDirectory: () => true,
          isFile: () => false,
        })) as unknown as CliRuntime["fs"]["statSync"],
        readdirSync: (() => []) as unknown as CliRuntime["fs"]["readdirSync"],
      },
    });
  
    const code = runWithDefaults(runtime, [
      "path/to/plans/nope*.json",
    ]);
  
    expect(code).toBe(1);
    expect(errors.join("\n")).toContain(
      "Warning: Glob pattern matched no files: path/to/plans/nope*.json"
    );
    expect(errors.join("\n")).toContain("Error: Missing inputs");
  });
  
  it("returns 1 and prints an error when a hidden file is passed as input", () => {
    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
      },
    });
  
    const code = runWithDefaults(runtime, ["plans/.hidden.json"]);
  
    expect(code).toBe(1);
  
    expect(errors.join("\n")).toContain("Hidden files and dirs are not allowed as inputs");
    expect(errors.join("\n")).toContain("plans/.hidden.json");
  });

  it("returns 1 and prints an error when a hidden dir is passed as input", () => {
    const { runtime, errors } = makeRuntime({
      fs: {
        existsSync: () => true,
      },
    });
  
    const code = runWithDefaults(runtime, ["tests/.hidden/plan.json"]);
  
    expect(code).toBe(1);
  
    expect(errors.join("\n")).toContain("Hidden files and dirs are not allowed as inputs");
    expect(errors.join("\n")).toContain("tests/.hidden/plan.json");
  });

  it("returns 1 and prints an error when tests dir is missing", () => {
    const { runtime, errors } = makeRuntime();

    const code = run(["node", "generate-tests.js", "--summary-dir", "summaries", "plan.json"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Missing required option: --tests-dir");
  });

  it("returns 1 and prints an error when summary dir is missing", () => {
    const { runtime, errors } = makeRuntime();

    const code = run(["node", "generate-tests.js", "--tests-dir", "tests", "plan.json"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Missing required option: --summary-dir");
  });

  it("prints usage and exits 0 when --help is provided", () => {
    const { runtime, logs, errors } = makeRuntime();

    const code = run(["node", "generate-tests.js", "--help"], runtime);

    expect(code).toBe(0);
    expect(errors.length).toBe(0);
    expect(logs.join("\n")).toContain("Usage:");
  });

  it("returns 1 and prints an error when args are invalid", () => {
    const { runtime, errors } = makeRuntime();

    const code = run(["node", "generate-tests.js", "--wat"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unknown option: --wat");
    expect(errors.join("\n")).toContain("Usage:");
  });

  it("returns 1 when input processing throws", () => {
    const { runtime, errors } = makeRuntime();

    const code = runWithDefaults(runtime, ["plans/**/bad.json"]);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unsupported: recursive glob (**)");
  });

  it("supports URL and toString inputs for existsSync", () => {
    const state = makeRuntime();
    addFile(state, "/repo/plan.json");

    const url = new URL("file:///repo/plan.json");
    expect(state.runtime.fs.existsSync(url)).toBe(true);

    const asObject = { toString: () => "/repo/plan.json" };
    expect(state.runtime.fs.existsSync(asObject as unknown as string)).toBe(true);
  });

  it("returns empty listings for unknown directories", () => {
    const state = makeRuntime();

    const result = state.runtime.fs.readdirSync("/repo/unknown");

    expect(result).toEqual([]);
  });
});

// Helper functions

function makeValidPlanJson(overrides?: Partial<{
  suiteName: string;
  testName: string;
  startUrl: string;
}>) {
  return JSON.stringify({
    suiteName: overrides?.suiteName ?? "My Suite",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: overrides?.testName ?? "Suite name",
        startUrl: overrides?.startUrl ?? "/",
        steps: [{ action: "goto", value: "/" }],
      },
    ],
  });
}
