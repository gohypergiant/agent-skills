High-risk issues were concentrated in `skills/accelint-onboard-openspec/SKILL.md`, where several sections buried the operational rule behind softer framing or inconsistent heading structure. The rewrite tightened those sections without changing trigger coverage, workflow order, approval logic, or exact technical references.

The artifact-set sweep also found local clarity issues in `skills/accelint-onboard-openspec/README.md`. Those were tightened to match the skill contract more closely. `CHANGELOG.md` was already near the minimum safe form and was left unchanged.

## Rewritten files

### `skills/accelint-onboard-openspec/SKILL.md`
- Tightened heading and sentence structure so operational rules lead more often.
- Normalized several section headings to a more direct, consistent form.
- Rewrote selected explanatory sentences to keep the same behavior while reducing scan friction.
- Preserved all trigger phrases, workflow phases, mode logic, examples, exact tokens, and YAML rules.

### `skills/accelint-onboard-openspec/README.md`
- Tightened local prose and reduced unnecessary wording.
- Clarified a few behavior-relevant explanations so the README stays aligned with the skill contract.
- Preserved mode descriptions, agent-count expectations, and exact file/token references.

## Summary
- Task: Audit plus rewrite `skills/accelint-onboard-openspec` in `mode=strict`, including artifact-set tightening and direct repo edits
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `skills/accelint-onboard-openspec/SKILL.md`, `skills/accelint-onboard-openspec/README.md`, `skills/accelint-onboard-openspec/CHANGELOG.md`

## What changed
- `skills/accelint-onboard-openspec/SKILL.md`
  - Changed: yes
  - Why: Tightened workflow and guardrail prose so the operational point appears earlier and the contract is easier to audit without changing behavior.
  - Notes: Normalized headings, tightened instructions in Phase 0 through Phase 4, and improved consistency in interaction-principles wording.

## Other artifact-set files
- `skills/accelint-onboard-openspec/README.md`
  - Changed: yes
  - Why: Local-tightening sweep found low-risk sentence-structure and scanability improvements that preserved behavior and kept the README aligned with the root skill.
  - Notes: Tightened wording around prerequisites, inference behavior, TODO handling, and validation summaries.
- `skills/accelint-onboard-openspec/CHANGELOG.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is factual release history. Rewriting it would add drift risk without meaningful clarity gain.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
