---
name: accelint-skill-prose
description: Use when creating, auditing, tightening, simplifying, polishing, or reviewing `SKILL.md` files, agent-skill instructions, `CLAUDE.md` or `AGENTS.md` guidance, or other behavior-defining prompt artifacts whose wording controls trigger coverage, workflow order, guardrails, approval semantics, or exact technical meaning. Prefer this skill over general prose editing when the job is to make wording clearer without changing behavior, including safe description rewrites, ambiguity audits, and edits that must preserve exact paths, commands, fields, or identifiers. Do not use it when the main task is broader content strategy, policy design, domain review, or ordinary prose cleanup with no behavior risk.
license: Apache-2.0
metadata:
  author: accelint
  version: "0.8.1"
---

# Skill Prose

Use this skill to edit behavior-defining prose without changing behavior.

## Core contract

Use this skill for text whose wording controls behavior, not just tone. In these artifacts, wording controls when a skill triggers, what it promises, what order work happens in, and what must stay exact.

Write in plain, direct English. Do not treat skill prose like ordinary prose. A cleaner sentence is a bad edit if it changes behavior.

Make the prose easier to follow, easier to audit, and harder to misread while preserving:

- trigger coverage
- workflow semantics
- guardrail strength
- exact technical meaning

Keep one term for one concept. Do not rotate terms just to avoid repetition. In skill prose, stable terminology is part of the behavior contract.

Use compatible ideas from Simplified Technical English when they help, such as short explicit sentences, consistent terminology, active voice by default, and clear separation between instructions and explanation. Do not apply controlled-language rules mechanically if that would erase rationale, flatten scope, or weaken behavioral precision.

This skill extends general English editing with extra safety for:

- root `SKILL.md` files
- sibling `AGENTS.md` guidance files
- behavior-bearing `references/*.md` files
- frontmatter descriptions
- agent instructions
- prompt templates
- workflow guidance
- hard stops and guardrails
- exact technical references inside prose

Use `assets/output-template.md` for all outputs.

### Behavioral drift

Behavioral drift is not limited to paths, fields, and quoted tokens. If a verb changes what an agent may do, when it may do it, or how strongly a rule applies, that verb is behavior-bearing. Preserve it, or replace it only with wording that keeps the same behavior.

Rationale is not filler by default. If a sentence explains why a guardrail exists, why a checkpoint matters, or what risk a timing rule prevents, preserve that rationale unless the user explicitly asked to change the policy rather than tighten the prose.

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

Use this skill when wording itself controls behavior. In these artifacts, these elements often carry behavior rather than decoration:

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
- linked support files whose wording completes the rule, example set, or workflow

Do not simplify these casually.

## Hard stops

- **Never broaden trigger coverage silently.**
- **Never narrow trigger coverage silently.**
- **Never weaken a hard requirement into advice.**
- **Never reorder workflow steps when order affects behavior.**
- **Never paraphrase exact references just because the paraphrase sounds cleaner.**
- **Never remove an example if it defines scope, behavior, or edge-case coverage.**
- **Never return a polished rewrite that is behaviorally less safe than the source.**
- **Never slip a rewrite into audit-only mode.**

## Priority order

When goals conflict, use this order:

1. Preserve trigger intent and scope.
2. Preserve workflow semantics and approval logic.
3. Preserve guardrails and hard-stop strength.
4. Preserve exact technical references.
5. Improve clarity, consistency, and actionability.
6. Improve brevity.

## Operating controls

Choose these controls before you edit.
Do them in order.

1. Choose the output mode. This controls what you will deliver.
2. Choose the rewrite mode. This controls how far you may reshape the prose.

Do not reverse these steps.
Keep them separate. Output mode controls the deliverable. Rewrite mode controls the rewrite scope.

### Output mode

#### Audit only

Always include the consistent report from `assets/output-template.md`.

Use this mode when the user wants review, risk analysis, or a check for ambiguity, drift, or weak wording.

Do not rewrite the text unless the user explicitly asks for a rewrite.

Do not include replacement wording, "safer" rewrites, or suggested revised sentences in the deliverable. If you need to point to a safer pattern, describe the risk in principle instead of drafting substitute text.

