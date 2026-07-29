---
name: accelint-skill-prose
description: Use when creating, auditing, tightening, simplifying, de-slopping, polishing, or reviewing SKILL.md files, agent-skill instructions, CLAUDE.md/AGENTS-style guidance, or other behavior-defining prompt artifacts where wording changes can alter trigger coverage, workflow order, guardrails, or exact technical meaning. Make sure to use this skill whenever the user wants clearer skill prose without changing behavior, asks to rewrite a skill description safely, review prompt instructions for ambiguity, or preserve exact paths, commands, fields, identifiers, or approval semantics while editing.
license: Apache-2.0
metadata:
  author: accelint
  version: "0.4.0"
---

# Skill Prose

Edit behavior-defining prose carefully.

This skill is for text that does more than sound good. It defines when a skill triggers, what it promises, what order work happens in, and what must stay exact.

Use plain, direct English, but do not treat skill prose like ordinary prose. A cleaner sentence is a bad edit if it changes behavior.

Keep the same term for the same concept. Do not rotate terms just to avoid repetition. In skill prose, consistent wording is part of the behavior contract.

Borrow selectively from controlled-language disciplines such as Simplified Technical English when they improve clarity without changing behavior. Strong fits include consistent terminology, short explicit sentences, active voice by default, and clear separation between instructions and explanation. Do not import controlled-language rules mechanically when they would erase rationale, flatten scope, or weaken behavioral precision.

This skill extends general English-discipline editing with extra safety for:

- `SKILL.md` files
- frontmatter descriptions
- agent instructions
- prompt templates
- workflow guidance
- hard stops and guardrails
- exact technical references inside prose

The goal is: **improve clarity without changing trigger coverage, workflow semantics, guardrail strength, or exact technical meaning.**

Default to the **smallest safe rewrite**. If the safest edit is to leave wording alone, say so.

Behavioral drift is not limited to paths, fields, and quoted tokens. If verb choice changes what an agent is allowed to do, when it does it, or how strongly a rule applies, that verb is behavior-bearing and must be preserved or replaced with wording that keeps the same behavior.

Rationale is not automatically filler. If a sentence explains why a guardrail exists, why a checkpoint matters, or what risk a timing rule prevents, preserve that rationale unless the user explicitly asked to change the policy rather than tighten the prose.

## Untouchables

Leave these exact unless the user explicitly asks to change them:

- tool names
- file names and paths
- commands and flags
- field names and keys
- identifiers
- slash-joined references
- inline code and code blocks
- quoted errors and logs
- examples that define scope or expected behavior

These are behavior anchors, not decorative prose.

## What makes this different from general prose editing

In skill prose, these are often part of the behavior, not decoration:

- trigger phrases
- examples that define scope
- workflow order
- approval gates
- hard-stop wording
- file paths
- commands
- identifiers
- field names
- quoted text
- cross-references to other files or sections

Do not simplify these casually.

## Hard Stops

- **Never broaden trigger coverage silently.**
- **Never narrow trigger coverage silently.**
- **Never weaken a hard requirement into advice.**
- **Never reorder workflow steps when order affects behavior.**
- **Never paraphrase exact references just because the paraphrase sounds cleaner.**
- **Never remove an example if it defines scope, behavior, or edge-case coverage.**
- **Never return a polished rewrite that is behaviorally less safe than the source.**
- **Never slip a rewrite into audit-only mode.**

## Default Priority Order

When goals conflict, use this order:

1. Preserve trigger intent and scope
2. Preserve workflow semantics and approval logic
3. Preserve guardrails and hard-stop strength
4. Preserve exact technical references
5. Improve clarity, consistency, and actionability
6. Improve brevity

## Start by classifying the task

Choose the primary mode before editing.

### 1. Audit only

Use when the user wants review, risk analysis, or a check for ambiguity, drift, or weak wording.

In this mode, do not rewrite the text unless the user explicitly asks for a rewrite. Naming a safer alternative briefly inside a finding is acceptable only if it functions as evidence for the risk you identified, not as a stealth rewrite of the full passage.

### 2. Rewrite only

Use when the user wants a cleaner version and asks for final text directly.

### 3. Audit plus rewrite

Use when the user wants both findings and a safer revision.

### 3a. Minimal-touch rewrite

Use by default when the user asks for a narrow cleanup, typo fix, safer tightening, or exactness-preserving clarification. Preserve structure, examples, and phrasing that already carry behavior.

