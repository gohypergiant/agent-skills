# Recommendations: `skills/accelint-qrspi-apply`

## 1. Fix related-skill naming drift for AGENTS.md updates
- **issue observed**: The skill instructs AGENTS.md updates via `accelint-onboard-agent`, but the available skill in this repository context is `accelint-onboard-agents`.
- **evidence type**: Static audit evidence + repository observation
- **evidence**:
  - `skills/accelint-qrspi-apply/SKILL.md` uses `accelint-onboard-agent` in the AGENTS.md update section.
  - The current repository skill inventory exposes `accelint-onboard-agents` as the installed skill name.
  - The Stage 1 audit flagged this as a potential routing/invocation mismatch risk.
- **recommended improvement**: Rename AGENTS-related references from `accelint-onboard-agent` to `accelint-onboard-agents` in the skill and any package docs that repeat the old name.
- **expected benefit**: Reduces the risk that the orchestration flow tries to invoke a non-existent helper skill during living-document updates.
- **confidence level**: High

## 2. Reduce prompt ambiguity around the required user-interaction checkpoints in non-interactive environments
- **issue observed**: The skill currently tells the agent to stop and ask the user at multiple points, including ambiguous change selection, risky parallel overlap, and the post-level context-management menu. In a headless/non-interactive environment, those pauses can become dead ends.
- **evidence type**: Static audit evidence
- **evidence**:
  - `SKILL.md` explicitly says to use **AskUserQuestion** when change selection is ambiguous.
  - `SKILL.md` says to stop and ask the user when slice boundaries are unclear or overlap risk is high.
  - `SKILL.md` requires offering options `(a) continue / (b) clear context / (c) pause` after each dependency level.
  - Stage 1 audit identified the skill as strong on safety but prose-heavy and potentially brittle around operational judgment.
- **recommended improvement**: Add a concise fallback rule telling the model what to do when interaction is unavailable: prefer the safest non-destructive path, default to serial execution instead of aggressive parallelization, and only pause when proceeding would risk incorrect implementation.
- **expected benefit**: Preserves safety while reducing the chance of workflow stalls in automated or headless usage.
- **confidence level**: Medium

## 3. Tighten the config-context extraction instructions so failure handling is more operational
- **issue observed**: The skill correctly warns against injecting malformed `config.yaml` context, but the extraction guidance is still manual and prose-based.
- **evidence type**: Static audit evidence
- **evidence**:
  - `SKILL.md` instructs the model to manually parse the `context: |` block and preserve whitespace.
  - The audit noted that this workflow depends on prose interpretation rather than structured support.
  - `CHANGELOG.md` for v1.6.0 already documents that context-sanity issues were important enough to harden once.
- **recommended improvement**: Clarify the extraction rule with a shorter operational fallback: if the block boundaries are uncertain, explicitly skip injection and report that decision, rather than attempting partial recovery.
- **expected benefit**: Lowers the chance of corrupted background context entering sub-agent prompts.
- **confidence level**: Medium-high

## 4. Make the README’s helper-skill references match the validated workflow names
- **issue observed**: README helper-skill naming can drift with SKILL.md naming, which increases maintenance risk.
- **evidence type**: Static audit evidence + repository observation
- **evidence**:
  - Stage 1 audit found that the package is instruction-dense and vulnerable to naming drift.
  - `CHANGELOG.md` shows this skill has needed repeated behavior-alignment fixes over time.
  - The AGENTS helper skill name mismatch appears in package guidance and should be synchronized across user-facing docs.
- **recommended improvement**: Update README references to the AGENTS onboarding helper so the package documentation and executable instructions stay aligned.
- **expected benefit**: Improves package consistency and reduces confusion during maintenance or review.
- **confidence level**: High

## 5. Avoid broad modular refactors in this iteration
- **issue observed**: The skill is long (`README.md` says `SKILL.md` is 783 lines), but the current evidence does not show a specific executed-eval failure caused by that length.
- **evidence type**: Static audit evidence only
- **evidence**:
  - Stage 1 audit identified file length as the main maintainability risk.
  - No executed eval outputs, transcripts, or reproducible failures were available in this run to prove that a structural split would improve observed behavior.
- **recommended improvement**: Do **not** attempt a large SKILL.md decomposition in this iteration. Limit changes to high-confidence, evidence-backed fixes and wording improvements.
- **expected benefit**: Prevents low-confidence churn and preserves a stable workflow while still addressing concrete risks.
- **confidence level**: High

## Confidence and blockers
- No executed eval outputs or transcripts were available in the selected run directory during this session, so recommendations are grounded primarily in direct file inspection and repository-observed skill inventory rather than fresh behavioral run data.
- Because of that evidence limit, recommendations are intentionally narrow and avoid speculative architectural rewrites.
