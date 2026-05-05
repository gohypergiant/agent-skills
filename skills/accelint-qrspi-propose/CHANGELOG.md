# Changelog

## [1.2.0] - 2026-05-05

### Fixed
- **CRITICAL: Agents bypassing /opsx commands** — Added explicit CRITICAL/IMPORTANT notes to prevent agents from generating artifacts directly
  - Issue: Sub-agents were sometimes writing tasks.md, proposal.md, or design.md content themselves instead of delegating to /opsx:continue commands
  - Impact: When agents generate artifacts directly, they bypass OpenSpec's configured rules and create inconsistent outputs (e.g., tasks.md missing checklist format)
  - Fix: Added CRITICAL blocks in Phase 3 and Phase 5 prompts stating "DO NOT generate content yourself. The /opsx:continue command handles artifact generation."
  - Rationale: /opsx commands follow project-specific rules in config.yaml; direct generation ignores these rules

- **CRITICAL: Markdown checklist format enforcement** — Added explicit validation for `- [ ] task` format in tasks.md
  - Issue: When restructuring tasks.md from horizontal to vertical slicing, agents might lose the markdown checklist format and use numbered lists or plain bullets
  - Impact: qrspi-apply skill depends on `- [ ] ...` format to track task completion; other formats break the workflow
  - Fix: Added CRITICAL note in Step 10b requiring markdown checklist format preservation during restructuring
  - Added anti-pattern: "NEVER use numbered lists or plain bullets in tasks.md"

- **CRITICAL: Agents skipping mandatory checkpoints** — Strengthened enforcement of Phase 4 and Phase 5 checkpoints
  - Issue: Agents were sometimes not pausing after design.md generation and proceeding directly to specs/tasks, bypassing the design review checkpoint
  - Impact: Defeats the "brain surgery" moment where design corrections are cheap; skipping review means fixing issues after code is written (expensive)
  - Fix: Added multiple CRITICAL blocks enforcing stops:
    - Phase 3 sub-agent prompt: "STOP AFTER GENERATING DESIGN.MD. Your job ends here."
    - Phase 3 Step 8: "DO NOT continue to Phase 5 yet. You MUST proceed to Phase 4 checkpoint."
    - Phase 4 header: "You MUST pause here and wait for user input."
    - Phase 4 end: "DO NOT PROCEED TO PHASE 5 WITHOUT EXPLICIT USER APPROVAL."
    - Phase 5 Step 12: "DO NOT PROCEED TO PHASE 6 WITHOUT EXPLICIT USER APPROVAL."
  - Updated workflow diagram with visual ⚠️ checkpoint markers
  - Added anti-pattern: "NEVER skip the mandatory checkpoints"

- **Parallelization Strategy overcomplicated** — Simplified guidance with concrete template and "DO NOT overcomplicate" warning
  - Issue: Agents were sometimes generating overly detailed parallelization sections with excessive edge cases
  - Fix: Added simple template format showing the right level of detail: dependencies, parallel opportunities, recommended order
  - Added explicit checkpoint (Step 9) to verify Parallelization Strategy exists and follows the simple format
  - Example template now matches the format from actual working changes

### Added
- **NEVER Do This section** — Added anti-pattern list reinforcing key principles
  - NEVER generate artifacts yourself (always use /opsx commands)
  - NEVER write tasks.md content directly (breaks checklist format)
  - NEVER overcomplicate Parallelization Strategy (keep it simple)
  - NEVER continue to specs/tasks without design approval (skips "brain surgery" checkpoint)
  - NEVER let ticket leak into research/design context (causes solution-first thinking)
  - Rationale: Explicit anti-patterns help agents avoid common failure modes

### Changed
- **Phase 5 vertical slicing guidance** — Moved detailed vertical slicing guidance from sub-agent prompt to validation step
  - Issue: Long guidance in sub-agent prompt wasn't preventing agents from generating artifacts directly, and removing it entirely lost important context for validation
  - Fix: Added brief CRITICAL notes in sub-agent prompt delegating to /opsx:continue; restored full vertical slicing guidance to Step 8 (validation phase)
  - Rationale: Validation step needs detailed criteria to restructure horizontal slices; sub-agent prompt just needs to delegate to /opsx:continue
  - Validation logic (Steps 8-10) now includes comprehensive examples and requirements for restructuring

### Version
- Bumped from 1.1.0 → 1.2.0

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
