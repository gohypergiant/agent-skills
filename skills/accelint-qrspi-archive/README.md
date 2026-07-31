# Accelint QRSPI Archive

Archive OpenSpec changes with cross-capability linking and index maintenance. This skill runs the complete archive workflow itself: native archive first, then additive related-spec linking, targeted `openspec/specs/INDEX.md` maintenance, and append-only `openspec/changes/archive/INDEX.md` updates.

## What This Does

This skill handles the full archive-plus-bookkeeping workflow:

- Runs `/opsx:archive` or `/opsx:bulk-archive`
- Cross-links every capability pair each archived change touched
- Updates `related:` frontmatter and regenerates `## Related Specs`
- Patches `openspec/specs/INDEX.md` for the capabilities this archive batch touched, or builds it once if the file does not exist yet
- Appends one row per archived change to `openspec/changes/archive/INDEX.md`

The skill runs the native archive command itself as the first operational step. It is not a post-merge hook. That ordering matters because cross-linking and index updates must happen after archive conflict resolution finishes and the merged specs reach their final archived state.

## When to Use This

Use this skill when:

- You want to archive one or more OpenSpec changes end to end
- You want archive-time cross-linking maintained automatically
- You want `openspec/specs/INDEX.md` kept in sync after archive
- You want `openspec/changes/archive/INDEX.md` updated as part of the same workflow

Common trigger phrases:
- "archive this change"
- "bulk archive the pending changes"
- "run /opsx:archive"
- "run /opsx:bulk-archive"
- "cross-link the touched specs"
- "update the specs index after archive"
- "keep the archive index current"

Do not run `/opsx:archive` or `/opsx:bulk-archive` manually first. Let this skill orchestrate the whole workflow.

## Prerequisites

This skill requires:

1. **OpenSpec CLI** — installed and initialized
2. **Sub-agent support for spec writing** — per-capability spec writes normally run in subagents. Archive itself never does.
3. **Frontmatter in `design.md`** — each change should have:
   - `specs_touched`: a non-empty list of capability names
   - `decisions`: a list of `{id, choice, rationale, alternatives}` entries
4. **Purpose headings in touched specs** — every capability in `specs_touched` must have a `## Purpose` or `### Purpose` heading in `openspec/specs/<capability>/spec.md`

If any prerequisite is missing, the skill reports the gap and guides resolution before proceeding. One exception exists for missing `specs_touched` or `decisions`: the preflight recovery path can derive a candidate from the change's own files, but it still requires explicit user confirmation before anything is written back.

## How It Works

### Workflow summary

```
┌────────────────────────────────────────────────────────────────────────┐
│  Stage              Action                              Output         │
├────────────────────────────────────────────────────────────────────────┤
│  0 Preflight        Verify frontmatter + Purpose         Go / no-go    │
│                     headings before touching anything                  │
│  1 Archive+Extract  Run /opsx:archive or /opsx:bulk-        Change     │
│                     archive yourself, in this context      records     │
│                     (never a subagent)                                 │
│  2 Validate         Confirm archive records are             Checked    │
│                     structurally complete                  records     │
│  3 Link             Combine new co-touch pairs across         New      │
│                     the batch                              partners    │
│  4 Write specs      SUBAGENT (one per capability,          Updated     │
│                     always): merge, sort, and rewrite       specs      │
│  5 Specs index      Patch specs/INDEX.md for the           INDEX.md    │
│                     capabilities this batch touched                    │
│                     (full rebuild only if missing)                     │
│  6 Change log       Append one row per archived change     INDEX.md    │
│                     to changes/archive/INDEX.md                        │
│  7 Report           Summarize what changed                 Summary     │
└────────────────────────────────────────────────────────────────────────┘

Critical: for `/opsx:bulk-archive`, validation through reporting runs exactly once, after the full batch resolves. Never run those steps once per intermediate merge.
```

### 0. Preflight checks

Preflight confirms the archive inputs are safe before any spec or index write happens.

1. Determine scope: single change (`/opsx:archive <name>`) or bulk archive (`/opsx:bulk-archive`).
2. Verify `design.md` frontmatter for every change about to archive:
   - confirm `specs_touched` exists and is non-empty
   - confirm `decisions` exists and each entry has at least `id` and `choice`
3. If that frontmatter is missing or malformed, do not guess silently:
   - derive a candidate from the change's own `proposal.md` and delta spec files when possible
   - present that candidate for explicit user confirmation
   - write it back only after the user confirms or edits it
   - stop outright if nothing in the change's own files supports a defensible candidate
4. Verify that every capability named in `specs_touched` already has a `## Purpose` or `### Purpose` heading in `openspec/specs/<capability>/spec.md`.
5. Note any brand-new capability with no existing `openspec/specs/<capability>/spec.md` yet. That affects later spec writing and index insertion behavior.
6. Report the preflight summary before continuing.

A missing Purpose heading does not block archive, extraction, validation, or cross-link computation. It does block spec writing for that capability until the user chooses whether to add a placeholder or fix the spec first.

### 1. Archive and extract