A brief alternative may appear only when the user explicitly asked for examples, or when a single phrase is necessary evidence for why the source is risky. In those cases, keep it at fragment level, not sentence level. Do not let it become a stealth rewrite of the passage.

#### Rewrite only

Use this mode when the user wants cleaner final text directly.

#### Audit plus rewrite

Use this mode when the user wants both findings and a safer revision.

### Rewrite mode

For rewrite tasks, ask the user which rewrite mode they want unless the user already made the scope clear.

Offer these modes:

- **`mode=default`** — local rewrite by default.
- **`mode=strict`** — structural rewrite is allowed when needed.

For audit-only requests, you may proceed without asking for a rewrite mode. If the task expands into a rewrite, ask for the rewrite mode before you rewrite.

### Apply the rewrite mode

#### `mode=default`

Use this mode for narrow cleanup, exactness-preserving clarification, typo fixes, or local tightening.

Behavior:

- preserve the source structure unless the structure itself hides behavior
- preserve examples, labels, and section order when they already carry behavior
- prefer phrase-level and sentence-level repairs over reorganization
- prefer the smallest local rewrite that makes the rule easier to follow

#### `mode=strict`

Use this mode when the user wants stronger control, stricter standardization, or when local edits cannot fix repeated ambiguity, mixed severity language, buried workflow logic, or unstable terminology.

Behavior:

- preserve behavior, but allow structural rewrite when the structure itself causes ambiguity
- separate instructions, rationale, warnings, and examples when that improves control
- normalize terminology and obligation language more deliberately across the edited artifact set
- reorganize only as far as needed to make trigger scope, workflow order, and guardrail strength easier to follow

Strict mode is not permission to broaden scope casually. In both modes, keep the smallest change that solves the real problem unless the user explicitly asked for a broader rewrite.

### Artifact focus

Use these lenses when they match the text:

- **Frontmatter description tightening** — Use this focus when the text controls triggering. Treat the description like compact behavioral logic, not like a marketing blurb.
- **Workflow or guardrail tightening** — Use this focus when the prose defines step order, approval dependencies, decision points, safety limits, or exact execution rules.

## Before you edit

### Step 1: Extract what must stay fixed
Do this before you tighten, reorder, or relabel anything.

First, normalize vocabulary for the concepts that matter. Pick one term for each repeated concept and keep it throughout the edit. Common clusters include trigger / invoke / activate, audit / review / analyze, field / key / property, and workflow-role terms such as stage / step / gate / checkpoint / branch / readiness check.

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

### Step 2: Define the artifact set when the task covers a skill folder
Requires: Step 1 is complete.

Default to the root `SKILL.md`, sibling `AGENTS.md` if present, and behavior-bearing Markdown under `references/`. Add other linked instruction files only when they complete the contract.

Read the root `SKILL.md` first. Then follow explicit links and references from `SKILL.md`, `AGENTS.md`, and other instruction files. After that, broaden to a recursive crawl of likely behavior-bearing support files in the skill folder. This includes linked files and other likely behavior-bearing files such as content under `references/`, templates, checklists, and instruction artifacts, even if the user did not paste them inline.

Do not assume the visible excerpt is the full contract.

If file discovery is inconclusive, treat that as unresolved rather than as evidence that no support files exist. Retry with a simpler listing method or direct directory inspection. If you still cannot establish the file set, tell the user that the crawl is incomplete before you rewrite anything that could require cross-file alignment.

Done when: You can name the files that complete the behavior contract, or you have disclosed that the crawl is incomplete.

## Serial-order detection and handling

Treat sequence as behavior when the text tells the agent or reader to do one thing before another.

Load `references/serial-instruction-guidance.md` before you edit workflow-bearing prose whose order, approval timing, validation loop, branch logic, or reference-loading sequence matters. Keep `SKILL.md` operational. Use the reference for the detailed detection pass, structure rules, and edge cases.

