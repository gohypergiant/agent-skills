---
name: accelint-english-discipline
description: Use when drafting, rewriting, simplifying, reviewing, editing, polishing, humanizing, de-slopping, cleaning up, or checking written English that must become plainer, clearer, more direct, or easier to act on without changing the user's intended meaning, audience, tone, or explicit constraints. Also use when the user says "plain English", "simple English", "make this readable", "make this clearer", "make this direct", "make this sound better", "too wordy", "too formal", "edit this", "clean this up", "review this writing", "grammar check", "Orwell", "STE", "ASD-STE100", "ADHD-friendly", "shorter", "less fluffy", or asks for clearer docs, prompts, emails, UI copy, reports, support replies, or instructions.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.0.1"
---

# English Discipline

Use plain, direct English as a discipline, not as a blunt instrument.

This skill combines three strengths:

- **STE structure** for short, unambiguous sentences and stable terminology
- **ADHD-aware shaping** for action-first, skimmable output
- **Orwell's filter** for cutting stale, inflated, evasive prose

The goal is not "make everything shorter." The goal is: **make the text easier to act on and harder to misread, while preserving the user's intended meaning, audience, tone, and explicit constraints.**

## Hard Stops

- **NEVER change the user's meaning to make a sentence shorter.** Precision outranks brevity.
- **NEVER flatten deliberate tone, humor, rhythm, warmth, or character voice when the user explicitly wants them.**
- **NEVER claim strict ASD-STE100 compliance unless the user asked for it and you state the dictionary limitation.**
- **NEVER simplify code, identifiers, commands, file paths, quoted errors, product names, or legal text silently.**
- **NEVER delete important nuance just because a rule prefers shorter wording.** If a hedge carries real uncertainty, keep it.

## Default Biases

Use these as defaults, not as mechanical laws:

- Keep one term for one concept when repeated wording names the same thing.
- Lead with the next action when the output is meant to help someone act.
- Cut filler openings, recap paragraphs, and vague closers unless they serve an explicit tone or relationship need.
- Do not apply strict technical-writing rules to marketing, poetry, fiction, or brand voice by default. Use them as clarity aids only.

## Before You Rewrite

Classify the request before you touch the text.

### 1. What kind of writing is this?

Choose one primary mode:

- **Procedural**: instructions, runbooks, prompts, setup steps, checklists
- **Descriptive**: explanations, reports, docs, release notes, status updates
- **Conversational / operational**: chat responses, support answers, agent replies, emails
- **Creative / voice-sensitive**: essays, stories, speeches, brand copy, lyrical prose

### 2. What must be preserved?

Extract explicit constraints first:

- intended meaning
- audience
- tone
- format
- legal or product wording
- quoted or technical text that must stay exact

If a mechanical rule conflicts with an explicit user constraint, **the constraint wins**.

### 3. Which discipline level fits?

Use one of these levels:

| Level | When | Apply |
|---|---|---|
| **Plain** (default) | Most rewriting and drafting | Clear wording, short sentences, active voice, filler removal, consistent terms |
| **Technical** | Docs, prompts, procedures, reports, UI copy | Plain rules + stronger STE structure + procedural/descriptive checks |
| **Strict STE-leaning** | User explicitly asks for STE or ASD-STE100 | Technical rules + full modal/consistency discipline, with a note that full compliance requires the official dictionary |
| **Voice-preserving** | Creative, persuasive, warm, or style-sensitive prose | Orwell filter + clarity edits, but do not flatten deliberate voice |

## Core Operating Rules

### 1. Preserve intent before style

Keep the user's:

- meaning
- audience fit
- explicit constraints
- requested tone

Do not optimize the sentence while damaging the job the text must do.

### 2. Prefer direct, concrete English

Default moves:

- use short words when they keep the same meaning
- cut filler that adds no fact
- replace abstraction with the concrete action or result
- name the actor when the actor matters
- prefer active voice

**Before:** This functionality is designed to facilitate easier onboarding.
**After:** This feature helps new users start faster.

### 3. Keep one term for one concept

If several words refer to the same thing, pick one and keep it.

Common collapse sets:

- check / verify / confirm / validate / ensure
- config / configuration / settings / options
- run / execute / invoke / launch
- issue / problem / error / failure
- delete / remove / drop / destroy

Do not rotate terms just to avoid repetition.

### 4. Match the structure to the writing type

#### Procedural writing

Use this for instructions.

- imperative voice
- one instruction per sentence or step
- put the condition before the command
- keep sentences short
- notes give information, not hidden instructions

**Before:** Increase the timeout if the network is slow.
**After:** If the network is slow, increase the timeout.

#### Descriptive writing

Use this for explanation.

- one main fact per sentence
- group related facts
- keep paragraphs on one topic
- do not slip instructions into explanation paragraphs

### 5. Shape action-oriented output for easy execution

When the output helps a reader act, especially in chat or agent responses:

1. Lead with the next action.
2. Number multi-step work.
3. Keep each step bounded.
4. Suppress tangents until the main task is done.
5. End with one concrete next action if anything remains open.
6. Make progress visible.

This is strongest for ADHD-friendly responses, but it also improves many operational answers.

### 6. Cut stale and evasive language

Remove or rewrite:

- stock phrases
- dead metaphors
- pompous diction
- vague intensifiers
- apology filler
- empty transition padding

Examples:

