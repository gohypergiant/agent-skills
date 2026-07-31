# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-07-31

### Added
- Added `evals/evals.json` with 22 cases covering new-page generation, stale-doc refreshes, SHA-aware manual-edit preservation, validation behavior, docs-path discovery, and trigger boundaries.
- Added run-state audit reports under `runs/generate-docs/` for audit, eval coverage, description updates, and prose review.

### Changed
- Tightened `SKILL.md` trigger wording to better target published Fumadocs skill-doc workflows under `docs/content/docs/`.
- Added top-level guardrails and preflight questions for generate, refresh, and validate modes.
- Reduced duplication in `SKILL.md` by removing the late repeated preflight section and tightening workflow prose.
- Clarified non-triggers so README work, `SKILL.md` prose edits, architecture docs, and generic markdown housekeeping do not mis-activate the skill.
