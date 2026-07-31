Risk summary: The main risks were wording that mixed hard requirements with emphasis labels, uneven sentence structure in the loading rules, and a few places where exact setup requirements were clear but harder to scan than necessary. The rewrite stays prose-only, keeps trigger coverage and technical references intact, and tightens local clarity without changing workflow or policy.

## Summary
- Task: Audit and rewrite `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/SKILL.md` in strict mode and produce a prose audit report.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/setup.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/token-reference.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/variant-system.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/spacing-scale.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/migration-guide.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/troubleshooting.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/SKILL.md`
  - Changed: yes
  - Why: Tightened behavior-defining prose for scanability and consistency while preserving trigger coverage, workflow order, guardrail force, and exact technical references.
  - Notes: Clarified the "NEVER" rules, normalized some obligation wording, improved the reference-loading section, and tightened setup and notes language without changing commands, paths, tokens, or examples.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/AGENTS.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: The quick-reference structure, trigger-adjacent guidance, and progressive-disclosure handoffs were already clear and aligned with the rewritten root skill.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/setup.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain.
  - Notes: The file is already structured around required setup steps, failure modes, and exact configuration examples.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/token-reference.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: Token hierarchy and fallback guidance were already concise and behaviorally stable.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/variant-system.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain.
  - Notes: The file mixes exact variant examples with explanatory prose, and further tightening would risk changing implementation guidance.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/spacing-scale.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: The spacing contract, semantic-versus-numeric distinction, and anti-pattern examples were already explicit and easy to audit.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/migration-guide.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain.
  - Notes: The before/after mappings rely on exact examples, and the prose is already direct enough for safe execution.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-design-foundation/references/troubleshooting.md`
  - Changed: no
  - Why: Already near minimum safe form.
  - Notes: The issue/cause/fix structure is already clear and aligned with the root skill's setup-first guidance.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
