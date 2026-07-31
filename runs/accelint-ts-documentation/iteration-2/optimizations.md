# Stage 3 Optimizations — accelint-ts-documentation

## 1) Align internal-code JSDoc policy across the skill package
- **recommendation addressed**: Align internal-code documentation policy across `SKILL.md` and `references/jsdoc.md`.
- **evidence type supporting it**: Static audit evidence
- **files changed**: `.agents/skills/accelint-ts-documentation/references/jsdoc.md`
- **summary of implementation**: Rewrote the `## Scope` opening so it explicitly follows the two-tier policy from `SKILL.md`: exported code requires comprehensive JSDoc, while internal code uses judgment-based documentation. Also clarified that internal code may omit JSDoc entirely when it is already self-evident.
- **reason this change matches the evidence**: Stage 1 found a direct policy conflict between `SKILL.md` and `references/jsdoc.md`. Updating the reference resolves the exact inconsistency that could mislead future runs.

## 2) Do not apply broader prose consolidation in Stage 3
- **recommendation addressed**: Reduce duplicate policy text and tighten broader wording across package files.
- **evidence type supporting it**: Static audit evidence only
- **files changed**: None in this stage
- **summary of implementation**: Deferred broader cleanup during Stage 3.
- **reason this change matches the evidence**: The evidence showed only mild verbosity/duplication, with no executed eval failures, no runtime blockers, and no proof that broader edits would improve outcomes. A narrow patch best matches the confidence level.

## 3) Sanity check on optimization scope
- **recommendation addressed**: Keep changes narrow and avoid broad structural rewrites.
- **evidence type supporting it**: Static audit evidence plus follow-up audit review
- **files changed**: `.agents/skills/accelint-ts-documentation/references/jsdoc.md`
- **summary of implementation**: Confirmed via a second audit pass that the minimal reference-policy correction is aligned with the observed evidence and that broader edits would overreach.
- **reason this change matches the evidence**: The follow-up review concluded the policy mismatch was concrete, while broader cleanup lacked empirical justification in this run.
