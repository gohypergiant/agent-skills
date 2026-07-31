# accelint-design-foundation skill prose audit

Risk summary: The main prose risks were scanability drift, inconsistent emphasis language, and small cross-file wording mismatches that could weaken the package's preferred authoring patterns. The rewrite stayed frontmatter-safe, preserved workflow order and technical meaning, and focused on clarifying behavior-defining prose.

## Summary
- Task: Audit and rewrite `skills/accelint-design-foundation` in strict mode.
- Frontmatter: intentionally not audited or edited.
- Rewrite scope: prose-only tightening across behavior-bearing files.

## What changed
- `skills/accelint-design-foundation/SKILL.md`
  - Changed: yes
  - Why: Reduced duplicated reference material, made the source hierarchy explicit, tightened setup-first routing, and made the preferred variant authoring pattern easier to scan.
  - Notes: Kept workflow order, examples, and technical references intact while moving long-form detail back to the existing reference files.

- `skills/accelint-design-foundation/AGENTS.md`
  - Changed: yes
  - Why: Fixed a spacing-scale wording mismatch and softened one over-forceful phrasing so the quick-reference layer matches the package's current guidance.
  - Notes: This remained a quick lookup document; no structural change.

- `skills/accelint-design-foundation/references/setup.md`
  - Changed: yes
  - Why: Minor prose tightening for readability and consistency.
  - Notes: Technical setup requirements and code samples were preserved.

- `skills/accelint-design-foundation/references/troubleshooting.md`
  - Changed: yes
  - Why: Minor prose tightening for readability and consistency.
  - Notes: Issue/cause/fix structure and exact corrective guidance were preserved.

- `skills/accelint-design-foundation/references/variant-system.md`
  - Changed: yes
  - Why: Strengthened the package's preferred pattern by emphasizing `data-*` attributes in markup plus `@variant` blocks in CSS modules.
  - Notes: Updated the introductory explanation and supporting guidance so the reference no longer implies raw attribute-selector styling is the default authoring pattern.

- `skills/accelint-design-foundation/references/migration-guide.md`
  - Changed: no
  - Why: Already clear enough for safe use; further edits risked unnecessary drift in exact mappings.

- `skills/accelint-design-foundation/references/spacing-scale.md`
  - Changed: no
  - Why: Already clear and aligned with the skill's semantic-spacing guidance.

- `skills/accelint-design-foundation/references/token-reference.md`
  - Changed: no
  - Why: Already concise and behaviorally stable.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved
- Frontmatter untouched: yes

## Risks or limits
- The Stage 4 subagent stopped mid-pass before producing its own final report, so this report was completed from direct file inspection and the observed edits already applied in the repository.
- No executed benchmark or human review loop was run in this workflow stage, so the rewrite stayed narrow and prose-focused by design.
