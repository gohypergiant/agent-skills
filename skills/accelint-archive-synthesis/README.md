# Accelint Archive Synthesis

Periodic consistency checker for OpenSpec archives. Scans the entire corpus of archived changes to detect decision drift and structural over-coupling — the one gap nothing else in the QRSPI/OpenSpec stack covers.

## What This Does

Looks backward across the full archive history to verify internal consistency:

- Detects **decision drift** where past decisions contradict later changes
- Flags **structural coupling** when capabilities accumulate too many relationships
- Routes confirmed findings to living documents via the shared `findings:` interface
- Updates archive status to mark superseded decisions

This implements the "lint" operation from Karpathy's LLM Wiki pattern. Every other drift check in the stack is forward-looking (change vs. artifacts, docs vs. code). This is the only backward-looking check (archive vs. itself).

## When to Use This

Invoke this skill when:

- ~15 changes have archived since the last synthesis run (suggested by `accelint-qrspi-archive`)
- You want to audit the archive for contradictions or inconsistencies
- You're investigating whether an old design decision still holds
- You suspect a capability has become over-coupled and needs refactoring
- You want to run a corpus health check manually

Trigger phrases:
- "run archive synthesis"
- "lint the openspec archive"
- "check for decision drift"
- "audit the spec archive for contradictions"
- "find stale specs"
- "check capability coupling"

**Never runs automatically** — always either a direct human invocation or an accepted suggestion.

## Prerequisites

This skill requires:

1. **OpenSpec CLI** - Installed and initialized
2. **accelint-qrspi-archive** - In regular use (produces the indexes this skill reads)
3. **Archive indexes** - Both `openspec/changes/archive/INDEX.md` and `openspec/specs/INDEX.md` exist with at least one row
4. **Sub-agent support** - For reading `design.md` files without polluting parent context
5. **Writer skills with findings interface** - `accelint-architecture-doc`, `accelint-onboard-openspec`, `accelint-onboard-agent`, `accelint-readme-writer` supporting Mode 3 Refresh with `findings:` input

### Check archive state:

```bash
ls -la openspec/changes/archive/INDEX.md openspec/specs/INDEX.md
```

Both files should exist. If missing, run `accelint-qrspi-archive` on at least one change first.

### Minimum corpus size:

The skill works with any corpus size but warns if fewer than ~10 archived changes exist (low signal-to-noise ratio).

## How It Works

### The Workflow

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  Phase            Action                                            Output    │
├───────────────────────────────────────────────────────────────────────────────┤
│  Preflight        Read SYNTHESIS-LOG.md, verify dependencies        Go/no-go  │
│                   exist, sanity-check thresholds                    + notes   │
│  Scan Indexes     Read archive/INDEX.md + specs/INDEX.md, load      In-memory │
│                   prior dismissed pairs from the log                model     │
│  Decision Drift   Coarse-scan Decision column for collisions,       Candidate │
│                   SUBAGENT opens design.md for verification         findings  │
│  Structural       Median related-count across specs/INDEX.md,       Candidate │
│  Coupling         flag outliers ≥5 and ≥2× median                   findings  │
│  Compile Report   Assemble CRITICAL / WARNING / SUGGESTION          Draft     │
│                   findings, /opsx:verify register                   report    │
│  Human Review     Present report; human confirms, dismisses, or     Confirmed │
│                   defers each finding                               findings  │
│  Route            Update Status (confirmed contradictions only)     Docs +    │
│                   + invoke affected writer skill(s) via findings:   Status    │
│  Log + Report     Append run checkpoint + any new dismissed pairs   Summary   │
│                   to SYNTHESIS-LOG.md, summarize                              │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Phase 0: Preflight

Confirms this run has something to check before reading anything else:

1. **Task A - trigger cadence sanity-check**: Read `SYNTHESIS-LOG.md` to find the last run's date and row count. If it doesn't exist yet (first run), skip cadence math. Otherwise, compute average time-between-archives to check if the 15-change trigger is sensible for this project's velocity. Report mismatches but never adjust automatically.

2. **Task B - dependency check**: Confirm both indexes exist and contain at least one row each. If either is missing or empty, stop and suggest running `accelint-qrspi-archive` first. If corpus has fewer than ~10 rows, note that synthesis has little to find and ask before proceeding.

