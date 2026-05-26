import { describe, expect, it } from "vitest";
import { _renderStep, type Step } from "../translate-plan-to-tests";

describe("renderStep", () => {
  it.each<[Step, number, string[]]>([
    [
      { type: "action", action: "click", target: "#btn" },
      3,
      [
        'await expect(page.getByTestId("#btn")).toHaveCount(1);',
        'await page.getByTestId("#btn").click();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "click", testId: "#btn" })'
      ],
    ],
    [
      { type: "action", action: "doubleClick", x: 100, y: 200, button: "left" },
      4,
      [
        'await page.mouse.dblclick(100, 200);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "doubleClick" })'
      ],
    ],
    [
      { type: "action", action: "doubleClick", x: 50, y: 75, button: "right" },
      5,
      [
        'await page.mouse.dblclick(50, 75, { button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "doubleClick" })'
      ],
    ],
    [
      { type: "action", action: "drag", fromX: 100, fromY: 100, toX: 200, toY: 200, button: "left" },
      6,
      [
        'await page.mouse.move(100, 100);',
        'await page.mouse.down();',
        'await page.mouse.move(200, 200);',
        'await page.mouse.up();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "drag" })'
      ],
    ],
    [
      { type: "action", action: "drag", fromX: 50, fromY: 75, toX: 150, toY: 200, button: "right" },
      7,
      [
        'await page.mouse.move(50, 75);',
        'await page.mouse.down({ button: "right" });',
        'await page.mouse.move(150, 200);',
        'await page.mouse.up({ button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "drag" })'
      ],
    ],
    [
      { type: "action", action: "drag", fromX: 10, fromY: 20, toX: 30, toY: 40, button: "middle" },
      8,
      [
        'await page.mouse.move(10, 20);',
        'await page.mouse.down({ button: "middle" });',
        'await page.mouse.move(30, 40);',
        'await page.mouse.up({ button: "middle" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 8, action: "drag" })'
      ],
    ],
    [
      { type: "assertion", action: "expectNotVisible", target: "#modal" },
      1,
      [
        'try {',
        'await expect(page.getByTestId("#modal")).toHaveCount(0);',
        '} catch {',
        'await expect(page.getByTestId("#modal")).toHaveCount(1);',
        'await expect(page.getByTestId("#modal")).not.toBeVisible();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectNotVisible", testId: "#modal" })'
      ],
    ],
    [
      { type: "assertion", action: "expectVisible", target: "#modal" },
      2,
      [
        'await expect(page.getByTestId("#modal")).toHaveCount(1);',
        'await expect(page.getByTestId("#modal")).toBeVisible();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectVisible", testId: "#modal" })'
      ],
    ],
    [
      { type: "assertion", action: "expectText", target: "#msg", value: "Hello" },
      4,
      [
        'await expect(page.getByTestId("#msg")).toHaveCount(1);',
        'await expect(page.getByTestId("#msg")).toContainText("Hello");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "expectText", testId: "#msg" })'
      ],
    ],
    [
      { type: "action", action: "fill", target: "#email", value: "a@b.com" },
      5,
      [
        'await expect(page.getByTestId("#email")).toHaveCount(1);',
        'await page.getByTestId("#email").fill("a@b.com");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "fill", testId: "#email" })'
      ],
    ],
    [
      { type: "action", action: "select", target: "#role", value: "admin" },
      6,
      [
        'await expect(page.getByTestId("#role")).toHaveCount(1);',
        'await page.getByTestId("#role").selectOption("admin");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "select", testId: "#role" })'
      ],
    ],
    [
      { type: "action", action: "goto", value: "https://example.com" },
      1,
      [
        'await page.goto("https://example.com");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "goto" })'
      ],
    ],
    [
      { type: "action", action: "hover", target: "#tooltip-trigger" },
      3,
      [
        'await expect(page.getByTestId("#tooltip-trigger")).toHaveCount(1);',
        'await page.getByTestId("#tooltip-trigger").hover();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "hover", testId: "#tooltip-trigger" })'
      ],
    ],
    [
      { type: "action", action: "reload" },
      2,
      [
        'await page.reload();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "reload" })'
      ],
    ],
    [
      { type: "assertion", action: "expectUrl", value: "dashboard" },
      1,
      [
        "await expect(page).toHaveURL(/\\/dashboard(?:\\/(?:[?#]|$)|[?#]|$)/);",
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectUrl" })'
      ],
    ],
    [
      { type: "action", action: "mouseClick", x: 100, y: 200, button: "left" },
      1,
      [
        'await page.mouse.click(100, 200);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "mouseClick" })'
      ],
    ],
    [
      { type: "action", action: "mouseClick", x: 50, y: 75, button: "right" },
      2,
      [
        'await page.mouse.click(50, 75, { button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "mouseClick" })'
      ],
    ],
    [
      { type: "action", action: "mouseDown", button: "left" },
      3,
      [
        'await page.mouse.down();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "mouseDown" })'
      ],
    ],
    [
      { type: "action", action: "mouseDown", button: "middle" },
      4,
      [
        'await page.mouse.down({ button: "middle" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "mouseDown" })'
      ],
    ],
    [
      { type: "action", action: "mouseMove", x: 150, y: 250 },
      5,
      [
        'await page.mouse.move(150, 250);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "mouseMove" })'
      ],
    ],
    [
      { type: "action", action: "mouseUp", button: "left" },
      6,
      [
        'await page.mouse.up();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "mouseUp" })'
      ],
    ],
    [
      { type: "action", action: "mouseUp", button: "right" },
      7,
      [
        'await page.mouse.up({ button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "mouseUp" })'
      ],
    ],
    [
      { type: "action", action: "scroll", direction: "down", amount: 100 },
      8,
      [
        'await page.mouse.wheel(0, 100);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 8, action: "scroll" })'
      ],
    ],
    [
      { type: "action", action: "scroll", direction: "up", amount: 50 },
      9,
      [
        'await page.mouse.wheel(0, -50);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 9, action: "scroll" })'
      ],
    ],
    [
      { type: "action", action: "scroll", direction: "right", amount: 75 },
      10,
      [
        'await page.mouse.wheel(75, 0);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 10, action: "scroll" })'
      ],
    ],
    [
      { type: "action", action: "scroll", direction: "left", amount: 25 },
      11,
      [
        'await page.mouse.wheel(-25, 0);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 11, action: "scroll" })'
      ],
    ],
    [
      { type: "action", action: "keyDown", value: "Shift" },
      7,
      [
        'await page.keyboard.down("Shift");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "keyDown" })'
      ],
    ],
    [
      { type: "action", action: "press", value: "Enter" },
      9,
      [
        'await page.keyboard.press("Enter");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 9, action: "press" })'
      ],
    ],
    [
      { type: "action", action: "keyUp", value: "Shift" },
      8,
      [
        'await page.keyboard.up("Shift");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 8, action: "keyUp" })'
      ],
    ],
  ])("renders %o (stepIndex=%i)", (step, stepIndex, expectedFragments) => {
    const out = _renderStep(step, stepIndex);

    for (const fragment of expectedFragments) {
      expect(out).toContain(fragment);
    }
  });

  it("throws on unsupported step action", () => {
    const badStep = { action: "nope" } as unknown as Step;
    expect(() => _renderStep(badStep, 1)).toThrow(/Unsupported step:.*nope/);
  });
  
});
