# Accelint QRSPI Apply

Orchestrate parallel implementation of QRSPI-planned OpenSpec changes through dependency-aware slice execution, living-document updates, and mandatory verification.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-qrspi-apply
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-qrspi-apply
```

## What This Does

This skill implements QRSPI-planned OpenSpec changes by:

- Parsing the parallelization strategy from tasks.md
- Spawning sub-agents to implement independent slices in parallel
- Tracking progress across dependency levels with resume support
- Updating living documents (config.yaml, ARCHITECTURE.md, AGENTS.md, README.md)
- Running verification before declaring the change archive-ready

The skill stops after verification. Archive the change when ready.

## What This Skill Contains

This is a pure instruction skill that teaches agents how to orchestrate OpenSpec change implementation:

- **SKILL.md** - Complete orchestration workflow (783 lines)
- **CHANGELOG.md** - Version history and design decisions
- **evals/** - Non-interactive evaluation set for guardrails and routing
- **README.md** - This file

No code, no dependencies, no runtime. The skill guides agent behavior through structured instructions.

## When to Use This

Use this skill when you have a QRSPI-planned change ready to implement:

- Change created via `accelint-qrspi-propose` 
- tasks.md with a "Parallelization Strategy" section
- Independent vertical slices that can run in parallel
- You want parallel execution for faster implementation

Trigger phrases:
- "apply this QRSPI change"
- "implement with parallelization"
- "run the parallel slices"
- "apply [change-name] using QRSPI"

**Note**: Standard OpenSpec changes without parallelization strategies should use `/opsx:apply` directly.

## Prerequisites

This skill requires your TARGET repository (where you'll use the skill) to have:

1. **OpenSpec CLI** - Installed and initialized (`openspec/` directory exists)
2. **Sub-agent support** - For parallel execution (Claude Code, not Claude.ai)
3. **Expanded OpenSpec workflows** - `explore`, `new`, `continue` enabled
4. **QRSPI-planned change** - Created via `accelint-qrspi-propose` with "Parallelization Strategy" in tasks.md

### Check workflow configuration in your target repo:

```bash
openspec config list
```

Look for `explore`, `new`, and `continue` in the workflows section.

### Enable if missing:

```bash
openspec config profile
# Select "expanded" from the list
openspec update
```

## How It Works

The skill executes these stages automatically:

```
┌─────────────────────────────────────────────────────────────────┐
│  Stage          Action                        Output            │
├─────────────────────────────────────────────────────────────────┤
│  Preflight      Select and validate change    Ready to proceed  │
│  Parse          Extract parallelization       Dependency graph  │
│  Load Context   Read config.yaml context      Project context   │
│  Execute        Run slices (parallel/serial)  Implemented code  │
│  Update Docs    Sync living documents         Updated docs      │
│  Verify         Run opsx:verify               Verification rpt  │
└─────────────────────────────────────────────────────────────────┘
```

### Preflight and Change Selection

1. Identifies the change to apply (from arguments or context)
2. If ambiguous, prompts you to select from available changes
3. If interaction is unavailable and multiple candidate changes exist, it stops safely and asks for an explicit change name instead of guessing
4. Verifies tasks.md exists and uses markdown checklist format
5. Exits early with clear errors if prerequisites aren't met

### Parse Tasks and Parallelization Strategy

1. Reads tasks.md from the OpenSpec change directory
2. Validates checklist format (`- [ ] task` or `- [x] task`)
3. Detects partial completion from checked tasks (supports resume)
4. Parses "Parallelization Strategy" section to build dependency graph
5. Creates execution plan showing sequential vs parallel slices

**Example dependency graph:**

```
Level 0 (must run first):
  - Slice 1: Remove CLI surface

Level 1 (can run in parallel after Level 0):
  - Slice 2: Remove implementation
  - Slice 3: Docs/verification
```

Falls back to sequential execution if no strategy is found.

### Load Project Context

Reads `openspec/config.yaml` when present and extracts the `context:` block for sub-agent guidance. This compensates for OpenSpec CLI's limitation where the apply command doesn't automatically inject project context.

The context provides Stack Facts, coding patterns, testing conventions, and anti-patterns that guide implementation. If the context block is missing, malformed, or its boundaries cannot be isolated confidently, the skill skips injection and proceeds without corrupted guidance.

### Execute Tasks

Implements tasks following the dependency graph:

**Sequential execution** (for slices with dependencies):
- Spawns one sub-agent per slice
- Waits for completion before proceeding to next level
- Each sub-agent invokes `/opsx:apply` with instructions to work only on its assigned slice

**Parallel execution** (for independent slices):
- Performs overlap check before parallelizing
- Spawns all slice sub-agents simultaneously when boundaries look safe
- Falls back to serial execution for the affected level when overlap risk or slice ambiguity is detected and interaction is unavailable
- Tracks completion as each finishes
- Reviews slice summaries for collisions before starting next level
- Offers pause/clear/resume options after each level

**Slice isolation**: Each sub-agent receives:
- Full context files (proposal, design, specs, tasks)
- Explicit instructions to implement ONLY its assigned slice
- Project context from config.yaml
- Awareness that other slices may be running in parallel

### Update Living Documents

Before verification, the skill checks living documents that may need updates:

- `openspec/config.yaml` (via `accelint-onboard-openspec` if available)
- `ARCHITECTURE.md` (via `accelint-architecture-doc` if available)
- `AGENTS.md` (via `accelint-onboard-agents` if available)
- `README.md` (via `accelint-readme-writer` if available)

Processes all documents in sequence. Uses specialized skills when available, falls back to manual updates when not. Skips documents that don't exist or don't need updates.

### Verify Implementation

Verification is mandatory:

1. Calls `/opsx:verify <change-name>`
2. Checks task completion, spec coverage, design adherence
3. Generates verification report with CRITICAL/WARNING/SUGGESTION issues
4. Blocks archival if CRITICAL issues exist
5. Approves for archive if only warnings/suggestions

The verification report serves as the completion report with status, issues, changed files, and next steps.

## Key Concepts

### Context Management and Resumption

The skill supports pause/clear/resume at dependency level boundaries:

- **Pause points**: After each level completes, you can continue or clear context
- **Resumption detection**: Re-invoking reads task checkboxes to detect completed slices
- **Progress tracking**: Task completion tracked via checkboxes, durable across context clears

Long implementations can bloat context. Pause points between levels let you clear context without losing progress.

### Intelligent Parallelization

The skill detects parallelization opportunities from the "Parallelization Strategy" section in tasks.md. When slices are independent, it spawns multiple sub-agents to work in parallel.

**Example time savings**:
- Sequential: 8 min + 6 min + 7 min = 21 minutes
- Parallel: 8 min + max(6, 7) min = 15 minutes

### Safe Defaults

If no parallelization strategy is found, the skill runs tasks sequentially. This ensures correctness for changes not planned with parallelization.

### Verification Before Archive

The skill always runs `/opsx:verify` before declaring the change archive-ready. This catches incomplete tasks, broken references, and schema violations.

### Vertical Slicing Requirement

This skill is designed for QRSPI's vertical slicing methodology. Each slice must be:

- A complete end-to-end feature increment
- Independent with minimal file overlap
- Testable in isolation
- Safe to implement in parallel

Horizontal (layer-by-layer) slicing breaks this model.

## Example Usage

### Basic parallelized change

```
User: Apply the remove-security-ruleset change

