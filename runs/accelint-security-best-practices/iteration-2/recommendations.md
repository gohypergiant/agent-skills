# Stage 2 Recommendations — accelint-security-best-practices

## 1) Replace exhaustive-sounding audit language with bounded-coverage language
- **issue observed**: The skill repeatedly uses absolute phrasing like “audit ALL in-scope code” and “report ALL verified vulnerabilities,” which can pressure agents to sound exhaustive even when repo size or time limits make that unrealistic.
- **evidence type**: Static audit evidence
- **evidence**: Direct inspection of `skills/accelint-security-best-practices/SKILL.md` shows repeated absolute coverage language in “Phase 1,” “Phase 2,” “Important Notes,” and the decision tree section.
- **recommended improvement**: Reword these instructions to preserve thoroughness while requiring explicit scope accounting, prioritized reporting, and no false claims of exhaustive coverage.
- **expected benefit**: Lowers the risk of overclaiming, especially in large or time-bounded audits, while keeping the skill security-focused.
- **confidence level**: High

## 2) Add more adjacent should-not-trigger evals
- **issue observed**: The eval set includes only one explicit near-miss non-security case, which is thin coverage for false positives.
- **evidence type**: Static audit evidence
- **evidence**: `skills/accelint-security-best-practices/evals/evals.json` currently has one clearly negative case (`near-miss-non-security-request-should-not-trigger`) and six positive cases.
- **recommended improvement**: Add 2–3 nearby non-security prompts, such as code-quality refactors with auth mentioned incidentally, performance tuning of API routes, or generic architecture review of a security-adjacent feature.
- **expected benefit**: Better trigger-boundary testing and lower risk of this skill being invoked for maintainability or architecture work that is not primarily security.
- **confidence level**: High

## 3) Tighten duplicated guidance in the core skill file rather than restating doctrine
- **issue observed**: The package repeats anti-pattern and framing content across `SKILL.md`, `AGENTS.md`, and support docs, increasing token cost.
- **evidence type**: Static audit evidence
- **evidence**: Direct comparison of `SKILL.md` and `AGENTS.md` shows overlapping “NEVER” guidance and category summaries.
- **recommended improvement**: In `SKILL.md`, keep the workflow and decision rules primary, then point more aggressively to `AGENTS.md` and `references/` for repeated lists.
- **expected benefit**: Better context efficiency during invocation without changing the security posture.
- **confidence level**: Medium

## 4) Convert generic security doctrine into agent-operational instructions where possible
- **issue observed**: Some passages explain security principles broadly but do not always tell the agent what to do next.
- **evidence type**: Static audit evidence
- **evidence**: Examples include long explanatory prose in the “NEVER” section and broad policy statements in `SKILL.md` that are less actionable than the workflow sections.
- **recommended improvement**: Shorten explanatory prose where feasible and replace it with operational guidance such as “state assumptions,” “cite concrete file locations,” and “separate verified findings from follow-up risks.”
- **expected benefit**: More consistent outputs under constrained context and less risk of generic security essays.
- **confidence level**: Medium

## Evidence limits
- No executed evals were run in Stages 1–2, so these recommendations are grounded in direct repository inspection only.
- Because there is no fresh run-time evidence yet, recommendations 3 and 4 should be implemented conservatively.
