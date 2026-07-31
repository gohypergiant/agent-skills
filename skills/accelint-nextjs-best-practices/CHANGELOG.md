# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.2] - 2026-07-31
### Changed
- Added explicit Pages Router adaptation guidance so the body matches the skill description and existing Pages Router eval coverage.
- Added task-shape triage guidance to make artifact loading more consistent across targeted fixes, broad audits, route-handler reviews, and unclear diagnoses.
- Added a verification rule for version-sensitive Next.js guidance so agents consult current official docs before making uncertain framework claims.
- Added explicit route-handler review checks for header forwarding, authenticated caching, and memory-aware response patterns to better match existing eval scenarios.
- Tightened prose in `SKILL.md`, `AGENTS.md`, `references/quick-checklist.md`, and `scripts/README.md` without changing frontmatter behavior.

## [1.1.1] - 2026-07-30
### Changed
- Tightened the skill description to improve activation coverage for Next.js-specific work.
- Clarified the recommended loading order across `AGENTS.md`, `references/quick-checklist.md`, detailed references, and `scripts/README.md`.
- Refined README maintenance guidance so agents know which artifact to consult for overview, triage, detailed rules, and heuristics.

## [1.1.0] - 2026-01-26
### Added
- Initial published version of the Next.js best practices skill and supporting artifacts.