### Step 1: Classify each workflow unit before you restructure it
Classify each unit as one of these:
- **Action** — do something now
- **Gate** — stop, wait, require, or branch
- **Readiness check** — confirm outputs exist or state is complete
- **Stage note** — purpose, context isolation, rationale, or input scope
- **Branch handler** — handle approve / request changes / manual edit
- **Landmark checkpoint** — a named pause or review moment that downstream prose may reference

Do not give all six categories the same structural weight.
Done when: every unit you may reshape has a category.

### Step 2: Detect ordered behavior before you tighten it
Requires: Step 1 is complete.
Detect and strengthen these cases:
- **explicit serial instructions** — numbered steps, `Step 1`, `first/next/then/finally`, `before/after/until`, `requires`, `done when`, `return to`, `do not proceed until`
- **implied step ordering** — one sentence hides multiple actions, one action uses the output of another, a warning implies an unstated gate, or a paragraph mixes discovery, decision, rewrite, and verification
- **sequencing cues in skill files** — choose output mode before rewrite mode, define the artifact set before cross-file edits, load references before citing them, run self-check before delivery, ask first before edits that need approval
- **sequencing cues in general prose** — procedural paragraphs, approval notes, policy instructions, workflow warnings, and bullets that are really ordered tasks
Done when: you can name the ordered actions, gates, checks, and branches that the rewrite must preserve.

### Step 3: Choose the smallest ordered structure that keeps compliance visible
Requires: Step 2 is complete.
When order matters:
- make the order explicit
- use a numbered list for 2 to 3 short ordered steps
- use `### Step 0` plus a checklist, then `### Step N: Name`, for 4 or more ordered steps
- give every `### Step N: Name` block an operational body, gate, or completion condition
- do not create a numbered step if it only restates stage purpose, repeats a nearby context rule, announces the next phase, or preserves numbering without operational value
- add `Requires:` when a step depends on an earlier step
- add `Done when:` when later work depends on a successful check
- add a named failure route when a later step must wait for a passing check
- split `do X and then Y` into separate steps when compliance would be safer
- put conditions before actions when that makes timing clearer
- replace emphasis-only warnings with enforceable gates when a later action depends on an earlier check
- never leave ordered work in plain bullets
Done when: the workflow shape makes the intended order, gates, and retry path hard to miss.

### Step 4: Preserve stage mechanics and reject filler steps
Requires: Step 3 is complete.
For stage-based workflows:
- if the document already names stages or phases in multiple places, treat that as evidence of an existing organizing mechanic
- prefer a `## Stage:` container or equivalent higher-level heading when several consecutive items share one phase purpose
- keep phase purpose, context-isolation rules, rationale, and entry conditions at stage level unless they need a standalone numbered checkpoint
- preserve landmark step numbers when they are reused across the file or tied to checkpoints
- do not preserve low-value filler steps only to keep numbering contiguous
- if stage boundaries, numbering architecture, checkpoint placement, or overview/checklist alignment would change, classify the rewrite as structural and surface that explicitly

Transition-step rule:
- a transition step is acceptable only when it enforces a real prohibition, readiness boundary, or handoff state that later steps depend on
- a transition step is not acceptable if the surrounding stage container already makes the navigation obvious
Done when: stage notes stay at stage level, operational steps stay operational, and any structural rewrite is disclosed as structural.

## Rewrite method

Use this method whenever you rewrite behavior-defining prose.

### Step 1: Lead with the operational point
Start with the rule, action, boundary, or decision the reader must understand.

- In descriptions, surface the scope logic early.
- In workflow prose, surface the action and sequence early.
- In guardrails, surface the requirement or prohibition early.
- In rationale, surface the protected risk early.

Do not add a preamble when the instruction works better without one.

### Step 2: Keep one term for one concept
Requires: Step 1 is complete.

Pick one term for each repeated behavior-bearing concept and keep it stable.

Do not rotate synonyms for style if those synonyms could suggest different scope, timing, or force.

### Step 3: Match the sentence shape to the job
Requires: Steps 1 and 2 are complete.

Choose the clearest accurate sentence shape for the artifact.

- **Descriptions** — keep the trigger family, boundary, and artifact scope explicit.
- **Procedures** — keep one action or decision per step when possible.
- **Guardrails** — keep the prohibition or requirement direct, then explain the risk if needed.
- **Rationale** — explain why the rule exists without burying the rule itself.
- **Examples** — keep only examples that anchor scope, edge cases, or expected behavior.

