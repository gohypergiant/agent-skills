# Changelog

## [1.2.2] - 2026-07-31

### Changed
- Calibrated top-level `SKILL.md` guidance to remove an overstated claim about destructured render queries and to soften a few rigid prose patterns without changing the intended React Testing Library defaults
  - Rationale: Static audit evidence showed the previous wording was stronger than the repository evidence supported, especially around the `screen` vs destructured-query recommendation
- Added two targeted evals in `evals/evals.json` for calibrated `screen` guidance and proportional audit-vs-fix behavior
  - Rationale: Direct repository inspection showed these weak spots were not explicitly covered by the existing eval set
- Tightened behavior-preserving prose in `SKILL.md` and `AGENTS.md` while leaving frontmatter behavior unchanged during the prose-rewrite stage
  - Rationale: Stage 4 prose audit found scanability and local clarity improvements were available without changing trigger coverage or workflow semantics

### Version
- Bumped `metadata.version` to 1.2.2 to reflect a patch-level, evidence-backed refinement

## [1.2.1] - 2026-07-30

### Changed
- Tightened internal skill prose in `SKILL.md` for clearer loading rules, more consistent terminology, and cleaner note wording without changing behavior
  - Rationale: Makes the progressive-disclosure workflow easier to follow and reduces avoidable ambiguity in artifact-local guidance

### Version
- Bumped `metadata.version` to 1.2.1 to reflect a safe prose-only refinement

## [1.2.0] - 2026-07-30

### Changed
- Refined the skill description to trigger more reliably on React Testing Library review, rewrite, and audit work while preserving the same guidance scope
  - Rationale: Adds explicit RTL APIs, file patterns, scoped-query coverage, and anti-pattern language that better match the default eval set
- Clarified boundaries so the skill does not over-trigger on non-React unit tests or Playwright end-to-end testing
  - Rationale: Improves precision for boundary cases without narrowing intended React Testing Library behavior

### Version
- Bumped `metadata.version` to 1.2.0 to reflect a localized description optimization

## [1.1.0] - 2026-07-30

### Changed
- Tightened the skill description with broader file-pattern and API triggers, plus explicit query-variant coverage
  - Rationale: Improves activation accuracy for audits and common RTL patterns such as `within()` and `waitForElementToBeRemoved`
- Cleaned up internal numbering and sharpened the closing notes for clearer, lower-ambiguity guidance
  - Rationale: Reduces avoidable confusion for maintainers without changing intended behavior

### Version
- Bumped `metadata.version` to 1.1.0 to reflect a safe, localized quality refinement

## [1.0.0] - 2026-07-30

### Added
- Initial changelog created to align version tracking with existing `SKILL.md` metadata version
  - Rationale: Repository conventions require each skill to keep a changelog aligned with `metadata.version`; this skill was missing `CHANGELOG.md`

### Version
- Established changelog at version 1.0.0 to match `SKILL.md`
