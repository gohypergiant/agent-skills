# LLM Evaluation Harness

**⚠️ INTERNAL INFRASTRUCTURE — NOT PART OF SHIPPED SKILL ⚠️**

This directory contains the evaluation harness for testing the `accelint-ac-to-playwright` skill's LLM stage (AC → JSON plan / AC → assessment report).

---

## Quick Start

### Prerequisites

1. **Python 3.11+** and **uv** package manager
2. **Node ≥25** with the skill built (`npm run build` from skill root)
3. **LiteLLM proxy credentials** (see Configuration below)

### Setup

```bash
# From the skill root directory
cd evals

# Install Python dependencies
uv sync

# Copy environment template
cp .env.example .env

# Edit .env and fill in your credentials
# Request a personal virtual key from the proxy admin
```

### Run Evals

```bash
# From the skill root directory

# Default: deterministic tests only — no JUDGE tokens. Regression tests and
# rubric self-checks run with zero env; tests that invoke the SUT need SUT env
# (and bill SUT tokens) and fail at setup with instructions when it's absent.
npm run eval

# ONLY the GEval (judge-driven) tests — deselects the rest (costs money)
npm run eval -- -m live

# Everything, deterministic + judge
npm run eval -- -m ""

# Run a specific test file
npm run eval -- tests/test_conversion_mode.py

# Verbose output (per-test docstrings)
npm run eval -- -v
```

`npm run eval` prints a one-screen scorecard at the end of the run plus writes a machine-readable artifact to `evals/results/run-<utc-timestamp>.json` (gitignored).

> **Note**: `addopts` in `evals/pyproject.toml` defaults to `-m "not live"`, which is why the default invocation skips GEval. The `-- -m live` form overrides that marker.

---

## Configuration

### Environment Variables

Copy `evals/.env.example` to `evals/.env` and configure:

**Judge Configuration** (fixed):
- `LITELLM_BASE_URL` - Internal LiteLLM proxy URL
- `LITELLM_API_KEY` - Your personal virtual key (request from proxy admin)
- `JUDGE_MODEL_ALIAS` - Model alias for judge (e.g., `bedrock-claude-4-5-sonnet`)

**SUT Configuration** (variable):
- `SUT_PROVIDER` - `litellm`, `anthropic`, or `openai`
- `SUT_MODEL_ID` - Model alias or ID
- `SUT_LITELLM_BASE_URL` - (if provider is `litellm`)
- `ANTHROPIC_API_KEY` - (if provider is `anthropic`)

**Do not reuse the CI key** — each developer should have their own virtual key for attribution.

---

## What Gets Evaluated

The harness organises tests around five **persona × scenario** combinations from the eval spec:

| Persona | Scenario | Fixture | Mode |
|---|---|---|---|
| PM | assesses perfect AC | `PERFECT-AC.feature` | assessment |
| PM | assesses pretty-good AC | `MIXED-AC-1.feature` | assessment |
| PM | assesses not-ready AC | `BAD-AC.feature` | assessment |
| Engineer | converts perfect AC | `PERFECT-AC.feature` | conversion |
| Engineer | converts not-ready AC | `BAD-AC.feature` | conversion |

(The `MIXED-AC` fixture was split into `MIXED-AC-{1..5}.feature` to exercise more error categories; tests currently point at slice 1 as the canonical mixed example.)

### Metrics (14 total)

Each metric is tagged with one of three **spec dimensions** — that's how the scorecard groups them.

**Completeness & correctness**

| Metric | Type | Catches |
|---|---|---|
| `task_completion` | GEval | refusals, mode confusion, incomplete attempts |
| `goal_accuracy` | GEval | dropped scenarios, false positives/negatives in assessment |
| `json_structural` | Deterministic | structural errors against the production Zod schema |
| `target_coverage` | Deterministic | dropped scenarios, missing `must_have_targets` |
| `json_completeness` | Deterministic | every AC scenario + step represented in the plan |
| `assessment_quality` | GEval | missed expected issues, false positives in assessment reports |
| `blatant_errors` | GEval | self-contradictions, malformed output, invented scenario/file names |

**Efficiency**

| Metric | Type | Catches |
|---|---|---|
| `step_efficiency` | Deterministic | output bloat (essential content / output length ratio) |
| `clarification_needed` | Deterministic | counts clarification questions against an expected band |
| Runtime telemetry | Captured per-call | latency p50/p95/max, token usage by mode |

