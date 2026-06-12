# Changelog

All notable changes to the `accelint-eval-architect` skill are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), semantic versioning.

## [1.2.1] - 2026-06-12

Bug-fix release for the findings of the 2026-06-12 four-agent audit (critical +
mechanical defects only; structural improvements land in 1.3.0).

### Fixed
- **deepeval structural metric template imported a nonexistent module**
  (`from metrics._json_extraction import …` — `metrics/` has no `__init__.py`,
  so every scaffold raised ModuleNotFoundError on first run). Now imports from
  the evals root, which conftest puts on sys.path.
- **RAG faithfulness template used the Ragas 0.1 API under a `ragas>=0.2` pin**
  (`"contexts"` column, lowercase `faithfulness` singleton, scalar result
  access). Rewritten for 0.2+: `SingleTurnSample` / class metric /
  `single_turn_score`; judge wiring snippet (LangchainLLMWrapper) added to
  `references/frameworks/ragas.md`; rag pyproject swaps `datasets` for
  `langchain-openai` in the live layer.
- **GEval template passed both `criteria` and `evaluation_steps`** — they are
  mutually exclusive in DeepEval. Kept explicit `evaluation_steps` (cheaper:
  skips the step-generation judge call) with the grounding rule folded in.
- **deepeval conftest demanded judge + SUT env on every run** via
  `pytest_configure`, so regression-only/deterministic runs failed without a
  judge — contradicting the README's "deterministic runs free" contract.
  Validation moved into the `judge` / `sut` fixtures that actually need it.
- **`scaffold_eval._git_check` printed a false "OK" outside a git repo**
  (nonzero `git status` exit was ignored) and its substring `.env` filter
  silently excluded `.env.example` — which is source — from the don't-lose-it
  warning. Now checks the return code and matches `.env` by exact filename.
- **`audit_checks.py`**: regression tests in `tests/` subdirectories were
  invisible (`glob` → `rglob`); the sentinel regex missed `0.00` and annotated
  defaults (`threshold: float = 0.0`); `__pycache__/` was demanded of Node-only
  harnesses (now Python-conditional).
- **`bootstrap_goldset.py`**: text-only corpora produced filesystem-order
  (non-reproducible) sampling — now sorted; `--out` silently overwrote an
  existing (possibly human-curated) draft — now refuses without `--force`;
  missing `--out` parent directories now created.
- **RAG demo `corpus_hash: "demo-corpus-v1"` guaranteed a confusing day-one
  drift failure** once `corpus_path` was armed. The placeholder is now
  self-describing, the drift test detects placeholders and prints the exact
  command to record the real hash, and `corpus_hash.py` gained a CLI
  (`python corpus_hash.py <corpus_dir>`).
- **`recall_at_k` default threshold was 1.0**, contradicting the record-only
  calibration guidance — now 0.0 with the demo test gating explicitly.
- **pyyaml/pytest were undeclared test dependencies** of the skill's own
  scripts — declared in `scripts/tests/requirements.txt`.

### Added
- Regression tests for every fix above (23 → 31 tests), per the skill's own
  "every metric needs a regression test that proves it can fail" rule.

### Version
- Bumped from 1.2.0 → 1.2.1.

## [1.2.0] - 2026-06-09

### Added
- **First test suite for the skill's own automation** (`scripts/tests/`, 23
  tests) — closes the skill's own "every metric needs a regression test" gap
  for `scaffold_eval.py`, `bootstrap_goldset.py`, and the two new ops scripts.
  Includes a lockstep test proving the bootstrap corpus hash and the RAG
  template's `corpus_hash.py` agree.
- `scaffold_eval.py --layer` — add-only layering into an existing eval (never
  overwrites; reports conflicts to merge manually) and `--dest` for a separated
  layer dir. Unblocks the hybrid path, which was the most common recommendation
  but unscaffoldable incrementally.
- Required-placeholder fail-fast per framework (`REQUIRED_KEYS`) — a forgotten
  `--set` key now errors before any file is written.
- `bootstrap_goldset.py`: content-based corpus hash (same-size edits now
  detected), PDF corpora via optional pypdf (with actionable guidance when
  missing), and `corpus_path` recorded in the draft for the drift test.
- RAG template: `test_corpus_drift` (armed by `corpus_path` in goldset.yaml;
  skips until set), `refusal_on_unknown` deterministic metric + captured
  answers + regression test — the adversarial gold entries are no longer
  shipped-but-unused.
- `scripts/suggest_thresholds.py` — calibrated-threshold suggestions from
  `results/run-*.json` (mean−2σ judge-style, min−margin deterministic-style),
  with low-confidence flagging.
