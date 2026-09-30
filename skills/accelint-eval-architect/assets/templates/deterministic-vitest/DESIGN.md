# Eval design — __SKILL_NAME__ (deterministic, vitest)

## Why deterministic-only
Every metric here is a pure function over (output, expected) — exact, free per
run, no drift, no judge LLM. If a genuine judgment slice emerges later, add a
gated judge layer with `scaffold_eval.py --layer` (EXTEND mode) instead of
re-scaffolding.

## Metrics
| Metric | Dimension | Catches |
|---|---|---|
| example_metric | correctness | __METRIC_CATCHES__ |

For detection-style skills, recall and false-positive-resistance ship as a
pair: a dirty fixture (planted defects) for recall, a clean fixture for
precision. Either alone rewards degenerate behavior.

## Thresholds
Binary checks gate exactly (pass/fail needs no calibration). Ratio metrics
(recall, coverage) still ship record-only first — run a baseline, then gate at
min−margin per the eval-architect calibration reference.

## Known follow-ups
<!-- Pre-filled so this never ships "done". Update as you extend. -->
- [ ] Replace the example fixture with real flawed + broken cases.
- [ ] Generate `expected/` goldens from the live schema/validator, not by hand.
- [ ] Add a regression test for every metric added beyond the skeleton.
- [ ] Confirm all eval source is git-tracked.
