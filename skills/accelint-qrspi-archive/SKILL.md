---
name: accelint-qrspi-archive
description: Archive an OpenSpec change end-to-end. This skill invokes openspec-archive or openspec-bulk-archive itself to perform the native merge, then immediately follows up with the cross-capability linking and running indices OpenSpec doesn't build on its own — linking every capability a change touched via a shared `related:` frontmatter list, keeping `openspec/specs/INDEX.md` current, and appending a row to `openspec/changes/archive/INDEX.md`. Use this skill whenever the user wants to archive a change, says "archive this change", "bulk archive these changes", "run openspec-archive", "run openspec-bulk-archive", "update the specs index", "cross-link the specs", or wants the archived-change changelog kept current. This skill is purely additive on the linking side — it never prunes a `related:` entry and never changes a change's `Status` column after the initial write; that pruning/synthesis work belongs to `accelint-archive-synthesis`.
license: Apache-2.0
compatibility: Requires the OpenSpec CLI. Per-capability spec writes require sub-agent support — see the skill body for the degraded fallback if unavailable. Native archive always runs directly in the invoking agent's own context, never as a subagent, regardless of sub-agent availability. Each change's design.md should carry specs_touched and decisions frontmatter — ideally written by accelint-qrspi-propose at design time — but preflight Task A can derive and confirm it when a change didn't go through that flow. Each touched spec must already have a ## Purpose or ### Purpose heading in its body.
metadata:
  author: accelint
  version: "1.4.0"
---

# Accelint QRSPI Archive

Archive an OpenSpec change and follow it with the cross-capability linking and index bookkeeping OpenSpec doesn't do on its own. This skill invokes openspec-archive or openspec-bulk-archive itself — it's the entry point for archiving a change, not a step that reacts after someone has already archived one — waits for the merge to fully resolve, and then links every pair of capabilities the change touched via a shared `related:` frontmatter list, keeps a single running index of all specs up to date, and appends to an append-only changelog of every archived change.

Cross-linking has to happen after the merge resolves, not before it, which is exactly why this skill runs the native command itself as its own first phase rather than treating "a merge happened" as some external event to watch for. A delta spec in `openspec/changes/[slug]/specs/` is still provisional — openspec-bulk-archive may resolve conflicts across several changes in chronological order before a capability's spec reaches its final shape. Only the merged, archived spec is worth indexing; anything computed earlier would be linking against content that might still change underneath it.

## What This Skill Does

**Automates**: the full archive operation for one or more OpenSpec changes in a single invocation — invoking openspec-archive or openspec-bulk-archive itself, then immediately following up with cross-capability linking and index maintenance.
**Scope**: everything from "archive this change" through updated indices. This skill calls the native command itself during archive and extraction; it does not wait for the merge to have happened some other way first.
**Output**: the change(s) archived via OpenSpec's own merge, plus updated `related:` frontmatter and a regenerated `## Related Specs` section on every touched spec, an updated `openspec/specs/INDEX.md` (patched for the capabilities this batch touched, or built fresh project-wide the first time the file doesn't exist yet), and one appended row per archived change in `openspec/changes/archive/INDEX.md`.
**Does NOT**: implement the merge or conflict-resolution logic itself (that's OpenSpec's own, which this skill invokes via the native command rather than reimplementing), prune any `related:` entry, change a change's `Status` column after its initial write, reorder existing changelog rows, or shell out to the OpenSpec CLI to read local spec files (plain file reads are sufficient — see Explicitly Out of Scope).

## Prerequisites

- OpenSpec CLI installed and initialized, with one or more changes ready to archive.
- Sub-agent support, for per-capability spec writes only — those always run as subagents, unconditionally, and this is a hard requirement for normal operation there, not an optional speedup for large batches (see Error Handling for the degraded fallback if unavailable). Archive and extraction never uses a subagent, regardless of whether sub-agent support exists — see the Archive and Extract section for why.
- Each change's `openspec/changes/[slug]/design.md` has YAML frontmatter including `specs_touched` (a non-empty list of capability names) and `decisions` (a list of `{id, choice, rationale, alternatives}` entries).
- Every capability named in any `specs_touched` list already has `openspec/specs/[capability]/spec.md` with a `## Purpose` or `### Purpose` heading in its body — this skill reads that heading rather than duplicating purpose text into frontmatter, and rewriting the correct behavior depends on that heading actually being there (verified in preflight checks, Task B).

If any of these are missing, report the gap and guide the user to resolve it before proceeding — do not silently substitute a guessed default for a missing field. This applies as-is to spec writing's sub-agent support and a touched spec's missing `## Purpose` or `### Purpose` heading. A change's missing `specs_touched`/`decisions` frontmatter is handled differently: preflight Task A derives a candidate from the change's own files and gets the author's explicit confirmation before writing it, rather than stopping outright — see Task A below for why a hard stop isn't actually necessary here, and why it still isn't a silent guess.

