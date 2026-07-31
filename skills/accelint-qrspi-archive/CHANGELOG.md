# Changelog

## [1.3.4] - 2026-07-31

### Changed
- Tightened repeated rationale in `SKILL.md` while preserving the workflow contract
  - Rationale: Stage 2 static audit evidence showed the skill body remained over the skill-creator guidance target and repeated some behavioral rationale, increasing scan cost and maintenance risk
- Clarified that `README.md` is a concise companion summary and that `SKILL.md` is the canonical operational contract
  - Rationale: Repository evidence from the prior iteration showed README/SKILL drift had already occurred once, so making artifact ownership explicit reduces future divergence risk
- Ran a strict skill-prose pass on `SKILL.md` without touching frontmatter, improving local obligation clarity and sentence structure in workflow-heavy sections
  - Rationale: Stage 4 rewrite output identified behavior-bearing prose that could be tightened safely without changing trigger scope, workflow order, or guardrail strength

### Version
- Bumped from 1.3.3 → 1.3.4

## [1.3.3] - 2026-07-30

### Changed
- Rewrote `README.md` to match the current skill contract more closely
  - Rationale: The README still described obsolete phase-based structure, subagent usage for archive itself, and wholesale specs index rebuilds, which no longer matched the actual skill behavior in `SKILL.md`
- Tightened README terminology around inline archive execution, additive linking, targeted specs-index patching, and append-only archive-index updates
  - Rationale: Keeps the artifact set internally consistent and reduces the risk that readers follow outdated operational guidance

### Version
- Bumped from 1.3.2 → 1.3.3

## [1.3.2] - 2026-07-30

### Changed
- Refined the frontmatter description to better match the generated eval set's trigger language and boundaries
  - Rationale: Makes archive-plus-bookkeeping requests more likely to trigger while more clearly excluding propose/apply/synthesis work
- Clarified that this skill owns native archive execution plus follow-on linking and index maintenance
  - Rationale: Improves boundary precision for requests focused on post-archive cross-linking, specs index updates, and archive index appends

### Version
- Bumped from 1.3.1 → 1.3.2

## [1.3.1] - 2026-07-30

### Changed
- Tightened the skill description to start with "Use when," clarify trigger phrases, and define the archive-plus-bookkeeping boundary more explicitly
  - Rationale: The skill manager guidance requires a clearer WHAT/WHEN/KEYWORDS description so activation is easier and false positives are less likely
- Added a short `How to Use` section ahead of the workflow
  - Rationale: The skill had strong procedural detail but lacked a concise operator-oriented entry point, which made safe usage harder to scan quickly
- Corrected stale step references in out-of-scope, error-handling, and NEVER sections
  - Rationale: The numbering had drifted after prior structural edits, which created internal inconsistency and maintenance risk

### Version
- Bumped from 1.3.0 → 1.3.1

## [1.3.0] - 2026-07-24

### Changed
- **Expanded Purpose heading support** — skill now accepts both `## Purpose` and `### Purpose` heading levels
  - Rationale: Some specs use h3 level for Purpose headings within capability sections. Supporting both heading levels makes the skill more flexible without changing validation behavior
  - Updated all references throughout:
    - Compatibility note: "must already have a ## Purpose heading" → "must already have a ## Purpose or ### Purpose heading"
    - Preflight Task B: validation now checks for either heading level
    - Spec writing prompts: instructions updated to reference "## Purpose or ### Purpose heading"
    - Index update logic: reads from either heading level when extracting purpose text
    - Error messages: updated to mention both heading formats
  - Why: Rigid heading level requirements create unnecessary friction when specs organize content differently. The actual requirement is semantic (a Purpose section exists), not syntactic (specific heading level)

### Version
- Bumped from 1.2.0 → 1.3.0

## [1.2.0] - 2026-07-21

### Changed
- **Improved Related Specs formatting instructions:** Enhanced Task F (spec frontmatter sync) to generate rich markdown links with purpose descriptions
  - Rationale: Plain partner name lists don't communicate what each related spec does. Links provide immediate navigation, purpose text provides context at a glance
  - Format changed from:
    - `- <partner>`
    - To: `- [<partner>](../<partner>/spec.md) - <Purpose heading text>`
  - Instructions now specify: read each partner's spec.md to extract ## Purpose heading, format as markdown link with partner name as link text, relative path to spec.md, space-dash-space separator (not em-dash), then first sentence/paragraph from Purpose
  - Example format added showing real entries with links and descriptions
  - Clarified insertion point: end of file if no ## Related Specs heading exists
  - Why: Related specs cross-references are for human readers navigating capability relationships. Rich links with purpose text make the spec graph browsable without clicking through every file

### Version
- Bumped from 1.1.0 → 1.2.0

## [1.1.0] - 2026-07-10

### Changed
- **Remove phase boundaries to prevent premature stopping:** Refactored from phase-based structure to continuous numbered steps
  - Rationale: Phase headers like "### Phase 0: Preflight Checks", "### Phase 1: Archive and Extract", "### Phase 2: Validate" create natural stopping points where agents might pause and check with the user mid-workflow, breaking the intended continuous execution flow
  - Changed structure from:
    - "### Phase 0: Preflight Checks" / "### Phase 1: Archive and Extract" / etc.
    - To: Single section with instruction "Execute these steps in order without stopping between them unless an error occurs" followed by continuous numbered steps
  - Updated workflow diagram: "Phase" column → "Stage" column (higher-level groupings like "Preflight", "Archive", "Validate")
  - Updated all cross-references throughout (e.g., "Phase 4 always delegates" → "Spec writing always delegates", "Phase 1 is the mirror image" → "Archive and extraction is the mirror image")
  - Removed all `**Steps:**` sub-headers that created additional stopping points within phases
  - Updated compatibility note to use plain language instead of phase references (e.g., "Phase 4 (per-capability spec writes)" → "Per-capability spec writes", "Phase 0 Task A" → "preflight Task A")
  - Why: Agents tend to treat phase headers and "Steps:" sub-headers as checkpoint boundaries even when not intended. Continuous numbered steps signal that the workflow should execute atomically unless an error occurs

### Version
- Bumped from 1.0.0 → 1.1.0
