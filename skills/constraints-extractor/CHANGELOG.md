# Changelog

All notable changes to the constraints-extractor skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-08-25

### Fixed
- **Evidence file paths are now relative to project root instead of absolute paths**. The `merge_constraints.py` script automatically converts absolute paths to relative paths when processing findings. This makes CONSTRAINTS.md more portable and avoids exposing user-specific directory structures in evidence citations.
- Updated SKILL.md to clarify that subagents should provide file paths relative to the project root in evidence citations.

## [1.0.0] - Initial Release

### Added
- Initial release of constraints-extractor skill
- Parallel subagent-based document scanning
- Evidence correlation and deduplication
- Category-based constraint organization
- Support for CONFIRMED and CONFLICTING confidence levels
- Automatic ID assignment and management
- Cross-linking with AGENTS.md/CLAUDE.md
