---
name: accelint-qrspi-apply
description: Implement QRSPI-planned OpenSpec changes with intelligent parallelization. Use when the user wants to apply a QRSPI change, implement tasks with parallelization, or says "apply this QRSPI change", "implement with parallelization", "run the parallel slices". This skill is specifically designed for changes created via accelint-qrspi that include "Parallelization Strategy" sections in tasks.md. It orchestrates parallel sub-agent execution for independent task slices using OpenSpec CLI workflows. Make sure to use this skill when the user mentions applying QRSPI changes, running parallel implementation, or working on changes with vertical slices.
license: Apache-2.0
compatibility: Requires openspec CLI, sub-agent support, and QRSPI-generated changes.
metadata:
  author: accelint
  version: "1.0.0"
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
│  Execute        Run slices (parallel/serial)  Implemented code  │
│  Verify         Run opsx:verify               Verification rpt  │
│  Report         Show results + next steps     Archive or fix    │
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
2. **Check for partial completion** (resumption detection):
   - Count completed tasks (marked `- [x]`) vs total tasks
   - Parse which slices have all their tasks marked complete
   - If any slices are complete, announce: "Detected partial completion. Resuming from Slice N."
   - Adjust the execution plan to skip completed slices

3. Look for the "Parallelization Strategy" section (usually at the end of the file)
4. Parse the strategy to build a dependency graph:

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

4. If no "Parallelization Strategy" section exists:
   - Assume all tasks must run sequentially (safe default)
   - Inform user: "No parallelization strategy found. Running tasks sequentially."

5. Build an execution plan showing:
   - Which slices run in which order
   - Which slices can run in parallel (and which are already complete)
   - Total estimated parallelization speedup
   - Starting point (Level 0 or resuming from Level N)

**Output**: Dependency graph, execution plan, and resumption point if applicable

### Phase 2: Execute Tasks (Sequential + Parallel)

**Goal**: Implement tasks following the dependency graph, spawning parallel sub-agents where possible.

**Sequential execution** (when tasks have dependencies):

For each level in the dependency graph (starting from level 0):

1. If the level has only one slice:
   - Spawn a single sub-agent with this prompt:
     ```
     /opsx:apply <change-name>

     IMPORTANT: This is Slice N of a parallelized QRSPI implementation.
     
     Context: This slice must complete before other slices can proceed.
     Other slices will start after you finish.

     Instructions:
     - Work ONLY on tasks in Slice N: [list slice N tasks/sections]
     - Do NOT implement tasks from other slices (Slices X, Y, Z will be handled separately)
     - Follow the normal OpenSpec apply workflow:
       * OpenSpec will load context files (proposal, design, specs, tasks)
       * Implement the tasks assigned to Slice N
       * Mark tasks complete as you go: `- [ ]` → `- [x]`
       * Test your changes if tests are specified in the tasks
     - Report completion with summary of changes made

     Focus exclusively on Slice N. Leave other slice tasks unchecked.
     ```

2. Wait for completion before proceeding to the next level

**Parallel execution** (when multiple slices are independent):

For each level with multiple independent slices:

1. Spawn all sub-agents in parallel in a single turn (one per slice):
   ```
   /opsx:apply <change-name>

   IMPORTANT: This is Slice N of a parallelized QRSPI implementation.
   
   Context: This slice is independent and runs in parallel with Slices X, Y.
   Other agents are working on those slices simultaneously.

   Instructions:
   - Work ONLY on tasks in Slice N: [list slice N tasks/sections]
   - Do NOT implement tasks from other slices - they are being handled in parallel
   - Follow the normal OpenSpec apply workflow:
       * OpenSpec will load context files (proposal, design, specs, tasks)
       * Implement the tasks assigned to Slice N
       * Mark tasks complete as you go: `- [ ]` → `- [x]`
       * Test your changes if tests are specified in the tasks
   - Report completion with summary of changes made
   - Expect potential merge conflicts when parallel work is integrated

   Focus exclusively on Slice N. Leave other slice tasks unchecked.
   Your work is independent and should not block or depend on other slices.
   ```

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

**Handling merge conflicts**:

When parallel slices complete, check for merge conflicts:

```bash
git status
```