- `scripts/audit_checks.py` — mechanical audit checks (#2 regression-per-metric,
  #3 sentinel thresholds, #7 untracked source, #8 gitignore coverage); exit 1
  on HIGH findings.
- **EXTEND mode** — procedure for adding metrics to an existing eval (the gap
  between SCAFFOLD's refuse-non-empty and AUDIT's read-only).

### Changed
- CRLF normalized to LF on template copy + skill `.gitattributes` — prevents
  Windows-mount checkouts leaking CRLF into scaffolded target repos.
- Detector carve-out on the walking-skeleton rule: detector/review skills ship
  recall + false-positive-resistance as an inseparable pair.
- `framework-matrix.md` notes the deepeval template IS the hybrid starter for
  Python skill targets; `calibration.md`/`audit.md` reference the new scripts.
- Template version pins documented as a maintenance item (Important Notes).

### Rationale
- **Self-dogfooding**: the meta-skill demanded regression tests of every metric
  while its own load-bearing scripts had none.
- **Hybrid was recommended constantly but couldn't be scaffolded** onto an
  existing harness; `--layer` closes the gap honestly (skip + report, never
  auto-merge).
- **The drift tripwire was documented but unimplemented**, and the old
  name+size hash missed same-size content edits.

### Version
- Bumped from 1.1 → 1.2.

## [1.1.0] - 2026-06-09

### Added
- **Tool-repo target type.** The skill can now assess/audit/scaffold evals for
  standalone tool repos (not just skills in this repo), starting with RAG /
  retrieval pipelines like a docs-parser → chatbot.
- `target_type: skill | tool-repo` detection in Mode 0; per-target assessment
  paths. Tool-repo assessment is **interactive** — reads README/manifest/entry
  points, then interviews the developer for pipeline stages + invocation.
- `references/tool-repo-assessment.md` — comprehension flow + tool-repo eval profile.
- `references/pipeline-decomposition.md` — stage taxonomy (ingest/retrieve/
  generate/e2e) + per-stage metric matrix; verifiability gate runs per stage.
- `references/gold-set.md` — RAG gold-set bootstrap, curation, circularity
  warning, corpus-hash drift detection.
- `references/frameworks/ragas.md` — promoted Ragas from hand-off to scaffoldable;
  expert gotchas.
- `assets/templates/rag/` — walking-skeleton RAG eval: gold set, `section_coverage`
  (ingest) + `recall@k` (retrieve) deterministic metrics with regression tests,
  a gated Ragas faithfulness metric, offline scoring of captured retrieval output,
  and a pluggable SUT-invocation adapter.
- `scripts/bootstrap_goldset.py` — stratified-samples a corpus and LLM-drafts
  Q/A/passage triples + adversarial unanswerable questions, with a mandatory
  human-curation guardrail (never auto-trusted).

### Changed
- `scripts/scaffold_eval.py` accepts the `rag` framework template.
- Description + scope note extended to claim tool/RAG triggers and the
  per-case Ragas-vs-DeepEval answer-layer recommendation.

### Rationale
- **Two of three RAG stages are deterministic** (ingest, retrieve), so the
  existing deterministic-first ethos applies cleanly; only answer-generation is
  a judge slice.
- **Gold sets are human-curated** because an un-curated gold set graded by an
  auto-generated judge is circular and meaningless.
- **Interactive comprehension** because a skill cannot reliably reverse-engineer
  an arbitrary pipeline from files alone.

### Version
- Bumped from 1.0 → 1.1.

## [1.0.0] - 2026-06-08

### Added
- Initial skill: a meta-tool that assesses a target skill, recommends an eval
  framework (or recommends none), and scaffolds the integration.
- Three modes: ASSESS (read + classify + recommend), SCAFFOLD (walking-skeleton
  build), AUDIT (decay check on an existing eval).
- `references/assessment.md` — target-skill reading procedure + eval-profile
  JSON schema + verifiability gate.
- `references/framework-matrix.md` — deterministic-first decision tree, per-
  framework when/why, also-ran reasoning, cost estimates, four worked examples.
- `references/test-design.md` — persona×scenario derivation + output-shape→
  metric mapping + regression-test designs.
- `references/calibration.md` — baseline→threshold workflow (record-only first).
- `references/audit.md` — existing-eval decay checklist.
- `references/frameworks/{deepeval,deterministic-vitest,deterministic-pytest,human-review}.md`
  — expert-only adoption gotchas per supported path.
- `assets/templates/{deepeval,deterministic-vitest,deterministic-pytest,human-review}/`
  — distilled walking-skeleton starters (one metric, one pass test, one
  regression test each).
- `scripts/scaffold_eval.py` — mechanical copy + placeholder substitution +
  git-tracking check.

### Rationale
- **Deterministic-first ordering**: derived from the `accelint-ac-to-playwright`
  eval build, where LLM judges produced false positives that closed-list
  deterministic checks did not. A judge is only reachable after determinism is
  ruled insufficient.
- **Walking-skeleton, not maximalist**: the reference impl accumulated a large
  follow-up backlog; an unmaintained comprehensive eval is worth less than a
  maintained skeleton.
- **Generate goldens, never hand-write**: the reference impl's hand-authored
  `PERFECT-AC.plan.json` rotted against the schema and failed a metric for
  months.
- **Commit-before-run**: the reference impl's eval source was orphaned and
  required bytecode recovery; the scaffold workflow now enforces git tracking.

### Version
- Initial release at 1.0.0.
