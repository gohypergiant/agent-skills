# Changelog

## [1.1.0] - 2026-05-01

### Fixed
- **CRITICAL: Change name tracking across phases** — sub-agents now explicitly pass change name to all `/opsx:continue` calls
  - Issue: When multiple specs exist in openspec/ folder, `/opsx:continue` without a change name parameter would incorrectly target the wrong spec
  - Fix: Phase 3 now instructs sub-agent to capture and report the change name after `/opsx:new`; Phase 5 sub-agent receives this name and uses `/opsx:continue <change-name>` for all artifact generation
  - Impact: Prevents cross-contamination when working on multiple specs; ensures all artifacts are generated for the correct change
  - Completion message now includes the change name for user reference when running `/opsx:apply <change-name>`

### Fixed
- **CRITICAL: Phase 3 flow control** — explicitly prevent generating specs/tasks during design phase
  - Issue: Sub-agent was instructed to run `/opsx:continue` multiple times in sequence, generating proposal.md, design.md, specs/*, and tasks.md all at once
  - Fix: Added explicit STOP instruction after design.md generation; specs and tasks now generated only in Phase 5 after human design review
  - Rationale: Design checkpoint is the "brain surgery" moment — must review design before generating implementation artifacts

- **Vertical slicing guidance clarity** — strengthened instructions with concrete examples and explicit anti-patterns
  - Issue: Generated tasks.md still used horizontal (layer-by-layer) slicing despite guidance
  - Fix: Added side-by-side ✓/✗ examples, explicit "Deliverable:" requirement, and detailed indicators for detecting horizontal vs vertical structure
  - Reference: Real vertical example at `/Users/bryankizer/Documents/auditkit-cli/openspec/changes/remove-security-ruleset/tasks.md`
  - Improvement: Each slice now explicitly requires a testable end-to-end deliverable with verification steps

### Changed
- **Workflow overview diagram** — clarified that design phase outputs proposal.md + design.md only, with explicit [STOP HERE] marker
  - Rationale: Visual reinforcement of the two-phase artifact generation (design artifacts → review → task artifacts)

### Added
- **Parallelization Strategy section** — tasks.md now includes explicit section mapping dependencies and parallel opportunities
  - Content: Which slices must complete first, which can run in parallel, why they're independent, final integration steps
  - Rationale: Makes execution strategy explicit for developers/agents implementing the change

### Changed
- **Removed manual checkpoint for vertical slice conversion** — skill now ALWAYS automatically converts horizontal slicing to vertical slicing
  - Rationale: Vertical slicing is always the correct approach per QRSPI methodology; asking users to choose adds friction without value
  - Improvement: User experience is now smoother — one less decision point in the workflow

- **Added parallelization consideration to vertical slicing logic** — slices structured to be independent enough for concurrent implementation
  - Rationale: Properly structured vertical slices can be implemented by parallel agents/sub-agents, improving development velocity
  - Improvement: Tasks are now explicitly designed with parallelization in mind

### Version
- Bumped from 1.0.0 → 1.1.0
