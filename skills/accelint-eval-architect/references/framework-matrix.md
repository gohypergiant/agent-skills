# Framework matrix — choosing how to evaluate

Consumes `determinism`, `output_shape`, and `toolchain` from the eval profile.
Verifiability decides *whether* to use a judge; toolchain decides *which*
deterministic harness; the judge framework is a secondary pick.

> **Pipeline targets (tool-repo):** run this gate **per stage**, not once. A RAG
> pipeline resolves to ingest+retrieve → deterministic, generate → judge slice.
> See [pipeline-decomposition.md](pipeline-decomposition.md). Ragas is
> **scaffoldable** for the answer layer (jump to "Tool-repo / RAG" below).

## Decision order (this ordering IS the cost discipline)

```
1. taste-based / aesthetic / creative output?
   YES → human-review-only. Emit the checklist (frameworks/human-review.md). No framework. STOP.

2. output FULLY verifiable by parser / compiler / schema / test-run?
   YES → deterministic harness, NO judge LLM.
        Node target  → deterministic-vitest
        Python target → deterministic-pytest

3. output PARTIALLY verifiable (structure deterministic, quality judgmental)?
   YES → hybrid: deterministic gates + a thin judge layer for the judgment slice only.
        → pick the judge framework at step 5.

4. output is free-form prose whose only real test is judgment?
   YES → judge-centric. → step 5.

5. pick the judge framework by secondary signals:
   - repo already has a DeepEval harness AND Python-tolerant → DeepEval (house consistency)
   - primary goal is A/B comparing PROMPT or MODEL variants fast → Promptfoo  [recommend, hand off]
   - output is multi-turn and/or uses tools (agentic capability) → Inspect AI [recommend, hand off]
   - output is retrieval-grounded (RAG: faithfulness, context recall) → Ragas [SCAFFOLDABLE — see "Tool-repo / RAG"]
   - production runtime monitoring, not pre-merge regression → Trulens / Phoenix [recommend, hand off]
```

**Steps 1–4 run before any framework name is spoken.** Most skills resolve at
step 1 or 2 and never need a judge.

## Per-framework: strongest reason for, strongest reason against

### Deterministic harness (vitest / pytest) — **scaffolded in v1**
- **For:** zero per-run cost, never drifts, exact. Detecting a planted error is a set-membership check — an LLM judge adds noise there for no gain.
- **Against:** cannot grade anything genuinely subjective (explanation quality, "is this the *right* abstraction"). Caps at structural/factual correctness.

### DeepEval — **scaffolded in v1**
- **For:** GEval gives flexible LLM-judged rubrics; the repo already has a reusable harness (reporter, judge adapter, noise filter) so a new judge layer is cheap to add; Python.
- **Against:** every metric is a paid, drift-prone judge call; overkill if the output is deterministically checkable.

### Promptfoo — **recommend, hand off (no scaffold v1)**
- **For:** YAML-driven, built-in assertions, first-class multi-model / multi-prompt A/B comparison; Node-native.
- **Against:** comparison-centric model fits "which prompt/model is better" better than "did this skill regress"; another config surface to maintain.

### Inspect AI — **recommend, hand off (no scaffold v1)**
- **For:** designed for capability evals — multi-turn, tool use, agentic flows; strong for skills that hold conversations or call tools.
- **Against:** heavier mental model than the repo needs for single-shot skills; Python.

### Ragas — **scaffolded in v1.1 (RAG answer layer)**
- **For:** purpose-built RAG metrics (faithfulness, context recall/precision, answer relevancy/correctness) out of the box; the natural answer-layer for a retrieval pipeline.
- **Against:** RAG-specific — only relevant for a `tool-repo` with `pipeline_kind: rag`, never for a skill target. For the deterministic ingest/retrieve stages, do NOT use Ragas; use the deterministic-retrieval harness.

### OpenAI Evals — **rarely the pick**
- **For:** spec-driven, minimalist.
- **Against:** OpenAI-centric and weaker custom-rubric ergonomics than GEval; the house proxy is Bedrock-fronted.

### Trulens / Phoenix — **rarely the pick**
- **For:** production observability — tracing live traffic with eval rails.
- **Against:** aimed at runtime monitoring, not pre-merge regression of a skill; overkill and mis-targeted here.

## House-consistency argument (falsifiable, not generic praise)

The repo already has a DeepEval harness (`accelint-ac-to-playwright/evals/`) with
a reusable `_reporter.py` scorecard, `litellm_judge.py` (Bedrock `openai/`-prefix
adapter), and `_noise_filter.py`. For a new skill that **genuinely needs a judge
(steps 3–4)**, reusing those transfers the scorecard, JSON-artifact schema, and
Bedrock workaround for free. This is a concrete maintainability win — but it
applies *only after* steps 1–2 have ruled out a deterministic-only solution.

## Worked examples

