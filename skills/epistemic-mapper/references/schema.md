# Schema

The JSON shapes subagents write to scratch files, and the shape
`scripts/merge_epistemic_map.py` expects. Needed for troubleshooting or if
you're hand-authoring findings instead of going through subagents.

## Table of Contents

1. Extraction wave output (per-subagent scratch file)
2. Risk synthesis output
3. Canonical category slugs and aliases
4. State file (`.epistemic-map-state.json`)

---

## 1. Extraction wave output (per-subagent scratch file)

Each source subagent writes one JSON file to an **absolute path** — never
relative — shaped like:

```json
{
  "source": "/absolute/path/to/payments/stripe-client.ts",
  "entries": [
    {
      "quadrant": "known-known",
      "category": "architecture-technical",
      "statement": "Payment processing is hardcoded to USD via Stripe.",
      "evidence": [
        {"source": "payments/stripe-client.ts", "location": "line 14", "detail": "currency: 'usd' literal, no config"},
        {"source": "payments.test.ts", "location": "test 'charges test card'", "detail": "passing, USD only"}
      ],
      "impact": "Any customer billed in a non-USD currency cannot be charged without a code change.",
      "confidence": "INFERRED"
    }
  ]
}
```

`quadrant` is one of: `known-known`, `known-unknown`, `unknown-known`.
(`unknown-unknown` only comes from the synthesis pass — see below.)

`evidence` is required for all three quadrants at this stage — at least one
entry, each with a `source` and a specific `location`, not just a filename.
An entry with no `evidence` array, or an empty one, fails validation.

`confidence` at extraction time is normally `INFERRED` (single source, this
subagent's own read). The merge step upgrades it to `CONFIRMED` if another
subagent's findings agree, or flags `CONFLICTING` if they contradict.

`severity` is optional — `high`, `medium`, or `low` — and defaults to
`medium` if omitted. It ranks an entry's position in the Epistemic
Backlog; it's most relevant on Risks and Assumptions, since those are what
`build_backlog()` prioritizes.

## 2. Risk synthesis output

The synthesis pass writes its own scratch file, shaped differently — no
`evidence`, a `reasoning` field instead, and it can reference multiple
sources at once:

```json
{
  "entries": [
    {
      "quadrant": "unknown-unknown",
      "category": "vendor-external-dependency",
      "statement": "The entire revenue path has a single point of failure: Stripe, USD, monthly billing, no fallback.",
      "reasoning": "payments/stripe-client.ts, billing/scheduler.ts, and docs/pricing.md each independently assume Stripe/USD/monthly with no error handling for a declined charge or vendor outage anywhere in the flow. No single file states this as a risk; it only appears when the three are read together.",
      "sources_considered": ["payments/stripe-client.ts", "billing/scheduler.ts", "docs/pricing.md"],
      "impact": "A Stripe outage or widespread card decline has no documented recovery path and would likely surface first in production.",
      "confidence": "INFERRED"
    }
  ]
}
```

A `reasoning` field with no `sources_considered` fails validation — a Risk
claim needs to point at what was synthesized, even without a single-line
citation.

## 3. Canonical category slugs and aliases

Extraction subagents will drift toward loose names. The merge script fuzzy-
matches against this alias table and normalizes to the canonical slug —
always show the canonical slug in output, never the loose input.

| Canonical slug | Aliases |
|---|---|
| `architecture-technical` | technical, architecture, infra, infrastructure, system |
| `product-user` | product, user, ux, customer, feature |
| `business-scope` | business, scope, contract, commercial, revenue |
| `team-process` | process, team, workflow, ops, operational |
| `vendor-external-dependency` | vendor, dependency, third-party, integration, external |

If a subagent's category doesn't fuzzy-match any of these, the merge script
flags it for manual review rather than silently dropping or misfiling it.

**Worked example — a Risk that doesn't fit neatly.** Three modules each
depend on the previous one shipping on schedule, with no slack built in
anywhere; a delay in the first cascades through all three. There's no
`schedule-cascade-risk` category, and there shouldn't be — that precision
belongs in the `statement`/`reasoning` text, not the category slug. Pick
based on where the consequence actually lands:

- If the cascading deadline is a commitment made to a customer or
  stakeholder (a contract date, a promised release), the consequence is
  external — use `business-scope`.
- If it's purely an internal sequencing problem (team B blocked on team A,
  no external party affected), the consequence is internal — use
  `team-process`.

