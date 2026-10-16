---
name: accelint-code-quality-optimizer
description: Use when users say "optimize code quality", "clean up this repo", "standardize the codebase", "make the code consistent", "audit code quality across the repo", "set up a quality ratchet", "quality scorecard", "refactor vibecoded code", or when a TypeScript/React or Go repository was written without shared conventions and needs behavior-preserving cleanup delivered as small merge requests or pull requests. Keywords: code quality, consistency, standards, conventions, scorecard, ratchet, tsconfig drift, lint baseline, large file decomposition, monorepo, any, type assertions, loose assertions, golangci-lint, staticcheck.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.3.0"
---

# Code Quality Optimizer

Brings a whole repository to one measured standard through small, behavior-preserving changes. It works in any agent harness with file access, a shell and git, on Claude or GPT models.

## NEVER Do When Optimizing Code Quality

- **NEVER adopt the majority pattern as the standard on your own** - In a repo without shared conventions the most common pattern is often the wrong one (for example, 80% of packages with `strict: false`). `scripts/conventions.mjs` output is a list of proposals. A convention becomes a standard only after the user approves it into `.code-quality/standards.md`.
- **NEVER change a package-public signature in tier A or B** - Narrowing an `any`, renaming or changing a parameter on something another package can import breaks consumers you have not read. Classify every export you touch with `scripts/importers.mjs` first: **file-private** and **package-internal** code is tier B; **package-public** and **unknown** code is tier C, one package at a time, with the workspace typecheck covering every consumer. Never guess the level from `export` alone.
- **NEVER invent or substitute verification commands** - Run only the commands found by `scripts/detect-stack.mjs` or set in the overlay file, after confirming each one works. `npx tsc` in place of `pnpm typecheck` skips project references, path aliases and the package's own config, so it passes where the real check fails.
- **NEVER start changing code on a red baseline** - If the verification commands fail before you touch anything, every later failure is ambiguous. Stop and report the failing command.
- **NEVER apply a change the user has not approved** - Show the full findings table, then the before/after for every selected item, then stop and wait. Tier A autofix may run without per-item approval only when the user opted in for this run.
- **NEVER bundle themes or packages into one MR/PR** - A reviewer cannot tell which of 40 mixed changes broke something. One theme in one package per MR/PR, under the size cap (400 changed lines by default). A tier A autofix MR/PR covers one lint rule and may exceed the cap.
- **NEVER push, open an MR/PR or merge without approval for this run** - Prepare branches and descriptions only. Pushing is a separate step the user approves each time. The skill never merges anything.
- **NEVER add Co-Authored-By trailers or AI-generated footers to commits, MRs or PRs** - Many teams forbid them, and their absence is a check in this skill's evals. Use the repo's own commit style.
- **NEVER make a performance change without a measured before/after** - Memoization, loop rewrites and caching off the hot path add complexity and review cost for no measurable gain. Performance changes are allowed only on overlay `hotPaths` with a benchmark per [performance.md](references/performance.md); everything else is report-only.
- **NEVER make the CI ratchet blocking on first introduction** - CI is shared infrastructure. Ship it report-only (`allow_failure: true` on GitLab, `continue-on-error: true` on GitHub) and make it blocking only after the team agrees.

## Before Optimizing, Ask

### Scope and Ownership
- **Which package or area is this run for?** Work one scope at a time (`--scope packages/ui`). A whole-repo run produces a report no one can review.
- **Who owns this code, and do they know this is happening?** Unannounced refactor MRs/PRs collide with in-flight feature work. Check open MRs/PRs touching the same files before choosing a scope.
- **Is the scope covered by tests?** Thin coverage means writing characterization tests first, which makes the run longer. Set expectations before starting.

### Standard vs Preference
- **Is this finding a written rule, an approved convention, or a preference?** Only the first two justify a change. Preferences go in the report as suggestions.
- **Does the repo already have a tool that catches this?** If oxlint, ESLint, tsc, `go vet` or staticcheck can express the rule, enable it in a ratcheted lint config instead of hand-fixing instances.

### Risk
- **What breaks if this change is subtly wrong?** Code that handles data, auth, persistence, ordering or concurrency needs the full behavior checks and a reviewer who knows it, whatever the tier.
- **Can the user review this in one sitting?** If not, split it.

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Follow the workflow below. It is the same for every stack.

