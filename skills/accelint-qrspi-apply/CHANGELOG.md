# Changelog

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
- Phase 4 renamed to Phase 5 (Report and Next Steps remains the final phase)
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
