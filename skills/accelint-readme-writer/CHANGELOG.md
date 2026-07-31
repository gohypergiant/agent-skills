# Changelog

## [1.2.5] - 2026-07-31

### Changed
- Tightened evidence-backed workflow reliability in `SKILL.md`
  - Resolved conflicting instructions for missing `accelint-english-manager` by standardizing on a grounded **not yet prose-polished** fallback
  - Reduced drift risk by keeping a single canonical strict-mode invocation block for `accelint-english-manager`
  - Relaxed the subagent rule so parallel discovery is preferred when it materially helps, while allowing systematic inline discovery for small README-local targets
  - Clarified when to pause for confirmation versus proceeding directly with a requested rewrite
- Aligned support guidance with the adaptive README strategy
  - Updated `AGENTS.md` and `references/readme-structure.md` so package/library section order remains the default, while app/service/CLI/monorepo-root READMEs can adapt their middle sections to the real public surface
- Performed a strict prose-tightening pass across the skill artifact set without changing frontmatter
  - Refined `SKILL.md`, `AGENTS.md`, and reference-file wording for scanability while preserving trigger coverage, workflow semantics, guardrails, and exact technical references

### Version
- Bumped from 1.2.4 → 1.2.5

## [1.2.4] - 2026-07-30

### Changed
- Expanded README-skill trigger coverage and workflow boundaries in `SKILL.md`
  - Added stronger trigger phrasing for README audits, stale-doc refreshes, refactor-driven updates, and monorepo package paths
  - Added capability-boundary guidance for library/package, app/service, CLI, and monorepo-root README strategies
  - Clarified update-mode decisions, preservation rules for intentional custom content, and fallback behavior when `accelint-english-manager` is unavailable
- Refreshed the skill artifact set for consistency with the current workflow
  - Updated `README.md` to reflect scope-aware README strategy, optional `Architecture & Development Guides`, and the required final prose-polish dependency
  - Updated `AGENTS.md` and reference files to tighten behavior-defining prose, normalize terminology, and align related-doc handling
- Replaced the eval set in `evals/evals.json` with broader coverage
  - Added cases for monorepo scoping, library-vs-app strategy, external `findings:` merging, preserving custom content, missing prose-polish dependency handling, invented-command avoidance, and conditional related-doc sections

### Version
- Bumped from 1.2.3 → 1.2.4

## [1.2.3] - 2026-07-30

### Changed
- Tightened behavior-defining prose across `SKILL.md`, `AGENTS.md`, and `references/writing-principles.md` without changing trigger coverage, workflow order, or guardrail strength
  - Reorganized top-level sections in `SKILL.md` to surface workflow boundaries, hard stops, and required sub-skill behavior earlier
  - Clarified `AGENTS.md` summary wording and aligned section-order guidance with the optional `Architecture & Development Guides` section
  - Improved heading consistency and local sentence clarity in `references/writing-principles.md` while preserving examples and exact technical references

### Version
- Bumped from 1.2.2 → 1.2.3

## [1.2.2] - 2026-07-30

### Fixed
- Corrected stale `humanizer` references in `references/writing-principles.md` to the exact required sub-skill name `accelint-english-manager`
- Aligned the writing-principles reference with `SKILL.md` so the required final prose-polish dependency is named consistently across the skill folder

### Version
- Bumped from 1.2.1 → 1.2.2

## [1.2.1] - 2026-07-30

### Changed
- Tightened behavior-defining prose across `SKILL.md`, `AGENTS.md`, and `references/` files without changing trigger coverage, workflow order, or guardrail strength
  - Clarified discovery, comparison, and humanizer instructions with more direct wording
  - Improved sentence structure and terminology consistency across the skill folder
  - Preserved exact technical references, examples, and required sub-skill behavior

### Version
- Bumped from 1.2.0 → 1.2.1

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
