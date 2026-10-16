# 1.5 MR/PR Packaging

## Overview

Cleanup MRs/PRs fail review for reasons unrelated to their correctness: too large to read, mixing themes, touching code someone else is changing, or arriving with no evidence. Package so that each one can be reviewed in one sitting and reverted on its own.

## Key Principles

1. **One theme in one package**: "Replace loose assertions in `packages/ui`" is a theme. "Cleanup" is not.
2. **Size cap 400 changed lines** by default (overlay `thresholds.mrMaxChangedLines`). A single-rule tier A autofix may exceed it because every hunk is the same mechanical edit.
3. **Evidence in the description**: the standard or rule it applies, scorecard before/after for that package, the checks run and their result, and anything flagged for manual review.
4. **No AI trailers or footers**: No `Co-Authored-By` for a model, no "Generated with" line. Follow the repo's commit message style (check `git log` and any commit lint config).
5. **Prepared, not published**: Branches and descriptions are ready locally. Push and open only after the user approves this run, using the remote and credentials they already configured.
6. **Standards first, on their own branch**: `standards.md`, `overlay.json` and the ratchet baseline go in one MR/PR (`refactor/cqo/standards`) that lands before any theme. Theme branches start from it, so none of them carries those files and two theme MRs/PRs never edit the same baseline.

## Examples

### Pattern 1: The mixed MR

**❌ Incorrect**
```
refactor: quality improvements
- 3 files: loose assertions
- 1 file: split timeline.tsx
- 6 files: enum to as const
- tsconfig: enable noUncheckedIndexedAccess
```

**Why this is wrong:** Four themes and three tiers; a reviewer must approve the tsconfig change to get the assertion fixes, and a failure cannot be traced.

**✅ Correct: four MRs/PRs**
```
test(ui): use exact assertions in layout tests         (tier B, 120 lines)
refactor(ui): replace RecordKind enum with as const     (tier C, exported, 60 lines)
refactor(timeline): split timeline.tsx, step 1 of 4     (tier C, design linked)
chore(ui): enable noUncheckedIndexedAccess              (tier C config)
```

### Pattern 2: Description without evidence

**❌ Incorrect**
```
Cleaned up some types.
```

**✅ Correct** (from [../assets/mr-description-template.md](../assets/mr-description-template.md))
```
Applies the approved standard "no explicit any in non-exported code" (.code-quality/standards.md).

Scorecard for packages/ui: explicitAny 14 -> 6, typeAssertions 31 -> 29.
Checks: pnpm lint ✓, pnpm typecheck ✓, pnpm test --filter ui ✓, export diff: no changes.
Manual review: none.
```

## Branch and Commit Conventions

- Branch: `refactor/cqo/<package>-<theme>`, branched from `refactor/cqo/standards`, unless the repo's contributing guide says otherwise.
- One change per commit, so a failing commit can be reverted alone.
- Commit message: the repo's convention (Conventional Commits if `commitlint` or the history uses it).

## Common Pitfalls

- Opening many MRs/PRs at once against the same package. Reviewers stall; open one or two, and queue the rest.
- Rebasing a reviewed branch with new changes. Add commits instead, so reviewers see what changed.
- Including the progress file or run artifacts in a commit. `.code-quality/progress.md` and `.code-quality/runs/` are git-ignored; only `standards.md`, `overlay.json` and the baseline are committed.
