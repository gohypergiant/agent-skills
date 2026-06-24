# Changelog

## [1.2.0] - 2026-06-24

### Added
- **Phase 2: Load Project Context** — New phase between task parsing and execution that loads `openspec/config.yaml` context and injects it into sub-agent prompts
  - Reads and parses the `context` section from `openspec/config.yaml`
  - Extracts Stack Facts, coding patterns, testing conventions, and anti-patterns (typically ~221 lines)
  - Injects context into both sequential and parallel sub-agent prompts via `<project_context>` block
  - Gracefully handles missing config or empty context (proceeds without injection)
- Updated sub-agent prompt templates to include `<project_context>` block with explicit instructions to apply constraints
- Added background explanation in Phase 2 documenting OpenSpec CLI's limitation (apply command doesn't auto-load context)
- Renumbered all subsequent phases sequentially: Execute (Phase 3), Verify (Phase 4), Update Docs (Phase 5), Report (Phase 6)

### Changed
- Sub-agent prompts now receive project context that was previously missing during apply phase
- Instructions in sub-agent prompts clarify that project context provides constraints for the agent, not content to copy into files
- **Phase 5: Update Living Documents** — Refactored to run in a sub-agent for better context management
  - Documentation updates now MUST run if verification reports "✅ All Checks Passed" or "✅ No critical issues found"
  - Sub-agent reads change artifacts (proposal, design, specs, tasks) to understand what was implemented
  - All document updates (config.yaml, ARCHITECTURE.md, AGENTS.md, README.md) run sequentially within the sub-agent without pausing between documents
  - Only pauses if user input is required for a specific update decision
  - Reports back with summary of updates or confirmation that no updates were needed
  - Main orchestrator no longer handles document updates directly — delegates entire phase to specialized sub-agent

### Fixed
- **CRITICAL FIX**: Sub-agents now receive Stack Facts, coding patterns, testing conventions, and anti-patterns during implementation
  - Previously: OpenSpec's `apply` command didn't inject `config.yaml` context (unlike artifact creation commands)
  - Impact: Sub-agents lacked project-specific guidance (type safety rules, performance constraints, testing patterns)
  - Root cause: OpenSpec CLI's `generateApplyInstructions()` doesn't call `readProjectConfig()`
  - Solution: Wrapper skill now manually loads and injects context into sub-agent prompts
  - Verification: Confirmed via OpenSpec source code inspection (`commands/workflow/instructions.js`) and live testing
- **CRITICAL: Skill now proceeds through all phases automatically** — Fixed issue where skill stopped after Phase 4 (Verify) instead of continuing to Phase 5 (Update Docs) and Phase 6 (Report)
  - **Root cause**: Phase 4 presented verification results and said "Ready to archive!" which signaled completion, even though Phases 5 and 6 were still pending
  - **Impact**: Documentation updates (Phase 5) were never executed, and final report (Phase 6) was never shown
  - **Solution**:
    - Phase 4 now explicitly transitions to Phase 5 after successful verification or to Phase 6 after failed verification
    - Added "Immediately proceed to Phase N" instructions in Phases 4 and 5
    - Added "CRITICAL: This phase runs AUTOMATICALLY" emphasis at Phase 5 start
    - Added "CRITICAL: This is the FINAL phase" emphasis at Phase 6 start
    - Removed misleading "Ready to archive!" message from Phase 4 (now only appears in Phase 6 final report)
  - **Verification**: Phases now flow: Parse → Dependencies → Load Context → Execute → **Verify → Update Docs → Report** (full workflow)

