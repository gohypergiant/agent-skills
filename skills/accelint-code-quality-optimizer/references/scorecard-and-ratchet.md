# 1.4 Scorecard and Ratchet

## Overview

On a large codebase you cannot fix every violation before enabling a rule, and if you enable it as a plain error nobody can merge. The ratchet lets a rule start at today's count per package and only go down. The scorecard is also what shows whether the cleanup is working.

## Key Principles

1. **Lint tool counts win**: When a lint rule counts something the scorecard also counts (for example `no-explicit-any`), report the lint count and use the scorecard number only where no rule exists.
2. **Ratchet what has a direction**: `RATCHETED` metrics are always worse when higher. Size and effect counts are informational; a package that grows is not a regression.
3. **The baseline only moves on purpose**: `ratchet.mjs update` refuses when anything regressed. `--allow-regressions` is for a decision the team made, never for getting a pipeline green.
4. **Introduce CI report-only**: The job must not block merges until the team agrees.

## Metrics

| Metric | Counted from | Ratcheted |
|--------|-------------|-----------|
| `explicitAny` | `any` keyword in type positions | yes |
| `typeAssertions` | `as T` and `<T>x`, excluding `as const` | yes |
| `doubleAssertions` | `as unknown as T`, `as any as T` | yes |
| `nonNullAssertions` | `x!` | yes |
| `tsSuppressions` | `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck` | yes |
| `lintSuppressions` | `eslint-disable*`, `oxlint-disable*` | yes |
| `enums` | `enum` declarations | yes |
| `consoleCalls` | `console.*` in non-test sources | yes |
| `nestedComponents` | JSX-returning PascalCase functions inside a component or hook that the enclosing component renders as `<Name />` (not `rows.map(Row)` or `{renderRow()}`) | yes |
| `looseAssertions` | `toBeTruthy`, `toBeFalsy`, `toBeDefined`, `toHaveBeenCalled()` without args, in tests | yes |
| `filesOverWarn`, `filesOverMax` | non-test source files over the thresholds (500 and 1000 lines by default) | yes |
| `sourceFiles`, `testFiles`, `sourceLines`, `testLines`, `maxFileLines`, `effects` | file counts, line counts, `useEffect`/`useLayoutEffect` calls | no |
| `unusedFiles`, `unusedExports` | per-package counts from `--unused-report` ([removal.md](removal.md)) | yes, when the report is passed |
| `duplicatedLines` | lines in the second copy of each clone, from `--duplicates-report` | yes, when the report is passed |
| `passThroughs` | named functions whose body only forwards their parameters to one call | no |
| `lint:<rule>` | diagnostics per rule from `--lint-report` | yes |

Thresholds come from the overlay file (`thresholds.fileLinesWarn`, `thresholds.fileLinesMax`).

**Which files are measured.** Every TypeScript/JavaScript source the repo tracks, excluding `.d.ts`, generated files, files git ignores, overlay `ignore` globs, and known tool configs (`vitest.config.ts`, `eslint.config.mjs`, `.prettierrc.js` and similar; a product file named `config.ts` or `router.config.ts` is measured). Storybook stories count as tests: their console calls and nested components are not counted.

Type-safety metrics (`explicitAny` through `enums`) count test files too, because `any` and casts in tests hide the same breakage. Each package's `samples` lists up to five `file:line` locations per metric for spot checks. In repos with `noUncheckedIndexedAccess`, most `nonNullAssertions` are `arr[i]!`; treat those as a sign the code wants a bounds check or `.at()` handling, not as a mechanical tier A fix.

## Commands

```bash
oxlint --format=json . > .code-quality/runs/lint.json         # or: eslint --format json . -o ...
node scripts/scorecard.mjs . --lint-report .code-quality/runs/lint.json --out scorecard.json
node scripts/ratchet.mjs update --baseline .code-quality/scorecard.baseline.json --current scorecard.json   # first time
node scripts/ratchet.mjs check  --baseline .code-quality/scorecard.baseline.json --current scorecard.json   # CI
```

