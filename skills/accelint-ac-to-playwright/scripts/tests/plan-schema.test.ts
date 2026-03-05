import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { ZodError } from "zod";
import { testSuiteSchema } from "../plan-schema";

type FixtureName = "all-actions.json" | "missing-required.json";

describe("Plan schema", () => {
  it("accepts a minimal valid suite", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects an empty tests array", () => {
    const input = { 
      suiteName: "Smoke", 
      source: { "repo": "some-repo", "path": "path/to/file.feature" },
      tests: [] 
    };
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects an empty steps array", () => {
    const input = {
      suiteName: "Smoke",
      source: { "repo": "external", "path": "path/to/file.md" },
      tests: [{ name: "A", startUrl: "https://x.com", steps: [] }],
    };
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects unknown action", () => {
    const input = {
      suiteName: "Smoke",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "A",
          startUrl: "https://x.com",
          steps: [{ action: "scroll", value: "down" }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects extra keys due to strict()", () => {
    const input = {
      suiteName: "Smoke",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "A",
          startUrl: "https://x.com",
          steps: [{ action: "goto", value: "https://x.com", extra: true }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it.each([
    ["default button", 100, 200, undefined],
    ["explicit button", 50, 75, "right"],
  ])("accepts doubleClick with %s", (_description, x, y, button) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Double click test",
          startUrl: "https://example.com",
          steps: [{ action: "doubleClick", x, y, ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it.each([
    ["negative coordinates", -10, 200, undefined],
    ["invalid button", 100, 200, "invalid"],
  ])("rejects doubleClick with %s", (_description, x, y, button) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid double click",
          startUrl: "https://example.com",
          steps: [{ action: "doubleClick", x, y, ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it.each([
    ["default button", 100, 100, 200, 200, undefined],
    ["explicit button", 50, 75, 150, 200, "right"],
    ["middle button", 10, 20, 30, 40, "middle"],
  ])("accepts drag with %s", (_description, fromX, fromY, toX, toY, button) => {
    const input = {
      suiteName: "Drag test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Drag operation",
          startUrl: "https://example.com",
          steps: [{ action: "drag", fromX, fromY, toX, toY, ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it.each([
    ["negative fromX", { fromX: -10, fromY: 100, toX: 200, toY: 200 }],
    ["negative fromY", { fromX: 100, fromY: -10, toX: 200, toY: 200 }],
    ["negative toX", { fromX: 100, fromY: 100, toX: -10, toY: 200 }],
    ["negative toY", { fromX: 100, fromY: 100, toX: 200, toY: -10 }],
    ["invalid button", { fromX: 100, fromY: 100, toX: 200, toY: 200, button: "invalid" }],
    ["missing fromX field", { fromY: 100, toX: 200, toY: 200 }],
    ["non-integer coordinates", { fromX: 100.5, fromY: 100, toX: 200, toY: 200 }],
    ["non-numeric coordinates", { fromX: "100", fromY: 100, toX: 200, toY: 200 }],
  ])("rejects drag with %s", (_description, step) => {
    const input = {
      suiteName: "Drag test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid drag",
          startUrl: "https://example.com",
          steps: [{ action: "drag", ...step }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it.each([
    ["default button", 100, 200, undefined],
    ["explicit button", 50, 75, "right"],
  ])("accepts mouseClick with %s", (_description, x, y, button) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Click test",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x, y, ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it.each([
    ["negative x coordinate", -10, 200, undefined],
    ["negative y coordinate", 100, -50, undefined],
    ["non-integer coordinates", 100.5, 200, undefined],
    ["invalid button", 100, 200, "invalid"],
  ])("rejects mouseClick with %s", (_description, x, y, button) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid click",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x, y, ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("accepts mouseMove with valid coordinates", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Move mouse",
          startUrl: "https://example.com",
          steps: [{ action: "mouseMove", x: 150, y: 250 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it.each([
    ["negative x coordinate", -10, 100],
    ["negative y coordinate", 100, -50],
    ["non-integer coordinates", 100.5, 200],
  ])("rejects mouseMove with %s", (_description, x, y) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid move",
          startUrl: "https://example.com",
          steps: [{ action: "mouseMove", x, y }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseDown with invalid button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid button",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown", button: "invalid" },
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseUp with invalid button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid button",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown" },
            { action: "mouseUp", button: "invalid" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it.each([
    ["down", 100],
    ["up", 50],
    ["left", 75],
    ["right", 25],
  ])("accepts scroll with %s direction", (direction, amount) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Scroll test",
          startUrl: "https://example.com",
          steps: [{ action: "scroll", direction, amount }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it.each([
    ["invalid direction", "diagonal", 100],
    ["zero amount", "down", 0],
    ["negative amount", "up", -50],
    ["non-integer amount", "down", 50.5],
  ])("rejects scroll with %s", (_description, direction, amount) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid scroll",
          startUrl: "https://example.com",
          steps: [{ action: "scroll", direction, amount }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("mouseDown/mouseUp pairing validation", () => {
  it("accepts mouseUp with preceding mouseDown", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Valid drag sequence",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseMove", x: 100, y: 100 },
            { action: "mouseDown" },
            { action: "mouseMove", x: 200, y: 200 },
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts multiple sequential mouseDown/mouseUp pairs", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Multiple complete pairs",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown" },
            { action: "mouseUp" },
            { action: "mouseDown" },
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects mouseUp without preceding mouseDown", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Invalid sequence",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseMove", x: 100, y: 100 },
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("mouseUp at step 1 has no preceding mouseDown");
    }
  });

  it("rejects mouseDown without following mouseUp", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Unpaired mouseDown",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown" },
            { action: "mouseMove", x: 100, y: 100 },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 0, "action"]);
      expect(issues[0].message).toContain("mouseDown at step 0 has no following mouseUp");
    }
  });

  it("rejects multiple mouseDown without completing first pair", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Nested mouseDown",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown" },
            { action: "mouseDown" },
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("mouseDown at step 1 occurs before completing the previous mouseDown");
    }
  });

  it("rejects multiple mouseUp after one mouseDown", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Double mouseUp",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown" },
            { action: "mouseUp" },
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 2, "action"]);
      expect(issues[0].message).toContain("mouseUp at step 2 has no preceding mouseDown");
    }
  });

  it("rejects mismatched button between mouseDown and mouseUp", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Mismatched buttons",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown", button: "left" },
            { action: "mouseUp", button: "right" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "button"]);
      expect(issues[0].message).toContain('mouseUp at step 1 uses button "right"');
      expect(issues[0].message).toContain('mouseDown at step 0 used button "left"');
    }
  });

  it("accepts matching non-default buttons", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Right button pair",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown", button: "right" },
            { action: "mouseUp", button: "right" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("prevents overlapping mouseDown with different buttons", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Overlapping different buttons",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown", button: "left" },
            { action: "mouseDown", button: "right" },
            { action: "mouseUp", button: "right" },
            { action: "mouseUp", button: "left" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("mouseDown at step 1 occurs before completing the previous mouseDown");
    }
  });

  it("validates pairing within each test independently", () => {
    const input = {
      suiteName: "Mouse pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Test 1 - valid",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseDown" },
            { action: "mouseUp" },
          ],
        },
        {
          name: "Test 2 - invalid",
          startUrl: "https://example.com",
          steps: [
            { action: "mouseUp" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Only test 2 should fail, test 1's mouseDown doesn't carry over
      expect(result.error.issues[0].path).toContain(1); // test index 1
    }
  });
});

it.each([
  ["single key", "Enter"],
  ["unmodified character", "a"],
])("accepts press action with %s", (_description, value) => {
  const input = {
    suiteName: "Press test",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: "Test press",
        startUrl: "https://example.com",
        steps: [{ action: "press", value }],
      },
    ],
  };

  const result = testSuiteSchema.safeParse(input);
  expect(result.success).toBe(true);
});

it.each([
  ["modified character (requires Shift)", "+"],
  ["modifier combination", "Shift+g"],
])("rejects press action with %s", (_description, value) => {
  const input = {
    suiteName: "Press test",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: "Test press",
        startUrl: "https://example.com",
        steps: [{ action: "press", value }],
      },
    ],
  };

  const result = testSuiteSchema.safeParse(input);
  expect(result.success).toBe(false);
});

describe("keyDown/keyUp pairing validation", () => {
  it("accepts keyUp with preceding keyDown", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Valid keyboard shortcut",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Shift" },
            { action: "press", value: "g" },
            { action: "keyUp", value: "Shift" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts multiple sequential keyDown/keyUp pairs", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Multiple complete pairs",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Control" },
            { action: "keyUp", value: "Control" },
            { action: "keyDown", value: "Shift" },
            { action: "keyUp", value: "Shift" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects keyUp without preceding keyDown", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Invalid sequence",
          startUrl: "https://example.com",
          steps: [
            { action: "press", value: "g" },
            { action: "keyUp", value: "Shift" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("keyUp at step 1 has no preceding keyDown");
    }
  });

  it("rejects keyDown without following keyUp", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Unpaired keyDown",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Control" },
            { action: "press", value: "g" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 0, "action"]);
      expect(issues[0].message).toContain("keyDown at step 0 has no following keyUp");
    }
  });

  it("rejects multiple keyDown without completing first pair (different modifiers)", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Nested keyDown with different modifiers",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Control" },
            { action: "keyDown", value: "Shift" },
            { action: "keyUp", value: "Shift" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("keyDown at step 1 occurs before completing the previous keyDown");
    }
  });

  it("rejects multiple keyDown without completing first pair (same modifier)", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Nested keyDown with same modifier",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Control" },
            { action: "keyDown", value: "Control" },
            { action: "keyUp", value: "Control" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("keyDown at step 1 occurs before completing the previous keyDown");
    }
  });

  it("rejects multiple keyUp after one keyDown", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Double keyUp",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Control" },
            { action: "keyUp", value: "Control" },
            { action: "keyUp", value: "Control" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 2, "action"]);
      expect(issues[0].message).toContain("keyUp at step 2 has no preceding keyDown");
    }
  });

  it("rejects mismatched modifier key between keyDown and keyUp", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Mismatched keys",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Shift" },
            { action: "keyUp", value: "Control" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "value"]);
      expect(issues[0].message).toContain('keyUp at step 1 uses key "Control"');
      expect(issues[0].message).toContain('keyDown at step 0 used key "Shift"');
    }
  });

  it("accepts app-specific modifier 'a' in pair", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "App modifier pair",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "a" },
            { action: "press", value: "g" },
            { action: "keyUp", value: "a" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("prevents overlapping keyDown with different modifiers", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Overlapping different modifiers",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Shift" },
            { action: "keyDown", value: "Control" },
            { action: "keyUp", value: "Control" },
            { action: "keyUp", value: "Shift" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("keyDown at step 1 occurs before completing the previous keyDown");
    }
  });

  it("validates pairing within each test independently", () => {
    const input = {
      suiteName: "Key pairing test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Test 1 - valid",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Control" },
            { action: "keyUp", value: "Control" },
          ],
        },
        {
          name: "Test 2 - invalid",
          startUrl: "https://example.com",
          steps: [
            { action: "keyUp", value: "Shift" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Only test 2 should fail, test 1's keyDown doesn't carry over
      expect(result.error.issues[0].path).toContain(1); // test index 1
    }
  });

  it("rejects keyDown with non-modifier key", () => {
    const input = {
      suiteName: "Key validation test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Invalid modifier",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Enter" },
            { action: "keyUp", value: "Enter" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects keyUp with non-modifier key", () => {
    const input = {
      suiteName: "Key validation test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Invalid modifier",
          startUrl: "https://example.com",
          steps: [
            { action: "keyDown", value: "Shift" },
            { action: "keyUp", value: "b" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("visibility pairing validation", () => {
  it("accepts expectNotVisible → action → expectVisible pattern", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Show element",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "modal.dialog" },
            { action: "click", target: "button.open" },
            { action: "expectVisible", target: "modal.dialog" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts expectVisible → action → expectNotVisible pattern", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Hide element",
          startUrl: "https://example.com",
          steps: [
            { action: "expectVisible", target: "panel.settings" },
            { action: "press", value: "Escape" },
            { action: "expectNotVisible", target: "panel.settings" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts multiple independent visibility pairs", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Multiple pairs",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "panel.layers" },
            { action: "click", target: "button.layers" },
            { action: "expectVisible", target: "panel.layers" },
            { action: "expectVisible", target: "panel.properties" },
            { action: "click", target: "button.properties" },
            { action: "expectNotVisible", target: "panel.properties" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects unpaired expectVisible", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Unpaired visible",
          startUrl: "https://example.com",
          steps: [
            { action: "click", target: "button.show" },
            { action: "expectVisible", target: "modal.dialog" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 1, "action"]);
      expect(issues[0].message).toContain("expectVisible at step 1");
      expect(issues[0].message).toContain("must be paired with expectNotVisible");
    }
  });

  it("rejects unpaired expectNotVisible", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Unpaired not visible",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "panel.info" },
            { action: "click", target: "button.hide" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      expect(issues[0].path).toEqual(["tests", 0, "steps", 0, "action"]);
      expect(issues[0].message).toContain("expectNotVisible at step 0");
      expect(issues[0].message).toContain("must be paired with expectVisible");
    }
  });

  it("rejects visibility pair with no action between", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "No action between",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "modal.dialog" },
            { action: "expectVisible", target: "modal.dialog" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      // Either step 0 or 1 will fail (whichever is checked first)
      expect(issues[0].message).toContain("must be paired");
    }
  });

  it("rejects visibility pair with multiple actions between", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Multiple actions between",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "modal.dialog" },
            { action: "click", target: "button.open" },
            { action: "fill", target: "input.name", value: "test" },
            { action: "expectVisible", target: "modal.dialog" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      // Either step 0 or 3 will fail
      expect(issues[0].message).toContain("must be paired");
      expect(issues[0].message).toContain("exactly one action between");
    }
  });

  it("rejects visibility pair with mismatched targets", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Mismatched targets",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "panel.layers" },
            { action: "click", target: "button.show" },
            { action: "expectVisible", target: "panel.properties" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues).toHaveLength(1);
      // One of the assertions will fail to find a matching pair
      expect(issues[0].message).toContain("must be paired");
    }
  });

  it("rejects visibility pair with assertion between instead of action", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Assertion between",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "modal.dialog" },
            { action: "expectText", target: "header.title", value: "Welcome" },
            { action: "expectVisible", target: "modal.dialog" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      // Both assertions will fail to find a matching pair since there's an assertion between them
      expect(issues.length).toBeGreaterThanOrEqual(1);
      // Check that at least one error is about visibility pairing
      const hasPairingError = issues.some(issue => issue.message.includes("must be paired"));
      expect(hasPairingError).toBe(true);
    }
  });

  it("validates pairing within each test independently", () => {
    const input = {
      suiteName: "Visibility test",
      source: { repo: "some-repo", path: "path/to/file.md" },
      tests: [
        {
          name: "Test 1 - valid",
          startUrl: "https://example.com",
          steps: [
            { action: "expectNotVisible", target: "modal.dialog" },
            { action: "click", target: "button.open" },
            { action: "expectVisible", target: "modal.dialog" },
          ],
        },
        {
          name: "Test 2 - invalid",
          startUrl: "https://example.com",
          steps: [
            { action: "expectVisible", target: "panel.info" },
          ],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Only test 2 should fail
      expect(result.error.issues[0].path).toContain(1); // test index 1
    }
  });
});

describe("Test fixture validations", () => {
  it("fixtures/all-actions.json should parse", () => {
    const data = readFixture("all-actions.json");
    const result = testSuiteSchema.safeParse(data);

    if (!result.success) {
      throw new Error(
        `Expected fixture to parse: all-actions.json\n${formatIssues(result.error)}`
      );
    }

    const actions = result.data.tests.flatMap((t) => t.steps.map((s) => s.action));
    const unique = new Set(actions);

    expect(unique).toEqual(
      new Set([
        "click",
        "doubleClick",
        "expectNotVisible",
        "expectText",
        "expectUrl",
        "expectVisible",
        "fill",
        "goto",
        "keyDown",
        "keyUp",
        "mouseClick",
        "mouseDown",
        "mouseMove",
        "mouseUp",
        "press",
        "scroll",
        "select",
      ])
    );
  });

  it("fixtures/missing-required.json should fail parsing", () => {
    const data = readFixture("missing-required.json");
    const result = testSuiteSchema.safeParse(data);

    if (result.success) {
      throw new Error("Expected fixture to fail parsing: missing-required.json");
    }
  });
});

describe("Suite-specific tags", () => {
  it("accepts one tag", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tags: ["@smoke"],
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts multiple tags", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tags: ["@smoke", "@wip"],
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
  
  it("rejects empty tags array", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tags: [],
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
  
  it("rejects non-string tags", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tags: [123],
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });  
});


describe("Test-specific tags", () => {
  it("accepts one tag", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          tags: ["@smoke"],
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts multiple tags", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          tags: ["@smoke", "@wip"],
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
  
  it("rejects empty tags array", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          tags: [],
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
  
  it("rejects non-string tags", () => {
    const input = {
      suiteName: "Basic suite",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Basic test",
          startUrl: "https://example.com",
          tags: [123],
          steps: [{ action: "expectUrl", value: "https://example.com" }],
        },
      ],
    };
  
    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });  
});

// Helper functions

function readFixture(fileName: FixtureName): unknown {
  const fullPath = path.resolve(__dirname, "fixtures", fileName);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as unknown;
}

function formatIssues(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const pathStr =
        issue.path.length === 0
          ? "<root>"
          : issue.path.map(String).join(".");
      return `${pathStr}: ${issue.message}`;
    })
    .join("\n");
}
