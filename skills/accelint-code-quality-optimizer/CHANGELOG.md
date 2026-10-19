# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-10-19

### Added
- `scripts/unused.mjs`: removal candidates from the import graph. `unusedFiles` (source files no entry, test, story, tool config, generated file, package script or framework convention reaches) and `unusedExports` (exports nothing imports, in used files), each with `confidence` (`likely` or `review`), the reasons, and for exports `action` (`unexport` when the file still uses it, `remove` otherwise) and `kind` (`type` or `value`). Library-package candidates, names mentioned as text elsewhere, and packages with computed `import()` are always `review`. Overlay `entryPoints` adds repo-specific roots.
  - **Rationale:** The skill could not answer "remove the bloat": `importers.mjs` classified visibility but had no notion of reachability, and the docs said never to delete on its output. Vibecoded repos accumulate abandoned files and exports faster than anything else.
- `scripts/duplicates.mjs`: copy-paste detection as token clones (rolling hash over TypeScript scanner tokens, identifiers and literals normalized by default, `--exact` to keep them), skipping imports, tests and stories. Reports both locations, size, and `same-file`/`same-package`/`cross-package`.
- `scripts/import-graph.mjs`: the import graph `importers.mjs` built inline, now a shared module, and extended with `require("...")`, Vite `import.meta.glob` (with `{a,b}` braces), `new URL("./x", import.meta.url)`, edges out of generated files, a list of computed `import()`/`require()` calls, and an index by target.
- Scorecard: `--unused-report` and `--duplicates-report` add ratcheted `unusedFiles`, `unusedExports` and `duplicatedLines` per package; informational `passThroughs` counts named functions whose whole body forwards their parameters to one call.
- `references/removal.md`: the evidence to collect before removing (script line, text search, history, owner, computed imports), leaf-first one-commit-per-file removal, when to consolidate a clone and when it is only the same shape, the deletion test for pass-through layers, and the redundant-code lint rules (`no-useless-*`, `no-else-return`, `prefer-optional-chain`, ...) to ratchet in.
- SKILL.md: a NEVER rule against deleting on static evidence alone, Step 2 runs the two reports, Step 3 scans removal candidates, Step 5 points removals at `removal.md`. Removal and consolidation are tier C; unexporting a package-internal export is tier B.
- Agent eval 6 (dead and duplicated code) and 14 script checks; the fixture gains a dead file that is also a renamed cross-package clone, a glob-loaded widget, an unexport case and a pass-through. 75 → 91 checks without Go tools.
- Related skills: `improve-codebase-architecture` and `codebase-design` from mattpocock/skills (MIT) are pointed to as optional companions for the architecture pass; the deletion test and seam idea come from them. No text copied. They are Claude Code–specific, so the skill keeps its own version of the deletion test for other harnesses.

### Changed
- `scripts/ratchet.mjs` skips, with a warning, baseline metrics the current scorecard did not measure, instead of reading them as dropped to zero.
- `isToolConfig` knows `tsdown`, `unbuild`, `rolldown`, `oxlint`, `biome`, `lefthook`, `release` and `changeset`, and variants such as `vitest.acceptance.config.ts` and `playwright.<name>.config.ts`.
  - **Root cause:** On garda-neo, every package's `tsdown.config.ts` and `apps/c2-app/playwright.inc4-coa-batch6.config.ts` were measured as product code and reported as unused files. Scorecards of repos with such files will show fewer `sourceFiles` after this change.
- `expandBraces` moved from `conventions.mjs` to `shared.mjs`.

### Fixed
- `unused.mjs` built its name-matching regular expressions from export and file names with only `$` escaped, so a name containing other metacharacters (a Next.js `[slug]` file stem, a backslash) was matched as a pattern instead of literally, and could throw. Names now go through `escapeRegExp` in `shared.mjs`, which escapes every syntax character, backslash included. Reported by CodeQL (`js/regex-injection`, `js/incomplete-sanitization`) on the PR.

