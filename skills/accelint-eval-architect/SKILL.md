---
name: accelint-eval-architect
description: Use when users say "add an eval to this skill", "evaluate this skill/agent", "evaluate this tool/repo/pipeline", "how should I test this RAG bot / retrieval / parser", "set up DeepEval/Ragas", "should I use Promptfoo/Inspect", "is my eval any good", "audit my eval harness" — or when they describe symptoms like "my bot is hallucinating", "answers got worse after a prompt/model change", "this regressed and nothing caught it", or want CI/regression checks for prompts or LLM output. Assesses the target (an LLM skill OR a standalone tool repo, e.g. a RAG/retrieval pipeline), recommends DeepEval, Ragas, a deterministic harness, or human-review-only and scaffolds it; Promptfoo and Inspect AI are recommended with hand-off guidance when they fit (not scaffolded). Also audits existing eval harnesses for stale fixtures, toothless metrics, and uncalibrated thresholds. Make sure to use this whenever someone wants to measure, test, regression-check, or benchmark what a skill, agent, tool, or RAG pipeline produces.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.3.0"
---

# Eval Architect

Decides whether and how to add automated evaluation to another skill, recommends the right framework (or honestly recommends none), and scaffolds a maintainable walking-skeleton harness. Defaults to cheap deterministic checks; gates LLM-judge calls behind explicit opt-in.

## NEVER Do When Adding Evals

- **NEVER reach for an LLM judge before ruling out deterministic verification** — judge calls cost money per run, drift across model versions, and introduce false positives. A parser/compiler/schema/test-run check is cheaper, stable, and exact. The decision order in [references/framework-matrix.md](references/framework-matrix.md) makes a judge *unreachable* until determinism is proven insufficient.
- **NEVER hand-author golden/expected artifacts** — they silently rot when the target's schema changes. (Real bug: `ac-to-playwright`'s `PERFECT-AC.plan.json` used stale field names and failed a metric for months.) Generate goldens from the live schema/validator at scaffold time.
- **NEVER pick thresholds blind** — a threshold chosen without a baseline run manufactures a meaningless green checkmark. Scaffold thresholds as record-only, measure a baseline, then set numbers from the observed distribution. See [references/calibration.md](references/calibration.md).
- **NEVER scaffold the maximalist metric suite on day one** — an unmaintained comprehensive eval is worth less than a maintained walking skeleton. Ship one fixture, one metric, one passing test, one regression test; document the extension path. Exception: detector/review skills ship recall AND false-positive-resistance as an inseparable pair — either alone rewards degenerate behavior (flag everything, or flag nothing).
- **NEVER ship a metric without a regression test that proves it can fail** — a metric that always passes is decoration. Every metric gets a planted-broken input that drives it below threshold.
- **NEVER force a persona×scenario grid onto a single-mode skill** — when there is one user and one mode, flat fixtures across an input-quality gradient are clearer. Derive the taxonomy from the skill; don't impose it. See [references/test-design.md](references/test-design.md).
- **NEVER leave eval source untracked** — `results/`, `.venv/`, `__pycache__/` are gitignored, so it is easy to orphan the *source* files alongside them (this happened to the reference impl and required bytecode recovery). Commit eval source before the first run.
- **NEVER recommend a Python judge framework for a Node-only skill unless judgment genuinely requires it** — house toolchain fit lowers the maintenance barrier. Match the harness to the target's existing `package.json`/`pyproject.toml`.
- **NEVER evaluate taste-based output with an LLM judge** — for visual, creative, or aesthetic output, LLM judges are weaker and less honest than humans. Recommend a structured human-review checklist instead. See [references/frameworks/human-review.md](references/frameworks/human-review.md).

## Before Recommending an Eval, Ask

### Verifiability (decides judge vs deterministic vs none)
- **Can a parser, compiler, schema, or test-run check this output with no judgment?** If yes → deterministic-only, no judge.
- **Is any part of "good" inherently subjective or taste-based?** That part is human-review, not automated — be honest about the ceiling.
- **Is the output partially verifiable** (structure deterministic, quality judgmental)? → hybrid: deterministic gates plus a thin judge layer for the judgment-only slice.

### Cost vs value
- **Is this skill used enough that regressions matter?** Low-traffic + low-stakes output may not warrant any eval. Saying "don't build one" is a valid, valuable outcome.
- **Does the judgment slice justify per-run judge cost?** Estimate tokens before recommending a judge framework.

