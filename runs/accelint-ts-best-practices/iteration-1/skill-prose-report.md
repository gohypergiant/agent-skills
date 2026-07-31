High-risk findings first:
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/input-validation.md` had a behavior-bearing example that undermined the rule. The "correct" example accepted `Address` instead of `unknown`, which weakened the boundary-validation contract the file is supposed to enforce.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-handling.md` was too thin to carry the workflow intent summarized elsewhere in the skill. It said only "Handle all errors explicitly," which left too much room to misread what counts as explicit handling.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/type-vs-interface.md` contained a broken inline-code token around `interface`. That is a small surface defect, but it sits in a behavior-bearing rule and made the guidance harder to audit.

## Rewritten files
Updated the artifact-set files directly in the skill package where local tightening improved clarity without changing trigger coverage, workflow semantics, guardrail strength, or exact technical references.

## Summary
- Task: Audit and rewrite the full artifact set for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices`, then write the audit-plus-rewrite report.
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/AGENTS.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/assets/output-report-template.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/any.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/assertions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/bounded-iteration.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/bundler-paths.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/code-duplication.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/control-flow.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/enums.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-handling.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-messages.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/functions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/input-validation.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/misc.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/naming-conventions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/quick-start.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/return-values.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/state-management.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/type-vs-interface.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/README.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/SKILL.md`
  - Changed: yes
  - Why: Tightened workflow wording and presentation while preserving trigger scope, routing boundaries, and exact references.
  - Notes: Simplified overview text, normalized heading phrasing, and clarified that pattern references live in `references/`.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/AGENTS.md`
  - Changed: yes
  - Why: Tightened behavior-bearing loading guidance and normalized obligation wording without changing requirement strength.
  - Notes: Replaced weaker banner-style emphasis with clearer REQUIRED wording, improved step phrasing, and kept progressive-loading behavior intact.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/assets/output-report-template.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is behavior-bearing, but its structure and instruction wording were already clear enough that further tightening would not add meaningful clarity.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/any.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The rule, examples, and rationale were already locally clear and behaviorally aligned.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/assertions.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is short, direct, and already preserves the intended assertion behavior.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/bounded-iteration.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The guardrail strength, example structure, and rationale were already explicit.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/bundler-paths.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file already explains the rule and the build-time implications with sufficient precision.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/code-duplication.md`
  - Changed: yes
  - Why: Tightened local clarity and removed a stale cross-reference that pointed to `currying.md`, which is not part of the inspected artifact set.
  - Notes: Kept the DRY guidance intact and simplified the related-patterns block.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/control-flow.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: Workflow order and rationale were already clear and stable.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/enums.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The anti-pattern, replacement pattern, and rationale were already explicit.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-handling.md`
  - Changed: yes
  - Why: The original wording was too compressed for a behavior-bearing rule and needed enough detail to preserve explicit-handling intent.
  - Notes: Added explicit prohibition against swallowed errors and named acceptable explicit error paths.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/error-messages.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The split between user-facing and developer-facing messages was already clear.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/functions.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The rule list and rationale were already sufficiently direct for this artifact.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/input-validation.md`
  - Changed: yes
  - Why: Corrected a behavior-bearing example so the rule now preserves boundary-validation semantics instead of implying typed input has already been validated.
  - Notes: Changed the example to accept `unknown`, return the validated `Address`, and added rationale that explains why the boundary matters.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/misc.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is intentionally brief and acts as a compact checklist.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/naming-conventions.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The naming rules and examples were already easy to audit.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/quick-start.md`
  - Changed: yes
  - Why: Tightened workflow wording so the execution sequence is easier to scan without changing the sequence.
  - Notes: Clarified the overview sentence and normalized the workflow summary steps.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/return-values.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The rule and examples were already explicit and locally clear.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/state-management.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already states the mutation and purity rules directly.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/references/type-vs-interface.md`
  - Changed: yes
  - Why: Fixed a broken exact token and tightened the example labels while preserving the rule.
  - Notes: Restored the missing backtick around `interface` and clarified the before/after labels.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-ts-best-practices/README.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: Inspected as a linked instruction artifact. It is mostly explanatory rather than contract-defining, and its current wording was already clear enough.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- None noted
