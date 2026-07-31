# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-07-31

### Added
- Added `evals/evals.json` with 20 coverage cases spanning JSDoc completeness, comment-quality rules, workflow behavior, and trigger boundaries.
- Added run-state audit reports under `runs/accelint-ts-documentation/` for audit, eval coverage, description updates, and prose review.

### Changed
- Tightened `SKILL.md` activation wording and clarified documentation-focused trigger boundaries.
- Added explicit documentation-work guardrails and pre-edit judgment checks to `SKILL.md`.
- Improved workflow clarity around reference loading, fallback handling, and formal audit reporting.
- Tightened prose across `AGENTS.md`, `README.md`, `references/jsdoc.md`, `references/comments.md`, and `assets/output-report-template.md`.
- Fixed README reference drift so support docs match the current `references/` structure.
