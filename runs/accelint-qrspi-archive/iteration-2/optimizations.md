# Stage 3 Optimizations — accelint-qrspi-archive

## 1. Tightened repeated rationale inside `SKILL.md`
- **recommendation addressed:** Reduce repeated rationale inside `SKILL.md`
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-qrspi-archive/SKILL.md`
- **summary of implementation:** Shortened repeated explanatory passages about inline archive execution, corpus-wide index drift, and out-of-scope reconciliation work while preserving the underlying workflow and guardrails.
- **reason this change matches the evidence:** The audit showed a 561-line skill body and repeated rationale blocks. Tightening duplicate explanation directly reduces scan cost without changing behavior.

## 2. Reduced future drift risk in companion docs
- **recommendation addressed:** Lower README drift risk by making it more explicitly derivative
- **evidence type supporting it:** Repository observation
- **files changed:** `skills/accelint-qrspi-archive/README.md`
- **summary of implementation:** Added explicit wording near the top of the README that it is a concise companion summary and that `SKILL.md` is the canonical operational contract.
- **reason this change matches the evidence:** Iteration-1 repo artifacts showed README/SKILL drift had already happened once. Making artifact ownership explicit is a small, evidence-backed way to reduce recurrence.

## 3. Deliberately did not perform broader trigger rewrites
- **recommendation addressed:** Avoid broad trigger changes without fresh eval evidence
- **evidence type supporting it:** Blocker / missing empirical run evidence
- **files changed:** none
- **summary of implementation:** Kept Stage 3 focused on maintainability edits only. Did not broaden the description, change workflow semantics, or restructure the skill package.
- **reason this change matches the evidence:** This run had no fresh executed eval, transcript, or trigger-rate evidence, so larger semantic changes would have been weakly supported.

## 4. Not applied: deeper step-reference refactor
- **recommendation addressed:** Reduce step-reference fragility
- **evidence type supporting it:** Repository observation
- **files changed:** none beyond light prose tightening
- **summary of implementation:** Did not perform a broad renumbering or structural rewrite in this stage.
- **reason this change matches the evidence:** The risk is real, but a larger step-reference refactor would be more invasive than the available evidence justified for this pass. Minimal high-value edits were the better fit.
