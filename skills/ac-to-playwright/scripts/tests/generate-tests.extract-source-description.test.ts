import { describe, expect, it } from "vitest";
import { _extractSourceDescription } from "../cli/generate-tests";

describe("extractSourceDescription", () => {
  it("returns the source description when present", () => {
    const content = `
      test.describe("Suite", {
        annotation: {
          type: "source",
          description: "some-repo/path/to/file.md"
        }
      }, () => {});
    `;

    expect(_extractSourceDescription(content)).toBe("some-repo/path/to/file.md");
  });

  it("returns null when description is missing", () => {
    const content = `test.describe("Suite", {}, () => {});`;
    expect(_extractSourceDescription(content)).toBe(null);
  });

  it("returns null when description is not valid JSON", () => {
    const content = `
      test.describe("Suite", {
        annotation: {
          type: "source",
          description: "bad
line"
        }
      }, () => {});
    `;

    expect(_extractSourceDescription(content)).toBe(null);
  });
});
