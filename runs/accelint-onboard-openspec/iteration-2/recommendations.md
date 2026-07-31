# Stage 2 Recommendations — accelint-onboard-openspec

## 1. Reduce `SKILL.md` size by moving reference-heavy material into `references/`
- **issue observed:** The skill body is oversized and carries operational workflow plus large reference material inline.
- **evidence type:** Executed audit evidence + static audit evidence
- **evidence:** `skills/accelint-onboard-openspec/SKILL.md` measured `688` lines during Stage 1. The same file contains YAML safety rules and the full config template inline in addition to workflow instructions.
- **recommended improvement:** Move the YAML safety rules and the full config template into `references/` files, then replace the in-body copies with short load-when-needed instructions.
- **expected benefit:** Lower context load, better progressive disclosure, and easier maintenance without changing the skill contract.
- **confidence level:** High

## 2. Trim repeated separation/boundary prose while keeping one strong canonical statement
- **issue observed:** The skill repeats the project-DNA vs behavior-layer boundary in multiple places.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 inspection found repeated reminders about `openspec/config.yaml` vs `AGENTS.md` / `CLAUDE.md`, plus repeated preview/TODO guidance inside `SKILL.md`.
- **recommended improvement:** Keep the strongest boundary explanation in one primary section and shorten later repeats to brief reminders only where operationally necessary.
- **expected benefit:** Better readability and less maintenance drift while preserving routing behavior.
- **confidence level:** Medium-high

## 3. Keep the serial-scan guardrail, but soften absolute wording so it matches the documented fallback path
- **issue observed:** The current hard-stop wording says to NEVER run inference serially when subagents are available, while the same skill also documents a legitimate inline fallback when subagents are unavailable.
- **evidence type:** Static audit evidence
- **evidence:** In `SKILL.md`, the top anti-pattern says serial inference must never happen when subagents are available. Later, Phase 3 correctly defines the inline fallback when subagents are unavailable. The absolute wording is directionally correct but can read more rigidly than the actual workflow.
- **recommended improvement:** Rephrase the anti-pattern to emphasize the decision rule: use parallel discovery whenever subagents are available; if not, disclose that and perform the same four-domain pass inline.
- **expected benefit:** Better internal consistency and lower risk of misreading the guardrail as conflicting with the fallback.
- **confidence level:** Medium

## 4. Regenerate published docs so published content matches current source
- **issue observed:** The published doc page appears stale relative to the latest source/changelog state.
- **evidence type:** Static audit evidence
- **evidence:** `docs/content/docs/onboard-openspec/index.mdx` metadata predates the `1.6.0` changelog entry dated `2026-07-30`.
- **recommended improvement:** Refresh the generated docs page from the current skill source after skill edits are complete.
- **expected benefit:** Reduced source-to-doc drift for users reading published documentation.
- **confidence level:** High

## 5. Preserve current trigger coverage rather than broadening scope
- **issue observed:** No evidence currently shows weak trigger coverage; the description already covers create/import/append/dry-run/refresh flows and boundaries.
- **evidence type:** Static audit evidence
- **evidence:** Stage 1 audit found strong trigger phrasing and `evals/evals.json` already includes positive, negative, and boundary cases.
- **recommended improvement:** Do not broaden the description further in this iteration unless later evidence shows missed routing. Focus on maintainability and consistency instead.
- **expected benefit:** Avoid unnecessary frontmatter churn and over-trigger risk.
- **confidence level:** High

## Confidence and blocker note
- No tooling blockers reduced confidence in Stages 1–2.
- Recommendations 2 and 3 rely only on static audit evidence, so they should be implemented conservatively.