### Toolchain fit
- **Is the target a Node or Python package?** Match the deterministic harness to it (vitest vs pytest).
- **Does a DeepEval harness already exist in the repo to reuse?** Its reporter, judge adapter, and noise filters transfer — house consistency for judge layers.

### Maintenance
- **Who recalibrates thresholds after a model upgrade?** If nobody, scope the eval smaller.
- **Will the goldens track the schema automatically, or rot?** Generate, don't hand-write.

## How to Use

This skill uses **progressive disclosure**. Detect the mode first, then load only the references each step names.

### Modes
The routing rules (which phrases and repo states select which mode) live in
Mode 0 below — one place, not two.
- **ASSESS** — read a target, classify it, recommend a framework (or none). Read-only.
- **SCAFFOLD** — build the walking-skeleton eval for the approved framework, after ASSESS.
- **AUDIT** — run the decay checklist against a target that already has an `evals/` dir.
- **EXTEND** — add metrics/fixtures to an existing eval.

### Reference map (load on demand)
- Reading + classifying a target **skill** → [references/assessment.md](references/assessment.md)
- Reading + classifying a target **tool repo / pipeline** → [references/tool-repo-assessment.md](references/tool-repo-assessment.md)
- Choosing a framework → [references/framework-matrix.md](references/framework-matrix.md)
- Designing the test matrix + metrics → [references/test-design.md](references/test-design.md)
- Decomposing a pipeline into stages + per-stage metrics → [references/pipeline-decomposition.md](references/pipeline-decomposition.md)
- Building/curating a RAG gold set → [references/gold-set.md](references/gold-set.md)
- Setting thresholds from a baseline → [references/calibration.md](references/calibration.md)
- Auditing an existing eval → [references/audit.md](references/audit.md)
- Framework specifics → [references/frameworks/deepeval.md](references/frameworks/deepeval.md), [ragas.md](references/frameworks/ragas.md), [deterministic-vitest.md](references/frameworks/deterministic-vitest.md), [deterministic-pytest.md](references/frameworks/deterministic-pytest.md), [human-review.md](references/frameworks/human-review.md)

**Do NOT load all references at once.** Each step below names what it needs.

## Workflow

### Mode 0 — Detect target type, then mode

**Target type** (decides which assessment path):
```
path has SKILL.md at root                         → target_type = skill
path is a repo, no SKILL.md, has a package manifest → target_type = tool-repo
ambiguous                                          → ASK; never guess
```

**Mode:**
```
target has no evals/ + "add eval" intent    → ASSESS, then offer SCAFFOLD
"scaffold it" / approval after an ASSESS    → SCAFFOLD
"audit" / "is my eval good" / evals/ exists → AUDIT
"add a metric" / "extend" + evals/ exists   → EXTEND
"should I eval X" / "which framework"       → ASSESS only
```

### ASSESS

1. **Read the target.**
   - `target_type = skill` → load [references/assessment.md](references/assessment.md): read `SKILL.md`, `references/`, `scripts/`, `assets/`, toolchain.
   - `target_type = tool-repo` → load [references/tool-repo-assessment.md](references/tool-repo-assessment.md): read README + manifest + entry points, **then interview the developer** for pipeline stages, how each is invoked, the eval boundary, and whether a gold set exists. You cannot reverse-engineer a pipeline from files alone — confirm stages + invocation with the developer.
   - If anything required is unreadable or unconfirmed, **ask — never invent facts about a target you did not read.**
2. **Produce the eval profile** (skill schema in `assessment.md`; tool-repo schema in `tool-repo-assessment.md`). Populate `unread_or_uncertain`; resolve before recommending.
3. **Run the verifiability gate** (in `framework-matrix.md`). For a pipeline, run it **per stage** (see [references/pipeline-decomposition.md](references/pipeline-decomposition.md)): ingestion + retrieval are usually deterministic; only answer-generation is a judge slice.
4. **Recommend a framework.** Load [references/framework-matrix.md](references/framework-matrix.md). State the recommendation, the one-sentence reason it beats the runner-up, and a token-cost estimate. For RAG, recommend the answer-layer framework (Ragas vs DeepEval) **per case**, not by default.
5. **Design the test matrix.** Load [references/test-design.md](references/test-design.md) (skill) or [references/pipeline-decomposition.md](references/pipeline-decomposition.md) (pipeline). Propose metrics grouped by dimension/stage, each with a regression-test sketch. For RAG, flag that the **gold set is the prerequisite** ([references/gold-set.md](references/gold-set.md)).
6. **Present the recommendation summary** (format in `framework-matrix.md`). **Stop. Wait for approval, redirect, or decline.**

