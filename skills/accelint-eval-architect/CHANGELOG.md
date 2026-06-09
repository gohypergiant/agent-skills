# Changelog

All notable changes to the `accelint-eval-architect` skill are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), semantic versioning.

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
