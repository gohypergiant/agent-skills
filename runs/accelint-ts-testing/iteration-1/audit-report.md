# accelint-ts-testing audit report

Grade: A-

## Key findings
- Strong expert knowledge density in `SKILL.md`, especially anti-patterns, audit workflow, and property-based testing guidance.
- Good progressive-disclosure structure with focused reference files and an audit report template.
- Frontmatter needed tightening: the description mixed trigger conditions with capability summary instead of following the repo's "Use when..." trigger-only pattern.
- Package lacks `CHANGELOG.md`, so version history and `metadata.version` alignment cannot be verified.
- `README.md` had a malformed Vitest config example and underrepresented the skill's property-based testing guidance.

## Applied optimizations
- Rewrote the `SKILL.md` description to be trigger-only, more specific, and better aligned with repository skill activation expectations.
- Tightened the `SKILL.md` usage section to emphasize workflow selection, selective reference loading, audit behavior, and required type-checking intent without changing the skill's scope.
- Fixed the `README.md` Vitest config example so it is syntactically correct and explicitly reinforces config-based mock cleanup.
- Updated `README.md` coverage bullets to reflect the skill's actual hierarchy guidance and property-based testing support.

## Recommended next improvements
1. Add `skills/accelint-ts-testing/CHANGELOG.md` in Keep a Changelog format and align it with `metadata.version`.
2. Consider trimming a few long "NEVER" entries in `SKILL.md` into dedicated references if token pressure becomes a concern.
3. Audit references for consistency on assertion guidance such as when to prefer `toBe` vs `toEqual` for primitives.
4. Consider a small example or checklist for the required test-file type-check workflow in a dedicated reference if this skill is used frequently for implementation tasks.

## Semver guidance
- Likely bump if versioning were updated in this stage: patch.
- Rationale: improvements are clarifications, activation-quality fixes, and documentation/example corrections without changing the skill's core contract.