If conflicts exist:
- Report to user: "Parallel slices caused merge conflicts in: [list files]"
- Ask user to resolve conflicts manually or provide guidance
- Wait for confirmation before proceeding

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

### Phase 3: Verify Implementation

**Goal**: Verify that the implementation matches the change artifacts (specs, tasks, design).

**Steps**:

1. Call the verify command:
   ```
   /opsx:verify <change-name>
   ```

2. The verify command will:
   - Check task completion (all checkboxes marked)
   - Verify spec coverage (requirements implemented)
   - Validate design adherence (decisions followed)
   - Generate a verification report with CRITICAL/WARNING/SUGGESTION issues

3. Present the verification report to the user as-is

4. If CRITICAL issues exist:
   ```
   ⚠️ Critical issues found. Cannot archive until resolved.
   
   [verification report from opsx:verify]
   
   Options:
   1. Fix issues manually and re-verify
   2. I can attempt to fix issues automatically
   ```

5. If only warnings/suggestions:
   ```
   ✅ No critical issues found
   
   [verification report from opsx:verify]
   
   Ready to archive! (Note warnings above for future consideration)
   ```

**Output**: Verification report from `opsx:verify`

### Phase 4: Report and Next Steps

**Goal**: Summarize the implementation session and guide user on next steps.

**Steps**:

1. Read the final tasks.md to count completed vs total tasks
2. Run `git status` to show changed files
3. Present completion report:

   **If verification passed (no CRITICAL issues):**
   ```
   ✅ Implementation complete

   **Change:** <change-name>
   **Tasks:** N/N complete
   **Verification:** ✅ Passed (see report above for any warnings/suggestions)
   **Files changed:** M

   ### Summary
   - Slice 1: [brief description of changes]
   - Slice 2: [brief description of changes]
   - Slice 3: [brief description of changes]

   ### Changed files
   [output from git status --short]

   ### Next steps
   1. Review the changes: `git diff`
   2. Run tests: [project-specific test command]
   3. Archive this change: `/opsx:archive <change-name>`

   Ready to archive!
   ```

   **If verification failed (CRITICAL issues):**
   ```
   ⚠️ Implementation complete with critical issues

   **Change:** <change-name>
   **Tasks:** N/N complete
   **Verification:** ❌ Failed (see report above)
   **Files changed:** M

   ### Critical Issues
   [CRITICAL issues from verification report]

   ### Next steps
   1. Fix critical issues
   2. Re-run verification: `/opsx:verify <change-name>`
   3. Or re-invoke this skill to retry

   Not ready to archive until critical issues are resolved.
   ```

4. Exit the skill — do NOT automatically archive

**Output**: Completion report with status and next steps

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

### Validation Before Archive

The skill always runs `openspec validate` before declaring the change "ready to archive". This catches incomplete tasks, broken references, or schema violations before the user archives.

### Human-in-the-Loop

The skill reports results and asks for guidance when:
- Merge conflicts occur from parallel execution
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

## Configuration Requirements

This skill assumes:
1. OpenSpec is installed and initialized
2. The change exists and has a tasks.md file
3. Sub-agent support is available (for parallel execution)
4. Git is initialized (for checking file changes and merge conflicts)

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

Running validation...
✅ Validation passed

✅ Implementation complete

**Change:** remove-security-ruleset
**Tasks:** 12/12 complete
**Validation:** ✅ Passed
**Files changed:** 67

Ready to archive! Run: `/opsx:archive remove-security-ruleset`
```

**Scenario 2: Validation failure**

```
User: Apply the auth-refactor change

Skill: Applying change: auth-refactor

[implementation proceeds...]

Running validation...
❌ Validation failed

Errors:
- Task 3.2 in tasks.md is incomplete (checkbox not marked)
- Spec file specs/auth-service.md references non-existent file: src/old-auth.ts

Options:
1. Fix issues manually and re-validate
2. I can attempt to fix issues automatically
3. Skip validation and proceed (not recommended)

User: Fix them automatically

Skill: Attempting to fix validation errors...

- Marking task 3.2 as complete in tasks.md
- Updating spec reference from src/old-auth.ts → src/auth-service.ts

Re-running validation...
✅ Validation passed

Ready to archive!
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

Running validation...
✅ Validation passed

All tasks complete. Ready to archive!
```
