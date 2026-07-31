# Archive Synthesis

Periodic consistency checker for OpenSpec archives. It reads backward across archived changes to detect decision drift, structural over-coupling, and index staleness — the one gap nothing else in the QRSPI/OpenSpec stack covers.

## What It Does

This skill scans the complete archive history to verify internal consistency:

- **Decision drift** — finds past decisions that contradict later changes
- **Index reconciliation** — checks whether `specs/INDEX.md` still matches actual `spec.md` files
- **Structural coupling** — flags capabilities with relationship counts well above the corpus median
- **Human-in-the-loop** — always stops for review before making any writes

This is the "lint" operation from Karpathy's LLM Wiki pattern. Every other drift check in this stack is forward-looking (change vs. artifacts, docs vs. code). This is the only backward-looking check (archive vs. itself).

## When to Use

Invoke this skill when:

- ~15 changes have archived since the last synthesis run (accelint-qrspi-archive suggests this)
- You want to audit the archive for contradictions or inconsistencies
- You're investigating whether an old design decision still holds
- You suspect a capability has become over-coupled
- You want a corpus health check

**Example trigger phrases:**
- "run archive synthesis"
- "lint the openspec archive"
- "check for decision drift"
- "audit the spec archive for contradictions"
- "check capability coupling"

This skill never runs automatically — always a direct human request or accepted suggestion.

## Prerequisites

This skill requires:

1. **OpenSpec CLI** installed and initialized
2. **accelint-qrspi-archive** in regular use (produces the indexes this skill reads)
3. **Archive indexes** — both `openspec/changes/archive/INDEX.md` and `openspec/specs/INDEX.md` exist with at least one row
4. **Sub-agent support** — for reading `design.md` files without polluting parent context
5. **Writer skills with findings interface** — accelint-architecture-doc, accelint-onboard-openspec, accelint-onboard-agents, accelint-readme-writer supporting Mode 3 Refresh with `findings:` input

### Check archive state

```bash
ls -la openspec/changes/archive/INDEX.md openspec/specs/INDEX.md
```

Both files should exist. If missing, run accelint-qrspi-archive on at least one change first.

### Minimum corpus size

This skill works with any corpus size but warns if fewer than ~10 archived changes exist (low signal-to-noise ratio).

## How It Works

### Workflow Overview

```
Step  Action                                             Output
────────────────────────────────────────────────────────────────────────
1     Preflight checks (verify dependencies, thresholds) Go/no-go + notes
2     Scan both indexes into memory                      In-memory model
3     Decision drift detection (coarse scan + subagent)  Candidate findings
4     Index reconciliation (existence + content check)   Candidate findings
5     Structural coupling (median-based threshold)       Candidate findings
6     Compile report (CRITICAL/WARNING/SUGGESTION)       Draft report
7     Human review (confirm/dismiss/defer per finding)   Confirmed findings
8     Route confirmed findings + targeted writes         Docs + status updates
9     Log checkpoint + dismissed pairs                   Summary
```

### What Gets Written

This skill has narrow, confirmation-gated write permissions:

**On `archive/INDEX.md`:**
- Only the `Status` column
- Only for decision-drift findings after the human confirms which change stands
- Format: `superseded by <slug> (<date>)`

**On `specs/INDEX.md`:**
- Single-row patch (`Purpose` + `related:`) or removal
- Only for reconciliation findings after human confirmation
- Never touches `last_touched_by`

**On `SYNTHESIS-LOG.md`:**
- Appends one checkpoint line per run
- Records dismissed decision-drift pairs (structural coupling dismissals do not persist)

**To writer skills:**
- Routes confirmed findings via the `findings:` interface
- Never rewrites hub docs directly

### Cost Control

- **Index-first scanning** — reads structured indexes, not raw files
- **Targeted verification** — opens `design.md` only for flagged candidates
- **Sub-agent delegation** — keeps raw content out of parent context
- **Dismissed-pair tracking** — skips pairs already ruled out

## The Two Checks

### Decision Drift Detection

This check groups changes by shared or related capabilities, pattern-matches `Decision` summaries for opposing choices (polling vs. push, eager vs. lazy, etc.), then verifies candidates by opening full `design.md` files.

**Classification:**
- **CRITICAL** — contradiction affects a capability touched after the earlier decision
- **WARNING** — contradiction exists but capability hasn't been touched since
- **SUGGESTION** — staleness flag (old Last touched by date vs. recent activity cluster)

### Index Reconciliation

This check confirms every `spec.md` still exists and matches its `specs/INDEX.md` row's `Purpose` and `related:` values.

**Classification:**
- **CRITICAL** — capability directory or spec.md missing entirely
- **WARNING** — Purpose or related: mismatch between index and file

