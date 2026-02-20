import { describe, expect, it } from "vitest";
import { _translateSingleTest, type Test } from "../translate-plan-to-tests";

describe("_translateSingleTest", () => {
  it("wraps the test in a playwright test() block and navigation to startUrl", () => {
    const testInput: Test = {
      name: "happy path",
      startUrl: "https://example.com",
      steps: [{ action: "goto", value: "https://example.com/foo" }],
    };

    const out = _translateSingleTest(testInput);

    expect(out).toContain(`test("happy path", async ({ page }, testInfo) => {`);
    expect(out).toContain(`await page.goto("https://example.com");`);
    expect(out).toContain(`await page.goto("https://example.com/foo");`);
    expect(out).toContain(`});`);
  });

  it("includes a single tag when it is present", () => {
    const testInput: Test = {
      name: "tagged test",
      startUrl: "/",
      tags: ["@fast"],
      steps: [{ action: "expectUrl", value: "/" }],
    };
  
    const out = _translateSingleTest(testInput);
    expect(out).toContain(`test("tagged test", {`);
    expect(out).toContain(`tag: "@fast"`);
    
  });
  
  it("includes multiple tags when they are present", () => {
    const testInput: Test = {
      name: "tagged test",
      startUrl: "/",
      tags: ["@fast", "@smoke"],
      steps: [{ action: "expectUrl", value: "/" }],
    };
  
    const out = _translateSingleTest(testInput);
    expect(out).toContain(`test("tagged test", {`);
    expect(out).toContain(`tag: ["@fast", "@smoke"]`);    
  });

  it("renders each step in order with a blank line before each step", () => {
    const testInput: Test = {
      name: "order matters",
      startUrl: "/",
      steps: [
        { action: "goto", value: "/one" },
        { action: "expectUrl", value: "one" },
      ],
    };

    const out = _translateSingleTest(testInput);

    const first = out.indexOf(`await page.goto("/one");`);
    const second = out.indexOf(`toHaveURL(/one/);`);

    expect(first).toBeGreaterThan(-1);
    expect(second).toBeGreaterThan(-1);
    expect(first).toBeLessThan(second);

    expect(out).toMatch(/\n\n\s+try \{\n\s+await page\.goto\("\/one"\);/);
  });

  it("includes a trailing blank line at the end", () => {
    const testInput: Test = {
      name: "formatting",
      startUrl: "/",
      steps: [{ action: "expectUrl", value: "x" }],
    };

    const out = _translateSingleTest(testInput);

    expect(out.endsWith("\n")).toBe(true);
  });
});
