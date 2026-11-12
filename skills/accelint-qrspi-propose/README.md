# Accelint QRSPI Propose

Automate the planning phase of spec-driven development. This skill walks through Questions → Research → Design → Structure (QRSPI) and requires review checkpoints before any code is written.

It runs three internal stages in order. Each stage is a file in `references/` (`stage-questions.md`, `stage-research.md`, `stage-plan.md`), so one install carries the whole workflow.

## What This Does

Takes a ticket or feature request and produces a complete OpenSpec change:

- Research questions and answers, saved as `questions.md` and `research.md` (what we need to know before building)
- Design document (decisions, trade-offs, architectural choices)
- Delta specs (what changes in the system)
- Task breakdown (vertical slices for implementation)

The skill stops after planning. You run `/accelint-qrspi-apply <change-name>` when you are ready to implement.

## When to Use This

Invoke this skill when:

- Planning a new feature or change before writing code
- You have a ticket/issue that needs design work
- You want to follow QRSPI methodology for spec-driven development
- You need human-in-the-loop checkpoints during planning

Trigger phrases:
- "plan this ticket using QRSPI"
- "start a QRSPI workflow"
- "use QRSPI to plan this change"
- "create spec-driven change"

## Prerequisites

### OpenSpec workflows

This skill needs the OpenSpec workflows `explore`, `new`, and `continue` to be enabled. Check with:

```bash
openspec config list
```

Look for them in the `workflows:` section. If any is missing, the skill stops and tells you which ones. Enable them in your OpenSpec configuration and run the skill again.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  Stage      Runs as           Sees                Writes        │
├─────────────────────────────────────────────────────────────────┤
│  Setup      this skill        Ticket              change folder │
│  Questions  sub-agent         Ticket only         questions.md  │
│  Research   sub-agent         questions.md only   research.md   │
│  Plan       this skill, with  Q+R (NO ticket)     proposal.md   │
│             ticket-blind                          design.md     │
│             sub-agents                            tasks.md      │
│  ✓ REVIEW after proposal.md and design.md                       │
│  ✓ REVIEW after tasks.md                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Setup

The skill creates the OpenSpec change folder first, naming it from your ticket in the same way `openspec-new-change` does. Everything below is saved in that folder.

### Questions

A sub-agent sees only the ticket and generates research questions. No solutions, just questions about what we need to know. The skill saves them as `questions.md`.

### Research

A fresh sub-agent sees only the path of `questions.md` and answers the questions with facts from the codebase and the current specs. The ticket is kept out of context to prevent "solution-first thinking". The skill saves the answers as `research.md`.

Both files start with `Snapshot: <date> @ <git short SHA>` so anyone who finds them later knows when they were true, and end with a completion marker so a partial file is never read as complete. They are internal inputs to the design step: the skill does not show them to you, but you can open them in the change folder.

### Plan

The skill follows `references/stage-plan.md` in the same conversation (not as a hidden sub-agent), because it needs you to approve two checkpoints.

1. **Design.** A sub-agent receives questions + research (NO ticket) and creates `proposal.md` and `design.md` under your project's `config.yaml` rules. OpenSpec may also generate `specs/*`; those delta specs are bookkeeping and are not part of the review.
   - **Required checkpoint:** you review `proposal.md` and `design.md` before continuing. This is the "brain surgery" moment. Corrections here are cheap; corrections after code is written are expensive.
2. **Tasks.** A sub-agent receives questions + research + the approved design (NO ticket) and creates `tasks.md` with an emphasis on vertical slicing.
   - **Required checkpoint:** you review the task breakdown to ensure vertical slicing (not layer-by-layer).

### Completion

The skill reports completion and exits. You decide when to run `/accelint-qrspi-apply <change-name>` to start implementation.

### Resuming

To continue a change that was interrupted, ask the skill to resume it by name. There is no state file; it reads the change folder to see how far the work got. If the questions stage is incomplete you will need to paste the ticket again, because the ticket is never saved to disk.

## Key Concepts

### Context Isolation

The ticket text is deliberately kept out of every sub-agent after the Questions stage. This is the core QRSPI insight:

- Questions (ticket IN): "What do we need to know?"
- Research (ticket OUT): Objective facts only, no solution bias
- Design (ticket OUT): Decisions based on research, not ticket suggestions
- Tasks (ticket OUT): Structure based on design, not original request

