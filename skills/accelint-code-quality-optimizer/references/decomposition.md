# 1.6 Decomposition

## Overview

Files of thousands of lines and per-package config drift are the most expensive problems in an inconsistent repo, and the easiest to make worse. A split done as one big move breaks imports, creates cycles and is impossible to review. Both are tier C: design first, then many small steps, each fully checked.

## Splitting a Large File

1. **Map** - list the file's top-level symbols, which are exported, and which symbols each one uses. `node scripts/symbol-map.mjs <repo> <file>` prints this as JSON, plus each symbol's line span.
2. **Group** - cluster symbols by responsibility (data mapping, view state, rendering, event wiring). Symbols with no dependents outside their group are the safest first moves.
3. **Design** - propose new module files, the order of moves, and how the original path keeps its public API (re-exports). Check the plan against the repo's boundary rules (for example `turbo boundaries`) so no move crosses a forbidden dependency.
4. **Approve** - STOP and show the design. Nothing moves before approval.
5. **Execute** - one symbol group per commit: create the new file, move the group, import it back into the original file, re-export what was exported, run every behavior check. The export diff of the original entry point must show no change at every step.

## Examples

### Pattern 1: One-shot split

**❌ Incorrect**
```
refactor: split plan-map.tsx into 9 files   (+3,612 −3,485)
```

**Why this is wrong:** Unreviewable, and any circular import or changed initialization order surfaces only at runtime.

**✅ Correct**
```
refactor(plan): move plan-map geometry helpers to plan-map/geometry.ts   (+210 −198)
refactor(plan): move plan-map layer config to plan-map/layers.ts         (+180 −171)
...
```
Each commit leaves `plan-map.tsx` exporting exactly what it exported before.

### Pattern 2: Losing the public path

**❌ Incorrect: consumers must change their imports**
```ts
// before: import { PlanMap, toMapFeature } from "./views/plan-map";
// after:  import { toMapFeature } from "./views/plan-map/geometry";
```

**✅ Correct: the original path still works**
```ts
// views/plan-map.tsx
export { toMapFeature } from "./plan-map/geometry";
```
Changing consumers to the new path is a separate, later step, if the user wants it.

## Unifying Configs

For tsconfig, test runner or lint config drift:
1. Propose a shared base (or adopt an existing shared package such as `@accelint/typescript-config`) with the approved values.
2. Move packages onto it **one package per commit**, with no flag changes.
3. Turn on each stricter flag **one flag, one package at a time**, fixing the errors it reveals in the same MR/PR, or enabling it with a ratcheted error count.

## Common Pitfalls

- Moving a symbol together with module-level side effects (registrations, global listeners). Module initialization order changes; keep side effects in the original module or move them in their own reviewed step.
- Creating an `index.ts` barrel for the new folder. It widens the public surface and invites cycles; import from the specific files.
- Splitting a test file at the same time. Split source first; tests follow in their own steps.
