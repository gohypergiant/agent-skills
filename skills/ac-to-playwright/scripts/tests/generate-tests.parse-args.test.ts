import { describe, expect, it } from "vitest";
import { _parseArgs } from "../generate-tests";

const baseArgs = ["plan.json", "--tests-dir", "tests", "--summary-dir", "summaries"];

function parseWithDefaults(extras: string[] = []) {
  return _parseArgs([...baseArgs, ...extras]);
}

describe("parseArgs", () => {
  it("parses --tests-dir with separate value", () => {
    const result = parseWithDefaults();
    expect(result.testsDir).toBe("tests");
    expect(result.summaryDir).toBe("summaries");
    expect(result.inputs).toEqual(["plan.json"]);
    expect(result.errors).toEqual([]);
    expect(result.help).toBe(false);
  });

  it("parses --tests-dir with equals value", () => {
    const result = _parseArgs(["plan.json", "--tests-dir=tests", "--summary-dir=summaries"]);
    expect(result.testsDir).toBe("tests");
    expect(result.summaryDir).toBe("summaries");
    expect(result.inputs).toEqual(["plan.json"]);
    expect(result.errors).toEqual([]);
  });

  it("allows --tests-dir after inputs", () => {
    const result = _parseArgs([
      "plan.json",
      "other.json",
      "--tests-dir",
      "out",
      "--summary-dir",
      "summaries",
    ]);
    expect(result.testsDir).toBe("out");
    expect(result.summaryDir).toBe("summaries");
    expect(result.inputs).toEqual(["plan.json", "other.json"]);
  });

  it("returns error for missing tests dir value", () => {
    const result = _parseArgs(["plan.json", "--tests-dir"]);
    expect(result.errors.join("\n")).toContain("Missing value for --tests-dir");
  });

  it("returns error for missing summary dir value", () => {
    const result = _parseArgs(["plan.json", "--summary-dir"]);
    expect(result.errors.join("\n")).toContain("Missing value for --summary-dir");
  });

  it("returns error for unknown flags", () => {
    const result = _parseArgs(["--wat"]);
    expect(result.errors.join("\n")).toContain("Unknown option: --wat");
  });

  it("parses --summary-dir with separate value", () => {
    const result = parseWithDefaults();
    expect(result.summaryDir).toBe("summaries");
    expect(result.errors).toEqual([]);
  });

  it("parses --summary-dir with equals value", () => {
    const result = _parseArgs(["plan.json", "--tests-dir", "tests", "--summary-dir=summaries"]);
    expect(result.summaryDir).toBe("summaries");
    expect(result.errors).toEqual([]);
  });

  it("sets help when --help is provided", () => {
    const result = _parseArgs(["--help"]);
    expect(result.help).toBe(true);
  });
});
