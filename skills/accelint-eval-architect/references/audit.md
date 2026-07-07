# Audit — finding decay in an existing eval

Triggered when the target already has an `evals/` dir, or the user asks "is my
eval any good." Inventory the harness, run the decay checklist, rank findings by
severity. **Do not auto-fix without approval** — surface, then propose.

## Inventory first
Read the existing harness: framework, metric files, fixtures, goldens,
thresholds, the runner wiring, and the results artifacts (if any). Build the same
eval profile you would for a new skill, plus the existing-eval facts.

## Decay checklist

Each row is a real failure mode observed in the reference impl's own follow-up
backlog. Check every one.

| # | Check | Severity if broken | Symptom |
|---|---|---|---|
| 1 | Goldens match the current schema | **high** | a hand-authored golden uses field names the schema renamed; a correctness metric fails on correct output (the `PERFECT-AC.plan.json` bug) |
| 2 | Every metric has a regression test that can fail | **high** | a metric that always passes — silently measures nothing |
| 3 | Thresholds are calibrated, not sentinel/record-only | **medium** | metrics scored but never gating; "green" means nothing |
| 4 | Fixtures reference files that still exist | **medium** | a renamed/split fixture leaves a dangling path (the `MIXED-AC` → `MIXED-AC-{1..5}` split) |
| 5 | Every persona/scenario is covered by the full metric set | **medium** | metrics added later wired into new scenarios only; old scenarios under-measured |
| 6 | No judge rubric penalizes correct behavior | **high** | rubric assumes an output that correct behavior doesn't produce (penalizing a correct halt-on-bad-input as "incomplete") |
| 7 | All eval source is git-tracked | **high** | source sitting next to gitignored `results/`/`.venv/`; one `git clean` from gone |
| 8 | `results/`, `.venv/`, `__pycache__/` ARE gitignored | low | run artifacts and venvs committed as noise |
| 9 | Runner wired into the build (`npm`/`pyproject` script) | low | "how do I run this" undocumented; bit-rots |
| 10 | Cost-gating present (judge metrics opt-in) | medium | every run bills the judge; CI cost creeps |
| 11 | Thresholds valid for current model aliases | **high** | thresholds calibrated against old judge/SUT models; silent model upgrade invalidates them |
| 12 | Thresholds valid for current rubric | **high** | rubric edit changed the measurement; old threshold is meaningless |

## How to detect each (concrete)

- **#1 goldens vs schema:** re-generate a golden from the live schema/validator and diff against the committed one. Any structural diff = drift.
- **#2 toothless metric:** for each metric, check a `*regression*` test exists and that it asserts a *below-threshold* score on planted-broken input. Missing or only-pass-asserting = toothless.
- **#3 sentinel thresholds:** grep metric thresholds for `0.0`, `record-only`, or commented-out gates.
- **#4 dangling fixtures:** resolve every fixture path the tests reference; flag misses.
- **#6 rubric vs correct behavior:** read each judge criteria block; ask "does correct behavior on the hardest scenario actually satisfy this rubric?" The reference impl's `plan_adherence` penalized a correct halt — that class of bug.
- **#7 untracked source:** `git status --porcelain evals/` — any untracked `.py`/`.ts` source (not results) is the orphan risk.

## Detection notes (continued)

- **#11 stale model aliases:** compare recorded `judge_model_alias`/`sut_model_id` from latest `results/run-*.json` against current env (`JUDGE_MODEL_ALIAS`/`SUT_MODEL_ID`). Mismatch while any threshold is non-record-only → HIGH.
- **#12 stale rubric hash:** metric files with judge rubrics declare `RUBRIC_HASH = sha256(evaluation_steps)[:16]`; results artifacts record it per metric. Recompute from current metric file and diff against latest run → mismatch = HIGH.

**Mechanical subset:** checks #2, #3, #7, #8, #11, #12 need no judgment — run
`scripts/audit_checks.py <evals-dir>` to execute them consistently (exit 1 on
any HIGH finding). The judgment checks (#1, #5, #6) remain agent work.

## Output
Rank findings high → low. For each: the check, the evidence (the diff, the
missing test, the dangling path), and a proposed fix. Offer to apply fixes one at
a time on approval. Never bulk-rewrite an existing eval unprompted.