| Target | Recommendation | Beats runner-up because… |
|---|---|---|
| AC → JSON test plans (`ac-to-playwright`) | DeepEval, hybrid | vs pure deterministic: "did the assessment catch the right issues with actionable explanations" is real rubric judgment a parser can't score — while the Zod CLI still gives free deterministic gates. |
| TS best-practices review (`ts-best-practices`) | deterministic-vitest, judge optional | vs DeepEval: detecting a *planted* violation is precision/recall on known fixtures; a judge adds cost + drift + false positives for zero accuracy gain on the part that matters. |
| Commit message from diff (hypothetical) | Promptfoo *or* DeepEval-light | Promptfoo wins *only if* fast prompt-variant A/B is a goal; otherwise house-consistency tips to DeepEval. Format checks (prefix, mood, length) are deterministic either way. |
| Architecture doc / diagram (`architecture-doc`) | hybrid, leaning human-review | vs pure DeepEval: Mermaid validity is deterministic and fact-accuracy-vs-codebase is judge-gradeable, but "is this a *good* abstraction" is taste — the eval must cover correctness + syntax and defer quality to a human. |

The pattern: the answer is rarely "one framework for everything." Expect
hybrids, deterministic-first, and honest taste ceilings.

## Cost estimates (state one in every recommendation)

Anchor to the reference impl (Sonnet 4.5 via Bedrock proxy):
- **Deterministic-only:** $0 / run.
- **Thin judge layer** (1–2 GEval metrics × a few fixtures): ~$0.50–1.50 / full run.
- **Full judge suite** (the reference impl's ~7 GEval metrics × 5 scenarios): ~$2–4 / full run.

Always pair the estimate with the default-skips-judge pattern: deterministic
metrics run free by default; judge calls are opt-in (`-m live` / equivalent).

## Recommendation-summary format (what the developer sees)

```
EVAL RECOMMENDATION — <skill-name>
─────────────────────────────────────────────────────────────
What it does   <one-liner>
Output shape   <output_shape>
Verifiability  <determinism> — <one clause on which part needs judgment>

RECOMMENDATION: <framework / "deterministic-only" / "human-review-only" / "don't build one">
  Why this over <runner-up>: <one sentence>.
  <If a judge layer: what it grades, and that it's gated behind opt-in.>

Cost estimate   <deterministic $0 / judge $X–Y per run>

Persona × scenario  <the grid, OR "NOT APPLICABLE — flat fixtures: a / b / c">

Proposed metrics
  <Dimension>  <metric>  (<deterministic|GEval>) — <what it catches>
  ...

Next: reply "scaffold it" to generate the walking skeleton, or redirect.
```

Stop after presenting. Do not scaffold without approval.

## Tool-repo / RAG

For a RAG / retrieval pipeline, the recommendation is almost always a **hybrid**,
because the verifiability gate runs per stage:

- **ingest + retrieve → deterministic-retrieval harness** (no judge). IR metrics
  (recall@k, precision@k, MRR, nDCG) are set-membership against the gold set;
  `section_coverage` is a parse check. Scaffolded via `assets/templates/rag/`.
- **generate → judge slice.** Recommend the answer-layer framework **per case**:
  - **Ragas** — canned RAG metrics (faithfulness, context recall/precision,
    answer relevancy/correctness) out of the box. Default for a straight RAG bot.
  - **DeepEval** — when the answer rubric is bespoke, or to reuse a house DeepEval
    harness. GEval can express RAG criteria, just not turnkey.
  See [frameworks/ragas.md](frameworks/ragas.md).

**Hybrid for Python skill targets:** the deepeval template already IS the hybrid
starter — its deterministic BaseMetric runs by default and GEval is gated behind
`-m live`. To add a judge layer to an existing deterministic harness later, use
`scaffold_eval.py --layer` (EXTEND mode) rather than re-scaffolding.

Standard recommendation for a docs-parser → chatbot:
> **Hybrid: deterministic-retrieval (ingest + retrieve) + Ragas answer layer (gated).**
> Why deterministic for retrieval over a judge: recall@k against the gold set is
> exact and free; a judge there only adds drift. Why Ragas over DeepEval for the
> answer layer: turnkey faithfulness + context-recall for a pure RAG bot (pick
> DeepEval instead if the answer rubric is custom).

**Cost (RAG):** deterministic ingest+retrieve = $0; gated answer layer ≈ 3 judge
calls/question (faithfulness + relevancy + correctness) → a 10-Q smoke run
≈ $0.50–1.50, scaling linearly with the gold set. Keep the judge gated; default
to the smoke tier.

**Headline metrics for a docs bot:** recall@k (can it find the passage),
faithfulness (is the answer grounded), refusal_on_unknown (does it decline when
the answer isn't in the corpus). The gold set is the prerequisite — see
[gold-set.md](gold-set.md).
