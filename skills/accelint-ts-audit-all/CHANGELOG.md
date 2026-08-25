# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-08-25

### Added
- Cross-platform agent compatibility through XML-based skill invocation format
- Explicit negative instructions to prevent misinterpretation as shell commands

### Changed
- Migrated from harness-specific slash-command syntax (`/skill-name`) to agent-agnostic XML invocation format
- Ensures compatibility across Claude Code, Codex, Pi, and other agent harnesses

## [1.0.0] - 2024-01-01

### Added
- Initial release of comprehensive TypeScript audit system
- Support for accelint-ts-testing, accelint-ts-best-practices, accelint-ts-performance, and accelint-ts-documentation skills
- Progress tracking across sessions with audit-process and audit-history files
- Interactive change approval with two-phase presentation pattern
- Isolated git worktree support for parallel audits
- Property-based test stability verification (100-pass requirement)
