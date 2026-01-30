import { describe, expect, it } from "vitest";
import { _toRegexLiteral } from "../translate-plan-to-tests";

describe("_toRegexLiteral", () => {
  it("wraps the pattern in forward slashes", () => {
    expect(_toRegexLiteral("dashboard")).toBe("/dashboard/");
  });

  it("escapes forward slashes in the pattern", () => {
    expect(_toRegexLiteral("foo/bar")).toBe("/foo\\/bar/");
  });

  it("escapes multiple forward slashes", () => {
    expect(_toRegexLiteral("a/b/c")).toBe("/a\\/b\\/c/");
  });

  it("preserves other characters", () => {
    expect(_toRegexLiteral("a.b?")).toBe("/a.b?/");
  });

  it("handles empty pattern", () => {
    expect(_toRegexLiteral("")).toBe("//");
  });
});