3. **Task C - structural coupling threshold sanity-check**: Compute actual median `related:` count across `specs/INDEX.md`. Note if the fixed floor of 5 or 2× multiplier would flag too many/none. Report observation, never change threshold.

### Phase 1: Scan Indexes

Builds an in-memory model of the archive without opening any change folders:

1. Read `archive/INDEX.md` in full: every row's Change, Date, Decision summary, Specs touched list, and Status
2. Read `specs/INDEX.md` in full: every row's Capability, Purpose, Related list, and Last touched by/date
3. Read every `dismissed:` sub-list from `SYNTHESIS-LOG.md`'s full history, build flat set of dismissed-pair identities in form `<change-A>|<change-B>|<capability>` (alphabetically sorted)

If log doesn't exist, set starts empty (first run).

### Phase 2: Decision Drift Detection

Finds archived decisions that no longer cohere, without opening every `design.md`:

**Step 1 - group by shared/related capability**: Use Specs touched + related: fields to cluster changes touching the same capability or connected capabilities.

**Step 2 - coarse scan**: Drop any pair in dismissed-pair set (already judged not real). For the rest, compare Decision one-liners for opposing patterns:
- polling vs. push/websocket
- synchronous vs. asynchronous
- in-process vs. external service
- monolith vs. microservice
- eager vs. lazy
- centralized vs. distributed
- client-side vs. server-side

Also flag stated rationale contradicted by later rationale, and capabilities with clustered activity while spec's Last touched by is conspicuously earlier. This step works off index text in memory — no file I/O yet.

**Step 3 - targeted verification**: For each candidate, spawn one sub-agent per pair to open full `design.md` files and confirm/dismiss using complete `choice`/`rationale`/`alternatives` fields. Return only structured verdict (confirmed/dismissed + quote-free summary), never raw design.md contents.

**Step 4 - staleness flag**: Flag any capability where `Last touched by` date is old relative to cluster of recent related activity.

**Classification**: Confirmed contradiction is CRITICAL if affected capability's Last touched by date falls AFTER earlier contradicting change (something built on top). Otherwise WARNING. Staleness flags are SUGGESTION.

### Phase 3: Structural Coupling Signal

Surfaces capabilities whose `related:` count suggests boundary overgrowth — at zero extra cost since counts already exist:

1. Compute median `related:` list length across every row from Phase 1
2. Flag any capability with count both ≥5 AND ≥2× median as SUGGESTION
3. Phrase as plain fact: "sync/protocol relates to 14 other capabilities, more than double the index median of 6"

**Example**: For counts `[1,2,2,3,3,4,4,5,5,5,6,6,6,7,7,8,8,9,10,11,14,14]`, median is 6. Floor is `max(5, 2×6) = 12`, so only the two at 14 get flagged.

### Phase 4: Compile Report

Assembles everything into one report using `/opsx:verify`'s CRITICAL/WARNING/SUGGESTION register:

```
## Archive Synthesis Report — <date>

Corpus: <N> archived changes, <M> capabilities, checked back to <last checkpoint or "project start">.

### CRITICAL
- [Confirmed decision contradiction with live capability]

### WARNING
- [Confirmed decision contradiction on dormant capability]

### SUGGESTION
- [Staleness flag]
- [Structural coupling flag]

### Threshold notes (informational only)
- [Any cadence or median mismatch worth attention]
```

Never present findings as already-resolved — every item is a candidate for Phase 5.

### Phase 5: Human Review

Lets a human decide what actually happens with each finding:

Present each finding with three options:

**For decision-drift finding**:
```
Finding 1 [CRITICAL]: add-live-sync's stated budget constraint for
sync/protocol may no longer hold, given adopt-notification-gateway's
later message-broker adoption.
  (a) Confirm — I'll ask which change stands, then update Status and
      notify the relevant doc skill(s)
  (b) Dismiss — Recorded permanently; this exact pair won't be
      flagged again
  (c) Defer  — Left as-is; resurfaces next run
```

