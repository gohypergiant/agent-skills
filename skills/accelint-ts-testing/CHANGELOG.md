# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.2] - 2026-07-31

### Changed
- Tightened `references/quick-start.md` so the matcher guidance no longer mislabels `toBe` as a loose assertion and the improved example models flatter test organization.
- Clarified `README.md` intro wording so `accelint-ts-testing` is explicitly framed as the repo's Vitest-focused TypeScript testing skill.
- Tightened behavior-bearing prose in `SKILL.md` and corrected a duplicated numbered step in `AGENTS.md` during the strict prose pass.

## [3.1.1] - 2026-07-31

### Added
- Added `evals/evals.json` with 32 cases covering Vitest authoring, async testing, strict assertions, mocking boundaries, property-based testing, reference-loading behavior, and near-miss triggers.
- Added run-state audit reports under `runs/accelint-ts-testing/` for audit, eval coverage, description updates, and prose review.

### Changed
- Tightened `SKILL.md` description to improve Vitest-focused trigger accuracy and reduce false positives for Jest, Playwright, and documentation-only requests.
- Clarified workflow wording in `SKILL.md` around selective reference loading, audit behavior, and required test-file type-checking intent.
- Fixed the `README.md` Vitest config example and aligned README coverage bullets with the actual skill guidance.
- Tightened prose in `AGENTS.md`, `README.md`, and `references/quick-start.md` while preserving behavior and guardrails.
