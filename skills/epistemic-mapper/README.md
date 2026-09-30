# Epistemic Mapper

A Claude Code skill that extracts and maps a project's knowledge state into four quadrants: validated Facts, open Questions, undocumented Assumptions, and inferred Risks. Built for prototype-to-production handoff scenarios where tacit knowledge must be captured before the original builder leaves.

---

## Table of Contents

1. [What This Skill Does](#what-this-skill-does)
2. [When to Use This Skill](#when-to-use-this-skill)
3. [The Four-Quadrant Model](#the-four-quadrant-model)
4. [Installation](#installation)
5. [Usage](#usage)
   - [Basic Usage](#basic-usage)
   - [With Interview Mode](#with-interview-mode)
6. [Output](#output)
7. [How It Works](#how-it-works)
   - [Step 1: Source Discovery](#step-1-source-discovery)
   - [Step 2: Parallel Extraction](#step-2-parallel-extraction)
   - [Step 3: Correlation and Deduplication](#step-3-correlation-and-deduplication)
   - [Step 4: Risk Synthesis](#step-4-risk-synthesis)
   - [Step 5: Backlog Generation](#step-5-backlog-generation)
8. [Understanding the Output](#understanding-the-output)
   - [Entry Structure](#entry-structure)
   - [Confidence Tiers](#confidence-tiers)
   - [Category Slugs](#category-slugs)
9. [Living Document Behavior](#living-document-behavior)
   - [Promotions](#promotions)
   - [Resolutions](#resolutions)
   - [Dismissals](#dismissals)
10. [Relationship to Other Living Documents](#relationship-to-other-living-documents)
11. [Advanced Usage](#advanced-usage)
    - [Excluding Archive Files](#excluding-archive-files)
    - [Running Incremental Updates](#running-incremental-updates)
12. [Reference Files](#reference-files)
13. [Troubleshooting](#troubleshooting)
14. [License](#license)

---

## What This Skill Does

The epistemic-mapper skill analyzes your codebase and documentation. It creates a single `EPISTEMIC-MAP.md` file. This file categorizes everything your project relies on into one of four quadrants:

- **Facts (Known Known)**: What you can prove with evidence
- **Questions (Known Unknown)**: What you know you don't know
- **Assumptions (Unknown Known)**: What the code relies on but nobody documented
- **Risks (Unknown Unknown)**: Blind spots found by looking at the whole picture

This is not a general-purpose documentation tool. It solves one specific problem. That problem is capturing tacit knowledge before a handoff. This happens when a prototype builder is about to leave. A new team needs to understand what is proven, what is guessed, and what has never been examined.

## When to Use This Skill

Use this skill when:

- Handing off a prototype to a production engineering team
- Onboarding new engineers to a project with sparse documentation
- Auditing project risks before a major milestone
- A contract has been signed and the original builder is leaving
- You need to inventory what's actually known vs. assumed
- Someone asks "what are our unknown unknowns?"

Do not use this skill for:

- General documentation generation (use a README generator instead)
- API reference docs (use JSDoc/TSDoc tools)
- Architecture diagrams (use `ARCHITECTURE.md`)
- Team process documentation (use `AGENTS.md`)

## The Four-Quadrant Model

```
                    HIGH CERTAINTY (validated)
                              |
          [ ASSUMPTIONS ]     |     [ FACTS ]
          Unknown Known       |     Known Known
          nobody wrote it     |     proven, cited
          down, but the       |     evidence
          code/docs rely      |
          on it               |
    ------------------------- + -------------------------
                              |
          [ RISKS ]           |     [ QUESTIONS ]
          Unknown Unknown     |     Known Unknown
          blind spots, found  |     explicit open
          only by looking     |     gaps, already
          across everything   |     flagged somewhere
                              |
                    LOW CERTAINTY (unvalidated)
```

Every observation passes through a three-question test:

1. **Is it backed by evidence?** → Fact (Known Known)
2. **Is the gap explicitly raised somewhere?** → Question (Known Unknown)
3. **Does the code rely on it without stating it?** → Assumption (Unknown Known)
4. **Only visible by synthesis across multiple sources?** → Risk (Unknown Unknown)

## Installation

This skill requires:

- Claude Code (CLI, desktop app, or web)
- Python 3.8+ (for the merge script)
- Access to your project's codebase and documentation

No additional dependencies are needed. The skill includes a standalone Python merge script. This script has no external package requirements.

## Usage

### Basic Usage

To create an epistemic map for your current project:

```bash
/epistemic-mapper
```

The skill will:
1. Discover documentation and code sources
2. Spawn parallel subagents to extract Facts, Questions, and Assumptions
3. Synthesize Risks across the findings
4. Generate `EPISTEMIC-MAP.md` in your project root

### With Interview Mode

If the original builder is still available for questions:

```bash
/epistemic-mapper --interview
```

This enables a short question phase after the initial extraction. The phase clarifies ambiguous findings.

## Output

The skill produces a single file: `EPISTEMIC-MAP.md`

This file contains:
- An executive summary
- Facts section (Known Known entries)
- Questions section (Known Unknown entries)
- Assumptions section (Unknown Known entries)
- Risks section (Unknown Unknown entries)
- An Epistemic Backlog with 3-5 prioritized action items

Example entry structure:

```markdown
### EM-014 · Billing assumes monthly cadence only, no annual plan branch...

Confidence: INFERRED
Category: business-scope
Severity: high
First seen: 2026-07-30
Evidence: `billing/scheduler.ts:full file`, `docs/pricing.md:plans table` (2 refs)

Billing assumes monthly cadence only, no annual plan branch exists.

**Why it matters:** Enterprise deals requesting annual billing cannot be accommodated as-is.

**Evidence notes:**
- `billing/scheduler.ts:full file` -- no annual-cadence branch
- `docs/pricing.md:plans table` -- monthly plans only
```

## How It Works

### Step 1: Source Discovery

The skill automatically discovers:

**Documentation sources**:
- `docs/`, `documents/`, `README.md`, and similar conventional locations
- Excludes `openspec/changes/archive/` (historical record, not current knowledge)
- Excludes other living documents (`CONSTRAINTS.md`, `JARGON.md`, `ARCHITECTURE.md`, `AGENTS.md`, `CLAUDE.md`) to avoid duplication

**Code sources**:
- Main source directories (`src/`, `lib/`, `app/`, etc.)
- Each top-level module treated as its own source

The skill reads existing living documents upfront. This seeds Known Knowns. It prevents restating validated facts.

### Step 2: Parallel Extraction

The skill spawns one subagent per source. The limit is 5 concurrent subagents per wave. Each subagent:
- Applies the Q1/Q2/Q3 quadrant test to everything in its source
- Reports Facts, Questions, and Assumptions with evidence citations
- Writes findings to `/tmp/epistemic-mapper/<source-id>.json`

Evidence is required. No evidence = no entry.

### Step 3: Correlation and Deduplication

The `merge_epistemic_map.py` script combines findings from all subagents:
- Assigns unique IDs (EM-001, EM-002, etc.)
- Normalizes category slugs using an alias table
- Collapses duplicates across sources
- Assigns confidence tiers:
  - **CONFIRMED**: Two or more independent sources agree
  - **INFERRED**: Single source, reasonably read
  - **CONFLICTING**: Sources disagree (both readings kept)

### Step 4: Risk Synthesis

A dedicated pass looks across all findings to identify systemic risks:
- Dependencies multiple modules assume without confirmation
- Single points of failure with no documented fallback
- Patterns common to failed handoffs that this project exhibits

Risks have no single evidence citation. They include a reasoning trail instead. The trail explains which observations point at the risk when taken together.

### Step 5: Backlog Generation

The script automatically generates an Epistemic Backlog with 3-5 action items, ranked by:
- Quadrant priority (Risks and Assumptions outrank Questions)
- Severity (high > medium > low)

The backlog appears directly in `EPISTEMIC-MAP.md` — no separate file.

## Understanding the Output

### Entry Structure

Every entry follows a four-paragraph format:

1. **Heading**: `### <id> · <truncated statement>`
2. **Metadata block**: Confidence, Category, Severity, First seen, Evidence/Sources
3. **Statement**: The full finding
4. **Impact**: Bolded "Why it matters" explanation
5. **Evidence/Reasoning**: Citations (for Facts/Questions/Assumptions) or reasoning trail (for Risks)

### Confidence Tiers

- **CONFIRMED**: Multiple independent sources agree. Treat this as validated.
- **INFERRED**: Single source. This is a reasonable interpretation but not confirmed.
- **CONFLICTING**: Sources disagree. Both readings are preserved. This requires investigation.

### Category Slugs

Five canonical categories (the merge script normalizes aliases automatically):

| Category | What it covers |
|----------|----------------|
| `architecture-technical` | Infrastructure, system design, technical decisions |
| `product-user` | User-facing features, UX, customer behavior |
| `business-scope` | Contracts, commitments, revenue, commercial terms |
| `team-process` | Workflows, operational procedures, internal coordination |
| `vendor-external-dependency` | Third-party services, integrations, external APIs |

The category answers "where does the consequence land," not "what kind of thing is this."

## Living Document Behavior

Other living documents accumulate. `EPISTEMIC-MAP.md` is different. It is supposed to shrink. On re-runs, entries can be:

### Promotions

When new evidence validates an Assumption or answers a Question:
- Entry moves to a higher-certainty quadrant
- Gains a `History (DATE): was -> became — reason` line
- All history preserved (additive, not overwritten)

### Resolutions

When a Question is answered or a Risk is fixed:
- The entry is marked `resolved` with a note
- The entry is not deleted. Institutional memory of what used to be uncertain has value.

### Dismissals

When a Risk is investigated and found not to apply:
- Marked `dismissed` with the reasoning kept
- Preserves the decision for future reference

A flat or growing unresolved count means the handoff is not progressing. The executive summary states this plainly.

## Relationship to Other Living Documents

`EPISTEMIC-MAP.md` works alongside:

- **`CONSTRAINTS.md`**: Externally-imposed hard limits
- **`JARGON.md`**: Term definitions
- **`ARCHITECTURE.md`**: Structural decisions
- **`AGENTS.md`/`CLAUDE.md`**: Agent behavior

Key differences:
1. **Don't duplicate**: If a Known Known is already in `CONSTRAINTS.md`, reference it instead of restating
2. **Confidence matters**: A claim backed by `CONSTRAINTS.md` is `CONFIRMED` by default
3. **Shrinkage is success**: Other docs grow; this one should shrink as uncertainty resolves

After the skill generates `EPISTEMIC-MAP.md`, it offers to add a cross-reference. The reference is added to `AGENTS.md` or `CLAUDE.md` if either file exists.

## Advanced Usage

### Excluding Archive Files

By default, `openspec/changes/archive/` is excluded. This directory contains historical record, not current knowledge. To scan specific archive files explicitly:

1. The user must name them in the initial request
2. The skill will include only those named files

### Running Incremental Updates

On subsequent runs, the merge script:
- Parses existing `EPISTEMIC-MAP.md` to preserve state
- Merges new findings against prior entries
- Tracks promotions, resolutions, and dismissals
- Maintains all history lines (never overwritten)

Simply invoke the skill again:

```bash
/epistemic-mapper
```

The script handles incremental updates automatically.

## Reference Files

The skill includes several reference documents (located in `references/`):

- **`schema.md`**: JSON structure for findings files and category alias table
- **`quadrant-test.md`**: Worked examples for each quadrant with redirect table
- **`template.md`**: Full `EPISTEMIC-MAP.md` skeleton for new files

## Troubleshooting

### "Relative path refused" error

The merge script requires absolute paths. If you see this error:
- Check that findings files use absolute paths (`/tmp/epistemic-mapper/...`)
- Ensure `--output-dir` is an absolute path

### Entries not appearing in output

Check:
1. Does the entry have evidence citations? (Required for Facts/Questions/Assumptions)
2. Does the Risk entry have a reasoning trail? (Required for Risks)
3. Is the category slug recognized? (See `references/schema.md` for valid categories)

### Parse error on re-run

If the merge script refuses to parse an existing `EPISTEMIC-MAP.md`:
- The file was hand-edited
- The format does not match what the script expects
- Restore the file from git or regenerate from scratch

**Never hand-edit `EPISTEMIC-MAP.md`**. All changes must go through the merge script.

### Confidence tier not upgrading to CONFIRMED

For an entry to be marked `CONFIRMED`:
- Two or more independent sources must state the same observation
- Statement similarity must exceed 82% threshold
- Sources must be from different files/modules

## License

Apache-2.0

---

**Note**: This skill depends on parallel subagent execution for efficiency. When subagents are unavailable, extraction runs inline. This can take longer for large codebases.