---
name: accelint-qrspi-propose
description: Use this skill when the user wants to start the formal QRSPI/OpenSpec planning workflow for a ticket, bug, feature request, or proposed product/CLI/app change before implementation. Invoke it when the user wants a spec-driven change package with questions first, factual research, proposal/design artifacts, affected specs, and a vertically sliced task plan, with explicit review/approval stops before any coding begins. This is the right skill when the user wants to plan, scope, or break down the change itself, especially if they ask to use QRSPI, create an OpenSpec change, run a planning workflow, or stop before writing code. Do not use it to implement an existing spec, review or polish artifacts that already exist, generate generic architecture docs, archive completed changes, or support loose brainstorming without a request for formal QRSPI/OpenSpec outputs.
license: Apache-2.0
metadata:
  author: accelint
  version: "2.0.0"
---

# Accelint QRSPI

Automate the QRSPI + OpenSpec planning workflow. This skill applies the methodology from "We Got RPI Wrong" through OpenSpec's artifact system. It is the orchestrator: it validates the environment, creates the change folder, holds the ticket, and runs three stages in order, each defined in a file under `references/` (`stage-questions.md`, `stage-research.md`, `stage-plan.md`). Human checkpoints are required before any code is written.

## What This Skill Does

**Automates**: The planning phase of spec-driven development using QRSPI
**Scope**: Questions → Research → Design → Structure/Plan (stops before implementation)
**Output**: A complete OpenSpec change ready for the accelint-qrspi-apply skill

**Does NOT**: Implement code, run tests, create PRs, or archive changes

## Prerequisites

- The OpenSpec workflows `explore`, `new`, and `continue`. Verify with `openspec config list` and check the `workflows:` section. If any is missing, stop and tell the user they need to be enabled.

## Workflow Overview

```
┌────────────────────────────────────────────────────────────────────┐
│  Stage      Runs as            Context             Output          │
├────────────────────────────────────────────────────────────────────┤
│  Setup      orchestrator       Ticket              change folder   │
│  Questions  subagent           Ticket only         questions.md    │
│  Research   subagent           questions.md only   research.md     │
│  Plan       orchestrator,      Q+R (NO ticket)     proposal.md     │
│             ticket-blind                           design.md       │
│             subagents                              specs/*         │
│  ⚠️  CHECKPOINT 1 (in plan): approve proposal.md + design.md       │
│                                                    tasks.md        │
│  ⚠️  CHECKPOINT 2 (in plan): approve tasks.md                      │
│  Done       orchestrator       —                   completion msg  │
└────────────────────────────────────────────────────────────────────┘
```

Keep the ticket out of every context after the Questions stage to prevent completion bleed. File names, headers, the completion marker, ticket rules, and resume rules are defined in `references/file-contract.md`, which only this skill uses. Read it in full before step 5 and follow it exactly. The stage files never read it: this skill checks the files and passes each stage only what it needs.

Steps keep stable tags so references stay unambiguous: `[S-SETUP]` (5), `[S-QUESTIONS]` (6), `[S-RESEARCH]` (7), `[S-PLAN]` (8).

## Implementation Steps

Execute these steps in order without stopping between them. The two required checkpoints run inside `references/stage-plan.md`, where you MUST stop and wait for the user.

1. **Validate user input**: Check that the user provided a ticket, feature request, or idea in their prompt (as skill arguments or in their message), or asked to resume a named change.

   If the prompt is empty or contains only the skill invocation with no actual content:
   ```text
   I need a ticket or feature description to plan. Please provide:

   - A ticket ID and description (e.g., "ATI-123: Add user authentication...")
   - A feature request ("I want to add dark mode support...")
   - An idea or problem statement ("Users complain about slow search...")

   Then I'll use QRSPI to break it down into a structured plan.
   ```
   Exit the skill and wait for the user to provide input. Do NOT proceed with internal examples or placeholder content.

   Hold the ticket text in memory only. Never write it to disk (see `references/file-contract.md`).