## Workflow Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│  Stage              Action                              Output         │
├────────────────────────────────────────────────────────────────────────┤
│  0 Preflight        Verify frontmatter + Purpose         Go / no-go    │
│                     headings before touching anything                  │
│  1 Archive+Extract  Run openspec-archive or openspec-bulk-  Change     │
│                     archive yourself, in this context      records     │
│                     (never a subagent); stay with any                  │
│                     internal sync branch until archive's               │
│                     own steps finish, then read back                   │
│                     specs_touched + decisions                          │
│  2 Validate         Confirm archive records are             Checked    │
│                     structurally complete                  records     │
│  3 Link             Combine new co-touch pairs across         New      │
│                     this batch's changes (no file I/O)     partners    │
│  4 Write specs      SUBAGENT (one per capability,          Updated     │
│                     always, never inline): merges new       specs      │
│                     partners with existing related:,                   │
│                     sorts, writes frontmatter + body                   │
│  5 Specs index      Patch specs/INDEX.md for the           INDEX.md    │
│                     capabilities this batch touched                    │
│                     (full rebuild only if the index is                 │
│                     missing)                                           │
│  6 Change log       Append one row per archived change     INDEX.md    │
│                     to changes/archive/INDEX.md (append-only)          │
│  7 Report           Summarize what changed                 Summary     │
└────────────────────────────────────────────────────────────────────────┘

Critical: for openspec-bulk-archive, validation through reporting run exactly ONCE, after every
merge in the batch has resolved — never once per intermediate merge. Running
early would compute pairs against a specs_touched set that hasn't finished
accumulating cross-change conflicts, and would patch INDEX.md against a
half-finished batch.

Spec writing always delegates to subagents, regardless of batch size — one
capability or forty. This isn't a parallelization optimization that only
kicks in for large batches; it's how this skill keeps raw spec.md contents
out of the parent's context on every run, the same pattern
accelint-qrspi-propose and accelint-qrspi-apply use.

Archive and extraction is the mirror image: it never delegates to a subagent, regardless of
batch size or whether sub-agent support is even available. openspec-archive and
openspec-bulk-archive are themselves agent-driven, multi-step skills — not a
single deterministic CLI call — and a subagent handed instructions to run openspec-archive
has no reliable way to resume that skill's own remaining steps once it
branches internally into something like a separate sync skill, and no way
to surface an interactive prompt back to the user if one comes up. Both of
those are failure modes this skill hit in practice, not hypothetical ones —
see the Archive and Extract section for the full account.
```

## Implementation Steps

Execute these steps in order without stopping between them unless an error occurs:

**Preflight Checks**

Goal: confirm the archive operation's inputs are shaped correctly before touching any spec or index file. Task A is a narrow exception: once the author confirms a derived `specs_touched`/`decisions` candidate, it writes that back into `design.md` — that's filling in an input step 7 expects to already be there.

1. Determine scope: a single-change archive (openspec-archive with a change name) or a bulk archive (openspec-bulk-archive) spanning several pending changes.

2. **Verification Task A — design.md frontmatter.** For every change about to be archived, read `openspec/changes/[slug]/design.md` and confirm its frontmatter contains a non-empty `specs_touched` list and a `decisions` list where each entry has at least `id` and `choice`:

   ```yaml
   ---
   change: add-live-sync
   specs_touched: [sync/protocol, ui/status-indicator]
   decisions:
     - id: D1
       choice: polling with 5s interval
       rationale: no infra budget for a message broker this quarter
       alternatives: [websocket push, long polling]
   ---
   ```

   If frontmatter is present and well-formed, proceed as-is — this is the expected case for any change that went through `accelint-qrspi-propose`, which is where `specs_touched`/`decisions` are supposed to get written at design time in the first place. If changes are consistently arriving here without this frontmatter, that's a signal to go fix `accelint-qrspi-propose` (or `accelint-qrspi-apply`) so it writes this block as part of its own normal workflow — that closes the gap at the source instead of leaning on the recovery path below run after run.

   If frontmatter is missing or malformed for a change, this skill still does not silently substitute a guessed value — the change's author has to make that call explicitly, not this skill. But a hard stop with no path forward isn't the only way to get that explicit confirmation, and most of the time the missing field is recoverable from material the change's own author already wrote:

   - **Derive a candidate.** For `specs_touched`, look at the change's `proposal.md` capability declarations and the delta spec directories under `openspec/changes/[slug]/specs/`. For `decisions`, look at any Decisions section in `proposal.md` or decision prose already present in `design.md`.
   - **Present it for confirmation — don't write it yet.** Show the derived candidate to the user and ask them to (a) confirm it as written, (b) edit it first, or (c) pause so they can fix `design.md` themselves and re-invoke this skill later. Only once the user picks (a) or (b) does the candidate become the value this skill writes into `design.md`'s frontmatter — at that point it's the same explicit author confirmation the well-formed case gets for free, just captured one step later than at propose time.
   - **Stop outright, with no candidate offered**, only when there's nothing in the change's own files to derive from — e.g. an empty delta specs directory and no capability declarations anywhere in `proposal.md`. In that case, report exactly which change and which field is missing, the same as before.

   This is evaluated per change in a bulk-archive batch — one change needing confirmation doesn't block preflight for the others.

3. **Verification Task B — Purpose heading convention.** For every capability named across all `specs_touched` lists in this batch, check whether `openspec/specs/[capability]/spec.md` contains a heading that describes its purpose:

   **Acceptable headings (check in this order, first match wins):**
   - `## Purpose` or `### Purpose`
   - `## Overview` or `### Overview`

   Treat Overview and Purpose as semantically equivalent — both describe what the capability does and why it exists, which is what index updates and spec writing need.

   **If none of these headings exist:**
   Ask the user how to handle it:
   - (a) Add a placeholder `## Purpose` heading with text `_Purpose not yet documented_` for now
   - (b) Pause so they can add the heading themselves first
   - (c) Read the spec content and generate a `## Purpose` heading based on what the spec describes

   Option (c) is usually best when the spec has meaningful content — the agent can synthesize a purpose statement from what's already documented. Option (b) is better for specs that are stubs or need domain expertise to describe accurately. Option (a) is a last resort when you need to unblock immediately but will need to come back and fix it later.

   **Note:** This check applies only to capabilities that already have MAIN specs at `openspec/specs/[capability]/spec.md`. Brand-new capabilities (per step 4) don't have MAIN specs yet, so skip this check for them — they'll get their Purpose heading when their spec is created during archive.

