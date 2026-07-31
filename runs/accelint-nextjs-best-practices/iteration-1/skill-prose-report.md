# Skill Prose Report: accelint-nextjs-best-practices

## Summary
Completed a strict-mode audit of the local artifact set for `skills/accelint-nextjs-best-practices` and applied safe prose tightening where it improved clarity without changing behavior. The edits focused on activation wording, workflow wording, terminology consistency, severity phrasing, and scanability across the root files and selected reference files.

## Highest-risk issues first
1. Cross-file naming drift in related-skill references could misroute users from `README.md`.
2. Mixed obligation and emphasis styles across `SKILL.md`, `AGENTS.md`, and references made the operating contract harder to scan.
3. A few overview and checklist passages used loose or inflated wording that obscured otherwise stable behavior.

## Finding list

### 1. Related-skill naming drift
- **Category:** exact-reference consistency
- **Source:** `README.md`
- **Risk:** Medium
- **Why it matters:** The README referenced adjacent skills with shortened names instead of the canonical `accelint-*` identifiers used elsewhere. That can weaken routing accuracy and cross-file consistency.
- **Action:** Updated related-skill references to canonical skill names.

### 2. Mixed emphasis and local structure in top-level guidance
- **Category:** workflow and guardrail clarity
- **Source:** `SKILL.md`, `AGENTS.md`, `README.md`
- **Risk:** Medium
- **Why it matters:** Several passages were accurate but less direct than necessary. This raised audit cost and made the loading order and intended usage path less crisp.
- **Action:** Tightened intros, activation wording, usage steps, and principle summaries while preserving scope and workflow order.

### 3. Reference-file sentence looseness
- **Category:** local scanability
- **Source:** `references/quick-checklist.md`, `references/server-actions-security.md`, `references/server-vs-client-component.md`, `scripts/README.md`
- **Risk:** Low
- **Why it matters:** The files were behaviorally sound, but some list items and explanatory lines were less direct than the surrounding contract. That increased reading friction.
- **Action:** Tightened list wording, normalized a few terms, and improved sentence control without changing examples, commands, or technical meaning.

## Rewrite summary
Applied direct edits to these files:
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/SKILL.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/AGENTS.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/README.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/scripts/README.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/references/quick-checklist.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/references/server-actions-security.md`
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices/references/server-vs-client-component.md`

Inspected but left unchanged after the local-tightening sweep:
- `CHANGELOG.md` — Already near minimum safe form
- `assets/output-report-template.md` — Rewrite would add drift risk without meaningful clarity gain
- `references/avoid-barrel-imports.md` — Already near minimum safe form
- `references/avoid-duplicate-serialization.md` — Already near minimum safe form
- `references/compound-patterns.md` — Rewrite would add drift risk without meaningful clarity gain
- `references/minimize-serialization.md` — Already near minimum safe form
- `references/parallel-data-fetching.md` — Already near minimum safe form
- `references/parallelize-independent-operations.md` — Already near minimum safe form
- `references/prevent-waterfall-chains.md` — Already near minimum safe form
- `references/react-cache-deduplication.md` — Already near minimum safe form
- `references/strategic-suspense-boundaries.md` — Already near minimum safe form
- `references/use-after-non-blocking.md` — Already near minimum safe form

---

## Completed report

### Artifact scope
- Skill folder audited: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-nextjs-best-practices`
- Output mode: Audit plus rewrite
- Rewrite mode: `mode=strict`

### Preservation targets
- Trigger coverage for Next.js-specific work
- Workflow order across `SKILL.md`, `AGENTS.md`, and `references/`
- Guardrail strength for Server Actions, serialization, Suspense, and component-boundary guidance
- Exact paths, filenames, commands, code blocks, and linked references

### Files changed
1. `SKILL.md`
2. `AGENTS.md`
3. `README.md`
4. `scripts/README.md`
5. `references/quick-checklist.md`
6. `references/server-actions-security.md`
7. `references/server-vs-client-component.md`

### Main prose adjustments
- Tightened top-level summaries to foreground Next.js-specific scope.
- Clarified activation and usage wording without broadening trigger coverage.
- Normalized local terminology around patterns, guidance, and related skills.
- Improved checklist and principle phrasing to make requirements easier to scan.
- Preserved all exact technical references, examples, commands, and file paths.

### Self-check status
- Trigger scope preserved: Yes
- Workflow order preserved: Yes
- Guardrail strength preserved: Yes
- Exact tokens preserved where required: Yes
- Cross-file alignment checked: Yes
- Local-tightening sweep completed: Yes

### Outcome
The artifact set is clearer and more internally consistent, with behavior intact.