### Rationale
- **Why this fix matters**: Without project context, sub-agents implementing tasks don't follow project conventions (e.g., using `any` types when project forbids them, missing performance constraints like bounded iteration). This leads to implementations that pass functional tests but violate project standards.
- **Why Phase 2 location**: Context must be loaded after change selection (Phase 0) and task parsing (Phase 1), but before spawning sub-agents (Phase 3). This ensures context is available when building sub-agent prompts.
- **Why `<project_context>` wrapper**: The XML-style tag clearly delineates background constraints from task instructions, making it explicit that this content guides the agent's behavior rather than being copied into code.
- **Why graceful degradation**: If `config.yaml` is missing or has no context section, the skill still works (falls back to OpenSpec's default behavior). This maintains compatibility with projects that haven't configured custom context.
- **Why workaround instead of upstream fix**: Upstream OpenSpec fix (modifying `generateApplyInstructions()` to call `readProjectConfig()`) would benefit all users, but requires contribution, review, and release cycle. This workaround provides immediate value while upstream fix is pursued.
- **Why Phase 5 uses sub-agent**: Isolates documentation work from the main orchestration context, preventing context bloat during long implementation sessions. Sub-agent reads change artifacts to understand what was implemented and makes intelligent documentation decisions.
- **Why sequential within sub-agent**: While slices can run in parallel (Phase 3), document updates must be sequential to avoid conflicts when multiple documents reference the same concepts (e.g., new tech stack in both config and ARCHITECTURE.md).
- **Why mandatory after verification passes**: Successful verification means the change is complete and correct — documentation MUST be updated at this point to prevent drift. Making this mandatory ensures documentation stays synchronized.
- **Why automatic transitions**: The skill is designed as a complete end-to-end workflow. Stopping after verification but before documentation updates breaks the workflow contract and leaves documentation out of sync.
- **Why emphasis on automation**: Claude tends to interpret "presenting results" as "end of task" unless explicitly instructed to continue. The "CRITICAL" and "AUTOMATICALLY" keywords make the continuation unambiguous.
- **Why remove "Ready to archive!" from Phase 4**: This phrase signals task completion, making Claude think the workflow is done. Moving it to Phase 6 (the actual final phase) aligns the signal with reality.

### Known Limitations
- **Context window impact**: Injecting ~221 lines of project context into each sub-agent prompt adds to context usage. Monitor sub-agent context window consumption, especially for changes with many parallel slices.
- **Workaround scope**: This fix only applies to `accelint-qrspi-apply` skill. Users invoking `/opsx:apply` directly (without this wrapper) will still not receive project context.
- **Manual extraction**: YAML parsing is done manually (reading and extracting the `context: |` block). If config.yaml uses non-standard YAML formatting, extraction may fail.

### Next Steps
- Monitor context window usage in production to assess ~221-line injection impact
- Open issue/PR with OpenSpec package to add context injection to `generateApplyInstructions()`
- If upstream fix is merged, remove Phase 2 workaround in future version

### Version
- Bumped from 1.1.0 → 1.2.0

## [1.1.0] - 2026-06-18

### Added
- **Phase 4: Update Living Documents** — After successful verification, automatically updates project documentation to reflect implemented changes
  - Updates openspec/config.yaml (project DNA: stack, patterns, domain concepts)
  - Updates ARCHITECTURE.md if present (system structure: components, deployment, infrastructure)
  - Updates AGENTS.md if present (agent behavior: workflow, tools, guardrails)
  - Updates README.md if present (user documentation: installation, features, usage)
- Skill availability detection to intelligently use Accelint skills when available or fall back to manual updates
- Boundary-respecting manual update instructions for each document type:
  - OpenSpec config: project DNA (what the project is) — tech stack, domain concepts, code patterns, per-artifact rules
  - ARCHITECTURE.md: system structure (how components relate) — architecture layers, system diagrams, components, data stores
  - AGENTS.md: agent behavior (how agents act) — workflows, decision heuristics, tool preferences, guardrails
  - README.md: user documentation (public API) — installation, features, usage examples, configuration

### Changed
- Workflow Overview diagram updated to include "Update Docs" phase between Verify and Report
- Phase numbers adjusted: Update Docs became Phase 5, Report became Phase 6
- Documentation update phase only runs if verification passed (no CRITICAL issues)

### Rationale
- **Why update docs post-verification**: OpenSpec changes represent significant architectural decisions and feature additions. Living documents provide human-readable context about the system's current state. Updating them post-implementation prevents documentation drift and ensures the next engineer (or Claude) has accurate context.
- **Why skill-first with manual fallback**: Using dedicated Accelint skills ensures consistency and leverages specialized knowledge. Manual fallback instructions respect each document's scope boundaries, preventing cross-contamination (e.g., not adding agent behavior to config.yaml).
- **Why boundary-specific instructions**: Each document serves a distinct purpose in the agent instruction stack. Manual updates must respect these boundaries to maintain separation of concerns (project DNA vs system structure vs agent behavior vs user docs).

### Version
- Bumped from 1.0.0 → 1.1.0

## [1.0.0] - 2026-05-04

### Added
- Initial release of accelint-qrspi-apply skill
- Automated parallelization detection from QRSPI-generated tasks.md "Parallelization Strategy" section
- Dependency graph parsing to identify sequential vs parallel execution opportunities
- Sub-agent orchestration for parallel slice execution using OpenSpec CLI (`/opsx:apply`)
- Verification phase using `/opsx:verify` before declaring changes ready to archive
- Human-in-the-loop checkpoints for validation failures and errors
- Safe fallback to sequential execution when no parallelization strategy is present
- Progress reporting showing slice-by-slice completion
- Context management: pause points between dependency levels with clear/resume support
- Resumption detection: automatically detects partial completion from task checkboxes and resumes from correct level
- Final report with git status, validation results, and next steps
- Scoped specifically to QRSPI-planned changes (requires `accelint-qrspi` skill output)
- **Task format validation**: Mandatory checklist format (`- [ ] task`) validation in Phase 1 — exits early with error if tasks use numbered lists or plain bullets (required for progress tracking)
- **Sub-agent delegation enforcement**: CRITICAL notes in sub-agent prompts requiring use of /opsx:apply command (prevents bypassing OpenSpec's context/state management)
- **Verification enforcement**: CRITICAL note at Phase 3 emphasizing verification is mandatory before archive (catches incomplete/incorrect implementations)
- **NEVER Do This section**: Anti-pattern list covering common failure modes (direct implementation, skipping verification, invalid formats, skipping dependencies)

### Design Decisions
- **Why use OpenSpec CLI for each slice**: Sub-agents invoke `/opsx:apply` to preserve OpenSpec's context loading, state management, and progress tracking. Slice isolation is achieved through instructions rather than bypassing the CLI.
- **Why QRSPI-only scope**: Standard OpenSpec changes don't include parallelization strategies. QRSPI's vertical slicing methodology is what makes parallel implementation safe and effective.
- **Why sub-agents for parallelization**: Each QRSPI slice is a vertical feature increment that can be implemented independently. Sub-agents provide true parallelism and isolated contexts, preventing slices from interfering with each other.
- **Why verification before archive**: Catches incomplete tasks, unimplemented requirements, and design divergences before archiving. OpenSpec's `/opsx:verify` command provides comprehensive verification across completeness, correctness, and coherence dimensions.
- **Why safe defaults**: If no parallelization strategy is found, run tasks sequentially. This ensures correctness for changes that weren't planned with parallelization in mind.
- **Why pause points between levels**: Sub-agent results can accumulate significant context. Offering pause/clear/resume between dependency levels preserves the serial `opsx:apply` workflow flexibility while benefiting from parallelization within each level. Progress is tracked via task checkboxes, making it durable across context clears.

### Known Limitations
- Requires sub-agent support (not available in all environments like Claude.ai)
- Assumes OpenSpec tasks.md follows the "Parallelization Strategy" section format
- Does not support native OpenSpec slice targeting (works around with sub-agent instructions)
- Relies on proper vertical slicing to avoid file conflicts between parallel slices

### Version
- Initial version: 1.0.0
