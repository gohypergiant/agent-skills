# Changelog

## [1.2.0] - 2026-07-08

### Added
- **External findings support** — skill now accepts `findings:` list from invoking prompt
  - Parses invoking prompt for a `findings:` section (bulleted list of factual statements)
  - Each finding is phrased as something already known to be true, never as an instruction
  - Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
  - Findings are merged with codebase gap analysis before presenting to user
  - Allows upstream workflows (e.g., `accelint-qrspi-apply`) to pass change-specific context that should influence README updates
  - If external findings exist, notes their source (e.g., "from completed OpenSpec change")
  - Rationale: README updates after completing OpenSpec changes should incorporate user-facing feature decisions made during that change. Without external findings, the skill would only detect documentation gaps via code analysis but miss semantic decisions about features, usage patterns, or configuration that haven't yet fully manifested in exported APIs.

### Changed
- **Step 3 expanded to include external findings extraction** — README comparison workflow now starts with external findings check
  - New Step 3a: Extract external findings from invoking prompt (if any)
  - Existing Step 3b: Compare against existing README (identify gaps from codebase scan)
  - New Step 3c: Merge and present all findings (external + codebase gaps) before generating updates
  - Rationale: Explicit merge step makes it clear that external findings and codebase gaps are treated equally, and presenting them together upfront gives the user full context about what needs updating

### Version
- Bumped from 1.1.0 → 1.2.0

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
