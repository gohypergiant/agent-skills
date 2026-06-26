---
name: accelint-qrspi-apply
description: Implement QRSPI-planned OpenSpec changes with intelligent parallelization. Use when the user wants to apply a QRSPI change, implement tasks with parallelization, or says "apply this QRSPI change", "implement with parallelization", "run the parallel slices". This skill is specifically designed for changes created via accelint-qrspi that include "Parallelization Strategy" sections in tasks.md. It orchestrates parallel sub-agent execution for independent task slices using OpenSpec CLI workflows. Make sure to use this skill when the user mentions applying QRSPI changes, running parallel implementation, or working on changes with vertical slices.
license: Apache-2.0
compatibility: Requires openspec CLI, sub-agent support, and QRSPI-generated changes.
metadata:
  author: accelint
  version: "1.3.0"
---

# Accelint QRSPI Apply

Implement OpenSpec changes with intelligent parallelization. This skill orchestrates parallel sub-agent execution based on dependency analysis in the OpenSpec task file, validates implementation, and manages the complete apply workflow.

## What This Skill Does

**Automates**: The implementation phase of spec-driven development with parallel execution
**Scope**: Task implementation → Validation → Archive readiness
**Output**: Fully implemented change ready for archival

**Does NOT**: Create plans, modify specs, or automatically archive (suggests archival when ready)

## Prerequisites

- OpenSpec CLI installed and initialized
- OpenSpec change created via `accelint-qrspi` skill (includes "Parallelization Strategy" in tasks.md)
- Sub-agent support (for parallel execution)
- The expanded OpenSpec workflows (`explore`, `new`, `continue`) enabled

