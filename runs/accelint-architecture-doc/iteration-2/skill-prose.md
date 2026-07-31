High-risk issues first

- The root guidance used mixed severity styles such as `NEVER`, `should`, and `should not`, which made the obligation level less consistent than it needed to be for behavior-defining prose.
- Several workflow passages buried the operational rule inside long sentences, which increased the risk of timing or gating misreads during execution.
- The skill had no sibling `AGENTS.md`, so the artifact set was limited to the root `SKILL.md` and the linked `references/template.md` file.

Rewritten excerpt

File: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md`

- Normalized the guardrail heading and bullets to RFC 2119-style obligation language where the source clearly expressed absolute requirements.
- Tightened several workflow passages so the required action appears earlier without changing step order, approval logic, or exact references.
- Preserved all frontmatter exactly, per request.

## Summary
- Task: Audit plus rewrite the behavior-defining prose for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc` in strict mode, excluding frontmatter from audit and rewrite.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/references/template.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved local clarity, normalized obligation language, and surfaced workflow actions earlier without changing trigger scope, workflow order, or exact technical references.
  - Notes: Kept frontmatter untouched. Reworked the guardrail heading and bullets to use `MUST NOT` for absolute prohibitions, tightened several refresh and preview instructions, and simplified sentence structure in workflow sections.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/references/template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is an exact output skeleton with behavior-bearing placeholders and comments. A rewrite would add drift risk without meaningful clarity gain.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from both audit and rewrite, per request.
- No sibling `AGENTS.md` was present in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc`, so no additional behavior-bearing sibling guidance file was part of the artifact set.