2. Tell the user: "Checking OpenSpec configuration..."

3. Run `openspec config list` and parse the output. Check that the `workflows:` section contains `explore`, `new`, and `continue`. If any is missing:
   ```text
   This skill requires these OpenSpec workflows to be enabled: explore, new, continue.

   Your current workflows: [list what's enabled]
   Missing: [list what's missing]

   Enable the missing workflows in your OpenSpec configuration, then re-run this skill.
   ```
   Exit the skill.

4. Note the absolute path of this skill's `references/` directory (the directory that holds this SKILL.md). Steps 6 to 8 use it to point stages at their files.

   If the user asked to resume a named change, use the resume table in `references/file-contract.md` to pick the stage and jump to that step. Otherwise continue to step 5.

5. **Set up the change folder** `[S-SETUP]`: Find the openspec-new-change skill, read its instructions in full, and follow it yourself in this context, using the ticket as the description of what to build. You hold the ticket, so the skill derives the change name from it. Its final "STOP and wait for user direction" ends that skill, not this workflow: once it has created the change and shown the status, take `changeRoot` from the status JSON and continue to step 6. If the name is already taken, add a numeric suffix (`-2`, `-3`, ...) instead of continuing the existing change. See "Change folder" in `references/file-contract.md` for what the name may reveal.

6. **Generate research questions** `[S-QUESTIONS]` (Context isolation: this is the only subagent that sees the ticket. This prevents solution-first thinking.)

   Use the Agent tool to spawn a NEW sub-agent with the prompt block below. Send the block's text unchanged: replace only the `<angle-bracket>` placeholder and add nothing before, after, or inside it.

   ```text
   Read <absolute path to references/stage-questions.md, from step 4> in full and follow it exactly.

   I have this ticket:

   <paste full ticket description here>
   ```

   Wait for the sub-agent to complete and return the questions. INTERNAL STEP: Do NOT display the questions to the user. Write `<changeRoot>/questions.md` using the header and completion marker from `references/file-contract.md`, with the returned text unchanged as the body.

7. **Answer research questions** `[S-RESEARCH]` (Context isolation: the agent answering questions sees ONLY the questions file, never the ticket. This is the core QRSPI insight: research is objective and ticket-agnostic.)

   First run the header and marker check from `references/file-contract.md` on `questions.md`. If it fails, stop and tell the user which file failed and why.

   Use the Agent tool to spawn a NEW sub-agent (fresh context) with the prompt block below. Send the block's text unchanged: replace only the `<angle-bracket>` placeholder and add nothing before, after, or inside it.

   ```text
   Read <absolute path to references/stage-research.md, from step 4> in full and follow it exactly.

   Questions file: <absolute path to questions.md from step 6>
   ```

   Wait for the sub-agent to complete and return the research findings. INTERNAL STEP: Do NOT display the findings to the user. Write `<changeRoot>/research.md` using the header and completion marker from `references/file-contract.md`, with the returned text unchanged as the body.

8. **Plan** `[S-PLAN]`: Run the header and marker check from `references/file-contract.md` on both `questions.md` and `research.md`. If either fails, stop and tell the user which file failed and why. Then read `references/stage-plan.md` in full and follow it yourself in this context. Do NOT spawn it as a single sub-agent: it contains two human checkpoints, and a sub-agent cannot pause for approval. Use the change name and `changeRoot`. Do NOT use the ticket. The stage spawns its own ticket-blind sub-agents and runs both checkpoints.

9. **Completion**: After `references/stage-plan.md` reports that `tasks.md` is approved, announce completion:

   ```text
   ✅ QRSPI planning phase complete.

   Change name: <change-name>

   Generated artifacts (in <changeRoot>):
   - questions.md
   - research.md
   - proposal.md
   - design.md
   - specs/*
   - tasks.md

   Next steps:
   1. Review the artifacts one more time if needed
   2. Run `/clear` to start fresh context for implementation
   3. Invoke the accelint-qrspi-apply skill with <change-name> to begin implementation.

   This allows you to create multiple specs before implementation and
   maintains proper context management.
   ```

