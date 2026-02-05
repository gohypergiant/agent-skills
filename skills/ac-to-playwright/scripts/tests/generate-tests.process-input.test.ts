import path from "node:path";
import { describe, expect, it } from "vitest";
import { _processInput } from "../generate-tests";
import { addDir, addFile, makeRuntime } from "./generate-tests.test-utils";

describe("processInput", () => {
  it("returns the input as-is when there is no '*'", () => {
    const state = makeRuntime();

    const result = _processInput("skills/ac-to-playwright/artifacts/plans/a.json", state.runtime);

    expect(result).toEqual(["skills/ac-to-playwright/artifacts/plans/a.json"]);
  });

  it("throws when input includes '**'", () => {
    const state = makeRuntime();

    expect(() => _processInput("tests/**/a.json", state.runtime)).toThrow(
      "Error: Unsupported: recursive glob (**): tests/**/a.json"
    );
  });

  it("expands directory + filename globs and returns only files", () => {
    const state = makeRuntime();

    addDir(state, "/repo/tests", ["plans", "plan-old", ".hidden"]);
    addDir(state, "/repo/skills/ac-to-playwright/artifacts/plans", ["sample-a.json", "other.txt", "sample-dir"]);
    addDir(state, "/repo/tests/plan-old", ["sample-b.json"]);
    addDir(state, "/repo/skills/ac-to-playwright/artifacts/plans/sample-dir", ["sample-c.json"]); 
    addDir(state, "/repo/tests/.hidden", ["sample-z.json"]); 

    addFile(state, "/repo/skills/ac-to-playwright/artifacts/plans/sample-a.json");
    addFile(state, "/repo/skills/ac-to-playwright/artifacts/plans/other.txt");
    addFile(state, "/repo/tests/plan-old/sample-b.json");
    addFile(state, "/repo/skills/ac-to-playwright/artifacts/plans/sample-dir/sample-c.json");
    addFile(state, "/repo/tests/.hidden/sample-z.json");

    const input = "/repo/tests/plan*/sample-*.json";

    const result = _processInput(input, state.runtime);

    expect(result).toEqual([
      path.resolve("/repo/tests/plan-old/sample-b.json"),
    ]);
  });

  it("returns [] when glob matches nothing", () => {
    const state = makeRuntime();

    addDir(state, "/repo/tests", ["plans"]);
    addDir(state, "/repo/skills/ac-to-playwright/artifacts/plans", ["a.json"]);
    addFile(state, "/repo/skills/ac-to-playwright/artifacts/plans/a.json");

    const input = "/repo/skills/ac-to-playwright/artifacts/plans/nomatch*.json";
    const result = _processInput(input, state.runtime);

    expect(result).toEqual([]);
  });

  it("excludes dotfiles from final results", () => {
    const state = makeRuntime();

    addDir(state, "/repo/tests", ["plans"]);
    addDir(state, "/repo/skills/ac-to-playwright/artifacts/plans", [".secret.json", "visible.json"]);

    addFile(state, "/repo/skills/ac-to-playwright/artifacts/plans/.secret.json");
    addFile(state, "/repo/skills/ac-to-playwright/artifacts/plans/visible.json");

    const input = "/repo/skills/ac-to-playwright/artifacts/plans/*.json";
    const result = _processInput(input, state.runtime);

    expect(result).toEqual([path.resolve("/repo/skills/ac-to-playwright/artifacts/plans/visible.json")]);
  });
});
