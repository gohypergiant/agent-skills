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
- **The 0.1 and 0.2+ APIs are incompatible — write for 0.2+.** 0.1 code
  (`Dataset` with a `"contexts"` column, lowercase metric singletons like
  `faithfulness`, scalar `result["faithfulness"]`) raises or mis-keys under
  0.2+. The 0.2+ shape: `SingleTurnSample(user_input=…, response=…,
  retrieved_contexts=…)`, class metrics (`Faithfulness(llm=…)`), and
  `scorer.single_turn_score(sample)` for a per-sample scalar.
- **Ragas needs a judge LLM (and, for some metrics, embeddings) that point at
  your proxy.** Set them explicitly — do not let Ragas default to an OpenAI key.
  Faithfulness needs only the LLM; answer_relevancy also needs embeddings.
  Wiring for a LiteLLM/Bedrock-fronted proxy:
  ```python
  from langchain_openai import ChatOpenAI
  from ragas.llms import LangchainLLMWrapper

  judge = LangchainLLMWrapper(ChatOpenAI(
      model=os.environ["JUDGE_MODEL_ALIAS"],
      base_url=os.environ["LITELLM_BASE_URL"],
      api_key=os.environ["LITELLM_API_KEY"],
      temperature=0.0,
  ))
  ```
  (Same `openai/`-compatible proxy idea as the DeepEval judge — see
  frameworks/deepeval.md for the Bedrock-fronted prefix trick.)
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
