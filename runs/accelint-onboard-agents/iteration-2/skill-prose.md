## Summary
- Task: Audit and strictly rewrite behavior-bearing prose in `skills/accelint-onboard-agents` while skipping frontmatter.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/CHANGELOG.md`

## Highest-risk issues first
1. `SKILL.md` had repeated line wrapping and a few long instruction blocks that buried action order inside visual noise. This did not change behavior yet, but it increased audit risk in workflow-heavy sections such as Phase 0, Phase 3, and Phase 4.
2. `SKILL.md` used a stale adjacent-skill reference in Interaction Principles: `openspec-onboard` instead of `accelint-onboard-openspec`. That token-level mismatch could misroute users or agents even though the surrounding policy was correct.
3. `README.md` and `CHANGELOG.md` were already aligned with the current skill contract. Further rewriting would add drift risk without meaningful clarity gain.

## Rewrite
### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/SKILL.md`
- Tightened sentence structure across behavior-bearing sections without changing workflow order, approval semantics, exact paths, commands, or identifiers.
- Kept frontmatter untouched as required.
- Preserved all mode logic, phase order, preview-before-write requirements, TODO handling, and monorepo inheritance behavior.
- Corrected the adjacent-skill reference from `openspec-onboard` to `accelint-onboard-openspec` in the body text so the reference now matches the actual skill name.
- Normalized several instructions to more direct phrasing where the original wrapping made scanning harder, especially in:
  - Phase 0 mode detection and monorepo handling
  - Mode 3 refresh flow
  - Phase 3 parallel discovery requirements
  - Phase 4 preview/write rules
  - Interaction Principles

## Summary
- Task: Audit and strictly rewrite behavior-bearing prose in `skills/accelint-onboard-agents` while skipping frontmatter.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability and reduced audit risk in workflow and guardrail prose while keeping trigger scope, workflow semantics, approval logic, and exact technical meaning intact.
  - Notes: Tightened local sentence structure, reduced unnecessary line breaks in behavior-bearing instructions, and corrected the body-text skill reference to `accelint-onboard-openspec`. Frontmatter was intentionally not edited.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/README.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: Already aligned with the current skill behavior, including mode structure, preview-before-write behavior, related-document checks, and separation-of-concerns framing.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-onboard-agents/CHANGELOG.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: Change history is concise, behavior-specific, and aligned with the current package version and artifact-set state.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- No sibling `AGENTS.md` exists in this skill package.
- No `references/*.md` files exist in this skill package.
- Frontmatter was inspected for context but intentionally excluded from audit and rewrite per the task requirements.
