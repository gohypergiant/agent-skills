{One sentence: what this changes and in which package.}

## Why

Applies {the standard / lint rule}: {name} (`{.code-quality/standards.md}` or `{lint config}`).

## Changes

- {Change, in plain terms}
- {Change}

Tier {A/B/C}. {For tier C: link to the approved design and say which step this is, e.g. "step 2 of 4".}

## Scorecard ({package})

| Metric | Before | After |
|--------|--------|-------|
| {explicitAny} | {14} | {6} |

The ratchet baseline is updated in this {MR/PR}.

## Checks

| Check | Result |
|-------|--------|
| `{lint command}` | {pass} |
| `{format check command}` | {pass} |
| `{typecheck command}` | {pass} |
| `{test command}` | {pass} |
| Export signature diff | {no changes} |
| Side-effect diff | {no changes / flagged: see below} |

## Needs Manual Review

{None. / Function and reason the side-effect diff flagged it.}