### 2. Reference Implementation Details (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for the rule summaries: tiers, behavior checks, standards, scorecard, MR/PR packaging, harness portability and the language packs.

### 3. Load Specific References as Needed
- Choosing a tier or deciding whether a change is safe → [tiers.md](references/tiers.md)
- A performance change on a hot path → [performance.md](references/performance.md)
- Before applying any change → [behavior-checks.md](references/behavior-checks.md)
- Building or updating the standard → [standards.md](references/standards.md)
- Scorecard numbers, baseline or CI job → [scorecard-and-ratchet.md](references/scorecard-and-ratchet.md)
- Preparing branches, commits or MR/PR descriptions → [mr-packaging.md](references/mr-packaging.md)
- Splitting a large file or unifying configs (tier C) → [decomposition.md](references/decomposition.md)
- TypeScript or React code → [ts-react-pack.md](references/ts-react-pack.md)
- Go code → [go-pack.md](references/go-pack.md)
- Running outside Claude Code, or on a non-Claude model → [harness-portability.md](references/harness-portability.md)

Load the pack reference only for stacks that `detect-stack.mjs` reports.

## Workflow

Copy this checklist into the progress file and keep it current:

```
- [ ] Step 0: Setup - detect stack, confirm commands, create worktree and progress file
- [ ] Step 1: Standards - written rules, inferred proposals, user decisions
- [ ] Step 2: Baseline - green verification, scorecard, ratchet baseline
- [ ] Step 3: Scan - repo tools, then pack rules, then standards deviations
- [ ] Step 4: Report - findings table, STOP for approval
- [ ] Step 5: Apply - one change per commit, behavior checks after each
- [ ] Step 6: Package - one branch and MR/PR description per theme, STOP before pushing
```

Scripts below are run with Node 20 or newer from the skill directory, for example `node skills/accelint-code-quality-optimizer/scripts/detect-stack.mjs <repo>`. They print JSON on stdout and messages on stderr. The scorecard, conventions, importers and export-diff scripts parse with the target repo's own `typescript` package; install the repo's dependencies first or pass `--typescript <path>`.

**Two checkouts, fixed roles.** Every file has one home:

| File | Lives in | Committed |
|------|----------|-----------|
| `.code-quality/progress.md`, `.code-quality/runs/*` | Original checkout | Never (git-ignored) |
| `.code-quality/standards.md`, `.code-quality/overlay.json`, `.code-quality/scorecard.baseline.json` | Worktree | Yes, in their own commit on the worktree branch |
| Source changes | Worktree | Yes, one change per commit |

Scripts that measure the code (`scorecard`, `conventions`, `importers`, `export-diff`) run against the **worktree** path from Step 0.3 on. Never edit or commit in the original checkout.

### Step 0: Setup

