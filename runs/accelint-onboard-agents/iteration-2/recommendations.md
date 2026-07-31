# accelint-onboard-agents recommendations

## 1. Fix singular/plural package-name drift in generated reports
- **issue observed:** Prior iteration artifacts refer to `accelint-onboard-agent` while the actual skill is `accelint-onboard-agents`.
- **evidence type:** Repository observation
- **evidence:** `runs/accelint-onboard-agents/iteration-1/audit-report.md`, `description-report.md`, and `skill-prose-report.md` use the singular name; the actual package files are under `skills/accelint-onboard-agents/` and frontmatter `name` is `accelint-onboard-agents`.
- **recommended improvement:** Normalize iteration-2 reports and any new workflow output to the exact package name `accelint-onboard-agents`.
- **expected benefit:** Reduces maintainer confusion and makes future grep/diff workflows reliable.
- **confidence level:** High

## 2. Update README to describe the full generated artifact shape more accurately
- **issue observed:** README’s “AGENTS.md structure” section omits required parts that the skill template explicitly includes.
- **evidence type:** Static audit evidence
- **evidence:** `skills/accelint-onboard-agents/README.md` lists only core sections, while `skills/accelint-onboard-agents/SKILL.md` requires a note header, `Completion Summary`, and `Related Documentation` sections in the output template.
- **recommended improvement:** Revise the README structure section and nearby explanatory text so it matches the actual template and generated-file contract.
- **expected benefit:** Aligns package docs with the published skill behavior and reduces incorrect expectations for maintainers or users.
- **confidence level:** High

## 3. Add explicit headless/non-interactive preview handling guidance without weakening preview-before-write
- **issue observed:** The skill requires preview and confirmation before writing, but does not say how to proceed when the invoking workflow is headless or non-interactive.
- **evidence type:** Static audit evidence + reproducible environment constraint
- **evidence:** `SKILL.md` repeatedly requires preview-before-write; the current run instructions explicitly state “This environment is non-interactive for approvals, reviews, and confirmations during the workflow itself.”
- **recommended improvement:** Add narrow guidance saying that in non-interactive or batch contexts, the invoking agent should still produce the labeled preview, record that confirmation could not be collected due to environment constraints, and stop short of claiming that a human confirmed the preview.
- **expected benefit:** Makes behavior more consistent in automated environments while preserving the human-review contract.
- **confidence level:** Medium-High

## 4. Clarify the final write target for package-level onboarding flows
- **issue observed:** One instruction still says to write to the project root, which can conflict with earlier package-level inheritance support.
- **evidence type:** Static audit evidence
- **evidence:** `SKILL.md` Phase 0 supports package-specific files that inherit from a root file, but Phase 4 step 3 says to write to `AGENTS.md` at the project root (or `CLAUDE.md`).
- **recommended improvement:** Reword Phase 4 step 3 so it says to write to the target directory being onboarded, using root/project-level wording only when that is the actual target.
- **expected benefit:** Removes ambiguity for monorepo package onboarding without changing the broader workflow.
- **confidence level:** High

## 5. Do not broaden the skill or rewrite major workflow sections without stronger evidence
- **issue observed:** Current evidence shows localized clarity issues, not workflow failure.
- **evidence type:** Static audit evidence
- **evidence:** The skill already has strong phase structure, mode separation, scope boundaries, and version/changelog alignment. No fresh eval transcript shows systemic failure.
- **recommended improvement:** Keep the optimization pass minimal and scoped to documentation and instruction clarity.
- **expected benefit:** Prevents low-evidence overfitting or accidental behavior drift.
- **confidence level:** High

## Blockers affecting confidence
- No fresh executed eval outputs or transcripts were available for iteration 2.
- Recommendations therefore rely mostly on direct repository inspection and explicit environment constraints rather than live behavioral failures.
