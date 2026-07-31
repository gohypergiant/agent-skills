# generate-docs skill audit

Grade: B+

## Key findings
- Frontmatter was serviceable but the description under-emphasized update and stale-doc workflows.
- The package lacked two expected audit sections in `SKILL.md`: a concise `NEVER Do` block and a preflight question block.
- The skill has strong operational detail and clear doc-generation rules, but it is more procedural than most repo skills and benefits from sharper guardrails near the top.
- No companion package files were present in this skill directory, so the audit scope was effectively `SKILL.md` only.

## Applied optimizations
- Tightened the description so trigger coverage better matches generation, refresh, and validation tasks in `docs/content/docs/`.
- Added a `## NEVER Do` section to prevent copying maintainer-only internals, inventing behavior, or overwriting manual edits.
- Added a `## Before You Start, Ask` section near the top so the operating mode and scope are clarified before generation or update work.
- Removed the duplicate late-file `## Before You Start` section to reduce repetition.

## Recommended follow-up improvements
- Add a `CHANGELOG.md` and align semantic versioning discipline with the repo norm for future material edits.
- Add `evals/evals.json` covering generation, stale-doc refresh, and validation requests so the skill can be tested consistently.
- Consider moving some lower-level shell snippets into references or scripts if the file continues to grow.

## Semver guidance
- If these `SKILL.md` edits are kept, treat them as a likely patch bump: clearer triggering and stronger guardrails without changing the core contract.
