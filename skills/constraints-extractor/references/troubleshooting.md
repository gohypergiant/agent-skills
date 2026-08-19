# Troubleshooting

Only needed if a `merge_constraints.py` run fails or produces
something unexpected — the JSON shapes extraction and correlation
produce, the shape-tolerance layer that coerces common drift, and
the merge script's exact behavior. For the `CONSTRAINTS.md` entry
grammar itself, see `references/entry-format.md`.

## Per-subagent scratch file (per-document extraction step)

Each subagent writes one JSON file to an **absolute path** inside the
run's scratch directory -- never a relative filename, and never anywhere
inside the repository being scanned:

```
mktemp -d "/tmp/constraints-extractor.XXXXXX"
# e.g. /tmp/constraints-extractor.a1b2c3/docs-SECURITY-md.json
```

Shape:

```json
{
  "source": "docs/SECURITY.md",
  "constraints": [
    {
      "title": "CUI compute environment",
      "statement": "This repository processes CUI; all compute must run in an environment authorized for CUI handling.",
      "impact": "Any hosting or CI/CD choice that can't run in a CUI-authorized environment is disqualified regardless of cost or convenience.",
      "category": "security-privacy-ip-cui",
      "confidence": "CONFIRMED",
      "affects": [],
      "enforced_by": [],
      "evidence": [
        { "file": "docs/SECURITY.md", "location": "14-16", "note": "explicit CUI handling requirement stated in the data classification section" }
      ]
    }
  ],
  "near_misses": [
    {
      "title": "Package manager choice",
      "reason": "No named external enforcer or cost found -- reads as team preference, not a constraint.",
      "redirect_to": "config.yaml"
    }
  ]
}
```

`category` is one of the eight canonical slugs (see the ID tag table
above). `location` should be a line number or an inclusive range where
the source has real line numbers -- for prose documents without stable
line numbers, a short section anchor is an acceptable fallback, but a
numeric line-spec is preferred whenever the source supports it. `note` is
required per evidence item -- it becomes that citation's `Evidence notes`
bullet; a missing note renders as an explicit `<!-- TODO -->` placeholder
rather than being silently blank, so gaps stay visible. `affects` and
`enforced_by` are lists of bare tokens (or a comma-separated string --
both are accepted, see "Shape tolerance" below); omit or leave empty if
there's nothing to list.

`impact` is required whenever a `CONFIRMED` constraint is included --
it's the field that keeps entries from being just metadata with no
substance. If a subagent can't articulate why a candidate matters
practically, that's usually a sign it's a near-miss, not a constraint.

`near_misses` exist only to populate the interactive preview before
writing -- they are never rendered into `CONSTRAINTS.md` itself. Don't
persist them anywhere beyond the scratch/findings files for this run.

### CONFLICTING findings

A subagent doing per-document extraction never produces a `CONFLICTING`
finding directly -- conflict only exists in relation to another source,
which a single-document subagent can't see. Conflicts are detected during
the correlation step, which combines two or more `CONFIRMED` findings
into one `CONFLICTING` finding:

```json
{
  "title": "Deployment region",
  "confidence": "CONFLICTING",
  "category": "hosting-infrastructure",
  "affects": [],
  "enforced_by": [],
  "claims": [
    { "statement": "Commercial cloud regions are prohibited for CUI-tagged workloads.", "file": "rfd/0004-fedramp.md", "location": "3" },
    { "statement": "us-east-1 is approved for all workloads per the 2024 infra review.", "file": "ARCHITECTURE.md", "location": "6" }
  ]
}
```

`claims` needs at least 2 items, each with its own `statement`, `file`,
and `location`. More than 2 is fine if more than two sources disagree.

## Correlated findings file (single correlation pass; input to merge_constraints.py)

Written to `<scratch-dir>/correlated-findings.json` -- same absolute-path
rule as above, always inside the run's `/tmp` scratch directory, never a
bare relative filename. A relative filename resolves against the agent's
current working directory, which is the repo being scanned, not `/tmp` --
this is exactly how stray `constraints_extraction_*.json` files ended up
committed-adjacent in a production run.

Same shape as the scratch files above: a flat `{"constraints": [...],
"near_misses": [...]}`, never grouped by category as top-level keys.
`constraints[].evidence` may contain more entries after correlation, as
duplicate citations across sources get merged (deduped, not summed).

## Shape tolerance

Produce the shapes documented above -- they're what SKILL.md specifies,
and what a human hand-editing an entry expects. That said,
`merge_constraints.py` tolerates real-world drift rather than hard-failing
on it, because extraction and correlation have drifted from the exact
schema more than once in production, in different ways each time:

- Field names: `name`/`constraint`/`heading`/`label` in place of `title`;
  `description`/`text`/`content`/`claim`/`rule` in place of `statement`;
  `why_it_matters`/`why`/`rationale`/`significance` in place of `impact`;
  `citations`/`sources`/`references` in place of `evidence` as the list's
  key name; `related`/`affected`/`impacts` in place of `affects`.
- Missing title: if none of the aliases above are present either, a title
  is derived from the first sentence of `statement` (or `claims[0]`'s
  statement for a `CONFLICTING` finding), truncated to 80 characters at a
  word boundary. This only fires when there's real statement text to work
  from -- a finding with no title *and* no statement still fails
  validation rather than getting an invented title.
- Evidence items: a plain string is accepted and split into
  `file`/`location`, with an optional inline note after a ` -- `, ` | `,
  or em-dash separator (`"docs/SECURITY.md:12 -- explicit CUI
  requirement"`). A dict is accepted with `path`/`source`/`doc` as
  aliases for `file`, `section`/`anchor`/`loc`/`line`/`lines` for
  `location`, and `explanation`/`why`/`shows`/`detail` for `note`.
- Evidence shape: a bare string, a single dict, or a list of either is
  accepted for the `evidence` field as a whole -- not just a list of
  dicts. A subagent that produced one comma-joined citation string
  instead of an actual array still gets split correctly.
- Affects / Enforced-by: a comma-separated string is accepted in place of
  an actual list.
- CONFLICTING findings: `claims` is accepted as a single object and
  wrapped into a one-item list -- a plausible shape for a subagent to
  produce before it has two sides to compare.

Every promotion is reported on success (`Auto-corrected field
names/shapes...`), never applied silently -- treat that output as a
signal to fix the source, not as an all-clear to ignore. This tolerance
covers naming and shape variation only. It never invents content: a
finding still needs an actual title, statement (or claims), and evidence
value somewhere under one of the accepted names, or it fails validation
with the exact keys it found, so the mismatch is diagnosable directly
from the error.

## merge_constraints.py CLI

```bash
python3 scripts/merge_constraints.py \
  --target <absolute path to CONSTRAINTS.md> \
  --findings <absolute path to correlated-findings.json under /tmp>
```

Both paths must be absolute. `--findings` in particular: the script
refuses to run with a relative path, since a relative path resolves
against the repo being scanned, not `/tmp`.

This is not optional tooling advice -- every write to CONSTRAINTS.md,
including a single-entry update, goes through this script. Hand-formatting
an entry produces structure the parser can't reliably read back on the
next run, and is how ad hoc formatting ends up in the file.

Behavior:
- Validates every finding independently: `title` and a valid `confidence`
  are always required; a `CONFIRMED` finding additionally needs
  `statement`, `impact`, and at least one `evidence` entry; a
  `CONFLICTING` finding needs at least 2 `claims`, each with its own
  `statement` and `file`. **A finding that fails validation is skipped,
  not fatal** -- every other valid finding in the same run still gets
  written. Only document-level problems (invalid JSON, a missing
  `constraints` key, a bad path) block the whole write, since there's
  nothing to salvage there.
- Assigns a stable `CONSTR-<TAG>-<NNN>` ID to every new entry, scoped per
  category, first-free-number. An existing entry (matched by category +
  normalized title) keeps its ID forever, even across retitles in a later
  run -- the ID is looked up once and never regenerated.
- Normalizes each finding's `category` against the eight canonical slugs:
  exact match first, then a small alias table for common variants, then
  fuzzy matching. A finding whose category still can't be resolved is
  skipped like any other validation failure.
- If `--target` doesn't exist, starts from `references/template.md`.
- If it exists, parses existing `### CONSTR-...` entries per category
  section into memory before merging -- never operates as a blind text
  append.
- On a match (same category + normalized title), merges evidence
  (deduped by file+location) and keeps the existing hand-edited
  `statement`/`impact` as authoritative rather than overwriting them from
  a re-scan.
- New findings with no match are inserted with the next free ID,
  alphabetized by ID within their category section (which is effectively
  creation order, since IDs are assigned sequentially).
- `near_misses` are accepted on the CLI only to keep the schema consistent
  with the scratch files -- the script does not render them anywhere.
  They exist for the orchestrating agent to show in the pre-write
  preview, nothing else.
- Rewrites the file deterministically from the parsed-and-merged
  structure -- running twice with the same findings file produces no
  diff.