### Step 4: Separate instruction from explanation when it helps
Requires: Steps 1 to 3 are complete.

Procedural text tells the agent what to do. Descriptive text explains what something means, why a rule exists, or when a rule applies.

Separate them when that makes behavior easier to follow. Do not force everything into imperative form if that would narrow policy text, flatten rationale, or blur scope.

### Step 5: Put conditions before commands when that clarifies the logic
Requires: Steps 1 to 4 are complete.

If a rule depends on a condition, put the condition first when doing so makes the logic easier to follow and does not change timing or emphasis.

### Step 6: Preserve exact obligation strength
Requires: Steps 1 to 5 are complete.

Keep requirement, recommendation, permission, and prohibition at the same level.

Use RFC 2119 terms when they genuinely clarify normative force. Do not normalize severity labels mechanically or just to sound more formal.

### Step 7: Keep the action path easy to scan
Requires: Steps 1 to 6 are complete.

Use short paragraphs, clean lists, and bounded sentences when they make the behavior easier to audit.

Do not reshape source text just to make it feel lighter. Scanability helps only when it preserves the same behavior.

### Step 8: Use the smallest structure that makes the rule clear
Requires: Steps 1 to 7 are complete.

Do not over-edit. Improve the prose enough to make the intended behavior easier to follow and harder to misread.

If the workflow already has an implicit stage model, prefer stage-aware cleanup over flattening adjacent notes into peer numbered steps.

## Core rules

### 1. Treat descriptions as trigger logic

Frontmatter descriptions help decide when the skill is used.

When tightening a description:

- preserve the same kinds of requests
- preserve scope-defining nouns and verbs
- preserve quoted trigger phrases unless the user asked to change them
- do not add adjacent trigger families unless expansion was explicitly requested
- do not convert a short description into a broad trigger inventory unless the user asked for that

If a phrase does trigger work, keep it, or replace it only with wording that preserves the same scope exactly.

### 2. Treat workflow prose as executable guidance

If an agent followed only the rewritten text, it should behave the same way.

Separate procedural text from descriptive text when that distinction helps clarity. Procedural text tells the agent what to do. Descriptive text explains what something means, why a guardrail exists, or when a rule applies. Do not force descriptive or policy text into imperative form if that would change behavior or make the constraint sound narrower than it is.

Check for:

- step order
- before/after timing
- approval dependencies
- conditions that gate an action
- warnings that explain why a step matters
- verbs that carry behavior, such as `stop`, `pause`, `wait`, `proceed`, `skip`, `require`, or `allow`
- stage boundaries or phase markers that already organize the workflow
- landmark checkpoints that other sections may reference

Do not merge steps or compress qualifiers if doing so hides decision points.
Do not promote stage notes, rationale, or handoff summaries into standalone numbered steps unless they carry real operational weight.

If the document already names phases or stages in multiple places, consider a stage-aware rewrite rather than a flat step rewrite.
If preserving important checkpoints conflicts with step quality, surface that tradeoff explicitly instead of padding the workflow with filler steps.

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

When rewriting behavior-defining prose, normalize informal severity labels to RFC 2119 terms when that clarification improves control and matches the real requirement level. For example, rewrite `critical` to `MUST` or `REQUIRED` when the source expresses an absolute requirement, and rewrite `important` to `SHOULD` or `RECOMMENDED` when the source expresses a strong recommendation. Apply this to heading-level or banner-level labels like `MANDATORY CHECKPOINT`, `CRITICAL STEP`, or `IMPORTANT` too, not only sentence-level prose. Do not apply this mechanically to quoted text, exact tokens, or other untouchables that must stay exact. Do not normalize just for tone or formality. If you preserve an informal severity label, do so for an exactness reason, not just because the original wording feels emphatic.

A clearer version must preserve the same obligation level.

Bad pattern:

- `must` → `should`
- `do not` → `avoid`
- `required` → `recommended`

### 5. Prefer minimal safe tightening

