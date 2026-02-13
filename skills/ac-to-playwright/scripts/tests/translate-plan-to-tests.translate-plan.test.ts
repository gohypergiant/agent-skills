import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { type PlanFile, translatePlan } from "../translate-plan-to-tests";

describe("translatePlan (golden file)", () => {
  it("generates the expected Playwright spec output", () => {
    const plan: PlanFile = {
      suiteName: "Golden file test",
      tags: ["@smoke", "@fast"],
      source: {
        repo: "some-repo",
        path: "acceptance/golden-file-test.feature",
      },
      tests: [
        {
          name: "happy path",
          startUrl: "https://example.com",
          tags: ["@wip"],
          steps: [
            { action: "click", target: "login.form.login" },
            { action: "fill", target: "login.form.email", value: "a@b.com" },
            { action: "expectText", target: "login.header.h1", value: "Welcome" },
            { action: "expectUrl", value: "dashboard" },
          ],
        },
      ],
    };
    
    const result = translatePlan(plan, { outDir: "tests/generated" });
    expect(result.path).toBe("tests/generated/golden-file-test.spec.ts");
    
    const normalize = (s: string) => `${s.replace(/\r\n/g, "\n").trimEnd()}\n`;
    const actual = normalize(result.content);
    const expected = normalize(readFixture("golden-file-test.expected.txt"));
    expect(actual).toBe(expected);
  });
});

describe("translatePlan - suiteName validation", () => {
  it("throws when slug(suiteName) is empty", () => {
    const plan: PlanFile = {
      suiteName: "🚀🚀🚀",
      source: {
        repo: "external",
        path: "invalid-suite.feature",
      },
      tests: [
        {
          name: "Test name",
          startUrl: "https://example.com",
          steps: [{ action: "goto", value: "https://example.com" }],
        },
      ],
    };

    expect(() => translatePlan(plan, { outDir: "tests/generated" })).toThrow(
      /Invalid suiteName:.*must contain at least one alphanumeric/i
    );
  });
});

describe("translatePlan - source annotation", () => {
  it("formats external source descriptions with the external prefix", () => {
    const plan: PlanFile = {
      suiteName: "External suite",
      source: {
        repo: "external",
        path: "outside.feature",
      },
      tests: [
        {
          name: "Test name",
          startUrl: "https://example.com",
          steps: [{ action: "goto", value: "https://example.com" }],
        },
      ],
    };

    const result = translatePlan(plan, { outDir: "tests/generated" });
    expect(result.content).toContain(`annotation: {`);
    expect(result.content).toContain(`type: "source",`);
    expect(result.content).toContain(`description: "external file: outside.feature"`);
  });
});

// Helper functions

function readFixture(name: string) {
  return readFileSync(resolve(__dirname, "..", "fixtures", name), "utf8");
}
