# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-07-31

### Changed
- Replaced the canonical single-pass example in `references/reduce-looping.md` with a truly allocation-aware loop so the “correct” pattern no longer relies on per-item array spreading.
- Fixed a broken Markdown code fence in `references/memoization.md` so the repeated-function-calls example renders cleanly.
- Reworded `assets/output-report-template.md` to avoid presenting unmeasured code as a proven hot path while still preserving broad static audit guidance.
- Tightened prose in `SKILL.md`, `AGENTS.md`, `README.md`, `references/batching.md`, and `references/cache-storage-api.md` without changing frontmatter or trigger boundaries.

## [1.1.1] - 2026-07-31

### Added
- Added `evals/evals.json` with 24 cases covering profiler-backed audits, static-review hypothesis framing, optimization categories, verification guidance, and trigger boundaries.
- Added run-state audit reports under `runs/accelint-ts-performance/` for audit, eval coverage, description updates, and prose review.

### Changed
- Tightened `SKILL.md` to prefer profiler-backed evidence, distinguish measured bottlenecks from static opportunities, and clarify performance-only trigger boundaries.
- Improved progressive-disclosure guidance so only relevant references are loaded for the optimization category at hand.
- Tightened `AGENTS.md`, `README.md`, report-template instructions, and performance reference prose for clarity and consistency.
- Softened inline-comment guidance so reports or PR notes are preferred when code comments would add noise.
