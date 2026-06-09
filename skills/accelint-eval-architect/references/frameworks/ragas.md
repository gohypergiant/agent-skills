# Ragas — expert-only adoption notes (RAG answer layer)

Not a Ragas tutorial. Use Ragas for the **generate** stage of a RAG pipeline —
the judge slice — while keeping ingest + retrieve on a deterministic harness.

## When Ragas vs DeepEval (recommend per case)
- **Ragas** — you want the canned RAG metrics out of the box: faithfulness,
  context precision/recall, answer relevancy, answer correctness. Best for a
  straight RAG bot.
- **DeepEval** — you need custom answer rubrics, or you want to reuse an existing
  house DeepEval harness (reporter, judge adapter). DeepEval's GEval can express
  RAG-style criteria too, just not as turnkey.
Default to Ragas for a pure RAG bot; pick DeepEval when the answer rubric is bespoke.

## The metrics map to gold-set fields
- **faithfulness** — answer claims are entailed by the *retrieved context*. No
  gold passage needed; it grades answer-vs-context. Catches hallucination.
- **context_precision / context_recall** — did retrieval surface the supporting
  passages? Needs the gold `supporting_passages`. (Overlaps the deterministic
  retrieve metrics — prefer the deterministic recall@k as the gate; use Ragas
  context_recall as corroboration, not the primary.)
- **answer_relevancy** — does the answer address the question? No gold needed.
- **answer_correctness** — answer vs the gold `answer`. Needs curated answers.

## Gotchas
- **Ragas needs a judge LLM and an embeddings model.** Both must point at your
  proxy. Set them explicitly — do not let Ragas default to an OpenAI key. Wrap
  your LiteLLM/Bedrock model and pass it as the Ragas LLM + embeddings, the same
  way the DeepEval judge is wired (see frameworks/deepeval.md for the `openai/`
  prefix trick if your proxy is Bedrock-fronted).
- **Faithfulness is the judge slice; gate it.** Mark Ragas tests `live` and keep
  them out of the default run so deterministic retrieval metrics stay free.
- **Two roles still apply.** The SUT is your pipeline (it produces the answer +
  retrieved context); Ragas's judge is separate. Feed Ragas the SUT's
  `{question, answer, retrieved_contexts, ground_truth}` — don't let Ragas
  re-run retrieval.
- **Cost scales with gold-set size × metrics.** Each judged metric is an LLM call
  per question. Use the smoke tier by default; full tier on demand.
- **Don't double-count retrieval.** If deterministic recall@k already gates
  retrieval, treat Ragas context metrics as advisory to avoid two thresholds
  fighting over the same signal.

## Cost estimate
Per question, faithfulness + answer_relevancy + answer_correctness ≈ 3 judge calls.
A 10-Q smoke run ≈ 30 judge calls (~$0.50–1.50 at Sonnet rates). The full gold set
multiplies linearly — keep it gated.
