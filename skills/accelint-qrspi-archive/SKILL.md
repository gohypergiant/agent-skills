---
name: accelint-qrspi-archive
description: Archive an OpenSpec change end-to-end. This skill invokes `/opsx:archive` or `/opsx:bulk-archive` itself to perform the native merge, then immediately follows up with the cross-capability linking and running indices OpenSpec doesn't build on its own — linking every capability a change touched via a shared `related:` frontmatter list, keeping `openspec/specs/INDEX.md` current, and appending a row to `openspec/changes/archive/INDEX.md`. Use this skill whenever the user wants to archive a change, says "archive this change", "bulk archive these changes", "run opsx:archive", "run opsx:bulk-archive", "update the specs index", "cross-link the specs", or wants the archived-change changelog kept current. This skill is purely additive on the linking side — it never prunes a `related:` entry and never changes a change's `Status` column after the initial write; that pruning/synthesis work belongs to `accelint-archive-synthesis`.
license: Apache-2.0
compatibility: Requires the OpenSpec CLI. Phase 4 (per-capability spec writes) requires sub-agent support — see the skill body for the degraded fallback if unavailable. Phase 1 (native archive) always runs directly in the invoking agent's own context, never as a subagent, regardless of sub-agent availability. Each change's design.md should carry specs_touched and decisions frontmatter — ideally written by accelint-qrspi-propose at design time — but Phase 0 Task A can derive and confirm it when a change didn't go through that flow. Each touched spec must already have a ## Purpose heading in its body.
metadata:
  author: accelint
  version: "1.0.0"
---

# Accelint QRSPI Archive

Archive an OpenSpec change and follow it with the cross-capability linking and index bookkeeping OpenSpec doesn't do on its own. This skill invokes `/opsx:archive` or `/opsx:bulk-archive` itself — it's the entry point for archiving a change, not a step that reacts after someone has already archived one — waits for the merge to fully resolve, and then links every pair of capabilities the change touched via a shared `related:` frontmatter list, keeps a single running index of all specs up to date, and appends to an append-only changelog of every archived change.

Cross-linking has to happen after the merge resolves, not before it, which is exactly why this skill runs the native command itself as its own first phase rather than treating "a merge happened" as some external event to watch for. A delta spec in `openspec/changes/<slug>/specs/` is still provisional — `/opsx:bulk-archive` may resolve conflicts across several changes in chronological order before a capability's spec reaches its final shape. Only the merged, archived spec is worth indexing; anything computed earlier would be linking against content that might still change underneath it.

## What This Skill Does

**Automates**: the full archive operation for one or more OpenSpec changes in a single invocation — invoking `/opsx:archive` or `/opsx:bulk-archive` itself, then immediately following up with cross-capability linking and index maintenance.
**Scope**: everything from "archive this change" through updated indices. This skill calls the native command itself in Phase 1; it does not wait for the merge to have happened some other way first.
**Output**: the change(s) archived via OpenSpec's own merge, plus updated `related:` frontmatter and a regenerated `## Related Specs` section on every touched spec, an updated `openspec/specs/INDEX.md` (patched for the capabilities this batch touched, or built fresh project-wide the first time the file doesn't exist yet), and one appended row per archived change in `openspec/changes/archive/INDEX.md`.
**Does NOT**: implement the merge or conflict-resolution logic itself (that's OpenSpec's own, which this skill invokes via the native command rather than reimplementing), prune any `related:` entry, change a change's `Status` column after its initial write, reorder existing changelog rows, or shell out to the OpenSpec CLI to read local spec files (plain file reads are sufficient — see Explicitly Out of Scope).

## Prerequisites

- OpenSpec CLI installed and initialized, with one or more changes ready to archive.
- Sub-agent support, for Phase 4 (per-capability writes) only — Phase 4 always runs as subagents, unconditionally, and this is a hard requirement for normal operation there, not an optional speedup for large batches (see Error Handling for the degraded fallback if unavailable). Phase 1 (native archive + extraction) never uses a subagent, regardless of whether sub-agent support exists — see Phase 1 for why.
- Each change's `openspec/changes/<slug>/design.md` has YAML frontmatter including `specs_touched` (a non-empty list of capability names) and `decisions` (a list of `{id, choice, rationale, alternatives}` entries).
- Every capability named in any `specs_touched` list already has `openspec/specs/<capability>/spec.md` with a `## Purpose` heading in its body — this skill reads that heading rather than duplicating purpose text into frontmatter, and rewriting the correct behavior depends on that heading actually being there (verified in Phase 0, Task B).

If any of these are missing, report the gap and guide the user to resolve it before proceeding — do not silently substitute a guessed default for a missing field. This applies as-is to Phase 4's sub-agent support and a touched spec's missing `## Purpose` heading. A change's missing `specs_touched`/`decisions` frontmatter is handled differently: Phase 0 Task A derives a candidate from the change's own files and gets the author's explicit confirmation before writing it, rather than stopping outright — see Task A below for why a hard stop isn't actually necessary here, and why it still isn't a silent guess.

## Workflow Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│  Phase              Action                              Output         │
├────────────────────────────────────────────────────────────────────────┤
│  0 Preflight        Verify frontmatter + Purpose         Go / no-go    │
│                     headings before touching anything                  │
│  1 Archive+Extract  Run /opsx:archive or /opsx:bulk-        Change     │
│                     archive yourself, in this context      records     │
│                     (never a subagent); stay with any                  │
│                     internal sync branch until archive's               │
│                     own steps finish, then read back                   │
│                     specs_touched + decisions                          │
│  2 Validate         Confirm Phase 1's records are          Checked     │
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

