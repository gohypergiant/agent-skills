import path from "node:path";
import { describe, expect, it } from "vitest";
import { _processInput } from "../generate-tests";
import { addDir, addFile, makeRuntime } from "./generate-tests.test-utils";

describe("processInput", () => {
  it("returns the input as-is when there is no '*'", () => {
    const state = makeRuntime();

    const result = _processInput("path/to/plans/a.json", state.runtime);

    expect(result).toEqual(["path/to/plans/a.json"]);
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
    addDir(state, "/repo/path/to/plans", ["sample-a.json", "other.txt", "sample-dir"]);
    addDir(state, "/repo/tests/plan-old", ["sample-b.json"]);
    addDir(state, "/repo/path/to/plans/sample-dir", ["sample-c.json"]); 
    addDir(state, "/repo/tests/.hidden", ["sample-z.json"]); 

    addFile(state, "/repo/path/to/plans/sample-a.json");
    addFile(state, "/repo/path/to/plans/other.txt");
    addFile(state, "/repo/tests/plan-old/sample-b.json");
    addFile(state, "/repo/path/to/plans/sample-dir/sample-c.json");
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
    addDir(state, "/repo/path/to/plans", ["a.json"]);
    addFile(state, "/repo/path/to/plans/a.json");

    const input = "/repo/path/to/plans/nomatch*.json";
    const result = _processInput(input, state.runtime);

    expect(result).toEqual([]);
  });

  it("excludes dotfiles from final results", () => {
    const state = makeRuntime();

    addDir(state, "/repo/tests", ["plans"]);
    addDir(state, "/repo/path/to/plans", [".secret.json", "visible.json"]);

    addFile(state, "/repo/path/to/plans/.secret.json");
    addFile(state, "/repo/path/to/plans/visible.json");

    const input = "/repo/path/to/plans/*.json";
    const result = _processInput(input, state.runtime);

    expect(result).toEqual([path.resolve("/repo/path/to/plans/visible.json")]);
  });
});
