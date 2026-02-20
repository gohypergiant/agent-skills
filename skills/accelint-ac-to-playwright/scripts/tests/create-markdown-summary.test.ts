import { describe, expect, it } from "vitest";
import type { CliRuntime as MarkdownRuntime } from "../cli/create-markdown-summary";
import { _normalizeSummaryFile, _parseArgs, run } from "../cli/create-markdown-summary";
import { makeMarkdownRuntime } from "./summary-scripts.test-utils";

describe("parseArgs", () => {
  it("parses required args", () => {
    const result = _parseArgs([
      "--summary-json",
      "summary.json",
      "--summary-md",
      "summary.md",
    ]);
    expect(result.summaryJson).toBe("summary.json");
    expect(result.summaryMd).toBe("summary.md");
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
    const result = _parseArgs(["extra"]);
    expect(result.errors.join("\n")).toContain("Unexpected argument: extra");
  });

  it("parses --summary-json and --summary-md with equals values", () => {
    const result = _parseArgs([
      "--summary-json=summary.json",
      "--summary-md=summary.md",
    ]);
    expect(result.summaryJson).toBe("summary.json");
    expect(result.summaryMd).toBe("summary.md");
    expect(result.errors).toEqual([]);
  });

  it("returns error for missing --summary-md value", () => {
    const result = _parseArgs(["--summary-md="]);
    expect(result.errors.join("\n")).toContain("Missing value for --summary-md");
  });
});