If you can cut a word, cut it only when that word does not anchor trigger scope, differentiate the skill from adjacent skills, preserve a workflow step, or carry exact technical meaning.

Use direct English. Cut filler, stale phrasing, and avoidable abstraction.

Remove only words that are not carrying behavior.

Good edits:

- split long sentences without changing sequence
- move conditions before commands when the meaning stays the same
- replace inflated wording with concrete wording
- standardize repeated terms
- keep required nouns, verbs, subjects, and articles explicit rather than omitting them for brevity
- prefer active voice unless passive wording is necessary to preserve meaning or actor ambiguity
- remove extra framing when it adds no operational meaning
- preserve the source format when format is part of the request, such as note, checklist, banner, heading, or short inline instruction
- for short practical notes, prefer the smallest local rewrite that improves scanability without escalating tone, adding process detail, or turning the note into a policy artifact

Bad edits:

- compressing away a trigger phrase
- replacing an exact field reference with a broader category
- deleting an example that anchors scope
- turning a bounded instruction into a generic best practice

### 6. Prefer no rewrite over risky rewrite

If the source is already clear enough and further tightening risks drift, say so.

Preserve trigger accuracy and workflow behavior over elegance. A clumsy instruction that works is better than a polished one that drifts.

A safe answer can be:

- a very small rewrite
- an audit with no rewrite
- a note that the wording is already near the minimum safe form

If the text is already compact, exact, and behaviorally clear, prefer an explicit no-rewrite recommendation over a cosmetic rephrase.

## Output rules by mode

Rewrite mode controls how far you may reshape the source. Output mode controls what you return to the user.

For your own responses, you may borrow lightweight cognitive-load reduction patterns when they help the user act on the result. Good examples include numbered findings, explicit next steps, and brief progress-visible summaries.

Do not let response-formatting choices override audit accuracy. Do not reshape source text just to make it feel more ADHD-friendly unless the user explicitly asked for that delivery style.

### Audit only

Use this structure:

1. **Summary** — 1 to 3 sentences
2. **Highest-risk issues first**
3. **Finding list** — category, source text, risk, and why it matters
4. **Optional safer alternative** — only if the user explicitly asked for examples, and only at finding level
5. **Optional full rewrite** — only if the user asked for it
6. **Completed report** — fill out `assets/output-template.md`

Focus first on:

- trigger drift risk
- workflow drift risk
- guardrail weakening
- exact-reference loss
- only then general clarity issues

Use calibrated obligation and severity language, not theatrics. Prefer RFC 2119 terms when describing the strength of a rule or rewrite recommendation. Use severity labels only when they help rank audit findings rather than define behavior. Reserve labels like `Critical` for issues likely to materially change agent behavior, trigger routing, workflow execution, approval handling, or safety boundaries.

### Rewrite only

Always include the consistent report from `assets/output-template.md`.

If the user asks for only the rewrite, return the rewrite first, then the completed report.

Do not prepend audit notes or explanation unless the user asked.

### Audit plus rewrite

Always include the consistent report from `assets/output-template.md`.

Give the risk summary first. Then give the rewrite. Then give the completed report.

## Progressive disclosure

Load references only when needed.

When the user asks you to work on a skill, crawl the skill folder first. Treat the skill folder as one behavior contract distributed across an artifact set, not as a root file with optional extras.

For folder-level work, the default artifact set is the local `SKILL.md`, sibling `AGENTS.md` if present, and behavior-bearing Markdown under `references/`. Read the local `SKILL.md` first. Then inspect files linked from `SKILL.md`, `AGENTS.md`, and adjacent instruction files before you broaden to other likely behavior-bearing files such as `references/` content, templates, checklists, or adjacent instruction files.

When the task covers a skill folder, audit the artifact set, not only the quoted excerpt. Rewrite any artifact-set files that need updates so terminology, severity language, examples, workflow wording, progressive-disclosure handoffs, and local sentence structure stay internally consistent and easy to follow.

If you changed any file in the artifact set, run a dedicated local-tightening sweep across the other inspected behavior-bearing files before you conclude that they should stay unchanged. This sweep is separate from cross-file alignment. Check each unchanged file for low-risk sentence-structure, scanability, terminology, and wording improvements that preserve behavior exactly.

