# Accelint QRSPI Archive

Archive OpenSpec changes with cross-capability linking and index maintenance. This skill orchestrates the complete archiving workflow, from invoking OpenSpec's native merge through updating cross-capability relationships and maintaining running indices.

## What This Does

Takes a completed OpenSpec change and archives it with full bookkeeping:

- Invokes `/opsx:archive` or `/opsx:bulk-archive` to merge the change
- Cross-links every capability pair the change touched
- Updates `related:` frontmatter and regenerates `## Related Specs` sections
- Rebuilds the complete specs index (`openspec/specs/INDEX.md`)
- Appends to the archived-change changelog (`openspec/changes/archive/INDEX.md`)

The skill runs the native archive command itself as Phase 1 — it's the entry point for archiving, not a post-merge hook. This ensures cross-linking happens after conflicts resolve, when specs have reached their final merged state.

## When to Use This

Invoke this skill when:

- You've completed implementing an OpenSpec change and want to archive it
- You want to bulk-archive multiple pending changes at once
- You need cross-capability linking maintained automatically
- The specs index or changelog needs updating after archival

Trigger phrases:
- "archive this change"
- "bulk archive the pending changes"
- "run opsx:archive with cross-linking"
- "archive [change-name]"
- "update specs index and archive"

**Note**: This skill calls `/opsx:archive` or `/opsx:bulk-archive` itself. Don't run those commands manually first — let the skill orchestrate the entire workflow.

## Prerequisites

This skill requires:

1. **OpenSpec CLI** - Installed and initialized
2. **Sub-agent support** - Phase 1 (archive + extraction) and Phase 4 (per-capability writes) always run as subagents (hard requirement, not optional)
3. **Frontmatter in design.md** - Each change must have:
   - `specs_touched`: non-empty list of capability names
   - `decisions`: list with `{id, choice, rationale, alternatives}` entries
4. **Purpose heading in specs** - Every capability in `specs_touched` must have a `## Purpose` heading in its `openspec/specs/<capability>/spec.md`

### Check prerequisites:

```bash
# Verify OpenSpec is initialized
ls openspec/

# Check a change's frontmatter
cat openspec/changes/<change-name>/design.md | head -20

# Verify Purpose headings exist
grep "## Purpose" openspec/specs/*/spec.md
```

If any are missing, the skill reports the gap and guides you through resolution before proceeding.

## How It Works

### The Workflow

The skill orchestrates seven phases:

```
┌────────────────────────────────────────────────────────────────┐
│  Phase          Action                        Output           │
├────────────────────────────────────────────────────────────────┤
│  0 Preflight    Verify frontmatter + headings Go/no-go         │
│  1 Archive      SUBAGENT: run native archive  Change records   │
│  2 Validate     Confirm extracted completeness Checked records │
│  3 Link         Compute co-touch pairs         New partners    │
│  4 Write specs  SUBAGENT: merge & update       Updated specs   │
│  5 Specs index  Rebuild INDEX.md wholesale     INDEX.md        │
│  6 Change log   Append to archive INDEX.md     INDEX.md        │
│  7 Report       Summarize what changed         Summary         │
└────────────────────────────────────────────────────────────────┘

Critical: for /opsx:bulk-archive, Phases 2-7 run exactly ONCE, after every
merge in the batch has resolved — never once per intermediate merge.
```

### Phase 0: Preflight Checks

1. Determines scope: single change (`/opsx:archive <name>`) or bulk archive (`/opsx:bulk-archive`)
2. **Verifies frontmatter** — reads each change's `design.md` to confirm `specs_touched` and `decisions` exist and are well-formed
3. **Verifies Purpose headings** — checks that every capability in `specs_touched` has a `## Purpose` heading in its spec
4. Reports preflight summary and any gaps before proceeding

If frontmatter is missing or malformed, stops before Phase 1 and reports exactly which field is missing. If Purpose headings are missing, asks whether to add placeholders or fix first.

### Phase 1: Archive and Extract (Subagent)

Always runs as a subagent, never inline — keeps raw `design.md` contents out of parent context.

1. Spawns subagent with instructions to run `/opsx:archive` or `/opsx:bulk-archive`
2. Subagent always answers "yes" to sync prompts (routine part of archive operation)
3. Waits for all merges to fully resolve
4. Extracts structured records: `{change, date, archivePath, specsTouched, decisions}`
5. Returns only these fields — never full file contents

If unresolved conflicts occur, subagent stops immediately and reports verbatim. Does not proceed to Phase 2.

### Phase 2: Validate Extracted Records

Confirms the subagent's returned records are structurally complete:
- Every record has non-empty `specsTouched`
- Every record has at least one `decisions` entry with `choice` populated
- Records remain grouped by change (not flattened across batch)

