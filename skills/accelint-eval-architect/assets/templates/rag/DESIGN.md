# Eval design — __TARGET_NAME__ (RAG pipeline)

## Two roles
- **SUT** = the pipeline (`runner.py` adapters): ingest, retrieve, generate.
- **Judge** = the Ragas faithfulness LLM (`JUDGE_MODEL_ALIAS`). Distinct from the SUT.

## Per-stage gate (why hybrid)
- **ingest** → deterministic (`section_coverage`). No judge.
- **retrieve** → deterministic vs the gold set (`recall@k`). No judge.
- **generate** → judge slice (`faithfulness`, Ragas, gated).

## Metrics
| Stage | Metric | Type | Catches |
|---|---|---|---|
| ingest | section_coverage | deterministic | dropped corpus sections |
| retrieve | recall@k | deterministic | supporting passage not in top-k |
| generate | refusal_on_unknown | deterministic | invented answers on unanswerable questions |
| generate | faithfulness | Ragas (live) | answer not grounded in retrieved context |
| (drift) | test_corpus_drift | deterministic | corpus changed under the gold set (skips until `corpus_path` is set) |

## Gold set
Human-curated (`goldset/goldset.yaml`, `verified: true` per entry). `corpus_hash`
is content-based (`corpus_hash.py`, mirrors `bootstrap_goldset.py`) and is
checked by `test_corpus_drift` once `corpus_path` is set. Includes adversarial
unanswerable questions consumed by `refusal_on_unknown`. Conftest refuses to run
if any entry is unverified.

## Thresholds
The demo tests gate at 1.0 explicitly (their captured fixtures are
known-perfect). The metric DEFAULTS are record-only (0.0) — `RecallAtKMetric()`
with no threshold cannot fail by design; pass a calibrated threshold once you
have a baseline. `faithfulness` stays RECORD-ONLY until calibrated — run the
baseline loop, then set from the distribution. Valid only for the SUT+judge
model pair; recalibrate after a model upgrade. (The faithfulness regression
test proves the gate fails at a non-zero threshold via a stubbed judge.)

## Offline-first
Deterministic tests score `captured/` output, so the skeleton runs green with no
pipeline or judge. Wire `runner.py` to go live and regenerate `captured/`.

## Known follow-ups
- [ ] Wire `runner.py` (ingest/retrieve/generate adapters) and regenerate `captured/`.
- [ ] Set `corpus_path` in `goldset/goldset.yaml` to arm the corpus-drift check.
- [ ] Expand the gold set beyond the smoke tier; keep it human-verified.
- [ ] Add precision@k / MRR / nDCG (retrieve) and answer_correctness (e2e) as needed.
- [ ] Calibrate the faithfulness threshold from a baseline.
- [ ] Confirm all eval source is git-tracked in this repo.
