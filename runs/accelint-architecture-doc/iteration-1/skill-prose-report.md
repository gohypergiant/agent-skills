## Summary
- Task: Audit and rewrite the behavior-defining prose for `skills/accelint-architecture-doc`.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/references/template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/CHANGELOG.md`

## Highest-risk issues first
1. `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/README.md` described agent-behavior-doc integration incorrectly. It said the skill adds a reference block at the top of `ARCHITECTURE.md`, but `SKILL.md` requires the opposite: agent behavior files should reference `ARCHITECTURE.md`, and `ARCHITECTURE.md` should stay free of agent-behavior guidance.
2. `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md` mixed hard requirements with softer explanatory phrasing in a few places. The rewrite tightened sentence structure and clarified conditions without changing trigger scope, workflow order, or guardrail strength.
3. `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/README.md` had several places where casual phrasing made workflow timing and scope slightly harder to audit. The rewrite normalized terminology and improved scanability while preserving behavior.

## Rewrite

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md`
- Tightened the frontmatter description without changing trigger families or boundaries.
- Rewrote the opening summary and key workflow sections to lead with actions, conditions, and outcomes more directly.
- Tightened the hard-stop list and interaction principles so the obligation level stays explicit and easier to audit.
- Clarified that parallel discovery is conditional on subagent availability and repo size in both the preflight guidance and Phase 1 guidance, which preserves the existing behavior and removes an apparent contradiction.
- Tightened the agent-behavior-doc update section so it matches the intended contract more directly.

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/README.md`
- Corrected the agent-behavior-doc integration section so it no longer instructs the reader to add agent-behavior guidance to `ARCHITECTURE.md`.
- Tightened wording around the three phases, usage modes, and examples so workflow order and boundaries are easier to scan.
- Standardized terminology such as “codebase,” “could not infer,” and “agent behavior file” for better local consistency with `SKILL.md`.

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/SKILL.md`
  - Changed: yes
  - Why: Tightened behavior-defining prose in strict mode to improve scanability and local clarity while preserving trigger coverage, workflow semantics, guardrail strength, and exact technical references.
  - Notes: Frontmatter description tightened, workflow sections clarified, conditional parallel-discovery language aligned, and agent-behavior-doc update guidance made more direct.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/README.md`
  - Changed: yes
  - Why: The README contained behavior-relevant workflow guidance and one materially incorrect statement about where to add the `ARCHITECTURE.md` reference block.
  - Notes: Corrected the reference-block target, tightened phase descriptions, and normalized local terminology.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/references/template.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: The template is primarily an exact output skeleton. Its prose is already compact, behavior-bearing, and aligned with the rewritten root instructions.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/CHANGELOG.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain.
  - Notes: The changelog is historical release documentation, not active behavior-defining guidance for execution. It was inspected for context and version alignment only.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- No sibling `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-architecture-doc/AGENTS.md` was present.
- No additional behavior-bearing files beyond the root `SKILL.md`, `README.md`, and linked `references/template.md` were discovered in this skill folder.
- None noted
