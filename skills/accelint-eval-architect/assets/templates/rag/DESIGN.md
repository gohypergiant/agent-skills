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
| generate | faithfulness | Ragas (live) | answer not grounded in retrieved context |

## Gold set
Human-curated (`goldset/goldset.yaml`, `verified: true` per entry). `corpus_hash`
detects drift. Includes adversarial unanswerable questions for the refusal check.
Conftest refuses to run if any entry is unverified.

## Thresholds
Deterministic metrics gate at 1.0 (correct). `faithfulness` is RECORD-ONLY (0.0)
until calibrated — run the baseline loop, then set from the distribution. Valid
only for the SUT+judge model pair; recalibrate after a model upgrade.

## Offline-first
Deterministic tests score `captured/` output, so the skeleton runs green with no
pipeline or judge. Wire `runner.py` to go live and regenerate `captured/`.

## Known follow-ups
- [ ] Wire `runner.py` (ingest/retrieve/generate adapters) and regenerate `captured/`.
- [ ] Expand the gold set beyond the smoke tier; keep it human-verified.
- [ ] Add precision@k / MRR / nDCG (retrieve) and answer_correctness (e2e) as needed.
- [ ] Add a `refusal_on_unknown` metric using the adversarial gold entries.
- [ ] Calibrate the faithfulness threshold from a baseline.
- [ ] Confirm all eval source is git-tracked in this repo.