**For structural coupling finding**:
```
Finding 2 [SUGGESTION]: sync/protocol relates to 14 capabilities,
over double the index median of 6.
  (a) Confirm — Routes to ARCHITECTURE.md's Known Technical Debt review
  (b) Dismiss — Not persisted; will still be re-checked next run
  (c) Defer  — Left as-is; resurfaces next run
```

Only confirmed findings proceed to Phase 6. For decision drift, "Confirm" starts a decision, doesn't end one — Phase 6 still asks which side stands. Deferred findings resurface next run unchanged. Dismissed decision-drift findings persist to log; dismissed coupling findings do not (count is moving snapshot).

If human stops partway, treat unaddressed findings as deferred. Phase 7 logs what was confirmed; rest resurfaces next time.

### Phase 6: Route Confirmed Findings

Hands off to where they can change something, using shared `findings:` interface:

**For confirmed decision contradiction**:
1. Ask which side stands (never infer from recency)
2. Update that row's Status to `superseded by <slug> (<date>)` (only write this skill ever makes to archive/INDEX.md)
3. Invoke writer skill(s) whose hub doc covers affected capability:
   - Tech stack/dependencies/patterns → `accelint-onboard-openspec` (config.yaml)
   - System structure/components → `accelint-architecture-doc` (ARCHITECTURE.md)
   - Agent workflow/behavior → `accelint-onboard-agent` (AGENTS.md)
   - User-facing docs → `accelint-readme-writer` (README.md)

Single finding can target multiple writer skills. Each invocation succeeds/fails independently.

**For confirmed staleness/coupling flag**:
- No Status update
- Route to `accelint-architecture-doc`'s Known Technical Debt slot

**For dismissed decision-drift**:
- No Status write, but Phase 7 records pair to SYNTHESIS-LOG.md dismissed: list

**For dismissed coupling or any deferred**:
- No write anywhere, resurfaces next run

### Phase 7: Log and Report

Leaves checkpoint for next run and summarizes:

1. Append one line to `SYNTHESIS-LOG.md`:
   ```
   2026-07-06 — checked through row 42 — 2 confirmed, 1 dismissed, 1 deferred
     dismissed: [add-live-sync|adopt-notification-gateway|sync/protocol]
   ```

2. Close with short summary: findings by type, confirmed/dismissed/deferred counts, which writer skills invoked

## Key Concepts

### Cost Control at Scale

- **Index-first scanning**: Reads structured indexes (stay cheap regardless of history length), not raw files
- **Targeted verification**: Opens `design.md` only for specific candidates coarse scan flagged
- **Sub-agent delegation**: Keeps raw design content out of parent context on every run
- **Dismissed-pair tracking**: Skips pairs already ruled out permanently

### The Two Indexes (Owned Elsewhere)

Neither is written by this skill. Both written/maintained by `accelint-qrspi-archive`:

```
openspec/changes/archive/INDEX.md — one row per archived change:
| Change        | Date       | Decision                                  | Specs touched                      | Status  |
|---------------|------------|-------------------------------------------|------------------------------------|---------|
| add-live-sync | 2026-03-02 | polling with 5s interval, no infra budget | sync/protocol, ui/status-indicator | current |

openspec/specs/INDEX.md — one row per capability, rebuilt on every archive:
| Capability    | Purpose                                     | Related             | Last touched by            |
|---------------|---------------------------------------------|---------------------|----------------------------|
| sync/protocol | Defines how client and server exchange state | ui/status-indicator | add-live-sync (2026-03-02) |
```

Decision column is condensed one-liner from `design.md` frontmatter. This skill's Phase 2 works off that summary first, only opens full design.md for flagged candidates.

### The Log (Owned by This Skill)