Archive and extraction always run inline in the invoking agent's own context, never in a subagent.

That rule is intentional. `/opsx:archive` and `/opsx:bulk-archive` are agent-driven workflows, not a single deterministic CLI call. They can branch internally into sync work and they can raise prompts. Running archive inline is what lets the same agent follow those branches to completion and surface non-routine prompts back to the user.

The skill:

1. Runs `/opsx:archive <change-name>` or `/opsx:bulk-archive` directly.
2. Answers the routine sync prompt "yes" every time.
3. Treats any internal branch, such as a separate sync workflow, as part of the same archive run rather than as a completion signal.
4. Surfaces any non-routine prompt to the user and waits for the answer.
5. Waits until every merge in the operation has fully resolved.
6. Stops immediately if any merge reports unresolved conflicts.
7. Reads back one structured record per successfully archived change:
   - `change`
   - `date` from the archived folder's `YYYY-MM-DD` prefix
   - `archivePath`
   - `specsTouched`
   - `decisions`

### 2. Validate extracted records

Before cross-linking, validate the extracted records structurally:

- every record must have a non-empty `specsTouched`
- every record must have at least one `decisions` entry with `choice` populated
- records stay grouped by change

This is a post-archive sanity check on the extracted data. It is not a second pass on source-file correctness.

### 3. Compute cross-links

Cross-link computation is pure data work with no file I/O.

For each archived change:

1. Compute all 2-combinations within that change's own `specs_touched` list.
2. Treat co-touch as symmetric: `(A,B)` means A gains B and B gains A.
3. Combine those pairs across the full archive batch into one map of `capability -> newly contributed partners`.
4. Keep this map unmerged with on-disk `related:` values. Spec writing handles that merge when it opens each file.

For bulk archive runs, compute pairs only within each change's own `specs_touched` list. Two unrelated changes landing in the same batch do not imply cross-change relationships.

### 4. Write specs

Spec writing always delegates to one subagent per touched capability when subagents are available. This is unconditional. It is not a threshold-based optimization.

Each spec-writing subagent:

1. Reads the capability's current `related:` frontmatter value, or treats it as empty for a brand-new capability.
2. Unions the current value with the newly contributed partners.
3. Sorts the final `related:` set alphabetically and writes it in single-line flow style.
4. Overwrites `last_touched_by` and `last_touched_on`.
5. Regenerates `## Related Specs` from that same final sorted list.
6. Reads each partner spec's `## Purpose` or `### Purpose` heading to build the body list entries.
7. Reports back only the file path, no-op vs. changed status, final `related:` list, and the capability's current Purpose heading text.

If subagents are unavailable, spec writing can fall back to direct in-context edits as a degraded mode. That fallback applies only to spec writing. Archive still runs inline by design.

### 5. Update `openspec/specs/INDEX.md`

When `openspec/specs/INDEX.md` already exists, patch only the touched capability rows. Do not rebuild the full file.

- Replace the exact row for an existing touched capability.
- Insert a new row in sorted position for a brand-new capability.
- Match capability names by the first table cell, not by loose substring search.
- Leave untouched rows unread and unchanged.

If `openspec/specs/INDEX.md` does not exist yet, build it once from every capability under `openspec/specs/`, then switch back to row-level patching on later runs.

### 6. Append to `openspec/changes/archive/INDEX.md`

This file is append-only history.

For each archived change:

1. Build one row with `Change | Date | Decision | Specs touched | Status`.
2. Use the archived folder's `YYYY-MM-DD` prefix as `Date`, never anything from `design.md`.
3. Summarize all `decisions[].choice` values in the `Decision` column, joined with semicolons when there is more than one.
4. Write `Status` as `current` for the new row.
5. Insert new rows at the end of the table's existing data rows, not blindly at end-of-file.

If the file has trailing content after the table, preserve it exactly.

### 7. Report

The final report summarizes:

- which changes archived successfully
- which specs changed or were confirmed no-op
- whether `openspec/specs/INDEX.md` was patched or bootstrapped
- how many rows were appended to `openspec/changes/archive/INDEX.md`
- any capability left with a placeholder Purpose heading or skipped because Purpose resolution never completed

## Key Concepts

### Cross-linking happens at archive time

Delta specs in `openspec/changes/<slug>/specs/` are provisional. `/opsx:bulk-archive` can still resolve conflicts across several changes before a capability's final spec shape settles. Only the merged archived spec is worth linking and indexing.

### Linking is additive only

This skill only adds to `related:` lists. It never removes entries. Pruning stale relationships requires cross-change judgment and human confirmation, so that work belongs to `accelint-archive-synthesis`.

### Writes are idempotent

Flow-style sorted `related:` values and targeted index maintenance keep re-runs byte-identical when inputs have not changed. Retrying after a partial failure should not duplicate links or rows.

### The two index files behave differently

- `openspec/specs/INDEX.md` describes current state, so existing runs patch touched rows and bootstrap builds scan the full specs tree once when the file is missing.
- `openspec/changes/archive/INDEX.md` describes history, so it stays append-only and never gets reordered.

Treating one like the other would either corrupt history or let current-state data drift.

