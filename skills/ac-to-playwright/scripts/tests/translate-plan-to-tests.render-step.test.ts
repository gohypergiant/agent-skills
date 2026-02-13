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
      { action: "expectUrl", value: "dashboard" },
      1,
      [
        "await expect(page).toHaveURL(/dashboard/);",
        'attachFailureArtifacts({ page, testInfo, stepIndex: 1, action: "expectUrl" })'
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
