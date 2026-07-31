---
name: accelint-english-manager
description: Use when the user wants prose rewritten, tightened, audited, simplified, polished, humanized, grammar-checked, or made plainer, clearer, shorter, easier to scan, or easier to act on without changing the intended meaning, audience, tone, or explicit constraints. Trigger on requests such as plain English, simple English, make this clearer, make this more direct, clean this up, edit this, review this writing, grammar check, too wordy, too formal, less fluffy, friendlier, shorter, audit then rewrite, keep the tone, mode=strict, STE, ASD-STE100, or ADHD-friendly. Also trigger for docs, prompts, emails, UI copy, support replies, release notes, status updates, incident notes, procedural text, and other LLM-written prose. Prefer this skill when the main job is improving English prose or preserving tone while increasing clarity, including audit-only requests and exact-text-preservation constraints, but not when the real task is fact-checking, policy setting, or substantive content design.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.3.3"
---

# English Manager

Use plain, direct English that is easy to read, easy to scan, and easy to act on.

Do not optimize for brevity alone. Preserve the user's intended meaning, audience, tone, and explicit constraints while making the text clearer, steadier, and harder to misread.

This skill uses one default writing system:
- **plain-language discipline** for direct, concrete wording
- **STE-leaning structure** for technical clarity and stable terminology
- **ADHD-friendly shaping** for scanability and actionability when the text helps someone do something

Use these together. They are not separate modes.

## Hard constraints

These outrank style preferences.

- Preserve the user's meaning before you optimize wording.
- Preserve requested tone, audience fit, and explicit format constraints.
- Preserve deliberate warmth, rhythm, humor, persuasion, or brand voice when the user wants them.
- Preserve code, identifiers, commands, file paths, quoted errors, product names, API names, config keys, and legal text unless the user explicitly asks to rewrite them.
- Keep real uncertainty, real nuance, and real obligation levels. Do not make text sound simpler by making it less true.
- Do not claim official ASD-STE100 compliance. If the user asks for strict STE, say that full compliance depends on the official standard and dictionary.

## Start here

Choose the smallest fitting path before you edit.

### 1. Ask for the mode first

For drafting or rewriting tasks, ask the user which mode they want before you edit, unless the user already specified the mode explicitly.

Offer these choices:
- **`mode=default`** — local rewrite by default, plain and direct
- **`mode=strict`** — stricter technical control, structural rewrite allowed when needed

If the user did not choose a mode, ask a short clarifying question instead of assuming.

For audit-only requests, you may proceed without asking for a mode if the user clearly wants review rather than a rewrite. If the audit later expands into a rewrite, ask for the mode before rewriting.

### 2. Choose the output mode

- **Audit only** — review the text without rewriting it unless the user asks.
- **Rewrite only** — return cleaner final text directly.
- **Audit plus rewrite** — give findings first, then the rewrite.

If the user asks for only the rewrite, return only the rewrite. Do not return audit notes unless the user asked for them.

### 3. Preserve the constraints

Extract and protect these first:
- meaning
- audience
- tone
- format
- exact wording that must stay
- quoted or technical text that must stay exact

If a style rule conflicts with an explicit user constraint, the constraint wins.

### 4. Choose the scope through the mode

Let the mode set your default rewrite scope.

- **`mode=default`** — do a **local rewrite** by default. Tighten or clarify the given text only. Preserve the source structure unless the user clearly asks for a fuller artifact or the current structure hides key meaning.
- **`mode=strict`** — allow a **structural rewrite** when stronger control helps the text do its job. Reorganize, split, or relabel content when the current structure hides sequence, logic, safety, requirements, or operational clarity.

Do not treat `mode=strict` as permission to broaden the task casually. In both modes, keep the smallest change that solves the real problem unless the user explicitly asks for a broader rewrite.

## Default writing method

Use this method unless the task clearly calls for a stricter overlay.

### 1. State the point early

Lead with the point, result, or next action.

- In explanatory text, put the main fact early.
- In operational text, put the next action early.
- In support or error help, state what happened, why if known, and what to do next.

Do not add a preamble when the answer works better without one.

### 2. Use direct, concrete wording

Write the clearest accurate sentence you can.

- prefer concrete actions and results over abstraction
- use short familiar words when they keep the same meaning
- remove filler, recap padding, and inflated phrasing
- name the actor when the actor matters
- prefer active voice when it improves clarity

If a simpler word would reduce accuracy, keep the precise word.

### 3. Keep one term for one concept

Pick one term for each repeated concept and keep it stable.

Do not rotate synonyms just to avoid repetition.

### 4. Keep the text easy to scan

Use light ADHD-friendly shaping by default:
- keep sentences and paragraphs bounded
- keep one main action or fact per sentence when possible
- use lists only when they make the work easier to follow
- keep side issues out of the main path until they matter
- make the next action obvious when the reader needs to act

Do not force checklist structure onto casual, creative, or voice-sensitive prose.

### 5. Match the structure to the job

Use the shape that fits the writing.

- **Procedural or operational writing**: imperative steps, condition before command, one action per step, warnings as explicit instructions
- **Descriptive writing**: one main fact per sentence, related facts grouped together, no buried instructions in explanation paragraphs
- **Voice-sensitive or persuasive writing**: keep the clarity gains without flattening the voice that does the job

### 6. Keep necessary nuance

Write plainly without overstating certainty or force.