Critical: for /opsx:bulk-archive, Phases 2-7 run exactly ONCE, after every
merge in the batch has resolved — never once per intermediate merge. Running
early would compute pairs against a specs_touched set that hasn't finished
accumulating cross-change conflicts, and would patch INDEX.md against a
half-finished batch.

Phase 4 always delegates to subagents, regardless of batch size — one
capability or forty. This isn't a parallelization optimization that only
kicks in for large batches; it's how this skill keeps raw spec.md contents
out of the parent's context on every run, the same pattern
accelint-qrspi-propose and accelint-qrspi-apply use.

Phase 1 is the mirror image: it never delegates to a subagent, regardless of
batch size or whether sub-agent support is even available. /opsx:archive and
/opsx:bulk-archive are themselves agent-driven, multi-step skills — not a
single deterministic CLI call — and a subagent handed "run /opsx:archive"
has no reliable way to resume that skill's own remaining steps once it
branches internally into something like a separate sync skill, and no way
to surface an interactive prompt back to the user if one comes up. Both of
those are failure modes this skill hit in practice, not hypothetical ones —
see Phase 1 for the full account.
```

## Phase Breakdown

### Phase 0: Preflight Checks

**Goal**: confirm the archive operation's inputs are shaped the way Phases 2–6 assume, before any spec or index file is touched. Task A is a narrow exception: once the author has explicitly confirmed a derived `specs_touched`/`decisions` candidate (see below), it writes that confirmed value back into the change's own `design.md` — that's filling in an input Phase 1 expects to already be there, not touching a spec or an index.

**Steps**:

1. Determine scope: a single-change archive (`/opsx:archive <name>`) or a bulk archive (`/opsx:bulk-archive`) spanning several pending changes.

2. **Verification Task A — design.md frontmatter.** For every change about to be archived, read `openspec/changes/<slug>/design.md` and confirm its frontmatter contains a non-empty `specs_touched` list and a `decisions` list where each entry has at least `id` and `choice`:

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

   - **Derive a candidate.** For `specs_touched`, look at the change's `proposal.md` capability declarations and the delta spec directories under `openspec/changes/<slug>/specs/`. For `decisions`, look at any Decisions section in `proposal.md` or decision prose already present in `design.md`.
   - **Present it for confirmation — don't write it yet.** Show the derived candidate to the user and ask them to (a) confirm it as written, (b) edit it first, or (c) pause so they can fix `design.md` themselves and re-invoke this skill later. Only once the user picks (a) or (b) does the candidate become the value this skill writes into `design.md`'s frontmatter — at that point it's the same explicit author confirmation the well-formed case gets for free, just captured one step later than at propose time.
   - **Stop outright, with no candidate offered**, only when there's nothing in the change's own files to derive from — e.g. an empty delta specs directory and no capability declarations anywhere in `proposal.md`. In that case, report exactly which change and which field is missing, the same as before.

   This is evaluated per change in a bulk-archive batch — one change needing confirmation doesn't block preflight for the others.

3. **Verification Task B — Purpose heading convention.** For every capability named across all `specs_touched` lists in this batch, confirm `openspec/specs/<capability>/spec.md` contains a `## Purpose` heading. Phase 5 reads this heading directly for the index's Purpose column, and Phase 4 relies on it existing so it can decide where a `## Related Specs` section belongs. If a spec is missing the heading, do not invent placeholder purpose text — ask the user whether to (a) add a placeholder like `_purpose not yet documented_` for now, or (b) fix the spec first. Fixing first is almost always better: a guessed purpose written into the index by this skill becomes content nobody actually authored, and it will look authoritative to the next reader.

4. For any capability in `specs_touched` that has no `openspec/specs/<capability>/` directory yet — a brand-new capability introduced by this change — note it separately. Phase 4 will need to create its `spec.md` frontmatter from scratch rather than editing an existing file, and Phase 5's Purpose column will need the user to supply a value manually since nothing exists yet to read.

5. Report the preflight summary before proceeding: changes in scope, capabilities touched, and any Task A or Task B outcomes. If Task A ends in a stop for any change — the user chose to pause and fix `design.md` themselves, or no candidate could be derived at all — do not proceed to Phase 1 for that change. A Task A candidate the user confirmed counts as passing, the same as frontmatter that was already well-formed. If Task B fails for some capability, that's fine to resolve later — Phases 1 through 3 don't touch spec bodies, so only flag it as blocking once Phase 4 is about to reach that capability.

**Output**: a go/no-go decision per change, plus the list of capabilities needing manual attention before Phase 4.

### Phase 1: Archive and Extract (Runs Inline — Never a Subagent)

**Goal**: let OpenSpec do the actual merge, then read back the data Phase 3 and Phase 6 need — done directly in this context, not handed to a subagent.

This phase never runs as a subagent, regardless of batch size and regardless of whether sub-agent support is available at all. That's a reversal of this skill's `1.0.0` behavior, made after running into two concrete failure modes in practice:

- **`/opsx:archive` and `/opsx:bulk-archive` are agent-driven skills, not a single deterministic CLI call.** They read project state, decide what needs syncing, and — when a sync is needed — hand off internally to a separate sync skill before returning to finish the rest of the archive workflow (merging delta specs, moving the change into `openspec/changes/archive/`). A subagent hand-fed the instruction "run `/opsx:archive`" has no reliable way to tell "I finished the sync skill this archive step referred me to" apart from "I finished the thing I was actually asked to do" — there's no caller to check back with mid-task. In practice this showed up exactly that way: the subagent ran the sync step, considered its job done, and returned control without ever reaching the merge. Running Phase 1 directly in this context means the same agent that issued "run `/opsx:archive`" is the one watching it branch into sync, so it can recognize the branch for what it is and carry on to archive's remaining steps once sync finishes — the same continuity a person would have running the command themselves.
- **A subagent can't surface an interactive prompt to the user.** `/opsx:archive` and `/opsx:bulk-archive` may raise more than the routine sync y/n — `/opsx:bulk-archive` in particular can prompt for confirmation before merging changes that touch overlapping specs (see step 2 below). A subagent that hits a prompt like that is stuck: it can't hand the question to the user and get a real answer, and guessing on the user's behalf is worse than not proceeding. Running Phase 1 inline means any such prompt lands in the same conversation the user is already in.

This does give something up: `/opsx:archive`'s own internal work — comparing delta specs against main specs, resolving bulk-archive's cross-change ordering — now happens directly in this context instead of being absorbed by an isolated subagent, so more of it enters context than the `1.0.0` design intended. That's an accepted cost of correctness over context economy, not an oversight; Phase 4 still isolates its own, typically larger, per-capability file content in a subagent exactly as before, so this cost is confined to Phase 1's own scope. Do **not** work around this by shelling out to `openspec archive`/`openspec bulk-archive` directly instead of the `/opsx:archive`/`/opsx:bulk-archive` skill — the skill is where OpenSpec's own delta-spec comparison and edge-case judgment actually live (bulk-archive's conflict resolution isn't reproducible with a bare CLI flag), and bypassing it back to a raw CLI call would throw away the same hybrid-agent judgment this skill exists to keep.

**Steps**:

1. Determine scope: a single-change archive (`/opsx:archive <name>`) or a bulk archive (`/opsx:bulk-archive`) spanning several pending changes.

2. **Known interactive prompt — always sync.** `/opsx:archive` and `/opsx:bulk-archive` will, more often than not, pause mid-run to ask whether to sync. Always answer yes, every time it comes up — this is a routine part of the archive operation completing, not a decision point that needs the user's input. This is the one interactive prompt you always answer yourself.

3. Run `/opsx:archive <change-name>` (single change) or `/opsx:bulk-archive` (all pending changes) directly, exactly as if the user had typed the slash command themselves.

4. **If the run branches internally** — most commonly by handing off to a separate sync skill partway through — that's normal, expected shape for this command, not a sign that anything has gone wrong or that the task is finished. Stay with it: once the branch completes, pick back up with archive's own remaining steps (merging delta specs into the main specs, moving the change into `openspec/changes/archive/`) rather than treating the branch's completion as the end of Phase 1.

5. **If any other interactive prompt comes up** — most commonly `/opsx:bulk-archive` asking for confirmation before merging changes that touch overlapping specs — that's a real question only the user can answer, unlike the routine sync prompt in step 2. Surface it to the user directly and wait for their answer before continuing.

6. Wait until every merge in this operation has fully resolved. For a bulk archive, this means ALL changes in the batch, not just the first.

7. If ANY merge reports unresolved conflicts, STOP immediately. Do not attempt to resolve it, and do not proceed to step 8 for ANY change in this batch — a partial extraction is worse than none, since there's no way to tell a stalled batch from a clean one otherwise. Report the conflict verbatim to the user and stop. Do not proceed to Phase 2 — parsing anything out of a partially-merged batch would propagate garbage into every capability the batch touches.

8. For each change that archived successfully, read its `design.md` frontmatter from its new archived path (e.g. `openspec/changes/archive/2026-03-02-add-live-sync/design.md`) and build one record:

   ```
   {
     change: "add-live-sync",
     date: "2026-03-02",           // from the archive folder's own
                                    // YYYY-MM-DD prefix, NEVER from
                                    // anything inside design.md
     archivePath: "openspec/changes/archive/2026-03-02-add-live-sync/",
     specsTouched: ["sync/protocol", "ui/status-indicator"],
     decisions: [{ id: "D1", choice: "polling with 5s interval", ... }]
   }
   ```

9. Keep the list of records from step 8, grouped by change, for Phase 2 — plus an explicit note to yourself that no unresolved conflicts remain.

**Output**: one record per archived change (`change`, `date`, `archivePath`, `specsTouched`, `decisions`), held in this context and passed straight to Phase 2.

### Phase 2: Validate Extracted Records

**Goal**: confirm Phase 1's records are structurally sound before Phase 3 depends on them — a sanity check on what Phase 1 produced, not a re-verification of the source data (Phase 0 Task A already confirmed the source `design.md` frontmatter was well-formed before Phase 1 ran).

**Steps**:

1. Confirm every record has a non-empty `specsTouched` and at least one `decisions` entry with `choice` populated. If a record is missing either, something went wrong building it in Phase 1 (not in the original data, which Task A already validated) — re-run Phase 1 for that change rather than proceeding with a partial record.