If validation fails, re-runs Phase 1 for that change rather than proceeding with partial data.

### Phase 3: Compute Cross-Links (All-Pairs Union)

Pure computation with no file I/O. For each change:

1. Computes all 2-combinations within `specs_touched`: `[A, B, C]` → `(A,B)`, `(A,C)`, `(B,C)`
2. Co-touch is symmetric — pairing `(A,B)` means A gains B **and** B gains A
3. Combines pairs across all changes in the batch into one map: `capability → Set<new partners>`
4. Hands this map to Phase 4 unsorted and unmerged (Phase 4 does the union with existing `related:`)

**Example**: Change with `specs_touched: [sync/protocol, ui/status-indicator]` contributes the pair `(sync/protocol, ui/status-indicator)`.

### Phase 4: Write Spec Frontmatter and Body (Subagent, Always)

Always spawns one subagent per touched capability — never inline, regardless of batch size. Keeps spec contents out of parent context.

Each subagent:
1. Reads current `related:` from frontmatter (treats as empty if no frontmatter exists yet)
2. Unions it with newly contributed partners from Phase 3 (never drops existing entries)
3. Sorts the full set alphabetically, writes in flow style (one line for clean diffs)
4. Updates `last_touched_by` and `last_touched_on` (overwrites previous values)
5. Regenerates `## Related Specs` section from the sorted `related:` list (wholesale replacement)
6. Reports back: file path, no-op vs. changed, final `related:` list (not full contents)

For brand-new capabilities (no prior spec.md), creates frontmatter from scratch.

### Phase 5: Rebuild openspec/specs/INDEX.md

Regenerates the complete specs index wholesale (never patched):

1. Lists every directory under `openspec/specs/`
2. Reads three things from each spec: `## Purpose` heading body, `related:` frontmatter, `last_touched_by`
3. Emits full table sorted by capability name:

```markdown
| Capability          | Purpose                         | Related              | Last touched by |
| ------------------- | -------------------------------- | --------------------- | ---------------- |
| sync/protocol        | Defines the live-sync wire proto | ui/status-indicator   | add-live-sync     |
| ui/status-indicator  | Renders connection state in UI   | sync/protocol         | add-live-sync     |
```

4. Overwrites `openspec/specs/INDEX.md` entirely (preserves any preamble above the table)

### Phase 6: Append to openspec/changes/archive/INDEX.md

Logs one durable row per archived change. This file is history — append-only, never reordered.

For each change from Phase 2:
1. Constructs one row with: `Change | Date | Decision | Specs touched | Status`
2. `Date` comes from archive folder's `YYYY-MM-DD` prefix (never from `design.md`)
3. `Decision` is a one-line summary of `decisions[].choice` (concatenate with semicolons if multiple)
4. `Status` written as `current` — this skill never touches that column again
5. Appends to `openspec/changes/archive/INDEX.md` (creates with header if missing)

Never re-sorts or reformats existing rows. Append-only discipline makes this a reliable audit trail.

### Phase 7: Report

Summarizes what changed:

```
✅ Archive complete: add-live-sync

Specs updated:
- sync/protocol        (+ui/status-indicator)
- ui/status-indicator  (+sync/protocol)

openspec/specs/INDEX.md rebuilt (14 capabilities)
openspec/changes/archive/INDEX.md: 1 row appended

Next steps:
- Review the diff on touched specs before committing
- related: entries are additive only — pruning is accelint-archive-synthesis's job
```

If any capability has a placeholder purpose or was skipped due to Phase 0 Task B, calls that out explicitly.

## Key Concepts

### Cross-Linking at Archive Time

Delta specs in `openspec/changes/<slug>/specs/` are provisional. `/opsx:bulk-archive` may resolve conflicts across several changes in chronological order before a capability's spec reaches its final shape. Only the merged, archived spec is worth indexing.

This is why the skill runs the native command itself as Phase 1 — it needs to wait for the merge to fully resolve before computing cross-links.

### Additive-Only Linking

This skill only adds to `related:` lists, never removes. Pruning a stale entry requires cross-change judgment and human confirmation — that's `accelint-archive-synthesis`'s job, not this one.

### Idempotent Writes

Flow-style sorted `related:` and the wholesale-rebuilt specs index mean re-running against unchanged inputs produces byte-identical output. Retrying after a partial failure never duplicates entries or rows.

### Two Index Strategies

- `specs/INDEX.md` — regenerated wholesale every run (describes current state)
- `changes/archive/INDEX.md` — append-only, never reordered (describes history)

Treating either the other way corrupts history or lets the index drift.

### Unconditional Subagent Delegation

Phases 1 and 4 always delegate to subagents, never conditionally. This keeps the parent's context cost flat regardless of batch size — the same discipline `accelint-qrspi-propose` and `accelint-qrspi-apply` use.

