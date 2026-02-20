import { describe, expect, it } from "vitest";
import { _joinOutDir } from "../translate-plan-to-tests";

describe("joinOutDir", () => {
  it("joins with forward slashes and trims trailing slash", () => {
    expect(_joinOutDir("tests/generated/", "suite.spec.ts")).toBe(
      "tests/generated/suite.spec.ts"
    );
  });

  it("joins with backslashes and trims trailing backslash", () => {
    expect(_joinOutDir("C:\\tests\\generated\\", "suite.spec.ts")).toBe(
      "C:\\tests\\generated\\suite.spec.ts"
    );
  });

  it("uses forward slashes when path contains forward slashes", () => {
    expect(_joinOutDir("C:/tests/generated/", "suite.spec.ts")).toBe(
      "C:/tests/generated/suite.spec.ts"
    );
  });
});