**Important**: This skill is specifically designed for QRSPI-planned changes. Standard OpenSpec changes without parallelization strategies should use the regular `/opsx:apply` command directly.

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase          Action                        Output            │
├─────────────────────────────────────────────────────────────────┤
│  Parse          Extract parallelization       Dependency graph  │
│  Dependencies   Identify blocking tasks       Execution plan    │
│  Load Context   Read config.yaml context      Project context   │
│  Execute        Run slices (parallel/serial)  Implemented code  │
│  Update Docs    Sync living documents         Updated docs      │
│  Verify         Run opsx:verify               Verification rpt  │
└─────────────────────────────────────────────────────────────────┘
```

## Phase Breakdown

### Phase 0: Preflight and Change Selection

**Steps**:

1. If a change name is provided in the skill arguments, use it
2. Otherwise, try to infer from conversation context (recent mentions of change names)
3. If ambiguous or missing:
   ```bash
   openspec list --json
   ```
   Parse the JSON and use **AskUserQuestion** to let the user select the change
4. Announce: "Applying change: `<name>`" and how to override (e.g., re-invoke with different name)
5. Check that tasks.md exists:
   ```bash
   openspec status --change "<name>" --json
   ```
   If `state: "blocked"` (missing tasks), exit with: "Tasks artifact is missing. Run `/opsx:continue` to generate tasks before applying."

### Phase 1: Parse Tasks and Parallelization Strategy

**Goal**: Extract task structure and identify parallel vs sequential execution opportunities. Detect if work has already started and resume from the correct level.

**Steps**:

1. Read the tasks.md file from `openspec/changes/<change-name>/tasks.md`

2. **Validate checklist format** (CRITICAL for progress tracking):
   - Check that tasks use markdown checklist format: `- [ ] task` or `- [x] task`
   - If tasks use numbered lists (1. 2. 3.) or plain bullets (- without [ ]):
     ```
     ❌ Invalid tasks.md format

     This skill requires tasks in markdown checklist format (`- [ ] task`) for
     progress tracking and resumption detection.

     Found format: [numbered lists / plain bullets / other]

     Please regenerate tasks.md using the accelint-qrspi-propose skill or convert
     manually to checklist format before applying.
     ```
   - Exit if format is invalid — do not proceed with invalid task format

3. **Check for partial completion** (resumption detection):
   - Count completed tasks (marked `- [x]`) vs total tasks
   - Parse which slices have all their tasks marked complete
   - If any slices are complete, announce: "Detected partial completion. Resuming from Slice N."
   - Adjust the execution plan to skip completed slices

4. Look for the "Parallelization Strategy" section (usually at the end of the file)
5. Parse the strategy to build a dependency graph:

   **Example strategy:**
   ```md
   ## Parallelization Strategy

   - **Slice 1** must complete first (establishes infrastructure)
   - **Slice 2** and **Slice 3** can run in parallel after Slice 1
   - **Slice 2** (implementation cleanup) is independent of **Slice 3** (docs/verification)
   - Final integration: merge both slices, run full pre-commit checklist
   ```

   **Parsed dependency graph:**
   ```
   Level 0 (must run first):
     - Slice 1

   Level 1 (can run in parallel after Level 0):
     - Slice 2
     - Slice 3

   Level 2 (after all previous):
     - Final integration
   ```

6. If no "Parallelization Strategy" section exists:
   - Assume all tasks must run sequentially (safe default)
   - Inform user: "No parallelization strategy found. Running tasks sequentially."

7. Build an execution plan showing:
   - Which slices run in which order
   - Which slices can run in parallel (and which are already complete)
   - Total estimated parallelization speedup
   - Starting point (Level 0 or resuming from Level N)

**Output**: Dependency graph, execution plan, and resumption point if applicable

### Phase 2: Load Project Context

**Goal**: Load project context from `openspec/config.yaml` to inject into sub-agent prompts. This compensates for OpenSpec CLI's limitation where the `apply` command doesn't automatically load project context (unlike artifact creation commands).

**Background**: OpenSpec's `openspec instructions apply` command does NOT inject the `context` field from `config.yaml` (confirmed via code inspection and testing). This means sub-agents implementing tasks don't receive Stack Facts, coding patterns, testing conventions, or anti-patterns that should guide implementation. We work around this limitation by manually loading and injecting the context.

**Steps**:

1. Check if `openspec/config.yaml` exists:
   ```bash
   test -f openspec/config.yaml && echo "exists" || echo "missing"
   ```

2. If the file exists, read it:
   ```bash
   cat openspec/config.yaml
   ```

3. Parse and extract the `context` section (YAML block under `context: |`):
   - The context starts after the line `context: |`
   - The context continues until the next top-level YAML key (e.g., `rules:`, `schema:`)
   - Lines in the context block are indented (usually 2 spaces)
   - Preserve all whitespace and newlines in the context block
   - You MUST inform the user that you found and loaded the config.

4. Store the extracted context for injection into sub-agent prompts in Phase 3

5. If no `context` field exists or the file is missing:
   - Set context to empty string
   - Proceed without context injection (sub-agents will rely on OpenSpec's default behavior)
   - You MUST inform the user that you could NOT find and load the config.

**Example config.yaml structure**:
```yaml
schema: spec-driven

context: |
  # STACK FACTS
  ## Project Identity
  auditkit-cli: TypeScript-based code quality audit CLI

  ## Dependencies
  - @fission-ai/openspec: ^1.2.0
  - vitest: ^2.1.8

  # CODING PATTERNS
  - Use Result<T,E> for fallible operations (never throw)
  - Data-last parameter ordering for currying
  - No `any` types — use `unknown` with type guards

  # TESTING CONVENTIONS
  - AAA pattern (Arrange/Act/Assert)
  - One assertion per test
  - Use descriptive test names

rules:
  proposal: [...]
  design: [...]
