# Accelint QRSPI Propose

Plan tickets, bugs, and feature requests through the QRSPI methodology before writing code. This skill walks through Questions → Research → Design → Structure, requires review checkpoints, and stops before implementation.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-qrspi-propose
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-qrspi-propose
```

## What This Does

Takes a ticket or feature request and produces a complete OpenSpec change:

- Research questions and answers (what we need to know before building)
- Design document (decisions, trade-offs, architectural choices)
- Delta specs (what changes in the system)
- Task breakdown (vertical slices for implementation)

The skill stops after planning. Run `/accelint-qrspi-apply <change-name>` when ready to implement.

## When to Use This

Use when:

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

This skill requires OpenSpec's expanded workflows: `explore`, `new`, and `continue`.

### Check if you have them

```bash
openspec config list
```

Look for these in the `workflows:` section:
- `explore`
- `new`
- `continue`

### Enable if missing

```bash
openspec config profile
# Select "expanded" from the list
openspec update
```

The skill checks this before running and guides you if configuration is needed.

## How It Works

### Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Stage          Context              Output          Checkpoint │
├─────────────────────────────────────────────────────────────────┤
│  Questions      Ticket only          Questions       —          │
│  Research       Questions only       Research doc    —          │
│  Design         Q+R (NO ticket)      proposal.md,    ✓ REVIEW   │
│                                      design.md                   │
│  Specs/Tasks    Q+R+design           specs/*, tasks  ✓ REVIEW   │
│  Done           —                    Exit            —          │
└─────────────────────────────────────────────────────────────────┘
```

#### Stage 1: Questions

Spawn a sub-agent that sees only the ticket and generates research questions. No solutions, just questions about what we need to know.

#### Stage 2: Research

A fresh sub-agent (new context) sees only the questions and answers them with facts from the codebase. The ticket is kept out of context to prevent "solution-first thinking".

#### Stage 3: Design Scaffolding

Create the OpenSpec change and generate `proposal.md` and `design.md`. A sub-agent receives questions + research (NO ticket) and creates artifacts under your project's `config.yaml` rules.

Required checkpoint: Review the design before continuing. After approval or confirmed manual edits, the skill captures `specs_touched` and `decisions` metadata in `design.md` frontmatter before moving on. Corrections here are cheap; corrections after code is written are expensive.

#### Stage 4: Specs & Tasks

Generate delta specs and task breakdown. A sub-agent receives questions + research + approved design (NO ticket) and creates the remaining artifacts with emphasis on vertical slicing.

Required checkpoint: Review the task breakdown to verify vertical slicing, not layer-by-layer slicing.

#### Stage 5: Completion

The skill reports completion and exits. You decide when to run `/clear` then `/accelint-qrspi-apply <change-name>` to start implementation.

## Key Concepts

### Context Isolation

The ticket text is deliberately kept out of context after Stage 1. This is the core QRSPI insight:

- Questions (ticket IN): "What do we need to know?"
- Research (ticket OUT): Objective facts only, no solution bias
- Design (ticket OUT): Decisions based on research, not ticket suggestions
- Tasks (ticket OUT): Structure based on design, not original request

This prevents "solution bias" where the ticket's suggested solution biases the artifacts.

### Human Checkpoints

Two required review gates:

1. **After design.md**: Catch wrong patterns, missing systems, scope issues
2. **After tasks.md**: Verify vertical slicing, phase ordering

You can:
- Approve and continue
- Request edits (the agent modifies the file in place)
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

The skill detects horizontal slicing and corrects it before review.

### No Automatic Implementation

The skill stops after planning. This allows:

- Creating multiple specs before implementation
- Clearing context between planning and coding
- User control over when implementation begins

When ready to start building, run `/clear`, then run `/accelint-qrspi-apply <change-name>`.

## Example Usage

```
/accelint-qrspi-propose

## Issue #42: Expand array chaining detection

The current filter-then-map rule only catches one pattern.
We need to detect all array method chains that create
intermediate arrays: map-filter, filter-forEach, 3+ chains, etc.

[Skill activates]

Agent: Checking OpenSpec configuration...
✓ Expanded workflows enabled

Generating research questions...
[Questions stage completes]

Answering research questions from codebase...
[Research stage completes]

Creating OpenSpec change and design artifact...
[Design generated]

Design artifact generated. Please review for:
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
3. Expanded profile enabled (workflows include `explore`, `new`, `continue`)
4. Agent behavior defined (`AGENTS.md` or `CLAUDE.md` exists, ideally via `accelint-onboard-agents`)

If anything is missing, the skill will guide you through setup.

## Error Handling

If OpenSpec commands fail, the skill surfaces the error and lets you retry or abort. It does not continue automatically.

If a sub-agent fails, you will see the error and can retry that stage. Manual fallback is limited to the Questions or Research stages; proposal, design, specs, and tasks still must be generated through `/opsx` commands.

If artifacts are missing after generation, the skill checks file paths and provides the expected locations for manual inspection.

## Tips

Start with clear tickets. The better the input, the better the questions. Include constraints, performance targets, and existing patterns to follow.

The design checkpoint is your leverage point. A five-minute review here prevents hours of rework later.

If the skill warns about horizontal slicing, listen. Layer-by-layer development hides integration issues until the end.

Do not rush to implementation. Create multiple specs before coding. Planning artifacts are cheap; code is expensive.

## Related Skills

- `accelint-onboard-openspec` - Set up OpenSpec configuration for your project
- `accelint-onboard-agents` - Create AGENTS.md with behavior rules
- `accelint-qrspi-apply` - Implement tasks from the generated change
- `accelint-qrspi-archive` - Archive completed changes with cross-capability linking