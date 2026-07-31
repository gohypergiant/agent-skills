Highest-risk issues first

1. `skills/accelint-qrspi-archive/SKILL.md` used an informal severity label (`Critical:`) for a behavior-defining batch rule in `Workflow Overview`. That wording carried a hard requirement, but the obligation level was less explicit than the surrounding hard-stop language. Converting it to `REQUIRED:` clarifies force without changing behavior.
2. Several workflow-heavy sections in `skills/accelint-qrspi-archive/SKILL.md` bundled action, rationale, and exceptions into long sentences. The risk was local misread of timing or actor boundaries, especially around inline archive execution and unconditional subagent use. Tightening those sentences reduced scan risk without changing workflow order.
3. The subagent prompt and error-handling sections had a few local phrasing issues that made exact roles slightly harder to follow, such as who merges partner lists or when a field name must be surfaced. These were clarity issues, not contract drift, but they were worth tightening in strict mode.

## Rewrite

Updated `skills/accelint-qrspi-archive/SKILL.md` to tighten behavior-bearing prose while preserving workflow semantics, hard stops, exact references, and frontmatter unchanged. Frontmatter was intentionally not audited or rewritten per request.

## Summary
- Task: Audit plus rewrite the behavior-defining prose in `skills/accelint-qrspi-archive`, excluding frontmatter entirely, and write the report to `runs/accelint-qrspi-archive/iteration-2/skill-prose.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-archive/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-archive/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-archive/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability and obligation clarity in workflow and guardrail prose while preserving exact workflow order, hard-stop strength, and exact technical references. Frontmatter was intentionally left untouched per task requirements.
  - Notes: converted the informal `Critical:` label to `REQUIRED:` where it expressed a hard requirement; split dense workflow sentences in `What This Skill Does`, `Workflow Overview`, step 6, step 22, and `Error Handling`; tightened phrasing around inline archive execution, subagent responsibilities, and fallback conditions without changing semantics.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-archive/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: inspected as a behavior-adjacent skill artifact during the local-tightening sweep; it records version history clearly and does not define current workflow behavior.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-archive/SKILL.md` was intentionally excluded from audit and rewrite per task requirements.
- No sibling `AGENTS.md` or local `references/*.md` files were present in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-qrspi-archive`, so the artifact set for this stage was limited to the files listed above.
