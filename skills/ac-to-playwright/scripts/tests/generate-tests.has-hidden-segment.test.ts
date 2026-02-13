import { describe, expect, it } from "vitest";
import { _hasHiddenSegment } from "../generate-tests"; 

describe("hasHiddenSegment", () => {
  it("returns false for normal paths", () => {
    expect(_hasHiddenSegment("path/to/plans/a.json")).toBe(false);
    expect(_hasHiddenSegment("path/to/plans/subdir/a.json")).toBe(false);
  });

  it("returns true for dotfiles", () => {
    expect(_hasHiddenSegment(".a.json")).toBe(true);
    expect(_hasHiddenSegment("path/to/plans/.a.json")).toBe(true);
  });

  it("returns true for dot directories", () => {
    expect(_hasHiddenSegment(".plans/a.json")).toBe(true);
    expect(_hasHiddenSegment("tests/.plans/a.json")).toBe(true);
    expect(_hasHiddenSegment("path/to/plans/.hidden/a.json")).toBe(true);
    expect(_hasHiddenSegment("tests/.plans/.a.json")).toBe(true);
  });

  it("returns false for relative path markers '.' and '..'", () => {
    expect(_hasHiddenSegment("./path/to/plans/a.json")).toBe(false);
    expect(_hasHiddenSegment("../path/to/plans/a.json")).toBe(false);
    expect(_hasHiddenSegment("../../path/to/plans/a.json")).toBe(false);
  });

  it("handles Windows-style paths", () => {
    expect(_hasHiddenSegment("tests\\plans\\a.json")).toBe(false);
    expect(_hasHiddenSegment("tests\\plans\\.hidden\\a.json")).toBe(true);
    expect(_hasHiddenSegment(".hidden\\a.json")).toBe(true);
  });

  it("returns true when any segment is hidden", () => {
    expect(_hasHiddenSegment("tests/.hidden/plans/a.json")).toBe(true);
    expect(_hasHiddenSegment("path/to/plans/.hidden/a.json")).toBe(true);
    expect(_hasHiddenSegment("./path/to/plans/.hidden/a.json")).toBe(true);
    expect(_hasHiddenSegment("../path/to/plans/.hidden/a.json")).toBe(true);
  });

  it("handles absolute paths", () => {
    expect(_hasHiddenSegment("/tmp/path/to/plans/a.json")).toBe(false);
    expect(_hasHiddenSegment("/tmp/tests/.plans/a.json")).toBe(true);
    expect(_hasHiddenSegment("C:\\tmp\\tests\\plans\\a.json")).toBe(false);
    expect(_hasHiddenSegment("C:\\tmp\\tests\\.plans\\a.json")).toBe(true);
  });
});
