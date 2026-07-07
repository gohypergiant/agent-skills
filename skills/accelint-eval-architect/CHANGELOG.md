# Changelog

All notable changes to the `accelint-eval-architect` skill are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), semantic versioning.

## [1.4.1] - 2026-07-07

Verification release: v1.4.0 shipped with its suite red (its commit message
admits pytest was skipped) and, as an executed end-to-end check proved, the
tripwire's primary scenario — rubric edited, literal forgotten — passed
silently because the promised self-check test was never shipped.

### Fixed
- **Suite was red at v1.4.0**: `test_stale_rubric_hash_mismatch_high_finding`
  used the non-hex fixture literal `xyz987fedcba6543`, which the extractor
  regex (`[a-f0-9]{16}`) can never match — the HIGH branch was untested and
  the test failed. Fixture now uses valid hex (`9876fedcba054321`).
- **"Recorded but unverifiable" branch was missing from check #12**: an
  artifact recording a `rubric_hash` whose source file has no valid literal
  (missing file, computed expression, malformed or placeholder literal)
  produced ZERO findings — the tripwire died silently in exactly the case it
  exists for. Now fires MEDIUM. The old
  `test_computed_rubric_hash_pattern_fails` asserted the zero-findings
  behavior (the bug enshrined as a test) and is replaced by
  `test_computed_rubric_hash_fires_unverifiable_medium`.
