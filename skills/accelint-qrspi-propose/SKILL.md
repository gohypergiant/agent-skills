---
name: accelint-qrspi-propose
description: Plan a ticket, bug, feature request, or proposed product, CLI, or app change with the QRSPI and OpenSpec workflow before implementation. Use when the user wants to create or plan an OpenSpec change, run a formal planning workflow, generate structured proposal, design, specs, or tasks artifacts, scope or break down a change, or stop before writing code. Prefer this skill for spec-driven planning with required review checkpoints and an explicit no-implementation boundary. Do not use for implementation or resume-implementation work, archiving, generic architecture documentation, artifact-polish-only edits, or loose brainstorming that does not request OpenSpec planning outputs.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.6.5"
---

# Accelint QRSPI

This skill runs the QRSPI + OpenSpec planning workflow. It applies the methodology from "We Got RPI Wrong" through OpenSpec's artifact system, orchestrates the Questions → Research → Design → Structure stages, and requires human checkpoints before any code is written.

## What This Skill Does

- **Automates:** The planning phase of spec-driven development with QRSPI
- **Scope:** Questions → Research → Design → Structure/Plan, then stop before implementation
- **Output:** A complete OpenSpec change ready for `/opsx:apply`
- **Does NOT:** Implement code, run tests, create PRs, or archive changes

## Prerequisites

This skill requires the **expanded OpenSpec workflows** (`explore`, `new`, `continue`) to access the step-by-step artifact generation.

To verify these workflows are enabled:

```bash
openspec config list
```

Check that the `workflows:` section includes: `explore`, `new`, and `continue`.

If any are missing, enable the expanded profile:

```bash
openspec config profile
# Select "expanded" from the list
openspec update
```

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Stage          Context              Output          Checkpoint │
├─────────────────────────────────────────────────────────────────┤
│  Questions      Ticket only          Questions       —          │
│  Research       Questions only       Research doc    —          │
│  Design         Q+R (NO ticket)      proposal.md     —          │
│                                      design.md       —          │
│                                      [STOP HERE]                │
│  ⚠️  CHECKPOINT 1: Review design.md - MUST approve to continue  │
│  (frontmatter capture: specs_touched/decisions -> design.md)    │
│                                                                 │
│  Specs/Tasks    Q+R+design           specs/*         —          │
│                                      tasks.md        —          │
│  ⚠️  CHECKPOINT 2: Review tasks.md - MUST approve to continue   │
│                                                                 │
│  Done           —                    Exit            —          │
└─────────────────────────────────────────────────────────────────┘

Note: Keep the ticket OUT of context after the Questions stage.

REQUIRED: The Design generation stage (steps 17-25) generates ONLY `proposal.md` and `design.md`, then STOPS for review at step 26. The Specs and tasks generation stage (steps 32-42) generates `specs/*` and `tasks.md` separately after design approval.

Capture frontmatter at step 30 only after Checkpoint 1 approval. Earlier capture can write `specs_touched/decisions` against content the user is about to change.

REQUIRED: The agent MUST pause and wait for explicit user approval at both checkpoints (step 26 and step 43). Proceeding without approval bypasses QRSPI's core value.
```

## Implementation Steps

Execute this workflow in order. Do not stop between steps unless a step tells you to stop, wait, or return.

### Step 0: Track progress
Do this before any other work.

Create a progress checklist in your reply and update it after each completed stage, or use a task-tracking tool instead.

Done when: stage-by-stage progress tracking is active before Step 1 begins.

- [ ] Validation stage: Steps 1-6
- [ ] Questions stage: Steps 7-10
- [ ] Research stage: Steps 11-16
- [ ] Design generation stage: Steps 17-25
- [ ] Design review stage: Steps 26-31
- [ ] Specs and tasks generation stage: Steps 32-42
- [ ] Tasks review stage: Steps 43-45
- [ ] Completion stage: Steps 46-47

## Stage: Validation

Use this stage to confirm that the user supplied real planning input and that the required OpenSpec workflows are enabled before any QRSPI generation begins.

### Step 1: Validate user input
Check if the user provided a ticket, feature request, or idea in their prompt (either as skill arguments or in their message).

If the prompt is empty or contains only the skill invocation with no actual content, tell the user:
```
I need a ticket or feature description to plan. Please provide:

- A ticket ID and description (e.g., "ATI-123: Add user authentication...")
- A feature request ("I want to add dark mode support...")
- An idea or problem statement ("Users complain about slow search...")

Then I'll use QRSPI to break it down into a structured plan.
```

Done when:
- You confirmed that the user supplied real planning input, or
- You exited the skill and are waiting for the user to provide input.

Do NOT proceed with internal examples or placeholder content.

### Step 2: Announce the configuration check
Tell the user: "Checking OpenSpec configuration..."

### Step 3: Read the current OpenSpec configuration
Run `openspec config list` and parse the output.

### Step 4: Check for the required workflows
Check whether the `workflows:` section contains all three required workflows: `explore`, `new`, and `continue`.

### Step 5: Show the missing-workflows instructions when needed
Requires: Step 4 is complete.

If any required workflow is missing, show this exact guidance:
```
This skill requires the expanded OpenSpec workflows (explore, new, continue).

Your current workflows: [list what's enabled]
Missing: [list what's missing]

To enable the expanded workflows, run:

openspec config profile
# Select "expanded" from the list
openspec update

Then re-run this skill.
```

### Step 6: Stop if the required workflows are not enabled
Requires: Step 5 is complete when any required workflow is missing.

If the required workflows are not enabled, exit the skill.

## Stage: Questions

Use this stage to generate the research-question set.

Context isolation rule: the Questions sub-agent sees ONLY the validated ticket.

### Step 7: Prepare the Questions sub-agent input
Requires: Step 6 did not exit the workflow.

Use the validated ticket description from Step 1 as the only substantive input for the Questions sub-agent.

Done when: the ticket text is ready to pass forward without extra context.

### Step 8: Spawn the Questions sub-agent
Spawn a sub-agent with this exact prompt:

   ```
   /opsx:explore

   I have this ticket:

   [paste full ticket description here]

   Generate a list of research questions that will tell us everything we need
   to know before building this. Do not propose any solutions. Questions only.
   ```

### Step 9: Wait for the Questions sub-agent
Wait for the sub-agent to complete and return the questions.

Done when: you have the generated questions.

### Step 10: Store the generated questions
Requires: Step 9 is complete.

Extract and store the questions. Later steps pass them forward.

## Stage: Research

Use this stage to answer the research questions with facts only.

Context isolation rule: the Research sub-agent sees ONLY the stored questions, not the original ticket.

### Step 11: Confirm the research input set
Requires: Step 10 is complete.

Proceed only when the generated questions are stored and ready to pass forward without the original ticket.

### Step 12: Prepare the Research sub-agent input
Requires: Step 11 is complete.

Use ONLY the stored questions as input to the Research sub-agent. Do NOT include the original ticket.

Done when: the research input contains only the questions from Step 10.

### Step 13: Spawn the Research sub-agent
Spawn a NEW sub-agent (fresh context) with this exact prompt:

   ```
   /opsx:explore

   [paste ONLY the research questions from step 10]

   Answer each question with facts only. Observe what the codebase does today AND what the current specs of record say (scan openspec/specs/INDEX.md for capabilities whose name or Purpose line plausibly relates to these questions; for any that match, read the full specs/<capability>/spec.md file and include its current requirements and scenarios directly in your findings, not just a reference to the file). Do not suggest changes or implementation approaches.
   ```

### Step 14: Wait for the Research sub-agent
Wait for the sub-agent to complete and return the research document.

Done when: you have the research document.

### Step 15: Store the research answers
Requires: Step 14 is complete.

Store the research answers. Later steps use them.

Done when: the research answers are stored and ready for Step 16.

### Step 16: Confirm the design input set
Requires: Step 15 is complete.

Proceed only when both of these are available:
- the stored questions from Step 10
- the stored research answers from Step 15

## Stage: Design generation

Use this stage to generate `proposal.md` and `design.md`, then stop before specs or tasks are created.

Context isolation rule: the ticket MUST NOT be in context during artifact generation. Use only the stored questions and stored research answers.

### Step 17: Prepare the design-generation inputs
Requires: Step 16 is complete.

Assemble the inputs for design generation using:
- the stored questions from Step 10
- the stored research answers from Step 15

Do NOT include the original ticket text.

### Step 18: Read the design rules
Read `openspec/config.yaml` to extract the `rules.design` section.

### Step 19: Read agent behavior context for design generation
Read `CLAUDE.md` or `AGENTS.md` to extract agent behavior context.

### Step 20: Spawn the Design sub-agent
Spawn a sub-agent with this exact prompt:

   ```
   You are generating OpenSpec artifacts based on QRSPI research. You have access
   to the research questions and answers, but NOT the original ticket text. This
   prevents solution bias.

   Research Questions and Answers:
   [paste questions from step 10]

   Research Findings:
   [paste research doc from step 15]

   OpenSpec Design Rules (from config.yaml):
   [paste the rules.design section verbatim]

   Agent Behavior Context:
   [paste relevant sections from CLAUDE.md/AGENTS.md]

   CRITICAL: You MUST use /opsx commands to create and generate artifacts.
   DO NOT create files or write artifact content yourself. The /opsx commands
   will handle artifact generation following OpenSpec's configured rules.

   Now create the OpenSpec change with proposal and design artifacts:

   1. Run /opsx:new to create the change (OpenSpec will prompt for a slug)
   2. CRITICAL: Capture the change name/slug from the output and use it in all subsequent commands
   3. Run /opsx:continue <change-name> ONCE to generate proposal.md ONLY
   4. Run /opsx:continue <change-name> ONCE to generate design.md ONLY
   5. STOP after design.md - do NOT generate specs or tasks yet

   IMPORTANT: Let /opsx:continue generate proposal.md and design.md using the
   OpenSpec workflow. DO NOT write these files yourself. The /opsx:continue
   command handles artifact generation based on config.yaml rules.

   After design.md is generated (and ONLY proposal.md and design.md exist),
   report completion, the CHANGE NAME, and the path to the design file.

   IMPORTANT: You MUST report the change name explicitly at the end like:
   "Change name: <slug>"

   CRITICAL: STOP AFTER GENERATING DESIGN.MD. DO NOT CONTINUE TO SPECS OR TASKS.
   Your job ends here. The parent agent will handle the checkpoint and further steps.
   If you generate specs/* or tasks.md, you will bypass the mandatory design review.
   ```

### Step 21: Wait for the Design sub-agent
Wait for the sub-agent to complete.

Done when: the sub-agent reports completion.

### Step 22: Extract the change name
Requires: Step 21 is complete.

Extract the change name or slug from the sub-agent output. Look for "Change name:" or parse it from the file path.

### Step 23: Store the change name
Requires: Step 22 is complete.

Store the change name from Step 22 so later steps can reuse it.

Done when: the change name is stored and ready for Steps 30, 36, and 46.

### Step 24: Verify the reported `design.md` path
Requires: Step 21 is complete.

Check whether the reported `design.md` path exists.

If the file is missing:
- Stop.
- Follow the missing-artifact handling in Error Handling.
- Do NOT proceed to the checkpoint with an assumed path.

Done when: `design.md` exists at the reported path.

### Step 25: Enforce the handoff to design review
Requires: Step 24 is complete.
Done when: the workflow is blocked from specs/tasks generation until the design review checkpoint begins.

Do NOT continue to specs/tasks generation from this stage. The next valid step is the design review checkpoint at Step 26.

## Stage: Design review

Use this stage to review `design.md`, apply edits if needed, and capture frontmatter only after approval or confirmed manual edits.

Checkpoint rule: this is the "brain surgery" moment from the QRSPI talk. A correction here costs minutes; the same correction after implementation costs a code review cycle.

Approval rule: you MUST pause here and wait for explicit user approval. Do NOT proceed without it.

### Step 26: Pause for the design review checkpoint
You MUST pause here and wait for user input.
Do NOT proceed without explicit user approval.

### Step 27: Read the generated `design.md`
Requires: Step 24 is complete.

Read the generated `design.md` file.

### Step 28: Present `design.md` for review
Requires: Step 27 is complete.

Present it to the user with this framing:

   ```
   Design artifact generated. Please review for:

   - Wrong pattern references (did I find the legacy way instead of the current way?)
   - Unresolved assumptions presented as decisions
   - Missing affected systems (any service boundaries not mentioned?)
   - Scope creep (does the design cover more than the ticket?)

   Options:
   (a) Approve — continue to task breakdown
   (b) Request edits — tell me what to change, I'll modify in place
   (c) Manual edit — edit the file yourself, then tell me when ready
   ```

### Step 29: Handle the design review response
Requires: Step 28 is complete.

Wait for user input.

- **Branch 29a — Approve**: Go to Step 30.
- **Branch 29b — Request edits**:
  1. User describes changes.
  2. Make edits to `design.md` in place.
  3. Show the diff.
  4. Return to Step 28 for review.
- **Branch 29c — Manual edit**:
  1. Wait for user confirmation that edits are complete.
  2. Re-read `design.md`.
  3. Go to Step 30.

### Step 30: Capture `specs_touched` and `decisions` frontmatter
Requires: Branch 29a or Branch 29c is complete.
Done when: the frontmatter is captured, or the user has been told what is missing and the workflow follows the Error Handling section for this case.

Capture `specs_touched` and `decisions` ONLY after the user approves or confirms manual edits are complete. Earlier capture can write stale metadata if `design.md` changes during the same checkpoint.

Do this in order:

   1. Read the approved `design.md` and `proposal.md` for the final planning-pass content.
   2. Extract `specs_touched` from the capability names those files already declare as affected or introduced by the change. This is the change's own stated scope, read back out of approved content — not computed some other way. The delta spec files under `openspec/changes/<slug>/specs/` do not exist yet at this point, so there is nothing else to derive it from.
   3. Extract `decisions` from design.md's own decision content — the choices, rationale, and alternatives the design phase already worked through — and restructure them into `{id, choice, rationale, alternatives}` entries.
   4. Write both into `design.md`'s YAML frontmatter:

     ```yaml
     ---
     change: <change-name-from-step-23>
     specs_touched: [capability-a, capability-b]
     decisions:
       - id: D1
         choice: <short decision summary>
         rationale: <why this over the alternatives>
         alternatives: [<option>, <option>]
     ---
     ```

   **CRITICAL: Use inline array syntax for specs_touched** — Write `specs_touched: [cap-a, cap-b]` NOT multi-line YAML with hyphens. This keeps frontmatter format consistent with other fields that use inline arrays.

   5. If `design.md` already starts with a frontmatter block (e.g. OpenSpec's own metadata), merge into it rather than writing a second block.
   6. If `specs_touched` or a clear decisions list cannot be confidently read out of the approved `design.md` or `proposal.md`, do NOT guess — tell the user what is missing and ask them to add it to `design.md` directly.

This frontmatter is cross-skill bookkeeping metadata for `accelint-qrspi-archive`, not part of the design content `/opsx:continue` generates. Writing it here does not violate the "never generate artifacts yourself" rule (see NEVER Do This). Only the frontmatter block is changed.

### Step 31: Enforce explicit design approval
Requires: Step 29 is complete.

If the user does not explicitly approve, do NOT move forward.

Accepted approval examples include: "looks good", "approve", and "continue".
This checkpoint is required. Skipping it bypasses the core value of QRSPI methodology.

## Stage: Specs and tasks generation

Use this stage to generate `specs/*` and `tasks.md` from the approved design, then validate and correct vertical slicing if needed.

Context isolation rule: keep the ticket out of context. Use the stored questions, stored research answers, and approved `design.md`.

### Step 32: Prepare the specs/tasks-generation inputs
Requires: Steps 30 and 31 are complete.

Assemble the inputs for the final generation stage using:
- the stored questions from Step 10
- the stored research answers from Step 15
- the approved `design.md`

Do NOT include the original ticket text.

### Step 33: Read the approved `design.md`
Read the possibly user-edited `design.md` file from Step 30.

### Step 34: Read the spec and task rules
Read `openspec/config.yaml` to extract the `rules.spec` and `rules.tasks` sections.

### Step 35: Read agent behavior context for specs/tasks generation
Read `CLAUDE.md` or `AGENTS.md` for agent behavior context.

### Step 36: Spawn the Specs/Tasks sub-agent
Spawn a sub-agent with this exact prompt:

   ```
   You are generating OpenSpec specs and tasks based on QRSPI research and an
   approved design. You have access to research and design, but NOT the original
   ticket text.

   CHANGE NAME: <change-name-from-step-23>

   Research Questions and Answers:
   [paste questions from step 10]

   Research Findings:
   [paste research doc from step 15]

   Approved Design:
   [paste design.md content]

   OpenSpec Spec Rules (from config.yaml):
   [paste the rules.spec section verbatim]

   OpenSpec Tasks Rules (from config.yaml):
   [paste the rules.tasks section verbatim]

   Agent Behavior Context:
   [paste relevant sections from CLAUDE.md/AGENTS.md]

   CRITICAL: You MUST use /opsx:continue commands to generate artifacts.
   DO NOT generate specs or tasks.md content yourself. The /opsx:continue command
   will handle artifact generation following OpenSpec's configured rules.

   Now generate the remaining OpenSpec artifacts:

   1. Run /opsx:continue <change-name> to generate specs/* (delta specs)
   2. Run /opsx:continue <change-name> to generate tasks.md

   IMPORTANT: Let /opsx:continue generate tasks.md using the OpenSpec workflow.
   DO NOT write tasks.md yourself. The /opsx:continue command handles this.

   After tasks.md is generated, the parent agent will validate vertical slicing
   and add a "## Parallelization Strategy" section if needed.

   After tasks.md is generated, report completion and the path to the tasks file.
   ```

### Step 37: Wait for the Specs/Tasks sub-agent
Wait for the sub-agent to complete.

Done when: the sub-agent reports completion.

### Step 38: Verify the reported artifact paths
Requires: Step 37 is complete.

Confirm that `specs/*` and `tasks.md` exist at the reported paths.
If any expected file is missing, stop and follow the missing-artifact handling in Error Handling before reading or editing anything.

Done when: all expected generated artifacts exist.

### Step 39: Read the generated `tasks.md`
Requires: Step 38 is complete.

Read the generated `tasks.md` file.

### Step 40: Validate the vertical slicing structure
Requires: Step 39 is complete.
Done when: vertical slicing is validated, or horizontal or mixed slicing is detected and must be corrected in Step 41.

   **VERTICAL SLICING (required for qrspi-apply)**:

   Check whether each slice delivers an end-to-end testable feature path rather than a horizontal layer.

   Each slice MUST deliver an end-to-end testable feature path, NOT a horizontal
   layer. Structure the work so that after completing Slice 1, you have something
   demonstrable and testable.

   ✓ CORRECT - Vertical (end-to-end feature slices):
   ```
   Slice 1: Mock API + working frontend (user can see and click, no real data)
   Slice 2: Wire real service layer (now pulls actual data)
   Slice 3: Add database integration (data persists)
   ```

   ✗ WRONG - Horizontal (architectural layers):
   ```
   Slice 1: All database migrations
   Slice 2: All service layer changes
   Slice 3: All API endpoints
   Slice 4: All frontend components
   ```

   **Indicators of VERTICAL slicing (correct)**:
   - Each slice has a "Deliverable:" that describes a working, testable feature
   - Slices cross architectural boundaries (e.g., a slice touches both CLI and implementation)
   - Each slice ends with something demonstrable to a user or stakeholder
   - Parallelization is possible with minimal dependencies between slices

   **Indicators of HORIZONTAL slicing (incorrect)**:
   - Slices are organized by layer: "Database changes", "Service layer", "API routes", "Frontend"
   - Deliverables are architectural components, not user-facing features
   - Early slices cannot be tested end-to-end without later slices
   - Slices have sequential dependencies (must finish layer 1 before layer 2)

   Requirements for each slice:
   - Deliverable: A working, testable increment (e.g., "CLI with security removed from public API")
   - Test: Explicit verification steps showing the slice works end-to-end
   - Parallelization: Slices should be independent enough to implement concurrently with minimal blocking
   - Checkpoints: Each subtask has a "Test:" line describing verification
   - Size: Prefer 3-5 major slices; more than 5 suggests scope is too large
   - Duration: Max 2 hours per subtask; break larger work into smaller subtasks

### Step 41: Convert horizontal or mixed slicing when needed
Requires: Step 40 is complete.

If horizontal or mixed slicing is detected, automatically convert it to vertical slices.

The `qrspi-apply` skill requires vertical slicing. If `/opsx:continue` generated horizontal slices, you MUST restructure them before presenting them to the user.

Do this in order:

1. **Identify end-to-end feature paths**: Look for the smallest complete user-facing feature that touches all relevant architectural layers. For example:
   - Instead of: "Slice 1: All API changes" + "Slice 2: All CLI changes"
   - Convert to: "Slice 1: CLI help command (CLI + API)" + "Slice 2: CLI list command (CLI + API)"

2. **Restructure each slice** with these required elements:
   - **Deliverable:** - A working, demonstrable feature (not just "API endpoint exists")
   - **Test:** - Explicit verification showing the end-to-end path works
   - **Subtasks in markdown checklist format**: Each subtask MUST use `- [ ] instruction` format
   - Subtasks that cross layers (e.g., "- [ ] Update API handler" + "- [ ] Wire CLI command" + "- [ ] Add help text")

   CRITICAL: Preserve the markdown checklist format (`- [ ] ...`) for all subtasks.
   Do NOT use numbered lists (1. 2. 3.) or plain bullets (- without [ ]).
   The qrspi-apply skill depends on this format to track task completion.

3. **Preserve parallelization opportunities**: Structure slices to be independent.
   - Good: "Slice 1: auth flow" and "Slice 2: data export flow" are independent
   - Bad: "Slice 1: database schema" must complete before "Slice 2: service layer"

4. **Update Parallelization Strategy (if it exists)**: If `tasks.md` already has a `## Parallelization Strategy` section, revise it to reflect the new slice structure.
   - Update which slices can run in parallel.
   - Update which slices have dependencies.
   - If the section does not exist, add it in Step 42.

5. **Write changes to `tasks.md`**: Edit the file in place using the Edit tool.

6. **Show diff to user**: Display what changed and explain why (for example, "Converted from layer-based to feature-based slices for better parallelization"). Then proceed to Step 43, where the user reviews the final `tasks.md`.

Done when:
- Vertical slicing already passed validation, or
- The converted `tasks.md` is saved and ready for review at Step 43.

### Step 42: Check for and add `## Parallelization Strategy`
Requires: Step 40 is complete.
Done when: `tasks.md` already has an accurate `## Parallelization Strategy` section, or one has been added or updated.

   After vertical slicing is validated or corrected, check whether tasks.md contains a `## Parallelization Strategy` section.

   - If the section exists and accurately reflects the slice structure, go to Step 43.
   - If the section is missing or incomplete, you MUST add or update it NOW using the Edit tool
   to append to the end of tasks.md (after all slices):

   ```markdown
   ## Parallelization Strategy

   ### Dependencies (Must Complete First)

   - **Slice X** must wait until Slices Y-Z complete (reason)

   **Independent tasks (can run in parallel):**
   - Slice A and Slice B are independent → can implement simultaneously
   - Slice A and Slice C are independent → can implement simultaneously

   **Sequential dependencies:**
   - Slice D must complete before Slice E because (reason)

   **Critical path:**
   Slice X → Slice Y (reason for dependency)

   **Recommended implementation order:**
   1. Implement Slices A, B, C in parallel (description)
   2. Implement Slice D (description)
   3. Implement Slice E (description)
   ```

   Keep it simple and focused on:
   - Which slices can run in parallel (and why they're independent)
   - Which slices must be sequential (and the dependency reason)
   - Recommended order for implementation

   DO NOT overcomplicate with excessive detail or edge cases.

   **If the section exists and Step 41 changed the slice structure**, verify it accurately reflects the new vertical slice structure and update it if needed.

## Stage: Tasks review

Use this stage to review and approve `tasks.md`.

Approval rule: you MUST pause here and wait for explicit user approval. Do NOT proceed without it.

### Step 43: Pause for the tasks review checkpoint
Requires: Steps 41 and 42 are complete.

You MUST pause here and wait for explicit user approval.
Do NOT proceed without it.

Present `tasks.md` to the user for final approval:

   ```
   Specs and tasks generated.

   [If auto-converted:]
   ✓ Converted task structure to vertical slices for better parallelization
   and incremental delivery. Each phase now delivers an end-to-end testable feature.

   [If already vertical:]
   ✓ Task structure follows vertical slicing

   Options:
   (a) Approve — planning complete, ready for implementation
   (b) Request changes — tell me what to adjust
   (c) Manual edit — edit tasks.md yourself, then confirm
   ```

### Step 44: Handle the tasks review response
Requires: Step 43 is complete.

Handle user input with the same branch structure as Step 29:

- **Branch 44a — Approve**: Go to Step 46.
- **Branch 44b — Request changes**:
  1. User describes changes.
  2. Edit `tasks.md` in place.
  3. Show the diff.
  4. Return to Step 43 for review.
- **Branch 44c — Manual edit**:
  1. Wait for user confirmation that edits are complete.
  2. Re-read `tasks.md`.
  3. Return to Step 43 for review unless the user also explicitly approves.

### Step 45: Enforce explicit tasks approval
Requires: Step 44 is complete.

Wait for the user to explicitly approve the `tasks.md` structure.
If the user does not respond or the conversation ends, stop here.
Do NOT auto-proceed to completion.

## Stage: Completion

Use this stage to announce completion and exit without starting implementation.

### Step 46: Announce completion
Requires: Branch 44a is complete.

After `tasks.md` is approved, announce completion:

   ```
   ✅ QRSPI planning phase complete.

   Change name: <change-name-from-step-23>

   Generated artifacts:
   - openspec/changes/<change-slug>/proposal.md
   - openspec/changes/<change-slug>/design.md
   - openspec/changes/<change-slug>/specs/*
   - openspec/changes/<change-slug>/tasks.md

   Next steps:
   1. Review the artifacts one more time if needed
   2. Run `/clear` to start fresh context for implementation
   3. Run `/accelint-qrspi-apply <change-name>` to begin implementation

   This allows you to create multiple specs before implementation and
   maintains proper context management.
   ```

### Step 47: Exit the skill
Requires: Step 46 is complete.

Exit the skill. Do NOT automatically invoke `/accelint-qrspi-apply`.

## Key Principles

### Context Isolation (QRSPI Core)

The two-context-window pattern is essential:

- **Questions stage**: The validated ticket is IN context → generates questions
- **Research stage**: The original ticket is OUT of context, only the stored questions are IN context → objective facts
- **Design generation and Specs/tasks generation stages**: The original ticket stays OUT of context. Use only the stored questions, stored research answers, and then the approved `design.md` as the workflow advances.

This prevents "solution-first thinking" where the agent jumps to implementation ideas during research or artifact generation.

### Human Checkpoints

Two required review gates:

1. **After design.md**: Catch wrong patterns, missing systems, scope issues
2. **After tasks.md**: Verify vertical slicing, phase ordering

These are the highest-leverage moments for corrections — before any code is written.

### Vertical Slicing Enforcement

The skill MUST actively check for and correct horizontal (layer-by-layer) slicing. Each slice MUST deliver a testable end-to-end feature path.

### No Automatic Implementation

The skill stops after planning. The user explicitly runs `/accelint-qrspi-apply <change-name>` when ready. This allows:

- Multiple specs to be created before any implementation starts
- Context clearing between planning and implementation
- User control over when implementation begins

## Error Handling

**If OpenSpec commands fail**:
- Surface the error to the user.
- Ask whether they want to retry or abort.
- Do NOT continue to the next step on failure.

**If the sub-agent fails**:
- Show the error from the sub-agent.
- Ask whether the user wants to retry that step or provide manual input.
- Allow manual fallback only for the Questions or Research stages, where the user can provide questions or research directly.
- Do NOT manually synthesize `proposal.md`, `design.md`, `specs/*`, or `tasks.md`; the Design generation and Specs and tasks generation stages MUST still go through `/opsx` commands.

**If `specs_touched` or `decisions` cannot be confidently read out of approved `design.md` or `proposal.md` (step 30)**:
- Do NOT guess. Show the user what is missing, for example, "no capability declarations found" or "no decisions with a stated rationale".
- Ask the user to add the missing content to `design.md` directly, then return to step 30.
- Do NOT block later steps on this. A change can proceed to specs/tasks without this frontmatter, but `accelint-qrspi-archive` will need to derive it later from `proposal.md` and the by-then-existing delta specs instead of reading it from frontmatter.

**If `design.md` or `tasks.md` is missing after generation**:
- Check whether the file exists at the expected path.
- If it is missing, ask the user to verify OpenSpec configuration.
- Provide the expected path for manual inspection.
- Stop at that failed check. Do NOT continue to the design review stage, tasks review stage, or any rewrite step until the file exists.

## Configuration Requirements

This skill assumes the project has:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. `openspec/config.yaml` configured (ideally via `accelint-onboard-openspec` skill)
3. Expanded OpenSpec profile enabled
4. `AGENTS.md` or `CLAUDE.md` defining agent behavior (ideally via `accelint-onboard-agents` skill)

If any of these are missing, guide the user to set them up before running this skill.

## NEVER Do This

**NEVER generate artifacts yourself** — Always use `/opsx` commands (`new`, `continue`) to create `proposal.md`, `design.md`, `specs/*`, and `tasks.md`. The `/opsx` workflow handles artifact generation under OpenSpec's configured rules. If you write artifacts directly, you bypass the project's design, spec, and task rules and create inconsistent outputs. The one narrow exception is step 30's `specs_touched`/`decisions` frontmatter block. That block is cross-skill bookkeeping metadata for `accelint-qrspi-archive`, derived from content `/opsx:continue` already generated and already approved by the user, not new design content. Even there, only the YAML frontmatter block is written; the `design.md` body is never touched by this step.

**NEVER generate `tasks.md` from scratch** — Always use `/opsx:continue` to create the initial `tasks.md`. However, you MUST restructure it if the generated output uses horizontal slicing instead of vertical slicing. The `qrspi-apply` skill requires vertical slicing. If `/opsx:continue` generates horizontal slices (organized by architectural layer), convert them to vertical slices (end-to-end feature deliverables) by following the validation guidance in step 41. When restructuring, preserve the markdown checklist format (`- [ ] task`). Do NOT convert it to numbered lists or plain bullets.

**NEVER use numbered lists or plain bullets in `tasks.md`** — All subtasks MUST use markdown checklist format: `- [ ] instruction`. The `qrspi-apply` skill tracks completion by checking and unchecking these boxes. If you see numbered lists (`1. 2. 3.`) or plain bullets (`-` without `[ ]`), convert them to `- [ ] ...` format.

**NEVER overcomplicate Parallelization Strategy** — Keep it simple. List which slices can run in parallel, which slices have sequential dependencies, and the recommended implementation order. Do NOT add excessive detail about every possible edge case or coordination mechanism. The example in this skill shows the right level of detail.

**NEVER continue to specs/tasks without design approval** — Step 26 is a required checkpoint. If you skip the design review and generate tasks immediately, you miss the "brain surgery" moment, where corrections are cheap. Fixing design issues after code is written costs review cycles and rework.

**NEVER capture `specs_touched`/`decisions` frontmatter before `design.md` is in its final, approved state** — Step 30 runs only after step 29a or step 29c, never during step 29b or speculatively ahead of approval. Capturing it against a draft that is still being revised creates exactly the stale metadata `accelint-qrspi-archive` depends on this skill not producing.

**NEVER guess `specs_touched` or `decisions` when they cannot be confidently read out of the approved `design.md` or `proposal.md`** — Ask the user to add what is missing to `design.md` directly instead. A silently invented capability list is worse than a visible gap because `accelint-qrspi-archive` will trust this frontmatter as the author's explicit statement of scope.

**NEVER let the ticket leak past the Questions stage** — Questions are generated WITH ticket context, but every later stage must keep the original ticket out of context. The Research stage sees ONLY the stored questions. The Design generation and Specs and tasks generation stages use only the stored questions, stored research answers, and then the approved `design.md` as the workflow advances. If the ticket stays in context after the Questions stage, the agent will propose solutions instead of gathering objective facts or generating artifacts from the approved research flow.

**NEVER skip the required checkpoints** — Step 26 and step 43 require explicit user approval before continuing. If you proceed without waiting for user confirmation ("looks good", "approve", "continue"), you bypass the core value of QRSPI: cheap corrections at the design stage. The "brain surgery" moment is when design is reviewed BEFORE specs/tasks are generated. Skipping checkpoints defeats the entire methodology.

## Example Usage

```text
User: I want to plan this ticket using QRSPI:

## ATI-12: smart-ls CLI tool
Create a CLI tool that returns structured directory listings as JSON...
```