import { describe, expect, it } from "vitest";
import { _translateSingleTest, type Test } from "../translate-plan-to-tests";

describe("_translateSingleTest", () => {
  it("wraps the test in a playwright test() block and navigation to startUrl", () => {
    const testInput: Test = {
      name: "happy path",
      startUrl: "https://example.com",
      steps: [{ type: "action", action: "goto", value: "https://example.com/foo" }],
    };

    const out = _translateSingleTest(testInput);

    expect(out).toContain(`test("happy path", async ({ page: initialPage, context }, testInfo) => {`);
    expect(out).toContain(`let page = initialPage;`);
    expect(out).toContain(`await page.goto("https://example.com");`);
    expect(out).toContain(`await page.goto("https://example.com/foo");`);
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
        { type: "action", action: "goto", value: "/one" },
        { type: "assertion", action: "expectUrl", value: "one" },
      ],
    };

    const out = _translateSingleTest(testInput);

    const first = out.indexOf(`await page.goto("/one");`);
    const second = out.indexOf(`toHaveURL(/\\/one(?:\\/(?:[?#]|$)|[?#]|$)/);`);

    expect(first).toBeGreaterThan(-1);
    expect(second).toBeGreaterThan(-1);
    expect(first).toBeLessThan(second);

    expect(out).toMatch(/\n\n\s+tracker\.setStep\(1\);\n\s+try \{\n\s+await page\.goto\("\/one"\);/);
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

  it("sets up a new-tab listener before the step preceding switchTab(new)", () => {
    const testInput: Test = {
      name: "opens settings in new tab",
      startUrl: "/",
      steps: [
        { type: "action", action: "click", target: "nav.link.settings" },
        { type: "action", action: "switchTab", tabIdentifier: "new" },
      ],
    };

    const out = _translateSingleTest(testInput);

    expect(out).toContain(`let newTabPagePromise: Promise<Page> | undefined;`);

    const listenerSetupIndex = out.indexOf(`newTabPagePromise = context.waitForEvent("page");`);
    const clickIndex = out.indexOf(`await page.getByTestId("nav.link.settings").click();`);
    const switchIndex = out.indexOf(`const newPage = await newTabPagePromise;`);

    expect(listenerSetupIndex).toBeGreaterThan(-1);
    expect(listenerSetupIndex).toBeLessThan(clickIndex);
    expect(clickIndex).toBeLessThan(switchIndex);
  });

  it("does not declare newTabPagePromise when there is no switchTab(new) step", () => {
    const testInput: Test = {
      name: "no tab switch",
      startUrl: "/",
      steps: [{ type: "action", action: "goto", value: "/foo" }],
    };

    const out = _translateSingleTest(testInput);

    expect(out).not.toContain("newTabPagePromise");
  });

  it("sets up a fresh new-tab listener before each switchTab(new) occurrence", () => {
    const testInput: Test = {
      name: "opens two new tabs in sequence",
      startUrl: "/",
      steps: [
        { type: "action", action: "click", target: "nav.link.a" },
        { type: "action", action: "switchTab", tabIdentifier: "new" },
        { type: "action", action: "click", target: "nav.link.b" },
        { type: "action", action: "switchTab", tabIdentifier: "new" },
      ],
    };

    const out = _translateSingleTest(testInput);

    const listenerSetups = [...out.matchAll(/newTabPagePromise = context\.waitForEvent\("page"\);/g)];
    expect(listenerSetups).toHaveLength(2);

    const firstClickIndex = out.indexOf(`await page.getByTestId("nav.link.a").click();`);
    const secondClickIndex = out.indexOf(`await page.getByTestId("nav.link.b").click();`);
    const firstSetupIndex = out.indexOf(`newTabPagePromise = context.waitForEvent("page");`);
    const secondSetupIndex = out.indexOf(
      `newTabPagePromise = context.waitForEvent("page");`,
      firstSetupIndex + 1
    );

    expect(firstSetupIndex).toBeLessThan(firstClickIndex);
    expect(secondSetupIndex).toBeGreaterThan(firstClickIndex);
    expect(secondSetupIndex).toBeLessThan(secondClickIndex);
  });

  it("throws if switchTab is the first step, regardless of tab identifier", () => {
    const newTabFirst: Test = {
      name: "bad plan - new",
      startUrl: "/",
      steps: [{ type: "action", action: "switchTab", tabIdentifier: "new" }],
    };
    const firstTabFirst: Test = {
      name: "bad plan - first",
      startUrl: "/",
      steps: [{ type: "action", action: "switchTab", tabIdentifier: "first" }],
    };

    expect(() => _translateSingleTest(newTabFirst)).toThrow(/switchTab cannot be the first step/);
    expect(() => _translateSingleTest(firstTabFirst)).toThrow(/switchTab cannot be the first step/);
  });
});