This prevents "solution bias" where the ticket's suggested solution biases the artifacts. The ticket is never written to disk; the change folder name (a few words derived from the ticket) is the only ticket-derived text later stages see. This is a prompt convention, not a filesystem guarantee.

### Human Checkpoints

Two required review gates:

1. **After proposal.md and design.md**: Catch wrong patterns, missing systems, scope issues
2. **After tasks.md**: Verify vertical slicing, phase ordering

You can:
- Approve and continue
- Request edits (the agent modifies in place)
- Edit manually (you modify the file, then confirm when done)

The skill will not proceed without your explicit approval.

### Vertical Slicing

Task phases should deliver testable end-to-end slices, not layer-by-layer work:

**Good (vertical):**
```
Phase 1: Basic detection working end-to-end (hardcoded pattern, manual test)
Phase 2: Add configurable patterns (config file, integration test)
Phase 3: Add CLI output formatting (JSON/text, E2E test)
```

**Bad (horizontal):**
```
Phase 1: All database changes
Phase 2: All service layer changes
Phase 3: All API changes
Phase 4: All frontend changes
```

The skill checks for horizontal slicing and corrects it before review if it detects it.

### No Automatic Implementation

The skill stops after planning. This allows:

- Creating multiple specs before implementation
- Clearing context between planning and coding
- User control over when implementation begins

Run `/clear` and `/accelint-qrspi-apply <change-name>` when you are ready to start building.

## Example Usage

```
/accelint-qrspi-propose

## Issue #42: Expand array chaining detection

The current filter-then-map rule only catches one pattern.
We need to detect all array method chains that create
intermediate arrays: map-filter, filter-forEach, 3+ chains, etc.

[Skill activates]

Agent: Checking OpenSpec configuration...
✓ Required workflows enabled (explore, new, continue)

Creating the change folder...
[Folder created: expand-array-chaining-detection]

Generating research questions...
[questions.md saved]

Answering research questions from codebase...
[research.md saved]

Generating the design...
[proposal.md and design.md generated]

Proposal and design artifacts generated. Please review for:
- Wrong pattern references
- Unresolved assumptions
- Missing affected systems
- Scope creep

Options:
(a) Approve — continue to task breakdown
(b) Request edits — tell me what to change
(c) Manual edit — edit the file yourself

User: (a)

[Specs and tasks generated]

Specs and tasks generated. Phase structure: vertical ✓

✅ QRSPI planning phase complete.

Generated artifacts:
- openspec/changes/expand-array-chaining-detection/questions.md
- openspec/changes/expand-array-chaining-detection/research.md
- openspec/changes/expand-array-chaining-detection/proposal.md
- openspec/changes/expand-array-chaining-detection/design.md
- openspec/changes/expand-array-chaining-detection/specs/*
- openspec/changes/expand-array-chaining-detection/tasks.md

Next steps:
1. Review the artifacts one more time if needed
2. Run /clear to start fresh context for implementation
3. Run /accelint-qrspi-apply <change-name> to begin implementation
```

## Configuration Requirements

The skill assumes your project has:

1. OpenSpec installed (`openspec/` directory exists)
2. config.yaml configured with rules for design, specs, tasks (ideally via `accelint-onboard-openspec`)
3. OpenSpec workflows `explore`, `new`, and `continue` enabled
4. Agent behavior defined (`AGENTS.md` or `CLAUDE.md` exists, ideally via `accelint-onboard-agents`)

If anything is missing, the skill will guide you through setup.

## Error Handling

If OpenSpec commands fail, the skill surfaces the error and lets you retry or abort. It does not continue automatically.

If a sub-agent fails, you will see the error and can retry that phase or provide manual input (you write the questions or research yourself).

If artifacts are missing after generation, the skill checks file paths and provides the expected locations for manual inspection.

## Tips

Start with clear tickets. The better the input, the better the questions. Include constraints, performance targets, and existing patterns to follow.

The design checkpoint is your leverage point. A 5-minute review here prevents hours of rework later.

If the skill warns about horizontal slicing, listen. Layer-by-layer development hides integration issues until the end.

Do not rush to implementation. It is fine to create multiple specs before coding. Planning artifacts are cheap; code is expensive.

## Related Skills

- `accelint-onboard-openspec` - Set up OpenSpec configuration for your project
- `accelint-onboard-agents` - Create AGENTS.md with behavior rules
- `accelint-qrspi-apply` - Implement tasks from the generated change
- `opsx:verify` - Verify implementation matches artifacts before archiving