## Example Usage

### Scenario 1: Single-change archive

```
User: Archive the add-live-sync change with cross-linking

Skill: Running preflight checks...
✓ design.md frontmatter valid (specs_touched: sync/protocol, ui/status-indicator)
✓ Both capabilities have a ## Purpose heading

[spawns subagent: archive + extract]
✓ /opsx:archive add-live-sync merged
✓ Extracted: specs_touched, decisions

Computing new co-touch pairs...
- sync/protocol ↔ ui/status-indicator (new pair)

[spawns subagent: sync/protocol]  [spawns subagent: ui/status-indicator]
✓ sync/protocol/spec.md: related: [ui/status-indicator] (merged, was empty)
✓ ui/status-indicator/spec.md: related: [sync/protocol] (merged, was empty)

Rebuilding openspec/specs/INDEX.md... (14 capabilities)
Appending to openspec/changes/archive/INDEX.md... (1 row)

✅ Archive complete: add-live-sync

Next steps:
- Review the diff on the two updated specs before committing
- related: entries are additive only — pruning is accelint-archive-synthesis's job
```

### Scenario 2: Bulk archive with missing Purpose heading

```
User: Run bulk-archive on the pending changes

Skill: Running preflight checks across 3 pending changes...
✓ All design.md frontmatter valid
⚠ auth/session-store is missing a ## Purpose heading

How would you like to handle auth/session-store?
(a) Add a placeholder purpose now and continue
(b) Pause so you can add the heading yourself first

User: (b)

Skill: Paused. Add a ## Purpose heading to openspec/specs/auth/session-store/spec.md,
then re-invoke this skill to continue.
```

## Error Handling

**If design.md frontmatter is missing or malformed:**
- Stops before Phase 1 for that change
- Reports exactly which field is missing (`specs_touched` or `decisions`)
- Does not infer `specs_touched` from delta spec directory contents

**If a capability is missing its `## Purpose` heading:**
- Doesn't block Phases 1–3 (they don't touch spec bodies)
- Stops before Phase 4 reaches that capability
- Asks whether to add a placeholder or fix the spec first

**If a change touches only one capability:**
- Produces zero pairs (expected, not an error)
- Still runs Phase 4 for that capability (updates `last_touched_by`/`last_touched_on`)
- Still adds a row to the changelog in Phase 6

**If a change introduces a brand-new capability:**
- Phase 0 notes it separately (no prior spec.md exists yet)
- Phase 4 subagent creates frontmatter from scratch rather than editing existing file

**If the native command reports unresolved conflicts:**
- Phase 1 subagent stops immediately and reports verbatim
- Does not proceed to Phase 2 (partial extraction is worse than none)

**If no subagent support is available:**
- Falls back to running Phase 1 and Phase 4 directly in parent context
- Warns explicitly that full file contents will enter context (degraded fallback)
- Always-answer-yes rule for sync prompts still applies

**If `specs/INDEX.md` or `changes/archive/INDEX.md` doesn't exist:**
- Expected on a project's first-ever archive
- Phase 6 creates `changes/archive/INDEX.md` with header row
- Phase 5 always writes `specs/INDEX.md` fresh (wholesale rebuild every run)

## Configuration Requirements

This skill assumes:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. Changes have `design.md` with `specs_touched` and `decisions` frontmatter
3. Sub-agent support available (for parallel execution)
4. Git initialized (for checking file changes in Phase 7 report)

If any are missing, the skill reports the issue and guides you through setup.

## Tips

Review the preflight summary before proceeding. Make sure frontmatter is present and Purpose headings exist.

Always answer "yes" to sync prompts during archive — this is routine, not a decision point.

The skill is purely additive on `related:` entries. If you see a stale link, use `accelint-archive-synthesis` to prune it (with human confirmation).

Trust the idempotent writes. Re-running against unchanged inputs produces byte-identical output — no duplicates, no drift.

For bulk archives, remember that Phases 2–7 run once after all merges resolve. Don't expect incremental updates mid-batch.

## Related Skills

- `accelint-qrspi-propose` - Create QRSPI-planned changes (phase 1, generates the design.md this skill reads)
- `accelint-qrspi-apply` - Implement QRSPI-planned changes with parallelization (phase 2, happens before archival)
- `accelint-archive-synthesis` - Prune stale `related:` entries and update `Status` values with human confirmation

## OpenSpec Commands

This skill uses these OpenSpec CLI commands:

- `/opsx:archive <change-name>` - Archive a single change (delegated to Phase 1 subagent)
- `/opsx:bulk-archive` - Archive all pending changes (delegated to Phase 1 subagent)

The skill invokes these commands itself in Phase 1. Don't run them manually before invoking the skill.