If you leave an inspected behavior-bearing file unchanged, classify the reason explicitly as one of these:
- `Already near minimum safe form`
- `Rewrite would add drift risk without meaningful clarity gain`
- `Local-tightening sweep incomplete`

Do not collapse these into a generic `No edit needed`.

Treat local sentence-structure quality as part of the decision, not as a cosmetic afterthought. A file can be behaviorally aligned across the folder and still need a rewrite if its own prose makes the contract harder to follow than necessary.

Load references only when needed:

- `references/serial-instruction-guidance.md` — explicit and implied step order, approval timing, validation loops, branching, and when workflow prose must become stronger ordered steps
- `references/checklist.md` — final pass before delivery, output-mode compliance, no-rewrite decisions, and cross-file consistency checks
- `references/frontmatter-descriptions.md` — description tightening, trigger-family preservation, and trigger-scope safety
- `references/workflow-guardrails.md` — workflow, approval, rationale, verb-sensitivity, and exact-reference preservation
- `references/ste-compatible-rules.md` — selective Simplified Technical English patterns adapted for behavior-preserving prompt editing
- `references/rfc-2119.md` — normalize informal severity labels into RFC 2119 obligation terms without changing behavior strength
- `references/examples.md` — before/after examples for audit-only, no-rewrite, guardrails, and frontmatter-safe tightening
- `references/artifact-patterns.md` — positive rewrite patterns for descriptions, workflows, guardrails, rationale, examples, and audit findings

## Decision tests

Before you deliver, ask:

- Would the rewritten description still trigger for the same requests?
- Would an agent following the rewrite behave the same way?
- Did any requirement become softer?
- Did any exact token disappear?
- Did any behavior-bearing verb drift into a softer or different action?
- Did any rationale sentence get cut even though it explained a guardrail or timing rule?
- Did any example that defines scope get removed?
- Did I create any numbered steps that are really stage notes?
- Did I preserve numbering at the cost of weak filler steps?
- Is the first real operation easy to find?
- Did I duplicate a stage-level rule as a numbered step?
- Would a stage container be safer than more `### Step N` blocks?
- If the rewrite changed stages, checkpoints, or numbering architecture, did I classify it as structural?
- Is the rewrite actually clearer, or just shorter?

If any answer is risky, revise less.

If the task is audit-only, also ask: did I accidentally draft replacement wording instead of limiting myself to findings?

## Required self-check before delivery

### Step 0: Track progress
Do this before any other work when the verification workflow has 4 or more real actions.
Create a short checklist in your working state or reply and update it after each step.

- [ ] Step 1: Re-read the trigger or scope language
- [ ] Step 2: Check for accidental synonym drift
- [ ] Step 3: Check obligation and severity terms
- [ ] Step 4: Check referents
- [ ] Step 5: Re-check exact tokens and behavior-bearing verbs
- [ ] Step 6: Confirm artifact-set discovery
- [ ] Step 7: Confirm folder-level coverage
- [ ] Step 8: Confirm local-tightening sweep status
- [ ] Step 9: Confirm unchanged-file classification if needed
- [ ] Step 10: Confirm incomplete-discovery disclosure if needed
- [ ] Step 11: Confirm rationale preservation
- [ ] Step 12: Confirm structural-behavior equivalence
- [ ] Step 13: Confirm ordered behavior is still visible
- [ ] Step 14: Confirm no pseudo-step inflation or filler numbering
- [ ] Step 15: Confirm structural-rewrite disclosure if needed
- [ ] Step 16: Confirm audit-only output stayed findings-only

This step is not optional.
Do not deliver before this check is complete.

### Step 1: Re-read the trigger or scope language
Would it still route the same requests?

### Step 2: Check for accidental synonym drift
Search for terms you did not choose during vocabulary normalization. Replace accidental synonym drift.