- "in order to" → "to"
- "it is worth noting that" → delete
- "robust" → name the actual property
- "seamlessly" → delete, or explain what happens
- "utilize" → "use"

### 7. Keep necessary nuance

Do not make prose falsely certain or crudely simple.

- Keep a hedge if it carries real uncertainty.
- Keep a technical term if a simpler word would be less accurate.
- Keep passive voice only when the actor is unknown, irrelevant, tact-sensitive, or deliberately de-emphasized for a user-requested style.

### 8. Preserve untouchables exactly

Do not rewrite these unless the user explicitly asks:

- code blocks and inline code
- identifiers, flags, commands, file paths
- quoted errors and logs
- product names, API names, config keys
- legal or compliance text

## Modal and Tone Discipline

Use this ladder when simplifying obligation and uncertainty:

| You see | Prefer |
|---|---|
| should (requirement) | must |
| should (soft advice) | state the fact, recommendation, or condition directly |
| may / might / could (mere possibility) | can |
| would (avoidable hypothetical padding) | rewrite the sentence |

But do **not** delete uncertainty that is real and material.

- Bad simplification: "The deploy can have caused the outage."  
- Better: "The cause is not confirmed. The deploy is one possible cause."

## Workflow

### For drafting from scratch

1. Identify the writing type and discipline level.
2. Extract explicit constraints.
3. Draft in direct English.
4. Keep one term per concept.
5. If the reader must act, shape the output action-first.
6. Run the self-check before you deliver.

### For revising existing text

1. Preserve the user's meaning and constraints.
2. Remove filler, stale phrasing, and avoidable abstraction.
3. Split overloaded sentences.
4. Convert passive to active when it improves clarity.
5. Keep necessary jargon, nuance, or voice intentionally.
6. Run the self-check before you deliver.

### For checking text instead of rewriting it

Default to a compact audit report unless the user asks for a full rewrite.

Use this structure:

1. **Summary** — 1 to 3 sentences on the main clarity, tone, and actionability issues
2. **Highest-risk issues first** — meaning drift risks, ambiguity, buried actions, misleading modality, or broken structure
3. **Finding list** — for each issue, give:
   - the problem category or rule
   - the offending text
   - a better rewrite
   - a short note when the tradeoff is about tone, nuance, or audience rather than strict correctness
4. **Optional full rewrite** — include only if the user asked for one or if the passage has many repeated issues

Prefer grouping findings by severity or passage section instead of reporting tiny edits in random order.

If the user asked specifically for STE checking:

- state that you can do a strict STE-leaning review, not official certification
- cite rule numbers only from the loaded STE reference
- do not invent rule numbers

## Conflict Resolution

Use this priority order when the source skills disagree:

1. **User meaning, audience, tone, and explicit constraints**
2. **Untouchables and required exact wording**
3. **Clarity and actionability**
4. **Technical-writing discipline**
5. **Brevity**

Specific resolutions:

- **Tone vs terseness**: preserve warmth or voice when the user explicitly wants it; otherwise cut pleasantries.
- **STE vs creative writing**: use STE as a clarity aid, not as a form override.
- **Active voice vs tact**: use active voice by default, but allow passive when tact, uncertainty, or deliberate emphasis matters.
- **Hedge removal vs truthfulness**: remove fake hedges; keep real uncertainty.

## Multi-Turn Continuity

Across turns, keep the chosen discipline level and terminology stable unless the user changes the goal.

When you revise in multiple passes:

1. State what you changed.
2. State what remains open, if anything.
3. Keep repeated terms stable across versions.
4. Do not quietly shift from voice-preserving mode to technical mode, or the reverse.

For ADHD-friendly or operational help, visible progress helps the reader stay oriented.

## Quick Patterns

### Action-first response pattern

Use for help replies, support answers, and agent-style outputs.

1. First line: the next action
2. Then: only the context needed to do it correctly
3. Then: the visible result or remaining next step

### Plain rewrite pattern

1. Keep the meaning
2. Cut filler
3. Replace abstract wording with concrete wording
4. Split long sentences
5. Standardize repeated terms
6. Re-check tone

### Technical rewrite pattern

1. Classify as procedural or descriptive
2. Apply the matching sentence structure
3. Move conditions before commands
4. Preserve commands and identifiers exactly
5. Run the checklist

## Progressive Disclosure

Load references only when needed:

- `references/ste-rules.md` — detailed STE-style rule catalog and technical-writing mechanics
- `references/checklist.md` — final verification pass for rewrites and audits
- `references/adhd-patterns.md` — action-first shaping for ADHD-friendly or operational responses
- `references/use-cases.md` — adaptations for docs, prompts, errors, reports, UI copy, and creative work
- `references/examples.md` — compact rewrite and audit examples by writing type
- `references/substitutions.md` — slop-to-simple replacements, modal ladder, and consistency sets

## Limits

This skill improves clarity. It does not replace subject-matter accuracy, legal review, brand review, or official ASD-STE100 certification.

If the user asks for full ASD-STE100 compliance:

1. Say that full compliance depends on the official standard and dictionary.
2. Offer a strict STE-leaning review of structure, wording, modality, and consistency.
3. Separate what you checked mechanically from what would require the official dictionary.

## Source synthesis note

This skill intentionally synthesizes three source traditions:

- STE-style structural discipline for technical clarity
- ADHD-friendly output shaping for actionability
- Orwell-style plain-English editing for honesty and directness

When those traditions conflict, follow the Conflict Resolution section instead of applying any one source mechanically.
