# Eval design — __SKILL_NAME__

## Two LLM roles
- **SUT** — the model being graded (`SUT_MODEL_ID`), invoked single-shot in `runner.py`.
- **Judge** — the model grading GEval metrics (`JUDGE_MODEL_ALIAS`), built in `litellm_judge.py`.
They may share an alias; they are configured separately and conceptually distinct.

## Why hybrid
Deterministic metrics gate the structurally-checkable part for free; the judge
layer scores only the slice a parser cannot (__JUDGMENT_SLICE__).

## Metrics
| Metric | Type | Dimension | Catches |
|---|---|---|---|
| structural | deterministic | correctness | __STRUCTURAL_CATCHES__ |
| quality | GEval (live) | pitfalls | __QUALITY_CATCHES__ |

## Thresholds
Judge thresholds are RECORD-ONLY until calibrated. Run 3+ baselines against
known-good fixtures, then set thresholds from the observed distribution. Valid
only for the SUT+Judge model pair they were measured against — recalibrate after
any model upgrade. (`results/run-*.json` records both aliases.)

## Known follow-ups
<!-- Pre-filled so this never ships "done". Update as you extend. -->
- [ ] Fill `_EVALUATION_STEPS` and compute `RUBRIC_HASH` (the self-check test fails until then).
- [ ] Calibrate thresholds from a baseline (currently record-only).
- [ ] Add flawed + broken fixtures (only the pristine fixture exists in the skeleton).
- [ ] Generate `expected/` goldens from the skill's schema, not by hand.
- [ ] Add a regression test for every metric added beyond the skeleton.
- [ ] Confirm all eval source is git-tracked.
