# constraints-extractor

Extract explicit and implicit constraints from project documentation. Synthesize them into a canonical CONSTRAINTS.md file.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What is constraints-extractor?](#what-is-constraints-extractor)
- [Why constraints-extractor?](#why-constraints-extractor)
- [How It Works](#how-it-works)
  - [Discovery Phase](#discovery-phase)
  - [Extraction Phase](#extraction-phase)
  - [Correlation Phase](#correlation-phase)
  - [Writing Phase](#writing-phase)
- [Constraint Categories](#constraint-categories)
- [Output Format](#output-format)
- [The Forcing-Function Test](#the-forcing-function-test)
- [Examples](#examples)
- [Integration with Living Documents](#integration-with-living-documents)
- [Reference Files](#reference-files)
- [License](#license)

## Installation

```bash
<Install location and instructions TBD>
```

## Quick Start

Invoke it with this command:

```bash
/constraints-extractor docs/*.md
```

An agent can also invoke it automatically. Mention constraints, compliance boundaries, or externally-imposed project limits in your request.

The skill does four things:

1. Scans documentation in conventional locations
2. Extracts externally-imposed boundaries with the forcing-function test
3. Generates or updates CONSTRAINTS.md with categorized findings
4. Previews all findings before it writes

You get a structured CONSTRAINTS.md file. It is organized into eight categories. Each constraint has evidence citations.

## What is constraints-extractor?

constraints-extractor is a skill that builds a living record of externally-imposed boundaries. These boundaries shape what a project can build and how.

The skill scans project documentation. It applies a forcing-function test to identify real constraints. It does not capture preferences. Then it synthesizes the constraints into a canonical CONSTRAINTS.md file.

The skill distinguishes constraints from choices. A constraint has an external enforcer. Examples: legal counsel, a compliance auditor, a paying customer's contract, an executive decision. When you violate a constraint, it costs something outside the codebase. Examples: a fine, a breach, a contract termination, a failed audit.

## Why constraints-extractor?

Most projects mix constraints with preferences. Team standards get written down the same way as compliance requirements. Architectural choices get written down the same way as customer contract terms. When a developer asks "can we change this?", the answer depends on one thing. Is "this" a constraint or a preference? That distinction is rarely explicit.

**Without explicit constraint documentation:**

- Developers waste time. They propose changes that violate non-negotiable boundaries.
- Compliance requirements get buried in prose. They are scattered across multiple docs.
- Stakeholder decisions fade from memory. Teams turn over.
- External dependencies surprise you mid-sprint.

**With constraints-extractor:**

- **Separates constraints from choices**: The forcing-function test distinguishes external boundaries from internal preferences.
- **Evidence-backed entries**: Every constraint cites its source. Citations include file and line references.
- **Conflict detection**: The skill surfaces disagreements between sources. It does not pick a winner.
- **Categorized by enforcer**: Eight categories make it easy to find compliance, security, hosting, or stakeholder constraints.
- **Living document**: A deterministic merge script preserves hand-edits. It also incorporates new findings.

If your project has compliance requirements, customer contracts, security boundaries, or executive priorities, use this skill. It prevents constraints from getting lost in documentation sprawl.

## How It Works

The skill follows a four-phase workflow. It processes documentation in parallel. It correlates findings. It merges them deterministically.

### Discovery Phase

The skill assembles the source document set before it extracts anything.

**Auto-discovered locations:**

- Documentation directories: `docs/`, `documents/`, `doc/`
- Standard files: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `COMPLIANCE.md`
- Decision records: `adr/`, `decisions/`, `rfd/`, `rfcs/`, `notes/`, `spikes/`
- Living documents: `ARCHITECTURE.md`, `AGENTS.md`, `CLAUDE.md`, `openspec/config.yaml`
- Existing `CONSTRAINTS.md` (if present)

**User-provided additions:**

- Specific files or paths you name explicitly
- Individual archive files from `openspec/changes/archive/` (the full archive is skipped by default)

The skill announces the full list before it proceeds. You can verify the scope.

### Extraction Phase

The skill dispatches one subagent per source document. Subagents run in parallel waves. Each wave has up to 5 concurrent subagents.

Each subagent does this:

1. Reads its assigned file completely
2. Applies the forcing-function test to every rule, limit, or boundary statement
3. Extracts structured findings with these fields:
   - **Statement**: self-contained constraint description
   - **Impact**: what breaks if this is ignored
   - **Category**: one of eight canonical categories
   - **Evidence**: citations with file, location, and explanatory notes
   - **Confidence**: CONFIRMED (single source) or CONFLICTING (sources disagree)
4. Flags near-misses (statements that look like constraints but fail the test)
5. Writes findings to a scratch file under `/tmp/constraints-extractor.XXXXXX/`

Near-misses are shown in the preview step. They are never written to CONSTRAINTS.md.

### Correlation Phase

After all subagents complete, one reduce pass runs. It does this:

1. Groups candidates by category
2. Merges duplicates (the same underlying constraint from multiple sources)
3. Surfaces conflicts (incompatible claims about the same boundary)
4. Writes correlated findings to `/tmp/constraints-extractor.XXXXXX/correlated-findings.json`

This runs once per extraction. It does not run once per wave. Cross-document duplicates matter. It does not matter which wave they came from.

### Writing Phase

The skill uses `scripts/merge_constraints.py` for all file operations:

```bash
python3 scripts/merge_constraints.py \
  --target <absolute path to CONSTRAINTS.md> \
  --findings <absolute path to correlated-findings.json>
```

The merge script does this:

- Assigns stable `CONSTR-<CATEGORY>-<NNN>` IDs to new entries
- Preserves hand-edited statements and impact text
- Deduplicates evidence citations
- Maintains category grouping and alphabetical ID order
- Runs idempotently (same input produces no diff)

A finding that fails validation is skipped individually. It is not fatal. The script reports what was written and what was skipped. It gives reasons.

## Constraint Categories

The skill organizes constraints into eight categories. Categories are organized by enforcer type. Each entry uses the lowercase category slug in its metadata. Each entry uses the uppercase ID tag in its identifier.

| Category | ID Tag | What It Covers |
|----------|--------|----------------|
| Compliance & Governance | `COMPLY` | Regulatory frameworks, audit requirements, certification obligations (SOC2, FedRAMP, ISO 27001, HIPAA) |
| Security, Privacy, IP & CUI | `SEC` | Data classification requirements, handling rules for controlled or sensitive information, IP ownership boundaries |
| Hosting & Infrastructure Boundaries | `INFRA` | Deployment environments, regions, or platforms the project is required to use (not merely chosen) |
| Tooling & Approved-Path Restrictions | `TOOL` | Software, services, or registries the project is required or forbidden to use, from outside engineering preference |
| Workflow & Sequencing Requirements | `FLOW` | Ordering or gating requirements imposed by an outside party, distinct from internal process |
| Stakeholder & Executive Expectations | `STAKE` | Decisions or priorities set by leadership or stakeholder with authority over scope |
| Scope, Prioritization & Delivery Boundaries | `SCOPE` | Explicit out-of-scope declarations, delivery deadlines, or budget/resource ceilings set externally |
| External Dependencies | `DEPS` | Dependencies on other teams, vendors, or third-party systems whose timeline or behavior constrains this project |

See `references/category-guide.md` for detailed category definitions. It has in-scope and out-of-scope examples. It has the forcing-function test worked through with real cases.

## Output Format

Every entry in CONSTRAINTS.md follows this structure:

```markdown
### CONSTR-<CATEGORY>-<NNN> · Short title

Confidence: CONFIRMED
Category: <canonical category slug>
Affects: <comma-separated tokens>
Enforced-by: <comma-separated tokens>
Evidence: <file:line-spec>, <file:line-spec> (N refs)

<Self-contained statement in one or two sentences.>

**Why it matters:** <Practical impact. What this constrains. What decisions it shapes. What breaks if ignored.>

**Evidence notes:**
- `<file:line-spec>` -- <what this citation shows>
- `<file:line-spec>` -- <what this citation shows>
```

**CONFLICTING entries** replace the standard format with this:

```markdown
### CONSTR-<CATEGORY>-<NNN> · Short title

Confidence: CONFLICTING
Category: <canonical category slug>
Claims: <N>

**Claim A:** <short claim text>
— `<file:line-spec>`

**Claim B:** <short claim text>
— `<file:line-spec>`
```

The ID is assigned once. It never changes, even if the title is edited later. Cross-references must point to the ID. Do not point to the title text.

See `references/schema.md` for the complete entry format grammar. It also has the JSON shape the merge script expects.

## The Forcing-Function Test

A constraint is a boundary that holds regardless of team consensus. Something outside engineering judgment enforces it. Apply two questions to any candidate statement:

**Question 1: Is there an external enforcer?**

Examples of external enforcers: legal counsel, a compliance auditor, a security team, a paying customer's contract, an executive, a vendor's API limits, a regulator. If the only enforcer is "the team agreed to do it this way," the candidate fails here.

**Question 2: Does violating it cost something outside the codebase?**

Examples of external costs: a fine, a breach, a contract termination, a failed audit, a blown deadline the business already committed to externally, a vendor integration silently breaking. If the cost is purely "the code looks inconsistent" or "a teammate will be annoyed," the candidate fails here.

A candidate needs a yes answer on both questions to qualify as a constraint. One yes and one no is a near-miss.

**Worked example:**

"We use `pnpm`, never `npm`."

- No external enforcer (this is a team preference)
- No external cost (inconsistency, not a broken contract)
- **Near-miss**: redirect to `openspec/config.yaml`

"External registry access is blocked by network policy. Only `pnpm`'s offline cache is permitted."

- External enforcer: network policy and security policy
- External cost: builds fail outside the permitted path
- **Constraint**: belongs in CONSTRAINTS.md under Tooling & Approved-Path Restrictions

Near-misses are shown in the preview step. They include their redirect target (config.yaml, AGENTS.md, ARCHITECTURE.md). They are never written to CONSTRAINTS.md.

## Examples

### Basic Usage

```
Extract constraints from this project
```

The skill scans conventional locations. It presents findings:

```
Scanning 8 documents across 2 waves of up to 5 subagents each:
[docs/SECURITY.md, docs/COMPLIANCE.md, README.md, ARCHITECTURE.md,
 AGENTS.md, openspec/config.yaml, adr/0004-fedramp.md, adr/0007-deployment.md]
```

After extraction and correlation, you see a preview:

```
Found 6 new constraints:
- SEC: CUI compute environment (1 ref)
- INFRA: GovCloud-only deployment (2 refs)
- COMPLY: SOC2 CC8.1 security review (1 ref)
- FLOW: Client approval before auth changes (1 ref)
- STAKE: Public beta by Q3 (1 ref)
- DEPS: Billing API rate-limit increase Q2 (1 ref)

Near-misses (not written to CONSTRAINTS.md):
- "We use Biome, never ESLint" → redirect to AGENTS.md (team preference)
- "Deployed on AWS ECS" → redirect to ARCHITECTURE.md (current choice, no mandate)

Does this look right? Anything to reclassify, merge, or drop before I write it?
```

### Updating an Existing CONSTRAINTS.md

```
Check for new constraints in docs/SECURITY.md
```

The skill reads the existing CONSTRAINTS.md first. Then it merges only new findings:

```
docs/CONSTRAINTS.md exists. Reading it first to merge new findings.

Scanning 1 document:
[docs/SECURITY.md]

Found 2 new constraints:
- SEC: PII handling procedures (1 ref)
- TOOL: Approved dependencies list enforcement (1 ref)

Existing constraint updated:
- SEC: CUI compute environment (evidence ref count: 1 to 3)

Does this look right?
```

The skill confirms before it writes. Hand-edited statements and impact text are preserved.

### Including Archive Files

```
Extract constraints from docs/ and openspec/changes/archive/012-fedramp-deployment.md
```

The skill adds the named archive file to the auto-discovered set:

```
Scanning 9 documents across 2 waves:
[docs/SECURITY.md, docs/COMPLIANCE.md, docs/architecture.md,
 openspec/changes/archive/012-fedramp-deployment.md, ...]
```

By default, `openspec/changes/archive/` is skipped. It grows too large. Name specific archive files explicitly when they contain constraint rationale.

### Conflict Detection

If two sources disagree about the same boundary, the skill surfaces both claims. It does not pick a winner:

```
Found 1 CONFLICTING entry:
- INFRA: Deployment region
  Claim A: "Commercial cloud regions are prohibited for CUI-tagged workloads"
           (rfd/0004-fedramp.md:3)
  Claim B: "us-east-1 is approved for all workloads per the 2024 infra review"
           (ARCHITECTURE.md:6)

This needs human resolution. I will not pick a winner.
```

The CONFLICTING entry is written to CONSTRAINTS.md. Both claims are visible. It is flagged for resolution.

## Integration with Living Documents

After it writes CONSTRAINTS.md, the skill offers to add cross-references. It adds them to existing living documents.

**For `AGENTS.md` and `ARCHITECTURE.md`**:

```markdown
- **CONSTRAINTS.md**: Externally-imposed boundaries (compliance, security, hosting, stakeholder) that shape what this project can build and how.
  _(Check this before scoping any change with compliance, security, hosting, or stakeholder-priority implications — it is not optional background reading)_
```

The linking is one-directional. Other living documents point to CONSTRAINTS.md. CONSTRAINTS.md does not point back. The skill checks if each file already has a "Related Documentation" section. It checks if CONSTRAINTS.md is already referenced. Then it offers to append.

## Reference Files

The skill includes three reference documents:

- **`references/category-guide.md`**: The eight constraint categories. The forcing-function test worked through with examples. In-scope and out-of-scope table per category.
- **`references/template.md`**: The bare CONSTRAINTS.md skeleton used for new-file creation.
- **`references/schema.md`**: Entry format. JSON shape for scratch files. Merge script expectations. Only needed for troubleshooting.

Read `references/category-guide.md` before you run extraction. Read it if you want to understand how the forcing-function test is applied consistently.

## License

Apache-2.0
