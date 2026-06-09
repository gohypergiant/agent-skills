# Eval Architect — Agent Reference

Quick-reference for the `accelint-eval-architect` skill. Load specific
references only when the workflow step in `SKILL.md` names them.

## Modes (one-line each)
- **ASSESS** — read a target skill → eval profile → verifiability gate → framework recommendation. Read-only.
- **SCAFFOLD** — copy a framework starter, generate the walking skeleton, wire the build, hand off calibration.
- **AUDIT** — run the decay checklist against an existing `evals/` dir.

## Reference table of contents
| Reference | Load when | Holds |
|---|---|---|
| [references/assessment.md](references/assessment.md) | ASSESS step 1–2 | what to read in a target skill; the eval-profile JSON schema |
| [references/framework-matrix.md](references/framework-matrix.md) | ASSESS step 3–4 | verifiability gate; decision tree; per-framework when/why; cost; worked examples; recommendation-summary format |
| [references/test-design.md](references/test-design.md) | ASSESS step 5 | persona×scenario derivation; output-shape→metric mapping; regression-test designs |
| [references/calibration.md](references/calibration.md) | SCAFFOLD step 12 | baseline→threshold workflow |
| [references/audit.md](references/audit.md) | AUDIT | decay checklist + severity ranking |
| [references/frameworks/deepeval.md](references/frameworks/deepeval.md) | scaffolding DeepEval | Bedrock `openai/` prefix; GEval 4.x kwarg forwarding; fenced-JSON extraction; EXPECTED_OUTPUT placeholder; logprobs ERROR suppression |
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

## v1 scope
Scaffolds: DeepEval, deterministic-vitest, deterministic-pytest, human-review.
Recommends-but-hands-off (no scaffold yet): Promptfoo, Inspect AI.
