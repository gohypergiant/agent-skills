# Changelog

All notable changes to this skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-08-21

### Changed
- Tightened `SKILL.md` in strict mode to remove avoidable qualitative execution cues around restructure handling while preserving trigger scope, workflow order, and file-writing behavior
  - Rationale: The skill still contained a behavior-bearing phrase that could act as a self-justifying branch in the restructure path
- Kept the roadmap interview rule as always-ask behavior and aligned `README.md` with that canonical rule
  - Rationale: Roadmap and future-plans content cannot be inferred from codebase discovery, so the skill should continue to ask that turn explicitly

### Version
- Bumped from 1.2.1 → 1.2.2

## [1.2.1] - 2026-08-20

### Changed
- Tightened `SKILL.md` and `README.md` so Stage 2 discovery now uses an objective branch based only on subagent availability, removing qualitative fallback cues and weaker modal wording from the parallel-vs-inline discovery rule
  - Rationale: The prior wording still allowed subjective escape hatches such as `without reason`, `preferably`, and similar softer cues that could let a model self-justify serial or inline discovery when parallel subagents were available
- Clarified refresh and restructure control points in `SKILL.md`, including when to offer restructure, when roadmap questions apply during refresh, and how to describe simultaneous discovery domains
  - Rationale: The final audit found a few remaining transcript-sensitive ambiguities where broad timing language or always-ask phrasing could steer the model into unnecessary steps or inconsistent refresh questioning
- Aligned `README.md` with the canonical skill behavior for no-serial discovery and `CLAUDE.md` pointer-stub handling
  - Rationale: Keeping the README behaviorally consistent with `SKILL.md` reduces drift during quick maintainer review and preserves the exact follow-up edit contract

### Version
- Bumped from 1.2.0 → 1.2.1

## [1.2.0] - 2026-08-19

### Changed
- Restructured `SKILL.md` around a stage-aware workflow model with explicit `Stage` containers, operational `Step` blocks, stage-level purpose/rules, and clearer completion conditions
  - Rationale: A full serial-instruction audit found the existing hybrid Phase/Step structure preserved behavior but hid the organizing mechanic. A stable stage model makes order, gates, and action boundaries easier for LLMs to follow without changing trigger scope or workflow intent.
- Normalized workflow terminology from mixed phase-oriented labeling to a clearer stage-and-step hierarchy while preserving MODE handling, preview gating, discovery rules, and follow-up edit behavior
  - Rationale: `accelint-skill-prose` guidance prefers one term for one concept and warns against flattening stage notes into pseudo-steps. This rewrite makes stage-level policy and step-level action easier to distinguish.

### Version
- Bumped from 1.1.4 → 1.2.0

## [1.1.4] - 2026-08-19

### Changed
- Tightened serial instruction wording in `SKILL.md` and `README.md` to make ordered execution, gates, and completion states easier for LLMs to follow without changing trigger scope or workflow intent
  - Rationale: A focused serial-instruction audit found several workflow sections where order was present but not shaped as strongly as it could be for transcript-following reliability, especially around phase entry, mode detection, discovery flow, preview gating, and follow-up edits
- Clarified ordered control points such as explicit wait states, action sequencing, and completion conditions while preserving the existing architecture-doc contract
  - Rationale: Stronger step framing reduces the chance that an agent merges adjacent actions, skips a gate, or treats a follow-up edit as optional narrative

### Version
- Bumped from 1.1.3 → 1.1.4

## [1.1.3] - 2026-07-31

### Changed
- Added structured `expectations` to create, refresh, OpenSpec-aware, and external-findings eval scenarios in `evals/evals.json`
  - Rationale: Stage 1 audit found the highest-value workflow branches were still covered mostly by narrative `expected_output` text, which limited future grading rigor and empirical verification
- Tightened behavior-defining prose in `SKILL.md` without changing frontmatter, trigger scope, workflow order, or guardrail intent
  - Rationale: Stage 1 audit and the Stage 4 strict prose pass both identified instruction density and mixed obligation wording as avoidable execution risk in transcript-sensitive flows

### Version
- Bumped from 1.1.2 → 1.1.3

## [1.1.2] - 2026-07-31

### Changed
- Made preview-before-write, restructure approval, refresh sequencing, package-scope defaulting, and CLAUDE.md pointer-file handling more operationally explicit in `SKILL.md`
  - Rationale: Stage 1 eval review found these were the highest-risk transcript-sensitive behaviors; clearer operational wording improves consistency without changing intended behavior
