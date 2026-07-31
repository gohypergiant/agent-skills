# Optimizations Applied: accelint-ts-performance

## 1. Tighten the single-pass reference example
- **recommendation addressed:** Replace the canonical reduce-looping example that still allocated on every kept item.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-ts-performance/references/reduce-looping.md`
- **summary of implementation:** Replaced the “✅ Correct: single pass” example under `### Chained Methods to Single Reduce` with a truly single-pass loop that uses `result.push(...)` instead of array spread on every match. Also adjusted the explanation so it no longer claims a behavior the old code did not demonstrate.
- **reason this change matches the evidence:** The prior example used `[...acc, mapper(curr)]`, which directly contradicted the section’s low-allocation guidance. The new example aligns the code sample with the performance claim observed in the audit.

## 2. Repair the memoization reference formatting defect
- **recommendation addressed:** Fix the broken Markdown code fence in the repeated-function-calls example.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-ts-performance/references/memoization.md`
- **summary of implementation:** Added the missing closing code fence before `## Fallback Patterns` so the example block closes cleanly.
- **reason this change matches the evidence:** The formatting defect was directly observable in the repository and could degrade readability or context parsing when the reference is loaded.

## 3. Recalibrate the audit report warning block
- **recommendation addressed:** Soften the report template’s “assume hot path” stance.
- **evidence type supporting it:** Static audit evidence
- **files changed:** `skills/accelint-ts-performance/assets/output-report-template.md`
- **summary of implementation:** Rewrote the top warning block to say: audit broadly, do not present unmeasured code as a proven hot path, cold-path context can deprioritize micro-optimizations, and measured hotspots determine urgency.
- **reason this change matches the evidence:** The old warning conflicted with the skill’s own measured-vs-static framing and with eval coverage that expects cold-path calibration. The new wording preserves broad audit coverage without overstating certainty.

## Not applied
- **recommendation not applied:** Rewrite broader `SKILL.md` language around “audit everything” versus evidence-based prioritization.
- **why not applied:** Although the tension is real, it spans core workflow wording and could change behavior more materially than the clearly validated fixes above. With no executed eval evidence in this run, a broader rewrite would have been lower-confidence and out of scope for a minimal evidence-led pass.
