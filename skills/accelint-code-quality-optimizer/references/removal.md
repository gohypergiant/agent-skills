# 1.8 Removal and Simplification

## Overview

Code written fast, by many people or by agents, accumulates in four ways: files nothing uses, exports nothing imports, copies of the same logic, and layers that only forward a call. Deleting and merging code is the fastest way to make such a repo smaller and easier to change, and also the easiest way to break something nobody tested: a registry entry, a string-keyed lookup, a consumer outside the repo. Every removal here is evidence first, then the user's confirmation, then small steps with the full behavior checks.

## Key Principles

1. **Candidates are not findings until confirmed**: `unused.mjs` and `duplicates.mjs` report what the static graph and the token stream show. A runtime registry, `import(variable)`, a framework convention or an outside consumer is invisible to both. A candidate becomes a finding only after the evidence below is collected and the user confirms it.
2. **Removal is tier C**: Deleting a file or an export is a design decision with a small diff. Unexporting (keeping the declaration, dropping `export`) of a `likely` candidate in an app package is tier B.
3. **Delete in the order that keeps every step green**: unexport before remove, leaves before the files they import, one file or one export group per commit.
4. **Consolidate only what must change together**: Two copies with the same token shape but different reasons to change are not duplicates. Merging them couples unrelated code.
5. **A layer stays if it is a seam**: A pass-through that is the only place a dependency is swapped (transport, clock, storage, test double) is doing a job. Delete it only when deleting it concentrates complexity instead of moving it (the deletion test, below).
6. **Never remove to make a number go down**: The ratchet rewards removal; that is not a reason. Each removal needs its own justification in the MR/PR description.

## Detection

| Problem | Script | Output | Ratcheted with |
|---------|--------|--------|----------------|
| Files nothing reaches | `unused.mjs` | `unusedFiles` with `confidence` and reasons | `--unused-report` → `unusedFiles` |
| Exports nothing imports | `unused.mjs` | `unusedExports` with `action` (`unexport` or `remove`), `kind` (`type` or `value`) | `--unused-report` → `unusedExports` |
| Copy-pasted code | `duplicates.mjs` | `clones` (first and second location, tokens, lines, `same-file`/`same-package`/`cross-package`) | `--duplicates-report` → `duplicatedLines` |
| Pass-through wrappers | `scorecard.mjs` | `passThroughs` with samples | informational |
| Redundant expressions | the repo's linter | lint counts by rule | `--lint-report` |

```bash
node scripts/unused.mjs <worktree> --scope <scope> --out <original>/.code-quality/runs/unused.json
node scripts/duplicates.mjs <worktree> --scope <scope> --out <original>/.code-quality/runs/duplicates.json
node scripts/scorecard.mjs <worktree> --scope <scope> --lint-report <lint.json> \
  --unused-report <original>/.code-quality/runs/unused.json --duplicates-report <original>/.code-quality/runs/duplicates.json --out ...
```

Pass the same reports to every scorecard compared against one baseline; a run without them skips those metrics with a warning instead of reading them as zero.

**What `unused.mjs` treats as roots** (never candidates, and everything they reach is used): package entries from `package.json`, tests, stories, tool configs, generated files and what they import, files named by `package.json` scripts or `bin`, files and globs named in test runner configs, and framework conventions (Next.js and Remix routes, `middleware`, `main`/`index`/`server`/`worker` files, `scripts/`, `bin/`, `e2e/`). It follows imports, re-exports, literal `import()`/`require()`, Vite `import.meta.glob` and `new URL("./x", import.meta.url)`. Add repo-specific roots in overlay `entryPoints`.

**Confidence.** `likely` means no static importer, no textual mention of the name in another file, an app (not library) package, and no computed `import()` in the package. `review` means one of those does not hold; the `reasons` say which.

**Redundant-code lint rules** (oxlint names; ESLint has the same core rules and `typescript-eslint`/`unicorn` equivalents). Enable as `warn` and ratchet, per [ts-react-pack.md](ts-react-pack.md); most have a safe autofix, so instances are tier A:

`no-useless-return`, `no-useless-catch`, `no-useless-constructor`, `no-useless-rename`, `no-useless-computed-key`, `no-useless-concat`, `no-useless-spread`, `no-useless-fallback-in-spread`, `no-useless-fragment` (React), `no-useless-undefined`, `no-useless-promise-resolve-reject`, `no-useless-switch-case`, `no-else-return`, `no-lonely-if`, `no-unneeded-ternary`, `no-extra-boolean-cast`, `prefer-optional-chain`, `prefer-array-flat-map`, `no-unnecessary-await`, `no-unused-vars`, `no-unused-private-class-members`, and type-aware `no-unnecessary-condition`, `no-unnecessary-type-assertion`, `no-unnecessary-type-arguments`.

## Evidence Before Removing

For each candidate, record in the progress file:

1. **The script line**: confidence and reasons from `unused.mjs`.
2. **A text search**: `git grep -n -w <name>` and `git grep -n <file-stem>` across the whole repo, including docs, configs and non-TS files. A hit in a test, fixture or registry string means it is used.
3. **History**: `git log --oneline -3 -- <file>`. A file added in the last few weeks is often work in progress, not dead. Ask.
4. **Ownership**: the overlay `owners` entry or CODEOWNERS. A library export may have consumers in other repos; ask the owner.
5. **Runtime registration**: if the package has `computedImports`, read each one and decide whether the candidate could be the target.

Present candidates grouped by package with this evidence, then STOP for confirmation of each. `likely` with clean evidence is the default to propose; `review` candidates are listed but proposed only when the evidence settles them.

## Removing

1. **Unexport first**: for `action: "unexport"`, drop `export` and run the checks. If the declaration becomes unused, the linter (`no-unused-vars`) now reports it, and removal is the next commit.
2. **Remove leaves first**: in a cluster of dead files (`importedOnlyBy` lists only other dead files), delete the files nothing imports before the files they import.
3. **One file or one export group per commit**, with the full behavior checks. For a library export, the export diff on the package entries must show the removed export and nothing else, and the workspace typecheck must pass.
4. **Test files that only test the removed code** go in the same commit. Tests that also cover other code stay.

## Consolidating Duplicates

1. **Read both copies**. Decide whether they are the same responsibility (both must change when the rule changes) or the same shape (similar code, different reasons to change). Only the first is consolidated; record the second in the report as "report only: same shape, different responsibility".
2. **Pick the home**: the lowest package both callers may depend on under the repo's boundary rules. A cross-package clone between two feature modules usually belongs in a foundation package, which makes it package-public and tier C.
3. **Characterize first**: if either copy lacks direct tests, add a characterization test for each copy against the same inputs, so differences between the copies show up before the merge.
4. **Merge in steps**: extract the shared function next to the first copy, point the first caller at it, then the second, then delete the second copy. Each step is a commit with the behavior checks. Where the copies differed, keep the difference as an explicit parameter, never by picking one behavior silently.

## Collapsing Pass-Through Layers

`passThroughs` lists named functions whose body only forwards their parameters, unchanged and in order, to one call. Apply the deletion test to each:

- **Delete the layer** when callers could call the target directly and nothing else would change: the wrapper adds a name, nothing more. Inline it at each call site (tier B if package-internal, C if public).
- **Keep it** when it is a seam: the target is swapped in tests or at runtime (`let request = ...; export function requestHttp(...) { return request(...) }`), it pins an API boundary between packages, or it is the documented extension point.
- **Deepen it** when several shallow layers in a row each add almost nothing: the fix is one module with a smaller interface, which is a design (tier C, [decomposition.md](decomposition.md)).

For a broader architecture pass, beyond what the counts show, see the related skills below.

## Examples

### Pattern 1: Deleting on the graph alone

**❌ Incorrect**
```bash
node scripts/unused.mjs . | jq -r '.unusedFiles[].file' | xargs git rm
```

**Why this is wrong:** `review` candidates include files reached through a registry string or a test fixture path. One commit deletes them all and nothing says which one broke the build.

**✅ Correct**
```
unusedFiles (packages/force)
  src/views/force-search-field.tsx  37 lines  likely   git grep: no hits; last change 5 months ago; owner @force-team
Proposed: remove (tier C). Confirm? 
```
After confirmation: one commit, checks green, the next candidate.

### Pattern 2: Merging look-alikes

**❌ Incorrect: one helper for two rules that happen to match**
```ts
// plan-trigger-ppr-action.ts and plan-trigger-response-action.ts share 230 tokens
export function buildTriggerAction(kind: "ppr" | "response", ...) { ... }
```

**Why this is wrong:** If the PPR and response contracts evolve separately, every change now needs a `kind` branch, and the helper grows into the thing it replaced.

**✅ Correct: consolidate only the part both contracts must keep in step**
```ts
// shared: the envelope validation both actions must apply identically
export function validateTriggerEnvelope(value: unknown): TriggerEnvelope | undefined { ... }
// each action keeps its own payload mapping
```

## Common Pitfalls

- Treating `unknown` visibility from `importers.mjs` or a `review` candidate as dead. Both mean "not proven used", not "proven unused".
- Removing a type export because no file imports it, when a `.d.ts` consumer or a generated client uses it. Check `kind: "type"` candidates in library packages with the owner.
- Running `duplicates.mjs --include-tests` and consolidating test setup into shared helpers. Repetition in tests is often deliberate; each test should read on its own.
- Counting a lower `duplicatedLines` as progress after extracting a helper that both copies now call with flags. That is the look-alike merge above.

## Related Skills

- `improve-codebase-architecture` and `codebase-design` from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): an exploratory pass for shallow modules and seams, with a shared vocabulary (module, interface, depth, seam, deletion test). When installed, use them to judge `passThroughs` and cross-package clones that need a design; their output is a proposal that enters this workflow at Step 4 as tier C. This skill uses their deletion-test idea by reference and copies no text. They are written for Claude Code (`Skill` tool, sub-agents); on other harnesses, apply the deletion test above by hand.
