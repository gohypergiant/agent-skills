import { describe, expect, it } from "vitest";
import type { CliRuntime as AppendRuntime } from "../append-json-summary-entry";
import {
  _extractHooks,
  _normalizeSummaryFile,
  _parseArgs,
  run,
} from "../append-json-summary-entry";
import { makeAppendRuntime } from "./summary-scripts.test-utils";

describe("parseArgs", () => {
  it("parses required args", () => {
    const result = _parseArgs([
      "--summary-json",
      "summary.json",
      "--input",
      "ac.feature",
      "--plan",
      "plan.json",
      "--test",
      "spec.ts",
    ]);
    expect(result.summaryJson).toBe("summary.json");
    expect(result.input).toBe("ac.feature");
    expect(result.plan).toBe("plan.json");
    expect(result.test).toBe("spec.ts");
    expect(result.errors).toEqual([]);
  });

  it("returns error for missing values", () => {
    const result = _parseArgs(["--summary-json"]);
    expect(result.errors.join("\n")).toContain("Missing value for --summary-json");
  });

  it("returns error for unknown flag", () => {
    const result = _parseArgs(["--wat"]);
    expect(result.errors.join("\n")).toContain("Unknown option: --wat");
  });

  it("returns error for unexpected argument", () => {
    const result = _parseArgs(["plan.json"]);
    expect(result.errors.join("\n")).toContain("Unexpected argument: plan.json");
  });

  it("parses --run-date with equals value", () => {
    const result = _parseArgs([
      "--summary-json=summary.json",
      "--input=ac.feature",
      "--plan=plan.json",
      "--test=spec.ts",
      "--run-date=2026-01-28T14:03:52Z",
    ]);
    expect(result.runDate).toBe("2026-01-28T14:03:52Z");
    expect(result.errors).toEqual([]);
  });

  it("returns error for missing --run-date value", () => {
    const result = _parseArgs([
      "--summary-json=summary.json",
      "--input=ac.feature",
      "--plan=plan.json",
      "--test=spec.ts",
      "--run-date=",
    ]);
    expect(result.errors.join("\n")).toContain("Missing value for --run-date");
  });
});

describe("extractHooks", () => {
  it("dedupes targets in first-seen order", () => {
    const hooks = _extractHooks([
      { action: "click", target: "alpha" },
      { action: "expectUrl", value: "/settings" },
      { action: "fill", target: "beta", value: "x" },
      { action: "click", target: "alpha" },
    ]);
    expect(hooks).toEqual(["alpha", "beta"]);
  });
});

