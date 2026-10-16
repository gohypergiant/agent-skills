# 1.2 Behavior Checks

## Overview

Passing tests are not proof that behavior is unchanged when coverage is thin, and a model's statement that a refactor is "equivalent" is not evidence. These checks run after every change, cheapest first, and a failure reverts only that change.

## Key Principles

1. **Red before you start means stop**: The baseline run in Step 0 must pass. A pre-existing failure makes every later result ambiguous.
2. **The repo's commands, verbatim**: Use the confirmed commands from the progress file. Never substitute a narrower or different invocation.
3. **Heuristics route, they do not reject**: The side-effect diff cannot understand semantics. It sends a change to the user, it does not delete it.

## The Checks, In Order

1. **Static** - format check, lint, typecheck and build with the repo's commands. Typecheck the package for package-internal changes and the whole workspace for package-public ones, so every consumer is checked.
2. **Export signature diff** - compare what consumers can see before and after.
   - TypeScript: the snapshot is taken before the edit (SKILL.md Step 5.1) with `--entry` set to every package entry the file is exposed through (`packageEntries` from `importers.mjs`) plus the file itself. After the edit, run the same `snapshot` command with `--out` pointing to an after file, then `node scripts/export-diff.mjs compare <before> <after>`. The snapshot records, for each export of each entry, its emitted declaration plus every declaration that declaration references, in the entry's own module or any local module it imports from or re-exports; so a non-exported type behind an exported signature, a static class member or a change in a re-exported module all show up. Moving a declaration to another file and re-exporting it from the original path, reordering declarations, formatting, comments and function bodies do not, which is what lets a decomposition step pass. Any difference fails tier A and B. If `snapshot` exits 3 (`"status": "incomplete"`), imports in the exposed modules did not resolve and their types collapsed to `any`; the snapshot proves nothing about them. Install **and build** the workspace in the worktree (packages that point at `dist/` resolve only once built), then snapshot again before editing.
   - Go: `apidiff` from `golang.org/x/exp/cmd/apidiff`, see [go-pack.md](go-pack.md).
3. **Side-effect heuristic** - `node scripts/side-effect-diff.mjs <before-copy> <after-file>` lists, per function, calls on I/O-like receivers (`logger`, `store`, `history`, `api`, ...), I/O-only methods (`fetch`, `setItem`, `emit`, `navigate`, ...), timers and every awaited call. Generic methods such as `push`, `delete` or `replace` count only on an I/O-like receiver, so array and map refactors are not flagged. Calls added, removed or reordered (reordering is reported even when other calls changed) send the change to manual review.
4. **Tests** - the repo's test command for the affected package, plus the workspace boundary check if the repo has one.
5. **Characterization first where coverage is thin** - before changing a function with no direct tests, add a test that records its current outputs for representative inputs (including empty, boundary and invalid inputs). Commit the test separately, then make the change against it.
6. **Stability runs, scaled to the change**:

| Change | Runs |
|--------|------|
| No new property-based tests | 1 |
| New property-based test | about 10 |
| Concurrency, ordering or timing change | about 30 (`go test -race -count=30` in Go) |

## Examples

### Pattern 1: Equivalence claimed, not shown

**❌ Incorrect: trusting the refactor**
```ts
// "These are equivalent, so no test needed"
- const active = items.filter((item) => item.enabled).map((item) => item.id);
+ const active = items.flatMap((item) => (item.enabled ? item.id : []));
```

**Why this is wrong:** If `item.id` is ever an array, `flatMap` flattens it and the output changes. Nothing failed because nothing exercised it.

**✅ Correct: characterize, then change**
```ts
it("should return ids of enabled items in order", () => {
  expect(activeIds([{ id: "a", enabled: true }, { id: "b", enabled: false }, { id: "c", enabled: true }]))
    .toEqual(["a", "c"]);
});
```

**Why this is better:** The test pins the observable behavior before the change and fails if the refactor alters it.

### Pattern 2: Side-effect reordering

**❌ Incorrect: "tidying" the order of calls**
```ts
- logger.info("saving", id);
- await store.save(record);
+ await store.save(record);
+ logger.info("saving", id);
```

**Why this is wrong:** Log order is part of how operators read incidents, and if `save` throws the log line is now never written.

**✅ Correct: leave the order or get the change reviewed**
The side-effect diff reports `reordered: logger.info, store.save` for this function. Send it to manual review with the reason, or drop it.

## Common Pitfalls

- Loosening an assertion to make a failing test pass after a refactor. A failing characterization test means the change altered behavior; revert the change.
- Snapshot tests of large rendered trees as characterization. They pass on any identical output and fail on any unrelated change; record the specific values that matter.
- Running the stability runs with coverage enabled. Coverage instrumentation slows runs and can mask timing issues; run them without it.
