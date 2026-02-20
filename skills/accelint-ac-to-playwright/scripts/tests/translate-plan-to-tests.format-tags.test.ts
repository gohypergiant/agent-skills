import { describe, expect, it } from "vitest";
import { _formatTags } from "../translate-plan-to-tests";

describe("formatTags", () => {
  it("returns a single tag as a string literal", () => {
    expect(_formatTags(["@slow"])).toBe("\"@slow\"");
  });

  it("returns multiple tags as an array literal with spaces", () => {
    expect(_formatTags(["@fast", "@smoke"])).toBe("[\"@fast\", \"@smoke\"]");
  });
});
