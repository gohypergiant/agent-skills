---
name: accelint-eval-architect
description: Use when users say "add an eval to this skill", "evaluate this skill/agent", "how should I test this skill's output", "set up DeepEval/Promptfoo/Inspect", "is my eval any good", "audit my eval harness", or when deciding whether and how to measure an LLM skill's output quality. Assesses a target skill, recommends DeepEval, Promptfoo, Inspect AI, a deterministic harness, or human-review-only — then scaffolds the integration. Also audits existing eval harnesses for stale fixtures, toothless metrics, and uncalibrated thresholds. Make sure to use this whenever someone wants to measure, test, regression-check, or benchmark what a skill or agent produces.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Eval Architect

Decides whether and how to add automated evaluation to another skill, recommends the right framework (or honestly recommends none), and scaffolds a maintainable walking-skeleton harness. Defaults to cheap deterministic checks; gates LLM-judge calls behind explicit opt-in.

## NEVER Do When Adding Evals

- **NEVER reach for an LLM judge before ruling out deterministic verification** — judge calls cost money per run, drift across model versions, and introduce false positives. A parser/compiler/schema/test-run check is cheaper, stable, and exact. The decision order in [references/framework-matrix.md](references/framework-matrix.md) makes a judge *unreachable* until determinism is proven insufficient.
- **NEVER hand-author golden/expected artifacts** — they silently rot when the target's schema changes. (Real bug: `ac-to-playwright`'s `PERFECT-AC.plan.json` used stale field names and failed a metric for months.) Generate goldens from the live schema/validator at scaffold time.
- **NEVER pick thresholds blind** — a threshold chosen without a baseline run manufactures a meaningless green checkmark. Scaffold thresholds as record-only, measure a baseline, then set numbers from the observed distribution. See [references/calibration.md](references/calibration.md).
- **NEVER scaffold the maximalist metric suite on day one** — an unmaintained comprehensive eval is worth less than a maintained walking skeleton. Ship one fixture, one metric, one passing test, one regression test; document the extension path.
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
- **ASSESS** — read a target skill, classify it, recommend a framework (or none). Read-only. Triggered by "should I eval X", "which framework", or as the first phase of adding an eval.
- **SCAFFOLD** — build the walking-skeleton eval for the approved framework. Triggered by "scaffold it" / "do the integration" after ASSESS.
- **AUDIT** — run against a skill that already has an `evals/` dir; surface decay. Triggered by "is my eval good" / "audit my eval", or whenever the target already has `evals/`.

### Reference map (load on demand)
- Reading + classifying a target skill → [references/assessment.md](references/assessment.md)
- Choosing a framework → [references/framework-matrix.md](references/framework-matrix.md)
- Designing the test matrix + metrics → [references/test-design.md](references/test-design.md)
- Setting thresholds from a baseline → [references/calibration.md](references/calibration.md)
- Auditing an existing eval → [references/audit.md](references/audit.md)
- Framework specifics → [references/frameworks/deepeval.md](references/frameworks/deepeval.md), [deterministic-vitest.md](references/frameworks/deterministic-vitest.md), [deterministic-pytest.md](references/frameworks/deterministic-pytest.md), [human-review.md](references/frameworks/human-review.md)

**Do NOT load all references at once.** Each step below names what it needs.

## Workflow

### Mode 0 — Detect

```
target has no evals/ + "add eval" intent  → ASSESS, then offer SCAFFOLD
"audit" / "is my eval good" / evals/ exists → AUDIT
"should I eval X" / "which framework"       → ASSESS only
```

### ASSESS

1. **Read the target skill.** Load [references/assessment.md](references/assessment.md). Read its `SKILL.md` (frontmatter + body, especially output-format sections and the `NEVER` list — those *are* the failure modes), `references/`, `scripts/` (a validator CLI = free deterministic gates), `assets/`, and toolchain file. If anything required is unreadable, **ask the user — never invent facts about a skill you did not read.**
2. **Produce the eval profile** (JSON schema in `assessment.md`). Populate `unread_or_uncertain`; if non-empty, resolve before recommending.
3. **Run the verifiability gate** (in `framework-matrix.md`): taste-based → human-review-only, stop; trivially verifiable → deterministic-only; partially/judgment → continue.
4. **Recommend a framework.** Load [references/framework-matrix.md](references/framework-matrix.md). State the recommendation, the one-sentence reason it beats the runner-up, and a token-cost estimate.
5. **Design the test matrix.** Load [references/test-design.md](references/test-design.md). Derive persona×scenario *or* state it doesn't apply and use flat fixtures. Propose metrics grouped by dimension, each with a regression-test sketch.
6. **Present the recommendation summary** (format in `framework-matrix.md`). **Stop. Wait for approval, redirect, or decline.**

### SCAFFOLD (only on approval)

7. **Copy the framework starter** from `assets/templates/<framework>/` into the target's `evals/`. Use `scripts/scaffold_eval.py` for the mechanical copy + placeholder substitution.
8. **Generate the walking skeleton**: one pristine fixture, one deterministic metric, one passing test, one planted-broken regression test that proves the metric fails. Nothing more.
9. **Generate goldens from the live schema/validator** if one exists — never hand-typed.
10. **Set all judge thresholds to record-only**; wire the runner into the target's build (`npm` script or `pyproject`); write `README.md` + `DESIGN.md` stubs (DESIGN.md ships with a pre-filled "Known follow-ups").
11. **Run the don't-lose-it check**: confirm source is git-tracked, `results/`/`.venv/`/`__pycache__/` ignored, and tell the developer to **commit before the first run**.
12. **Hand off with calibration instructions** ([references/calibration.md](references/calibration.md)): run N baselines, then set thresholds from the distribution.

### AUDIT

13. Load [references/audit.md](references/audit.md). Inventory the existing harness, run the decay checklist (stale goldens vs schema, metrics that can't fail, sentinel thresholds, renamed-fixture drift, scenarios missing metrics, judge rubrics penalizing correct behavior, untracked source). Emit findings ranked by severity. **Do not auto-fix without approval.**

## Important Notes

- **Two LLM roles.** Every judge-based eval has an **SUT** (the model being graded) and a **Judge** (the model grading it) — often the same alias, conceptually distinct. Keep them separate in every recommendation and every scaffolded harness; conflating them is the #1 source of developer confusion.
- **Verifiability before everything.** The single most common mistake is using a judge where a parser would do. The matrix enforces deterministic-first; honor it.
- **The honest "no" is a feature.** "Don't build an automated eval — here's the human-review checklist" and "deterministic-only, skip the judge" are first-class outcomes, not failures of the skill.
- **v1 scope:** scaffolds DeepEval, deterministic-vitest, deterministic-pytest, and human-review-checklist. Promptfoo and Inspect AI are *recommended when they fit* but handed off rather than scaffolded — say so explicitly when recommending them.
