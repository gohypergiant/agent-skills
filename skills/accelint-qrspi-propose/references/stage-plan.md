# Stage: Plan

Produce the design and task artifacts for a change whose questions and research already exist. This is the Design, Structure, and Plan part of QRSPI, run by `accelint-qrspi-propose`.

Follow this file yourself, in the agent context of `accelint-qrspi-propose`. Do not run it as a single sub-agent. It contains two human checkpoints, and a sub-agent cannot pause for approval. It spawns its own sub-agents for artifact generation. Those sub-agents never see the ticket, so their output is shaped by the research and not by a solution already in someone's head.

## Inputs

- **Change name** and **`changeRoot`** (the change folder path), given to you by `accelint-qrspi-propose`.
- `<changeRoot>/questions.md` and `<changeRoot>/research.md`.

You do not need the ticket and must not use it. If ticket text is in your context from earlier, do not put any of it, or any goal, flag, open decision, or paraphrase derived from it, into a sub-agent prompt. The change name is the only ticket-derived text allowed in a prompt.

## Workflow Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  Stage       Context              Output                         │
├──────────────────────────────────────────────────────────────────┤
│  Design      Q+R (NO ticket)      proposal.md, design.md         │
│  Illustrate  design.md via show-me skill (optional, never blocks)│
│  ⚠️  CHECKPOINT 1: review proposal.md + design.md - MUST approve │
│  (frontmatter: specs_touched/decisions/created_at -> design.md)  │
│  Specs/Tasks Q+R+design           tasks.md                       │
│  (specs/* is OpenSpec bookkeeping; generated whenever OpenSpec   │
│   decides, not reviewed)                                         │
│  ⚠️  CHECKPOINT 2: review tasks.md - MUST approve                │
└──────────────────────────────────────────────────────────────────┘
```

Steps carry stable tags so references stay unambiguous: `[S-DESIGN-GEN]` (2), `[S-ILLUSTRATE]` (6), `[CHECKPOINT-1]` (7), `[S-FRONTMATTER]` (8), `[S-TASKS-GEN]` (9), `[CHECKPOINT-2]` (12).

Capture frontmatter at step 8 after Checkpoint 1 approval, not before. `design.md` reaches its final form for this planning pass only after the user approves it or confirms a manual edit. Earlier capture can write `specs_touched/decisions/created_at` against content the user is about to change. The `created_at` timestamp marks when the user approved the design (the moment the change becomes "real").

⚠️  REQUIRED CHECKPOINTS: MUST pause and wait for explicit user approval at both checkpoints (step 7 [CHECKPOINT-1] and step 12 [CHECKPOINT-2]). Proceeding without approval bypasses QRSPI's core value.

## Steps

Execute these steps in order without stopping between them, except at the two required checkpoints (steps 7 and 12), where you MUST stop and wait for the user.

1. **Read the inputs and find the starting point.** Read `<changeRoot>/questions.md` and `<changeRoot>/research.md` in full. Then look at `<changeRoot>` and use the first row that matches:

   | Folder contents | Start at |
   |---|---|
   | `proposal.md` or `design.md` missing | Step 2 |
   | `design.md` exists without `created_at`, `specs_touched`, and `decisions` in its frontmatter | Step 7 (design not yet approved) |
   | `design.md` has that frontmatter, `tasks.md` missing | Step 9 |
   | `tasks.md` exists | Step 11, then step 12 |

   Frontmatter is written only after Checkpoint 1 approval (step 8), so its presence means the design was approved. If the folder is inconsistent (for example `tasks.md` exists but `design.md` does not), stop and tell the user what is inconsistent instead of picking a step.

2. **Generate design scaffolding** `[S-DESIGN-GEN]` (Context isolation: the ticket text must not appear in the sub-agent's prompt during artifact generation. Use the Agent tool to spawn a sub-agent with only questions + research to prevent "completion bleed".) Read `openspec/config.yaml` to extract the `rules.design` section.

3. Read `CLAUDE.md` or `AGENTS.md` to extract agent behavior context.

4. Use the Agent tool to spawn a NEW sub-agent with the prompt block below. Send the block's text unchanged: replace only the `<angle-bracket>` placeholders (pasting the complete stored text, unabridged) and add nothing before, after, or inside it.

   ```text
   You are generating OpenSpec artifacts based on QRSPI research. You have access
   to the research questions and answers, but NOT the original ticket text. This
   prevents solution bias.

   CHANGE NAME: <change-name>

   Research Questions and Answers:
   <paste the complete contents of questions.md, unabridged>

   Research Findings:
   <paste the complete contents of research.md, unabridged>

   OpenSpec Design Rules (from config.yaml):
   <paste the rules.design section verbatim from step 2>

   Agent Behavior Context:
   <paste relevant sections from CLAUDE.md/AGENTS.md from step 3>

   Create the proposal and design artifacts for the existing OpenSpec change named
   above by using the OpenSpec skills. The change folder already exists, so do not
   create a new change. Find the openspec-continue-change skill, read its
   instructions in full, and follow it exactly. All artifact files are written by
   following that skill, so its configured rules apply. Do not author artifact
   content outside it.

   1. Follow the openspec-continue-change skill with the change name, one artifact
      at a time, until both proposal.md and design.md exist. Do NOT generate tasks.md.
      If OpenSpec also generates specs/* along the way, that is fine.
      Do not add YAML frontmatter to proposal.md or design.md, even if earlier
      changes in the repo have it. The parent agent adds it after design approval.

   2. Stop. Report completion and the path to design.md.

   Your job ends here. The parent agent handles the design review checkpoint and
   all later steps.
   ```

5. Wait for the sub-agent to complete, then verify that `proposal.md` and `design.md` exist in `<changeRoot>`.

6. **Illustrate the design (optional).** `[S-ILLUSTRATE]` Check whether the `show-me` skill is installed (look for it in your available skills list).

   - **Installed**: Invoke the `show-me` skill on `<changeRoot>/design.md` to illustrate its important concepts, flows, boundaries, and proposed architecture. Run it yourself, in this context. Do not use a sub-agent: the output feeds the checkpoint you present next, and the step needs no isolation, because it only reads the design and never sees the ticket. Keep the design content unchanged. Only add or link illustrations. If `show-me` writes separate files, link them from `design.md` and mention them at the checkpoint.
   - **Not installed**: Do not stop. Note once, in the step 7 message, that `show-me` is recommended for illustrating the design, then go on to step 7.
   - **`show-me` fails or produces nothing usable**: Report that in one line, leave `design.md` as it was, and go on to step 7.

   This step never blocks the workflow and never replaces the review at step 7.

7. ⚠️ **REQUIRED CHECKPOINT: Design Review** `[CHECKPOINT-1]` (This is the "brain surgery" moment from the QRSPI talk. A correction here costs minutes; the same correction after implementation costs a code review cycle. You MUST pause here and wait for user input. DO NOT proceed without explicit user approval.)

   Read the generated `proposal.md` and `design.md` files.

   Present them to the user with this framing:

   ```text
   Proposal and design artifacts generated (proposal.md, design.md). Please review for:

   - Wrong pattern references (did I find the legacy way instead of the current way?)
   - Unresolved assumptions presented as decisions
   - Missing affected systems (any service boundaries not mentioned?)
   - Scope creep (does the design cover more than the ticket?)

   Options:
   (a) Approve — continue to task breakdown
   (b) Request edits — tell me what to change, I'll modify in place
   (c) Manual edit — edit the file yourself, then tell me when ready
   ```

   If `show-me` was not installed, add one line under the list: "Tip: the `show-me` skill is recommended for illustrating design.md; it was not found, so this review is text only."

   Wait for user input:
   - **(a) Approve**: Proceed to step 8
   - **(b) Request edits**:
     - User describes changes
     - Make edits in place to the file concerned (proposal.md or design.md)
     - Show diff of changes
     - Re-present for review (repeat until approved)
   - **(c) Manual edit**:
     - Wait for user confirmation that edits are complete
     - Re-read proposal.md and design.md
     - Proceed to step 8

   REQUIRED: If the user does not explicitly approve (says "looks good", "approve", "continue", etc.), DO NOT move forward. This checkpoint is mandatory. Skipping it bypasses the core value of QRSPI methodology.

8. **Capture specs_touched/decisions frontmatter.** `[S-FRONTMATTER]` Once the user has approved (a) or confirmed their manual edits are complete (c), design.md is in its final form for this planning pass — capture its `specs_touched` and `decisions` as structured YAML frontmatter now, not any earlier, so an edit made during this same checkpoint can't leave the frontmatter stale against content that changed after it was written.

   **Step-by-step process:**

   a. **Read the current design.md file** to see what exists:
      ```bash
      Read <changeRoot>/design.md
      ```

   b. **Extract the data you need to write:**
      - **`specs_touched`**: the capability names design.md and proposal.md already declare as affected or introduced by this change. This is the change's own stated scope, read back out of what was just approved — not computed some other way. The delta spec files under `openspec/changes/<slug>/specs/` may or may not exist yet at this point (OpenSpec decides when to generate them), so derive it from the approved proposal.md and design.md, not from `specs/`.
      - **`decisions`**: design.md's own decision content — the choices, rationale, and alternatives the design phase already worked through — restructured into a list of `{id, choice, rationale, alternatives}` entries. This is structuring content that's already there, not writing new design content.
      - **`created_at`**: ISO 8601 timestamp with Z suffix marking when this change was created (now, at the moment the user approves the design). Generate this deterministically using:
        ```bash
        python3 -c "from datetime import datetime, timezone; print(datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z'))"
        ```
        This is the first of three timestamps used to measure time spent in the QRSPI flow (created_at → started_at → completed_at).

   c. **Write the frontmatter using the Edit tool:**

      - If design.md has NO frontmatter yet, add a complete frontmatter block at the top:
        ```yaml
        ---
        change: <change-name>
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

9. **Generate tasks (and any remaining specs)** `[S-TASKS-GEN]` (Context isolation: continue to keep the ticket out of context. Spawn a sub-agent with questions + research + approved design.md.) Read the (possibly user-edited) `design.md` from step 8, read `openspec/config.yaml` to extract the `rules.spec` and `rules.tasks` sections, and read `CLAUDE.md` or `AGENTS.md` for agent behavior context.

10. Use the Agent tool to spawn a NEW sub-agent with the prompt block below. Send the block's text unchanged: replace only the `<angle-bracket>` placeholders (pasting the complete stored text, unabridged) and add nothing before, after, or inside it.

   ```text
   You are generating the remaining OpenSpec artifacts based on QRSPI research and an
   approved design. You have access to research and design, but NOT the original
   ticket text.

   CHANGE NAME: <change-name>

   Research Questions and Answers:
   <paste the complete contents of questions.md, unabridged>

   Research Findings:
   <paste the complete contents of research.md, unabridged>

   Approved Design:
   <paste the complete contents of design.md from step 8, unabridged>

   OpenSpec Spec Rules (from config.yaml):
   <paste the rules.spec section verbatim from step 9>

   OpenSpec Tasks Rules (from config.yaml):
   <paste the rules.tasks section verbatim from step 9>

   Agent Behavior Context:
   <paste relevant sections from CLAUDE.md/AGENTS.md from step 9>

   Find the openspec-continue-change skill, read its instructions in full, and follow it exactly.
   Resolve relative paths from the supporting-files directory it provides.
   All artifact files are written by following that skill, so
   OpenSpec's configured rules apply. Do not author artifact content outside it.

   Follow openspec-continue-change with the change name, one artifact at a time,
   until tasks.md exists. specs/* may already exist; if OpenSpec has not generated
   them yet, it will do so before tasks.md. Then stop.

   After tasks.md is generated, the parent agent will validate vertical slicing
   and add a "## Parallelization Strategy" section if needed.

   After tasks.md is generated, report completion and the path to the tasks file.
   ```

   Wait for the sub-agent to complete (INTERNAL STEP: Do NOT display artifact generation details to the user). Verify `tasks.md` exists in `<changeRoot>` (and that `specs/*` exists, unless OpenSpec skipped specs for this change).

11. **Validate and fix `tasks.md`.** Read the generated `tasks.md`, then read `references/slicing-rules.md` in full and apply its three parts in order: validate vertical slicing, convert horizontal slicing if found, and add or fix the `## Parallelization Strategy` section. This step is REQUIRED. `accelint-qrspi-apply` depends on all three.

12. ⚠️ **REQUIRED CHECKPOINT: Tasks Review** `[CHECKPOINT-2]` - Present `tasks.md` to the user for final approval:

   ```text
   Tasks generated.

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

   Handle user input (same flow as Checkpoint 1: approve, request edits, or manual edit)

   REQUIRED: Wait for the user to explicitly approve the `tasks.md` structure. If they do not respond or the conversation ends, stop here. Do not report completion to the orchestrator.

13. **Report to the orchestrator.** After `tasks.md` is approved, report that planning is approved and list the artifacts that exist in `<changeRoot>`. Do not announce completion to the user and do not invoke `accelint-qrspi-apply`. The orchestrator owns the completion message.

## Error Handling

**If OpenSpec commands fail**: Surface the error to the user, ask whether they want to retry or abort, and DO NOT continue to the next step on failure.

**If the sub-agent fails**: Show the error from the sub-agent and ask whether the user wants to retry that step or provide manual input. Allow manual fallback.

**If a sub-agent reports a deviation from these instructions**: Before relaying it to the user, compare the behavior with the text of the inner OpenSpec skill it was following. Do not report behavior that the inner skill itself instructs.

**If `specs_touched` or `decisions` cannot be confidently read out of approved `design.md` or `proposal.md` (step 8)**:
- DO NOT guess. Show the user what is missing (for example, "no capability declarations found" or "no decisions with a stated rationale")
- Ask the user to add it to `design.md` directly, then re-run step 8
- DO NOT block later steps on this. A change can proceed to specs/tasks without this frontmatter, but `accelint-qrspi-archive` will need to derive it later from `proposal.md` and the by-then-existing delta specs instead of reading it from frontmatter

**If `proposal.md`, `design.md` or `tasks.md` is missing after generation**:
- Check whether the file exists at the expected path
- If it is missing, ask the user to verify OpenSpec configuration
- Provide the expected path for manual inspection

## NEVER Do This

**NEVER generate artifacts yourself** — Always create artifacts by having the sub-agent find the OpenSpec skill (`openspec-continue-change`), read its instructions, and follow it, to create `proposal.md`, `design.md`, `specs/*`, and `tasks.md`. That skill writes the files under OpenSpec's configured rules; the rule means no artifact content comes from your own judgment outside it. If you write artifacts directly, you bypass the project's design, spec, and task rules and create inconsistent outputs. The one narrow exception is step 8's `specs_touched`/`decisions` frontmatter block. That block is cross-skill bookkeeping metadata for `accelint-qrspi-archive`, derived from content openspec-continue-change already generated and already approved by the user — not new design content. Even there, only the YAML frontmatter block is written; the `design.md` body is never touched by that step. Step 6 is the other exception: it only adds illustrations through `show-me`, before the checkpoint.

**NEVER generate `tasks.md` from scratch** — Always follow the openspec-continue-change skill to create the initial `tasks.md`. However, you MUST restructure it if the generated output uses horizontal slicing instead of vertical slicing, by following `references/slicing-rules.md`. When restructuring, preserve the markdown checklist format (`- [ ] task`) — do NOT convert it to numbered lists or plain bullets.

**NEVER use numbered lists or plain bullets in `tasks.md`** — All subtasks MUST use markdown checklist format: `- [ ] instruction`. The `accelint-qrspi-apply` skill tracks completion by checking and unchecking these boxes. If you see numbered lists (`1. 2. 3.`) or plain bullets (`-` without `[ ]`), convert them to `- [ ] ...` format.

**NEVER overcomplicate Parallelization Strategy** — Keep it simple: list which slices can run in parallel, which slices have sequential dependencies, and the recommended implementation order. Do not add excessive detail about every possible edge case or coordination mechanism.

**NEVER continue to specs/tasks without design approval** — Step 7 [CHECKPOINT-1] is a required checkpoint. If you skip the design review and generate tasks immediately, you miss the "brain surgery" moment, where corrections are cheap. Fixing design issues after code is written costs review cycles and rework.

**NEVER capture `specs_touched`/`decisions`/`created_at` frontmatter before `design.md` is in its final, approved state** — Step 8 runs only after (a) approval or (c) confirmed manual edits, never during a (b) request-edits loop or speculatively ahead of approval. Capturing it against a draft that is still being revised creates exactly the stale metadata `accelint-qrspi-archive` depends on this stage not producing.

**NEVER skip writing the `created_at` timestamp** — This field is required by both `accelint-qrspi-apply` (to track when implementation started) and `accelint-qrspi-archive` (to track the full lifecycle). If the Edit tool fails when writing frontmatter, retry or ask the user to add it manually — do not proceed without it.

**NEVER guess `specs_touched` or `decisions` when they cannot be confidently read out of the approved `design.md` or `proposal.md`** — ask the user to add what is missing to `design.md` directly instead. A silently invented capability list is worse than a visible gap, because `accelint-qrspi-archive` will trust this frontmatter as the author's explicit statement of scope.

**NEVER let the ticket leak into design or tasks context** — No ticket text, and no goal, flag, open decision, or paraphrase derived from it, may appear in any sub-agent prompt. The change name is the only ticket-derived text allowed. If the ticket leaks into artifact generation, the agent will design toward a solution already in mind instead of from the research.

**NEVER skip the required checkpoints** — Step 7 (after `proposal.md` and `design.md`) and step 12 (after `tasks.md`) require explicit user approval before continuing. If you proceed without waiting for user confirmation ("looks good", "approve", "continue"), you bypass the core value of QRSPI: cheap corrections at the design stage.
