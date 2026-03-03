import { describe, expect, it } from "vitest";
import { _renderStep, type Step } from "../translate-plan-to-tests";

describe("renderStep", () => {
  it.each<[Step, number, string[]]>([
    [
      { action: "click", target: "#btn" },
      3,
      [
        'await expect(page.getByTestId("#btn")).toHaveCount(1);',
        'await page.getByTestId("#btn").click();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "click", testId: "#btn" })'
      ],
    ],
    [
      { action: "doubleClick", x: 100, y: 200 },
      4,
      [
        'await page.mouse.dblclick(100, 200);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "doubleClick" })'
      ],
    ],
    [
      { action: "doubleClick", x: 50, y: 75, button: "right" },
      5,
      [
        'await page.mouse.dblclick(50, 75, { button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "doubleClick" })'
      ],
    ],
    [
      { action: "drag", fromX: 100, fromY: 100, toX: 200, toY: 200 },
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
      { action: "drag", fromX: 50, fromY: 75, toX: 150, toY: 200, button: "right" },
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
      { action: "drag", fromX: 10, fromY: 20, toX: 30, toY: 40, button: "middle" },
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
      { action: "expectNotVisible", target: "#modal" },
      1,
      [
        'await expect(page.getByTestId("#modal")).toHaveCount(1);',
        'await expect(page.getByTestId("#modal")).toBeHidden();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectNotVisible", testId: "#modal" })'
      ],
    ],
    [
      { action: "expectVisible", target: "#modal" },
      2,
      [
        'await expect(page.getByTestId("#modal")).toHaveCount(1);',
        'await expect(page.getByTestId("#modal")).toBeVisible();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "expectVisible", testId: "#modal" })'
      ],
    ],
    [
      { action: "expectText", target: "#msg", value: "Hello" },
      4,
      [
        'await expect(page.getByTestId("#msg")).toHaveCount(1);',
        'await expect(page.getByTestId("#msg")).toContainText("Hello");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "expectText", testId: "#msg" })'
      ],
    ],
    [
      { action: "fill", target: "#email", value: "a@b.com" },
      5,
      [
        'await expect(page.getByTestId("#email")).toHaveCount(1);',
        'await page.getByTestId("#email").fill("a@b.com");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "fill", testId: "#email" })'
      ],
    ],
    [
      { action: "select", target: "#role", value: "admin" },
      6,
      [
        'await expect(page.getByTestId("#role")).toHaveCount(1);',
        'await page.getByTestId("#role").selectOption("admin");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "select", testId: "#role" })'
      ],
    ],
    [
      { action: "goto", value: "https://example.com" },
      1,
      [
        'await page.goto("https://example.com");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "goto" })'
      ],
    ],
    [
      { action: "hover", target: "#tooltip-trigger" },
      3,
      [
        'await expect(page.getByTestId("#tooltip-trigger")).toHaveCount(1);',
        'await page.getByTestId("#tooltip-trigger").hover();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "hover", testId: "#tooltip-trigger" })'
      ],
    ],
    [
      { action: "reload" },
      2,
      [
        'await page.reload();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "reload" })'
      ],
    ],
    [
      { action: "expectUrl", value: "dashboard" },
      1,
      [
        "await expect(page).toHaveURL(/dashboard/);",
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectUrl" })'
      ],
    ],
    [
      { action: "mouseClick", x: 100, y: 200 },
      1,
      [
        'await page.mouse.click(100, 200);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "mouseClick" })'
      ],
    ],
    [
      { action: "mouseClick", x: 50, y: 75, button: "right" },
      2,
      [
        'await page.mouse.click(50, 75, { button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 2, action: "mouseClick" })'
      ],
    ],
    [
      { action: "mouseDown" },
      3,
      [
        'await page.mouse.down();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 3, action: "mouseDown" })'
      ],
    ],
    [
      { action: "mouseDown", button: "middle" },
      4,
      [
        'await page.mouse.down({ button: "middle" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 4, action: "mouseDown" })'
      ],
    ],
    [
      { action: "mouseMove", x: 150, y: 250 },
      5,
      [
        'await page.mouse.move(150, 250);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 5, action: "mouseMove" })'
      ],
    ],
    [
      { action: "mouseUp" },
      6,
      [
        'await page.mouse.up();',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 6, action: "mouseUp" })'
      ],
    ],
    [
      { action: "mouseUp", button: "right" },
      7,
      [
        'await page.mouse.up({ button: "right" });',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "mouseUp" })'
      ],
    ],
    [
      { action: "scroll", direction: "down", amount: 100 },
      8,
      [
        'await page.mouse.wheel(0, 100);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 8, action: "scroll" })'
      ],
    ],
    [
      { action: "scroll", direction: "up", amount: 50 },
      9,
      [
        'await page.mouse.wheel(0, -50);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 9, action: "scroll" })'
      ],
    ],
    [
      { action: "scroll", direction: "right", amount: 75 },
      10,
      [
        'await page.mouse.wheel(75, 0);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 10, action: "scroll" })'
      ],
    ],
    [
      { action: "scroll", direction: "left", amount: 25 },
      11,
      [
        'await page.mouse.wheel(-25, 0);',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 11, action: "scroll" })'
      ],
    ],
    [
      { action: "keyDown", value: "Shift" },
      7,
      [
        'await page.keyboard.down("Shift");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 7, action: "keyDown" })'
      ],
    ],
    [
      { action: "press", value: "Enter" },
      9,
      [
        'await page.keyboard.press("Enter");',
        'attachFailureArtifacts({ page, testInfo, stepIndex: 9, action: "press" })'
      ],
    ],
    [
      { action: "keyUp", value: "Shift" },
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
