# Evals — __TARGET_NAME__ (RAG pipeline)

Hybrid eval for a retrieval pipeline. **Deterministic ingest + retrieve metrics
run free and offline** (they score captured output against a curated gold set);
the Ragas answer-layer metric is gated behind `-m live`.

```bash
cd evals && uv sync && cp .env.example .env   # fill in your judge + embeddings keys
uv run pytest             # deterministic ingest + retrieve only (free, offline)
uv run pytest -m live     # add the Ragas faithfulness metric (costs money, needs the pipeline)
```

## Stages measured (gate runs per stage)
- **ingest** — `section_coverage`: every expected section made it into the index.
- **retrieve** — `recall@k`: the supporting passage is in the top-k for each answerable question.
- **generate** — `refusal_on_unknown` (deterministic, offline): on unanswerable
  questions the bot must refuse, not invent — scored against the adversarial
  gold entries via a closed refusal-marker list. Plus `faithfulness` (Ragas,
  gated): the answer is grounded in the retrieved context.
- **drift tripwire** — `test_corpus_drift` recomputes a content hash of the
  corpus and compares it to the gold set's `corpus_hash`. It SKIPS until you set
  `corpus_path` in `goldset/goldset.yaml`; arm it as soon as the corpus is
  reachable from the eval.

Each deterministic metric ships a `*_regression.py` proving it can fail.

## Layout
- `goldset/goldset.yaml` — curated Q/A/passage triples + adversarial unanswerable. **Human-verified.**
- `captured/` — sample ingest, retrieval, and answer output → offline test input.
- `fixtures/source_manifest.yaml` — expected corpus sections (for section_coverage).
- `metrics/` — `section_coverage.py`, `recall_at_k.py`, `refusal_on_unknown.py`, `faithfulness_ragas.py`
- `corpus_hash.py` — content-hash helper (mirrors `bootstrap_goldset.py`).
- `runner.py` — **you wire this**: how to invoke ingest / retrieve / generate on your pipeline.
- `tests/` — pass + `*_regression.py` (deterministic) + a gated faithfulness test.

## The gold set is the prerequisite
`recall@k` and `faithfulness` mean nothing without a curated gold set. Bootstrap a
draft with `scripts/bootstrap_goldset.py` (in the eval-architect skill), then
**curate it by hand** — never trust an auto-generated gold set graded by an
auto-generated judge. See the skill's `references/gold-set.md`.

## Going live
The deterministic tests use `captured/` so they run with no pipeline. To
regression-test for real, implement the three adapters in `runner.py` and
regenerate `captured/` from a live run.

## Don't lose this
Source is git-tracked; only `results/`, `.venv/`, `__pycache__/`, `.env` are
ignored. Commit before the first run.
