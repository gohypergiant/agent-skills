# Stage 2 Recommendations — accelint-react-testing

## 1. Soften or correct the destructured-query warning
- **issue observed:** The skill overstates the downside of destructuring queries from `render` by asserting stale-DOM behavior rather than emphasizing maintainability and consistency.
- **evidence type:** Static audit evidence
- **evidence:** In `skills/accelint-react-testing/SKILL.md`, the top-level anti-pattern guidance says destructured queries “create stale queries” and “search the initial DOM snapshot.” Stage 1 audit flagged this as the least well-supported claim in the main guidance.
- **recommended improvement:** Rewrite this guidance to discourage destructured queries mainly for consistency, readability, and `screen`-first workflow reasons, without claiming a stronger failure mode than the repository evidence supports.
- **expected benefit:** Reduces the chance of teaching a contestable rule, improving trust and precision without changing the overall recommendation.
- **confidence level:** High

## 2. Trim dense top-level prose and rely more on progressive disclosure
- **issue observed:** The top-level `SKILL.md` carries a large amount of detailed rationale even though the package already has focused references and an `AGENTS.md` overview.
- **evidence type:** Static audit evidence
- **evidence:** Direct inspection shows `SKILL.md` includes an extensive “NEVER” section, pre-test reasoning section, usage section, decision tree, notes, and audit instructions, while the package already contains targeted references for the same domains.
- **recommended improvement:** Keep the top-level skill centered on routing, selection logic, high-signal guardrails, and audit behavior; move only redundant explanatory detail into the existing references where possible.
- **expected benefit:** Improves signal-to-noise and lowers token overhead while preserving the package’s strong reference-based architecture.
- **confidence level:** Medium

## 3. Replace overly rigid universal phrasing where reasoning is enough
- **issue observed:** Several rules use absolute “NEVER” framing even where the underlying intent is to steer defaults rather than ban every edge case.
- **evidence type:** Static audit evidence
- **evidence:** The top-level rules in `skills/accelint-react-testing/SKILL.md` are written as repeated universal prohibitions. Stage 1 audit found this can make the guidance feel more brittle than necessary.
- **recommended improvement:** Keep the same default behaviors but rephrase the most rigid items so they explain the tradeoff and default preference rather than sounding like blanket law, except where the repo evidence clearly supports a hard stop.
- **expected benefit:** Makes the skill easier for agents to apply with judgment in edge cases, reducing overcorrection risk.
- **confidence level:** Medium

## 4. Add eval coverage for disputed-prose and routing behavior
- **issue observed:** The eval set is broad, but it does not directly probe whether the skill handles the destructured-query topic with calibrated wording or whether it keeps audit-mode output appropriately structured in borderline cases.
- **evidence type:** Static repository evidence
- **evidence:** `skills/accelint-react-testing/evals/evals.json` covers many RTL topics and some boundary cases, but there is no prompt directly testing nuanced guidance for destructured `render` queries versus `screen`, and only limited coverage of borderline audit-output selection behavior.
- **recommended improvement:** Add one or two narrowly targeted evals that check calibrated reasoning for `screen` vs destructured queries and one borderline audit/fix request where the expected output shape is explicit.
- **expected benefit:** Makes future optimization less dependent on intuition by adding direct evidence around today’s identified weak spots.
- **confidence level:** Medium

## 5. Leave version alignment and package completeness intact while making only localized changes
- **issue observed:** The package already has aligned version metadata and good structural completeness, so broad edits would carry unnecessary risk.
- **evidence type:** Direct repository inspection
- **evidence:** `SKILL.md`, `CHANGELOG.md`, references, scripts, evals, assets, and `AGENTS.md` are present and consistent; `metadata.version` and the latest changelog entry are aligned at `1.2.1`.
- **recommended improvement:** Apply only minimal, evidence-backed refinements to `SKILL.md` and eval coverage, then bump version/changelog in a patch-level manner.
- **expected benefit:** Preserves the skill’s existing strengths while targeting the specific weaknesses observed.
- **confidence level:** High

## Confidence note
These recommendations are grounded in static audit evidence and direct repository inspection only. No executed skill-eval outputs or reviewer feedback were produced in this workflow, so recommendations that affect behavior shape are intentionally narrow and confidence is lower for broader structural changes.
