# Eval Architect — Agent Reference

Quick-reference for the `accelint-eval-architect` skill. Load specific
references only when the workflow step in `SKILL.md` names them.

## Target types
- **skill** — a skill in this repo (`SKILL.md` at root). Assessment reads files.
- **tool-repo** — a standalone tool repo, esp. a RAG/retrieval pipeline. Assessment reads what it can, then **interviews the developer** for stages + invocation.

## Modes (one-line each)
- **ASSESS** — read/interview the target → eval profile → verifiability gate (per stage for pipelines) → framework recommendation. Read-only.
- **SCAFFOLD** — copy a framework starter, generate the walking skeleton, wire the build, hand off calibration.
- **AUDIT** — run the decay checklist against an existing `evals/` dir.
- **EXTEND** — add metrics/fixtures to an existing eval; `scaffold_eval.py --layer` pulls in another template's non-conflicting files.

## Reference table of contents
| Reference | Load when | Holds |
|---|---|---|
| [references/assessment.md](references/assessment.md) | ASSESS, target_type=skill | what to read in a target skill; the eval-profile JSON schema |
| [references/tool-repo-assessment.md](references/tool-repo-assessment.md) | ASSESS, target_type=tool-repo | repo comprehension interview; tool-repo eval profile |
| [references/pipeline-decomposition.md](references/pipeline-decomposition.md) | pipeline targets | stage taxonomy; per-stage metric matrix; per-stage verifiability gate |
| [references/gold-set.md](references/gold-set.md) | RAG targets | gold-set bootstrap, curation, circularity warning, corpus-hash drift |
| [references/framework-matrix.md](references/framework-matrix.md) | ASSESS step 3–4 | verifiability gate; decision tree; per-framework when/why; cost; worked examples; recommendation-summary format |
| [references/test-design.md](references/test-design.md) | ASSESS step 5 (skill) | persona×scenario derivation; output-shape→metric mapping; regression-test designs |
| [references/calibration.md](references/calibration.md) | SCAFFOLD step 12 | baseline→threshold workflow |
| [references/audit.md](references/audit.md) | AUDIT | decay checklist + severity ranking |
| [references/frameworks/deepeval.md](references/frameworks/deepeval.md) | scaffolding DeepEval | Bedrock `openai/` prefix; GEval 4.x kwarg forwarding; fenced-JSON extraction; EXPECTED_OUTPUT placeholder; logprobs ERROR suppression |
| [references/frameworks/ragas.md](references/frameworks/ragas.md) | scaffolding a RAG answer layer | Ragas vs DeepEval; faithfulness/context-recall gotchas; gold-set wiring |
| [references/frameworks/deterministic-vitest.md](references/frameworks/deterministic-vitest.md) | scaffolding a Node deterministic harness | fixture layout; recall/precision tests; regression-test convention |
| [references/frameworks/deterministic-pytest.md](references/frameworks/deterministic-pytest.md) | scaffolding a Python deterministic harness | conftest fixtures; shelling to a validator CLI; regression tests |
| [references/frameworks/human-review.md](references/frameworks/human-review.md) | output is taste-based | when to refuse automation; the review-checklist template |

## Rules (one-line; full reasoning in SKILL.md "NEVER" section)
- Deterministic check before judge — always.
- Generate goldens from the live schema; never hand-write them.
- Thresholds start record-only; calibrate from a baseline before committing numbers.
- One fixture / one metric / one pass test / one regression test — skeleton, not suite.
- Every metric needs a regression test that proves it can fail.
- Derive persona×scenario from the skill; flat fixtures when single-mode.
- Commit eval source before the first run.
- Match harness toolchain to the target (vitest for Node, pytest for Python).
- Taste-based output → human-review checklist, not an LLM judge.
- Detectors ship recall + false-positive-resistance as a pair — either alone rewards degenerate behavior.
- Pipeline targets: run the verifiability gate per stage (ingest/retrieve are usually deterministic; only generate needs a judge).
- RAG gold sets are human-curated; never trust a bootstrap draft as-is.
- Tool-repo comprehension is interactive; confirm stages + invocation before recommending.

## Scripts
- `scripts/scaffold_eval.py` — copy a template; `--layer` add-only into an existing eval (reports conflicts); `--dest` alternate dirname; fails fast on missing required placeholders.
- `scripts/bootstrap_goldset.py` — draft a RAG gold set (content-based corpus hash; PDFs via optional pypdf; mandatory human curation).
- `scripts/suggest_thresholds.py` — suggest calibrated thresholds from `results/run-*.json` with evidence.
- `scripts/audit_checks.py` — mechanical audit checks (#2/#3/#7/#8); pairs with references/audit.md.

## Scope
Scaffolds: DeepEval, Ragas (RAG answer layer), deterministic-vitest, deterministic-pytest, deterministic-retrieval (ingest+retrieve), human-review.
Tool-repo support: RAG / retrieval pipelines.
Recommends-but-hands-off (no scaffold yet): Promptfoo, Inspect AI, non-RAG tool types.