4. For any capability in `specs_touched` that has no `openspec/specs/[capability]/` directory yet — a brand-new capability introduced by this change — note it separately. Step 19 will need to create its `spec.md` frontmatter from scratch rather than editing an existing file, and step 20's Purpose column will need the user to supply a value manually since nothing exists yet to read.

5. Report the preflight summary before proceeding: changes in scope, capabilities touched, and any Task A or Task B outcomes. If Task A ends in a stop for any change — the user chose to pause and fix `design.md` themselves, or no candidate could be derived at all — do not proceed to step 6 for that change. A Task A candidate the user confirmed counts as passing, the same as frontmatter that was already well-formed. If Task B fails for some capability, that's fine to resolve later — steps 6-17 don't touch spec bodies, so only flag it as blocking once step 18 is about to reach that capability.

**Archive and Extract** (runs inline — never a subagent)

6. Let OpenSpec do the actual merge, then read back the data steps 17 and 23 need — done directly in this context, not handed to a subagent.

This step never runs as a subagent, regardless of batch size and regardless of whether sub-agent support is available at all. That's a reversal of this skill's `1.0.0` behavior, made after running into two concrete failure modes in practice:

- **openspec-archive and openspec-bulk-archive are agent-driven skills, not a single deterministic CLI call.** They read project state, decide what needs syncing, and — when a sync is needed — hand off internally to a separate sync skill before returning to finish the rest of the archive workflow (merging delta specs, moving the change into `openspec/changes/archive/`). A subagent given instructions to run openspec-archive has no reliable way to tell "I finished the sync skill this archive step referred me to" apart from "I finished the thing I was actually asked to do" — there's no caller to check back with mid-task. In practice this showed up exactly that way: the subagent ran the sync step, considered its job done, and returned control without ever reaching the merge. Running archive directly in this context means the same agent that issued the instruction is the one watching it branch into sync, so it can recognize the branch for what it is and carry on to archive's remaining steps once sync finishes — the same continuity a person would have running the command themselves.
- **A subagent can't surface an interactive prompt to the user.** openspec-archive and openspec-bulk-archive may raise more than the routine sync y/n — openspec-bulk-archive in particular can prompt for confirmation before merging changes that touch overlapping specs (see step 2 below). A subagent that hits a prompt like that is stuck: it can't hand the question to the user and get a real answer, and guessing on the user's behalf is worse than not proceeding. Running archive inline means any such prompt lands in the same conversation the user is already in.

This does give something up: openspec-archive's own internal work — comparing delta specs against main specs, resolving bulk-archive's cross-change ordering — now happens directly in this context instead of being absorbed by an isolated subagent, so more of it enters context than the `1.0.0` design intended. That's an accepted cost of correctness over context economy, not an oversight; spec writing still isolates its own, typically larger, per-capability file content in a subagent exactly as before, so this cost is confined to the archive step's own scope. Do **not** work around this by shelling out to `openspec archive`/`openspec bulk-archive` directly instead of the openspec-archive/openspec-bulk-archive skill — the skill is where OpenSpec's own delta-spec comparison and edge-case judgment actually live (bulk-archive's conflict resolution isn't reproducible with a bare CLI flag), and bypassing it back to a raw CLI call would throw away the same hybrid-agent judgment this skill exists to keep.