Skill: Applying change: remove-security-ruleset

Parsing parallelization strategy...

Execution plan:
- Level 0 (sequential): Slice 1 (Remove CLI surface)
- Level 1 (parallel): Slice 2 (Remove implementation), Slice 3 (Docs/verification)

Starting Level 0: Slice 1
✓ Slice 1 complete (4 tasks)

Starting Level 1: Slices 2 and 3 in parallel
✓ Slice 2 complete (4 tasks)
✓ Slice 3 complete (4 tasks)

Updating living documents...
📝 Living documents updated
- openspec/config.yaml [via accelint-onboard-openspec]
- ARCHITECTURE.md [via accelint-architecture-doc]
- README.md [via accelint-readme-writer]

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
3. Archive this change: `/accelint-qrspi-archive remove-security-ruleset`

Ready to archive!
```

### Validation failure

```
User: Apply the auth-refactor change

[implementation proceeds...]

Updating living documents...
📝 Living documents updated

Running verification...
❌ Verification failed

**Verification Report**

**Change:** auth-refactor
**Critical Issues:**
- Task 3.2 incomplete (checkbox not marked)
- Spec file specs/auth-service.md references non-existent file: src/old-auth.ts

**Next Steps:**
1. Fix critical issues
2. Re-run verification: `/opsx:verify auth-refactor`

Not ready to archive until critical issues are resolved.
```

### Partial completion (resume)

```
User: Apply the multi-stage-refactor change

Skill: Applying change: multi-stage-refactor

Detected partial completion. Resuming from Slice 3.

Execution plan:
✓ Level 0 complete: Slice 1, Slice 2 (already done)
- Level 1 (current): Slice 3, Slice 4 (starting now)

Starting Level 1: Slices 3 and 4 in parallel
✓ Slice 3 complete
✓ Slice 4 complete

Updating living documents...
📝 Living documents updated

Running verification...
✅ Verification passed

Ready to archive!
```

## Error Handling

**Invalid task format** (numbered lists or plain bullets):
- Exits early with error message
- Asks you to regenerate tasks.md with `accelint-qrspi-propose` or convert manually

**Sub-agent fails or times out**:
- Reports which slice failed and why
- Asks if you want to retry that slice or handle manually
- Does not proceed to dependent slices until blocking slice succeeds

**Circular dependencies detected**:
- Reports error showing the circular dependency
- Asks you to fix the parallelization strategy in tasks.md

**No sub-agent support** (e.g., Claude.ai):
- Falls back to sequential execution when possible
- Informs you: "Sub-agents not available. Running tasks sequentially."

## Tips

- Review the parallelization strategy before running to ensure slices are truly independent
- Check for overlap before parallelizing — if slices touch the same files or subsystem, consider running them sequentially
- Use pause points between levels to clear context on long implementations
- Don't skip verification, even if you're confident in the implementation
- If a slice fails, fix it and retry — the skill won't proceed past blocking slices
- Trust resumption detection — clear context mid-implementation and re-invoke to resume

## Related Skills

- **accelint-qrspi-propose** - Create QRSPI-planned changes (prerequisite)
- **accelint-qrspi-archive** - Archive completed changes (next step)
- **accelint-onboard-openspec** - Set up OpenSpec config
- **accelint-onboard-agents** - Create AGENTS.md
- **accelint-architecture-doc** - Update ARCHITECTURE.md
- **accelint-readme-writer** - Update README.md

## OpenSpec Commands Used

This skill orchestrates these OpenSpec CLI commands in your target repository:

- `/opsx:apply <change-name>` - Implement tasks (delegated to sub-agents)
- `/opsx:verify <change-name>` - Verify implementation matches artifacts
- `openspec list --json` - List available changes for selection
- `openspec status --change "<name>" --json` - Check change state

After this skill completes, you'll manually run:

- `/opsx:archive <change-name>` - Archive the completed change

## Version

Current version: **1.6.1**

See CHANGELOG.md for version history and design decisions.

## License

Apache-2.0