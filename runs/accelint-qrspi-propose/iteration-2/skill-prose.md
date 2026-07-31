Highest-risk issues first

1. Root `SKILL.md` had a few remaining sentence-shape and severity inconsistencies in behavior-bearing prose outside frontmatter. None looked like trigger drift, but several lines made requirement force or action timing slightly harder to scan than necessary.
2. The strongest opportunities were local tightening around checkpoint timing, vertical-slicing enforcement, and a few guardrail sentences in Error Handling and NEVER Do This. These were safe structural edits because they preserved exact tokens, workflow order, and approval gates.
3. No sibling `AGENTS.md`, `references/`, or other linked behavior-bearing Markdown files were present in this skill folder, so the artifact set was limited and the crawl was complete.

## Rewrite

Updated `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/SKILL.md` to tighten behavior-defining prose while leaving frontmatter unchanged.

Key rewrite themes:
- tightened a few opening and checkpoint sentences so the operational rule appears earlier
- improved local scanability around frontmatter-capture timing and approval gating
- normalized a few requirement statements for clearer force without changing the rule
- clarified several guardrail and error-handling sentences while preserving exact commands, paths, tokens, and examples
- kept workflow order, prompts, checklist-format rules, and all quoted or inline technical anchors intact

## Summary
- Task: Audit plus rewrite `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose` in strict mode, excluding frontmatter entirely, and record the result
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved scanability, requirement clarity, and wording consistency in workflow and guardrail prose while preserving workflow semantics, approval logic, and exact technical references
  - Notes: Left frontmatter untouched as required. Tightened non-frontmatter prose around the workflow overview, checkpoint timing, vertical-slicing validation, error handling, and NEVER Do This guardrails.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/README.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: Reviewed as part of the artifact set and local-tightening sweep. It is not the canonical behavior contract for this pass, and additional edits would add little clarity relative to drift risk.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-propose/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: Reviewed for context and version history only. It records prior behavior-preserving edits and did not need local prose tightening for this task.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from audit and rewrite per instruction.
- No sibling `AGENTS.md`, `references/`, or linked behavior-bearing Markdown files were present in this skill folder during this crawl.
