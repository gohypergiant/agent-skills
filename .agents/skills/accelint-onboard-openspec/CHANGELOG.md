# Changelog

## [1.5.0] - 2026-07-10

### Added
- **Leaf function purity guidance** — added explicit coding standard for leaf functions (bottom of call stack)
  - Guidance: "Leaf functions (bottom of call stack) should be pure — same inputs produce same outputs, no side effects. Centralize state manipulation in parent/orchestrator functions."
  - Added to TypeScript best practices section in default `config.yaml` template
  - Rationale: Pushes side effects and state management to higher-level orchestration code, making leaf functions easier to test, reason about, and reuse. Pure leaf functions are deterministic and safe to parallelize.

### Version
- Bumped from 1.4.0 → 1.5.0

## [1.4.0] - 2026-07-08

### Added
- **External findings support in refresh mode** — skill now accepts `findings:` list from invoking prompt
  - Parses invoking prompt for a `findings:` section (bulleted list of factual statements)
  - Each finding is phrased as something already known to be true, never as an instruction
  - Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
  - Findings are merged with drift detection and unresolved TODOs before presenting to user
  - Allows upstream workflows (e.g., `accelint-qrspi-apply`) to pass change-specific context that should influence config.yaml updates
  - If external findings exist, notes their source (e.g., "from completed OpenSpec change")
  - Rationale: config.yaml refresh after completing OpenSpec changes should incorporate architectural and pattern decisions made during that change. Without external findings, the skill would only detect drift via file changes but miss semantic decisions that haven't yet manifested in the codebase.

### Changed
- **Refresh mode workflow expanded** — now includes 5-step process instead of 4-step
  - Step 1: Extract external findings from invoking prompt (if any)
  - Step 2: Drift detection (scan codebase for changes)
  - Step 3: Unresolved TODOs (find placeholder markers)
  - Step 4: Merge and announce all findings (external + drift + TODOs) before asking anything
  - Step 5: After targeted interview, show diff-style preview before writing
  - Rationale: Explicit merge step makes it clear that external findings, drift findings, and TODOs are treated equally, and announcing them together upfront gives the user full context before the interview begins

### Version
- Bumped from 1.3.0 → 1.4.0

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
