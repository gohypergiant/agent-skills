# Changelog

## [1.4.0] - 2026-07-08

### Added
- **External findings support in refresh mode** — skill now accepts `findings:` list from invoking prompt
  - Parses invoking prompt for a `findings:` section (bulleted list of factual statements)
  - Each finding is phrased as something already known to be true, never as an instruction
  - Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
  - Findings are merged with drift detection and unresolved TODOs before presenting to user
  - Allows upstream workflows (e.g., `accelint-qrspi-apply`) to pass change-specific context that should influence AGENTS.md updates
  - If external findings exist, notes their source (e.g., "from completed OpenSpec change")
  - Rationale: AGENTS.md refresh after completing OpenSpec changes should incorporate behavioral decisions made during that change. Without external findings, the skill would only detect drift via file/config changes but miss workflow or policy decisions that haven't yet manifested in tracked files.

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