### 3b. Full rewrite

Use only when the user asks for broader restructuring or when the text has repeated clarity failures that cannot be fixed locally. Preserve behavior, but you may reorganize prose when the structure itself causes ambiguity.

### 4. Frontmatter description tightening

Use when the text controls triggering. Treat the description like compact behavioral logic, not like a marketing blurb.

### 5. Workflow or guardrail tightening

Use when the prose defines step order, approval dependencies, decision points, safety limits, or exact execution rules.

## Before you edit

Extract what must stay fixed.

First normalize vocabulary for the concepts that matter. Pick one term for each repeated concept and keep it throughout the edit. Common clusters include trigger / invoke / activate, audit / review / analyze, and field / key / property.

Look for:

- the exact task or artifact scope
- explicit trigger phrases
- user-requested boundaries
- workflow order
- approval gates
- hard requirements
- paths, commands, identifiers, fields, keys, flags, and examples
- quoted wording that must stay exact

If the request says to preserve trigger coverage, exact meaning, or specific tokens, raise the preservation threshold further.

## Core operating rules

### 1. Treat descriptions as trigger logic

Frontmatter descriptions are not just summaries. They help decide when the skill is used.

When tightening a description:

- preserve the same kinds of requests
- preserve scope-defining nouns and verbs
- preserve quoted trigger phrases unless the user asked to change them
- do not add adjacent trigger families unless expansion was explicitly requested
- do not convert a short description into a broad trigger inventory unless the user asked for that

If a phrase is doing trigger work, keep it or replace it only with wording that preserves the same scope exactly.

### 2. Treat workflow prose as executable guidance

If an agent followed only the rewritten text, it should behave the same way.

Separate procedural text from descriptive text when the distinction helps clarity. Procedural text tells the agent what to do. Descriptive text explains what something means, why a guardrail exists, or when a rule applies. Do not force descriptive or policy text into imperative form if that would change the behavior or make the constraint sound narrower than it is.

Check for:

- step order
- before/after timing
- approval dependencies
- conditions that gate an action
- warnings that explain why a step matters
- verbs that carry behavior, such as `stop`, `pause`, `wait`, `proceed`, `skip`, `require`, or `allow`

Do not merge steps or compress qualifiers if doing so hides decision points.
Do not swap a behavior-bearing verb for a near-synonym unless the new wording preserves the same permission, timing, and obligation level.

### 3. Preserve exact references exactly

Keep these exact unless the user explicitly asks otherwise:

- file names and paths
- commands and flags
- field names and keys
- identifiers
- slash-joined references
- rule labels
- quoted errors or logs
- inline code and code blocks

If the source names a specific token like `specs_touched/decisions`, keep that token exactly.

### 4. Preserve hard-stop strength

If the source contains words like `must`, `do not`, `never`, `required`, `critical`, or `important`, preserve the same obligation level.

When rewriting behavior-defining prose, normalize informal severity labels to RFC 2119 terms when possible. For example, rewrite `critical` to `MUST` or `REQUIRED` when the source expresses an absolute requirement, and rewrite `important` to `SHOULD` or `RECOMMENDED` when the source expresses a strong recommendation. Do not apply this mechanically to quoted text, exact tokens, or other untouchables that must stay exact.

A clearer version must preserve the same obligation level.

Bad pattern:

- `must` → `should`
- `do not` → `avoid`
- `required` → `recommended`

### 5. Prefer minimal safe tightening

If it is possible to cut a word out, cut it out — unless that word anchors trigger scope, differentiates the skill from adjacent skills, preserves a workflow step, or carries exact technical meaning.

Use direct English. Cut filler, stale phrasing, and avoidable abstraction.

But only remove words that are not carrying behavior.

Good edits:

- split long sentences without changing sequence
- move conditions before commands when the meaning stays the same
- replace inflated wording with concrete wording
- standardize repeated terms
- keep required nouns, verbs, subjects, and articles explicit rather than omitting them for brevity
- prefer active voice unless passive wording is necessary to preserve meaning or actor ambiguity
- remove extra framing when it adds no operational meaning

Bad edits:

- compressing away a trigger phrase
- replacing an exact field reference with a broader category
- deleting an example that anchors scope
- turning a bounded instruction into a generic best practice

### 6. Prefer "no rewrite" over risky rewrite

If the source is already clear enough and further tightening risks drift, say so.

