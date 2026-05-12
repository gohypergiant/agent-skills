# Changelog

## [1.1.0] - 2026-05-11

### Changed
- **Step 2: Parallel Codebase Discovery** — restructured to use parallel sub-agents for different discovery domains (entry points, dependencies, examples, docs context)
  - Rationale: Following the pattern from `accelint-architecture-doc`, parallel discovery significantly reduces analysis time on codebases with files spread across directories. When sub-agents are available, spawn them simultaneously rather than scanning serially.
  - Agents spawn in parallel: Agent A (Entry Points & Public API), Agent B (Dependencies & Configuration), Agent C (Examples & Usage Patterns), Agent D (Documentation Context)
  - Falls back to inline serial discovery when sub-agents are unavailable

### Added
- **NEVER Do When Writing READMEs** section with 6 anti-patterns:
  - Never run discovery serially when sub-agents are available
  - Never document non-exported internal functions
  - Never fabricate usage examples
  - Never use the wrong package manager commands
  - Never skip comparing code to existing README
  - Never write robotic, AI-sounding text
  - Rationale: These are expert-level knowledge based on common failure modes. Each includes the WHY behind the rule.

### Version
- Bumped from 1.0.0 → 1.1.0
