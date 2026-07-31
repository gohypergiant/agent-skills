# Audit Report: accelint-react-best-practices

Grade: A-

## Key findings
- Strong overall skill with clear progressive-disclosure structure, good React-specific knowledge density, and solid reference coverage.
- Frontmatter description was effective but not fully aligned with skill-manager guidance because it led with broad marketing language and an "ALWAYS use" instruction instead of a cleaner use-when framing.
- The report-template section mixed audit workflow with direct implementation cases and included generic category language that did not cleanly match this skill.
- Compiler awareness was present in multiple places, but the high-level performance philosophy did not reinforce that check early enough.

## Exact improvements applied
- Updated `skills/accelint-react-best-practices/SKILL.md` frontmatter description for clearer activation criteria and more maintainable trigger wording.
- Updated `skills/accelint-react-best-practices/SKILL.md` to narrow report-template guidance to audit and multi-issue review cases.
- Updated `skills/accelint-react-best-practices/SKILL.md` performance philosophy to explicitly check React Compiler before manual memoization advice.
- Bumped `skills/accelint-react-best-practices/SKILL.md` `metadata.version` from `1.8.0` to `1.8.1`.
- Added `1.8.1` entry to `skills/accelint-react-best-practices/CHANGELOG.md` and kept version alignment intact.

## Remaining risks
- The skill still duplicates some overview material across `SKILL.md`, `AGENTS.md`, and `README.md`, which may increase maintenance cost over time.
- The trigger surface is intentionally broad; this is useful for capture, but it may still over-activate relative to narrower React-adjacent skills in mixed React/Next.js work.
- Reference-set growth is healthy but may benefit from periodic consolidation if overlap between patterns increases.
