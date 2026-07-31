Summary
- Highest-risk issue before rewrite: rhetorical severity labels such as "CRITICAL," "IMPORTANT," and "MANDATORY" sometimes did normative work without clearly separating obligation strength from emphasis. This created mild audit friction in a workflow that depends on exact execution order and hard stops.
- Secondary risk before rewrite: several sections buried the operational point behind "Goal" or "Why this matters" framing, which made the action path slower to scan even though the underlying behavior was sound.
- Frontmatter was intentionally excluded from both audit and rewrite, per instruction.

Rewrite

Updated file: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/SKILL.md`

Key rewrite outcomes:
- Preserved all workflow steps, step numbers, commands, paths, and examples.
- Tightened section leads so the operational rule appears earlier.
- Improved local scanability in workflow and guardrail sections without changing execution order.
- Kept hard-stop wording intact where it carries behavior.
- Skipped all frontmatter review and edits, including `description` and `metadata.version`.

## Summary
- Task: Audit and rewrite behavior-defining prose in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply` in audit plus rewrite mode with `mode=strict`, while skipping frontmatter entirely
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability, surfaced rules earlier, and reduced ambiguity around workflow narration versus explanation without changing commands, order, or guardrail force
  - Notes: tightened section leads; clarified context-loading prose; improved list and sentence structure around execution, living-document updates, verification, edge cases, and hard stops; preserved all step numbers, exact commands, file paths, examples, and frontmatter by leaving frontmatter untouched

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/README.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: inspected for terminology, workflow wording, and local sentence-structure quality; no change was needed to preserve consistency with the rewritten `SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: inspected because it is a behavior-bearing support artifact for version history and design-rationale context, but the current entries are already sufficiently explicit for their purpose and did not require local tightening

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was not audited or rewritten by request. Trigger-description and metadata-level prose therefore remain unassessed in this stage.
- No sibling `AGENTS.md` was present in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply`.
- No local `references/*.md` files were present in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-apply`.
