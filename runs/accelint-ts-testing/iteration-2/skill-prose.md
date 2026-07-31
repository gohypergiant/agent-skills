Critical findings first
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/SKILL.md` mixed heading styles and sentence shapes in behavior-bearing sections. That inconsistency did not change rules directly, but it made the workflow harder to scan and increased the chance of misreading task routing and pre-write steps.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/AGENTS.md` used one numbering error in the completion workflow (`2.` repeated for two different steps). That created workflow drift risk because agents could misread the order or cite the wrong step.

## Rewrite

Updated the skill artifact set to make workflow and guardrail prose easier to scan without changing behavior. Frontmatter was intentionally excluded and left unchanged as requested.

## Summary
- Task: Audit plus rewrite the behavior-bearing prose for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing` in strict mode, excluding frontmatter entirely, and write the report to `runs/accelint-ts-testing/iteration-2/skill-prose.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/assets/output-report-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/aaa-pattern.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/assertions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/async-testing.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/error-handling.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/organization.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/parameterized-tests.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/performance.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/property-based-testing.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/quick-start.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/snapshot-testing.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/test-doubles.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/vitest-features.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/SKILL.md`
  - Changed: yes
  - Why: behavior-preserving structure tightening improved scanability and kept workflow entry points, loading rules, and audit requirements easier to follow
  - Notes: renamed a hard-stop heading to a clearer direct label, normalized nearby section headings and bullets, tightened sentence structure, and preserved all linked references and workflow order. Frontmatter was intentionally not edited.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/AGENTS.md`
  - Changed: yes
  - Why: behavior-preserving workflow clarification improved local sentence structure and removed a numbering ambiguity in the completion workflow
  - Notes: normalized heading casing for the guide and completion workflow and corrected the duplicated step number so the sequence remains explicit
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/assets/output-report-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: the warning, severity model, categories, and required report structure were already explicit and behaviorally clear
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/aaa-pattern.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: examples, boundaries, and AAA guidance were already direct and locally clear
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/assertions.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: matcher guidance and anti-pattern distinctions were already explicit and behaviorally stable
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/async-testing.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: async patterns, timer guidance, and anti-pattern examples were already clear and exact
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/error-handling.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: runtime-validation guidance, fault-injection examples, and error-testing rules were already explicit
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/organization.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: public-API boundaries, naming rules, and structure guidance were already in stable minimum-safe form
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/parameterized-tests.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: `it.each` rules, anti-patterns, and examples were already direct and scannable
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/performance.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: performance guidance, mock-cleanup configuration rules, and test-speed rationale were already explicit
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/property-based-testing.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: the file is long, but the property catalog, installation gate, and anti-patterns were already behaviorally clear
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/quick-start.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: the before-and-after example is compact, clear, and aligned with the root skill
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/snapshot-testing.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: snapshot boundaries, update workflow, and anti-patterns were already clear
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/test-doubles.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: the dependency hierarchy and anti-pattern guidance were already explicit and stable
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-testing/references/vitest-features.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: setup-file discovery, configuration guidance, and feature-specific rules were already clear

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from both audit findings and edits per user instruction.
- No other artifact-set files changed after the local-tightening sweep.
