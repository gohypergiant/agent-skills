import { describe, expect, it } from "vitest";
import { _translateSingleTest, type Test } from "../translate-plan-to-tests";

describe("_translateSingleTest", () => {
  it("wraps the test in a playwright test() block and initial navigation to startUrl", () => {
    const testInput: Test = {
      name: "happy path",
      startUrl: "https://example.com",
      steps: [{ type: "action", action: "click", target: "page.button.continue" }],
    };

    const out = _translateSingleTest(testInput);

    expect(out).toContain(`test("happy path", async ({ page }, testInfo) => {`);
    expect(out).toContain(`await page.goto("https://example.com");`);
    expect(out).toContain(`await page.getByTestId("page.button.continue").click();`);
    expect(out).toContain(`});`);
  });
  it("includes a single tag when it is present", () => {
    const testInput: Test = {
      name: "tagged test",
      startUrl: "/",
      tags: ["@fast"],
      steps: [{ type: "assertion", action: "expectUrl", value: "/" }],
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
      steps: [{ type: "assertion", action: "expectUrl", value: "/" }],
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
        { type: "action", action: "click", target: "page.button.one" },
        { type: "assertion", action: "expectUrl", value: "one" },
      ],
    };

    const out = _translateSingleTest(testInput);

    const first = out.indexOf(`await page.getByTestId("page.button.one").click();`);
    const second = out.indexOf(`toHaveURL(/\\/one(?:\\/(?:[?#]|$)|[?#]|$)/);`);

    expect(first).toBeGreaterThan(-1);
    expect(second).toBeGreaterThan(-1);
    expect(first).toBeLessThan(second);

    expect(out).toMatch(/\n\n\s+tracker\.setStep\(1\);\n\s+try \{\n\s+await expect\(page\.getByTestId\("page\.button\.one"\)\)\.toHaveCount\(1\);/);
  });
  it("includes a trailing blank line at the end", () => {
    const testInput: Test = {
      name: "formatting",
      startUrl: "/",
      steps: [{ type: "assertion", action: "expectUrl", value: "x" }],
    };

    const out = _translateSingleTest(testInput);

    expect(out.endsWith("\n")).toBe(true);
  });
});
