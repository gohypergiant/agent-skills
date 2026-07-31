# Optimizations Applied: `skills/accelint-qrspi-apply`

## 1. Align AGENTS helper-skill naming with repository reality
- **recommendation addressed**: Fix related-skill naming drift for AGENTS.md updates.
- **evidence type supporting it**: Static audit evidence + repository observation.
- **files changed**:
  - `skills/accelint-qrspi-apply/SKILL.md`
  - `skills/accelint-qrspi-apply/README.md`
- **summary of implementation**:
  - Replaced AGENTS helper references from `accelint-onboard-agent` to `accelint-onboard-agents` in executable skill instructions and README package documentation.
- **reason this change matches the evidence**:
  - Stage 1 identified a likely integration mismatch, and the repository’s available skill inventory exposes `accelint-onboard-agents`. This change removes a concrete name-alignment risk without altering broader workflow behavior.

## 2. Add explicit headless fallback for ambiguous change selection
- **recommendation addressed**: Reduce prompt ambiguity around required user-interaction checkpoints in non-interactive environments.
- **evidence type supporting it**: Static audit evidence.
- **files changed**:
  - `skills/accelint-qrspi-apply/SKILL.md`
  - `skills/accelint-qrspi-apply/README.md`
- **summary of implementation**:
  - Added a rule in preflight/change selection stating that when interaction is unavailable and the change choice is ambiguous, the skill must not guess; it should exit with candidate changes and request an explicit change name.
- **reason this change matches the evidence**:
  - The skill previously depended on `AskUserQuestion` for this branch. In a headless environment, silently guessing would be unsafe. Stopping safely is the smallest non-destructive fallback supported by the observed workflow design.

## 3. Add explicit headless fallback for overlap-risk and slice-boundary ambiguity
- **recommendation addressed**: Reduce prompt ambiguity around required user-interaction checkpoints in non-interactive environments.
- **evidence type supporting it**: Static audit evidence.
- **files changed**:
  - `skills/accelint-qrspi-apply/SKILL.md`
  - `skills/accelint-qrspi-apply/README.md`
- **summary of implementation**:
  - Added wording in the execution sections and human-in-the-loop guidance that when interaction is unavailable, the skill should default to serial execution for the affected level instead of parallelizing an ambiguous or risky split.
  - Preserved the stronger stop condition for cases where even serial execution would risk incorrect implementation.
- **reason this change matches the evidence**:
  - The audit found strong safety intent but missing non-interactive operational defaults. This edit preserves the skill’s bias toward caution while reducing avoidable workflow stalls.

## 4. Tighten config-context failure handling
- **recommendation addressed**: Tighten the config-context extraction instructions so failure handling is more operational.
- **evidence type supporting it**: Static audit evidence.
- **files changed**:
  - `skills/accelint-qrspi-apply/SKILL.md`
  - `skills/accelint-qrspi-apply/README.md`
- **summary of implementation**:
  - Added explicit wording that if `context: |` block boundaries are uncertain, the skill must skip injection entirely and report that choice rather than attempting partial extraction or recovery.
- **reason this change matches the evidence**:
  - The existing skill already treated malformed context as dangerous, and the changelog shows this area has required hardening before. This small wording refinement strengthens an already evidence-backed safety rule.

## Not applied
- **Large SKILL.md modularization or structural split**
  - **why not applied**: The only evidence for this was static maintainability concern (`SKILL.md` length). No executed eval outputs or reproducible behavior failures in this run demonstrated that a broad refactor would improve outcomes. Per Stage 2, low-confidence structural rewrites were intentionally avoided.