Either way, the category is doing routing, not description. The actual
finding — "cascading schedule dependency across three modules with no
slack" — lives in the entry's own text, where it belongs.

## 4. State: parsed directly from `EPISTEMIC-MAP.md` itself

There is no separate state file and no frontmatter block. `EPISTEMIC-MAP.md`
is plain markdown, and `merge_epistemic_map.py` parses that same markdown
back in as state on the next run — the approach `constraints-extractor`
already uses. Nothing is stored twice.

Every entry follows the same four-paragraph shape, mirroring
`constraints-extractor`'s style: a short heading (id plus a truncated
title), a metadata block of labeled lines, the full statement, a bolded
"Why it matters" line, and a closing evidence or reasoning section.

```markdown
### EM-014 · Billing assumes monthly cadence only, no annual plan branch...

Confidence: INFERRED
Category: business-scope
Severity: high
First seen: 2026-07-30
History (2026-08-12): unknown-known -> known-known — validated by finance team
Evidence: `billing/scheduler.ts:full file`, `docs/pricing.md:plans table` (2 refs)

Billing assumes monthly cadence only, no annual plan branch exists.

**Why it matters:** Enterprise deals requesting annual billing cannot be accommodated as-is.

**Evidence notes:**
- `billing/scheduler.ts:full file` -- no annual-cadence branch
- `docs/pricing.md:plans table` -- monthly plans only
```

**Heading:** `### <id> · <statement, truncated to ~70 chars with "...">`. The
truncated title is cosmetic only — the full statement always comes from its
own paragraph below, never reconstructed from the heading.

**Metadata block** (order doesn't matter when parsing, but is rendered in
this order): `Confidence:`, `Category:`, `Severity:`, `First seen:`,
optionally `Status:` (only if not active), zero or more `History (DATE):
...` lines (every past transition, not just the latest — this is additive),
and finally either `Evidence: ... (N refs)` for Facts/Questions/Assumptions
or `Sources considered: path1, path2, ...` for Risks. The `Evidence:`
summary line is a derived convenience for scanning — it is not re-parsed on
the next run; the `Evidence notes:` bullets below are the actual source of
truth for evidence.

**Statement paragraph:** the finding itself, in full, as plain prose.

**`**Why it matters:**` paragraph:** the entry's `impact` field, on the
same line as the bold label.

**Closing section:** for every quadrant except Risk, `**Evidence notes:**`
followed by one bullet per citation:
`` - `<source>:<location>` -- <detail> ``. For Risks, `**Reasoning:**`
followed by the reasoning text as a plain paragraph.

**Delimiter rule:** `source` and `location` are wrapped in backticks and
joined by a single colon (`` `source:location` ``), so neither may contain
a literal backtick — `merge_epistemic_map.py` rejects any evidence item
that does, at validation time, rather than parsing it ambiguously.

On merge, new findings are matched against the entries parsed out of the
existing file by statement similarity (or explicit `id` if a subagent was
given one). A match with a changed quadrant appends a new `History (DATE):
...` line — all prior history lines stay, this is additive, not a
single-slot field that gets overwritten.

The rendered file **is** the state — there's no other source of truth to
fall out of sync with. If `EPISTEMIC-MAP.md` exists but doesn't match this
script's own output format exactly (a hand-edit, a heading missing a
metadata field, an old frontmatter-based file from a previous version of
this skill), `merge_epistemic_map.py` refuses to run rather than guessing
at prior state — see it as a hard stop, not something to route around.
