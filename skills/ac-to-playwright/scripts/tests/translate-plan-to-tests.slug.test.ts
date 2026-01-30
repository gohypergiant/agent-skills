import { describe, expect, it } from "vitest";
import { _slug } from "../translate-plan-to-tests";

describe("_slug", () => {
  it("lowercases text", () => {
    expect(_slug("Hello WORLD")).toBe("hello-world");
  });

  it("replaces groups of non-alphanumeric chars with a single dash", () => {
    expect(_slug("Hello,   world!!!")).toBe("hello-world");
  });

  it("trims leading and trailing dashes", () => {
    expect(_slug("  Hello world  ")).toBe("hello-world");
    expect(_slug("---Hello world---")).toBe("hello-world");
  });

  it("collapses multiple separators into one dash", () => {
    expect(_slug("a---b___c   d")).toBe("a-b-c-d");
  });

  it("removes characters that don't map to a-z0-9 (may result in empty)", () => {
    expect(_slug("你好")).toBe("");
    expect(_slug("🚀")).toBe("");
  });

  it("handles already-slugged input", () => {
    expect(_slug("already-slugged-name")).toBe("already-slugged-name");
  });

  it("handles numeric input strings", () => {
    expect(_slug("Version 2.0")).toBe("version-2-0");
  });

  it("returns empty string for empty or whitespace-only input", () => {
    expect(_slug("")).toBe("");
    expect(_slug("   ")).toBe("");
  });
});
