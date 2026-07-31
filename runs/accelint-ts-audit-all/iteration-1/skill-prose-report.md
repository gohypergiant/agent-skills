## Summary
- Task: Audit plus rewrite the full behavior-bearing artifact set for `skills/accelint-ts-audit-all` and apply safe prose improvements directly in the skill package
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-audit-all/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-audit-all/assets/audit-process-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-audit-all/assets/audit-history-template.md`

## Risk summary
- Highest risk was workflow drift in `SKILL.md`, where long imperative bullets mixed hard requirements, rationale, and examples in ways that made step order and blocking conditions harder to scan.
- Secondary risk was terminology drift around tracking files, coverage-disabled test runs, and two-phase approval language across the root skill and the process template.
- No trigger-coverage changes were needed. The command-only boundary and exact invocation contract were preserved.

## Rewrite summary
- Tightened `SKILL.md` for more direct, stable workflow language while preserving the same command-only scope, step order, approval gates, and hard-stop strength.
- Tightened `assets/audit-process-template.md` so the generated tracking file mirrors the same two-phase approval pattern, verification-command rules, and PBT stability requirements more consistently.
- Left `assets/audit-history-template.md` unchanged because it was already near minimum safe form and further editing would add drift risk without meaningful clarity gain.

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-audit-all/SKILL.md`
  - Changed: yes
  - Why: Improve scanability, stabilize terminology, and separate instructions from explanation without changing trigger coverage, workflow semantics, or guardrail strength.
  - Notes: Tightened high-density guardrail bullets, clarified setup questions, normalized references to the `audit-process file`, and improved local sentence structure around worktree setup, template loading, and file-discovery rules.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-audit-all/assets/audit-process-template.md`
  - Changed: yes
  - Why: Keep the generated process file aligned with the rewritten root workflow language and reduce ambiguity in approval, save-progress, and PBT verification instructions.
  - Notes: Tightened the eight-step sequence wording, clarified numbered-list acceptance and coverage-disabled test runs, and improved blocking-instruction readability.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-audit-all/assets/audit-history-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is a stable archival template with clear sectioning and no material terminology or guardrail drift relative to the rewritten root files.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