describe("run()", () => {
  it("prints usage and exits when --help is provided", () => {
    const { runtime, logs } = makeMarkdownRuntime();

    const code = run(["node", "create-markdown-summary.js", "--help"], runtime);

    expect(code).toBe(0);
    expect(logs.join("\n")).toContain("Usage:");
  });

  it("prints usage and exits on argument parse errors", () => {
    const { runtime, errors } = makeMarkdownRuntime();

    const code = run(["node", "create-markdown-summary.js", "--wat"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unknown option: --wat");
    expect(errors.join("\n")).toContain("Usage:");
  });

  it("errors when required options are missing", () => {
    const { runtime, errors } = makeMarkdownRuntime();

    const code = run(["node", "create-markdown-summary.js"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain(
      "Error: Missing required option: --summary-json <path>"
    );
  });

  it("errors when summary JSON cannot be read", () => {
    const { runtime, errors } = makeMarkdownRuntime({
      fs: {
        readFileSync: (() => {
          throw new Error("nope");
        }) as unknown as MarkdownRuntime["fs"]["readFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "create-markdown-summary.js",
        "--summary-json",
        "summary.json",
        "--summary-md",
        "summary.md",
      ],
      runtime
    );

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Unable to read summary JSON file");
  });

  it("renders (none) when lists are empty", () => {
    const summaryPath = "summary.json";
    const markdownPath = "summary.md";

    const summaryJson = JSON.stringify({
      runDate: "2026-01-28T14:03:52Z",
      entries: [],
    });

    let writtenMarkdown = "";
    const { runtime } = makeMarkdownRuntime({
      fs: {
        readFileSync: (() => summaryJson) as unknown as MarkdownRuntime["fs"]["readFileSync"],
        writeFileSync: ((
          _p: Parameters<MarkdownRuntime["fs"]["writeFileSync"]>[0],
          data: Parameters<MarkdownRuntime["fs"]["writeFileSync"]>[1]
        ) => {
          writtenMarkdown = String(data);
        }) as unknown as MarkdownRuntime["fs"]["writeFileSync"],
      },
    });

    const code = run(
      [
        "node",
        "create-markdown-summary.js",
        "--summary-json",
        summaryPath,
        "--summary-md",
        markdownPath,
      ],
      runtime
    );

    expect(code).toBe(0);
    expect(writtenMarkdown).toContain("## Inputs: AC files");
    expect(writtenMarkdown).toContain("- (none)");
    expect(writtenMarkdown).toContain("## Outputs: Playwright test files");
    expect(writtenMarkdown).toContain("## Required test hooks");
  });

  it("renders markdown summary from JSON", () => {
    // Arrange
    const summaryPath = "summary.json";
    const markdownPath = "summary.md";

    const summaryJson = JSON.stringify({
      runDate: "2026-01-28T14:03:52Z",
      entries: [
        {
          input: "ac-1.feature",
          outputs: { plan: "plans/ac-1.json", test: "tests/ac-1.spec.ts" },
          tests: [
            { name: "Test A", requiredTestHooks: ["beta", "alpha"] },
            { name: "Test B", requiredTestHooks: ["alpha"] },
            { name: "Test Z", requiredTestHooks: ["alpha"] },
          ],
        },
        {
          input: "ac-2.md",
          outputs: { plan: "plans/ac-2.json", test: "tests/ac-2.spec.ts" },
          tests: [
            { name: "Test A", requiredTestHooks: ["alpha"] },
            { name: "Test C", requiredTestHooks: [] },
          ],
        },
      ],
    });

    let writtenMarkdown = "";
    const { runtime } = makeMarkdownRuntime({
      fs: {
        readFileSync: (() => summaryJson) as unknown as MarkdownRuntime["fs"]["readFileSync"],
        writeFileSync: ((
          _p: Parameters<MarkdownRuntime["fs"]["writeFileSync"]>[0],
          data: Parameters<MarkdownRuntime["fs"]["writeFileSync"]>[1]
        ) => {
          writtenMarkdown = String(data);
        }) as unknown as MarkdownRuntime["fs"]["writeFileSync"],
      },
    });

    // Act
    const code = run(
      [
        "node",
        "create-markdown-summary.js",
        "--summary-json",
        summaryPath,
        "--summary-md",
        markdownPath,
      ],
      runtime
    );

    // Assert
    expect(code).toBe(0);
    expect(writtenMarkdown).toContain("# Post-creation summary");
    expect(writtenMarkdown).toContain("- Run date: 2026-01-28T14:03:52Z");
    expect(writtenMarkdown).toContain("## Inputs: AC files");
    expect(writtenMarkdown).toContain("- ac-1.feature");
    expect(writtenMarkdown).toContain("- ac-2.md");
    expect(writtenMarkdown).toContain("## Outputs: Playwright test files");
    expect(writtenMarkdown).toContain("- tests/ac-1.spec.ts");
    expect(writtenMarkdown).toContain("- tests/ac-2.spec.ts");
    expect(writtenMarkdown).toContain("## Required test hooks");
    const lines = writtenMarkdown.split("\n");
    const requiredIndex = lines.findIndex(
      (line) => line === "## Required test hooks"
    );
    expect(requiredIndex).toBeGreaterThan(-1);
    const ac1Index = lines.findIndex(
      (line, index) => index > requiredIndex && line === "- tests/ac-1.spec.ts"
    );
    expect(ac1Index).toBeGreaterThan(-1);
    const ac1Lines: string[] = [];
    for (let i = ac1Index + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.startsWith("- ") && !line.startsWith("  - ")) break;
      if (line.startsWith("  - ") || line.startsWith("    - ")) {
        ac1Lines.push(line);
      }
    }
    expect(ac1Lines).toEqual([
      "  - Test A",
      "    - beta",
      "    - alpha",
      "  - Test B",
      "    - alpha",
      "  - Test Z",
      "    - alpha",
    ]);

    const ac2Index = lines.findIndex(
      (line, index) => index > requiredIndex && line === "- tests/ac-2.spec.ts"
    );
    expect(ac2Index).toBeGreaterThan(-1);
    const ac2Lines: string[] = [];
    for (let i = ac2Index + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.startsWith("- ") && !line.startsWith("  - ")) break;
      if (line.startsWith("  - ") || line.startsWith("    - ")) {
        ac2Lines.push(line);
      }
    }
    expect(ac2Lines).toEqual(["  - Test A", "    - alpha"]);
  });
});

describe("normalizeSummaryFile", () => {
  it("throws on invalid shape", () => {
    expect(() => _normalizeSummaryFile({ entries: [] }, "summary.json")).toThrow(
      "Invalid summary file format"
    );
  });

  it("throws when entries is not an array", () => {
    expect(() =>
      _normalizeSummaryFile({ runDate: "2026-01-28T14:03:52Z", entries: "nope" }, "summary.json")
    ).toThrow("Invalid summary file format");
  });
});
