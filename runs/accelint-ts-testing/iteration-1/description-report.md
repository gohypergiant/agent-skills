# accelint-ts-testing description report

## Summary
Updated the skill description in `skills/accelint-ts-testing/SKILL.md` to improve trigger accuracy and boundary clarity without changing the skill's actual behavior.

## Changes made
- Kept the core trigger list centered on Vitest and Vitest-style TypeScript test work.
- Changed the phrasing from broad pattern spotting to request-focused activation (`when the request mentions ...`) to better match real invocation conditions.
- Added an explicit preference statement for the skill's best-fit uses:
  - Vitest unit and integration testing guidance
  - test-quality audits
  - fast-check / property-based testing opportunities
- Added explicit non-goals to reduce false positives:
  - Jest-only requests
  - Playwright end-to-end coverage
  - TypeScript documentation work unless the main problem is still Vitest test quality

## Rationale
The existing description already matched the skill's real content well, but it under-emphasized activation boundaries. The default eval set includes several near-miss cases around Jest, Playwright, and non-testing TypeScript work, so the revised description now makes those boundaries explicit while preserving strong triggers for Vitest authoring, audits, async issues, assertion quality, mocking strategy, and property-based testing.

## Verification
- Verified the edited description in `skills/accelint-ts-testing/SKILL.md`.
- Wrote this report to `runs/accelint-ts-testing/description-report.md`.
- No changelog or version updates were made in this stage.
