# Recommendations: accelint-ts-performance

## Recommendation 1
- **issue observed:** Audit guidance is internally inconsistent about how aggressively to treat unmeasured code as hot-path performance work.
- **evidence type:** Static audit evidence
- **evidence:** `SKILL.md` says to audit all code for anti-patterns regardless of current usage context, while also telling the model to prefer profiler-backed hotspots and label static findings as hypothesis-level. `assets/output-report-template.md` goes further with “assume hot path” and “when in doubt, assume hot path.” `evals/evals.json` case `id: 22` expects calibrated behavior for startup-only cold code. These instructions pull in different directions.
- **recommended improvement:** Narrow the warning/template and surrounding workflow language so the skill still surfaces static performance patterns, but explicitly avoids overstating urgency for known cold paths. Keep the distinction: static audit finds opportunities; profiler data decides priority.
- **expected benefit:** Lower risk of over-aggressive recommendations, better alignment between audit output and trigger/eval expectations, and improved consistency when no runtime measurements exist.
- **confidence level:** High

## Recommendation 2
- **issue observed:** The canonical “single pass” example in `references/reduce-looping.md` still performs per-hit array allocation, which weakens the authority of the optimization guidance.
- **evidence type:** Static audit evidence
- **evidence:** The current “✅ Correct: single pass” example uses `arr.reduce((acc, curr) => predicate(curr) ? [...acc, mapper(curr)] : acc, [])`. That removes an intermediate array from chained methods, but it still allocates a new array on each successful branch via spread. The same file claims “zero intermediate allocations,” which this example does not actually demonstrate.
- **recommended improvement:** Replace the example with a truly low-allocation single-pass pattern, such as a `for...of` loop with `push`, or a `reduce` that mutates the accumulator with `acc.push(...)` before returning it.
- **expected benefit:** Stronger reference fidelity, less chance the skill teaches a partially optimized pattern, and better consistency between prose claims and code examples.
- **confidence level:** High

## Recommendation 3
- **issue observed:** `references/memoization.md` has a broken code fence/section boundary that can impair readability and tool interpretation.
- **evidence type:** Static audit evidence
- **evidence:** In the “Repeated Function Calls with Same Arguments” section, the `isComplete` example is followed immediately by “## Fallback Patterns” without a closing code fence before the next heading. This is a directly observed formatting defect in the repository file.
- **recommended improvement:** Repair the Markdown fence so the example closes cleanly before the next section header.
- **expected benefit:** Clearer reference loading, reduced parsing ambiguity for the model, and less risk of malformed context during skill use.
- **confidence level:** High

## Recommendation 4
- **issue observed:** The output report template pushes a stronger “assume hot path” default than the main skill now appears to intend.
- **evidence type:** Static audit evidence
- **evidence:** `assets/output-report-template.md` includes a warning block that says to ignore micro-opt suggestions only when the user already knows the code is cold-path and otherwise to “assume hot path.” That is stricter than `SKILL.md`’s more nuanced measured-vs-static framing and conflicts with eval coverage for cold-path calibration.
- **recommended improvement:** Reword the warning block so it preserves the idea that static review can still find meaningful issues, but makes prioritization contingent on measured or credibly hot usage, especially for micro-optimizations.
- **expected benefit:** Better consistency between the template, the main workflow, and cold-path eval expectations.
- **confidence level:** High

## Recommendation 5
- **issue observed:** Confidence in skill quality is limited by lack of executed eval evidence in this workflow stage.
- **evidence type:** Environment/tooling blocker
- **evidence:** Stage 1 explicitly produced no executed evals, benchmark outputs, or viewer-based review artifacts. The audit therefore relied on direct repository inspection only.
- **recommended improvement:** Keep optimization scope minimal and evidence-led in this run; do not attempt broad structural rewrites or claims of behavioral improvement that are not validated by executed runs.
- **expected benefit:** Reduces overfitting to intuition, keeps the iteration grounded in observed defects, and matches the workflow requirement to avoid unsupported claims.
- **confidence level:** High
