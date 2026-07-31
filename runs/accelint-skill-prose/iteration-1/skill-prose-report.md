High-risk findings were concentrated in the root `SKILL.md`, where several long sentences and repeated framing made output-mode boundaries, artifact-set rules, and rewrite-safety checks harder to scan than necessary. The main risk was misread behavior, not obvious trigger drift, so the rewrite focused on structural tightening, clearer lead sentences, and more consistent local phrasing without changing scope, workflow order, guardrail force, or exact references.

The reference set was already closely aligned with the root contract. I applied small local-tightening edits across `references/*.md` where sentence structure or repeated framing could be clearer, and I left other inspected behavior-bearing files unchanged only when a rewrite would not produce meaningful clarity gain.

## Summary
- Task: Audit and rewrite the full artifact set for `skills/accelint-skill-prose`, apply safe strict-mode improvements directly in the skill package, and write this report.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/checklist.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/frontmatter-descriptions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/workflow-guardrails.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/ste-compatible-rules.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/rfc-2119.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/examples.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/artifact-patterns.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving strict-mode rewrite to improve scanability, separate rules from explanation more consistently, and tighten repeated phrasing in the main contract file.
  - Notes: tightened the frontmatter description without changing trigger families; clarified operational lead sentences; shortened repeated framing; kept output-mode, rewrite-mode, artifact-set, self-check, and guardrail logic intact.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/checklist.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved checklist phrasing and parallel structure without changing any checks.
  - Notes: normalized the opening instruction and kept all verification items intact.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/frontmatter-descriptions.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved sentence structure and kept trigger-scope warnings explicit.
  - Notes: clarified that folder-level description edits must still match the body guidance across the folder.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/workflow-guardrails.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved scanability around order, gates, and exactness checks.
  - Notes: preserved every workflow-safety rule and kept the same exact-reference list.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/ste-compatible-rules.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved sentence flow and reduced redundant wording.
  - Notes: preserved the adapted STE framing and kept all sentence-level safety rules intact.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/rfc-2119.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved directness and consistency in the normalization guidance.
  - Notes: preserved the same RFC 2119 mapping and exact source URL.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/examples.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved example explanations and kept the example set stable.
  - Notes: preserved all examples that define scope, no-rewrite behavior, and workflow-safety boundaries.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/references/artifact-patterns.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved the positive-pattern guidance and list formatting.
  - Notes: preserved the artifact-shaping model and linked-reference handoffs.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/README.md` and `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose/assets/output-template.md` were inspected for contract alignment, but they were not treated as behavior-bearing rewrite targets for this pass because the request required the full artifact set for the skill instructions and references; no unresolved contract drift was found in those inspected support files.
- No `AGENTS.md` was present in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-skill-prose`.
- None noted.
