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

  it("accepts mouseClick with default button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Click at coordinates",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x: 100, y: 200 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("accepts mouseClick with explicit button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Right click",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x: 50, y: 75, button: "right" }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects mouseClick with negative x coordinate", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid click",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x: -10, y: 200 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseClick with negative y coordinate", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid click",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x: 100, y: -50 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseClick with non-integer coordinates", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid click",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x: 100.5, y: 200 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseClick with invalid button", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid click",
          startUrl: "https://example.com",
          steps: [{ action: "mouseClick", x: 100, y: 200, button: "invalid" }],
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

  it("rejects mouseMove with negative x coordinate", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid move",
          startUrl: "https://example.com",
          steps: [{ action: "mouseMove", x: -10, y: 100 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseMove with negative y coordinate", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid move",
          startUrl: "https://example.com",
          steps: [{ action: "mouseMove", x: 100, y: -50 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects mouseMove with non-integer coordinates", () => {
    const input = {
      suiteName: "Mouse test",
      source: { "repo": "some-repo", "path": "path/to/file.md" },
      tests: [
        {
          name: "Invalid move",
          startUrl: "https://example.com",
          steps: [{ action: "mouseMove", x: 100.5, y: 200 }],
        },
      ],
    };

    const result = testSuiteSchema.safeParse(input);
    expect(result.success).toBe(false);
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
        "expectNotVisible",
        "expectText",
        "expectUrl",
        "expectVisible",
        "fill",
        "goto",
        "mouseClick",
        "mouseMove",
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
