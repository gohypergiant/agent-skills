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

  it.each([
    ["default button", undefined],
    ["explicit button", "right"],
  ])("accepts mouseDown with %s", (_description, button) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Press mouse button",
          startUrl: "https://example.com",
          steps: [{ action: "mouseDown", ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects mouseDown with invalid button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid button",
          startUrl: "https://example.com",
          steps: [{ action: "mouseDown", button: "invalid" }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it.each([
    ["default button", undefined],
    ["explicit button", "middle"],
  ])("accepts mouseUp with %s", (_description, button) => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Release mouse button",
          startUrl: "https://example.com",
          steps: [{ action: "mouseUp", ...(button && { button }) }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects mouseUp with invalid button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid button",
          startUrl: "https://example.com",
          steps: [{ action: "mouseUp", button: "invalid" }],
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

it.each([
  ["valid modifier key", "Shift"],
  ["app-specific modifier 'a'", "a"],
])("accepts keyDown action with %s", (_description, value) => {
  const input = {
    suiteName: "KeyDown test",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: "Test keyDown",
        startUrl: "https://example.com",
        steps: [{ action: "keyDown", value }],
      },
    ],
  };

  const result = testSuiteSchema.safeParse(input);
  expect(result.success).toBe(true);
});

it("rejects keyDown action with non-modifier key", () => {
  const input = {
    suiteName: "KeyDown test",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: "Test keyDown",
        startUrl: "https://example.com",
        steps: [{ action: "keyDown", value: "Enter" }],
      },
    ],
  };

  const result = testSuiteSchema.safeParse(input);
  expect(result.success).toBe(false);
});

it("accepts keyUp action with valid modifier key", () => {
  const input = {
    suiteName: "KeyUp test",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: "Test keyUp",
        startUrl: "https://example.com",
        steps: [{ action: "keyUp", value: "Control" }],
      },
    ],
  };

  const result = testSuiteSchema.safeParse(input);
  expect(result.success).toBe(true);
});

it("rejects keyUp action with non-modifier key", () => {
  const input = {
    suiteName: "KeyUp test",
    source: { "repo": "some-repo", "path": "path/to/file.md" },
    tests: [
      {
        name: "Test keyUp",
        startUrl: "https://example.com",
        steps: [{ action: "keyUp", value: "b" }],
      },
    ],
  };

  const result = testSuiteSchema.safeParse(input);
  expect(result.success).toBe(false);
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
