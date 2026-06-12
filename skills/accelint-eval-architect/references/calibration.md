# Calibration — setting thresholds from a baseline, not from a guess

A threshold picked before any run is a number pulled from the air. It either
fails good output (too strict) or greenlights regressions (too loose). The skill
measures first, then suggests; the human commits the number.

## Record-only first

Scaffold every judge metric — and any deterministic metric whose pass bar is not
self-evident — with the threshold in **record-only** mode:
- the metric runs and records its score,
- but its pass/fail does not gate the run.

Self-evident thresholds (schema validity = 1.0, "compiles" = pass) can be hard-
set immediately. Everything scored on a `[0,1]` quality scale starts record-only.

## The baseline loop

1. **Assemble known-good fixtures** — inputs you are confident the skill handles
   well today. These define "passing" empirically.
2. **Run N baselines** (N ≥ 3; 5 if the judge is non-deterministic) against those
   fixtures with metrics in record-only mode.
3. **Read `results/run-*.json`** and, per metric, collect the score distribution
   across runs × fixtures.
4. **Suggest a threshold** from the distribution — do not auto-commit it:
   - judge metrics (noisy): `mean − 2·stddev`, floored at 0 (what
     `suggest_thresholds.py` implements; raise the floor by hand if 0 is
     meaninglessly low), so normal judge variance doesn't flip the gate.
   - deterministic quality ratios (stable): the **minimum observed** on known-good
     input, minus a small margin.
`scripts/suggest_thresholds.py --results <evals>/results` automates steps 3-4:
it prints per-metric distributions with both suggestion styles and flags
low-confidence metrics. The human still commits the numbers.

5. **Present the suggestion with its evidence** — "scores were 0.88/0.91/0.86
   across 3 runs; suggest threshold 0.80 (mean − 2σ)". The developer commits or
   overrides.

## Re-calibrate on model change

Judge scores drift when the judge model version changes; SUT scores drift when
the SUT model changes. The scaffolded `DESIGN.md` carries a banner: **re-run the
baseline loop after any model upgrade.** Thresholds are valid only for the
model pair they were measured against — record both model aliases in the results
artifact (the reference impl stores `judge_model_alias` + `sut_model_id` for
exactly this).

## What NOT to do

- **Do not** copy thresholds from another skill's eval — distributions differ.
- **Do not** set a judge threshold to 0.9+ without evidence the judge actually
  scores good output that high; many rubrics top out lower and a high bar just
  produces chronic false failures.
- **Do not** leave metrics in record-only forever — that is an uncalibrated eval,
  and AUDIT mode flags it. Record-only is a stage, not a destination.