### SCAFFOLD (only on approval)

7. **Copy the framework starter** from `assets/templates/<framework>/` into the target's `evals/`. Use `scripts/scaffold_eval.py` for the mechanical copy + placeholder substitution. For a RAG pipeline the starter is `assets/templates/rag/` (deterministic ingest + retrieve metrics PLUS a gated answer-layer metric).
8. **Generate the walking skeleton**: the minimum that proves the pipeline can be measured — for a skill, one fixture + one metric + pass + regression; for RAG, a small curated gold set + `section_coverage` (ingest) + `recall@k` (retrieve) with regression tests + one gated answer metric. Nothing more.
9. **Generate goldens from the live schema/validator** if one exists — never hand-typed. For RAG there is no schema; bootstrap the gold set with `scripts/bootstrap_goldset.py`, then **require human curation** ([references/gold-set.md](references/gold-set.md)) — an un-curated gold set graded by an auto-generated judge is circular.
10. **Set all judge thresholds to record-only**; wire the runner into the target's build (`npm` script or `pyproject`); write `README.md` + `DESIGN.md` stubs (DESIGN.md ships with a pre-filled "Known follow-ups").
11. **Run the don't-lose-it check**: confirm source is git-tracked, `results/`/`.venv/`/`__pycache__/` ignored, and tell the developer to **commit before the first run**.
12. **Hand off with calibration instructions** ([references/calibration.md](references/calibration.md)): run N baselines, then set thresholds from the distribution.

### AUDIT

13. Load [references/audit.md](references/audit.md). Inventory the existing harness, run the decay checklist (stale goldens vs schema, metrics that can't fail, sentinel thresholds, renamed-fixture drift, scenarios missing metrics, judge rubrics penalizing correct behavior, untracked source). Emit findings ranked by severity. **Do not auto-fix without approval.**

### EXTEND

14. **Design the new metric** per [references/test-design.md](references/test-design.md) (or [references/pipeline-decomposition.md](references/pipeline-decomposition.md) for pipelines). The regression-test rule applies to every added metric, same as at scaffold time.
15. **To pull in another template's files** (e.g. adding a judge layer to a deterministic harness), use `scripts/scaffold_eval.py --layer` — it copies only files that don't already exist and reports collisions to merge manually (typically conftest fixtures). `--dest evals-judge` places a fully separated layer instead.
16. **Re-run the existing suite green first** — extending a broken eval buries the regression you're about to care about.
17. **Recalibrate if the extension adds judge metrics** ([references/calibration.md](references/calibration.md)); new judge metrics start record-only like always.

## Important Notes

- **Two LLM roles.** Every judge-based eval has an **SUT** (the model being graded) and a **Judge** (the model grading it) — often the same alias, conceptually distinct. Keep them separate in every recommendation and every scaffolded harness; conflating them is the #1 source of developer confusion.
- **Verifiability before everything.** The single most common mistake is using a judge where a parser would do. The matrix enforces deterministic-first; honor it.
- **The honest "no" is a feature.** "Don't build an automated eval — here's the human-review checklist" and "deterministic-only, skip the judge" are first-class outcomes, not failures of the skill.
- **Tool-repo comprehension is interactive, not magic.** The skill cannot reverse-engineer an arbitrary pipeline; it reads what it can and interviews the developer for stages + invocation. Refuse to recommend until both are confirmed.
- **RAG gold sets must be human-curated.** Bootstrap drafts are a starting point, never trusted output — and never let the gold set and the judge come from the same unreviewed pass.
- **Template version floors drift too.** Templates use floors (`deepeval>=4`, `ragas>=0.2`, `litellm>=1.55`), not hard pins — but a floor goes stale when a framework ships a breaking major. Sanity-check against the target's environment when scaffolding; tell the developer to commit the lockfile for reproducibility.
- **Scope:** scaffolds DeepEval, deterministic-vitest, deterministic-pytest, human-review-checklist, and `rag` (the deterministic ingest+retrieve layer AND the gated Ragas answer layer in one template — there is no separate "deterministic-retrieval" scaffold key). Promptfoo and Inspect AI are *recommended when they fit* but handed off. Tool-repo support targets **RAG / retrieval pipelines**; other tool types are recommended-and-handed-off, not yet scaffolded.
