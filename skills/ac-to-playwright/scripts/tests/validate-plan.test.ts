import { describe, expect, it } from "vitest";
import { type Runtime, run } from "../validate-plan";

type RuntimeOverrides = {
  readFileSync?: (path: string, encoding: string) => string;
};

function makeRuntime(overrides: RuntimeOverrides = {}) {
  const logs: string[] = [];
  const errors: string[] = [];
  const readFileSync = (overrides.readFileSync ?? (() => "")) as unknown as Runtime["fs"]["readFileSync"];

  return {
    runtime: {
      fs: {
        readFileSync,
      },
      log: (...args: unknown[]) => logs.push(args.join(" ")),
      error: (...args: unknown[]) => errors.push(args.join(" ")),
    },
    logs,
    errors,
  };
}

describe("validate-plan", () => {
  it("errors when no path is provided", () => {
    const { runtime, errors } = makeRuntime();

    const code = run(["node", "validate-plan.js"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Usage: npx validate-plan");
  });

  it("errors on invalid JSON", () => {
    const { runtime, errors } = makeRuntime({
      readFileSync: () => "{ not json }",
    });

    const code = run(["node", "validate-plan.js", "plan.json"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("Invalid JSON");
  });

  it("errors on schema failure", () => {
    const invalidPlan = JSON.stringify({
      suiteName: "Suite",
      source: { repo: "metronome", path: "path/to/file.md" },
      tests: [{ name: "t", steps: [] }],
    });

    const { runtime, errors } = makeRuntime({
      readFileSync: () => invalidPlan,
    });

    const code = run(["node", "validate-plan.js", "plan.json"], runtime);

    expect(code).toBe(1);
    expect(errors.join("\n")).toContain("startUrl");
  });

  it("returns 0 on success", () => {
    const validPlan = JSON.stringify({
      suiteName: "Suite",
      source: { repo: "metronome", path: "path/to/file.md" },
      tests: [
        {
          name: "t",
          startUrl: "/",
          steps: [{ action: "expectUrl", value: "/" }],
        },
      ],
    });

    const { runtime, logs, errors } = makeRuntime({
      readFileSync: () => validPlan,
    });

    const code = run(["node", "validate-plan.js", "plan.json"], runtime);

    expect(code).toBe(0);
    expect(errors.length).toBe(0);
    expect(logs.join("\n")).toContain("JSON passed validation");
  });
});
