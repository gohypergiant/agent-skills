---
name: accelint-qrspi-propose
description: Use this skill when the user wants to start the formal QRSPI/OpenSpec planning workflow for a ticket, bug, feature request, or proposed product/CLI/app change before implementation. Invoke it when the user wants a spec-driven change package with questions first, factual research, proposal/design artifacts, affected specs, and a vertically sliced task plan, with explicit review/approval stops before any coding begins. This is the right skill when the user wants to plan, scope, or break down the change itself, especially if they ask to use QRSPI, create an OpenSpec change, run a planning workflow, or stop before writing code. Do not use it to implement an existing spec, review or polish artifacts that already exist, generate generic architecture docs, archive completed changes, or support loose brainstorming without a request for formal QRSPI/OpenSpec outputs.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.9.0"
---

# Accelint QRSPI

Automate the QRSPI + OpenSpec planning workflow. This skill applies the methodology from "We Got RPI Wrong" through OpenSpec's artifact system. It orchestrates the Questions → Research → Design → Structure stages and requires human checkpoints before any code is written.

## What This Skill Does

**Automates**: The planning phase of spec-driven development using QRSPI
**Scope**: Questions → Research → Design → Structure/Plan (stops before implementation)
**Output**: A complete OpenSpec change ready for the accelint-qrspi-apply skill

