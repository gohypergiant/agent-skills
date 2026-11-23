# QRSPI File Contract

Files, headers, and rules for `accelint-qrspi-propose`. Only the orchestrator uses this file. The stage files (`stage-questions.md`, `stage-research.md`, `stage-plan.md`) never read it; the orchestrator checks the files and gives each stage only what it needs.

## Contents

- Change folder
- Files the orchestrator writes
- Header and completion marker
- Header and marker check
- Ticket rules
- Internal-only rule
- Resume by artifact inference

## Change folder

The orchestrator creates the change folder (step 5) before any subagent runs, so `questions.md` and `research.md` have a place to live. The `openspec-new-change` skill derives the name and creates the change. Use `changeRoot` from its `openspec status --json` output as the folder for every file below. Never assume `openspec/changes/<name>/`.

The name is the only ticket-derived text allowed anywhere after the questions stage, and it may appear only as the folder name or path. It must not appear in prose inside a subagent prompt. A few kebab-case words in a path are an accepted, documented leak.

## Files the orchestrator writes

Questions and research subagents return text. The orchestrator writes the files. This keeps subagents from writing these files and keeps one writer for the header and marker.

| File | Path | Written after | Read by |
|---|---|---|---|
| `questions.md` | `<changeRoot>/questions.md` | questions subagent returns | research subagent, plan |
| `research.md` | `<changeRoot>/research.md` | research subagent returns | plan |

## Header and completion marker

Both files use this layout:

```markdown
Snapshot: <ISO 8601 UTC date with Z suffix> @ <git short SHA>

# Research Questions        (research.md: # Research Findings)

<the text the subagent returned, unchanged>

<!-- qrspi:complete -->
```

- Line 1 is exactly `Snapshot: <date> @ <sha>`. Nothing else goes in the header.
- Date: `python3 -c "from datetime import datetime, timezone; print(datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z'))"`.
- SHA: `git rev-parse --short HEAD`. If that fails, use `unknown`.
- The last line of the file is exactly `<!-- qrspi:complete -->`. Write it only after the full body is written. A file without it is partial or stale.

The snapshot line tells anyone who finds an archived copy later when the facts were true, so they do not read old research as the current state of the code.

## Header and marker check

Run this check on a file before dispatching any subagent that depends on it: line 1 starts with `Snapshot:` and the last line is `<!-- qrspi:complete -->`. If either fails, stop and tell the user which file failed and why. Do not guess, regenerate, or edit it silently.

## Ticket rules

- The ticket exists only in the orchestrator's memory, in the `openspec-new-change` step (which runs in the orchestrator's own context), and in the questions dispatch prompt. It is never written to disk.
- Nothing derived from the ticket (goals, flags, open decisions, paraphrase) may appear in any later subagent prompt. The folder name is the single exception described above.
- This is a prompt convention, not a filesystem guarantee. A subagent with file tools can read anything on disk, so the rule works only because the ticket is never put on disk.

## Internal-only rule

Do not show the contents of `questions.md` or `research.md` to the user, and do not summarize them in progress messages. The user sees them only by opening the files. They feed the design stage and are not a review checkpoint.

## Resume by artifact inference

There is no state file. When the user asks to resume a named change, read the change folder and use the first row that matches:

| Folder contents | Resume at |
|---|---|
| `questions.md` missing or fails the header and marker check | Step 6 (questions). Ask the user to supply the ticket again. |
| `questions.md` valid, `research.md` missing or fails the check | Step 7 (research). No ticket needed. |
| Both valid | Step 8 (plan). `stage-plan.md` infers its own starting point from the artifacts. |

If the folder is ambiguous (for example `research.md` is valid but `questions.md` is not), stop and tell the user what is inconsistent instead of picking a stage.