1. Run `scripts/detect-stack.mjs <repo>`. Note `packs`, `commands`, `configs`, `tools` and `warnings`. If `unsupportedStacks` is not empty, tell the user those files are out of scope for this version.
2. Run each verification command once from the repo root (or its `cwd`). Record the exact command and whether it passed. If one is missing or fails, STOP and ask the user; do not substitute another command.
3. Create a worktree on a new branch from the repo's default branch: `git worktree add ../<repo>-cqo-<scope-slug> -b refactor/cqo/<scope-slug>`. Never work on the user's checked-out branch. In the worktree, install dependencies with the repo's package manager so its `typescript` resolves, then run the repo's build (or its declaration-emitting typecheck, e.g. `tsc -b`): workspace packages whose `package.json` points at `dist/` resolve only when `dist/` exists, and `export-diff` reports `incomplete` until it does.
4. In the **original checkout**, copy [assets/progress-template.md](assets/progress-template.md) to `.code-quality/progress.md` and make sure `.code-quality/progress.md` and `.code-quality/runs/` are git-ignored there (add them to `.git/info/exclude` if the repo's `.gitignore` does not cover them, so no tracked file changes). Fill in the scope, worktree path, branch and confirmed commands.
5. If `.code-quality/overlay.json` exists, read it. Its `commands`, `ignore`, `thresholds`, `decisions`, `conventionExclusions` and `hotPaths` override what was detected. If it does not exist, offer to create one in the **worktree** from [assets/overlay-template.json](assets/overlay-template.json) at the end of Step 1.

Save the progress file before continuing. Save it again at the end of every step and after every applied change.

### Step 1: Standards

Load [references/standards.md](references/standards.md).

1. Collect **written rules** with their source file: agent guidance (`AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`), lint and formatter config, tsconfig files, test runner config, boundary rules (`turbo.json`, dependency-cruiser, `.golangci.yml`).
2. Run `scripts/conventions.mjs <worktree> --scope <scope>`. Each entry is `uniform`, `proposal` (one value at or above `--min-share`, default 0.7) or `conflict`. Files whose pattern a framework dictates (Next.js and Remix routes, Storybook stories) do not vote; `excludedByFramework` reports how many were skipped. If a conflict is caused by another framework's mandated pattern, add the paths to overlay `conventionExclusions` and re-run instead of asking the user to decide it.
3. STOP and present one table: convention, observed counts, dominant value, deviating count, matching accelint guidance, and whether the majority contradicts that guidance. Ask the user to accept, change or reject each `proposal` and to decide each `conflict`.
4. In the **worktree**, write the approved result to `.code-quality/standards.md` from [assets/standards-template.md](assets/standards-template.md) and record each conflict decision in `.code-quality/overlay.json` `decisions`. Commit both alone (`chore: add code quality standards`) on their own branch, `refactor/cqo/standards`; this is the first MR/PR of the run, and every theme branch in Step 6 starts from it. Only approved entries are standards.

### Step 2: Baseline

1. Confirm every verification command passed in Step 0. If not, STOP.
2. If the repo has oxlint or ESLint, write a lint report from the worktree into the original checkout's run folder: `oxlint --format=json <scope> > <original>/.code-quality/runs/lint.json` or `eslint --format json <scope> -o <original>/.code-quality/runs/lint.json`. Use the repo's own config; do not add rules for this report.
3. Run `scripts/scorecard.mjs <worktree> --scope <scope> --lint-report <original>/.code-quality/runs/lint.json --out <original>/.code-quality/runs/scorecard-before.json`.
4. For Go modules, run `scripts/go-scorecard.mjs <worktree> --scope <scope> --out <original>/.code-quality/runs/go-scorecard-before.json` (add `--golangci-report <file>` when the repo has a golangci-lint config and you ran it). Read its `warnings`: a tool that is not installed means that metric was not counted, not that it is zero. See [references/go-pack.md](references/go-pack.md).
5. Record the totals in the progress file. These are the "before" numbers for every MR/PR description.
6. If the user wants a committed ratchet baseline, create it in the **worktree**: `scripts/ratchet.mjs update --baseline <worktree>/.code-quality/scorecard.baseline.json --current <original>/.code-quality/runs/scorecard-before.json`, and for Go the same with `go-scorecard.baseline.json` and `go-scorecard-before.json`. Commit them on the standards branch from Step 1.4.

### Step 3: Scan

Scan in this order, so that existing tools win over new rules:
1. **Repo tools** - findings from the lint report, typecheck and test output.
2. **Pack rules** - the detections in the loaded pack reference, for what the repo's tools cannot express.
3. **Standards deviations** - files and packages that deviate from approved entries in `.code-quality/standards.md`.

For each finding record: id, package, file and line, theme, visibility, tier (from [references/tiers.md](references/tiers.md)), source (tool, pack rule or standard), and a one-line consequence. Drop findings that are preferences rather than rules or approved standards.

Get the visibility from the script, not from reading the code: run `scripts/importers.mjs <worktree> <file>...` once for all files with findings. Each export comes back `package-internal`, `package-public` or `unknown` (a library export with no importer the static graph can see) with the reason; anything not exported is file-private. A finding that changes the signature of a `package-public` or `unknown` export is tier C.

### Step 4: Report

1. Write the report from [assets/report-template.md](assets/report-template.md) to `.code-quality/runs/report.md`.
2. Present a table of ALL findings grouped by package and theme, with tier and count, before any detail.
3. Show the before/after for every tier A and B item the user might apply. For tier C, show the problem and the proposed design step only.
4. STOP. Ask: "Apply which items? Enter ids (e.g. 1, 3, 5-8), a theme name, `tier-a` (only if you want autofix applied without per-item review), or `none`." Wait for the answer.

### Step 5: Apply

Load [references/behavior-checks.md](references/behavior-checks.md).

For each approved item, in the worktree:
1. **Snapshot before editing.** Pick the export-diff entries:
   - for a **package-internal** or file-private change: every package entry the file is exposed through (`packageEntries` in the importers output), plus the file itself;
   - for a **package-public** change (tier C): the same, and expect the diff to show exactly the approved change.

   Run `scripts/export-diff.mjs snapshot <worktree> --entry <entry> [--entry <entry>...] --out <original>/.code-quality/runs/<id>-before.json`, and copy each file you are about to edit to `<original>/.code-quality/runs/<id>-<basename>.before` for the side-effect diff. If the snapshot exits 3 (`incomplete`), dependencies are missing: install them in the worktree and snapshot again. Do not edit on an incomplete snapshot.
2. Make one change. Tier A uses the tool's own fixer (`oxlint --fix`, `gofmt`, `golangci-lint run --fix`) restricted to one rule. Tier B is a targeted edit. Tier C follows its approved design in [references/decomposition.md](references/decomposition.md). A performance item also needs the benchmark steps in [references/performance.md](references/performance.md).
3. Run the behavior checks in [references/behavior-checks.md](references/behavior-checks.md) in order, using the snapshot and copies from step 1. A failure reverts that change only (`git restore` of the touched files) and records the reason in the progress file.
4. Commit it alone with the repo's commit style and no AI trailer.
5. Save the progress file.

Stop and ask when a check flags a change for manual review (side-effect diff), when export-diff shows a change for a tier A or B item, or when the same check fails twice.

### Step 6: Package

Load [references/mr-packaging.md](references/mr-packaging.md).

1. Re-run the scorecard on the worktree with `--out <original>/.code-quality/runs/scorecard-after.json` and compare: `scripts/ratchet.mjs check --baseline <original>/.code-quality/runs/scorecard-before.json --current <original>/.code-quality/runs/scorecard-after.json --report-only`; the same for `go-scorecard` when the scope has Go. Nothing may have got worse. If a committed baseline exists, update it in the worktree in the same branch so it drops with the fixes.
2. Group commits into one branch per theme and package under the size cap, each branched from the standards branch (Step 1.4) so no theme MR/PR carries the standards, overlay or baseline commit. Write each description from [assets/mr-description-template.md](assets/mr-description-template.md): what changed, why (cite the standard or rule), scorecard before/after, checks run, and anything flagged for manual review.
3. STOP. Show the branches and descriptions and ask whether to push and open them. Push only what the user approves, using their remote and credentials as already configured. Never merge.
4. If the user wants the ratchet in CI, propose the job from [references/scorecard-and-ratchet.md](references/scorecard-and-ratchet.md) as its own MR/PR, report-only.

## Important Notes

- A clean run is a valid result. If the scope already meets its standard, report the scorecard and stop; do not manufacture findings.
- `scripts/scorecard.mjs` counts syntax, not types. `explicitAny` counts written `any`, not inferred `any`; use the typecheck and type-aware lint for the rest.
- `nestedComponents` counts a PascalCase function that returns JSX inside another component or hook only when that component renders it as `<Name />`. Helpers called as `{renderRow()}` or passed as `rows.map(Row)` are not counted. Storybook stories are measured like tests.
- `importers.mjs` resolves imports with the compiler (tsconfig `paths`, package `exports`, workspace links) but sees only static imports. `unknown` means unproven, not unused; never delete code on that basis.
- `export-diff.mjs` compares per export, so moving a declaration to another file and re-exporting it, reordering declarations, reformatting and body edits are not changes; a type, member, parameter or enum value is.
- If the repo already runs an AI review on MRs/PRs, the optimizer's MRs/PRs go through it too. Do not duplicate that review's rules in this skill's findings.
- Related skills: accelint-ts-best-practices, accelint-react-best-practices, accelint-ts-testing, accelint-react-testing and accelint-ts-performance hold the detailed TypeScript and React rules. When they are installed, invoke them for the per-file review in Step 3. When they are not, use the summaries in the pack reference.