### Step 3: Check obligation and severity terms
Search for `MUST`, `REQUIRED`, `MUST NOT`, `SHOULD`, `RECOMMENDED`, `MAY`, `OPTIONAL`, `avoid`, `critical`, `important`, `mandatory`, and `required`.
Confirm obligation strength did not shift by accident. Check headings, banners, and checkpoint labels too, not just sentence-level prose. If you normalized severity labels, confirm the chosen RFC 2119 term matches the real requirement level rather than rhetorical emphasis. If you preserved an informal severity label like `MANDATORY` or `CRITICAL`, confirm you had an exactness reason to do so.

### Step 4: Check referents
Search for `this`, `it`, and `they`. Make sure each referent is clear in context.

### Step 5: Re-check exact tokens and behavior-bearing verbs
Re-check every exact token, command, path, field name, identifier, example, and behavior-bearing verb that the source relied on.

### Step 6: Confirm artifact-set discovery
Confirm that you followed explicit links and references from `SKILL.md`, `AGENTS.md`, and any inspected instruction files before deciding the artifact set was complete.

### Step 7: Confirm folder-level coverage
Confirm that folder-level work covered the full artifact set: root `SKILL.md`, sibling `AGENTS.md` if present, relevant behavior-bearing `references/*.md`, and any other linked instruction files needed to preserve the contract.

### Step 8: Confirm local-tightening sweep status
Requires: Step 7 is complete.
If you changed any file in a folder-level rewrite, confirm that you ran a dedicated local-tightening sweep across the other inspected behavior-bearing files before you left them unchanged.

### Step 9: Confirm unchanged-file classification if needed
If any inspected behavior-bearing file stayed unchanged, classify the reason exactly as `Already near minimum safe form`, `Rewrite would add drift risk without meaningful clarity gain`, or `Local-tightening sweep incomplete`. Do not use a generic `No edit needed` classification.

### Step 10: Confirm incomplete-discovery disclosure if needed
If discovery was inconclusive at any point, confirm that you retried discovery or explicitly told the user about the incomplete crawl before proceeding.

### Step 11: Confirm rationale preservation
Confirm that rationale sentences tied to guardrails, approval gates, or timing rules were preserved when they still carry policy meaning.

### Step 12: Confirm structural-behavior equivalence
If the rewrite changed structure, ask whether an agent following only the new version would behave the same way.

### Step 13: Confirm ordered behavior is still visible
If the text contains explicit or implied ordered instructions, confirm that the order, gates, branch destinations, and return paths are still visible as ordered behavior.

### Step 14: Confirm no pseudo-step inflation or filler numbering
Confirm that you did not create numbered steps that are really stage notes, preserve numbering by padding filler steps, or bury the first real operation behind transition-only steps.

### Step 15: Confirm structural-rewrite disclosure if needed
If the rewrite changed stages, checkpoints, numbering architecture, or overview/checklist alignment, confirm that you classified it as structural rather than presenting it as local cleanup.

### Step 16: Confirm audit-only output stayed findings-only
If the task was audit-only, confirm that you did not include sentence-level replacement text unless the user explicitly requested examples.

## Limits

This skill is not a full Simplified Technical English enforcement pass, and it is not a general ADHD-friendly rewriting mode. Use compatible ideas from those disciplines selectively and subordinate them to behavior preservation.

This skill improves behavior-defining prose safely. It does not replace domain review.

When a rewrite covers a skill folder, check whether the rest of the inspected artifact set — including the root `SKILL.md`, sibling `AGENTS.md`, `references/` content, and other behavior-bearing support files — now uses stale terminology, inconsistent severity language, mismatched examples, broken progressive-disclosure handoffs, or sentence structures that make the behavior harder to follow than necessary. If you changed any file in the artifact set, do a dedicated local-tightening sweep of the other inspected behavior-bearing files before you leave them unchanged. Edit those files when needed so the folder remains internally consistent and locally clear before you deliver the work.

Cross-file alignment is required, but it is not sufficient. Local clarity inside each behavior-bearing file is also part of safe delivery.

If the user wants broad content strategy, new workflow design, or repo-wide policy changes, do not smuggle those changes in through prose cleanup. Surface them explicitly.

This skill does not impose arbitrary word-count limits, blanket modal bans, or creative-writing style rules. Use compact wording where it improves clarity, but preserve precision when precision is the behavior.