2. Keep records grouped **by change**, exactly as returned. Phase 3 computes pairs within a single change's own `specsTouched` — two unrelated changes archived in the same bulk-archive batch don't imply their capabilities co-touch each other, even though they landed at the same moment.

**Output**: the same record set from Phase 1, confirmed structurally complete and ready for Phases 3 and 6.

### Phase 3: Compute Cross-Links (All-Pairs Union)

**Goal**: for each change, compute the symmetric co-touch pairs within its own `specs_touched`, and combine those pairs across every change in this archive operation into one set of newly-contributed partners per capability. This step touches zero files — it only combines the `specsTouched` lists already sitting in the Phase 2 records. Merging those new partners with whatever `related:` entries a spec already has (never dropping any of them) happens in Phase 4, inside the subagent that's already opening that file — there's no reason for the parent to read spec frontmatter just to seed a union that Phase 4 can do in the same breath as its own file read.

**Steps**:

1. For a change with `specs_touched: [A, B, C]`, the contributed pairs are all 2-combinations excluding self: `(A,B)`, `(A,C)`, `(B,C)`. Co-touch has no direction — pairing `(A,B)` means A gains B as a related partner **and** B gains A in the same step.

2. This is a pure computation with no dependency on file I/O, so it's worth writing as a small pure function rather than eyeballing it per capability:

   ```typescript
   type ChangeLink = {
     readonly change: string;
     readonly specsTouched: readonly string[];
   };

   // All 2-combinations within one change's specs_touched. Pure, no self-pairs,
   // no directionality — a co-touch relationship reads the same both ways.
   const pairsFromChange = (
     link: ChangeLink,
   ): ReadonlyArray<readonly [string, string]> =>
     link.specsTouched.flatMap((a, i) =>
       link.specsTouched.slice(i + 1).map((b) => [a, b] as const),
     );

   // Fold every change's pairs into one partner-set-per-capability map. This
   // starts from an empty map every time — it combines pairs ACROSS the
   // changes in this batch, not against a spec's on-disk related: list. That
   // merge is deliberately left to Phase 4, which is the one opening the file.
   const accumulateNewPartners = (
     pairsByChange: ReadonlyArray<ReadonlyArray<readonly [string, string]>>,
   ): ReadonlyMap<string, ReadonlySet<string>> => {
     const next = new Map<string, Set<string>>();
     for (const pairs of pairsByChange) {
       for (const [a, b] of pairs) {
         next.set(a, (next.get(a) ?? new Set()).add(b));
         next.set(b, (next.get(b) ?? new Set()).add(a));
       }
     }
     return next;
   };
   ```

3. Fold every change's pairs into the same accumulating map, starting from empty — a bulk-archive batch of three changes touching overlapping capabilities should have all three changes' pairs combined before Phase 4 ever touches a file, so each capability's subagent is invoked once with a complete new-partner list rather than three times with partial data.

