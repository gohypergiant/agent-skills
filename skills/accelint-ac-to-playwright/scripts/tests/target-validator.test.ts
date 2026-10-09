import { describe, expect, it } from "vitest";
import { validateTargetArray } from "../target-validator";

describe("validateTargetArray", () => {
  it("returns empty valid/invalid arrays for an empty input", () => {
    const result = validateTargetArray([]);
    expect(result.valid).toEqual([]);
    expect(result.invalid).toEqual([]);
  });

  it("places all-valid targets into valid, leaving invalid empty", () => {
    const items = [
      { line: 1, target: "form.input.focus-state" },
      { line: 2, target: "nav.button.click" },
    ];
    const result = validateTargetArray(items);
    expect(result.valid).toEqual(items);
    expect(result.invalid).toEqual([]);
  });

  it("places all-invalid targets into invalid, leaving valid empty", () => {
    const items = [
      { line: 1, target: "bogus.input.focus-state" },
      { line: 2, target: "nav.bogus.click" },
    ];
    const result = validateTargetArray(items);
    expect(result.valid).toEqual([]);
    expect(result.invalid).toHaveLength(2);
  });

  it("partitions a mix of valid and invalid targets, preserving order", () => {
    const items = [
      { line: 1, target: "form.input.focus-state" },
      { line: 2, target: "bogus.input.focus-state" },
      { line: 3, target: "nav.button.click" },
    ];
    const result = validateTargetArray(items);
    expect(result.valid).toEqual([items[0], items[2]]);
    expect(result.invalid).toHaveLength(1);
    expect(result.invalid[0]).toMatchObject({ line: 2, target: "bogus.input.focus-state" });
  });

  it("attaches the schema's error message to invalid items", () => {
    const items = [{ line: 1, target: "bogus.input.focus-state" }];
    const result = validateTargetArray(items);
    expect(result.invalid[0].error).toContain("Invalid area keyword");
  });

  it("preserves the original line and target fields on both valid and invalid items", () => {
    const items = [
      { line: 7, target: "form.input.focus-state" },
      { line: 9, target: "bogus.input.focus-state" },
    ];
    const result = validateTargetArray(items);
    expect(result.valid[0].line).toBe(7);
    expect(result.valid[0].target).toBe("form.input.focus-state");
    expect(result.invalid[0].line).toBe(9);
    expect(result.invalid[0].target).toBe("bogus.input.focus-state");
  });
});
