# Evals — __SKILL_NAME__ (DeepEval, hybrid)

Deterministic metrics run free by default; LLM-judge metrics are opt-in.

```bash
cd evals && uv sync && cp .env.example .env   # fill in your key
uv run pytest             # deterministic only (free)
uv run pytest -m live     # include judge metrics (costs money)
```

## Layout
- `runner.py` — SUT invocation (single-shot completion; inlines the skill prompt)
- `litellm_judge.py` — judge adapter (note the `openai/` prefix workaround)
- `conftest.py` — fixtures (`sut`, `record_metric`, `judge`) + scorecard hook
- `_reporter.py` / `_noise_filter.py` / `_json_extraction.py` — reusable infra
- `metrics/` — `example_structural_metric.py` (deterministic), `example_geval_metric.py` (judge)
- `tests/` — pass tests + `*_regression.py` (teeth)
- `results/` — `run-<utc>.json` artifacts (gitignored)

## Two model roles
**SUT** (graded, `SUT_MODEL_ID`) and **Judge** (grades, `JUDGE_MODEL_ALIAS`) are
distinct even when the alias matches. See references/frameworks/deepeval.md.

## Calibrate before trusting thresholds
Judge thresholds ship record-only. Run 3+ baselines against known-good fixtures,
then set thresholds from the distribution. See the eval-architect calibration ref.

## Don't lose this
Source is git-tracked; only `results/`, `.venv/`, `__pycache__/`, `.env` are
ignored. Commit before the first run.