4. Hand this map to Phase 4 as-is — unsorted and unmerged with any spec's existing `related:` list. Phase 4's subagent is responsible for both the merge (union with whatever's already in the file) and the final alphabetical sort, since it's the one that actually reads the file this all depends on.

**Output**: a map of `capability -> newly contributed partner names`, not yet merged with any spec's existing `related:` list and not yet sorted — both of those happen in Phase 4.

### Phase 4: Write Spec Frontmatter and Body (Subagent, Always)

**Goal**: merge Phase 3's newly contributed partners into each touched spec's existing `related:` list, persist that plus provenance into frontmatter, and regenerate the `## Related Specs` section to match.

Always spawn one subagent per touched capability to do this — every time, not conditionally on how many capabilities are involved. Each capability's edit is fully independent once Phase 3's new-partner map is fixed (the same independence `accelint-qrspi-apply` relies on to parallelize slices), and doing the read/merge/write inside a subagent keeps that spec's full contents out of the parent's context whether this is a one-capability archive or a forty-capability bulk-archive. Making this a threshold-based judgment call ("parallelize if there are many capabilities, otherwise just edit inline") means the parent's context cost varies run to run for no good reason; delegating unconditionally makes it flat. It also means this subagent, not the parent, is the one place that ever reads a spec's current `related:` value — which is exactly why the merge-with-existing-entries logic belongs here rather than in Phase 3.

**Steps**:

1. For each touched capability, spawn a subagent with this prompt (the parent supplies only the *newly contributed* partner names from Phase 3 — not a final list; the subagent is the one that merges those against whatever the file already has):

   ```
   Update openspec/specs/<capability>/spec.md only. Do not touch any other file.

   Read this file's current related: value from its frontmatter (treat it as
   empty if the file has no frontmatter yet — this may be a brand-new
   capability). Union it with these newly contributed partners:
   [<partner>, <partner>, ...]. Never drop an entry that was already there.
   Sort the resulting full set alphabetically and write it in flow style on
   one line — that's what keeps a no-op run byte-identical and a genuine
   addition a clean one-line diff.

   Also set:
     last_touched_by: <change-name>
     last_touched_on: <date>
   as plain overwrites of whatever was there before, not an accumulated
   history.

   Do NOT add capability or purpose fields. The capability name is this
   file's own path; purpose already lives in its ## Purpose heading.

   Then regenerate the ## Related Specs section in the body from the same
   final, sorted related: list (replace any existing ## Related Specs
   content entirely — this section is never hand-maintained):

     ## Related Specs

     - <partner>
     - <partner>

   If no ## Related Specs heading exists, insert one directly after
   ## Purpose, or at the end of the file if there's no clear insertion point.

   Report back ONLY: the file path, whether the write was a no-op
   (byte-identical to what was already there) or an actual change, the
   final related: list you wrote, and the capability's current ## Purpose
   heading text (a sentence or short paragraph — you're not writing this,
   just reading it back so the parent doesn't have to reopen this file in
   Phase 5). Do not return the file's full contents.
   ```

2. If the capability has no prior `spec.md` (a brand-new capability per Phase 0 step 4), the subagent starts from an empty frontmatter block instead of reading an existing one — same prompt otherwise.

3. Collect each subagent's short report (file, no-op vs. changed, final `related:` list, and Purpose heading text) for Phase 5 and Phase 7. Phase 5 reuses the `related:` and Purpose values directly from this report instead of reopening the file; Phase 7's summary draws only on the no-op/changed status. Nothing else about the write needs to enter the parent's context — a reported no-op is the expected signal that this capability wasn't actually affected by this batch, not something to double-check by re-reading the file.

**Output**: every touched capability's `spec.md` updated in place (existing `related:` entries preserved, new ones unioned in and sorted), or confirmed unchanged, with only a short status line plus its `related:`/Purpose values — the small payload Phase 5 needs — entering the parent's context.

### Phase 5: Update openspec/specs/INDEX.md

**Goal**: keep `openspec/specs/INDEX.md` in sync with what Phase 4 just wrote, at the cost of touching only the lines that actually changed — not a re-scan of every capability's `spec.md`, and not even a full read of `specs/INDEX.md` itself. Phase 4's subagents already read each touched capability's current `related:`, `last_touched_by`, and `## Purpose` heading as part of doing their own write, and report those values back — Phase 5 reuses that data directly instead of paying for a second full scan of `openspec/specs/`. The only time this phase looks at capabilities beyond the ones this batch touched, or reads more than a single targeted line of `specs/INDEX.md`, is when the file doesn't exist yet at all — there's no existing state to patch, and a one-time full build is the right move, not a routine one.

**Steps**:

1. **The common case — `specs/INDEX.md` already exists.** Don't read the whole file into context to do this — locate and edit only the lines that actually change:

   - **Existing capability**: grep for the line whose first cell exactly matches the capability name (anchored between the leading `| ` and the next `|`, not a loose substring match — `sync/protocol` must not match `sync/protocol-v2`). Replace that single line with the row built from Phase 4's report for that capability (`Purpose`, `related:`, `last_touched_by`). Nothing else in the file is read or touched.
   - **Brand-new capability** (per Phase 0 step 4): grep for capability-name cells to find the first existing row that sorts after the new one alphabetically, and insert the new row immediately before it (or append at the end if it sorts last). This still only touches one new line — locating the insertion point doesn't require loading row content, just the capability-name column.
   - Every row for every untouched capability is never opened, matched, or rewritten — not just "left identical" as an outcome of a full rebuild, but literally never touched by this operation.

2. Build each row without cross-row padding — single-space cell separation (`| sync/protocol | Defines the live-sync wire proto | ui/status-indicator | add-live-sync |`), not aligned to the widest value in each column:

   ```markdown
   | Capability | Purpose | Related | Last touched by |
   | --- | --- | --- | --- |
   | sync/protocol | Defines the live-sync wire proto | ui/status-indicator | add-live-sync |
   | ui/status-indicator | Renders connection state in UI | sync/protocol | add-live-sync |
   ```

   Markdown tables render correctly regardless of padding — only the header separator's dash count matters, not whitespace consistency across data rows. Keeping cross-row alignment would mean every row's padding depends on every other row's content length, which forces a full-table rewrite the instant any single row's text changes length — exactly the cost this design exists to avoid. A patched row and its untouched neighbors will look slightly ragged in a raw diff; that's the trade for the diff actually being one line.

3. **The bootstrap case — `specs/INDEX.md` doesn't exist yet.** There's no prior state to patch, and patching only the touched rows would permanently omit every untouched capability until each happens to be touched by some future change. List every directory under `openspec/specs/`, and for each one, read its `## Purpose` heading, `related:` frontmatter, and `last_touched_by` directly — the full scan Phase 5 used to do unconditionally. This runs at most once per project, the first time this skill archives anything against it; every archive after that goes through step 1 instead.

4. **Bootstrap case only**: write `openspec/specs/INDEX.md` from the full scan gathered in step 3, using the row format from step 2. If the file already carries a project-specific title or preamble above the table, preserve it. The common case (step 1) has already written its edit directly — there's no separate write step for it.

**Output**: `openspec/specs/INDEX.md`, with one line changed or inserted per capability this batch touched and every other line untouched, or built once from every capability project-wide if the file didn't exist yet.

A patched `specs/INDEX.md` can still drift from reality for reasons outside this skill's control — a `spec.md` hand-edited outside the archive workflow, a capability directory renamed or deleted directly. This skill doesn't re-derive the whole index every run to catch that. Nothing else currently does either: `accelint-archive-synthesis`'s two checks (decision-drift, structural-coupling) both read `specs/INDEX.md` as ground truth rather than auditing it against the `spec.md` files it summarizes. Catching this kind of drift would mean adding an index-reconciliation check to `accelint-archive-synthesis` — a natural fit for a skill that already exists to do periodic, corpus-wide checks — but that check doesn't exist yet. Until it does, this is an accepted, narrow gap rather than a covered one.

### Phase 6: Append to openspec/changes/archive/INDEX.md

**Goal**: log one durable row per archived change, inserted at the end of the table's existing data rows — never blindly at the end of the file. Unlike Phase 5, this file is history, and history is append-only — never regenerated, never reordered.

**Steps**:

1. For each change from Phase 2, construct one row:

   ```markdown
   | Change | Date | Decision | Specs touched | Status |
   | --- | --- | --- | --- | --- |
   | add-live-sync | 2026-03-02 | polling with 5s interval | sync/protocol, ui/status-indicator | current |
   ```

   - `Date` is the archive folder's `YYYY-MM-DD` prefix — the same source used in Phase 2, never anything read out of `design.md`.
   - `Decision` is a one-line summary of `decisions[].choice`. If a change recorded more than one decision, concatenate the choices with semicolons (e.g. `polling with 5s interval; client-side dedup on reconnect`) rather than picking just one — every decision the design phase made deserves to survive into the permanent record, even compressed to a phrase.
   - `Status` is written as `current` and this skill never touches that column again after this initial write, for this row or any other. Transitions like `current` → `superseded` belong to `accelint-archive-synthesis`, which has the cross-change context needed to know when a decision has actually been superseded — this skill only ever sees one archive operation at a time and can't safely make that call.

2. **Locate the insertion point — the end of the table, not the end of the file.** Find the header row (`| Change | Date | ... |`), its separator (`| --- | --- | ... |`), and the contiguous block of data rows that follows. Insert the new row(s) immediately after the last of those data rows. This file may carry content after the table — a summary block with a total row count, a `Generated:` date stamp, a status legend, or similar — and that content is not part of the table; do not read past it, move it, or edit it. Appending past it instead of before it is exactly how a data row ends up sitting in prose after a `Status Legend` line instead of inside the table, which is what happened before this step existed: treat any such trailing block as preserved-but-unowned, the same way Phase 5 preserves a project-specific preamble above `specs/INDEX.md`'s table without editing it.

3. This is the one file in this skill's output that may not exist yet before the very first archive — create it with a header row (and no trailing content) if missing.

4. Do not re-sort, reformat, or otherwise touch any existing row. The append-only discipline here is what makes this file a reliable audit trail; reordering past rows would make it impossible for anyone to use git blame to see when a decision was recorded relative to the others around it.

5. If the file's trailing content (per step 2) states a total row count, leave it as written even though it will now be stale by however many rows this run just added. Reconciling that count isn't this skill's job any more than pruning `related:` entries or flipping `Status` values is — it's corpus-wide bookkeeping, the same category of accepted gap Phase 5 already lives with for `specs/INDEX.md` drift (see the note at the end of Phase 5), and a reasonable additional check for `accelint-archive-synthesis` to pick up if it doesn't already.

**Output**: `openspec/changes/archive/INDEX.md`, with one new row per archived change inserted at the end of the table's data rows, every prior row untouched, and any trailing content after the table preserved exactly as it was — including any count within it that's now stale.

### Phase 7: Report

**Steps**:

1. Summarize what changed:

   ```
   ✅ Archive complete: add-live-sync

   Specs updated:
   - sync/protocol        (+ui/status-indicator)
   - ui/status-indicator  (+sync/protocol)

   openspec/specs/INDEX.md updated (2 rows patched)
   openspec/changes/archive/INDEX.md: 1 row appended

   Next steps:
   - Review the diff on touched specs before committing
   - related: entries are additive only here — if one looks wrong,
     pruning is accelint-archive-synthesis's job, not this skill's
   ```

2. If any capability was left with a placeholder purpose or skipped entirely because Phase 0 Task B never resolved, call that out explicitly here rather than letting it disappear into the diff.

**Output**: a human-readable summary of every file this skill touched.

## Key Principles

A quick-reference summary — each of these is explained in full where it's actually applied (Phase Breakdown) or enforced (NEVER Do This); this is just the index.

- **Cross-linking happens at archive time, not propose time.** A delta spec is provisional until `/opsx:bulk-archive` resolves conflicts in order; only the merged, archived spec is worth indexing.
- **`specs_touched`/`decisions` frontmatter belongs to propose time, not archive time.** `accelint-qrspi-propose` is where this is supposed to get written, as part of the change's own design work. Task A's derive-and-confirm path exists for changes that didn't go through that flow — a fallback with the author's confirmation still required, not this skill's primary way of getting that data.
- **This skill only adds.** Pruning a `related:` entry or changing an existing `Status` value is `accelint-archive-synthesis`'s job — both need cross-change judgment and human confirmation this skill doesn't have.
- **Every write is idempotent.** Flow-style sorted `related:` and Phase 5's row-level patching of `specs/INDEX.md` mean a re-run against unchanged inputs is byte-identical, so retrying after a partial failure never duplicates entries or rows.
- **`specs/INDEX.md` is patched row-by-row for the capabilities touched this run (built wholesale only on first bootstrap); `changes/archive/INDEX.md` is append-only.** One describes current state, the other describes history — treating either the other way corrupts history or lets the index drift. Verifying `specs/INDEX.md` against every `spec.md` on disk, corpus-wide, isn't something this skill does, and isn't currently something `accelint-archive-synthesis` does either — its existing checks read the index as ground truth rather than auditing it. That's a gap worth closing there someday, not a job for this skill's per-archive hot path.
- **Phase 4 always delegates to subagents, never conditionally; Phase 1 never does, unconditionally.** Phase 4's unconditional delegation keeps the parent's context cost flat regardless of batch size, the same discipline `accelint-qrspi-propose` and `accelint-qrspi-apply` use for every file-touching phase. Phase 1 runs inline for the opposite reason: `/opsx:archive`/`/opsx:bulk-archive` are agent-driven and can branch or prompt mid-run, and only the context the user is actually in can follow that branch through or answer that prompt.

## Explicitly Out of Scope

- **No OpenSpec CLI dependency for reading local specs.** `openspec/specs/<capability>/spec.md` is a normal file at a known path; plain file reads are sufficient; no need to shell out to the CLI for something this direct.
- **No shelling out to `openspec archive`/`openspec bulk-archive` as a substitute for the `/opsx:archive`/`/opsx:bulk-archive` skill.** The bare CLI command isn't an equivalent shortcut — the skill is where OpenSpec's own delta-spec comparison and bulk-archive conflict resolution actually happen. Phase 1 always goes through the skill, never the raw CLI, even though running it inline (see Phase 1) already gives up some of the context-isolation the old subagent design had; trading that isolation for a CLI call that skips real judgment would be a worse trade, not a better one.
- **No per-edge relationship metadata.** A `related:` entry doesn't carry a reason or a timestamp of its own — that context already lives in the originating change's `design.md` and its row in `changes/archive/INDEX.md`, reachable by grepping if ever needed.
- **No automatic pruning of `related:`.** Only additive. Removal is `accelint-archive-synthesis`'s job, and only with human confirmation.
- **No directionality in the relation.** Co-touch is inherently symmetric, so it's always computed as all-pairs, never as a dependency direction — "A depends on B" is a different kind of edge this skill doesn't model at all.
- **No corpus-wide drift detection in `specs/INDEX.md`.** Phase 5 only ever patches the rows for capabilities this batch's changes declared in `specs_touched`. If some capability's `spec.md` was edited outside this skill and its `INDEX.md` row has gone stale as a result, this skill's hot path doesn't catch that — and neither, currently, does `accelint-archive-synthesis`: its decision-drift and structural-coupling checks both read `specs/INDEX.md` as ground truth rather than verifying it against `spec.md`. This is a real, accepted gap, not a job this skill should absorb into its own per-archive cost.
- **No reconciling summary stats trailing `changes/archive/INDEX.md`.** If that file carries a total row count or similar after the table, Phase 6 preserves it untouched (see Phase 6 step 2) rather than incrementing it — updating summary stats is corpus-wide bookkeeping in the same family as `specs/INDEX.md` drift above, not a per-archive job.

## Error Handling

**Missing or malformed design.md frontmatter (Task A)**: derive a candidate `specs_touched`/`decisions` from the change's own `proposal.md` and delta spec directories, present it to the user for explicit confirmation, and write the confirmed value back into `design.md` before Phase 1 runs for that change. Stop before Phase 1 for that change, with the field named, only if the user chooses to pause and fix it themselves, or if nothing in the change's own files supports a candidate at all.

**Missing `## Purpose` heading (Task B)**: don't block Phases 1–3 (they don't touch spec bodies), but stop before Phase 4 reaches that capability and ask the user to either add a placeholder or fix the spec first.