- keep real hedges when the fact is uncertain, conditional, estimated, or incomplete
- remove fake hedges when they only add fog
- preserve requirement strength, recommendation strength, permission, and capability accurately
- keep passive voice only when the actor is unknown, irrelevant, tact-sensitive, or deliberately de-emphasized

## Mode control

Use these writing modes when they materially help.

| Mode | When | Apply |
|---|---|---|
| **mode=default** | Most requests | Plain-language discipline, stable terminology, scanable structure, action-first shaping when useful, and local rewrites by default |
| **mode=strict** | The user explicitly asks for STE, ASD-STE100-style writing, very strict plain language, highly controlled technical wording, or a stricter audit of technical prose | Default mode + stronger STE structure, stronger modality discipline, stronger procedural/descriptive separation, tighter terminology control, and structural rewrites when needed for clarity or control |

If the user asks for strict STE-style review:
1. Say that you can do a strict STE-leaning review.
2. State that official ASD-STE100 compliance depends on the official standard and dictionary.
3. Load only the relevant part of `references/ste-rules.md` that the request needs.
4. Cite rule numbers only from the part of `references/ste-rules.md` that you actually loaded.
5. If you did not load the relevant rule text, do not cite rule numbers.

If the user asks for "plain English," "simple English," "clean this up," or a similar generic cleanup request without naming a mode, treat that as a plain-language goal, not as implicit `mode=strict`.

## Output rules

### Audit only

Default to a compact review unless the user asks for something more formal.

Use this shape:
1. **Summary** — 1 to 3 sentences on the main clarity, tone, or actionability issues
2. **Highest-risk issues first** — especially meaning drift, ambiguity, hidden actions, obligation drift, or broken structure
3. **Targeted findings** — offending text, better rewrite, and a brief note only when it helps
4. **Optional full rewrite** — include it only if the user asked for one or the passage has repeated issues

### Rewrite only

Return only the rewrite when the user asks for only the rewrite.

Do not prepend audit notes or explanation unless the user asked for them.

### Audit plus rewrite

Give the findings first, then the rewrite.

## Reference loading map

Load references only when they materially help.

- `references/substitutions.md` — wording cleanup, filler removal, consistency sets, modality checks
- `references/checklist.md` — final verification pass or detailed audit support
- `references/ste-rules.md` — technical, procedural, instructional, or explicit STE requests; also for `mode=strict`
- `references/adhd-patterns.md` — stronger action-oriented shaping when the reader needs execution help, low-friction next steps, or ADHD-friendly formatting beyond the default
- `references/use-cases.md` — adapt the core method to docs, prompts, support replies, incident notes, UI copy, or voice-sensitive writing
- `references/rfc-2119.md` — only for normative or behavior-defining text such as policy, requirements, interface contracts, governance, or procedures where informal severity labels hide true obligation
- `references/examples.md` — anchor patterns when the request is ambiguous or the text mixes clarity goals with voice-sensitive constraints

## Delivery workflow

### For drafting from scratch

1. Ask the user which mode they want, unless they already specified it.
2. Choose the output mode.
3. Extract the constraints.
4. Apply `mode=default` or `mode=strict`, and let that set the default scope.
5. Draft in direct English.
6. Keep repeated terms stable.
7. If the reader must act, make the action path easy to scan.
8. Run the self-check before delivery.

### For revising existing text

1. Ask the user which mode they want, unless they already specified it.
2. Preserve the user's meaning and constraints.
3. Apply `mode=default` or `mode=strict`, and let that set the default scope.
4. Tighten the wording with the smallest change that fixes the problem.
5. Remove filler, stale phrasing, and avoidable abstraction.
6. Split overloaded sentences or restructure only when substitution alone will not work.
7. Recheck pronouns, modality, and untouchables.
8. Run the self-check before delivery.

### For checking text instead of rewriting it

1. Identify the highest-risk issues first.
2. Keep the review proportional to the request.
3. Use a stricter, rule-based audit format only when the user asks for it or the text is high-consequence.
4. If the user asked for STE checking, load only the relevant part of `references/ste-rules.md` that you need and do not invent rule numbers.

## Conflict resolution

Use this priority order when rules compete:

1. User meaning, audience, tone, and explicit constraints
2. Untouchables and required exact wording
3. Clarity and actionability
4. Technical-writing discipline
5. Brevity

Specific resolutions:
- preserve warmth or voice when the text depends on relationship tone, persuasion, rhythm, or brand fit
- use STE-like discipline as a clarity tool, not as a form override for creative or hybrid writing
- remove fake hedges, but keep real uncertainty
- use active voice by default, but keep passive when tact, uncertainty, or deliberate emphasis matters

## Required self-check before delivery

Before you deliver, confirm:
1. The rewrite still does the same job for the same audience.
2. Key terms stayed stable.
3. Obligation, permission, capability, and uncertainty did not drift.
4. Untouchables stayed exact.
5. The final answer matches the requested output mode.
6. The final answer matches the requested rewrite mode.

For a deeper mechanical pass, load `references/checklist.md`.

## Limits

This skill improves clarity and execution-readiness. It does not replace subject-matter accuracy, legal review, brand review, or official ASD-STE100 certification.

It is also a writing skill, not a fact-checking or policy-setting skill. Improve the prose without inventing new requirements, commitments, or product behavior.

When you apply this skill, optimize for disciplined English that stays precise, truthful, easy to scan, and easy to act on.