describe("run()", () => {
  it("prints usage and exits when --help is provided", () => {
    const { runtime, logs } = makeAppendRuntime();

    const code = run(["node", "append-json-summary-entry.js", "--help"], runtime);

    expect(code).toBe(0);
    expect(logs.join("\n")).toContain("Usage:");
  });

  it("prints usage and exits on argument parse errors", () => {
    const { runtime, errors } = makeAppendRuntime();

    const code = run(["node", "append-json-summary-entry.js", "--wat"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unknown option: --wat");
    expect(errors.join("\n")).toContain("Usage:");
  });

  it("errors when required options are missing", () => {
    const { runtime, errors } = makeAppendRuntime();

    const code = run(["node", "append-json-summary-entry.js"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain(
      "Error: Missing required option: --summary-json <path>"
    );
  });

  it("errors when plan file cannot be read", () => {
    const { runtime, errors } = makeAppendRuntime({
      fs: {
        readFileSync: (() => {
          throw new Error("nope");
        }) as unknown as AppendRuntime["fs"]["readFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "append-json-summary-entry.js",
        "--summary-json",
        "summary.json",
        "--input",
        "ac.feature",
        "--plan",
        "plan.json",
        "--test",
        "spec.ts",
      ],
      runtime
    );

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unable to read plan file");
  });

  it("errors when plan file has invalid JSON", () => {
    const { runtime, errors } = makeAppendRuntime({
      fs: {
        readFileSync: (() => "{ not json }") as unknown as AppendRuntime["fs"]["readFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "append-json-summary-entry.js",
        "--summary-json",
        "summary.json",
        "--input",
        "ac.feature",
        "--plan",
        "plan.json",
        "--test",
        "spec.ts",
      ],
      runtime
    );

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Invalid JSON in plan file");
  });

  it("errors when plan file fails schema validation", () => {
    const invalidPlan = JSON.stringify({
      suiteName: "Suite",
      tests: [{ name: "Test A", steps: [] }],
    });

    const { runtime, errors } = makeAppendRuntime({
      fs: {
        readFileSync: (() => invalidPlan) as unknown as AppendRuntime["fs"]["readFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "append-json-summary-entry.js",
        "--summary-json",
        "summary.json",
        "--input",
        "ac.feature",
        "--plan",
        "plan.json",
        "--test",
        "spec.ts",
      ],
      runtime
    );

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Invalid test suite in plan file");
  });

  it("errors when existing summary JSON is invalid", () => {
    const validPlan = JSON.stringify({
      suiteName: "Suite",
      source: { repo: "some-repo", path: "path/to/ac.feature" },
      tests: [{ name: "Test A", startUrl: "/", steps: [{ action: "click", target: "a" }] }],
    });

    const { runtime, errors } = makeAppendRuntime({
      fs: {
        existsSync: () => true,
        readFileSync: ((p: Parameters<AppendRuntime["fs"]["readFileSync"]>[0]) => {
          if (String(p) === "summary.json") return "{ nope }";
          return validPlan;
        }) as unknown as AppendRuntime["fs"]["readFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "append-json-summary-entry.js",
        "--summary-json",
        "summary.json",
        "--input",
        "ac.feature",
        "--plan",
        "plan.json",
        "--test",
        "spec.ts",
      ],
      runtime
    );

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unable to parse existing summary file");
  });

  it("creates a new summary file when missing", () => {
    const planPath = "plan.json";
    const summaryPath = "summary.json";
    const inputPath = "ac.feature";
    const testPath = "spec.ts";
    const runDate = "2026-01-28T14:03:52Z";

    const validPlan = JSON.stringify({
      suiteName: "Suite",
      source: { repo: "some-repo", path: "path/to/ac.feature" },
      tests: [
        {
          name: "Test A",
          startUrl: "/",
          steps: [
            { action: "click", target: "login-button" },
            { action: "expectUrl", value: "/home" },
            { action: "fill", target: "email-input", value: "a@b.com" },
          ],
        },
      ],
    });

    let writtenJson = "";
    const { runtime, errors } = makeAppendRuntime({
      fs: {
        existsSync: (p: Parameters<AppendRuntime["fs"]["existsSync"]>[0]) =>
          String(p) !== summaryPath,
        readFileSync: ((p: Parameters<AppendRuntime["fs"]["readFileSync"]>[0]) => {
          if (String(p) === planPath) return validPlan;
          throw new Error("Unexpected read");
        }) as unknown as AppendRuntime["fs"]["readFileSync"],
        writeFileSync: ((
          _p: Parameters<AppendRuntime["fs"]["writeFileSync"]>[0],
          data: Parameters<AppendRuntime["fs"]["writeFileSync"]>[1]
        ) => {
          writtenJson = String(data);
        }) as unknown as AppendRuntime["fs"]["writeFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "append-json-summary-entry.js",
        "--summary-json",
        summaryPath,
        "--input",
        inputPath,
        "--plan",
        planPath,
        "--test",
        testPath,
        "--run-date",
        runDate,
      ],
      runtime
    );

    expect(code).toBe(0);
    expect(errors.length).toBe(0);

    const parsed = JSON.parse(writtenJson);
    expect(parsed.runDate).toBe(runDate);
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.entries[0].input).toBe(inputPath);
    expect(parsed.entries[0].outputs.plan).toBe(planPath);
    expect(parsed.entries[0].outputs.test).toBe(testPath);
    expect(parsed.entries[0].tests[0].requiredTestHooks).toEqual([
      "login-button",
      "email-input",
    ]);
  });

  it("appends to an existing summary file", () => {
    const planPath = "plan.json";
    const summaryPath = "summary.json";
    const inputPath = "ac.feature";
    const testPath = "spec.ts";

    const existingSummary = JSON.stringify({
      runDate: "2026-01-28T14:03:52Z",
      entries: [
        {
          input: "existing.feature",
          outputs: { plan: "existing.json", test: "existing.spec.ts" },
          tests: [{ name: "Existing", requiredTestHooks: [] }],
        },
      ],
    });

    const validPlan = JSON.stringify({
      suiteName: "Suite",
      source: { repo: "some-repo", path: "path/to/ac.feature" },
      tests: [
        {
          name: "Test A",
          startUrl: "/",
          steps: [{ action: "click", target: "login-button" }],
        },
      ],
    });

    let writtenJson = "";
    const { runtime } = makeAppendRuntime({
      fs: {
        existsSync: (p: Parameters<AppendRuntime["fs"]["existsSync"]>[0]) =>
          String(p) === summaryPath,
        readFileSync: ((p: Parameters<AppendRuntime["fs"]["readFileSync"]>[0]) => {
          if (String(p) === summaryPath) return existingSummary;
          if (String(p) === planPath) return validPlan;
          throw new Error("Unexpected read");
        }) as unknown as AppendRuntime["fs"]["readFileSync"],
        writeFileSync: ((
          _p: Parameters<AppendRuntime["fs"]["writeFileSync"]>[0],
          data: Parameters<AppendRuntime["fs"]["writeFileSync"]>[1]
        ) => {
          writtenJson = String(data);
        }) as unknown as AppendRuntime["fs"]["writeFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "append-json-summary-entry.js",
        "--summary-json",
        summaryPath,
        "--input",
        inputPath,
        "--plan",
        planPath,
        "--test",
        testPath,
      ],
      runtime
    );

    expect(code).toBe(0);

    const parsed = JSON.parse(writtenJson);
    expect(parsed.entries).toHaveLength(2);
    expect(parsed.entries[1].input).toBe(inputPath);
  });
});

describe("normalizeSummaryFile", () => {
  it("throws on invalid shape", () => {
    expect(() => _normalizeSummaryFile({ runDate: 123 }, "summary.json")).toThrow(
      "Invalid summary file format"
    );
  });

  it("throws when entries is not an array", () => {
    expect(() =>
      _normalizeSummaryFile({ runDate: "2026-01-28T14:03:52Z", entries: "nope" }, "summary.json")
    ).toThrow("Invalid summary file format");
  });
});
