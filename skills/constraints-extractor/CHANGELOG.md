# Changelog

All notable changes to the constraints-extractor skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-10-01

### Fixed
- **Documented that `merge_constraints.py` is additive-only.** The script merges new findings and corroborates existing entries by combining evidence, but it has no delete path -- it will never remove a stale entry or replace a bad citation on its own. SKILL.md previously implied the script handled "all mechanical file operations," which overstated its scope.

### Added
- New "Removing Stale Entries and Bad Citations" section in SKILL.md giving the exact, grammar-preserving procedure for the one case where a direct, user-confirmed edit to `CONSTRAINTS.md` is correct: deleting a whole stale entry block, or fixing a single bad citation's `Evidence:`/`Evidence notes:` lines.
- "Preview Before Writing" now surfaces stale entries and bad citations found during a run, alongside new constraints and conflicts, so removal/correction gets the same explicit user confirmation as any other change.
- `references/troubleshooting.md`'s merge script behavior list now states the no-delete limitation explicitly.

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
