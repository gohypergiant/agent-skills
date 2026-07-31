High-risk findings first:
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/SKILL.md` mixed direct instructions with explanation in a few places, which made the progressive-disclosure flow and audit-template decision points harder to scan. The rewrite separates actions from explanation without changing workflow order.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/AGENTS.md` used some compressed or informal wording around the React Compiler gate and guide usage. The rewrite keeps the same decision logic and references, but makes the gate and actions more explicit.
- Frontmatter was intentionally excluded from this stage and was not audited or rewritten, per the user requirement.

## Rewrite

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/SKILL.md`
Behavior-preserving rewrite applied in place. Frontmatter was not reviewed or changed.

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/AGENTS.md`
Behavior-preserving rewrite applied in place.

## Summary
- Task: Audit plus rewrite the behavior-defining prose for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices` in strict mode, excluding frontmatter from audit and edits, and write the report to `runs/accelint-react-best-practices/iteration-2/skill-prose.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/SKILL.md` (body only; frontmatter excluded by requirement), `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/assets/output-report-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/quick-checklists.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/react-compiler-guide.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/compound-patterns.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/named-imports.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/no-forwardref.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/effect-event-deps.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/activity-component-show-hide.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/prevent-hydration-mismatch.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability and made workflow guidance, progressive-disclosure steps, and audit-template boundaries easier to follow without changing trigger coverage or exact references
  - Notes: clarified operational lead sentences, normalized some headings and list phrasing, kept all paths and reference targets exact, and left frontmatter untouched by explicit requirement

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/AGENTS.md`
  - Changed: yes
  - Why: behavior-preserving local tightening improved the React Compiler gate wording and guide-usage instructions while preserving the same rule index, section order, and references
  - Notes: normalized instruction phrasing, reduced ambiguity in the compiler decision gate, and preserved all linked references
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/assets/output-report-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: template language was already explicit, behavior-bearing, and easy to scan
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/quick-checklists.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: checklist structure already matched its operational purpose and kept references explicit
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/react-compiler-guide.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: decision gates, compiler boundaries, and examples were already explicit and behaviorally stable
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/compound-patterns.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: long-form examples are dense by design and already preserve pattern tradeoffs clearly
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/named-imports.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: short rule-plus-example format was already near minimum safe form despite a minor grammar flaw, which was not worth risking example drift in this pass
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/no-forwardref.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: concise migration rule with exact examples and compiler boundary intact
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/effect-event-deps.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: obligation strength and dependency-array rule were already explicit and precise
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/activity-component-show-hide.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: direct instruction, exact component usage, and compiler note already aligned
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/references/prevent-hydration-mismatch.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: examples and rationale are central to the rule and were already clearly separated

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-react-best-practices/SKILL.md` was intentionally excluded from audit and rewrite by user requirement.
- The local-tightening sweep covered the inspected artifact set only. The skill folder contains many additional reference files that were not loaded because the linked and representative files already established the contract needed for this pass.