- **The self-check test v1.4.0 claimed to ship did not exist** (the GEval
  template comment named `test_example_regression.py` as containing it; grep
  across both template test dirs found nothing). End-to-end proof of the
  consequence: mutate one rubric word, leave the literal → audit silent, no
  test fails. Now shipped in both templates:
  - deepeval: `test_rubric_hash_literal_matches_steps` — literal must equal
    sha256[:16] of `_EVALUATION_STEPS` and must not be the placeholder. Fails
    on a fresh scaffold by design (same philosophy as the gold-set
    `verified: false` refusal); the failure message prints the compute
    one-liner. Verified: fails on placeholder → passes with computed literal →
    fails again after a one-word rubric edit.
  - rag: `test_rubric_hash_literal_matches_ragas_version` — Ragas owns the
    faithfulness rubric, so the literal fingerprints the INSTALLED ragas
    version (an upgrade IS a rubric edit). Skips while ragas is absent (the
    default offline suite, where the metric can't run anyway).
- **`RUBRIC_HASH` was entirely absent from the rag faithfulness metric** while
  the rag conftest docstring told users to record an undefined name — literal
  added, docstring import fixed.
- **Placeholder loophole in check #12**: `"0000000000000000"` is valid hex, so
  a run artifact recording the placeholder "matched" it silently. The audit
  now treats the placeholder as unverifiable → MEDIUM.
- **Fresh deepeval scaffold failed its own audit** (HIGH regression-per-metric:
  `example_geval_metric.py` referenced by no regression test). The new
  self-check lives in `test_example_regression.py` and references the metric —
  a fresh scaffold now audits 0 HIGH (verified).

### Verified (executed, not structural)
- Skill suite: 48 passed (was 1 failed / 44 passed at v1.4.0).
- End-to-end on a real scaffold: aligned state → 0 stale-calibration findings;
  literal-vs-artifact mismatch → #12 HIGH naming both hashes; judge-alias
  change → #11 HIGH naming both aliases; rubric-word mutation → self-check
  fails (previously silent).

### Version
- Bumped from 1.4.0 → 1.4.1.

## [1.4.0] - 2026-07-07

### Added
- **Recalibration tripwire (audit checks #11 and #12)** — `audit_checks.py` now
  detects stale thresholds from silent model upgrades or rubric edits. Check #11
  compares recorded `judge_model_alias`/`sut_model_id` against current env; check
  #12 compares rubric hashes (sha256[:16] of `evaluation_steps`, stored as RUBRIC_HASH
  literal with self-check test). Mismatch with any committed threshold → HIGH finding.
  Closes the most common silent production failure (thresholds calibrated against old
  models remain green while measuring nothing).
- **Shared `scripts/_results.py` loader with schema versioning** — extracts and
  reuses `load_runs()` from `suggest_thresholds.py`, extending it to handle
  `schema_version` (v1 implicit, v2 adds rubric_hash/rubric_source tracking). Readers
  treat missing `schema_version` as v1; newer schemas tolerated with a warning.
- **RAG reporter** (`assets/templates/rag/_reporter.py.template`) — ports the
  deepeval `ScorecardCollector` pattern into the RAG template so RAG harnesses
  produce `results/run-*.json` artifacts for calibration and audit checks. Field
  contract matches deepeval reporter (schema_version: 2).
- **RUBRIC_HASH tracking** — GEval metric templates now include RUBRIC_HASH as a
  literal constant (placeholder "0000000000000000") with self-check regression test.
  Reporters accept optional `rubric_hash` and `rubric_source` params for judge metrics;
  `audit_checks.py` #12 uses exact join on rubric_source to detect hash mismatches.

### Changed
- **Schema version 2** — `_reporter.py.template` artifacts now stamp `schema_version: 2`.
  Adds per-metric `rubric_hash` and `rubric_source` fields for judge metrics (deterministic
  metrics omit both). Backward compatible: v1 readers ignore new fields, v2 readers
  default-to-v1 for old artifacts.
- `suggest_thresholds.py` now imports `load_runs()` from `_results.py` (DRY).

### References
- `references/calibration.md` — updated "Re-calibrate on model change" section to include
  rubric edit warning and tripwire documentation.
- `references/audit.md` — added checks #11 and #12 to decay checklist table with detection notes.

## [1.3.1] - 2026-06-12

Fixes from the post-1.3.0 verification re-audit (four fresh-eyes agents; one
empirically exercised the deepeval template against real DeepEval 4.0.5,
another ran the rag scaffold end-to-end offline).

### Fixed
- **GEval template restated a 0–1 score scale in `evaluation_steps`** — GEval's
  own prompt asks the judge for an integer 0–10 and normalizes by /10, so a
  literal judge emitted 0/1 → normalized 0.0/0.1 and the 0.8 threshold was
  unreachable: every live run failed spuriously. Scale sentence removed; the
  trap is documented in `references/frameworks/deepeval.md`.
- **`scaffold_eval` don't-lose-it check printed a false "OK" for RELATIVE
  `--target` paths** (pathspec `target/evals` + `cwd=target` made git look for
  `target/target/evals` — no match, empty output, "OK" over untracked source).
  Both paths now resolved before the git call.
- **`references/frameworks/deepeval.md` still instructed the pre-1.2.1 buggy
  layout** ("ship it in `metrics/_json_extraction.py`") — following the doc
  reintroduced the ModuleNotFoundError the template fixed. Now says evals root.
- **`audit_checks.py` could still lie four ways**: substring stem matching let
  `recall.py` ride free on a test referencing only `recall_at_k` (now
  word-boundary); metrics in subdirectories were never checked (now rglob);
  `tests/regression/*.py` layouts didn't count (now dir-name aware); object
  literal/dict thresholds (`{ threshold: 0.0 }`, `"threshold": 0.0`) escaped
  the sentinel regex (now matched). Path-segment (not substring) exclusions so
  `tests/test_results/` is no longer hidden.
- **A fresh rag scaffold failed its own audit** (faithfulness had no regression
  test — the gate at record-only literally could not fail). Added an offline
  stubbed-judge regression test proving the gate fails at a non-zero threshold;
  scaffold now self-audits clean (0 HIGH).
- **rag template never loaded `.env`** despite README's `cp .env.example .env`
  and a declared python-dotenv dep — conftest now calls `load_dotenv()`
  (guarded import); the ragas.md wiring snippet gained its missing `import os`.
- **`LiteLLMModel(api_base=…)` is a deprecated alias in deepeval 4.x** (warns
  on every judge build, slated for removal) → `base_url=` in the judge template
  and the reference snippet.
- **deterministic-pytest pyproject was missed in the 1.3.0 floors conversion**
  (still `pytest==8.3.4`/`pyyaml==6.0.2`) — converted.
- **Misleading "free"/`-m live` claims**: deepeval README/conftest now say the
  default run makes no JUDGE calls but SUT-invoking tests still need SUT env
  and bill SUT tokens; both READMEs document that `-m live` runs ONLY the
  judge tests and `-m ""` runs everything.
- **Armed drift tripwire could silently disarm**: a `corpus_path` that stopped
  resolving (typo/moved dir) degraded to skip-forever; with a real hash
  recorded it now fails loudly.
- Smaller: `--dest` escaping the target rejected; `--out` pointing at a
  directory exits cleanly (was a traceback); empty gold set (`--n 0
  --adversarial 0`) warns; `suggest_thresholds` skips non-dict metric entries
  and excludes booleans from score distributions (True read as 1.00); refusal
  markers gained "don't know"/"do not know"; dead deps removed (pyyaml from
  deepeval, litellm from rag); README gitignore list and `.env.example`
  key-sharing note aligned with reality; gold-set.md shape example now shows
  `verified`/`corpus_path`/16-hex hash; pipeline-decomposition walking-skeleton
  list matches the actual template; "an verified" typo.

### Added
- `tests/test_faithfulness_regression.py.template` (rag) — offline stubbed-judge
  gate regression.
- `README.md` stub for the human-review template (step 10 promises one in every
  scaffold) and the `--layer` extension path in its DESIGN.md.
- Regression tests for every script fix above (31 → 37 tests).
- deepeval.md: "Never restate a score scale in `evaluation_steps`" gotcha.

### Version
- Bumped from 1.3.0 → 1.3.1.

## [1.3.0] - 2026-06-12

Structural improvements from the 2026-06-12 audit (the bug fixes landed in 1.2.1).

### Changed
- **Description rewritten for honesty + symptom triggering.** It claimed "set
  up Promptfoo/Inspect" while the skill only recommends-and-hands-off those —
  now stated accurately. Added symptom-language triggers ("my bot is
  hallucinating", "answers got worse after a prompt/model change", "CI for
  prompts") because users describe pain, not framework names.
  - Rationale: undertriggering combat must not come at the cost of claiming
    capabilities the skill doesn't have.
- **Mode-routing phrases live in ONE place.** The Modes list duplicated the
  "Triggered by …" phrases that Mode 0's routing table owns; the list is now
  one-liners and Mode 0 gained the missing SCAFFOLD row.
- **"deterministic-retrieval" no longer reads as a scaffold key.** SKILL.md,
  AGENTS.md, and framework-matrix.md named it alongside real scaffold keys, but
  it is the deterministic layer *inside* the `rag` template
  (`--framework rag`) — all three now say so explicitly.
- **Template dependency floors instead of hard pins** (`litellm>=1.55`,
  `pytest>=8.3`, `pyyaml>=6.0`). Hard pins shipped stale; reproducibility
  guidance is now "commit the lockfile". Important Notes updated to match.
- **Reporter renders every dimension.** `_reporter.py` only rendered
  `DIMENSION_ORDER` dims, silently hiding metrics recorded under any other
  name; unknown dimensions now append after the preferred order, and the
  never-used `efficiency` slot is dropped.
- **Deterministic framework refs trimmed of generic code** (~45 lines):
  the vitest recall-metric and regression-test code blocks and the pytest
  subprocess block compressed to their expert-only rules (empty-planted-set
  scores 1.0, reasons must name misses, call the *built* validator path,
  tolerant JSON extraction, subprocess timeout) — Claude can write the
  surrounding code; only the rules are knowledge.
- **Smoke/full tier sizes defined once** in gold-set.md;
  pipeline-decomposition.md now points there instead of restating numbers.

### Added
- **DESIGN.md stubs in the deterministic-pytest, deterministic-vitest, and
  human-review templates** — SCAFFOLD step 10 promises a DESIGN.md with
  pre-filled "Known follow-ups" in every scaffold, but only deepeval and rag
  shipped one. Each states the why-no-judge rationale and the `--layer`
  extension path; layouts in the framework refs updated.

### Version
- Bumped from 1.2.1 → 1.3.0.

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
