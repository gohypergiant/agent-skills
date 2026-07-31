# accelint-qrspi-archive audit report

Grade: A-

## Key findings
- The skill is strong on domain-specific archive behavior, ordering, and failure-mode guidance.
- The frontmatter description was informative but did not fully follow the skill-manager convention to start with "Use when," which weakened trigger clarity.
- The file had no short operator-facing usage section, so readers had to enter through dense workflow detail.
- Several internal references still pointed to old step numbers, creating avoidable maintenance drift and ambiguity.

## Exact improvements applied
- Updated `skills/accelint-qrspi-archive/SKILL.md` frontmatter description to start with "Use when," sharpen trigger phrases, and clarify in-scope vs out-of-scope usage.
- Added a concise `## How to Use` section before the workflow overview.
- Corrected stale step references in `SKILL.md` so cross-references now point to current numbered steps.
- Bumped `skills/accelint-qrspi-archive/SKILL.md` `metadata.version` from `1.3.0` to `1.3.1`.
- Added a `1.3.1` entry to `skills/accelint-qrspi-archive/CHANGELOG.md` documenting the changes and rationale.

## Remaining risks
- The skill is still long and structurally dense, which raises maintenance cost and makes future numbering drift likely.
- Some sections repeat rationale in multiple places; further reduction could improve scanability, but that would be a broader editorial pass.
- The skill depends on cross-skill behavior assumptions (`accelint-qrspi-propose`, `accelint-archive-synthesis`) that could drift unless periodically audited together.
