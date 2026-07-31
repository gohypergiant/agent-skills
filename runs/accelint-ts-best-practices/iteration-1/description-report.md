# accelint-ts-best-practices description optimization report

## Result
Updated the frontmatter description in `skills/accelint-ts-best-practices/SKILL.md`.

## What changed
Replaced the older broad summary with a more trigger-oriented description that:
- frames the skill around code-health intent (`review`, `audit`, `refactor`, `clean up`, `best-practices pass`)
- names the concrete TS/JS failure modes this skill should win on (`any`, union narrowing, null/undefined handling, return values, `enum`, `type` vs `interface`, mutation, control flow, duplication, validation)
- makes the primary decision boundary clearer by emphasizing correctness/maintainability over speed
- explicitly excludes adjacent domains that should route elsewhere: performance, tests, security, docs/JSDoc, and framework-specific debugging

## Why this change was warranted
I ran the skill-creator description optimization loop non-interactively with a generated trigger eval set at:
- `runs/accelint-ts-best-practices/trigger-evals.json`

The original description was accurate, but it was structured more like a topic list than a strong trigger description. The optimized candidate produced the best held-out result from the loop:
- original test score: `3/6`
- best held-out test score found: `4/6`
- optimization results: `runs/accelint-ts-best-practices/2026-07-30_162307/results.json`

## Notes
The optimization loop still under-triggered on several positive evals, so this is an incremental improvement rather than a full fix. I applied the best held-out description because it improved positive coverage without introducing obvious unsafe scope expansion in the negative cases.
