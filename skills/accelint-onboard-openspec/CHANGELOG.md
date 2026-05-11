# Changelog

## [1.3.0] - 2026-05-11

### Changed
- **CRITICAL PERFORMANCE FIX:** Replaced serial codebase inference with parallel sub-agent discovery
  - Rationale: Phase 3 now spawns 4 discovery agents simultaneously (Stack & Build, Testing & Quality, Architecture & Patterns, CI/CD & Versioning) instead of scanning config files one-by-one. Dramatically reduces discovery time on large codebases with many config files spread across directories.
  - Pattern borrowed from `accelint-architecture-doc` skill's proven parallel discovery architecture

### Added
- Added "NEVER Do" anti-pattern warning about serial scanning when subagents are available
- Created Phase 3 parallel discovery agent specifications:
  - Agent A: Stack & Build Tooling
  - Agent B: Testing & Code Quality
  - Agent C: Architecture & Code Patterns
  - Agent D: CI/CD & Versioning

### Version
- Bumped from 1.2.0 → 1.3.0
