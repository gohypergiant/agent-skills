# Changelog

All notable changes to the epistemic-mapper skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-08-25

### Fixed
- **Evidence file paths are now relative to project root instead of absolute paths**. The `merge_epistemic_map.py` script automatically converts absolute paths to relative paths when processing findings. This makes EPISTEMIC-MAP.md more portable and avoids exposing user-specific directory structures in evidence citations.
- Updated SKILL.md to clarify that subagents should provide file paths relative to the project root in evidence citations.

## [1.0.0] - Initial Release

### Added
- Initial release of epistemic-mapper skill
- Parallel subagent-based document and code scanning
- Four-quadrant knowledge classification (Facts, Questions, Assumptions, Risks)
- Evidence correlation and deduplication
- Category-based entry organization
- Support for CONFIRMED, INFERRED, and CONFLICTING confidence levels
- Automatic ID assignment and management
- Risk synthesis pass for systemic blind spots
- Epistemic backlog generation
- Promotion, resolution, and dismissal tracking
- Cross-linking with AGENTS.md/CLAUDE.md
