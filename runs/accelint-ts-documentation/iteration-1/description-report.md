# accelint-ts-documentation description report

## Summary
Updated the skill description to improve trigger accuracy and activation quality without changing the skill's actual scope.

## Changes made
- Reframed the opening around the skill's primary job: JavaScript/TypeScript documentation quality.
- Added more concrete trigger phrases for both JSDoc and comment-quality work.
- Expanded JSDoc coverage in the description to include exported functions, types, and classes plus `@throws`.
- Expanded comment trigger coverage to include `HACK` and `NOTE`, dead comments, edit-history comments, and comment placement.
- Added the internal-docs sufficiency judgment use case so nuanced review requests activate correctly.
- Added an explicit boundary: do not use this skill for general TypeScript code-quality reviews unless documentation is the primary focus.

## Rationale
The existing description was directionally correct but a bit narrow and underspecified in two places:
1. It emphasized JSDoc and a few marker types, but the skill also covers broader comment hygiene and judgment-based documentation review.
2. It lacked a strong negative boundary, which could allow false-positive activation on general TypeScript review requests.

The new description stays aligned with the current SKILL.md behavior and the generated eval set by making the main triggers more specific while clarifying when the skill should not activate.

## Verification
- Verified the updated frontmatter description in `skills/accelint-ts-documentation/SKILL.md`.
- Used the existing generated eval set in `skills/accelint-ts-documentation/evals/evals.json` as context for trigger and boundary coverage.
