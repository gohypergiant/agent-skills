# Skill Prose Report — accelint-onboard-agent

## Summary
Strict audit-plus-rewrite completed for the full discovered artifact set under `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent`.

Inspected artifacts:
- `SKILL.md`
- `README.md`
- `CHANGELOG.md`
- `evals/evals.json`

Discovered support files:
- No `references/` directory or other local behavior-bearing prose artifacts were present.

Applied direct edits where the prose could be tightened without changing trigger coverage, workflow order, guardrail force, or exact technical references.

## Highest-risk issues first
1. Minor wording drift risk inside `SKILL.md` where some sentences used softer or less direct phrasing around phase behavior and file checks. These did not currently change behavior, but they made critical instructions less scannable.
2. `README.md` contained several places where behavior-preserving details were present but buried in looser phrasing, especially around mode selection, related-document detection, and preview-before-write expectations.
3. Cross-file naming and explanation quality were mostly aligned already, so the main need was local tightening rather than structural correction.

## Findings by artifact

### 1. `SKILL.md`
Status: Edited

Why it changed:
- Tightened the opening contract and separation-of-concerns language.
- Made imperative instructions more direct in Phase 0 and Phase 4.
- Improved scanability in related-document checks and discovery guidance.
- Fixed a wording inconsistency so the follow-up instruction now matches the earlier intent question (`work with what's there`).
- Preserved all behavior-bearing tokens, examples, paths, commands, and workflow order.

Key adjustments:
- Replaced softer setup phrasing with clearer operational wording.
- Split a few dense sentences where sequence and obligation mattered.
- Kept all hard rules, modes, examples, and template content intact.

### 2. `README.md`
Status: Edited

Why it changed:
- Tightened the skill summary and usage guidance.
- Clarified that the skill infers behavior before asking questions.
- Improved the explanation of the four phases without changing substance.
- Clarified related-document handling for both `openspec/config.yml` and `openspec/config.yaml`.
- Reduced repetitive or inflated wording around separation of concerns and common mistakes.

Key adjustments:
- Standardized capitalization and wording in trigger examples.
- Made mode descriptions and phase descriptions more direct.
- Preserved all behavioral promises and examples.

### 3. `CHANGELOG.md`
Status: Unchanged
Reason: Already near minimum safe form

Notes:
- The file is concise, structurally clear, and behaviorally aligned with the current version.
- Further tightening would add little clarity and risk weakening release-history precision.

### 4. `evals/evals.json`
Status: Unchanged
Reason: Rewrite would add drift risk without meaningful clarity gain

Notes:
- The eval prose is already explicit about expected behavior, boundary cases, and workflow checks.
- Because eval strings act as behavioral assertions, unnecessary rewriting would create avoidable drift risk.

## Cross-file consistency check
Completed.

Results:
- Artifact set remains aligned on the behavior-versus-project-DNA boundary.
- Preview-before-write behavior remains explicit and intact.
- Mode semantics remain intact across `SKILL.md`, `README.md`, and eval expectations.
- No stale `references/` handoffs or linked local prose artifacts were present.

## Rewrite safety check
Confirmed:
- Trigger intent and scope were preserved.
- Workflow order and approval semantics were preserved.
- Hard-stop strength was preserved.
- Exact technical references, paths, commands, file names, and example tokens were preserved.
- No eval-facing assertions were broadened or narrowed.

## Files changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent/README.md`

## Files inspected but unchanged
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent/CHANGELOG.md` — Already near minimum safe form
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agent/evals/evals.json` — Rewrite would add drift risk without meaningful clarity gain

## Final assessment
The artifact set was already behaviorally solid. The applied rewrite focused on local sentence structure, directness, and scanability, especially in `SKILL.md` and `README.md`, while preserving the skill’s exact operating contract.