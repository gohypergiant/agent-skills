Critical findings first
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/SKILL.md` had a behavior-risk issue in non-frontmatter prose: the recognised-shape example listed `specs` instead of the actual rule key `spec`. That could misstate Refresh-mode detection semantics. The rewrite corrects the key without changing the intended contract.
- The same file also had several places where workflow and fallback rules were accurate but harder to audit than necessary because conditions, action order, and rationale were split across long lines or mixed sentence shapes. The rewrite keeps the same mode logic, approval gates, and subagent fallback behavior while making those rules easier to scan.
- Supporting prompt content in `README.md` and `references/*.md` was broadly aligned but had a few wording patterns that were looser or less consistent than the root contract. The rewrite tightens those files for local clarity and cross-file consistency without changing trigger scope or workflow meaning.

## Rewritten files

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/SKILL.md`
- Tightened non-frontmatter prose throughout the operational sections.
- Preserved phase order, mode boundaries, preview-before-write behavior, and the separation between `openspec/config.yaml` project DNA and `AGENTS.md` / `CLAUDE.md` behavioral guidance.
- Corrected the known rule-key example from `specs` to `spec` in the recognised-shape rule so the text matches the actual config structure.
- Standardized wording around subagent fallback, TODO handling, and preview-generation rules to reduce ambiguity without changing behavior.

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/README.md`
- Tightened supporting prose so it matches the root skill contract more closely.
- Preserved the same user-facing workflow, modes, and troubleshooting coverage.
- Clarified a few operational lines, especially around mode naming, inline fallback when subagents are unavailable, and TODO handling.

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/references/config-template.md`
- Applied a minimal local tightening pass only.
- Preserved the exact template structure and all behavior-bearing placeholders.

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/references/yaml-safety.md`
- Applied a minimal local tightening pass only.
- Preserved the YAML-safety rules, examples, and validation checklist exactly in substance.

## Summary
- Task: Audit plus rewrite the non-frontmatter prose and supporting prompt content for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec`, in `mode=strict`, while skipping all frontmatter review and edits.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/references/config-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/references/yaml-safety.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structural tightening improved auditability of workflow order, fallback conditions, and guardrail wording in the root contract.
  - Notes: tightened sentence structure, normalized a few operational terms, preserved all mode logic and exact technical references, and corrected the recognised-shape example to use the actual `spec` rule key.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/README.md`
  - Changed: yes
  - Why: local-tightening sweep found low-risk clarity improvements and wording that should align more closely with the root skill contract.
  - Notes: preserved user-facing scope and workflow while tightening mode descriptions, subagent fallback wording, and TODO guidance.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/references/config-template.md`
  - Changed: yes
  - Why: local-tightening sweep found a safe wording improvement in the introductory instruction without changing template behavior.
  - Notes: exact template structure, placeholders, examples, and rule content stayed intact.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/references/yaml-safety.md`
  - Changed: yes
  - Why: local-tightening sweep found safe wording improvements in the introductory guidance and quoting rule.
  - Notes: preserved all YAML-safety constraints, examples, and checklist semantics.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: inspected for artifact-set awareness and current version context only; no prose change was needed for this task.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from both audit and rewrite per instruction, so trigger-description validation was limited to confirming that no frontmatter changes were made.
- No sibling `AGENTS.md` exists in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-openspec`.