7. Determine scope: a single-change archive (openspec-archive with a change name) or a bulk archive (openspec-bulk-archive) spanning several pending changes.

8. **Known interactive prompt — always sync.** openspec-archive and openspec-bulk-archive will, more often than not, pause mid-run to ask whether to sync. Always answer yes, every time it comes up — this is a routine part of the archive operation completing, not a decision point that needs the user's input. This is the one interactive prompt you always answer yourself.

9. Run the appropriate skill invocation:

  For single change:
   ```text
   Invoke the openspec-archive-change skill.

   [change-name]
   ```

  For bulk archive:
   ```text
   Invoke the openspec-bulk-archive-change skill.

   add-live-sync

   Sync now? (y/n) → yes
   ✓ Synced delta specs, resuming openspec-archive's remaining steps...
   ✓ openspec-archive add-live-sync merged, archived to
     openspec/changes/archive/2026-03-02-add-live-sync/
   ✓ Extracted: specs_touched, decisions from design.md frontmatter

   Computing new co-touch pairs...
   - sync/protocol ↔ ui/status-indicator (new pair)

   [spawns subagent: sync/protocol]  [spawns subagent: ui/status-indicator]
   ✓ sync/protocol/spec.md: related: [ui/status-indicator] (merged, was empty)
   ✓ ui/status-indicator/spec.md: related: [sync/protocol] (merged, was empty)

   Updating openspec/specs/INDEX.md... (2 rows patched, 12 rows untouched)
   Appending to openspec/changes/archive/INDEX.md... (1 row)

   ✅ Archive complete: add-live-sync

   Next steps:
   - Review the diff on the two updated specs before committing
   - related: entries are additive only — pruning is accelint-archive-synthesis's job
   ```

**Scenario 2: Bulk archive touching an already-linked capability**

```text
User: Run bulk-archive on the pending changes

Skill: Running preflight checks across 3 pending changes...
✓ All design.md frontmatter valid
⚠ auth/session-store is missing a ## Purpose or ### Purpose heading

How would you like to handle auth/session-store?
(a) Add a placeholder purpose now and continue
(b) Pause so you can add the heading yourself first

User: (b)

Skill: Paused. Add a ## Purpose or ### Purpose heading to openspec/specs/auth/session-store/spec.md,
then re-invoke this skill to continue.
```

**Scenario 3: Missing design.md frontmatter, recovered from the change's own files**

```text
User: Archive the enhance-mock-consistency-rule change

Skill: Running preflight checks...
⚠ design.md has no specs_touched or decisions frontmatter

Checking proposal.md and openspec/changes/enhance-mock-consistency-rule/specs/
for a derivable candidate...

Derived from this change's own files:
  specs_touched: [testing/mock-consistency]
  decisions:
    - id: D1
      choice: enforce consistency at lint time, not runtime
      rationale: catches drift before merge instead of in CI
      alternatives: [runtime assertion, manual review checklist]

(a) Confirm this as written
(b) Edit it first
(c) Pause so I can fix design.md myself

User: (a)

Skill: Confirmed. Writing this into design.md's frontmatter, then proceeding...

Invoke the openspec-archive-change skill.

enhance-mock-consistency-rule

✓ openspec-archive enhance-mock-consistency-rule merged, archived to
  openspec/changes/archive/2026-07-07-enhance-mock-consistency-rule/
...
```

**Scenario 4: Bulk archive raises a non-routine prompt (surfaced to the user, not answered by the skill)**

```text
User: Run bulk-archive on the pending changes

Skill: Running preflight checks across 2 pending changes...
✓ All design.md frontmatter valid

Invoke the openspec-bulk-archive-change skill.

Sync now? (y/n) → yes
⚠ add-dark-mode and update-footer both touch specs/ui/ — archive both,
  merging in chronological order? (y/n)

This isn't the routine sync prompt, so I'm not answering it myself —
add-dark-mode and update-footer both touch specs/ui/. Archive both,
merging in chronological order (add-dark-mode, then update-footer)?

User: Yes

Skill: ✓ Archived add-dark-mode, then update-footer, specs/ui/ merged in that order
...
```

This is the scenario archive running inline actually unlocks: a subagent handed instructions to run openspec-bulk-archive has no way to relay that ordering question to the user and get a real answer back, so it either stalls or has to guess. Running archive in this context means the question reaches the person who can actually answer it.