Preserve trigger accuracy and workflow behavior over elegance. A clumsy instruction that works is better than a polished one that drifts.

A safe answer can be:

- a very small rewrite
- an audit with no rewrite
- a note that the wording is already near the minimum safe form

If the text is already compact, exact, and behaviorally clear, prefer an explicit no-rewrite recommendation over a cosmetic rephrase.

## Output rules by mode

For your own responses, you may borrow lightweight cognitive-load reduction patterns when they help the user act on the result. Good examples include numbered findings, explicit next steps, and brief progress-visible summaries. Do not let response-formatting choices override audit accuracy, and do not reshape source text just to make it feel more ADHD-friendly unless the user explicitly asked for that delivery style.

### Audit only

Use this structure:

1. **Summary** — 1 to 3 sentences
2. **Highest-risk issues first**
3. **Finding list** — category, source text, risk, and why it matters
4. **Optional safer alternative** — only at finding level, and only when it clarifies the issue without becoming a full rewrite
5. **Optional full rewrite** — only if the user asked for it

Focus first on:

- trigger drift risk
- workflow drift risk
- guardrail weakening
- exact-reference loss
- only then general clarity issues

Use calibrated obligation and severity language, not theatrics. Prefer RFC 2119 terms when describing the strength of a rule or rewrite recommendation, and use severity labels only when they help rank audit findings rather than define behavior. Reserve labels like `Critical` for issues likely to materially change agent behavior, trigger routing, workflow execution, approval handling, or safety boundaries.

### Rewrite only

If the user asks for only the rewrite, return only the rewrite.

Do not prepend audit notes or explanation unless the user asked.

### Audit plus rewrite

Give the risk summary first, then the rewrite.

## Progressive disclosure

Load references only when needed:

- `references/checklist.md` — final pass before delivery, output-mode compliance, and no-rewrite decisions
- `references/frontmatter-descriptions.md` — description tightening, trigger-family preservation, and trigger-scope safety
- `references/workflow-guardrails.md` — workflow, approval, rationale, verb-sensitivity, and exact-reference preservation
- `references/ste-compatible-rules.md` — selective Simplified Technical English patterns adapted for behavior-preserving prompt editing
- `references/rfc-2119.md` — normalize informal severity labels into RFC 2119 obligation terms without changing behavior strength
- `references/examples.md` — before/after examples for audit-only, no-rewrite, guardrails, and frontmatter-safe tightening

## Quick decision tests

Before you deliver, ask:

- Would the rewritten description still trigger for the same requests?
- Would an agent following the rewrite behave the same way?
- Did any requirement become softer?
- Did any exact token disappear?
- Did any behavior-bearing verb drift into a softer or different action?
- Did any rationale sentence get cut even though it explained a guardrail or timing rule?
- Did any example that defines scope get removed?
- Is the rewrite actually clearer, or just shorter?

If any answer is risky, revise less.

## Required self-check before delivery

This step is not optional.

1. Re-read the trigger or scope language. Would it still route the same real requests?
2. Search for terms you did not choose during vocabulary normalization. Replace accidental synonym drift.
3. Search for `MUST`, `REQUIRED`, `MUST NOT`, `SHOULD`, `RECOMMENDED`, `MAY`, `OPTIONAL`, `avoid`, `critical`, and `required`. Confirm obligation strength did not shift by accident. If you normalized severity labels, confirm the chosen RFC 2119 term matches the real requirement level rather than rhetorical emphasis.
4. Search for `this`, `it`, and `they`. Make sure each referent is clear in context.
5. Re-check every exact token, command, path, field name, identifier, example, and behavior-bearing verb that the source relied on.
6. Confirm that rationale sentences tied to guardrails, approval gates, or timing rules were preserved when they still carry policy meaning.
7. If the rewrite changed structure, ask whether an agent following only the new version would behave the same way.

## Limits

This skill is not a full Simplified Technical English enforcement pass, and it is not a general ADHD-friendly rewriting mode. Use compatible ideas from those disciplines selectively and subordinate them to behavior preservation.

This skill improves behavior-defining prose safely. It does not replace domain review.

If the user wants broad content strategy, new workflow design, or repo-wide policy changes, do not smuggle those changes in through prose cleanup. Surface them explicitly.

This skill does not impose arbitrary word-count limits, blanket modal bans, or creative-writing style rules. Use compact wording where it improves clarity, but preserve precision when precision is the behavior.