### Subagent use is asymmetric on purpose

Spec writing delegates to subagents when they are available. Archive and extraction never do. That split preserves spec-file isolation where it helps and keeps the archive workflow in the same user-facing context where branches and prompts can be handled safely.

## Example Usage

### Scenario 1: Single-change archive

```
User: Archive the add-live-sync change with cross-linking

Skill: Running preflight checks...
✓ design.md frontmatter valid (specs_touched: sync/protocol, ui/status-indicator)
✓ Both capabilities have a ## Purpose or ### Purpose heading

Running /opsx:archive add-live-sync directly...
Sync now? (y/n) → yes
✓ Synced, resumed archive, and archived to
  openspec/changes/archive/2026-03-02-add-live-sync/
✓ Extracted: specs_touched, decisions

Computing new co-touch pairs...
- sync/protocol ↔ ui/status-indicator (new pair)

[spawns subagent: sync/protocol]  [spawns subagent: ui/status-indicator]
✓ sync/protocol/spec.md: related: [ui/status-indicator] (merged, was empty)
✓ ui/status-indicator/spec.md: related: [sync/protocol] (merged, was empty)

Updating openspec/specs/INDEX.md... (2 rows patched)
Appending to openspec/changes/archive/INDEX.md... (1 row)

Archive complete: add-live-sync

Next steps:
- Review the diff on the two updated specs before committing
- `related:` entries are additive only — pruning belongs to accelint-archive-synthesis
```

### Scenario 2: Bulk archive with missing Purpose heading

```
User: Run bulk-archive on the pending changes

Skill: Running preflight checks across 3 pending changes...
✓ All design.md frontmatter valid
⚠ auth/session-store is missing a ## Purpose or ### Purpose heading

How would you like to handle auth/session-store?
(a) Add a placeholder purpose now and continue
(b) Pause so you can add the heading yourself first

User: (b)

Skill: Paused. Add a ## Purpose or ### Purpose heading to
openspec/specs/auth/session-store/spec.md, then re-invoke this skill.
```

## Error Handling

**If `design.md` frontmatter is missing or malformed:**
- stop preflight for that change unless a candidate can be derived from the change's own files
- present the derived `specs_touched` and `decisions` candidate for explicit confirmation
- write it back only after the user confirms or edits it
- stop outright if no defensible candidate exists

**If a capability is missing its `## Purpose` or `### Purpose` heading:**
- allow archive, extraction, validation, and cross-link computation to continue
- stop before spec writing reaches that capability
- ask whether to add a placeholder or fix the spec first

**If a change touches only one capability:**
- compute zero pairs without error
- still update `last_touched_by` and `last_touched_on`
- still regenerate `## Related Specs`
- still append one archive-index row

**If a change introduces a brand-new capability:**
- note it during preflight
- let spec writing start from empty frontmatter
- insert the capability into `openspec/specs/INDEX.md` in sorted position

**If the native archive reports unresolved conflicts:**
- stop immediately and report the conflict verbatim
- do not proceed to extraction, validation, linking, or index updates for that batch

**If subagents are unavailable for spec writing:**
- fall back to direct spec edits in the current context
- warn that full `spec.md` contents will enter context
- keep archive and extraction inline as usual

**If `openspec/specs/INDEX.md` does not exist yet:**
- treat that as the bootstrap case
- build the file once from the full specs tree
- return to row-level patching on later archive runs

**If `openspec/changes/archive/INDEX.md` does not exist yet:**
- create it with the header row before appending the first archive row

## Configuration Requirements

This skill assumes:

1. OpenSpec is installed and initialized (`openspec/` exists)
2. Changes have `design.md` files with `specs_touched` and `decisions` frontmatter, or enough local material to derive a confirmed candidate during preflight
3. Sub-agent support is available for normal per-capability spec writing, even though archive itself runs inline
4. Git is initialized so the final report can reference touched files cleanly

If any assumption fails, the skill reports the issue and guides you through resolution.

## Tips

Review the preflight summary before proceeding. Confirm frontmatter is present and touched specs have a `## Purpose` or `### Purpose` heading.

Always answer the routine sync prompt yes during archive. That prompt is operational, not a user decision point.

Keep `related:` maintenance additive. If a stale relationship needs pruning, use `accelint-archive-synthesis` with human confirmation.

Trust the idempotent writes. Re-running against unchanged inputs should not duplicate rows or links.

For bulk archives, validation through reporting runs once after the whole batch resolves. Do not expect incremental mid-batch bookkeeping.

## Related Skills

- `accelint-qrspi-propose` — creates the change package and normally writes the `design.md` frontmatter this skill later reads
- `accelint-qrspi-apply` — implements a planned change before it reaches archive time
- `accelint-archive-synthesis` — handles pruning stale `related:` entries and changing archive `Status` values with human confirmation

## OpenSpec Commands

This skill uses these OpenSpec commands:

- `/opsx:archive <change-name>` — archive a single change
- `/opsx:bulk-archive` — archive all pending changes

The skill invokes these commands itself during archive and extraction. Do not run them manually first.
