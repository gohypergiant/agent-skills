High-risk findings first

1. /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/SKILL.md had a workflow gap in the package body: the minimum workflow explicitly required `references/input-validation.md` for boundary data, but it did not surface the same must-read path for loops, queues, recursion, or long-running async operations even though `references/bounded-iteration.md` is a critical safety reference in the artifact set. This created a workflow-clarity risk, not a trigger-risk issue.
2. /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/AGENTS.md used mixed normative shapes in the `Critical Anti-Patterns` section. The bullets were behaviorally sound, but the sentence form mixed labels and explanations in a way that made the hard defaults less scannable than necessary.
3. /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/quick-start.md still used output markers (`❌` and `✅`) inside workflow-explanation prose. That wording was not unsafe, but it made the action path less direct because the operational rule is to apply the pattern, not to preserve icon language.

Rewrite

Updated /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices package-body prose with minimal, behavior-preserving edits:
- Added an explicit bounded-iteration read step to the minimum workflow in `SKILL.md` and mirrored that requirement in `AGENTS.md` for new code that uses loops, queues, recursion, or long-running async operations.
- Tightened explanatory prose in `SKILL.md`, `AGENTS.md`, and `references/quick-start.md` so the workflow leads with the required action and keeps one concept per sentence more consistently.
- Preserved frontmatter exactly as requested. No frontmatter was audited or changed.

## Summary
- Task: Audit plus rewrite the package-body prose for /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices in strict mode, skipping frontmatter entirely, and write a grounded report.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/SKILL.md (body only), /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/AGENTS.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/quick-start.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/any.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/assertions.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/bounded-iteration.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/code-duplication.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/control-flow.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-handling.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-messages.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/functions.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/input-validation.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/misc.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/naming-conventions.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/state-management.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/type-vs-interface.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/assets/output-report-template.md, /Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/CHANGELOG.md

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/SKILL.md`
  - Changed: yes
  - Why: Behavior-preserving workflow tightening. The body already routed code-health tasks correctly, but the minimum workflow did not make the bounded-iteration reference explicit for iteration-heavy code paths even though that safety rule is part of the skill contract.
  - Notes: Kept frontmatter untouched. Added one explicit read step for `references/bounded-iteration.md` and tightened nearby workflow sentences for clearer action order.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/AGENTS.md`
  - Changed: yes
  - Why: Cross-file alignment was REQUIRED after the `SKILL.md` workflow change, and local sentence-structure tightening improved scanability without changing obligation strength.
  - Notes: Added the bounded-iteration prerequisite for new code that uses loops, queues, recursion, or long-running async operations. Tightened the `Critical Anti-Patterns` introduction and bullet phrasing while preserving the same hard defaults.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/quick-start.md`
  - Changed: yes
  - Why: Local-tightening sweep found low-risk workflow wording improvements. The file was aligned behaviorally, but the action path became easier to scan with more direct verbs and a clearer redirect for performance work.
  - Notes: Replaced softer explanatory phrasing with more direct workflow wording and removed icon language from the workflow summary bullets while preserving the same sequence.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/any.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already states the prohibition, boundary alternatives, and propagation risk directly.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/assertions.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already uses direct requirement language and concrete examples with clear scope.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/bounded-iteration.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is long, but its sectioned structure, hard-stop wording, and example set already carry the contract clearly.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/code-duplication.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The extraction rules, examples, and non-goals were already locally clear.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/control-flow.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already preserves direct workflow language, exact examples, and rationale for braces and guard clauses.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-handling.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is intentionally compact and already states the rule directly.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-messages.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The user/developer split is explicit and the examples already anchor behavior.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/functions.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is dense, but the rule bullets, examples, and rationale remain clear enough that further tightening would risk changing guidance scope.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/input-validation.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The rule, boundary framing, and schema example are already direct and behaviorally precise.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/misc.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is intentionally terse. Expanding or rephrasing it would likely add interpretation rather than clarity.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/naming-conventions.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The examples and rationale already make the naming rule easy to follow.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/state-management.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is detailed but already separates rules, examples, and rationale clearly.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/type-vs-interface.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The bounded rule and exception list are already direct.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/assets/output-report-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: Inspected for workflow contract context only. No behavior-preserving prose edit was necessary in this run.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/CHANGELOG.md`
  - Changed: no
  - Why: Out of scope for this stage
  - Notes: Inspected for package context only. Frontmatter and versioning updates were explicitly excluded from this run.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from audit and rewrite, per request.
- No breaking change noted. The edits tighten package-body guidance only.