`openspec/changes/archive/SYNTHESIS-LOG.md` — plain append-only list:
- One line per run: date + row count checked + confirmed/dismissed/deferred counts
- Optional indented `dismissed:` sub-list of decision-drift pairs explicitly dismissed
- Only decision-drift dismissals persist (structural coupling dismissals don't — count is moving snapshot)
- Never edited/removed by skill; reconsidering dismissed pair is manual edit

### Findings Interface (Shared Contract)

Uses exact same `findings:` shape `accelint-qrspi-apply` Phase 4 uses:

```
/accelint-architecture-doc
We found the following during periodic archive synthesis. Treat this as known
context and refresh the affected section(s).

findings:
- [Plain factual statement about what archive shows, never instruction]
```

Writer skill merges with its own codebase scan before presenting to human — same Mode 3 Refresh path manual run would take.

**Rephrasing discipline**: Every findings: line is plain fact about what archive shows ("sync/protocol's stated budget constraint may no longer hold, given later message-broker adoption"), never instruction ("update sync/protocol's spec to remove constraint") — that would pre-empt writer skill's Mode 3 interview.

### Relationship to `/opsx:verify`

Borrows CRITICAL/WARNING/SUGGESTION register deliberately so reports read as familiar artifacts. But they check fundamentally different things:

- `/opsx:verify`: Forward-looking, per-change, before archival (does implementation match its own design.md/tasks.md?)
- This skill: Backward-looking, cross-archive, periodic (does archive agree with itself?)

Complementary, not redundant. A change can pass verification cleanly and still surface in decision-drift finding years later.

## Example Usage

### Scenario 1: Suggested run, one confirmed contradiction, one structural flag

```
[accelint-qrspi-archive, at end of summary]
ℹ️ 15 changes have archived since last synthesis run (2026-01-10).
  Consider running accelint-archive-synthesis.

User: Yes, run archive synthesis.

Skill: Preflight —
✓ Task B: both indexes present, 47 archived changes, 22 capabilities
✓ Task A: actual cadence ~1.1 changes/week; 15-change trigger implies
  checking roughly every 10 weeks — no mismatch worth flagging
✓ Task C: index median related-count is 6; 5-and-2× floor looks reasonable

Scanning archive/INDEX.md and specs/INDEX.md...

Decision drift —
[spawns subagent: verify sync/protocol candidate]
✓ Confirmed: add-live-sync (2026-03-02) chose polling for sync/protocol,
  citing no infra budget for a message broker. adopt-notification-gateway
  (2026-06-18) later adopted a message broker for an unrelated capability.
  sync/protocol has been touched twice since — CRITICAL.

Structural coupling —
✓ sync/protocol relates to 14 other capabilities, more than double the
  index median of 6 — SUGGESTION.

## Archive Synthesis Report — 2026-07-06
Corpus: 47 archived changes, 22 capabilities, checked back to 2026-01-10.

### CRITICAL
Finding 1: add-live-sync's stated budget constraint for sync/protocol may
no longer hold, given adopt-notification-gateway's later message-broker
adoption.
  (a) Confirm — I'll ask which change stands, then update Status and
      notify the relevant doc skill(s)
  (b) Dismiss — Recorded permanently; this exact pair won't be flagged again
  (c) Defer  — Left as-is; resurfaces next run

### SUGGESTION
Finding 2: sync/protocol relates to 14 capabilities, over double the
median of 6.
  (a) Confirm — Routes to ARCHITECTURE.md's Known Technical Debt review
  (b) Dismiss — Not persisted; will still be re-checked next run
  (c) Defer  — Left as-is; resurfaces next run

User: Confirm Finding 1.

Skill: For Finding 1 — which change should Status reflect as the one
that stands: add-live-sync's original budget constraint, or
adopt-notification-gateway's later message-broker adoption?

User: adopt-notification-gateway — the budget constraint's gone now.

Skill:
✓ archive/INDEX.md: add-live-sync row Status → "superseded by
  adopt-notification-gateway (2026-06-18)"
[invokes accelint-architecture-doc with findings: — sync/protocol budget
  constraint may be stale]

Appending checkpoint to openspec/changes/archive/SYNTHESIS-LOG.md...

✅ Synthesis complete: 1 confirmed, 0 dismissed, 0 deferred.
```

### Scenario 2: First-ever run, small corpus, nothing to report

```
User: Run archive synthesis on this repo, I don't think it's ever been done.

Skill: Preflight —
✓ Task B: both indexes present, 6 archived changes, 4 capabilities
ℹ️ openspec/changes/archive/SYNTHESIS-LOG.md doesn't exist yet — this is the
  first-ever run. Task A's cadence math needs a prior checkpoint, so it's
  skipped this time.
⚠️ 6 archived changes is a small corpus — cross-archive synthesis has little
  to work with yet. Continue anyway with a low-signal run?

User: Yes, go ahead.

Skill: Scanning archive/INDEX.md and specs/INDEX.md...

Decision drift — no candidate collisions found across 4 capabilities.
Structural coupling — only 4 specs/INDEX.md rows; Phase 3 needs at least 2
  to compute a median, but a corpus this small has nothing meaningful to
  flag either way.

## Archive Synthesis Report — 2026-07-06
Corpus: 6 archived changes, 4 capabilities, checked back to project start.

No CRITICAL, WARNING, or SUGGESTION findings this run.

Appending checkpoint to openspec/changes/archive/SYNTHESIS-LOG.md
  (file created fresh)...

✅ Synthesis complete: nothing to confirm. Re-run once more changes have
   archived — this corpus is too small yet for the signal to be meaningful.
```

### Scenario 3: Previously dismissed pair stays suppressed

```
[Run 1, three months earlier]
Skill: Finding 1 [WARNING]: legacy-cache-warmer (2025-11-02) chose eager
  cache warming for cache/layer, citing predictable traffic patterns.
  adopt-lazy-init (2026-01-14) later chose lazy initialization for an
  unrelated capability.

User: Dismiss — these two were never actually in tension, different
teams, different constraints.

Skill: ✓ Recorded as dismissed.
Appending checkpoint to SYNTHESIS-LOG.md...
  dismissed: [adopt-lazy-init|legacy-cache-warmer|cache/layer]

[Run 2, today]
Skill: Preflight —
✓ Task A: reading SYNTHESIS-LOG.md — last run 2026-04-02, checked
  through row 31; 1 dismissed pair on record
✓ Task B: both indexes present, 53 archived changes, 24 capabilities

Scanning archive/INDEX.md and specs/INDEX.md...
Loading dismissed-pair history — 1 entry found.

Decision drift —
- legacy-cache-warmer / adopt-lazy-init / cache/layer: matches a
  dismissed pair on record, skipped without re-verification.

## Archive Synthesis Report — 2026-07-06
Corpus: 53 archived changes, 24 capabilities, checked back to 2026-04-02.
(cache/layer's legacy-cache-warmer/adopt-lazy-init pair previously
dismissed — not re-surfaced this run)

No new CRITICAL or WARNING findings.
```

## Error Handling

**If either index missing or empty**:
- Stop before Phase 1
- Tell user to run `accelint-qrspi-archive` first

**If SYNTHESIS-LOG.md doesn't exist**:
- Not an error — expected state on first-ever run
- Task A skips cadence math, proceeds
- Phase 7 creates file fresh

**If corpus smaller than ~10 archived changes**:
- Don't block, but say plainly corpus is small
- Ask before proceeding with low-signal run

**If flagged writer skill isn't installed or doesn't support findings:**:
- Don't fail whole run
- Present finding in report
- Tell user handoff needs manual paste-in

**If no sub-agent support**:
- Fall back to opening `design.md` in parent context (Phase 2 Step 3)
- Warn explicitly this run's raw contents sit in context

**If design.md referenced by index no longer exists**:
- Skip that row for targeted verification
- Note as unverifiable in report
- Don't treat absence as finding

**If index row malformed**:
- Skip that row for whatever phase needs missing field
- Note as unparseable in report
- Continue with every other row

**If dismissed: entry references slug no longer in index**:
- Drop from in-memory dismissed-pair set this run
- Note once in report
- Can't suppress if slug doesn't resolve

**If corpus too small for Phase 3**:
- Skip Phase 3 entirely (median needs enough rows)
- Note in report

**If Phase 2 produces unreasonably large candidate set**:
- Don't spawn one subagent per pair unconditionally
- Prioritize most recent pairs, verify those
- Note how many older candidates weren't checked this run

**If routing invocation fails after Status update**:
- Don't undo Status update (two writes are independent)
- Tell user Status landed but handoff didn't
- Give findings:-formatted text for manual invoke

**If human answers "which change stands" ambiguously or doesn't answer**:
- Never infer from recency
- Ask again rather than proceeding
- Leave finding unresolved (deferred) until answer unambiguous

**If human names slug for Status that doesn't appear in index**:
- Stop, ask for correct slug
- Don't write unverifiable reference

## Configuration Requirements

This skill assumes:

1. OpenSpec installed and initialized (`openspec/` directory exists)
2. `accelint-qrspi-archive` has run at least once (indexes exist and populated)
3. Sub-agent support available (for reading `design.md` files)
4. Writer skills installed and support `findings:` interface (optional, degrades gracefully)

If missing, skill reports issue and guides setup.

### Configuration Defaults

| Setting | Default | Rationale |
|---------|---------|-----------|
| Trigger threshold | 15 archived changes since last run | Balances signal quality vs. cadence (reasoned starting point, adjust based on actual velocity) |
| Structural coupling floor | ≥5 relationships | Prevents flagging minimally-connected specs |
| Structural coupling multiplier | ≥2× median | Adapts to project's natural relationship density |

Phase 0 reports mismatches but never adjusts automatically. Changing numbers is human's call.

## Tips

Check the archive cadence after first few runs. If 15 changes means checking twice yearly or every few days, adjust the threshold.

Trust dismissed-pair tracking. A decision-drift dismissal is permanent (pair never re-flagged). A structural coupling dismissal is not (count rechecked every run).

The verification report format matches `/opsx:verify` deliberately. Both check correctness, just at different scopes.

When a finding targets multiple docs, each writer skill invocation is independent. One succeeding doesn't depend on another.

If unsure whether an old decision still holds, run this manually rather than waiting for the 15-change threshold.

## Related Skills

- `accelint-qrspi-archive` - Archive OpenSpec changes, produce indexes this skill reads (prerequisite)
- `accelint-qrspi-apply` - Implement changes with parallelization, Phase 4 uses same findings: interface
- `accelint-onboard-openspec` - Update config.yaml (routing target for tech stack drift)
- `accelint-architecture-doc` - Update ARCHITECTURE.md (routing target for structure/coupling drift)
- `accelint-onboard-agent` - Update AGENTS.md (routing target for behavior drift)
- `accelint-readme-writer` - Update README.md (routing target for user-facing drift)

## Architecture Context

This skill implements the "lint" operation from Karpathy's LLM Wiki pattern:

```
KARPATHY LLM WIKI              ACCELINT / OPENSPEC
──────────────────             ────────────────────
Tier 0: raw/                   openspec/changes/archive/*.md (immutable log)
Tier 1: wiki/ pages            openspec/specs/<capability>/spec.md (current understanding)
Tier 2: CLAUDE.md index        config.yaml + ARCHITECTURE.md + AGENTS.md + README.md (hub docs)

Op: ingest                 →   /opsx:archive + qrspi-apply Phase 4
Op: query                  →   artifact load at propose/apply time
Op: lint                   →   accelint-archive-synthesis (this skill)
```

Every existing drift check is forward-looking (change vs. artifacts, docs vs. code). This is the only backward-looking check (archive vs. itself).

## Build Order

This skill is deliberately last in a four-piece stack, each a hard dependency:

1. **`accelint-qrspi-archive`** - Produces the indexes this skill reads (foundational)
2. **`accelint-qrspi-propose` Phase 2 extension** - Reads `specs/INDEX.md` at propose time (makes index load-bearing)
3. **Shared `findings:` interface** - Mode 3 extension across writer skills + Phase 4 prompt change (routing destination)
4. **This skill** - Consumes indexes, routes findings (builds on 1-3)

Without 1, there's no corpus to lint. Without 2-3, skill can scan/report but has nowhere to route confirmed findings — degrades to "tell human what to do manually."

## Documentation

- [openspec/config.yaml](../../../openspec/config.yaml) - Project DNA: stack facts, coding patterns, domain concepts
- [ARCHITECTURE.md](../../../ARCHITECTURE.md) - System architecture, deployment, component interactions
- [AGENTS.md](../../../AGENTS.md) - Agent behavior, workflows, guardrails
- [LLM Wiki Pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) - Original pattern this implements
- [LLM-Readable Context Architecture](/Users/bryankizer/Projects/work-notes/AI Discussion/RPI Talk/LLM-Readable Context Architecture.md) - Gap analysis and design decisions behind this skill