- Added structured `expectations` to high-risk evals covering restructure gating, package-vs-root scope, anti-fabrication/TODO handling, and agent-doc follow-up
  - Rationale: Stage 1 eval review found strong scenario breadth but weak quantitative grading readiness; these assertions improve empirical verification in future runs
- Tightened behavior-defining prose while preserving frontmatter, workflow semantics, and guardrails
  - Rationale: Stage 4 prose audit identified scan-cost and obligation-language clarity issues in the instruction body

### Version
- Bumped from 1.1.1 → 1.1.2

## [1.1.1] - 2026-07-30

### Changed
- Refined trigger boundaries and scope wording so the skill favors ARCHITECTURE.md-producing documentation workflows over generic architecture discussion or brainstorming
  - Rationale: Improves invocation quality and reduces false positives on architecture-adjacent prompts that do not need file generation
- Clarified refresh sequencing, restructure approval requirements, monorepo scope defaults, and fallback discovery behavior when subagents are unavailable or unnecessary
  - Rationale: Makes the workflow more reliable across constrained environments, small repos, and ambiguous existing docs
- Tightened skill prose and aligned the package README with the actual AGENTS.md / CLAUDE.md integration contract
  - Rationale: Reduces instruction drift between artifacts and makes the behavior easier to audit
- Added `evals/evals.json` with representative create, refresh, restructure, monorepo, OpenSpec-aware, and agent-doc follow-up scenarios
  - Rationale: Establishes a reusable default eval set for regression coverage and future skill-creator benchmarking

### Version
- Bumped from 1.1.0 → 1.1.1

## [1.1.0] - 2026-07-08

### Added
- **External findings support in MODE 2: Refresh** — skill now accepts `findings:` list from invoking prompt
  - Parses invoking prompt for a `findings:` section (bulleted list of factual statements)
  - Each finding is phrased as something already known to be true, never as an instruction
  - Example: "config.yaml's Anti-Patterns section says to avoid polling, but two archived changes chose polling for stated reasons"
  - Findings are merged with drift detection findings before presenting to user
  - Allows upstream workflows (e.g., `accelint-qrspi-apply`) to pass change-specific context that should influence documentation updates
  - If external findings exist, notes their source (e.g., "from completed OpenSpec change")
  - Rationale: Documentation refresh after completing OpenSpec changes should incorporate decisions made during that change. Without external findings, the skill would only detect drift via file changes but miss semantic decisions that haven't yet manifested in the codebase.

### Changed
- **MODE 2: Refresh workflow expanded** — now includes 4-step process instead of 2-step
  - Step 1: Extract external findings from invoking prompt (if any)
  - Step 2: Drift detection (scan codebase for changes)
  - Step 3: Merge and announce all findings (external + drift) before asking anything
  - Step 4: After targeted interview, show diff-style preview before writing
  - Rationale: Explicit merge step makes it clear that external and drift findings are treated equally, and announcing them together upfront gives the user full context before the interview begins

### Version
- Bumped from 1.0.0 → 1.1.0

## [1.0.0] - 2026-05-11

### Added
- Initial skill release
- Phase 0 file state detection: Create vs. Refresh mode with import/append/dry-run options for unrecognised content shapes
- Phase 1 codebase scan table covering all 11 architecture.md sections with specific inference targets
- Phase 2 targeted interview (5 turns) covering only gaps the scan couldn't fill — deployment, security, roadmap, identity
- Phase 3 preview-before-write workflow with inference source annotations stripped from final output
- Drift detection table for refresh mode — 8 signal categories with specific file paths
- 6 anti-patterns with concrete WHY explanations (overwrite without reading, fabricate infrastructure, verbatim directory tree, skip drift detection, all-TODO document, implementation details in system diagram)
- `references/template.md` — full 11-section ARCHITECTURE.md skeleton with annotation guidance
- "Date every write" principle — always sets Section 10 date to today on each write

### Rationale
- Modelled after `accelint-onboard-agent` and `accelint-onboard-openspec` patterns (Phase 0/1/2/3 structure, Mode 1/2/3 detection, infer-before-asking principle)
- Living document update path is the primary use case, not just initial creation — most invocations will be refreshes
- Codebase scanning is prioritised over interviewing to minimise user burden; questions are reserved for content that cannot be mechanically derived (roadmap, security decisions, deployment specifics not in IaC)