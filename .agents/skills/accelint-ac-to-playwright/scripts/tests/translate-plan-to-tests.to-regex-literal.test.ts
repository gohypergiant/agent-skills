import { describe, expect, it } from "vitest";
import { _toRegexLiteral } from "../translate-plan-to-tests";

describe("_toRegexLiteral", () => {
  it("adds leading slash and path terminator", () => {
    expect(_toRegexLiteral("dashboard")).toBe("/\\/dashboard(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes forward slashes in the pattern", () => {
    expect(_toRegexLiteral("foo/bar")).toBe("/\\/foo\\/bar(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes multiple forward slashes", () => {
    expect(_toRegexLiteral("a/b/c")).toBe("/\\/a\\/b\\/c(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes regex metacharacters", () => {
    expect(_toRegexLiteral("a.b?")).toBe("/\\/a\\.b\\?(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes backslashes", () => {
    expect(_toRegexLiteral("foo\\bar")).toBe("/\\/foo\\\\bar(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes backslashes before forward slashes", () => {
    expect(_toRegexLiteral("C:\\path\\to\\file")).toBe("/\\/C:\\\\path\\\\to\\\\file(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes all special regex characters", () => {
    expect(_toRegexLiteral("^$.*+?()[]{}|")).toBe("/\\/\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("escapes combination of metacharacters and slashes", () => {
    expect(_toRegexLiteral("https://example.com/*")).toBe("/\\/https:\\/\\/example\\.com\\/\\*(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("handles empty pattern", () => {
    expect(_toRegexLiteral("")).toBe("/\\/(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("handles single slash to match only root path", () => {
    expect(_toRegexLiteral("/")).toBe("/\\/(?:\\/(?:[?#]|$)|[?#]|$)/");
  });

  it("preserves leading slash when already present", () => {
    expect(_toRegexLiteral("/dashboard")).toBe("/\\/dashboard(?:\\/(?:[?#]|$)|[?#]|$)/");
  });
});

describe("_toRegexLiteral URL matching behavior", () => {
  // Helper to convert the regex literal string (with wrapping slashes) to a RegExp
  function toRegExp(pattern: string): RegExp {
    const regexLiteral = _toRegexLiteral(pattern);
    // Strip the wrapping /.../ from the literal to get the pattern
    const regexPattern = regexLiteral.slice(1, -1);
    return new RegExp(regexPattern);
  }

  it("matches dashboard path with various endings", () => {
    const regex = toRegExp("dashboard");

    // Should match
    expect(regex.test("http://localhost:3000/dashboard")).toBe(true);
    expect(regex.test("http://localhost:3000/dashboard/")).toBe(true);
    expect(regex.test("http://localhost:3000/dashboard?tab=settings")).toBe(true);
    expect(regex.test("http://localhost:3000/dashboard#section")).toBe(true);

    // Should NOT match
    expect(regex.test("http://localhost:3000/dashboard/edit")).toBe(false);
    expect(regex.test("http://localhost:3000/home?prevloc=dashboard")).toBe(false);
    expect(regex.test("http://localhost:3000/settings#dashboard")).toBe(false);
  });

  it("matches root path correctly", () => {
    const regex = toRegExp("/");

    expect(regex.test("http://localhost:3000/")).toBe(true);
    expect(regex.test("http://localhost:3000/?x=1")).toBe(true);
    expect(regex.test("http://localhost:3000/#top")).toBe(true);
    expect(regex.test("http://localhost:3000/dashboard")).toBe(false);
  });

  it("matches nested paths without matching deeper paths", () => {
    const regex = toRegExp("/settings/profile");

    expect(regex.test("http://localhost:3000/settings/profile")).toBe(true);
    expect(regex.test("http://localhost:3000/settings/profile/")).toBe(true);
    expect(regex.test("http://localhost:3000/settings/profile?edit=true")).toBe(true);
    expect(regex.test("http://localhost:3000/settings/profile/edit")).toBe(false);
  });
});