**A change touches only one capability**: `specs_touched` with a single entry produces zero pairs — that's expected, not an error. Still run Phase 4 for that capability (write `last_touched_by`/`last_touched_on`, regenerate `## Related Specs` even if its list is unchanged) and still add its row to `changes/archive/INDEX.md` in Phase 6.

**Brand-new capability with no prior spec.md**: handled explicitly in Phase 0 step 4 and Phase 4 step 2 — the subagent starts from an empty frontmatter block rather than treating the missing file as an error.

**Native command reports unresolved conflicts**: Phase 1 stops and reports the conflict verbatim to the user immediately without proceeding to extraction (its own step 8); do not proceed to Phase 2.

**`/opsx:archive` or `/opsx:bulk-archive` branches internally mid-run** (most commonly into a separate sync skill): this is normal, expected shape for the command, not a failure — see Phase 1 steps 4-5. Stay with it and resume archive's own remaining steps once the branch completes; if the branch (or anything else during the run) raises a prompt beyond the routine sync y/n, surface it to the user and wait for their answer rather than guessing.

**No subagent support available for Phase 4** (e.g. an environment without sub-agent support): fall back to performing Phase 4's steps directly in this context instead of one subagent per capability. Warn the user explicitly that this run will hold full `spec.md` contents in context as a result — this is a degraded fallback for Phase 4 only, not the intended default there, and normal operation should always prefer subagents for Phase 4. This has no bearing on Phase 1, which already runs in this context unconditionally by design regardless of sub-agent availability — see Phase 1.

