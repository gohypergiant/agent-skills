Critical findings:
- The artifact set was broadly strong, but several files benefited from stricter wording, better scanability, and closer alignment with the root skill contract.
- One reference-level wording change carried mild interpretation risk (`"Frankenstein prompts"` → `"stitched-together prompts"`), but the behavioral meaning remained effectively the same.

## Rewritten artifact-set summary
- Updated `skills/accelint-prompt-manager/SKILL.md` for clearer trigger phrasing, earlier boundary-setting around optimization-vs-execution, and tighter workflow prose.
- Updated `skills/accelint-prompt-manager/AGENTS.md` to improve quick-reference scanability and align wording with the revised root skill.
- Updated local reference files for tighter structure and clearer explanations without changing framework logic or guardrail intent:
  - `references/credit-killing-patterns.md`
  - `references/frameworks.md`
  - `references/complexity-detection.md`
  - `references/plan-mode-triggers.md`
  - `references/safe-techniques.md`
  - `references/ambiguity-examples.md`
  - `references/optimization-examples.md`
  - `references/template-selection.md`

## Summary
- Task: Audit and strictly rewrite the `skills/accelint-prompt-manager` artifact set, apply approved-safe prose improvements in place, and write the report to `runs/accelint-prompt-manager/skill-prose-report.md`
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `skills/accelint-prompt-manager/SKILL.md`, `skills/accelint-prompt-manager/AGENTS.md`, `skills/accelint-prompt-manager/references/*`

## What changed
- `skills/accelint-prompt-manager/SKILL.md`
  - Changed: yes
  - Why: Tightened trigger wording, clarified boundaries, removed one non-actionable repo-misaligned note, and improved workflow scanability without changing behavior.
  - Notes: Also removed a duplicated Phase 3 bullet block.

## Other artifact-set files
- `skills/accelint-prompt-manager/AGENTS.md`
  - Changed: yes
  - Why: Kept quick-reference guidance aligned with the rewritten root skill and improved local sentence structure.
  - Notes: One lingering repo-context mismatch remains in the final `Memory Persistence` note and should be removed in a future cleanup if not already addressed elsewhere.
- `skills/accelint-prompt-manager/references/credit-killing-patterns.md`
  - Changed: yes
  - Why: Tightened phrasing and improved scanability while preserving anti-pattern meaning.
- `skills/accelint-prompt-manager/references/frameworks.md`
  - Changed: yes
  - Why: Improved local clarity and section flow without changing framework selection logic.
  - Notes: Reworded one colloquial phrase from `Frankenstein prompts` to `stitched-together prompts`; behavior impact appears negligible.
- `skills/accelint-prompt-manager/references/complexity-detection.md`
  - Changed: yes
  - Why: Tightened definitions and examples for easier lookup.
- `skills/accelint-prompt-manager/references/plan-mode-triggers.md`
  - Changed: yes
  - Why: Clarified trigger explanations and improved scanability.
- `skills/accelint-prompt-manager/references/safe-techniques.md`
  - Changed: yes
  - Why: Tightened explanatory text while preserving technique guidance.
- `skills/accelint-prompt-manager/references/ambiguity-examples.md`
  - Changed: yes
  - Why: Improved example readability and local wording consistency.
- `skills/accelint-prompt-manager/references/optimization-examples.md`
  - Changed: yes
  - Why: Tightened before/after explanation prose without changing the examples' role.
- `skills/accelint-prompt-manager/references/template-selection.md`
  - Changed: yes
  - Why: Improved selection guidance clarity and scanability.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Minor follow-up recommended: remove or reconcile any remaining `memory blocks` guidance if present in auxiliary files, since it does not fit this repo context.
