# Accelint QRSPI Apply

Implement OpenSpec changes with intelligent parallelization. This skill orchestrates parallel execution of independently-sliced tasks from QRSPI-planned changes, dramatically reducing implementation time while maintaining correctness.

## What This Does

Takes a QRSPI-planned OpenSpec change (created via `accelint-qrspi-propose`) and implements it using parallel sub-agents when possible:

- Parses the parallelization strategy from tasks.md
- Spawns sub-agents to implement independent slices in parallel
- Tracks progress across dependency levels
- Verifies implementation matches specs before archival
- Supports pause/resume workflow for context management

The skill stops after verification. You manually archive when ready.

## When to Use This

Invoke this skill when:

- You have a QRSPI-planned change ready to implement
- Your tasks.md includes a "Parallelization Strategy" section
- You want to leverage parallel execution for faster implementation
- You need progress tracking and resumption support across context clears

Trigger phrases:
- "apply this QRSPI change"
- "implement with parallelization"
- "run the parallel slices"
- "apply [change-name] using QRSPI"

**Note**: Standard OpenSpec changes without parallelization strategies should use `/opsx:apply` directly.

## Prerequisites

This skill requires:

1. **OpenSpec CLI** - Installed and initialized
2. **Sub-agent support** - For parallel execution (Claude Code, not Claude.ai)
3. **Expanded OpenSpec workflows** - `explore`, `new`, `continue` enabled
4. **QRSPI-planned change** - Created via `accelint-qrspi-propose` skill with "Parallelization Strategy" in tasks.md

### Check workflow configuration:

```bash
openspec config list
```

Look for `explore`, `new`, and `continue` in the `workflows:` section.

### Enable if missing:

```bash
openspec config profile
# Select "expanded" from the list
openspec update
```

## How It Works

### The Four-Phase Workflow

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

### Phase 0: Preflight and Change Selection

1. Identifies the change to apply (from arguments or context)
2. If ambiguous, prompts you to select from available changes
3. Verifies tasks.md exists and uses markdown checklist format
4. Exits early with clear errors if prerequisites aren't met

### Phase 1: Parse Tasks and Parallelization Strategy

1. Reads tasks.md from the OpenSpec change directory
2. Validates checklist format (`- [ ] task` or `- [x] task`)
3. Detects partial completion from checked tasks (resumption support)
4. Parses "Parallelization Strategy" section to build dependency graph
5. Creates execution plan showing which slices run sequentially vs in parallel

**Example dependency graph:**

```
Level 0 (must run first):
  - Slice 1: Remove CLI surface

Level 1 (can run in parallel after Level 0):
  - Slice 2: Remove implementation
  - Slice 3: Docs/verification
```

If no strategy is found, falls back to sequential execution (safe default).

### Phase 2: Execute Tasks

Implements tasks following the dependency graph:

**Sequential execution** (for slices with dependencies):
- Spawns one sub-agent per slice
- Waits for completion before proceeding to next level
- Each sub-agent invokes `/opsx:apply` with instructions to work only on its assigned slice

**Parallel execution** (for independent slices):
- Spawns all slice sub-agents simultaneously
- Tracks completion as each finishes
- After each level completes, offers pause/clear/resume options

**Slice isolation**: Each sub-agent receives:
- Full context files (proposal, design, specs, tasks)
- Explicit instructions to implement ONLY its assigned slice
- Awareness that other slices may be running in parallel

This prevents sub-agents from stepping on each other's work while maintaining full visibility.

### Phase 3: Verify Implementation

**MANDATORY** verification before declaring ready to archive:

1. Calls `/opsx:verify <change-name>`
2. Checks task completion, spec coverage, design adherence
3. Generates verification report with CRITICAL/WARNING/SUGGESTION issues
4. If CRITICAL issues exist, blocks archival and offers fix options
5. If only warnings/suggestions, approves for archive

### Phase 4: Report and Next Steps

Presents completion report:

```
✅ Implementation complete

**Change:** remove-security-ruleset
**Tasks:** 12/12 complete
**Verification:** ✅ Passed
**Files changed:** 67

### Summary
- Slice 1: Removed CLI commands and help text
- Slice 2: Removed implementation files and tests
- Slice 3: Updated docs and verification

### Changed files
[output from git status]

### Next steps
1. Review the changes: `git diff`
2. Run tests: pnpm test
3. Archive this change: `/opsx:archive remove-security-ruleset`

Ready to archive!
```

## Key Concepts

### Context Management and Resumption

The skill supports pause/clear/resume at dependency level boundaries:

- **Pause points**: After each level completes, you can continue or clear context
- **Resumption detection**: Re-invoking reads task checkboxes to detect completed slices and resumes from next incomplete level
- **Progress tracking**: Task completion tracked in tasks.md via checkboxes, durable across context clears