### Documentation
- Docs site page `docs/content/docs/code-quality-optimizer/`, the repo README skill list, `skills.sh.json` (Code Quality & Safety group) and the docs index list the skill.

### Validation
- garda-neo `develop` (618 TypeScript files, read-only copy): `unused.mjs` 4.6s, 7 unused files (320 lines; 4 `likely`, each with no mention outside itself in a repo-wide `git grep`), 339 unused exports (141 `likely`, of which 14 `remove`, the rest `unexport`); `duplicates.mjs` 1.3s, 269 clones and 4,122 duplicated lines, the largest a 230-token copy between `plan-trigger-ppr-action.ts` and `plan-trigger-response-action.ts`. False positives found on the first run (generated build-selection imports, test-runner include globs, a Vite alias substitute, tsdown configs, inline callbacks counted as pass-throughs) are fixed above.

## [1.3.0] - 2026-10-16

### Added
- `scripts/go-scorecard.mjs`: per-package Go metrics in the `scorecard.mjs` shape, so `ratchet.mjs` works on it unchanged (separate baseline `go-scorecard.baseline.json`). Counts `go vet -json` findings by analyzer, `staticcheck -f json` findings by check, `gofmt -l` files, optional golangci-lint JSON by linter, file sizes, and the ast-grep rules below. Runs vet, staticcheck and gofmt per `go.mod`; skips generated files, `testdata/` and overlay `ignore` globs; reports every tool it could not run in `warnings` instead of counting zero.
  - **Rationale:** The Go pack was prose only ("ratchet by hand"), and its "detections beyond the tools" were "read code and grep", the model-judgment approach the skill otherwise avoids.
- `rules/go/*.yml` (ast-grep, with `rules/sgconfig.yml`): `go-defer-in-loop`, `go-ignored-error`, `go-errorf-wrap-v`, `go-empty-interface`, `go-context-todo`, `go-print-call`, `go-panic-call`, `go-nolint`, `go-sleep-in-test`, `go-bare-goroutine` (informational). Each has a test in `rules/go-tests/`; `ast-grep test -c rules/sgconfig.yml --skip-snapshot-tests` runs them. Go expression patterns use `context`/`selector` because a bare Go expression does not parse at file level; test-file filtering is done by the scorecard, not by rule globs, so the rule tests exercise every rule.
- `evals/fixtures/go-service`: a compiling two-package module with every planted problem once (twice for ignored errors and prints), an unformatted file, a generated file that must not count, and a test with `time.Sleep`. `evals/expected/go-service-scorecard.json` holds the counts, including the vet/staticcheck rule keys.
- Eval runner: Go checks run when `go`, `staticcheck` and `ast-grep` are on PATH and are reported as `skip` otherwise, never as passes. 74 → 115 checks on a machine with the tools.
- `references/go-pack.md` rewritten around the script and the rules; mutex-across-I/O and goroutine lifetime remain manual, with the scorecard's `bareGoroutines` samples as the starting list.

## [1.2.0] - 2026-10-16

### Changed
- `scripts/export-diff.mjs` compares **per export** instead of per emitted module: each export's declaration text plus every declaration it references, followed through imports and re-exports into other local modules.
  - **Root cause:** The 1.1.0 module-text diff reported a decomposition step (move a declaration to a new file, re-export it from the original path) as a change, so `references/decomposition.md`'s "no change at every step" could never pass; a pure reorder of declarations was also reported as changed with an empty diff.
  - Still caught: a non-exported type behind an exported signature, a static member, an enum value, a parameter type, a rename on re-export. Not changes: moves with re-export, `export *` barrels, reorders, formatting, comments, bodies.
  - Snapshot format is `exports-v2`; 1.1.0 snapshots are rejected.
