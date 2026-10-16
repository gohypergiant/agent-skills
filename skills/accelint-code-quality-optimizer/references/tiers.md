# 1.1 Tiers

## Overview

The tier decides how a change is made and how much review it needs. Most damage from cleanup work comes from treating a judgment call as a mechanical fix: an "obvious" type narrowing that breaks a consumer in another package, or a "safe" rename that changes a serialized key. Classify before changing anything, and when unsure, go one tier up.

## Visibility Levels

Tier depends on who can see the code being changed. `scripts/importers.mjs <repo> <file>...` assigns the level for every export from the import graph and the package's `package.json`; do not decide it by reading `export` keywords.

| Level | Meaning | How it is decided | Checks that cover consumers |
|-------|---------|-------------------|-----------------------------|
| **file-private** | Not exported | No `export` | The file's own tests and the package typecheck |
| **package-internal** | Exported, imported only inside the same workspace package | `importers.mjs` reports `package-internal` | Package typecheck and tests, export-diff on the package entries |
| **package-public** | Reachable from the package's `exports`/`main`/`types`, re-exported by an entry file, or imported from another workspace package | `importers.mjs` reports `package-public` with the reason | Workspace typecheck and every consumer's tests |
| **unknown** | Exported from a library package (one with package entries) and no importer was found in the static graph | `importers.mjs` reports `unknown` | Treated exactly like package-public |

In an app package (no `exports`/`main` in its `package.json`) an export nothing imports is package-internal: there is no one outside the package to break. In Go, a capitalized identifier is package-public when the package is imported from outside its module or from another package in it; lowercase is file-private or package-internal.

## Tiers

| Tier | What it is | How it is made | Approval |
|------|-----------|----------------|----------|
| A | The repo's own tool can fix it, for one rule, without changing any type | `oxlint --fix`, `eslint --fix --rule`, `gofmt -w`, `goimports -w`, `golangci-lint run --fix --enable-only <linter>` | The findings table, or a per-run opt-in for unattended autofix |
| B | A targeted edit to file-private or package-internal code | The agent edits, guided by an AST location | Per item, after seeing the before/after |
| C | Needs a design: package-public signatures, file splits, config unification, cross-package moves | An approved design doc, then small mechanical steps | The design, then each step's checks |
| Report only | Not worth changing now, not provably safe, or a performance change off the hot paths | Nothing | None |

## Key Principles

1. **Package-public means tier C**: Changing the type, name or parameters of anything another package can import is tier C, whatever the size of the edit.
2. **Package-internal is tier B, with the package as the blast radius**: The edit may change an internal export's type, because every consumer is in the same package and the package typecheck sees them all. export-diff on the package entries must still show no change.
3. **An autofix is tier A only when the tool marks it safe and it changes no type**: oxlint and ESLint "suggestions" and "dangerous" fixes, and any fix on a package-internal export that changes its type, are tier B. Run them one at a time.
4. **Behavior-changing "quality" fixes are not quality fixes**: Narrowing a broad `catch`, changing error messages users or logs depend on, or reordering side effects changes behavior. Report them, or treat them as tier C with an owner's review.
5. **Unknown visibility is package-public**: `importers.mjs` reports `unknown` for a library export it cannot find an importer for (runtime registries, computed dynamic imports). Treat it as package-public: tier C for any signature change.

## Examples

### Pattern 1: Narrowing `any` by visibility

**❌ Incorrect: deciding from the `export` keyword**
```ts
// packages/plan/src/mappers/plan-row.ts, imported only by packages/plan/src/views/plan-list.tsx
export function toPlanRow(raw: any): PlanRow { ... }
// "Exported, so tier C: write a design doc"
```

**Why this is wrong:** The export never leaves the package. Treating it as public API turns a one-line fix into a design review, and the cleanup stalls.

**✅ Correct: classify, then tier**
```bash
node scripts/importers.mjs . packages/plan/src/mappers/plan-row.ts
# toPlanRow  package-internal  imported only inside the package   -> tier B
# parseRecord package-public   exposed by package entry packages/data-access/src/index.ts -> tier C
```

**Why this is better:** The internal helper is fixed now with the package typecheck as the safety net; the public API change is planned with its consumers in view.

### Pattern 2: Lint autofix

**❌ Incorrect: running every fixer at once**
```bash
oxlint --fix --fix-suggestions --fix-dangerously .
```

**Why this is wrong:** Hundreds of unrelated edits in one commit, some of them unsafe, and no way to bisect a failure.

**✅ Correct: one rule, safe fixes only, one commit**
```bash
oxlint --fix -A all -D eslint/prefer-const packages/ui
```

**Why this is better:** The diff is mechanical, reviewable by rule, and revertible on its own.

## Common Pitfalls

- Calling a file split "mechanical" because it only moves code. Moves change import paths, module initialization order and circular dependency structure; they are tier C.
- Treating test-only changes as risk-free. Tightening `toBeTruthy()` to `toEqual(...)` can expose a real bug; that is the point, but the failing test must be reported, not "fixed" by loosening it again.
- Applying a tier A fix whose rule is not in the approved standards. Enable the rule first (tier C config change), then autofix.
- Treating an app's internal modules as package-public. A delivery app (no `exports`, nothing imports it) has no public API: its exports are package-internal unless another workspace package imports them.
