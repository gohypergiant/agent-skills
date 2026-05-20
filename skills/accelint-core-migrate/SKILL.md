---
name: accelint-core-migrate
description: "Migrate features from portfolio repos to Core using QRSPI methodology. Use this skill when migrating features to Core, adapting portfolio-specific features for reuse, taking features from one repo to another, generalizing portfolio implementations, or when the user says 'migrate this to Core', 'make this generic for Core', 'adapt this feature for Core', or provides proposal.md/design.md from a portfolio repo that should move to Core. This skill handles ONLY the planning phase — it does NOT implement code. After completion, continue with /opsx:apply for implementation."
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.0"
---

# Accelint Core Migrate

Migrate features from portfolio repositories to Core using QRSPI methodology, adapted for cross-repo feature generalization. This skill orchestrates the Question generation → Research → Design → Structure phases with mandatory human checkpoints, specifically tailored for identifying and resolving portfolio-specific dependencies.

## What This Skill Does

**Automates**: The planning phase of cross-repo feature migration using QRSPI methodology
**Scope**: Questions → Research → Design → Structure/Plan (stops before implementation)
**Input**: Existing proposal.md and design.md from portfolio repo (as file paths or pasted content)
**Output**: A complete OpenSpec change ready for `/opsx:apply` in the Core repo

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

## Key Differences from QRSPI Propose

This skill adapts QRSPI for **cross-repo migration**, not greenfield feature planning:

1. **Input**: Starts with existing proposal.md and design.md from portfolio repo
2. **Questions Phase**: Focused on generalization ("What's portfolio-specific?", "What exists in Core?", "What's missing?")
3. **Research Phase**: Compares portfolio implementation against Core's current state
4. **Design Phase**: Adapts portfolio feature to be portfolio-agnostic, identifies missing Core dependencies
5. **Dependency Tracking**: Explicitly surfaces portfolio-specific components that don't exist in Core

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Phase          Context              Output            Checkpoint       │
├─────────────────────────────────────────────────────────────────────────┤
│  Questions      Portfolio docs       Questions         —                │
│                 (proposal+design)                                        │
│  Research       Questions only       Research doc      —                │
│                 (NO portfolio docs)                                      │
│  Design         Q+R (NO portfolio)   proposal.md       —                │
│                                      design.md         —                │
│                                      [STOP HERE]                        │
│  ⚠️  CHECKPOINT 1: Review design.md - MUST approve to continue          │
│                                                                          │
│  Specs/Tasks    Q+R+design           specs/*           —                │
│                                      tasks.md          —                │
│  ⚠️  CHECKPOINT 2: Review tasks.md - MUST approve to continue           │
│                                                                          │
│  Done           —                    Exit              —                │
└─────────────────────────────────────────────────────────────────────────┘

Note: Portfolio docs are kept OUT of context after Phase 1 to prevent direct copying.

Critical: Phase 3 generates ONLY proposal.md and design.md, then STOPS for review.
Phase 5 generates specs/* and tasks.md separately after design approval.

⚠️  MANDATORY CHECKPOINTS: The agent MUST pause and wait for explicit user approval
at both checkpoints. Proceeding without approval bypasses QRSPI's core value.
```

## Phase Breakdown

### Phase 0: Preflight Checks

Before starting, verify the user provided portfolio docs and OpenSpec has the required workflows enabled.

**Steps**:

1. **Validate user input**: Check if the user provided portfolio proposal.md and design.md (either as file paths or pasted content). If the prompt is empty or contains only the skill invocation with no actual content:
   ```
   I need portfolio proposal.md and design.md to migrate. Please provide:

   - File paths to the portfolio artifacts (e.g., "/path/to/portfolio-repo/openspec/changes/feature-x/proposal.md")
   - OR paste the contents of both files directly

   These will be used as the starting point for generalizing the feature for Core.
   ```
   Exit the skill and wait for the user to provide input. Do NOT proceed with placeholder content.

2. **Parse portfolio docs**: Extract the proposal.md and design.md content (either by reading file paths or using pasted content). Store these for Phase 1.

3. Tell the user: "Checking OpenSpec configuration..."

4. Run `openspec config list` and parse the output

5. Check if the `workflows:` section contains all three required workflows: `explore`, `new`, and `continue`

6. If any are missing:
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

7. Exit the skill if required workflows are not enabled

8. If validation passes and all workflows are present, proceed to Phase 1

### Phase 1: Questions (Portfolio Context → Generalization Questions)

**Goal**: Generate research questions focused on making the feature portfolio-agnostic.

**Context isolation**: The agent generating questions should see the portfolio docs ONCE to understand what needs generalizing, but research (Phase 2) will NOT see the portfolio docs.

**Steps**:

1. Spawn a sub-agent with this exact prompt:

   ```
   /opsx:explore

   I'm migrating a feature from a portfolio repo to Core. Here are the portfolio artifacts:

   ## Portfolio proposal.md:
   [paste portfolio proposal.md content here]

   ## Portfolio design.md:
   [paste portfolio design.md content here]

   Generate research questions for making this feature generic for Core. Focus on:

   1. **Portfolio-specific dependencies**: What components, libraries, or patterns in this design are unique to the portfolio repo?
   2. **Core equivalents**: What does Core already have that could replace portfolio-specific components?
   3. **Missing Core infrastructure**: What would Core need that doesn't exist yet?
   4. **Generalization opportunities**: What hardcoded assumptions or portfolio-specific logic needs abstraction?
   5. **API compatibility**: How should this feature expose its API to be usable by multiple portfolios?

   Generate a list of research questions. Do not propose solutions. Questions only.
   ```

2. Wait for the sub-agent to complete and return the questions

3. Extract and store the questions — they will be passed to the next phase

**Output**: A structured list of research questions focused on generalization (no answers yet)

### Phase 2: Research (Questions Only → Core State Analysis)

**Goal**: Answer the questions with objective facts from the Core codebase, without the portfolio docs bleeding into research.

**Context isolation**: The agent answering questions should see ONLY the questions, not the original portfolio docs. This prevents direct copying from the portfolio implementation.

**Steps**:

1. Read the edge cases reference if it exists:
   - Check for `skills/accelint-core-migrate/references/edge-cases.md` (or the skill's install location)
   - If it exists and has content (not just comments), extract known patterns

2. Spawn a NEW sub-agent (fresh context) with this exact prompt:

   ```
   /opsx:explore

   [paste ONLY the research questions from Phase 1]

   [IF edge-cases.md has content beyond comments, include:]
   Known Portfolio → Core Migration Patterns:
   [paste non-comment content from edge-cases.md]

   Answer each question with facts about Core's current state. Observe:
   - What components already exist in Core that match the needed functionality
   - What patterns Core uses for similar features
   - What's missing that would need to be added
   - How existing Core APIs are structured
   - Check the known migration patterns above for common replacements

   Answer with facts only. Do not suggest implementation approaches yet.
   ```

3. Wait for the sub-agent to complete and return the research document

4. Store the research answers — they will inform the design phase

**Output**: A research document with objective facts about Core's current state

### Phase 3: Design Scaffolding (Core-Adapted Design)

**Goal**: Create the OpenSpec change and generate proposal.md and design.md adapted for Core.

**Context isolation**: Portfolio docs should NOT be in context during artifact generation to prevent direct copying. Spawn a sub-agent with only questions + research.

**Steps**:

1. Read `openspec/config.yaml` to extract the `rules.design` section
2. Read `CLAUDE.md` or `AGENTS.md` to extract agent behavior context
3. Read `references/edge-cases.md` if it exists and has content beyond comments
4. Spawn a sub-agent with this exact prompt:

   ```
   You are generating OpenSpec artifacts for migrating a portfolio feature to Core.
   You have access to research questions and answers about Core's current state,
   but NOT the original portfolio docs. This prevents direct copying.

   Research Questions and Answers:
   [paste questions from Phase 1]

   Research Findings (Core State):
   [paste research doc from Phase 2]

   [IF edge-cases.md has content beyond comments:]
   Known Portfolio → Core Migration Patterns:
   [paste non-comment content from edge-cases.md]

   OpenSpec Design Rules (from config.yaml):
   [paste the rules.design section verbatim]

   Agent Behavior Context:
   [paste relevant sections from CLAUDE.md/AGENTS.md]

   CRITICAL: You MUST use /opsx commands to create and generate artifacts.
   DO NOT create files or write artifact content yourself. The /opsx commands
   will handle artifact generation following OpenSpec's configured rules.

   Now create the OpenSpec change with proposal and design artifacts for Core:

   1. Run /opsx:new to create the change (OpenSpec will prompt for a slug)
   2. CRITICAL: Capture the change name/slug from the output and use it in all subsequent commands
   3. Run /opsx:continue <change-name> ONCE to generate proposal.md ONLY
   4. Run /opsx:continue <change-name> ONCE to generate design.md ONLY
   5. STOP after design.md - do NOT generate specs or tasks yet

   IMPORTANT CONTEXT FOR DESIGN:
   - This is a migration from portfolio to Core, not a greenfield feature
   - Focus on making the design portfolio-agnostic (generic)
   - Call out any portfolio-specific dependencies that don't exist in Core
   - Suggest Core-appropriate abstractions and API patterns

   IMPORTANT: Let /opsx:continue generate proposal.md and design.md using the
   OpenSpec workflow. DO NOT write these files yourself. The /opsx:continue
   command handles artifact generation based on config.yaml rules.

   After design.md is generated (and ONLY proposal.md and design.md exist),
   report completion, the CHANGE NAME, and the path to the design file.

   IMPORTANT: You MUST report the change name explicitly at the end like:
   "Change name: <slug>"

   CRITICAL: STOP AFTER GENERATING DESIGN.MD. DO NOT CONTINUE TO SPECS OR TASKS.
   Your job ends here. The parent agent will handle the checkpoint and Phase 5.
   If you generate specs/* or tasks.md, you will bypass the mandatory design review.
   ```

4. Wait for the sub-agent to complete
5. Extract the change name/slug from the sub-agent output (look for "Change name:" or parse from the file path)
6. Store the change name — it will be passed to Phase 5
7. Verify the design.md file exists at the reported path
8. CRITICAL: DO NOT continue to Phase 5 yet. You MUST proceed to Phase 4 checkpoint.
9. Proceed to Phase 4 (mandatory checkpoint)

**Output**: Generated `proposal.md` and `design.md` in `openspec/changes/<slug>/`

### Phase 4: Design Review Checkpoint ⚠️ MANDATORY

**Goal**: Get human approval before proceeding to task breakdown, with special attention to portfolio-specific dependencies.

This is the "brain surgery" moment — a correction here costs minutes; the same correction after implementation costs a code review cycle.

CRITICAL: You MUST pause here and wait for user input. DO NOT proceed to Phase 5
without explicit user approval. If you skip this checkpoint, you defeat the entire
purpose of QRSPI's separation of design from implementation planning.

**Steps**:

1. Read the generated `design.md` file

2. Present it to the user with this framing:

   ```
   Design artifact generated for Core. Please review for:

   **Migration-specific concerns:**
   - Portfolio-specific dependencies mentioned that don't exist in Core
   - Whether proposed abstractions are appropriate for Core's architecture
   - If the design is truly portfolio-agnostic (no hardcoded portfolio assumptions)

   **Standard design concerns:**
   - Wrong pattern references (did I find the legacy way instead of the current way?)
   - Unresolved assumptions presented as decisions
   - Missing affected systems (any service boundaries not mentioned?)
   - Scope creep (does the design cover more than needed?)

   Options:
   (a) Approve — continue to task breakdown
   (b) Request edits — tell me what to change, I'll modify in place
   (c) Manual edit — edit the file yourself, then tell me when ready
   ```

3. Wait for user input:
   - **(a) Approve**: Proceed to Phase 5
   - **(b) Request edits**:
     - User describes changes
     - Make edits to design.md in place
     - Show diff of changes
     - Re-present for review (repeat until approved)
   - **(c) Manual edit**:
     - Wait for user confirmation that edits are complete
     - Re-read design.md
     - Proceed to Phase 5

**CRITICAL: DO NOT PROCEED TO PHASE 5 WITHOUT EXPLICIT USER APPROVAL.**

If the user does not explicitly approve (says "looks good", "approve", "continue", etc.),
DO NOT move forward. This checkpoint is mandatory - skipping it bypasses the core value
of QRSPI methodology.

### Phase 5: Specs & Tasks Generation

**Goal**: Generate delta specs and task breakdown with vertical slicing, surfacing portfolio-to-Core migration challenges.

**Context isolation**: Continue to keep portfolio docs out of context. Spawn a sub-agent with questions + research + approved design.md.

**Steps**:

1. Read the (possibly user-edited) design.md file from Phase 4
2. Read `openspec/config.yaml` to extract the `rules.spec` and `rules.tasks` sections
3. Read `CLAUDE.md` or `AGENTS.md` for agent behavior context
4. Spawn a sub-agent with this exact prompt:

   ```
   You are generating OpenSpec specs and tasks for migrating a portfolio feature to Core.
   You have access to research and design, but NOT the original portfolio docs.

   CHANGE NAME: <change-name-from-phase-3>

   Research Questions and Answers:
   [paste questions from Phase 1]

   Research Findings (Core State):
   [paste research doc from Phase 2]

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

   MIGRATION-SPECIFIC CONTEXT:
   - This is adapting a portfolio feature for Core
   - Tasks should account for creating missing Core infrastructure
   - Identify where portfolio-specific components need Core equivalents
   - Consider backward compatibility with portfolios already using related features

   Now generate the remaining OpenSpec artifacts:

   1. Run /opsx:continue <change-name> to generate specs/* (delta specs)
   2. Run /opsx:continue <change-name> to generate tasks.md

   IMPORTANT: Let /opsx:continue generate tasks.md using the OpenSpec workflow.
   DO NOT write tasks.md yourself. The /opsx:continue command handles this.

   After tasks.md is generated, the parent agent will validate vertical slicing
   and add a "## Parallelization Strategy" section if needed.

   After tasks.md is generated, report completion and the path to the tasks file.
   ```

5. Wait for the sub-agent to complete
6. Verify specs/* and tasks.md exist at the reported paths
7. Read the generated `tasks.md` file
8. Validate vertical slicing structure:

   **VERTICAL SLICING (required for opsx:apply)**:

   Each slice must deliver an end-to-end testable feature path, NOT a horizontal
   layer. Structure the work so that after completing Slice 1, you have something
   demonstrable and testable.

   ✓ CORRECT - Vertical (end-to-end feature slices):
   ```
   Slice 1: Core component with mock data + basic API (components can be imported)
   Slice 2: Wire real Core utilities (now uses actual Core patterns)
   Slice 3: Add integration tests using Core test infrastructure
   ```

   ✗ WRONG - Horizontal (architectural layers):
   ```
   Phase 1: All Core component implementations
   Phase 2: All API updates
   Phase 3: All test additions
   Phase 4: All documentation
   ```

   **Indicators of VERTICAL slicing (correct)**:
   - Each slice has a "Deliverable:" that describes a working, testable feature
   - Slices cross architectural boundaries (e.g., a slice touches both component and API)
   - Each slice ends with something demonstrable to a portfolio developer
   - Parallelization is possible with minimal dependencies between slices

   **Indicators of HORIZONTAL slicing (incorrect)**:
   - Slices are organized by layer: "Components", "APIs", "Tests", "Docs"
   - Deliverables are architectural components, not user-facing features
   - Early slices cannot be tested end-to-end without later slices
   - Slices have sequential dependencies (must finish layer 1 before layer 2)

   Requirements for each slice:
   - Deliverable: A working, testable increment (e.g., "Basic map layer component importable in portfolios")
   - Test: Explicit verification steps showing the slice works end-to-end
   - Parallelization: Slices should be independent enough to implement concurrently with minimal blocking
   - Checkpoints: Each subtask has a "Test:" line describing verification
   - Size: Prefer 3-5 major slices; more than 5 suggests scope is too large
   - Duration: Max 2 hours per subtask; break larger work into smaller subtasks

9. If horizontal or mixed slicing detected, **automatically convert to vertical slices**:

   CRITICAL: The opsx:apply skill requires vertical slicing. If /opsx:continue
   generated horizontal slices, you MUST restructure them before presenting to the user.

   **Conversion process**:

   a) **Identify end-to-end feature paths**: Look for the smallest complete portfolio-usable
      feature that touches all relevant architectural layers. For example:
      - Instead of: "Slice 1: All components" + "Slice 2: All APIs"
      - Convert to: "Slice 1: Basic layer component + API" + "Slice 2: Advanced layer component + API"

   b) **Restructure each slice** with these required elements:
      - **Deliverable:** - A working, demonstrable feature (not just "component exists")
      - **Test:** - Explicit verification showing the end-to-end path works
      - **Subtasks in markdown checklist format**: Each subtask MUST use `- [ ] instruction` format
      - Subtasks that cross layers (e.g., "- [ ] Create component" + "- [ ] Add API method" + "- [ ] Add documentation")

      CRITICAL: Preserve the markdown checklist format (`- [ ] ...`) for all subtasks.
      Do NOT use numbered lists (1. 2. 3.) or plain bullets (- without [ ]).
      The opsx:apply skill depends on this format to track task completion.

   c) **Preserve parallelization opportunities**: Structure slices to be independent
      - Good: "Slice 1: map layer component" and "Slice 2: data visualization component" are independent
      - Bad: "Slice 1: base utilities" must complete before "Slice 2: components that use utilities"

   d) **Update Parallelization Strategy (if it exists)**: If the tasks.md already has
      a "## Parallelization Strategy" section, revise it to reflect the new slice
      structure (which slices can run in parallel, which have dependencies).
      Note: If the section doesn't exist, the parent agent will add it in step 10.

   e) **Write changes to tasks.md**: Edit the file in place using the Edit tool

   f) **Show diff to user**: Display what changed and explain why (e.g., "Converted
      from layer-based to feature-based slices for better parallelization")

10. **CRITICAL: Check for and add Parallelization Strategy section**:

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
   (step 9d), verify it accurately reflects the new vertical slice structure and
   update if needed.

11. Present tasks.md to the user for final approval:

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

12. Handle user input (same flow as Phase 4: approve, request edits, or manual edit)

**CRITICAL: DO NOT PROCEED TO PHASE 6 WITHOUT EXPLICIT USER APPROVAL.**

Wait for the user to explicitly approve the tasks.md structure. If they don't respond
or the conversation ends, stop here - do not auto-proceed to completion.

**Output**: Generated `specs/*` and `tasks.md` in `openspec/changes/<slug>/`

### Phase 6: Completion

After tasks.md is approved:

1. Announce completion:

   ```
   ✅ QRSPI planning phase complete (Core migration).

   Change name: <change-name-from-phase-3>

   Generated artifacts:
   - openspec/changes/<change-slug>/proposal.md
   - openspec/changes/<change-slug>/design.md
   - openspec/changes/<change-slug>/specs/*
   - openspec/changes/<change-slug>/tasks.md

   Next steps:
   1. Review the artifacts one more time if needed
   2. Run `/clear` to start fresh context for implementation
   3. Run `/opsx:apply <change-name>` to begin implementation

   This allows you to create multiple specs before implementation and
   maintains proper context management.
   ```

2. Exit the skill — do NOT automatically invoke `/opsx:apply`

## Key Principles

### Context Isolation (QRSPI Core)

The two-context-window pattern is essential:

- **Questions generation**: Portfolio docs are IN context → generates questions about generalization
- **Research answers**: Portfolio docs are OUT of context, only questions IN context → objective facts about Core

This prevents "direct copying" where the agent reproduces portfolio-specific implementation instead of generalizing for Core.

### Human Checkpoints

Two mandatory review gates:

1. **After design.md**: Catch portfolio-specific dependencies, wrong Core patterns, missing abstractions
2. **After tasks.md**: Verify vertical slicing, identify missing Core infrastructure work

These are the highest-leverage moments for corrections — before any code is written.

### Vertical Slicing Enforcement

The skill should actively check for and discourage horizontal (layer-by-layer) slicing. Each phase should deliver a testable end-to-end slice that portfolios can use.

### No Automatic Implementation

The skill stops after planning. The user explicitly runs `/opsx:apply` when ready. This allows:

- Multiple specs to be created before any implementation starts
- Context clearing between planning and implementation
- User control over when implementation begins

## Error Handling

**If OpenSpec commands fail**:
- Surface the error to the user
- Ask if they want to retry or abort
- Do not continue to next phase on failure

**If sub-agent fails**:
- Show the error from the sub-agent
- Ask user if they want to retry that phase or provide manual input
- Allow manual fallback (user provides questions/research directly)

**If design.md or tasks.md is missing after generation**:
- Check if the file exists at expected path
- If missing, ask user to verify OpenSpec configuration
- Provide the expected path for manual inspection

**If portfolio docs reference non-existent Core components**:
- Surface this explicitly in the design review (Phase 4)
- Tasks should include creating the missing Core infrastructure
- Ask user if the dependency should be added to Core or replaced with an alternative

## Configuration Requirements

This skill assumes the project has:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. `openspec/config.yaml` configured (ideally via `accelint-onboard-openspec` skill)
3. Expanded OpenSpec profile enabled
4. `AGENTS.md` or `CLAUDE.md` defining agent behavior (ideally via `accelint-onboard-agent` skill)

If any of these are missing, guide the user to set them up before running this skill.

## NEVER Do This

**NEVER generate artifacts yourself** — Always use /opsx commands (new, continue) to create proposal.md, design.md, specs/*, and tasks.md. The /opsx workflow handles artifact generation following OpenSpec's configured rules. If you write artifacts directly, you bypass the project's design/spec/task rules and create inconsistent outputs.

**NEVER copy portfolio implementation directly** — Keep portfolio docs OUT of context during research and design phases. The goal is generalization, not reproduction. If research and design phases see the portfolio implementation, they'll copy portfolio-specific patterns instead of adapting to Core's architecture.

**NEVER ignore portfolio-specific dependencies** — If the portfolio design mentions components or libraries that don't exist in Core, explicitly surface this in the design review. Tasks should account for either: (a) creating Core equivalents, or (b) finding existing Core alternatives. Silently assuming Core has everything the portfolio has leads to broken implementations.

**NEVER generate tasks.md from scratch** — Always use /opsx:continue to create the initial tasks.md. However, you MUST restructure it if the generated output uses horizontal slicing instead of vertical slicing. The opsx:apply skill requires vertical slicing. If /opsx:continue generates horizontal slices (organized by architectural layer), convert them to vertical slices (end-to-end feature deliverables) following the validation guidance in Phase 5 Step 9. When restructuring, preserve the markdown checklist format (`- [ ] task`) — do NOT convert to numbered lists or plain bullets.

**NEVER use numbered lists or plain bullets in tasks.md** — All subtasks must use markdown checklist format: `- [ ] instruction`. The opsx:apply skill tracks completion by checking/unchecking these boxes. If you see numbered lists (1. 2. 3.) or plain bullets (- without [ ]), convert them to `- [ ] ...` format.

**NEVER overcomplicate Parallelization Strategy** — Keep it simple: list which slices can run in parallel, which have sequential dependencies, and recommended implementation order. Don't add excessive detail about every possible edge case or coordination mechanism. The example in this skill shows the right level of detail.

**NEVER continue to specs/tasks without design approval** — Phase 4 checkpoint is mandatory. If you skip the design review and generate tasks immediately, you miss the "brain surgery" moment where corrections are cheap. Fixing design issues after code is written costs review cycles and rework. For migrations, this is even more critical since portfolio-specific dependencies need explicit review.

**NEVER let the portfolio docs leak into research/design context** — Questions are generated WITH portfolio context, but research and design must see ONLY questions + research answers. If the portfolio docs stay in context during research, the agent will copy the portfolio implementation instead of adapting it for Core.

**NEVER skip the mandatory checkpoints** — Phase 4 (after design.md) and Phase 5 Step 12 (after tasks.md) require explicit user approval before continuing. If you proceed without waiting for user confirmation ("looks good", "approve", "continue"), you bypass the core value of QRSPI: cheap corrections at the design stage. The "brain surgery" moment is when design is reviewed BEFORE specs/tasks are generated. Skipping checkpoints defeats the entire methodology.

## Example Usage

```
User: I want to migrate this feature to Core using the QRSPI process.

Portfolio proposal.md: [file path or pasted content]
Portfolio design.md: [file path or pasted content]