### Structural Coupling

This check computes the median related-count across `specs/INDEX.md` and flags outliers ≥5 and ≥2× median.

**Classification:**
- **SUGGESTION** — "sync/protocol relates to 14 capabilities, more than double the index median of 6"

## Example Output

```
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

### WARNING
Finding 2: cache/layer's specs/INDEX.md row disagrees with its own
spec.md — index says related: [cli-core], file currently says
related: [cli-core, rule-engine].
  (a) Confirm — I'll patch this row directly (Purpose + related:
      only, last_touched_by stays as-is)
  (b) Dismiss — Not persisted; will still be re-checked next run
  (c) Defer  — Left as-is; resurfaces next run

### SUGGESTION
Finding 3: sync/protocol relates to 14 capabilities, over double the
median of 6.
  (a) Confirm — Routes to ARCHITECTURE.md's Known Technical Debt review
  (b) Dismiss — Not persisted; will still be re-checked next run
  (c) Defer  — Left as-is; resurfaces next run
```

## Human Review Rules

- **Confirm** — proceeds to routing or writing. For decision drift, ask which side stands first.
- **Dismiss** — persists only for decision-drift pairs; coupling and reconciliation findings resurface next run.
- **Defer** — nothing is written, and the finding resurfaces next run unchanged.
- Unaddressed findings default to deferred. Never confirm them automatically.

## Degraded Mode

If dependencies are unavailable:

- **No subagent support** — falls back to parent-context reads, warns about degraded behavior
- **Writer skill missing** — still produces report, provides manual paste-ready findings text
- **Small corpus** — warns and asks before proceeding with low-signal run
- **Large candidate volume** — verifies newest first, notes how many left unchecked

## Build Order

This skill is deliberately last in a four-piece stack:

1. **accelint-qrspi-archive** — produces the indexes (foundational)
2. **accelint-qrspi-propose Phase 2 extension** — reads specs/INDEX.md at propose time (makes index load-bearing)
3. **Shared findings: interface** — Mode 3 extension across writer skills (routing destination)
4. **This skill** — consumes indexes, routes findings (builds on 1-3)

Without 1, there is no corpus to lint. Without 2-3, this skill can still scan and report, but it degrades to manual guidance for routing.

## Configuration Defaults

| Setting | Default | Rationale |
|---------|---------|-----------|
| Trigger threshold | 15 archived changes since last run | Balances signal quality vs. cadence |
| Structural coupling floor | ≥5 relationships | Prevents flagging minimally-connected specs |
| Structural coupling multiplier | ≥2× median | Adapts to project's natural density |

Preflight reports mismatches but never adjusts them automatically.

## Related Skills

- **accelint-qrspi-archive** — archives changes, produces indexes this skill reads (prerequisite)
- **accelint-qrspi-apply** — implements changes, uses same findings: interface
- **accelint-onboard-openspec** — updates config.yaml (routing target)
- **accelint-architecture-doc** — updates ARCHITECTURE.md (routing target)
- **accelint-onboard-agents** — updates AGENTS.md (routing target)
- **accelint-readme-writer** — updates README.md (routing target)

## Evaluation Coverage

Includes 12 test scenarios covering:
- Explicit invocation vs. automatic execution (boundary test)
- Decision-drift detection and verification
- Human-in-the-loop review gates
- Dismissed-pair persistence
- Index reconciliation (missing files, content mismatches)
- Structural coupling thresholds
- Degraded-mode fallbacks
- Low-corpus warnings
- Partial confirmation handling

See `evals/evals.json` for complete scenario definitions.

## Architecture Context

Implements the "lint" operation from Karpathy's LLM Wiki pattern:

```
KARPATHY LLM WIKI              ACCELINT / OPENSPEC
──────────────────             ────────────────────
Tier 0: raw/                   openspec/changes/archive/*.md (immutable log)
Tier 1: wiki/ pages            openspec/specs/<capability>/spec.md (current)
Tier 2: CLAUDE.md index        hub docs (config.yaml, ARCHITECTURE.md, etc.)

Op: ingest                 →   /opsx:archive + qrspi-apply Phase 4
Op: query                  →   artifact load at propose/apply time
Op: lint                   →   accelint-archive-synthesis (this skill)
```

## Further Reading

- **SKILL.md** — complete agent execution instructions (614 lines)
- **CHANGELOG.md** — version history and rationale
- **evals/evals.json** — test scenario definitions
- [LLM Wiki Pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — original pattern this implements
- **../../ARCHITECTURE.md** — agent-skills repository architecture
- **../../AGENTS.md** — agent behavior guidelines for this repository

## License

Apache-2.0

## Version

1.1.3 (2026-07-31)