**LLM pitfalls**

| Metric | Type | Catches |
|---|---|---|
| `hallucinations` | Deterministic | `expectText` / visibility / `expectUrl` assertions not grounded in AC |
| `semantic_quality` | GEval | semantic mapping issues: target patterns, action-element compatibility |
| `plan_adherence` | GEval | skipped or reordered SKILL.md workflow steps |
| `assumptions` | GEval | silent invention of values for ambiguous AC items |
| `permission_compliance` | Deterministic | claims that files were written (eval mode forbids it) |

### Deterministic vs GEval

- **Deterministic metrics** are fast, stable, and make no judge calls. They run in the default `npm run eval` invocation (those that invoke the SUT still bill SUT tokens; the offline regression tests and rubric self-checks are fully free).
- **GEval metrics** call the judge LLM. They're skipped by default; `-- -m live` runs ONLY them. Each judge call costs real $$. Every judge metric records its `rubric_hash` so a rubric edit after calibration is detectable (eval-architect audit check #12).

---

## Reading the Scorecard

At the end of every run, the harness renders a fixed-width text scorecard to stdout. Example:

```
══════════════════════════════════════════════════════════════════════════════════════
EVAL SCORECARD
══════════════════════════════════════════════════════════════════════════════════════
Run started     2026-06-08T21:37:46.236277+00:00   (3m19s total)
SUT             bedrock-claude-4-5-sonnet (litellm)
Judge           bedrock-claude-4-5-sonnet
Prompt hash     19f52d8a09b0a790   skill_md=b94cd77d81a3f8cc

Completeness & correctness
──────────────────────────────────────────────────────────────────────────────────────
Status  Metric                    Score   Thresh  Persona · Scenario
------  ----------------------  -------  -------  ----------------------------------
PASS    json_structural            1.00   ≥ 1.00  Engineer · converts perfect AC
PASS    target_coverage            1.00   ≥ 1.00  Engineer · converts perfect AC
...

Failure details
──────────────────────────────────────────────────────────────────────────────────────
[1] clarification_needed  (Engineer · converts not-ready AC)  score 0.00 < 1.00
    Detected 0 clarification question(s); expected 2-15.
══════════════════════════════════════════════════════════════════════════════════════

Wrote results/run-20260608T213746.236277+0000.json
```

The scorecard separates per-test metric outcomes (with full untruncated judge reasons in the "Failure details" block) from runtime telemetry (latency + tokens) and the persona/scenario rollup.

---

## Interpreting Results

### Exit Codes

- `0` - All selected tests passed
- `1` - Configuration error (missing env vars, CLI not built, fixtures missing)
- non-zero - One or more tests failed

### Result JSON Schema

Each run writes a JSON artifact to `evals/results/run-<utc-timestamp>.json`:

```json
{
  "schema_version": 1,
  "run_started_at": "2026-06-08T21:37:46.236277+00:00",
  "run_completed_at": "2026-06-08T21:41:05.612143+00:00",
  "duration_seconds": 199.36,
  "judge_model_alias": "bedrock-claude-4-5-sonnet",
  "sut_provider": "litellm",
  "sut_model_id": "bedrock-claude-4-5-sonnet",
  "prompt_hash": "19f52d8a09b0a790",
  "skill_md_hash": "b94cd77d81a3f8cc",
  "references_hash": "...",
  "metrics": [
    {
      "nodeid": "tests/test_conversion_mode.py::test_perfect_ac_conversion_structural",
      "name": "json_structural",
      "score": 1.0,
      "threshold": 1.0,
      "passed": true,
      "dimension": "completeness",
      "persona": "engineer",
      "scenario": "perfect-convert",
      "reason": "Plan passes Zod schema validation"
    }
  ],
  "invocations": [
    {
      "mode": "conversion",
      "fixture": "PERFECT-AC.feature",
      "latency_seconds": 18.6,
      "prompt_tokens": 12345,
      "completion_tokens": 1456,
      "total_tokens": 13801
    }
  ],
  "efficiency": {
    "sut_invocations": 11,
    "latency_p50": 18.6,
    "latency_p95": 28.0,
    "latency_max": 33.6,
    "total_tokens": 152300,
    "mean_tokens_by_mode": {
      "conversion": 14500.0,
      "assessment": 13100.0
    }
  },
  "summary": {
    "total": 7,
    "passed": 6,
    "failed": 1,
    "below_threshold": ["clarification_needed"]
  }
}
```