- `scripts/export-diff.mjs` roots the program at the entries plus the tsconfig's ambient `.d.ts` files instead of every source file, and passes the tsconfig's `references`. One snapshot on a 47-file Next.js app went from 26s to 16s on a WSL `/mnt/c` checkout (the ambient `next-env.d.ts` still pulls in Next's types); without ambient files it is 4s, but they are needed for module shims to resolve.
- `scripts/importers.mjs` resolves imports with `ts.resolveModuleName` using the nearest tsconfig (paths, baseUrl, package `exports`, workspace symlinks, built `dist/*.d.ts` mapped back to source), falling back to the relative/workspace-name resolver when dependencies are not installed.
  - **Root cause:** `@/lib/x` style path aliases were invisible, so every export in an app using them reported "no importers found".
- `scripts/importers.mjs` reports `unknown` for a library export with no importer; app packages (no package entries) keep `package-internal`. `references/tiers.md` already said unknown is package-public, but the script never returned it.
- `scripts/side-effect-diff.mjs` counts bare `navigate`/`redirect`/`revalidatePath`/`revalidateTag` and call-expression receivers such as `useRouter().push`, so reordered navigation is flagged.
- SKILL.md Step 0.3 requires a build after install (packages pointing at `dist/` resolve only once built); Step 1.4 and Step 6 put standards, overlay and baseline on their own `refactor/cqo/standards` branch that theme branches start from, so no theme MR/PR carries or conflicts on them.
- `scripts/importers.mjs` compares resolved files against the real path of the repo root.
  - **Root cause:** On Windows, a repo under a short (8.3) path such as `C:\Users\KEVANV~1\...` resolved to its long-name real path, which then looked outside the repo, so tsconfig `paths` aliases were dropped. The eval runner's temp directory hit this; the alias check failed on Windows only.
- Evals: 69 → 74 checks, covering the move-and-re-export and reorder cases, alias resolution, the `unknown` level, and navigation reordering.

## [1.1.0] - 2026-10-16

### Added
- `scripts/importers.mjs`: classifies each export as package-internal or package-public from the static import graph and `package.json` `exports`/`main`/`types` (mapping `dist/` targets back to `src/`), following named, renamed and `export *` re-exports through barrels.
  - **Rationale:** Review found tier A/B effectively limited to non-exported code; in a large app almost every function is exported but used only inside its package, so the skill would have written design docs for one-line edits. Tiers now depend on a scripted visibility level, not on the `export` keyword. On garda-neo `develop`, `apps/c2-app` has 777 package-internal and 0 package-public exports, `packages/modules/plan` 265 and 763.
- `references/performance.md` and `scripts/hot-paths.mjs`: performance changes only on overlay `hotPaths`, with a benchmark before and after (`vitest bench`, `go test -bench` + `benchstat`, React Profiler) and a 10% minimum gain.
  - **Rationale:** `hotPaths` was documented but read by nothing, so "performance second" was "performance absent".
- Overlay `conventionExclusions`, plus built-in exclusions for Next.js and Remix route files and Storybook stories, so framework-mandated default exports do not create false conflicts.
- Regression evals for every fixed defect; the eval runner now works on a temporary copy of the fixture. 51 → 68 checks.

### Changed
- `scripts/export-diff.mjs` now compares emitted, normalized `.d.ts` text for each entry and every local module it re-exports or takes types from, instead of `typeToString` per symbol.
  - **Root cause:** `typeToString` kept alias names, so a non-exported type behind an exported signature could change unseen, and static class members were not recorded.
  - **Trade-off:** Snapshots from 1.0.0 are rejected; take both snapshots with the same version.
- Tiers rewritten around three visibility levels (file-private, package-internal, package-public) in SKILL.md and `references/tiers.md`; unknown visibility is treated as package-public.
- SKILL.md Step 5 now snapshots exports (package entries plus the file) and copies files before each edit, and the workflow states which checkout every file lives in and is committed from.
- `scripts/side-effect-diff.mjs`: generic method names (`push`, `delete`, `replace`, `update`, ...) count only on I/O-like receivers; awaited calls always count; reordering of shared calls is reported even when calls were also added or removed.
  - **Root cause:** A pure `for` → `map` refactor was flagged, which would have turned every manual-review stop into noise.
- `scripts/ratchet.mjs`: packages not in the baseline are reported under `newPackages` instead of failing as regressions; removed packages are listed.
- `scripts/scorecard.mjs`: nested components count only when rendered as `<Name />` by the enclosing component; Storybook stories are measured like tests.

### Fixed
- Product files named `config.ts`, `*.config.ts` or `*setup.ts` were dropped from the scorecard; only known tool configs are excluded now.
- `detect-stack.mjs` reported ast-grep on any Linux machine because util-linux ships `sg`; a binary now counts only if `--version` names ast-grep. README no longer lists ast-grep until rules ship.
- `globToRegExp("**/generated/**")` matched `ungenerated/`; `**` now matches whole path segments.
- File listing now skips files git ignores.

### Version
- Bumped from 1.0.0 → 1.1.0

## [1.0.0] - 2026-10-16

### Added
- Initial skill release: a repo-wide, language-neutral workflow (setup, standards, baseline, scan, report, apply, package) with a TypeScript/React pack and a Go pack.
- `scripts/detect-stack.mjs`: stacks, workspace packages, verification commands, configs and installed tools, as JSON.
- `scripts/conventions.mjs`: inferred conventions (file naming, test placement and suffix, exports, `type` vs `interface`, enums, React imports, tsconfig strictness flags with `extends` resolution, Vitest mock cleanup), each reported as `uniform`, `proposal` or `conflict`, with the matching accelint guidance and a flag when the majority contradicts it.
- `scripts/scorecard.mjs`: per-package metrics counted from the TypeScript AST, optionally merged with oxlint or ESLint JSON output by rule.
- `scripts/ratchet.mjs`: compares a scorecard with a committed baseline; `check` fails only on regressions (`--report-only` for introduction), `update` refuses when anything regressed.
- `scripts/export-diff.mjs`: snapshots exported symbols' resolved types (including expanded aliases, interface and class members and enum values) with the TypeScript checker and compares two snapshots; formatting-only changes compare equal.
- `scripts/side-effect-diff.mjs`: per-function heuristic for added, removed or reordered I/O, logging, storage, timer and global-state calls.
- `scripts/symbol-map.mjs`: top-level symbols with line spans, export status and intra-file dependencies, for planning file splits.
- References for tiers, behavior checks, standards, scorecard and ratchet (with GitLab CI and GitHub Actions jobs), MR/PR packaging, decomposition, harness portability and the two packs.
- Assets: progress, overlay, standards, report and MR/PR description templates.
- `evals/`: a synthetic TypeScript monorepo fixture with planted problems, expected script output and agent-level eval prompts.

### Rationale
- Existing accelint audit skills work file by file in TypeScript only and rely on the model to find problems. Repositories written without shared conventions need a measured, repo-wide target first, with deterministic counts and behavior checks the model cannot talk its way past.
- The skill reuses accelint-ts-best-practices, accelint-react-best-practices, accelint-ts-testing, accelint-react-testing and accelint-ts-performance by reference instead of copying them, and keeps a short rule mapping so it works when they are not installed.
- Inferred conventions are proposals only, because in an inconsistent repository the majority pattern is often the drift being fixed.
- Exported API changes are tier C, so cleanup never breaks consumers the agent has not read.
- No `Co-Authored-By` trailers, no AI footers, no push or merge without approval: the output is reviewable branches, not unreviewed changes in shared history.
- Scripts are Node so they run in the target repo's existing Node CI image and on Windows, and approvals are explicit stops so the workflow behaves the same in any harness and on Claude or GPT models.
- The ratchet's stop-on-no-gain idea draws on the stopping rules in bytedance/agentkit-samples `code-optimization` (Apache-2.0); no text was copied.
