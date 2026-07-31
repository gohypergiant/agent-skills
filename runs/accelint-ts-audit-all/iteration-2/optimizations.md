# Stage 3 Optimizations — accelint-ts-audit-all

## 1. Normalize the workflow to one canonical step model
- **Recommendation addressed:** Normalize the workflow to one canonical step model.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - `skills/accelint-ts-audit-all/SKILL.md`
  - `skills/accelint-ts-audit-all/assets/audit-process-template.md`
  - `skills/accelint-ts-audit-all/README.md`
- **Summary of implementation:** Replaced mixed “9-step” and “8-step” wording with a consistent model: **8 execution steps per file plus archive/completion bookkeeping**. Updated workflow overview, completion criteria, progress wording, and README summary language to match.
- **Reason this change matches the evidence:** The audit found directly conflicting step counts across `SKILL.md`, the audit-process template, and README. Unifying the model reduces execution ambiguity without changing intended behavior.

## 2. Harden the merge-back shell example
- **Recommendation addressed:** Harden the merge-back shell example.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - `skills/accelint-ts-audit-all/SKILL.md`
- **Summary of implementation:** Replaced the brittle markdown-parsing example using `grep "^**Original Branch:**"` with an `awk -F'\`` expression that safely extracts the backtick-delimited branch name from the markdown line.
- **Reason this change matches the evidence:** The earlier snippet was visibly regex-fragile from direct inspection. The updated example is more reliable for headless copy-paste use.

## 3. Reconcile template verification guidance with the main workflow
- **Recommendation addressed:** Reconcile template verification guidance with the main workflow.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - `skills/accelint-ts-audit-all/assets/audit-process-template.md`
- **Summary of implementation:** Changed the verification-command section so bench verification is clearly optional and only used when the target package already has a documented bench command.
- **Reason this change matches the evidence:** The template previously gave bench commands near parity with required test/build/lint commands, which created avoidable ambiguity relative to the main skill workflow.

## 4. Add eval coverage for ambiguous approval input and mid-approval interruption
- **Recommendation addressed:** Add eval coverage for ambiguous approval input and mid-approval interruption.
- **Evidence type supporting it:** Static audit evidence
- **Files changed:**
  - `skills/accelint-ts-audit-all/evals/evals.json`
- **Summary of implementation:** Added two evals: one for ambiguous mixed approval language that should trigger clarification, and one for resuming while Step 4 approval is still pending.
- **Reason this change matches the evidence:** Existing evals strongly covered approval structure but did not directly exercise ambiguous acceptance parsing or resumption at an in-progress approval checkpoint.

## Not applied
- **README behavior-surface reduction beyond wording cleanup** was not applied as a structural change.
- **Why not:** Broader README restructuring would be a larger documentation policy change. A smaller alignment pass was sufficient for this evidence-backed iteration.
