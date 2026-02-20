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

  it("escapes regex metacharacters", () => {
    expect(_toRegexLiteral("a.b?")).toBe("/a\\.b\\?/");
  });

  it("escapes backslashes", () => {
    expect(_toRegexLiteral("foo\\bar")).toBe("/foo\\\\bar/");
  });

  it("escapes backslashes before forward slashes", () => {
    expect(_toRegexLiteral("C:\\path\\to\\file")).toBe("/C:\\\\path\\\\to\\\\file/");
  });

  it("escapes all special regex characters", () => {
    expect(_toRegexLiteral("^$.*+?()[]{}|")).toBe("/\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|/");
  });

  it("escapes combination of metacharacters and slashes", () => {
    expect(_toRegexLiteral("https://example.com/*")).toBe("/https:\\/\\/example\\.com\\/\\*/");
  });

  it("handles empty pattern", () => {
    expect(_toRegexLiteral("")).toBe("//");
  });
});
