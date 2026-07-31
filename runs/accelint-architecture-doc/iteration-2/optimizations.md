# Stage 3 Optimizations — accelint-architecture-doc

## 1. Expanded structured expectations for create-mode eval coverage
- **recommendation addressed**: Add structured expectations to more eval scenarios.
- **evidence type supporting it**: Static audit evidence
- **files changed**: `skills/accelint-architecture-doc/evals/evals.json`
- **summary of implementation**: Added an `expectations` array to eval `id: 1` covering create-mode selection, codebase-first discovery, targeted questioning, and preview-before-write.
- **reason this change matches the evidence**: Stage 1 found create-mode behavior was important but only described narratively. Adding explicit expectations increases future grading rigor without changing skill behavior.

## 2. Expanded structured expectations for refresh-mode eval coverage
- **recommendation addressed**: Add structured expectations to more eval scenarios.
- **evidence type supporting it**: Static audit evidence
- **files changed**: `skills/accelint-architecture-doc/evals/evals.json`
- **summary of implementation**: Added an `expectations` array to eval `id: 2` covering read-existing-doc-first behavior, correct refresh-mode selection, drift announcement sequencing, and preview-before-write.
- **reason this change matches the evidence**: Refresh sequencing is one of the highest-risk transcript-sensitive behaviors identified in the Stage 1 audit, and it lacked structured expectations.

## 3. Expanded structured expectations for OpenSpec-aware behavior
- **recommendation addressed**: Add structured expectations to more eval scenarios.
- **evidence type supporting it**: Static audit evidence
- **files changed**: `skills/accelint-architecture-doc/evals/evals.json`
- **summary of implementation**: Added an `expectations` array to eval `id: 7` covering OpenSpec config detection, reuse of config-derived stack facts, and conditional reference behavior.
- **reason this change matches the evidence**: The skill documents a specific OpenSpec-aware branch, but the eval had only narrative coverage. Structured expectations make that branch more directly testable.

## 4. Expanded structured expectations for external-findings refresh behavior
- **recommendation addressed**: Add structured expectations to more eval scenarios.
- **evidence type supporting it**: Static audit evidence
- **files changed**: `skills/accelint-architecture-doc/evals/evals.json`
- **summary of implementation**: Added an `expectations` array to eval `id: 10` covering parsing findings as facts, merging them with drift detection, announcing both sources, and limiting questions to unresolved gaps.
- **reason this change matches the evidence**: Stage 1 identified findings-merge behavior as important and repo-visible in the skill, but it was not yet structured for reliable grading.

## Not applied
- **Recommendation not applied**: Further direct changes to `SKILL.md` for prose density.
- **Why**: Stage 4 explicitly requires a dedicated `accelint-skill-prose` audit/rewrite pass, and the prompt instructs that frontmatter must not change there. To avoid overlapping or duplicative edits, Stage 3 was limited to the directly evidenced eval-rigor improvement.

## Scope control
All applied changes were narrow, evidence-led, and non-structural. No workflow branches, templates, or package structure were changed in this stage.