10. Exit the skill. Do NOT automatically invoke the accelint-qrspi-apply skill.

## Key Principles

### Context Isolation (QRSPI Core)

- **Questions generation**: Ticket is IN context → generates questions
- **Research answers**: Ticket is OUT of context, only the questions file IN context → objective facts
- **Design and tasks**: Ticket is OUT of context, questions + research (+ approved design) IN context

This prevents "solution-first thinking" where the agent jumps to implementation ideas during research. It is a prompt convention, not a filesystem guarantee. It holds because the ticket is never written to disk and never pasted into a later prompt.

### Human Checkpoints

Two mandatory review gates, run by `references/stage-plan.md`: after `proposal.md` and `design.md`, and after `tasks.md`. These are the highest-leverage moments for corrections, before any code is written.

### No Automatic Implementation

The skill stops after planning. The user explicitly invokes the accelint-qrspi-apply skill when ready. This allows multiple specs to be created before implementation starts, context clearing between planning and implementation, and user control over when implementation begins.

## Error Handling

**If OpenSpec commands fail**: Surface the error to the user, ask whether they want to retry or abort, and DO NOT continue to the next step on failure.

**If a sub-agent fails**: Show the error, ask whether the user wants to retry that stage or provide the questions or research manually, and allow manual fallback. A manual fallback still goes through the file contract (header and marker) before anything reads it.

**If a sub-agent reports a deviation from these instructions**: Before relaying it to the user, compare the behavior with the text of the skill it was following (the stage file or the inner OpenSpec skill). Do not report behavior that the skill itself instructs.

**If a header or marker check fails (steps 7 and 8)**: Stop and tell the user which file failed and why. Do not regenerate or edit the file silently.

## Configuration Requirements

This skill assumes the project has:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. `openspec/config.yaml` configured (ideally via `accelint-onboard-openspec` skill)
3. Expanded OpenSpec profile enabled
4. `AGENTS.md` or `CLAUDE.md` defining agent behavior (ideally via `accelint-onboard-agents` skill)

If any of these are missing, guide the user to set them up before running this skill.

## NEVER Do This

**NEVER generate artifacts yourself** — `proposal.md`, `design.md`, `specs/*`, and `tasks.md` are produced only by sub-agents following the OpenSpec skills, as directed by `references/stage-plan.md`. The files you write yourself are `questions.md` and `research.md` (from sub-agent text, per the file contract). Writing other artifacts directly bypasses the project's design, spec, and task rules.

**NEVER let the ticket leak** — The ticket goes only into the step 6 prompt. It is never written to disk, never passed to the research or plan stages, and no goal, flag, open decision, or paraphrase of it appears in any later prompt. The derived change name is the only allowed exception, as a folder name only. If the ticket stays in context during research, the agent will propose solutions instead of gathering objective facts about the current codebase.

**NEVER show `questions.md` or `research.md` content to the user** — They are internal inputs to the design stage, not review items.

**NEVER skip the required checkpoints** — Checkpoint 1 and Checkpoint 2 run inside `references/stage-plan.md` and require explicit user approval ("looks good", "approve", "continue"). Do not announce completion unless the plan stage reports that `tasks.md` was approved.

**NEVER run the plan stage as one sub-agent** — A sub-agent cannot pause for human approval. Follow it in the orchestrator context.

**NEVER substitute for an unreadable stage file** — If `references/stage-questions.md`, `references/stage-research.md`, or `references/stage-plan.md` cannot be read, stop and tell the user which file failed. Do not do that stage from memory or improvise it.

## Example Usage

```text
User: I want to plan this ticket using QRSPI:

## ATI-12: smart-ls CLI tool
Create a CLI tool that returns structured directory listings as JSON...
```