**`specs/INDEX.md` or `changes/archive/INDEX.md` doesn't exist yet**: expected on a project's first-ever archive. Create `changes/archive/INDEX.md` fresh with a header row (Phase 6 step 3); `specs/INDEX.md` is built fresh from every capability in Phase 5's bootstrap case, and patched row-by-row on every archive after that.

**`changes/archive/INDEX.md` has content after the table** (a total row count, a `Generated:` date, a status legend, or similar): insert new rows at the end of the table's existing data rows, immediately before that content — never after it. See Phase 6 step 2. Do not edit the trailing content itself, and do not treat a stale count within it as something this run needs to fix.

## NEVER Do This

**NEVER run Phases 2–7 once per intermediate merge during a bulk-archive** — run them exactly once, after the entire batch resolves. Running early computes pairs against a `specs_touched` set that hasn't finished accumulating conflicts, and patches `INDEX.md` against a half-finished batch's incomplete rows.

**NEVER prune a `related:` entry** — this skill only unions. Removing an entry that looks stale is `accelint-archive-synthesis`'s job, and it requires human confirmation even there.

**NEVER write a derived `specs_touched` or `decisions` candidate into a change's `design.md` without the author's explicit confirmation** — deriving a candidate from `proposal.md` and delta specs (Task A's recovery path) is a convenience for getting unblocked, not a substitute for the author's own call on which capabilities a change actually touched.

**NEVER re-pad or realign existing rows in `specs/INDEX.md` when patching one row** — cell padding is per-row, not aligned to the table's widest value. Touching every row's whitespace to keep columns visually lined up defeats the entire point of a targeted line edit and turns a one-line diff back into a full-file rewrite.

**NEVER change an existing `Status` value in `changes/archive/INDEX.md`** — write `current` once, at creation, and never touch that column again for that row. Transitions belong to `accelint-archive-synthesis`.

**NEVER read `Date` from `design.md`** — always use the archive folder's own `YYYY-MM-DD` prefix. A change can sit in review for weeks before it's archived, so anything `design.md` says about dates will be stale by the time this skill runs.

**NEVER duplicate `capability` or `purpose` into a spec's frontmatter** — both already exist as the file's own path and its `## Purpose` heading. Restating either creates a second source of truth that will eventually disagree with the first.

**NEVER hand-maintain `## Related Specs`** — always regenerate it wholesale from the `related:` frontmatter that was just written. Treating it as independently editable content invites drift between what the frontmatter says and what the body shows.

**NEVER reorder or rewrite existing rows in `changes/archive/INDEX.md`** — append only. This file's value as an audit trail depends entirely on past rows staying exactly as they were written.

**NEVER append a new row to `changes/archive/INDEX.md` by writing to the end of the file** — locate the end of the table's existing data rows (Phase 6 step 2) and insert there. The file may carry content after the table — a total row count, a `Generated:` date, a status legend — and writing to end-of-file instead of end-of-table lands a data row in prose after that content instead of inside the table, corrupting it.

**NEVER unsort or use block-style YAML for `related:`** — flow style, single line, alphabetically sorted. This is what keeps a no-op run byte-identical and makes a genuine addition show up as a clean, reviewable diff.

**NEVER decline, skip, or second-guess a sync prompt during `/opsx:archive` or `/opsx:bulk-archive`** — always answer yes. It comes up more often than not, and it's a routine part of the archive operation completing, not a decision point that needs the parent's or the user's input.

**NEVER spawn a subagent for Phase 1, even when sub-agent support is available** — always run `/opsx:archive` or `/opsx:bulk-archive` directly in this context. A subagent handed that instruction has no reliable way to resume the command's own remaining steps after it branches internally (e.g. into a separate sync skill), and no way to surface an interactive prompt back to the user — both of which have caused this skill to stop mid-archive in practice. See Phase 1 for the full account.

**NEVER run Phase 4 directly in this context when subagents are available** — always delegate, regardless of how small the batch is. This isn't about parallelizing large batches; it's about keeping raw `spec.md` contents out of the orchestrating context on every single run, the same discipline `accelint-qrspi-propose` and `accelint-qrspi-apply` apply unconditionally.

**NEVER treat a mid-run branch in `/opsx:archive`/`/opsx:bulk-archive` (most commonly its own sync skill) as the end of Phase 1** — resume the command's remaining steps once the branch completes. Concluding the branch itself was the whole task is exactly the failure mode that motivated running Phase 1 inline in the first place.

## Example Usage

**Scenario 1: Single-change archive**

```
User: Archive the add-live-sync change with cross-linking

Skill: Running preflight checks...
✓ design.md frontmatter valid (specs_touched: sync/protocol, ui/status-indicator)
✓ Both capabilities have a ## Purpose heading

Running /opsx:archive add-live-sync directly (Phase 1 never uses a subagent)...
Sync now? (y/n) → yes
✓ Synced delta specs, resuming /opsx:archive's remaining steps...
✓ /opsx:archive add-live-sync merged, archived to
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

**Scenario 3: Missing design.md frontmatter, recovered from the change's own files**

```
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
Running /opsx:archive enhance-mock-consistency-rule directly...
✓ /opsx:archive enhance-mock-consistency-rule merged, archived to
  openspec/changes/archive/2026-07-07-enhance-mock-consistency-rule/
...
```

**Scenario 4: Bulk archive raises a non-routine prompt (surfaced to the user, not answered by the skill)**

```
User: Run bulk-archive on the pending changes

Skill: Running preflight checks across 2 pending changes...
✓ All design.md frontmatter valid

Running /opsx:bulk-archive directly (Phase 1 never uses a subagent)...
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

This is the scenario Phase 1 running inline actually unlocks: a subagent handed `/opsx:bulk-archive` has no way to relay that ordering question to the user and get a real answer back, so it either stalls or has to guess. Running Phase 1 in this context means the question reaches the person who can actually answer it.
