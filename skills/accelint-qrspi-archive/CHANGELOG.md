# Changelog

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