Commit `.code-quality/scorecard.baseline.json`. After an MR/PR that improves numbers, run `update` in that MR/PR so the baseline drops with it.

Go modules use `scripts/go-scorecard.mjs` (metrics in [go-pack.md](go-pack.md)) with its own baseline, `.code-quality/go-scorecard.baseline.json`, and the same `ratchet.mjs` commands. In CI add a second job (or step) with `go-scorecard.mjs . --out go-scorecard.json` and `ratchet.mjs check --baseline .code-quality/go-scorecard.baseline.json --current go-scorecard.json`, in an image that has `go`, `staticcheck` and `ast-grep` (`npm i -g @ast-grep/cli`); the script's `warnings` say which tools it could not run.

## CI Jobs

The scripts need Node 20+ and the repo's installed `typescript`; they run in the repo's existing Node CI image after its normal install. Copy the scripts into the target repo (for example `tools/code-quality/`) so CI does not depend on where the skill is installed.

**GitLab CI** (report-only; set the runner tag to the repo's own):
```yaml
code_quality_ratchet:
  stage: test
  tags: ["${CQO_RUNNER_TAG}"]
  allow_failure: true
  script:
    - pnpm exec oxlint --format=json . > lint.json || true
    - node tools/code-quality/unused.mjs . --out unused.json
    - node tools/code-quality/duplicates.mjs . --out duplicates.json
    - node tools/code-quality/scorecard.mjs . --lint-report lint.json --unused-report unused.json --duplicates-report duplicates.json --out scorecard.json
    - node tools/code-quality/ratchet.mjs check --baseline .code-quality/scorecard.baseline.json --current scorecard.json
  artifacts:
    when: always
    paths: [scorecard.json]
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

**GitHub Actions** (report-only):
```yaml
  code-quality-ratchet:
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx oxlint --format=json . > lint.json || true
      - run: node tools/code-quality/unused.mjs . --out unused.json
      - run: node tools/code-quality/duplicates.mjs . --out duplicates.json
      - run: node tools/code-quality/scorecard.mjs . --lint-report lint.json --unused-report unused.json --duplicates-report duplicates.json --out scorecard.json
      - run: node tools/code-quality/ratchet.mjs check --baseline .code-quality/scorecard.baseline.json --current scorecard.json
```

`|| true` on the lint step is deliberate: lint exits non-zero when it finds violations, and the ratchet, not the linter, decides whether the job fails.

## Examples

### Pattern 1: Enabling a rule on a large codebase

**❌ Incorrect: turn it on as an error and fix everything in one MR**
```json
{ "rules": { "typescript/no-explicit-any": "error" } }
```

**Why this is wrong:** Hundreds of violations in one MR, or a red pipeline for everyone until they are fixed.

**✅ Correct: enable as a warning, ratchet the count**
```json
{ "rules": { "typescript/no-explicit-any": "warn" } }
```
Then update the baseline in the same MR. New `any` raises `lint:typescript-eslint(no-explicit-any)` for that package and the ratchet flags it; fixes lower it.

## Common Pitfalls

- Comparing a scoped scorecard against a whole-repo baseline. The ratchet warns when scopes differ; use the same scope for both.
- Running the check without `--unused-report`/`--duplicates-report` when the baseline tracks those metrics. The ratchet warns and skips them; it never reads a missing report as zero.
- Running the check without `--lint-report` when the baseline tracks lint. The ratchet warns and skips lint comparison instead of failing.
- Updating the baseline from a branch that regressed elsewhere. `update` refuses; investigate the regression instead.
- Expecting a new package to fail the check. A package not in the baseline has no history, so `check` lists it under `newPackages` with its counts and passes; run `update` in the MR/PR that adds it so it is ratcheted from then on. Packages that disappear are listed under `removedPackages`, which makes a rename visible.
