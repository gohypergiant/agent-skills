---
name: accelint-qrspi-propose
description: Automate the QRSPI + OpenSpec planning workflow (Questions → Research → Design → Structure) for spec-driven development. Use this skill when the user wants to plan a ticket, start a QRSPI workflow, create a change with QRSPI, or says "plan this with QRSPI", "use QRSPI to plan", "start QRSPI workflow", "create spec-driven change", or asks about planning a feature/change before implementation. This skill handles ONLY the planning phase — it does NOT implement code. After completion, the user continues with /opsx:apply for implementation.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.4.0"
---

# Accelint QRSPI

Automate the QRSPI + OpenSpec planning workflow, implementing the methodology from "We Got RPI Wrong" with OpenSpec's artifact system. This skill orchestrates the Question generation → Research → Design → Structure phases, with mandatory human checkpoints before code is written.

## What This Skill Does

**Automates**: The planning phase of spec-driven development using QRSPI methodology
**Scope**: Questions → Research → Design → Structure/Plan (stops before implementation)
**Output**: A complete OpenSpec change ready for `/opsx:apply`

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
│  (frontmatter capture: specs_touched/decisions -> design.md)    │
│                                                                 │
│  Specs/Tasks    Q+R+design           specs/*         —          │
│                                      tasks.md        —          │
│  ⚠️  CHECKPOINT 2: Review tasks.md - MUST approve to continue   │
│                                                                 │
│  Done           —                    Exit            —          │
└─────────────────────────────────────────────────────────────────┘

Note: Ticket is kept OUT of context after Questions stage to prevent completion bleed.

Critical: Design stage (steps 17-25) generates ONLY proposal.md and design.md, then
STOPS for review at step 26. Specs/Tasks stage (steps 32-42) generates specs/* and
tasks.md separately after design approval.

Frontmatter capture happens at step 30 after Checkpoint 1 approval, not before —
design.md is only in its final form once the user has approved it or confirmed a
manual edit, so capturing specs_touched/decisions any earlier risks writing
frontmatter against content the user is about to change.

⚠️  MANDATORY CHECKPOINTS: The agent MUST pause and wait for explicit user approval
at both checkpoints (step 26 and step 43). Proceeding without approval bypasses
QRSPI's core value.
```

## Implementation Steps

Execute these steps in order without stopping between them:

1. **Validate user input**: Check if the user provided a ticket, feature request, or idea in their prompt (either as skill arguments or in their message). If the prompt is empty or contains only the skill invocation with no actual content:
   ```
   I need a ticket or feature description to plan. Please provide:

   - A ticket ID and description (e.g., "ATI-123: Add user authentication...")
   - A feature request ("I want to add dark mode support...")
   - An idea or problem statement ("Users complain about slow search...")

   Then I'll use QRSPI to break it down into a structured plan.
   ```
   Exit the skill and wait for the user to provide input. Do NOT proceed with internal examples or placeholder content.

2. Tell the user: "Checking OpenSpec configuration..."

3. Run `openspec config list` and parse the output

4. Check if the `workflows:` section contains all three required workflows: `explore`, `new`, and `continue`

5. If any are missing:
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

6. Exit the skill if required workflows are not enabled

7. If validation passes and all workflows are present, continue to step 8

8. **Generate research questions** (Context isolation: agent sees ONLY the ticket, not prior codebase knowledge or research. This prevents solution-first thinking)

9. Accept the ticket description from the user (passed as the skill argument or prompted if missing)

10. Spawn a sub-agent with this exact prompt:

   ```
   /opsx:explore

   I have this ticket:

   [paste full ticket description here]

   Walk down each branch of the decision tree, resolving dependencies between 
   decisions one-by-one.

   Generate a list of research questions that will tell us everything we need
   to know before building this. Do NOT propose any solutions. Questions ONLY.

   These questions must be detailed. For example, rather than "How do we handle 
   payments?", ask "The ticket mentions integrating Stripe, but payment.ts 
   currently uses a hardcoded PayPal SDK instance. Are we replacing Paypal 
   entirely,  or building a factory to support both?"

   You MUST dig deep enough to formulate highly specific, file-based 
   technical questions.
   ```

11. Wait for the sub-agent to complete and return the questions

12. Extract and store the questions — they will be passed to the next step

13. **Answer research questions** (Context isolation: The agent answering questions should see ONLY the questions, not the original ticket. This is the core QRSPI insight — research is objective, ticket-agnostic)

14. Spawn a NEW sub-agent (fresh context) with this exact prompt:

   ```
   /opsx:explore

   [paste ONLY the research questions from step 12]

   Answer each question with 100% facts only. Include exact file:line references where possible. Zero opinions. Zero suggestions. Zero implementation Ideas. Do not critique code quality, and do not editorialize. Observe what the codebase does today AND what the current specs of record say (scan openspec/specs/INDEX.md for capabilities whose name or Purpose line plausibly relates to these questions; for any that match, read the full specs/<capability>/spec.md file and include its current requirements and scenarios directly in your findings, not just a reference to the file).
   ```

15. Wait for the sub-agent to complete and return the research document

16. Store the research answers — they will inform the design step

17. **Generate design scaffolding** (Context isolation: The ticket should NOT be in context during artifact generation to prevent "completion bleed". Spawn a sub-agent with only questions + research)

18. Read `openspec/config.yaml` to extract the `rules.design` section

19. Read `CLAUDE.md` or `AGENTS.md` to extract agent behavior context

20. Spawn a sub-agent with this exact prompt:

   ```
   You are generating OpenSpec artifacts based on QRSPI research. You have access
   to the research questions and answers, but NOT the original ticket text. This
   prevents solution bias.

   Research Questions and Answers:
   [paste questions from step 12]

   Research Findings:
   [paste research doc from step 16]

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

21. Wait for the sub-agent to complete

22. Extract the change name/slug from the sub-agent output (look for "Change name:" or parse from the file path)

23. Store the change name — it will be passed to later steps

24. Verify the design.md file exists at the reported path

25. CRITICAL: DO NOT continue yet. You MUST proceed to the design review checkpoint next.

26. ⚠️ **MANDATORY CHECKPOINT: Design Review** (This is the "brain surgery" moment from the QRSPI talk — a correction here costs minutes; the same correction after implementation costs a code review cycle. You MUST pause here and wait for user input. DO NOT proceed without explicit user approval)

27. Read the generated `design.md` file

28. Present it to the user with this framing:

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

29. Wait for user input:
   - **(a) Approve**: Proceed to step 30 below
   - **(b) Request edits**:
     - User describes changes
     - Make edits to design.md in place
     - Show diff of changes
     - Re-present for review (repeat until approved)
   - **(c) Manual edit**:
     - Wait for user confirmation that edits are complete
     - Re-read design.md
     - Proceed to step 30 below

30. **Capture specs_touched/decisions frontmatter.** Once the user has approved (a) or confirmed their manual edits are complete (c), design.md is in its final form for this planning pass — capture its `specs_touched` and `decisions` as structured YAML frontmatter now, not any earlier, so an edit made during this same checkpoint can't leave the frontmatter stale against content that changed after it was written.

   - **`specs_touched`**: the capability names design.md and proposal.md already declare as affected or introduced by this change. This is the change's own stated scope, read back out of what was just approved — not computed some other way. The delta spec files under `openspec/changes/<slug>/specs/` don't exist yet at this point (specs/tasks generation happens in steps 32-42), so there's nothing else to derive it from.
   - **`decisions`**: design.md's own decision content — the choices, rationale, and alternatives the design phase already worked through — restructured into a list of `{id, choice, rationale, alternatives}` entries. This is structuring content that's already there, not writing new design content.
   - Write both into design.md's YAML frontmatter:

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

   - If design.md already starts with a frontmatter block (e.g. OpenSpec's own metadata), merge into it rather than writing a second block.
   - If `specs_touched` or a clear decisions list can't be confidently read out of the approved design.md/proposal.md, don't guess at either — tell the user what's missing and ask them to add it to design.md directly. A design doc without a clear decisions trail is worth flagging on its own terms, and `accelint-qrspi-archive` needs this frontmatter later to do its cross-capability linking.
   - This frontmatter is cross-skill bookkeeping metadata for `accelint-qrspi-archive`, not part of the design content `/opsx:continue` generates — writing it here doesn't fall under the "never generate artifacts yourself" rule (see NEVER Do This). Nothing in proposal.md's or design.md's actual content gets created or altered by this step; only the frontmatter block does.

31. CRITICAL: If the user does not explicitly approve (says "looks good", "approve", "continue", etc.), DO NOT move forward. This checkpoint is mandatory - skipping it bypasses the core value of QRSPI methodology.

32. **Generate specs and tasks** (Context isolation: Continue to keep ticket out of context. Spawn a sub-agent with questions + research + approved design.md)

33. Read the (possibly user-edited) design.md file from step 30

34. Read `openspec/config.yaml` to extract the `rules.spec` and `rules.tasks` sections

35. Read `CLAUDE.md` or `AGENTS.md` for agent behavior context

36. Spawn a sub-agent with this exact prompt:

   ```
   You are generating OpenSpec specs and tasks based on QRSPI research and an
   approved design. You have access to research and design, but NOT the original
   ticket text.

   CHANGE NAME: <change-name-from-step-23>

   Research Questions and Answers:
   [paste questions from step 12]

   Research Findings:
   [paste research doc from step 16]

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

37. Wait for the sub-agent to complete

38. Verify specs/* and tasks.md exist at the reported paths

39. Read the generated `tasks.md` file

40. Validate vertical slicing structure:

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

41. If horizontal or mixed slicing detected, **automatically convert to vertical slices**:

   CRITICAL: The qrspi-apply skill requires vertical slicing. If /opsx:continue
   generated horizontal slices, you MUST restructure them before presenting to the user.

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
      Note: If the section doesn't exist, it will be added in step 42.

   e) **Write changes to tasks.md**: Edit the file in place using the Edit tool

   f) **Show diff to user**: Display what changed and explain why (e.g., "Converted
      from layer-based to feature-based slices for better parallelization")

42. **CRITICAL: Check for and add Parallelization Strategy section**:

   After vertical slicing is validated/corrected, check if tasks.md contains a
   "## Parallelization Strategy" section.

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
   (step 41d), verify it accurately reflects the new vertical slice structure and
   update if needed.

43. ⚠️ **MANDATORY CHECKPOINT: Tasks Review** - Present tasks.md to the user for final approval:

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

44. Handle user input (same flow as step 29: approve, request edits, or manual edit)

45. CRITICAL: Wait for the user to explicitly approve the tasks.md structure. If they don't respond or the conversation ends, stop here - do not auto-proceed to completion.

46. **Completion** - After tasks.md is approved, announce completion:

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

47. Exit the skill — do NOT automatically invoke `/accelint-qrspi-apply`

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

The skill should actively check for and discourage horizontal (layer-by-layer) slicing. Each slice should deliver a testable end-to-end slice.

### No Automatic Implementation

The skill stops after planning. The user explicitly runs `/accelint-qrspi-apply` when ready. This allows:

- Multiple specs to be created before any implementation starts
- Context clearing between planning and implementation
- User control over when implementation begins

## Error Handling

**If OpenSpec commands fail**:
- Surface the error to the user
- Ask if they want to retry or abort
- Do not continue to next step on failure

**If sub-agent fails**:
- Show the error from the sub-agent
- Ask user if they want to retry that step or provide manual input
- Allow manual fallback (user provides questions/research directly)

**If `specs_touched` or `decisions` can't be confidently read out of approved design.md/proposal.md (step 30)**:
- Do not guess. Show the user what's missing (e.g. "no capability declarations found" or "no decisions with a stated rationale")
- Ask them to add it to design.md directly, then re-run step 30
- Do not block later steps on this — a change can proceed to specs/tasks without this frontmatter, it just means `accelint-qrspi-archive` will need to derive it later from proposal.md and the by-then-existing delta specs instead of reading it straight from frontmatter

**If design.md or tasks.md is missing after generation**:
- Check if the file exists at expected path
- If missing, ask user to verify OpenSpec configuration
- Provide the expected path for manual inspection

## Configuration Requirements

This skill assumes the project has:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. `openspec/config.yaml` configured (ideally via `accelint-onboard-openspec` skill)
3. Expanded OpenSpec profile enabled
4. `AGENTS.md` or `CLAUDE.md` defining agent behavior (ideally via `accelint-onboard-agent` skill)

If any of these are missing, guide the user to set them up before running this skill.

## NEVER Do This

**NEVER generate artifacts yourself** — Always use /opsx commands (new, continue) to create proposal.md, design.md, specs/*, and tasks.md. The /opsx workflow handles artifact generation following OpenSpec's configured rules. If you write artifacts directly, you bypass the project's design/spec/task rules and create inconsistent outputs. The one narrow exception is step 30's `specs_touched`/`decisions` frontmatter block: that's cross-skill bookkeeping metadata for `accelint-qrspi-archive`, derived from content `/opsx:continue` already generated and the user already approved — not new design content. Even there, only the YAML frontmatter block is written; the design.md body is never touched by this step.

**NEVER generate tasks.md from scratch** — Always use /opsx:continue to create the initial tasks.md. However, you MUST restructure it if the generated output uses horizontal slicing instead of vertical slicing. The qrspi-apply skill requires vertical slicing. If /opsx:continue generates horizontal slices (organized by architectural layer), convert them to vertical slices (end-to-end feature deliverables) following the validation guidance in step 41. When restructuring, preserve the markdown checklist format (`- [ ] task`) — do NOT convert to numbered lists or plain bullets.

**NEVER use numbered lists or plain bullets in tasks.md** — All subtasks must use markdown checklist format: `- [ ] instruction`. The qrspi-apply skill tracks completion by checking/unchecking these boxes. If you see numbered lists (1. 2. 3.) or plain bullets (- without [ ]), convert them to `- [ ] ...` format.

**NEVER overcomplicate Parallelization Strategy** — Keep it simple: list which slices can run in parallel, which have sequential dependencies, and recommended implementation order. Don't add excessive detail about every possible edge case or coordination mechanism. The example in this skill shows the right level of detail.

**NEVER continue to specs/tasks without design approval** — Step 26 checkpoint is mandatory. If you skip the design review and generate tasks immediately, you miss the "brain surgery" moment where corrections are cheap. Fixing design issues after code is written costs review cycles and rework.

**NEVER capture specs_touched/decisions frontmatter before design.md is in its final, approved state** — Step 30 runs only after (a) approval or (c) confirmed manual edits, never during a (b) request-edits loop or speculatively ahead of approval. Capturing it against a draft that's still being revised is exactly the kind of stale metadata `accelint-qrspi-archive` depends on this skill not producing.

**NEVER guess specs_touched or decisions when they can't be confidently read out of the approved design.md/proposal.md** — ask the user to add what's missing to design.md directly instead. A silently invented capability list is worse than a visible gap, since `accelint-qrspi-archive` will trust this frontmatter as the author's explicit statement of scope.

**NEVER let the ticket leak into research/design context** — Questions are generated WITH ticket context, but research and design must see ONLY questions + research answers. If the ticket stays in context during research, the agent will propose solutions instead of gathering objective facts about the current codebase.

**NEVER skip the mandatory checkpoints** — Step 26 (after design.md) and Step 43 (after tasks.md) require explicit user approval before continuing. If you proceed without waiting for user confirmation ("looks good", "approve", "continue"), you bypass the core value of QRSPI: cheap corrections at the design stage. The "brain surgery" moment is when design is reviewed BEFORE specs/tasks are generated. Skipping checkpoints defeats the entire methodology.

## Example Usage

```
User: I want to plan this ticket using QRSPI:

## ATI-12: smart-ls CLI tool
Create a CLI tool that returns structured directory listings as JSON...
