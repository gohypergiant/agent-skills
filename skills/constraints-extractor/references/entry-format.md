# Entry Format

The `CONSTRAINTS.md` entry grammar — what `merge_constraints.py`
renders and parses. Read this once per run; for JSON input shapes,
shape tolerance, or merge script behavior, see
`references/troubleshooting.md` instead — that's only needed if a
run actually fails.

Every entry under a category section in `CONSTRAINTS.md` follows this
shape -- this is what `merge_constraints.py` renders and parses, so
hand-edits must stick to it exactly. The grammar is line-oriented: each
metadata field is `Key: value` on its own line, terminated by a blank
line. No field spans multiple lines except the body prose and
`Evidence notes`.

```markdown
### CONSTR-<CATEGORY>-<NNN> · <Short title>

Confidence: CONFIRMED
Category: <canonical category slug>
Affects: <comma-separated bare tokens -- omit line if none>
Enforced-by: <comma-separated bare tokens -- omit line if none>
Evidence: <file:line-spec>, <file:line-spec>, ... (N refs)

<Statement -- one or two self-contained sentences. Must read correctly on
its own, without the source file open.>

**Why it matters:** <one to three sentences of practical impact -- what
this constrains, what decisions it should shape, what breaks if it's
ignored.>

**Evidence notes:**
- `<file:line-spec>` -- <what this citation shows, one line>
- `<file:line-spec>` -- <what this citation shows, one line>
```

### Field rules

- **ID** (`CONSTR-<CATEGORY>-<NNN>`): assigned once by `merge_constraints.py`,
  never by extraction or correlation, never reused, never changed on
  retitle. `<CATEGORY>` is the uppercase ID tag for the entry's category
  (see the table below -- it is *not* the same string as the lowercase
  `Category:` field). `<NNN>` is a zero-padded 3-digit sequence, scoped
  per category, first-free-number on creation. This ID is the only stable
  identifier -- `Enforced-by` backlinks and any cross-file reference must
  point to it, never to the title text.

- **Title**: free text after the `·` (middle dot, U+00B7) separator. Safe
  to edit; carries no machine meaning.

- **Confidence**: exactly one of `CONFIRMED` or `CONFLICTING`. No other
  values -- there is no third "unconfirmed" tier. A single-source finding
  is `CONFIRMED`; the strength of that confirmation is visible directly
  in the `Evidence` line's ref count, not encoded as a separate category.
  `CONFLICTING` entries use the alternate body shape below instead of
  `Why it matters` / `Evidence` / `Evidence notes`.

- **Category**: the canonical lowercase slug, matching the slug used
  elsewhere in the skill. Must agree with the entry's ID tag (mapped
  through the table below) -- if they diverge, that's a bug, not a
  stylistic choice.

- **Affects / Enforced-by**: comma-separated bare tokens (AMA IDs, rule
  IDs, file paths -- whatever the referenced system uses), and *nothing
  else* on the line. No inline explanation, no trailing clause. If a
  token needs explaining, that explanation belongs in `Why it matters` or
  an `Evidence notes` bullet, not appended to the list. Omit the line
  entirely if there's nothing to list -- don't write `Affects: none`.

- **Evidence** (single line, coarse index): comma-separated
  `file:line-spec` groups, where `line-spec` is either a single line
  number (`37`) or an inclusive range (`8-11`). Multiple ranges from the
  same file are separate comma-separated groups, each repeating the
  filename (`file.md:8-11, file.md:37` -- not `file.md:8-11,37`). Always
  end the line with `(N refs)`, where N is the count of comma-separated
  groups. This line is for machine indexing -- how many sources, where --
  not for explaining what any citation shows.

- **Evidence notes** (bullet list): exactly one bullet per citation group
  from the `Evidence` line, same order, each giving the one-line reason
  that citation supports the statement. This list must have the same
  number of bullets as the `Evidence` line's `(N refs)` count -- a
  mismatch is a defect to fix during merge, not a stylistic variance.

### CONFLICTING entries

Replace `Confidence: CONFIRMED` through the `Evidence:` line, and the
`Why it matters` / `Evidence notes` blocks, with:

```markdown
Confidence: CONFLICTING
Category: <canonical category slug>
Claims: <N>

**Claim A:** <short claim text, one line>
— `<file:line-spec>`

**Claim B:** <short claim text, one line>
— `<file:line-spec>`
```

`Claims: N` must equal the number of `**Claim <letter>:**` lines present
-- treat a mismatch as a merge defect. Use additional `**Claim C:**` etc.
if more than two sources disagree, lettered sequentially. A `CONFLICTING`
entry has no `Why it matters` section -- the unresolved tension is the
content; don't editorialize about which claim is more likely correct.

### Category ID tags

The uppercase segment in an entry's ID. Chosen once -- changing a tag
would orphan every existing ID using it, so treat this table as
append-only in practice.

| Category slug | ID tag |
|---|---|
| `compliance-governance` | `COMPLY` |
| `security-privacy-ip-cui` | `SEC` |
| `hosting-infrastructure` | `INFRA` |
| `tooling-approved-path` | `TOOL` |
| `workflow-sequencing` | `FLOW` |
| `stakeholder-executive` | `STAKE` |
| `scope-prioritization-delivery` | `SCOPE` |
| `external-dependencies` | `DEPS` |

### Worked example

```markdown
### CONSTR-FLOW-001 · Outbound communications require human confirmation

Confidence: CONFIRMED
Category: workflow-sequencing
Affects: AMA-18, AMA-19, AMA-22, AMA-42, AMA-45, AMA-46
Enforced-by: AMA-04
Evidence: 07_ama_by_category.md:8-11, 07_ama_by_category.md:37, 07_ama_by_category.md:78, 07_ama_by_category.md:81-82 (4 refs)

All outbound communications (broadcast, transmit, send) must have
Human-in-the-Loop Confirmation (HCR=yes) requiring draft-and-hold pattern
before transmission.

**Why it matters:** Prevents unauthorized communications to external
systems and command networks. Without this constraint, automated systems
could broadcast tactical orders, ROE changes, or engagement commands
without human authorization.

**Evidence notes:**
- `07_ama_by_category.md:8-11` -- all broadcast/transmit actions explicitly marked HCR=yes
- `07_ama_by_category.md:37` -- 'held for [role] approval' language
- `07_ama_by_category.md:78` -- 'held for [role] approval' language
- `07_ama_by_category.md:81-82` -- 'held for [role] approval' language
```

Note that every one of the 4 refs in the `Evidence` line has its own
`Evidence notes` bullet -- a citation group folded into a neighboring
bullet, or a ref count that doesn't match the bullet count, is a merge
defect per the field rules above, not a formatting choice.

### Parsing grammar, pinned down

Two places this grammar has room to be read two ways if left implicit:

1. **Field-line detection.** A line is metadata if and only if it matches
   `^[A-Z][a-zA-Z-]*: ` at the start of the block immediately following
   the header, before the first blank line. This excludes
   `**Why it matters:**` (bold-wrapped, not a bare key) from being
   mistaken for a metadata field.
2. **Omitted optional fields.** `Affects` and `Enforced-by` are the only
   lines allowed to be absent. `Confidence`, `Category`, and `Evidence`
   (or `Claims` for a `CONFLICTING` entry) are mandatory -- a finding
   missing one of these fails validation rather than silently parsing as
   empty.