Use `prompt_hash` / `skill_md_hash` / `references_hash` to distinguish *"the SUT model changed"* from *"the skill prompt changed"* when scores move between runs.

---

## Troubleshooting

### "Judge configuration failed"

- Check that `.env` exists and has all three judge env vars
- Verify `LITELLM_API_KEY` is valid (not expired)
- Check proxy is reachable: `curl -H "Authorization: Bearer $LITELLM_API_KEY" $LITELLM_BASE_URL/health`

### "validate-plan CLI not found"

- Run `npm run build` from the skill root
- Verify `dist/scripts/cli/validate-plan.js` exists after build (TypeScript outputs to `dist/`)

### "Fixture not found"

- Fixtures must exist at `assets/evals/`:
  - `PERFECT-AC.feature`
  - `BAD-AC.feature`
  - `MIXED-AC-1.feature` through `MIXED-AC-5.feature`
- If any are missing, check the latest `feat/llm-evaluation` branch or ask for fixture files

### GEval metrics time out

- LiteLLM proxy may be slow or rate-limited
- Check proxy status and rate limits
- Drop back to the deterministic-only default by removing `-m live`

### Stale openai package

If you see `ModuleNotFoundError: No module named 'openai.types.shared'` (or similar `openai.types.X` paths), the venv's `openai` install is desynced. Force reinstall:

```bash
cd evals
uv pip install --reinstall openai
```

---

## Cost Management

GEval metrics cost money. Rough estimates with Sonnet 4.5 pricing and the current ~22-metric scorecard across 5 persona/scenario combos:

- Deterministic run (`npm run eval`): **free**
- Full GEval run (`npm run eval -- -m live`): roughly **$2–4 per run** at current sizes (varies with judge token usage)
- Combined deterministic + live run: same as full GEval — deterministic adds negligible cost

**To control costs:**
- Default invocation is deterministic-only; opt in to GEval with `-- -m live`
- Run GEval locally only when debugging prompt or rubric changes
- CI runs the full suite on every PR touching the harness; the project budget is $200/month

---

## Adding New Fixtures

1. Create AC file in `assets/evals/`
2. If testing conversion mode, create ground truth artifacts:
   - `assets/evals/expected/<name>.plan.json` - hand-authored reference plan
   - `assets/evals/expected/<name>.assertions.yaml` - expected targets/assertions
3. If testing assessment mode:
   - `assets/evals/expected/<name>.assessment.yaml` - expected issues list
4. Add a test in the appropriate `tests/test_<persona>_<scenario>.py` file or extend an existing one

---

## Development

### Running Tests Locally

```bash
# Default (deterministic only)
uv run pytest

# Include GEval (live) tests
uv run pytest -m live

# Specific file
uv run pytest tests/test_metrics_catch_regressions.py

# Verbose + show print statements
uv run pytest -v -s
```

### Adding a New Metric

1. Create `metrics/your_metric.py` extending `BaseMetric` (deterministic) or `GEval` (judge-driven)
2. For GEval subclasses, override `measure` and `a_measure` with `(self, test_case, *args, **kwargs)` and forward to `super()` — required for DeepEval 4.x compatibility
3. Add a regression test in `tests/test_<family>_metrics_regressions.py` proving the metric can fail
4. Wire the metric into the relevant persona/scenario test file via the `record_metric(...)` fixture
5. Pick the right `dimension` slug (`completeness`, `efficiency`, or `pitfalls`) so the scorecard groups it correctly

---

## CI Integration

See `.github/workflows/llm-eval.yml` for the CI workflow.

**Triggers:**
- PRs touching: `SKILL.md`, `references/**`, `assets/evals/**`, `evals/**`
- Pushes to `feat/llm-evaluation`

**Status:** `continue-on-error: true` (v1 is advisory until thresholds are calibrated)

---

## Further Reading

- **`DESIGN.md`** - Detailed design decisions, failure modes, assumptions
- **`assets/evals/expected/README.md`** - How ground truth artifacts are structured
- **SKILL.md** - The skill prompt being evaluated
- **`references/acceptance-criteria.md`** - AC writing guidelines
- **`references/test-hooks.md`** - Target pattern controlled vocabulary
