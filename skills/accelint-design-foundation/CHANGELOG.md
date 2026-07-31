# Changelog

All notable changes to this skill will be documented in this file.

The format is based on Keep a Changelog, and this project uses Semantic Versioning.

## [1.1.1] - 2026-07-31

### Changed
- Tightened `SKILL.md` to reduce duplicated reference material, clarify package source hierarchy, and route setup, token, spacing, and troubleshooting detail to the existing reference files.
- Aligned variant guidance so the package consistently prefers `data-*` attributes in markup with `@variant` blocks in CSS modules.
- Corrected documentation drift in `README.md` and `AGENTS.md` so the semantic spacing model is consistently described as an eight-step scale including `oversized`.

## [1.1.0] - 2026-07-30

### Changed
- Tightened the skill description to trigger more reliably for design foundation styling, migration, setup, and troubleshooting tasks.
- Added a concise responsibility section and response pattern so the skill addresses setup failures before token-level styling advice.
- Fixed the CSS module example to include the required `@reference` directive.

### Added
- Added a default `evals/evals.json` with realistic styling, migration, variant, spacing, and troubleshooting prompts.

## [1.0.0] - 2026-07-30

### Added
- Initial version of the accelint-design-foundation skill.
