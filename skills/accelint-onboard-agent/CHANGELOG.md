# Changelog

## [1.3.0] - 2026-05-11

### Changed
- **Replaced serial codebase discovery with parallel subagents in Phase 3**
  - Rationale: Serial scanning wastes time on codebases with many config files spread across directories. Parallel discovery pattern from `accelint-architecture-doc` significantly improves performance.
  - Now spawns 5 subagents simultaneously:
    - Agent A: Version control & commit conventions
    - Agent B: CI/CD & pre-commit workflows  
    - Agent C: Testing & code quality
    - Agent D: Security & migrations
    - Agent E: OpenSpec & development workflow
  - Each agent focuses on one behavioral domain and returns structured findings
  - Results are merged after all agents complete before Phase 4

### Added
- **NEVER Do section** with anti-patterns including:
  - Never run codebase discovery serially
  - Never skip discovery before asking questions
  - Never omit sections from generated AGENTS.md
  - Never duplicate root-level instructions in package files
  - Never write final file without showing preview
- **Parallel discovery** principle added to Interaction Principles section

### Version
- Bumped from 1.2 → 1.3
