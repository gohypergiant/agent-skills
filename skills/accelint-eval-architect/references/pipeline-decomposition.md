# Pipeline decomposition — stages and per-stage metrics

A pipeline SUT is not one LLM call. Decompose it into stages, run the
verifiability gate **per stage**, and pick metrics per stage. For RAG this is the
payoff: two of three stages need no judge.

## Stage taxonomy (RAG)
```
ingest    docs → chunks → index        (deterministic engineering)
retrieve  query → ranked chunks         (IR; deterministic vs a gold set)
generate  chunks + question → answer    (LLM; the judge slice)
e2e       question → final answer        (correctness + latency/cost)
```

## Per-stage verifiability gate
- **ingest** → fully verifiable (parse/count/validate). No judge.
- **retrieve** → fully verifiable **with a gold set** (set-membership + ranking). No judge.
- **generate** → partially verifiable: citation accuracy is deterministic if citations are structured; faithfulness/relevance need a judge.
- **e2e** → answer-correctness needs a judge (or fuzzy match vs gold answers); latency/cost are telemetry.

## Per-stage metric matrix
| Stage | Metric | Type | Needs gold set | Catches |
|---|---|---|---|---|
| ingest | **section_coverage** | deterministic | source manifest | dropped pages/sections (silent, high-impact for spec docs) |
| ingest | chunk_boundary_validity | deterministic | no | empty/oversized chunks, mid-token splits beyond tolerance |
| ingest | dedup_rate | deterministic | no | duplicate chunks inflating the index |
| ingest | metadata_completeness | deterministic | no | chunks missing source page/citation metadata |
| retrieve | **recall@k** | deterministic | Q→passage | the supporting passage isn't in the top-k |
| retrieve | precision@k / MRR / nDCG | deterministic | Q→passage | ranking quality |
| retrieve | context_recall | deterministic | gold | needed context not surfaced at all |
| generate | **faithfulness / groundedness** | judge (Ragas) | retrieved context | answer asserts things not in the retrieved chunks |
| generate | answer_relevance | judge | no | answer doesn't address the question |
| generate | citation_accuracy | deterministic* | gold passages | cited source doesn't support the claim |
| generate | **refusal_on_unknown** | deterministic/judge | adversarial gold | invents an answer when the corpus lacks it |
| e2e | answer_correctness | judge / fuzzy | gold answers | final answer wrong |
| e2e | latency, cost/tokens | telemetry | no | slow / expensive per query |

`*` deterministic when citations are structured chunk IDs you can check against the gold passages.

## Walking skeleton (what SCAFFOLD emits for RAG)
Minimum that proves the pipeline is measurable — not the whole matrix:
- a small **curated** gold set (~10 Q/A/passage triples + ~2 adversarial unanswerable),
- `section_coverage` (ingest) + regression (drop a section → fails),
- `recall@k` (retrieve) + regression (a stub retriever that misses → recall < 1),
- one **gated** answer metric (faithfulness), threshold record-only,
- a pluggable SUT-invocation adapter the developer wires,
- offline-green: the deterministic metrics score a **captured** retrieval output against the gold set, so the skeleton runs with no live pipeline or judge.

## Cost discipline
Generate/e2e metrics bill the judge and the pipeline per question. Provide
**sampling tiers** (smoke vs full — sizes defined once in
[gold-set.md](gold-set.md)) and gate the judge (`-m live` / equivalent).
Estimate cost per tier.

## Headline metrics for a docs-bot
For "answer accurately from the docs, don't hallucinate": **recall@k**
(can it find the passage), **faithfulness** (is the answer grounded in what it
found), and **refusal_on_unknown** (does it decline when the answer isn't there).
A bot that scores high on recall but invents answers on unanswerable questions is
still a failure — ship the adversarial fixtures from day one.
