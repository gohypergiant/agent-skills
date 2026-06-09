# Changelog

All notable changes to the `accelint-eval-architect` skill are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), semantic versioning.

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
