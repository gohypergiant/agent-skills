# accelint-onboard-agents optimizations

## 1. Recommendation addressed
Clarify the final write target for package-level onboarding flows
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-onboard-agents/SKILL.md`
- **summary of implementation:** Reworded Phase 4 so the skill now writes to `AGENTS.md` or `CLAUDE.md` in the target directory being onboarded instead of implying the project root is always the destination.
- **reason this change matches the evidence:** The skill already supports monorepo package-level inheritance earlier in the workflow, so this localized wording fix removes a real ambiguity without changing behavior elsewhere.

## 2. Recommendation addressed
Add explicit headless/non-interactive preview handling guidance without weakening preview-before-write
- **evidence type supporting it:** Static audit evidence + reproducible environment constraint
- **files changed:** `skills/accelint-onboard-agents/SKILL.md`, `skills/accelint-onboard-agents/README.md`
- **summary of implementation:** Added explicit guidance that agents must still produce the full labeled preview in non-interactive or headless contexts and must not falsely claim that a human confirmed the preview when confirmation could not be collected in-session.
- **reason this change matches the evidence:** The repository instructions and this run both rely on non-interactive execution, so the skill needed a narrow rule for that case. The change preserves the preview gate instead of bypassing it.

## 3. Recommendation addressed
Update README to describe the full generated artifact shape more accurately
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-onboard-agents/README.md`
- **summary of implementation:** Expanded the README’s generated-structure example to include the note header, `Completion Summary` within workflow procedures, and `Related Documentation`.
- **reason this change matches the evidence:** The README previously omitted output elements that the template requires in `SKILL.md`, so this was direct documentation alignment work.

## 4. Recommendation not applied directly
Fix singular/plural package-name drift in generated reports
- **evidence type supporting it:** Repository observation
- **files changed:** None in the skill package
- **summary of implementation:** Not applied to package source files because the drift exists in prior run artifacts, not in the current skill package itself. Iteration-2 reports use the correct package name.
- **reason this change matches the evidence:** Editing prior run artifacts would not improve the published skill package. The safer correction was to keep all new artifacts accurate.

## 5. Recommendation followed as a guardrail
Do not broaden the skill or rewrite major workflow sections without stronger evidence
- **evidence type supporting it:** Static audit evidence
- **files changed:** All changes stayed localized to `SKILL.md` and `README.md`
- **summary of implementation:** Kept the pass minimal: no workflow reordering, no frontmatter edits, no description expansion, and no new bundled resources.
- **reason this change matches the evidence:** Available evidence showed clarity issues, not systemic workflow failure, so a narrow patch was the highest-confidence optimization.