Long implementations with many slices can bloat context. By offering pause points between levels, you maintain flexibility to clear context while preserving work progress.

### Intelligent Parallelization

The skill automatically detects parallelization opportunities from the "Parallelization Strategy" section in tasks.md. When slices are independent, it spawns multiple sub-agents to work in parallel, significantly reducing implementation time.

**Example**: A 3-slice change with dependencies might take:
- Sequential: 8 min (Slice 1) + 6 min (Slice 2) + 7 min (Slice 3) = 21 minutes
- Parallel: 8 min (Slice 1) + max(6, 7) min (Slices 2&3 parallel) = 15 minutes

### Safe Defaults

If no parallelization strategy is found, the skill runs tasks sequentially. This ensures correctness even for changes that weren't planned with parallelization in mind.

### Validation Before Archive

The skill always runs `/opsx:verify` before declaring the change "ready to archive". This catches incomplete tasks, broken references, or schema violations before archival.

### Vertical Slicing Requirement

This skill is designed specifically for QRSPI's vertical slicing methodology. Each slice must be:

- A complete end-to-end feature increment
- Independent with minimal file overlap
- Testable in isolation
- Safe to implement in parallel

Horizontal (layer-by-layer) slicing breaks this model and should be converted to vertical slices in the propose phase.

## Example Usage

### Scenario 1: Change with parallelization strategy

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

Ready to archive! Run: `/opsx:archive remove-security-ruleset`
```

### Scenario 2: Validation failure

```
User: Apply the auth-refactor change

[implementation proceeds...]

Running validation...
❌ Validation failed

Errors:
- Task 3.2 in tasks.md is incomplete (checkbox not marked)
- Spec file specs/auth-service.md references non-existent file: src/old-auth.ts

Options:
1. Fix issues manually and re-validate
2. I can attempt to fix issues automatically

User: Fix them automatically

Skill: Attempting to fix validation errors...

- Marking task 3.2 as complete in tasks.md
- Updating spec reference from src/old-auth.ts → src/auth-service.ts

Re-running validation...
✅ Validation passed

Ready to archive!
```

### Scenario 3: Partial completion (resumption)

```
User: Apply the multi-stage-refactor change

Skill: Applying change: multi-stage-refactor

Detected partial completion. Resuming from Slice 3.

Execution plan:
✓ Level 0 complete: Slice 1, Slice 2 (already done)
- Level 1 (current): Slice 3, Slice 4 (starting now)

Starting Level 1: Slices 3 and 4 in parallel
[spawns 2 sub-agents]
✓ Slice 3 complete
✓ Slice 4 complete

Running validation...
✅ Validation passed

Ready to archive!
```

## Error Handling

**If tasks.md uses invalid format** (numbered lists or plain bullets):
- Exits early with error message
- Asks you to regenerate tasks.md with `accelint-qrspi-propose` or convert manually

**If sub-agent fails or times out**:
- Reports which slice failed and why
- Asks if you want to retry that slice or handle manually
- Does not proceed to dependent slices until blocking slice succeeds

**If circular dependencies detected**:
- Reports error showing the circular dependency
- Asks you to fix the parallelization strategy in tasks.md

**If no sub-agent support** (e.g., Claude.ai):
- Falls back to sequential execution (implements all tasks itself)
- Informs you: "Sub-agents not available. Running tasks sequentially."

## Configuration Requirements

This skill assumes:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. The change exists and has a tasks.md file with markdown checklist format
3. Sub-agent support available (for parallel execution)
4. Git initialized (for checking file changes)

If any are missing, the skill reports the issue and guides you through setup.

## Tips

Review the parallelization strategy before running. Make sure slices are truly independent.

Use pause points between levels to clear context on long implementations. Progress is saved in task checkboxes.

The verification phase is mandatory. Don't skip it, even if you're confident in the implementation.

If a slice fails, fix it and retry. The skill won't proceed past blocking slices.

Trust the resumption detection. If you clear context mid-implementation, re-invoke the skill and it'll pick up where you left off.

## Related Skills

- `accelint-qrspi-propose` - Create QRSPI-planned changes with parallelization strategies (phase 1, prerequisite for this skill)
- `accelint-onboard-openspec` - Set up OpenSpec configuration for your project
- `accelint-onboard-agent` - Create AGENTS.md with behavior rules

## OpenSpec Commands

This skill uses these OpenSpec CLI commands:

- `/opsx:apply <change-name>` - Implement tasks (delegated to sub-agents)
- `/opsx:verify <change-name>` - Verify implementation matches artifacts
- `openspec list --json` - List available changes for selection
- `openspec status --change "<name>" --json` - Check change state

After this skill completes, you'll use:

- `/opsx:archive <change-name>` - Archive the completed change