**Does NOT**: Implement code, run tests, create PRs, or archive changes

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
│  (frontmatter: specs_touched/decisions/created_at -> design.md) │
│                                                                 │
│  Specs/Tasks    Q+R+design           specs/*         —          │
│                                      tasks.md        —          │
│  ⚠️  CHECKPOINT 2: Review tasks.md - MUST approve to continue   │
│                                                                 │
│  Done           —                    Exit            —          │
└─────────────────────────────────────────────────────────────────┘

Note: Keep the ticket OUT of context after the Questions stage to prevent completion bleed.

REQUIRED: The Design stage (steps 17-26) generates ONLY `proposal.md` and `design.md`, optionally creates `q-and-a.md` if `--verbose` flag was set, then STOPS for review at step 27. The Specs/Tasks stage (steps 33-43) generates `specs/*` and `tasks.md` separately after design approval.

Capture frontmatter at step 31 after Checkpoint 1 approval, not before. `design.md` reaches its final form for this planning pass only after the user approves it or confirms a manual edit. Earlier capture can write `specs_touched/decisions/created_at` against content the user is about to change. The `created_at` timestamp marks when the user approved the design (the moment the change becomes "real").

⚠️  REQUIRED CHECKPOINTS: The agent MUST pause and wait for explicit user approval at both checkpoints (step 27 and step 44). Proceeding without approval bypasses QRSPI's core value.
```

## Implementation Steps

Execute these steps in order without stopping between them.

1. **Validate user input and parse flags**: Check if the user provided a ticket, feature request, or idea in their prompt (either as skill arguments or in their message). Also check for the `--verbose` flag.

   **Flag parsing:**
   - Check if the user's input contains `--verbose` (with or without other content)
   - Store the verbose flag state for use in step 25
   - Remove `--verbose` from the input before extracting the ticket description
   - Store the original input text (after flag removal) for use in step 25 — this will be saved to trace.md if --verbose was set

   **Validation:**
   If the prompt is empty or contains only the skill invocation with no actual content (after removing flags):
   ```text
   I need a ticket or feature description to plan. Please provide:

   - A ticket ID and description (e.g., "ATI-123: Add user authentication...")
   - A feature request ("I want to add dark mode support...")
   - An idea or problem statement ("Users complain about slow search...")

   Then I'll use QRSPI to break it down into a structured plan.

   Optional flags:
   --verbose    Save input, questions, and answers to trace.md for audit trail
   ```
   Exit the skill and wait for the user to provide input. Do NOT proceed with internal examples or placeholder content.

2. Tell the user: "Checking OpenSpec configuration..."

3. Run `openspec config list` and parse the output

4. Check if the `workflows:` section contains all three required workflows: `explore`, `new`, and `continue`

5. If any are missing:
   ```text
   This skill requires the expanded OpenSpec workflows (explore, new, continue).

   Your current workflows: [list what's enabled]
   Missing: [list what's missing]

   To enable the expanded workflows, run:

   openspec config profile
   # Select "expanded" from the list
   openspec update

   Then re-run this skill.
   ```

6. Exit the skill if required workflows are not enabled

7. If validation passes and all workflows are present, continue to step 8

8. **Generate research questions** (Context isolation: the agent sees ONLY the ticket, not prior codebase knowledge or research. This prevents solution-first thinking)

9. Accept the ticket description from the user (passed as the skill argument or prompted if missing)

10. Use the Agent tool to spawn sub-agent with this exact prompt
  ```text
  Invoke the openspec-explore skill.

  I have this ticket:

  <paste full ticket description here>

  Generate a list of research questions that will tell us everything we need
  to know before building this. Do not propose any solutions. Questions only.
  ```

11. Wait for the sub-agent (spawned via Agent tool) to complete and return the questions (INTERNAL STEP: Do NOT display the questions to the user)

12. Extract and store the questions — they will be passed to the next step.

13. **Answer research questions** (Context isolation: the agent answering questions should see ONLY the questions, not the original ticket. This is the core QRSPI insight — research is objective and ticket-agnostic)

14. Use the Agent tool to spawn a NEW sub-agent (fresh context) with this exact prompt:

  ```text
  Invoke the openspec-explore skill.

  <paste ONLY the research questions from step 12>

  Answer each question with facts only. Observe what the codebase does today AND what the current specs of record say (scan openspec/specs/INDEX.md for capabilities whose name or Purpose line plausibly relates to these questions; for any that match, read the full specs/<capability>/spec.md file and include its current requirements and scenarios directly in your findings, not just a reference to the file). Do not suggest changes or implementation approaches.

  **Use `sem impact` for dependency analysis**

  If research questions mention specific code entities (functions, classes, types, constants), check whether the `sem` CLI tool is available by running `which sem`.

  If available, use `sem impact <token>` (baseline format, not JSON) to gather deterministic dependency data:
  - Where the entity is defined (file:line)
  - What it depends on (all dependencies)
  - What depends on it (all call sites and references)
  - Transitive impact (how many entities are affected)

  Include this impact analysis in your research findings. This ensures the design phase has complete dependency information and won't miss references or call sites.
  ```

15. Wait for the sub-agent to complete and return the research document (INTERNAL STEP: Do NOT display the research findings to the user)

16. Store the research answers — they will inform the design step.

17. **Generate design scaffolding** (Context isolation: the ticket MUST NOT be in context during artifact generation. Use Agent tool to spawn a sub-agent with only questions + research to prevent "completion bleed".)

18. Read `openspec/config.yaml` to extract the `rules.design` section

19. Read `CLAUDE.md` or `AGENTS.md` to extract agent behavior context

20. Use the Agent tool to spawn a sub-agent with this exact prompt:

  ```text
  You are generating OpenSpec artifacts based on QRSPI research. You have access
  to the research questions and answers, but NOT the original ticket text. This
  prevents solution bias.

  Research Questions and Answers:
  <paste questions from step 12>

  Research Findings:
  <paste research doc from step 16>

  OpenSpec Design Rules (from config.yaml):
  <paste the rules.design section verbatim>

  Agent Behavior Context:
  <paste relevant sections from CLAUDE.md/AGENTS.md>

  CRITICAL: You MUST invoke OpenSpec skills to create and generate artifacts.
  DO NOT create files or write artifact content yourself. The OpenSpec skills
  will handle artifact generation following OpenSpec's configured rules.

  Now create the OpenSpec change with proposal and design artifacts:

  1. Invoke the openspec-new-change skill to create the change (OpenSpec will prompt for a slug)

  2. CRITICAL: Capture the change name/slug from the output and use it in all subsequent commands

  3. Run the openspec-continue-change skill ONCE with the change name to generate proposal.md ONLY:
     Invoke the openspec-continue-change skill.

     <change-name>

  4. Run the openspec-continue-change skill ONCE with the change name to generate design.md ONLY:
     Invoke the openspec-continue-change skill.

     <change-name>

  5. STOP after design.md - do NOT generate specs or tasks yet

  IMPORTANT: Let openspec-continue-change generate proposal.md and design.md using the
  OpenSpec workflow. DO NOT write these files yourself. The openspec-continue-change
  skill handles artifact generation based on config.yaml rules.

  After design.md is generated (and ONLY proposal.md and design.md exist),
  report completion, the CHANGE NAME, and the path to the design file.

  IMPORTANT: You MUST report the change name explicitly at the end like:
  "Change name: <slug>"

  CRITICAL: STOP AFTER GENERATING DESIGN.MD. DO NOT CONTINUE TO SPECS OR TASKS.
  Your job ends here. The parent agent will handle the checkpoint and further steps.
  If you generate specs/* or tasks.md, you will bypass the mandatory design review.
  ```

21. Wait for the sub-agent to complete

22. Extract the change name/slug from the sub-agent output silently (look for "Change name:" or parse from the file path)

23. Store the change name — it will be passed to later steps

24. Verify the design.md file exists at the reported path.

25. **If `--verbose` flag was set in step 1**: Create a `trace.md` audit trail file in the change folder before proceeding to the checkpoint.

   **Purpose**: Provides traceability by capturing the initial input, raw questions, and research answers that informed the design artifacts. This closes the loop from "what was entered → what was asked → what was answered".

   **File location**: `openspec/changes/<change-name>/trace.md`

   **Requirements**:

   - You MUST use the Write tool to create this file
   - The file MUST be written to `openspec/changes/<change-name>/trace.md` (where `<change-name>` is the slug from step 23)
   - The content MUST include an ISO 8601 timestamp indicating when the document was generated
   - The content MUST include the original ticket/feature/idea text that the user provided (from step 1, after flag removal)
   - The content MUST include the complete research questions from step 12
   - The content MUST include the complete research findings from step 16
   - You MUST NOT modify `proposal.md` or `design.md` as part of this step — this is a separate audit document
   - You SHOULD write this file immediately after verifying design.md exists (step 24) and before proceeding to the checkpoint (step 26)

   **Content structure**:
   ```markdown
   # QRSPI Trace Audit Trail

   Generated: [paste current ISO 8601 timestamp]

   This document captures the complete QRSPI flow: the initial input, the questions generated, and the research answers that informed the design artifacts. It provides an audit trail for understanding the context and decision-making process.

   ---

   ## Initial Input

   [paste the original ticket/feature/idea text from step 1, after removing the --verbose flag]

   ---

   ## Research Questions

   [paste questions from step 12]

   ---

   ## Research Answers

   [paste research findings from step 16]
   ```

26. REQUIRED: DO NOT continue yet. You MUST proceed to the design review checkpoint next.

27. ⚠️ **REQUIRED CHECKPOINT: Design Review** (This is the "brain surgery" moment from the QRSPI talk. A correction here costs minutes; the same correction after implementation costs a code review cycle. You MUST pause here and wait for user input. DO NOT proceed without explicit user approval.)

28. Read the generated `design.md` file

29. Present it to the user with this framing:

   ```text
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

30. Wait for user input:
   - **(a) Approve**: Proceed to step 31 below
   - **(b) Request edits**:
     - User describes changes
     - Make edits to design.md in place
     - Show diff of changes
     - Re-present for review (repeat until approved)
   - **(c) Manual edit**:
     - Wait for user confirmation that edits are complete
     - Re-read design.md
     - Proceed to step 31 below

31. **Capture specs_touched/decisions frontmatter.** Once the user has approved (a) or confirmed their manual edits are complete (c), design.md is in its final form for this planning pass — capture its `specs_touched` and `decisions` as structured YAML frontmatter now, not any earlier, so an edit made during this same checkpoint can't leave the frontmatter stale against content that changed after it was written.

   **Step-by-step process:**

   a. **Read the current design.md file** to see what exists:
      ```bash
      Read openspec/changes/<change-name-from-step-23>/design.md
      ```

   b. **Extract the data you need to write:**
      - **`specs_touched`**: the capability names design.md and proposal.md already declare as affected or introduced by this change. This is the change's own stated scope, read back out of what was just approved — not computed some other way. The delta spec files under `openspec/changes/<slug>/specs/` don't exist yet at this point (specs/tasks generation happens in steps 32-42), so there's nothing else to derive it from.
      - **`decisions`**: design.md's own decision content — the choices, rationale, and alternatives the design phase already worked through — restructured into a list of `{id, choice, rationale, alternatives}` entries. This is structuring content that's already there, not writing new design content.
      - **`created_at`**: ISO 8601 timestamp marking when this change was created (now, at the moment the user approves the design). Generate this using the current timestamp in ISO 8601 format (e.g., "2026-08-17T15:23:45.123Z"). This is the first of three timestamps used to measure time spent in the QRSPI flow (created_at → started_at → completed_at).

   c. **Write the frontmatter using the Edit tool:**

      - If design.md has NO frontmatter yet, add a complete frontmatter block at the top:
        ```yaml
        ---
        change: <change-name-from-step-23>
        created_at: "2026-08-17T15:23:45.123Z"
        specs_touched: [<capability-a>, <capability-b>]
        decisions:
          - id: D1
            choice: <short decision summary>
            rationale: <why this over the alternatives>
            alternatives: [<option>, <option>]
        ---
        ```

      - If design.md already has frontmatter (e.g., OpenSpec's own metadata), merge the new fields into the existing block using the Edit tool. Do NOT create a second frontmatter block.

   d. **CRITICAL formatting requirements:**
      - **Use inline array syntax for specs_touched**: Write `specs_touched: [cap-a, cap-b]` NOT multi-line YAML with hyphens. This keeps frontmatter format consistent.
      - **Preserve existing frontmatter fields**: If there are other fields already present, keep them unchanged.
      - **Decisions use block syntax**: The `decisions` list uses multi-line YAML with hyphens for each entry (see example above).

   e. **Verify the write succeeded:**
      - After using the Edit tool, check that the operation completed without errors
      - If the Edit tool reports an error, try reading the file again and re-attempting the write
      - If the write fails repeatedly, inform the user and ask them to add the frontmatter manually

   f. **Handle missing data gracefully:**
      - If `specs_touched` or a clear decisions list can't be confidently read out of the approved design.md/proposal.md, don't guess at either — tell the user what's missing and ask them to add it to design.md directly. A design doc without a clear decisions trail is worth flagging on its own terms, and `accelint-qrspi-archive` needs this frontmatter later to do its cross-capability linking.

   **Why this matters:** This frontmatter is cross-skill bookkeeping metadata for `accelint-qrspi-archive`, not part of the design content the openspec-continue-change skill generates — writing it here doesn't fall under the "never generate artifacts yourself" rule (see NEVER Do This). Nothing in proposal.md's or design.md's actual content gets created or altered by this step; only the frontmatter block does.

32. REQUIRED: If the user does not explicitly approve (says "looks good", "approve", "continue", etc.), DO NOT move forward. This checkpoint is mandatory. Skipping it bypasses the core value of QRSPI methodology.

33. **Generate specs and tasks** (Context isolation: continue to keep the ticket out of context. Spawn a sub-agent with questions + research + approved design.md)

34. Read the (possibly user-edited) design.md file from step 31

35. Read `openspec/config.yaml` to extract the `rules.spec` and `rules.tasks` sections

36. Read `CLAUDE.md` or `AGENTS.md` for agent behavior context

37. Use the Agent tool to spawn a sub-agent with this exact prompt:

   ```text
   You are generating OpenSpec specs and tasks based on QRSPI research and an
   approved design. You have access to research and design, but NOT the original
   ticket text.

   CHANGE NAME: <change-name-from-step-23>

   Research Questions and Answers:
   <paste questions from step 12>

   Research Findings:
   <paste research doc from step 16>

   Approved Design:
   <paste design.md content>

   OpenSpec Spec Rules (from config.yaml):
   <paste the rules.spec section verbatim>

   OpenSpec Tasks Rules (from config.yaml):
   <paste the rules.tasks section verbatim>

   Agent Behavior Context:
   <paste relevant sections from CLAUDE.md/AGENTS.md>

   CRITICAL: You MUST use the openspec-continue-change skill to generate artifacts.
   DO NOT generate specs or tasks.md content yourself. The openspec-continue-change skill
   will handle artifact generation following OpenSpec's configured rules.

   Now generate the remaining OpenSpec artifacts:

   1. Invoke openspec-continue-change <change-name> to generate specs/* (delta specs)
   2. Invoke openspec-continue-change <change-name> to generate tasks.md

   IMPORTANT: Let openspec-continue-change generate tasks.md using the OpenSpec workflow.
   DO NOT write tasks.md yourself. The openspec-continue-change skill handles this.

   After tasks.md is generated, the parent agent will validate vertical slicing
   and add a "## Parallelization Strategy" section if needed.

   After tasks.md is generated, report completion and the path to the tasks file.
   ```

38. Wait for the sub-agent to complete (INTERNAL STEP: Do NOT display artifact generation details to the user)

39. Verify specs/* and tasks.md exist at the reported paths

40. Read the generated `tasks.md` file

41. Validate vertical slicing structure:

   **VERTICAL SLICING (required for qrspi-apply)**:

   Each slice must deliver an end-to-end testable feature path, NOT a horizontal
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

42. If horizontal or mixed slicing is detected, **automatically convert to vertical slices**:

   REQUIRED: The `qrspi-apply` skill requires vertical slicing. If the openspec-continue-change skill generated horizontal slices, you MUST restructure them before presenting them to the user.

   **Conversion process**:

   a) **Identify end-to-end feature paths**: Look for the smallest complete user-facing
      feature that touches all relevant architectural layers. For example:
      - Instead of: "Slice 1: All API changes" + "Slice 2: All CLI changes"
      - Convert to: "Slice 1: CLI help command (CLI + API)" + "Slice 2: CLI list command (CLI + API)"

   b) **Restructure each slice** with these required elements:
      - **Deliverable:** - A working, demonstrable feature (not just "API endpoint exists")
      - **Test:** - Explicit verification showing the end-to-end path works
      - **Subtasks in markdown checklist format**: Each subtask MUST use `- [ ] instruction` format
      - Subtasks that cross layers (e.g., "- [ ] Update API handler" + "- [ ] Wire CLI command" + "- [ ] Add help text")

      CRITICAL: Preserve the markdown checklist format (`- [ ] ...`) for all subtasks.
      Do NOT use numbered lists (1. 2. 3.) or plain bullets (- without [ ]).
      The qrspi-apply skill depends on this format to track task completion.

   c) **Preserve parallelization opportunities**: Structure slices to be independent
      - Good: "Slice 1: auth flow" and "Slice 2: data export flow" are independent
      - Bad: "Slice 1: database schema" must complete before "Slice 2: service layer"

   d) **Update Parallelization Strategy (if it exists)**: If the tasks.md already has
      a "## Parallelization Strategy" section, revise it to reflect the new slice
      structure (which slices can run in parallel, which have dependencies).
      Note: If the section doesn't exist, it will be added in step 43.

   e) **Write changes to tasks.md**: Edit the file in place using the Edit tool

   f) **Show diff to user**: Display what changed and explain why (e.g., "Converted
      from layer-based to feature-based slices for better parallelization")

43. **REQUIRED: Check for and add Parallelization Strategy section**:

   After vertical slicing is validated or corrected, check whether tasks.md contains a `## Parallelization Strategy` section.

   **If the section is missing or incomplete**, add it NOW using the Edit tool
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

   **If the section exists but was part of a horizontal-to-vertical conversion**
   (step 42d), verify it accurately reflects the new vertical slice structure and
   update if needed.

44. ⚠️ **REQUIRED CHECKPOINT: Tasks Review** - Present `tasks.md` to the user for final approval:

   ```text
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

45. Handle user input (same flow as step 30: approve, request edits, or manual edit)

46. REQUIRED: Wait for the user to explicitly approve the `tasks.md` structure. If they do not respond or the conversation ends, stop here. Do not auto-proceed to completion.

47. **Completion** - After tasks.md is approved, announce completion:

   ```text
   ✅ QRSPI planning phase complete.

   Change name: <change-name-from-step-23>

   Generated artifacts:
   - openspec/changes/<change-slug>/proposal.md
   - openspec/changes/<change-slug>/design.md
   - openspec/changes/<change-slug>/specs/*
   - openspec/changes/<change-slug>/tasks.md
   [If --verbose was used:]
   - openspec/changes/<change-slug>/trace.md (audit trail)

   Next steps:
   1. Review the artifacts one more time if needed
   2. Run `/clear` to start fresh context for implementation
   3. Invoke the accelint-qrspi-apply skill with <change-name> to begin implementation.

   This allows you to create multiple specs before implementation and
   maintains proper context management.
   ```

48. Exit the skill — do NOT automatically invoke the accelint-qrspi-apply skill

## Key Principles

### Context Isolation (QRSPI Core)

The two-context-window pattern is essential:

- **Questions generation**: Ticket is IN context → generates questions
- **Research answers**: Ticket is OUT of context, only questions IN context → objective facts

This prevents "solution-first thinking" where the agent jumps to implementation ideas during research.

### Human Checkpoints

Two mandatory review gates:

1. **After design.md**: Catch wrong patterns, missing systems, scope issues
2. **After tasks.md**: Verify vertical slicing, phase ordering

These are the highest-leverage moments for corrections — before any code is written.

### Vertical Slicing Enforcement

The skill MUST actively check for and correct horizontal (layer-by-layer) slicing. Each slice MUST deliver a testable end-to-end feature path.

### No Automatic Implementation

The skill stops after planning. The user explicitly invokes the accelint-qrspi-apply skill when ready. This allows:

- Multiple specs to be created before any implementation starts
- Context clearing between planning and implementation
- User control over when implementation begins

## Error Handling

**If OpenSpec commands fail**:
- Surface the error to the user
- Ask whether they want to retry or abort
- DO NOT continue to the next step on failure

**If the sub-agent fails**:
- Show the error from the sub-agent
- Ask whether the user wants to retry that step or provide manual input
- Allow manual fallback (the user provides questions or research directly)

**If `specs_touched` or `decisions` cannot be confidently read out of approved `design.md` or `proposal.md` (step 31)**:
- DO NOT guess. Show the user what is missing (for example, "no capability declarations found" or "no decisions with a stated rationale")
- Ask the user to add it to `design.md` directly, then re-run step 31
- DO NOT block later steps on this. A change can proceed to specs/tasks without this frontmatter, but `accelint-qrspi-archive` will need to derive it later from `proposal.md` and the by-then-existing delta specs instead of reading it from frontmatter

**If `design.md` or `tasks.md` is missing after generation**:
- Check whether the file exists at the expected path
- If it is missing, ask the user to verify OpenSpec configuration
- Provide the expected path for manual inspection

## Configuration Requirements

This skill assumes the project has:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. `openspec/config.yaml` configured (ideally via `accelint-onboard-openspec` skill)
3. Expanded OpenSpec profile enabled
4. `AGENTS.md` or `CLAUDE.md` defining agent behavior (ideally via `accelint-onboard-agent` skill)

If any of these are missing, guide the user to set them up before running this skill.

## NEVER Do This

**NEVER generate artifacts yourself** — Always invoke the OpenSpec skills (`openspec-new-change`, `openspec-continue-change`) to create `proposal.md`, `design.md`, `specs/*`, and `tasks.md`. The OpenSpec workflow handles artifact generation under OpenSpec's configured rules. If you write artifacts directly, you bypass the project's design, spec, and task rules and create inconsistent outputs. The one narrow exception is step 30's `specs_touched`/`decisions` frontmatter block. That block is cross-skill bookkeeping metadata for `accelint-qrspi-archive`, derived from content openspec-continue-change already generated and already approved by the user — not new design content. Even there, only the YAML frontmatter block is written; the `design.md` body is never touched by this step.

**NEVER generate `tasks.md` from scratch** — Always invoke the openspec-continue-change skill to create the initial `tasks.md`. However, you MUST restructure it if the generated output uses horizontal slicing instead of vertical slicing. The qrspi-apply skill requires vertical slicing. If openspec-continue-change generates horizontal slices (organized by architectural layer), convert them to vertical slices (end-to-end feature deliverables) by following the validation guidance in step 42. When restructuring, preserve the markdown checklist format (`- [ ] task`) — do NOT convert it to numbered lists or plain bullets.

**NEVER use numbered lists or plain bullets in `tasks.md`** — All subtasks MUST use markdown checklist format: `- [ ] instruction`. The `qrspi-apply` skill tracks completion by checking and unchecking these boxes. If you see numbered lists (`1. 2. 3.`) or plain bullets (`-` without `[ ]`), convert them to `- [ ] ...` format.

**NEVER overcomplicate Parallelization Strategy** — Keep it simple: list which slices can run in parallel, which slices have sequential dependencies, and the recommended implementation order. Do not add excessive detail about every possible edge case or coordination mechanism. The example in this skill shows the right level of detail.

**NEVER continue to specs/tasks without design approval** — Step 27 is a required checkpoint. If you skip the design review and generate tasks immediately, you miss the "brain surgery" moment, where corrections are cheap. Fixing design issues after code is written costs review cycles and rework.

**NEVER capture `specs_touched`/`decisions`/`created_at` frontmatter before `design.md` is in its final, approved state** — Step 31 runs only after (a) approval or (c) confirmed manual edits, never during a (b) request-edits loop or speculatively ahead of approval. Capturing it against a draft that is still being revised creates exactly the stale metadata `accelint-qrspi-archive` depends on this skill not producing.

**NEVER skip writing the `created_at` timestamp** — This field is required by both `accelint-qrspi-apply` (to track when implementation started) and `accelint-qrspi-archive` (to track the full lifecycle). If the Edit tool fails when writing frontmatter, retry or ask the user to add it manually — do not proceed without it. A missing `created_at` breaks downstream timestamp tracking.

**NEVER guess `specs_touched` or `decisions` when they cannot be confidently read out of the approved `design.md` or `proposal.md`** — ask the user to add what is missing to `design.md` directly instead. A silently invented capability list is worse than a visible gap, because `accelint-qrspi-archive` will trust this frontmatter as the author's explicit statement of scope.

**NEVER let the ticket leak into research or design context** — Questions are generated WITH ticket context, but research and design must see ONLY questions and research answers. If the ticket stays in context during research, the agent will propose solutions instead of gathering objective facts about the current codebase.

**NEVER skip the required checkpoints** — Step 27 (after `design.md`) and Step 44 (after `tasks.md`) require explicit user approval before continuing. If you proceed without waiting for user confirmation ("looks good", "approve", "continue"), you bypass the core value of QRSPI: cheap corrections at the design stage. The "brain surgery" moment is when design is reviewed BEFORE specs/tasks are generated. Skipping checkpoints defeats the entire methodology.

## Example Usage

```text
User: I want to plan this ticket using QRSPI:

## ATI-12: smart-ls CLI tool
Create a CLI tool that returns structured directory listings as JSON...
```
