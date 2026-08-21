# Jargon Extractor

Extract internal terminology, acronyms, and shorthand from project documentation. Build or update a glossary in `JARGON.md`, reusing an existing file anywhere in the repo when present and otherwise defaulting to the repo root.

This skill reads documents and identifies terms that would confuse a new reader. It maintains an alphabetized glossary across multiple runs. It merges overlapping definitions and links the glossary to your agent behavior files. Future agent runs can reference the glossary.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
  - [Phase 1: Extract (parallel)](#phase-1-extract-parallel)
  - [Phase 2: Reduce (once)](#phase-2-reduce-once)
  - [Phase 3: File (deterministic)](#phase-3-file-deterministic)
- [Output Format](#output-format)
- [Linking to Agent Behavior Files](#linking-to-agent-behavior-files)
- [What Gets Flagged](#what-gets-flagged)
- [Correlation and Merging](#correlation-and-merging)
- [Edge Cases](#edge-cases)
- [Example](#example)
- [Technical Details](#technical-details)
- [Limitations](#limitations)
- [License](#license)

## Installation

```bash
<Install location and instructions TBD>
```

## Quick Start

Extract jargon from your documentation:

```bash
/jargon-extractor docs/*.md
```

This will:

1. Scan all markdown files in `docs/`
2. Flag terms a new reader would not know
3. Write or update the chosen `JARGON.md` path
4. Link the glossary from `AGENTS.md` or `CLAUDE.md` if present

### Extract from specific files

```
/jargon-extractor docs/architecture.md docs/onboarding.md
```

The skill automatically discovers and includes:

- Documentation folders: `docs/`, `doc/`, `documents/`
- Root documentation: `README.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`
- Decision records: `adr/`, `decisions/`, `rfd/`, `rfcs/`, `notes/`, `spikes/`

### Natural language triggers

You can also trigger the skill conversationally:

- "Extract jargon from the design docs"
- "Build a glossary from the markdown files"
- "What specialized vocabulary appears in these documents?"
- "Go through these docs and pull out anything a new hire would not know"

## How It Works

The skill splits work into three phases to keep context usage minimal:

### Phase 1: Extract (parallel)

One subagent per file flags jargon and writes findings to JSON files. Each returns only a short confirmation to the orchestrator. Files are processed in waves of five at a time to bound concurrency.

### Phase 2: Reduce (once)

A single subagent reads all extraction files plus the current glossary, correlates terms case-insensitively, merges overlapping definitions, and writes the merged results to another JSON file.

### Phase 3: File (deterministic)

The bundled `merge_jargon.py` script upserts the merged entries into the chosen `JARGON.md` path, sorts alphabetically, and reports what changed. This happens on disk without passing glossary content through model context.

## Output Format

Each glossary entry follows this structure:

```markdown
- **Term**: Definition in plain English, one to two sentences.
```

### Multiple senses

If a term has distinct meanings, they are numbered inside one entry:

```markdown
- **sidecar**: (1) A helper process deployed alongside the main service to handle logging and metrics. (2) More loosely, any auxiliary process that runs next to a primary one and shares its lifecycle.
```

This keeps one term mapping to one stable lookup key for future agent runs.

## Linking to Agent Behavior Files

After updating the glossary, the skill adds a reference to `AGENTS.md` or `CLAUDE.md` (if either exists) so future agent runs can find it. The reference is added to the `## Related Documentation` section:

```markdown
- **JARGON.md**: Internal terminology, acronyms, and shorthand used in this project, with plain English definitions
  *(Reference this when a term, acronym, or piece of shorthand in this project isn't self-explanatory)*
```

## What Gets Flagged

The skill flags terms that a competent outside reader would need explained:

- **Acronyms and initialisms** (CDC, QRSPI, RFC)
- **Internal tool/system names** (Accelint, auditkit, merge_jargon.py)
- **Project-specific shorthand** (subagent, orchestrator, disposable context)
- **Domain terminology** from specialized fields the document assumes familiarity with

It excludes plain vocabulary and standard technical terms (function, database, HTTP) that do not need explanation.

## Correlation and Merging

The reduce phase correlates entries that refer to the same term:

- **Case-insensitive matching**: `API` and `api` are the same term
- **Punctuation normalization**: `sub-agent` and `subagent` are merged if they clearly mean the same thing
- **Conservative merging**: When unsure if two entries describe the same concept, the reducer keeps them separate and flags the ambiguity

## Edge Cases

### No jargon found

If a file contains no jargon worth flagging, the extractor writes an empty array `[]`. This is a normal outcome.

### Running twice on the same files

If nothing changed in the source files, the reducer marks all terms as unchanged and `merge_jargon.py` reports a no-op. The glossary file is not touched.

### Binary or unreadable files

The skill skips unreadable files and reports which ones were skipped, rather than failing the entire run.

### Very large file sets

Extraction scales by adding more waves. The single reduce pass holds more extraction files as the count grows, but this cost lands in the reducer's disposable context, not the orchestrator's.

### Single file or fewer than five

The wave loop runs one wave, and reduce still runs once at the end. No special handling needed.

## Example

Given two files:

**docs/architecture.md** contains:
> The sidecar process handles all logging and metrics for the main service.

**docs/onboarding.md** contains:
> We use "sidecar" loosely to mean any auxiliary process that runs alongside a primary one.

The skill extracts both, correlates them as the same term with two distinct senses, and produces:

```markdown
- **sidecar**: (1) A helper process deployed alongside the main service to handle logging and metrics without living in the main service's codebase. (2) More loosely, any auxiliary process that runs next to a primary one and shares its lifecycle.
```

## Technical Details

### Scratch Directory

Each run creates a temporary directory under `/tmp/jargon-extractor.XXXXXX` for intermediate files. This location is predictable for debugging, unlike environment-dependent `$TMPDIR` values.

### Merge Script

The bundled `merge_jargon.py` script:

- Parses the existing glossary
- Upserts entries by term (case-insensitive)
- Sorts alphabetically
- Writes the result back
- Reports counts of terms added, updated, and unchanged

Run with `--dry-run` to preview changes before committing:

```bash
python3 scripts/merge_jargon.py JARGON.md entries.json --dry-run
```

The script errors rather than guesses if it encounters:

- Duplicate terms in the entries file
- Lines in the existing glossary it cannot parse

### Entry Format

Each entry is one line with no wrapped continuation:

```markdown
- **Term**: Definition.
```

This keeps the file trivially parseable by both the merge script and future skill runs.

## Limitations

- The skill does not create `AGENTS.md` or `CLAUDE.md` from scratch if neither exists. It only adds references to existing files.
- Definitions longer than two sentences likely belong in the project's main documentation, not the glossary. The glossary entry should link there instead.
- The primary reader is an agent doing single-term lookups, not a human skimming for context. Definitions are optimized for this use case.

## License

Apache-2.0