```

**Output**: Extracted project context string (may be empty if not present)

### Phase 3: Execute Tasks (Sequential + Parallel)

**Goal**: Implement tasks following the dependency graph, spawning parallel sub-agents where possible.

**Sequential execution** (when tasks have dependencies):

For each level in the dependency graph (starting from level 0):

1. If the level has only one slice:
   - Spawn a single sub-agent with this prompt (inject project context from Phase 2):
     ```
     <project_context>
     <!-- Background constraints for your implementation. Do NOT copy into code. -->
     {INJECTED_CONFIG_CONTEXT}
     </project_context>

     /opsx:apply <change-name>

     CRITICAL: You MUST use the /opsx:apply command to implement tasks.
     DO NOT implement tasks directly yourself. The /opsx:apply workflow will
     load context and guide implementation.

     IMPORTANT: This is Slice N of a parallelized QRSPI implementation.

     Context: This slice must complete before other slices can proceed.
     Other slices will start after you finish.

     Instructions:
     - Work ONLY on tasks in Slice N: [list slice N tasks/sections]
     - Do NOT implement tasks from other slices (Slices X, Y, Z will be handled separately)
     - Apply the code patterns, conventions, and constraints from <project_context>
     - Follow the normal OpenSpec apply workflow:
       * OpenSpec will load context files (proposal, design, specs, tasks)
       * Implement the tasks assigned to Slice N
       * Mark tasks complete as you go: `- [ ]` → `- [x]`
       * Test your changes if tests are specified in the tasks
     - Report completion with summary of changes made
     - The <project_context> provides Stack Facts, coding patterns, testing conventions,
       and anti-patterns to avoid. These are constraints for YOU, not content to include in files.

     Focus exclusively on Slice N. Leave other slice tasks unchecked.
     ```

     Note: If no project context was loaded in Phase 2, omit the `<project_context>` block entirely

2. Wait for completion before proceeding to the next level

**Parallel execution** (when multiple slices are independent):

For each level with multiple independent slices:

1. Spawn all sub-agents in parallel in a single turn (one per slice, inject project context from Phase 2):
   ```
   <project_context>
   <!-- Background constraints for your implementation. Do NOT copy into code. -->
   {INJECTED_CONFIG_CONTEXT}
   </project_context>

   /opsx:apply <change-name>

   CRITICAL: You MUST use the /opsx:apply command to implement tasks.
   DO NOT implement tasks directly yourself. The /opsx:apply workflow will
   load context and guide implementation.

   IMPORTANT: This is Slice N of a parallelized QRSPI implementation.

   Context: This slice is independent and runs in parallel with Slices X, Y.
   Other agents are working on those slices simultaneously.

   Instructions:
   - Work ONLY on tasks in Slice N: [list slice N tasks/sections]
   - Do NOT implement tasks from other slices - they are being handled in parallel
   - Apply the code patterns, conventions, and constraints from <project_context>
   - Follow the normal OpenSpec apply workflow:
       * OpenSpec will load context files (proposal, design, specs, tasks)
       * Implement the tasks assigned to Slice N
       * Mark tasks complete as you go: `- [ ]` → `- [x]`
       * Test your changes if tests are specified in the tasks
   - Report completion with summary of changes made
   - The <project_context> provides Stack Facts, coding patterns, testing conventions,
     and anti-patterns to avoid. These are constraints for YOU, not content to include in files.

   Focus exclusively on Slice N. Leave other slice tasks unchecked.
   Your work is independent and should not block or depend on other slices.
   ```

   Note: If no project context was loaded in Phase 2, omit the `<project_context>` block entirely

2. Track completion as each sub-agent finishes
3. When all slices in the level are done, **pause and offer context management**:
   ```
   ✅ Level N complete

   Completed slices:
   - Slice X: [summary]
   - Slice Y: [summary]

   Next: Level N+1 has M slice(s) to run [list slices]

   Options:
   (a) Continue to next level
   (b) Clear context and resume — I'll pick up from Level N+1
   (c) Pause here — you can resume later with this skill
   ```

4. If user chooses (b), instruct them:
   ```
   Run `/clear` to reset context, then re-invoke this skill.
   I'll detect that Level N is complete and resume from Level N+1.
   ```

5. If user chooses (c), exit and remind them how to resume:
   ```
   Paused at Level N+1. To resume, re-invoke this skill.
   Progress is tracked in tasks.md checkboxes.
   ```

**Slice targeting approach**: OpenSpec's `/opsx:apply` command does not have native "slice targeting" (no `--slice N` flag). This skill achieves parallelization by:

1. **Using the full OpenSpec CLI workflow**: Each sub-agent invokes `/opsx:apply <change-name>`, which:
   - Runs `openspec instructions apply --change "<name>" --json` to get context
   - Loads all context files (proposal, design, specs, tasks)
   - Provides dynamic instructions based on current state
   - Handles task progress tracking and status checks

2. **Slice isolation via instructions**: The orchestrating skill:
   - Parses the parallelization strategy to identify independent slices
   - Spawns sub-agents with explicit instructions to work ONLY on their assigned slice
   - Relies on QRSPI's vertical slicing to ensure slices are truly independent
   - Each sub-agent marks only its slice's tasks as complete

3. **Why this works**: QRSPI's vertical slicing methodology ensures each slice is:
   - A complete end-to-end feature increment
   - Independent with minimal file overlap
   - Testable in isolation
   - Safe to implement in parallel

The slice boundaries are clearly marked in tasks.md (e.g., "## Slice 1: Remove CLI Surface", "## Slice 2: Remove Implementation"), making it straightforward for sub-agents to identify their scope.

### Phase 4: Update Living Documents

**Goal**: Update project documentation to reflect the implemented changes before running verification.

**Why this matters**: OpenSpec changes represent significant architectural decisions and feature additions. Living documents (ARCHITECTURE.md, AGENTS.md, openspec/config.yaml) provide context for agents working in the codebase, while README.md serves human users. Keeping them synchronized prevents documentation drift and ensures future agents and developers have accurate, up-to-date context about the system's current state.

**IMPORTANT**: Run this phase BEFORE verification so the verification step can check documentation completeness.

**Steps**:

1. Check if the change is in a repository or package root by looking for `.git/` or `package.json`
2. Determine the repo/package root (may be current directory or a parent)
3. **Process ALL living documents** in this order (do not stop after the first one):
   - OpenSpec config (`openspec/config.yaml`)
   - ARCHITECTURE.md (if exists)
   - AGENTS.md (if exists)
   - README.md (if exists)

   For each document in the list above, follow these steps:

   **Step 3a: Check if update is needed first**
   - Read the change artifacts to understand what was implemented:
     * `openspec/changes/<change-name>/proposal.md`
     * `openspec/changes/<change-name>/design.md`
   - Assess whether this change introduces content that would affect the document
   - If the change is trivial (typos, comments) or doesn't touch the document's scope, skip to the next document

   **Step 3b: Update the document if needed**

   **For OpenSpec config** (`<repo-root>/openspec/config.yaml`):
   - Check if `accelint-onboard-openspec` skill is installed
   - If skill is available:
     ```
     /accelint-onboard-openspec
     We have just completed the change spec openspec/changes/<change-name>. Given this change, we need to make sure that the openspec/config.yaml is current and up to date.
     ```
     The skill will read the proposal and design from the change directory to understand what was implemented and update the config accordingly.

   - If skill is NOT available, read the change artifacts:
     - `openspec/changes/<change-name>/proposal.md`
     - `openspec/changes/<change-name>/design.md`

     Then read `openspec/config.yaml` and update manually focusing on **project DNA (WHAT the project is)**:
     - **Tech Stack section**: Add new dependencies, frameworks, or libraries introduced by this change with versions
     - **Domain Concepts section**: Add new entities or domain terms if this change introduces them
     - **Code Patterns section**: Update if this change establishes new patterns (exports, error handling, validation approaches)
     - **Architecture Patterns section**: Add new design patterns if introduced (factory, repository, observer, etc.)
     - **Patterns to Avoid section**: Add any anti-patterns this change deprecates or makes explicit
     - **Per-artifact rules** (`rules:` section): Update if this change affects proposal/design/tasks/spec requirements
     - **DO NOT** add agent behavior (commit conventions, workflow steps, tool preferences belong in AGENTS.md)

   **For ARCHITECTURE.md** (`<repo-root>/ARCHITECTURE.md`) — IF it exists:
   - Check if `accelint-architecture-doc` skill is installed
   - If skill is available:
     ```
     /accelint-architecture-doc
     We have just completed the change spec openspec/changes/<change-name>. Given this change, we need to make sure that the ARCHITECTURE.md is current and up to date.
     ```
     The skill will read the proposal and design from the change directory to understand what was implemented and update ARCHITECTURE.md accordingly.

   - If skill is NOT available, read the change artifacts:
     - `openspec/changes/<change-name>/proposal.md`
     - `openspec/changes/<change-name>/design.md`

     Then read `ARCHITECTURE.md` and update manually focusing on **system structure (HOW components relate)**:
     - **Section 1 (Project Structure)**: Update directory tree if new top-level directories or significant reorganization occurred
     - **Section 2 (High-Level System Diagram)**: Update ASCII diagram if component relationships changed or new services were added
     - **Section 3 (Core Components)**: Add new components, services, or packages introduced by this change with their architectural roles
     - **Section 4 (Data Stores)**: Add new databases, caches, or data stores if introduced
     - **Section 5 (External Integrations)**: Add new third-party services or APIs this change integrates with
     - **Section 6 (Deployment & Infrastructure)**: Update if deployment model changed or new infrastructure was added
     - **Section 8 (Technology Stack)**: Update if this change introduced new runtime dependencies or frameworks
     - **DO NOT** add coding patterns, testing conventions, or agent behavior (those belong in config.yaml or AGENTS.md)

   **For AGENTS.md** (`<repo-root>/AGENTS.md`) — IF it exists:
   - Check if `accelint-onboard-agent` skill is installed
   - If skill is available:
     ```
     /accelint-onboard-agent
     We have just completed the change spec openspec/changes/<change-name>. Given this change, we need to make sure that the AGENTS.md is current and up to date.
     ```
     The skill will read the proposal and design from the change directory to understand what was implemented and update AGENTS.md accordingly.

   - If skill is NOT available, read the change artifacts:
     - `openspec/changes/<change-name>/proposal.md`
     - `openspec/changes/<change-name>/design.md`

     Then read `AGENTS.md` and update manually focusing on **agent behavior (HOW agents should act)**:
     - **Workflow Procedures section**: Update if this change introduces new workflow steps (e.g., new pre-commit checks, new PR requirements)
     - **Decision Heuristics section**: Add new decision rules if this change creates situations requiring agent judgment
     - **Tool Preferences section**: Update if new tools were introduced or tool usage changed (e.g., new test runner, new linter)
     - **Guardrails section**: Add new "never do" or "always ask first" rules if this change creates new risk areas
     - **Pre-Commit Checklist**: Add new validation commands if required before commit
     - **Commit Messages section**: Update if commit convention changed
     - **DO NOT** add tech stack facts, domain concepts, or coding patterns (those belong in config.yaml)

   **For README.md** (`<repo-root>/README.md`) — IF it exists:
   - Check if `accelint-readme-writer` skill is installed
   - If skill is available:
     ```
     /accelint-readme-writer
     We have just completed the change spec openspec/changes/<change-name>. Given this change, we need to make sure that the README.md is current and up to date.
     ```
     The skill will read the proposal and design from the change directory to understand what was implemented and update README.md accordingly.

   - If skill is NOT available, read the change artifacts:
     - `openspec/changes/<change-name>/proposal.md`
     - `openspec/changes/<change-name>/design.md`

     Then read `README.md` and update manually focusing on **user-facing documentation**:
     - **Installation section**: Update commands if new dependencies or setup steps were added
     - **Features section**: Add bullet points for new user-facing features introduced by this change
     - **Quick Start section**: Update if the basic usage pattern changed
     - **Usage / API Reference section**: Update code examples if public API signatures changed or new exports were added
     - **Configuration section**: Add new configuration options if introduced
     - **Examples section**: Add new usage examples for new functionality
     - **DO NOT** document internal implementation details, architectural decisions, or non-exported functions

**Skill availability detection**: To check if an Accelint skill is installed, use one of:
- Check if skill appears in the available skills list in the system reminder
- Attempt to invoke the skill and catch errors if it doesn't exist
- Use Glob to search `.claude/skills/` or `~/.claude/skills/` for the skill name

**When to skip updates for a specific document**:
- Change is trivial (typo fixes, comment updates) and doesn't affect that document's scope
- Document doesn't exist
- Change content doesn't introduce anything requiring updates to that document

**Important**: Process all 4 documents sequentially, one after another, without stopping. Do not pause between documents or wait for user input unless there's an error. After finishing all 4 documents, immediately proceed to Phase 5 (Verify Implementation).

4. After checking all 4 documents, run `git status` to show which docs were modified

5. Present summary (then immediately continue to Phase 5):

   - If no updates were needed:
     ```
     📝 Living documents checked — no updates needed for this change

     Checked documents:
     - openspec/config.yaml [no changes needed]
     - ARCHITECTURE.md [no changes needed]
     - AGENTS.md [no changes needed]
     - README.md [no changes needed]

     Proceeding to Phase 5: Verify Implementation...
     ```

   - If updates were made:
     ```
     📝 Living documents updated

     Updated documents:
     - openspec/config.yaml [via accelint-onboard-openspec / manually / skipped]
     - ARCHITECTURE.md [via accelint-architecture-doc / manually / skipped]
     - AGENTS.md [via accelint-onboard-agent / manually / skipped]
     - README.md [via accelint-readme-writer / manually / skipped]

     These changes ensure documentation stays synchronized with implementation.

     Proceeding to Phase 5: Verify Implementation...
     ```

**Output**: Summary of updated documents and methods used (skill vs manual), or confirmation that no updates were needed, then **MANDATORY automatic transition to Phase 5 without waiting for user input**

### Phase 5: Verify Implementation

**Goal**: Verify that the implementation matches the change artifacts (specs, tasks, design).

**CRITICAL**: This is the FINAL phase. Verification is MANDATORY and produces a comprehensive report as the final output. Do NOT add additional reporting after this phase.

**Steps**:

1. Call the verify command:
   ```
   /opsx:verify <change-name>
   ```

2. The verify command will:
   - Check task completion (all checkboxes marked)
   - Verify spec coverage (requirements implemented)
   - Validate design adherence (decisions followed)
   - Check that living documents were updated appropriately
   - Generate a comprehensive verification report with CRITICAL/WARNING/SUGGESTION issues
   - Include next steps (archive if passed, fix issues if failed)

3. Present the verification report to the user

4. The verification report IS the completion report. It includes:
   - Overall status (passed/failed)
   - Issue breakdown by severity
   - List of changed files
   - Next steps based on status
   - Archive guidance if ready

5. Exit the skill after presenting the verification report. The report already tells the user what to do next.

**Output**: Comprehensive verification report with status, issues, changed files, and next steps

## Key Principles

### Context Management and Resumption

The skill supports pause/clear/resume workflow at dependency level boundaries:

- **Pause points**: After each level completes, the skill offers to continue or let the user clear context
- **Resumption detection**: When re-invoked, the skill reads tasks.md checkboxes to detect completed slices and resumes from the next incomplete level
- **Progress tracking**: Task completion is tracked in tasks.md via checkboxes, making progress durable across context clears
- **Rationale**: Sub-agents can accumulate significant context. Between dependency levels, the orchestrating agent can clear context while preserving work progress via task checkboxes.

**Why this matters**: Long implementations with many slices can bloat context. By offering pause points between levels, users maintain the flexibility to clear context (like in serial `opsx:apply`) while still benefiting from parallelization within each level.

### Intelligent Parallelization

The skill automatically detects parallelization opportunities from the "Parallelization Strategy" section in tasks.md. When slices are independent, it spawns multiple sub-agents to work in parallel, significantly reducing implementation time.

### Safe Defaults

If no parallelization strategy is found, the skill runs tasks sequentially. This ensures correctness even for changes that weren't planned with parallelization in mind.

### Verification Before Archive

The skill always runs `/opsx:verify` as the final step. This catches incomplete tasks, broken references, or schema violations before the user archives. The verification report serves as the completion summary.

### Human-in-the-Loop

The skill reports results and asks for guidance when:
- Validation fails
- Tasks are unclear or blocked
- Any error occurs during implementation

### Context Management

Each sub-agent receives:
- The full context files (proposal, design, specs, tasks)
- Clear instructions to implement ONLY their assigned slice
- Awareness that other slices may be running in parallel

This prevents sub-agents from stepping on each other's work while allowing them to see the full picture.

## Handling Edge Cases

**Circular dependencies**:
If the parallelization strategy contains circular dependencies (Slice A blocks B, B blocks A), detect this and report an error. Ask the user to fix the tasks.md file.

**Missing slices**:
If a slice is referenced in the parallelization strategy but doesn't exist in the task list, report an error and ask the user to fix tasks.md.

**Partial completion**:
If some tasks were already marked complete (from a previous session), resume from where it left off. Announce: "N/M tasks already complete. Resuming from Slice X."

**Sub-agent failure**:
If a sub-agent fails or times out:
- Report which slice failed and why
- Ask user if they want to retry that slice or handle it manually
- Do not proceed to dependent slices until the blocking slice succeeds

**No sub-agent support**:
If the environment doesn't support sub-agents (e.g., Claude.ai):
- Fall back to sequential execution (implement all tasks yourself)
- Inform user: "Sub-agents not available. Running tasks sequentially."

## NEVER Do This

**NEVER implement tasks directly** — Always delegate to `/opsx:apply` command via sub-agents. The /opsx:apply workflow loads context files (proposal, design, specs, tasks) and provides dynamic instructions based on OpenSpec's state management. If you implement tasks directly, you bypass OpenSpec's progress tracking and context loading.

**NEVER skip verification** — Phase 5 verification using `/opsx:verify` is mandatory as the final step. Verification catches incomplete tasks, unimplemented requirements, and design divergences. The verification report serves as the completion summary. Skipping verification risks archiving incomplete or incorrect implementations.

**NEVER proceed with invalid task format** — This skill depends on markdown checklist format (`- [ ] task`) for progress tracking and resumption detection. If tasks.md uses numbered lists or plain bullets, exit early with an error. Do not attempt to work around the format issue — the user must fix tasks.md first.

**NEVER skip dependency levels** — If Slice A blocks Slice B, Slice B cannot start until Slice A completes successfully. Do not spawn dependent slices before their blockers finish, even if it would speed up implementation. The dependency graph in the Parallelization Strategy must be respected.

**NEVER skip living document updates** — Phase 4 updates living documents (ARCHITECTURE.md, AGENTS.md, README.md, config.yaml) to keep documentation synchronized with implementation. This phase runs BEFORE verification so the verification step can check documentation completeness. Do not skip to verification without updating living documents first.

## Configuration Requirements

This skill assumes:
1. OpenSpec is installed and initialized
2. The change exists and has a tasks.md file
3. Sub-agent support is available (for parallel execution)
4. Git is initialized (for checking file changes)

If any are missing, report the issue and guide the user to set them up.

## Example Usage

**Scenario 1: Change with parallelization strategy**

```
User: Apply the remove-security-ruleset change

