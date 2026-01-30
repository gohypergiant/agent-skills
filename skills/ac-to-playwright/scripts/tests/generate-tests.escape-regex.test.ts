import { describe, expect, it } from "vitest";
import { _escapeRegex } from "../generate-tests"; 

describe("escapeRegex", () => {
  it("returns the same string when there are no regex metacharacters", () => {
    expect(_escapeRegex("abcDEF123_-/:")).toBe("abcDEF123_-/:");
  });

  it("escapes common regex metacharacters", () => {
    expect(_escapeRegex("a.b")).toBe("a\\.b");
    expect(_escapeRegex("a*b")).toBe("a\\*b");
    expect(_escapeRegex("a+b")).toBe("a\\+b");
    expect(_escapeRegex("a^b")).toBe("a\\^b");
    expect(_escapeRegex("a$b")).toBe("a\\$b");
  });

  it("escapes braces, parentheses, brackets, and pipes", () => {
    expect(_escapeRegex("{a}")).toBe("\\{a\\}");
    expect(_escapeRegex("(a)")).toBe("\\(a\\)");
    expect(_escapeRegex("[a]")).toBe("\\[a\\]");
    expect(_escapeRegex("a|b")).toBe("a\\|b");
  });

  it("escapes backslashes", () => {
    expect(_escapeRegex("a\\b")).toBe("a\\\\b");
  });

  it("escapes a string containing all supported metacharacters", () => {
    const input = ".*+^$}{()|[]\\";
    const expected = "\\.\\*\\+\\^\\$\\}\\{\\(\\)\\|\\[\\]\\\\";
    expect(_escapeRegex(input)).toBe(expected);
  });

  it("escapes mixed strings correctly", () => {
    expect(_escapeRegex("file(1).json")).toBe("file\\(1\\)\\.json");
    expect(_escapeRegex("path\\to\\file[1].json")).toBe("path\\\\to\\\\file\\[1\\]\\.json");
  });
});
