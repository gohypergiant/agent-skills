## Summary
- Task: Audit and tighten behavior-defining prose for `skills/accelint-qrspi-apply` and its local artifact set
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/CHANGELOG.md`

## Risk summary
1. `SKILL.md` and `README.md` had several locally dense sentences, mixed emphasis styles, and minor wording inconsistencies that made the workflow contract harder to scan.
2. The issues were clarity risks, not trigger or guardrail failures. The rewrite preserved trigger coverage, workflow order, obligation strength, and exact technical references.
3. `CHANGELOG.md` was already near minimum safe form for a historical record. Rewriting it would add drift risk without meaningful clarity gain.

## Rewrite
Applied approved-safe prose improvements directly to:
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/README.md`

The edits tightened local sentence structure, improved scanability, normalized a few behavior-bearing phrasing patterns, and kept exact commands, paths, file names, workflow steps, and hard requirements intact.

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/SKILL.md`
  - Changed: yes
  - Why: Improve local clarity and consistency in a behavior-defining file without changing trigger scope, workflow semantics, or guardrail strength.
  - Notes: Tightened the overview and several step descriptions, clarified a few conditions, improved list readability, and preserved exact commands, paths, and mandatory workflow language.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/README.md`
  - Changed: yes
  - Why: The file belongs in the artifact set and needed local tightening so its explanatory prose stays aligned with the root contract and is easier to scan.
  - Notes: Tightened the opening scope statement, clarified verification language, normalized a few explanatory sentences, and preserved exact command references and behavior boundaries.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/CHANGELOG.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: Historical entries were specific, behavior-anchored, and not worth rewriting because a rewrite would add drift risk without meaningful clarity gain.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