Skill: Applying change: remove-security-ruleset

Parsing parallelization strategy...

Execution plan:
- Level 0 (sequential): Slice 1 (Remove CLI surface)
- Level 1 (parallel): Slice 2 (Remove implementation), Slice 3 (Docs/verification)

Starting Level 0: Slice 1
[spawns sub-agent]
✓ Slice 1 complete (4 tasks, ~8 minutes)

Starting Level 1: Slices 2 and 3 in parallel
[spawns 2 sub-agents simultaneously]
✓ Slice 2 complete (4 tasks, ~6 minutes)
✓ Slice 3 complete (4 tasks, ~7 minutes)

Updating living documents...
📝 Living documents updated
- README.md [via accelint-readme-writer]
- ARCHITECTURE.md [via accelint-architecture-doc]

Running verification...
✅ Verification passed

**Verification Report**

**Change:** remove-security-ruleset
**Tasks:** 12/12 complete
**Files changed:** 67

All requirements implemented. No critical issues found.

### Next Steps
1. Review the changes: `git diff`
2. Run tests: `pnpm test`
3. Archive this change: `/opsx:archive remove-security-ruleset`

Ready to archive!
```

**Scenario 2: Verification failure**

```
User: Apply the auth-refactor change

Skill: Applying change: auth-refactor

[implementation proceeds...]

Updating living documents...
📝 Living documents updated
- ARCHITECTURE.md [via accelint-architecture-doc]

Running verification...
❌ Verification failed

**Verification Report**

**Change:** auth-refactor
**Critical Issues:**
- Task 3.2 in tasks.md is incomplete (checkbox not marked)
- Spec file specs/auth-service.md references non-existent file: src/old-auth.ts

**Next Steps:**
1. Fix critical issues
2. Re-run verification: `/opsx:verify auth-refactor`
3. Or re-invoke this skill to retry

Not ready to archive until critical issues are resolved.
```

**Scenario 3: No parallelization (safe fallback)**

```
User: Apply the update-readme change

Skill: Applying change: update-readme

No parallelization strategy found. Running tasks sequentially.

Working on task 1/3: Update installation section
✓ Complete

Working on task 2/3: Add examples section
✓ Complete

Working on task 3/3: Update changelog
✓ Complete

Updating living documents...
📝 Living documents updated
- README.md [via accelint-readme-writer]

Running verification...
✅ Verification passed

**Verification Report**

**Change:** update-readme
All tasks complete. Ready to archive!
```
