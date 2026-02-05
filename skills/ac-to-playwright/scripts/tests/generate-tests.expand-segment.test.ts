import path from "node:path";
import { describe, expect, it } from "vitest";
import { _expandSegment } from "../generate-tests";
import { addDir, makeRuntime } from "./generate-tests.test-utils";

describe("expandSegment", () => {
  it("joins paths when segment has no wildcard", () => {
    const state = makeRuntime();

    const bases = ["/tmp/a", "/tmp/b"];
    const result = _expandSegment(bases, "plans", state.runtime);

    expect(result).toEqual([
      path.join("/tmp/a", "plans"),
      path.join("/tmp/b", "plans"),
    ]);
  });

  it("expands wildcard segment and filters matches", () => {
    const state = makeRuntime();

    const base = addDir(state, "/repo/tests", ["plans", "plan-old", "other"]);
    const result = _expandSegment([base], "plan*", state.runtime);

    expect(result).toEqual([
      path.join(base, "plan-old"),
      path.join(base, "plans"),
    ]);
  });

  it("excludes dotfiles/dotdirs", () => {
    const state = makeRuntime();

    const base = addDir(state, "/repo/tests", [".plans", "plans", "plan-old"]);
    const result = _expandSegment([base], "*", state.runtime);

    expect(result).toEqual([
      path.join(base, "plan-old"),
      path.join(base, "plans"),
    ]);
  });

  it("skips bases that are not directories", () => {
    const state = makeRuntime();

    const notADir = path.resolve("/repo/not-a-dir");
    const base = addDir(state, "/repo/tests", ["plans"]);

    const result = _expandSegment([notADir, base], "*", state.runtime);

    expect(result).toEqual([path.join(base, "plans")]);
  });

  it("returns empty array when no entries match", () => {
    const state = makeRuntime();

    const base = addDir(state, "/repo/tests", ["plans", "other"]);
    const result = _expandSegment([base], "nomatch*", state.runtime);

    expect(result).toEqual([]);
  });

  it("returns sorted results", () => {
    const state = makeRuntime();

    const base = addDir(state, "/repo/tests", ["b", "a", "c"]);
    const result = _expandSegment([base], "*", state.runtime);

    expect(result).toEqual([
      path.join(base, "a"),
      path.join(base, "b"),
      path.join(base, "c"),
    ]);
  });

  it("aggregates matches across multiple base paths", () => {
    const state = makeRuntime();

    const base1 = addDir(state, "/repo/tests1", ["plans", "plan-old"]);
    const base2 = addDir(state, "/repo/tests2", ["plans"]);

    const result = _expandSegment([base1, base2], "plan*", state.runtime);

    expect(result).toEqual([
      path.join(base1, "plan-old"),
      path.join(base1, "plans"),
      path.join(base2, "plans"),
    ]);
  });
});
