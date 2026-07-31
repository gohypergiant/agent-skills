Highest-risk issues first

1. `SKILL.md` mixes required workflow steps with explanatory prose often enough that the action path is harder to scan than it needs to be in `mode=strict`. This does not appear to change behavior today, but it raises workflow-drift risk because mode selection, output selection, and scope control sit across several nearby sections.
2. Some audit instructions in `SKILL.md` and `references/examples.md` still use rewrite-bearing language such as "better rewrite" inside audit patterns. The current meaning is recoverable from context, but the wording weakens the separation between audit-only and rewrite-inclusive outputs.
3. The reference set is mostly aligned, but a few files still vary between "scanable" and more standard "easy to scan" style or use slightly different framing for the same control logic. This is low risk, but in a behavior-defining skill it makes the contract harder to audit.

## Rewrite

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/SKILL.md`

Frontmatter intentionally omitted. The rewrite below starts after the frontmatter block.

```md
# English Manager

Use plain, direct English that is easy to read, easy to scan, and easy to act on.

Do not optimize for brevity alone. Preserve the user's intended meaning, audience, tone, and explicit constraints. Make the text clearer, steadier, and harder to misread.

This skill uses one default writing system:
- **plain-language discipline** for direct, concrete wording
- **STE-leaning structure** for technical clarity and stable terminology
- **ADHD-friendly shaping** for scanability and actionability when the text helps someone do something

Use these together. They are not separate modes.

## Hard constraints

These constraints outrank style preferences.

- Preserve the user's meaning before you optimize wording.
- Preserve requested tone, audience fit, and explicit format constraints.
- Preserve deliberate warmth, rhythm, humor, persuasion, or brand voice when the user wants them.
- Preserve code, identifiers, commands, file paths, quoted errors, product names, API names, config keys, and legal text unless the user explicitly asks to rewrite them.
- Keep real uncertainty, real nuance, and real obligation levels. Do not make text sound simpler by making it less true.
- Do not claim official ASD-STE100 compliance. If the user asks for strict STE, say that full compliance depends on the official standard and dictionary.

## Start here

Choose the smallest fitting path before you edit.

### 1. Ask for the mode first

For drafting or rewriting tasks, ask the user which mode they want before you edit, unless the user already specified the mode.

Offer these choices:
- **`mode=default`** — local rewrite by default, plain and direct
- **`mode=strict`** — stricter technical control; structural rewrite allowed when needed

If the user did not choose a mode, ask a short clarifying question instead of assuming.

For audit-only requests, you may proceed without asking for a mode if the user clearly wants review rather than a rewrite. If the audit later expands into a rewrite, ask for the mode before you rewrite.

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

Use this method unless the task clearly needs a stricter overlay.

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
4. Cite rule numbers only from the part of `references/ste-rules.md` that you loaded.
5. If you did not load the relevant rule text, do not cite rule numbers.

If the user asks for "plain English," "simple English," "clean this up," or a similar generic cleanup request without naming a mode, treat that as a plain-language goal, not as implicit `mode=strict`.

## Output rules

### Audit only

Default to a compact review unless the user asks for something more formal.

Use this shape:
1. **Summary** — 1 to 3 sentences on the main clarity, tone, or actionability issues
2. **Highest-risk issues first** — especially meaning drift, ambiguity, hidden actions, obligation drift, or broken structure
3. **Targeted findings** — source text, risk, and a brief note only when it helps
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
4. Apply `mode=default` or `mode=strict`. Let that mode set the default scope.
5. Draft in direct English.
6. Keep repeated terms stable.
7. If the reader must act, make the action path easy to scan.
8. Run the self-check before delivery.

### For revising existing text

1. Ask the user which mode they want, unless they already specified it.
2. Preserve the user's meaning and constraints.
3. Apply `mode=default` or `mode=strict`. Let that mode set the default scope.
4. Tighten the wording with the smallest change that fixes the problem.
5. Remove filler, stale phrasing, and avoidable abstraction.
6. Split overloaded sentences or restructure only when substitution alone will not work.
7. Recheck pronouns, modality, and untouchables.
8. Run the self-check before delivery.

### For checking text instead of rewriting it

1. Identify the highest-risk issues first.
2. Keep the review proportional to the request.
3. Use a stricter, rule-based audit format only when the user asks for it or the text is high-consequence.
4. If the user asked for STE checking, load only the relevant part of `references/ste-rules.md` that you need. Do not invent rule numbers.

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
```

### `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/examples.md`

```md
# Examples by writing type

Use this reference when a concrete before/after pattern will help before you draft, rewrite, or audit text.

This file is an example bank. Use `references/use-cases.md` for context-specific adaptation guidance.

These examples are intentionally short. Use them to anchor judgment. Do not force a template onto unrelated prose.

## Procedural rewrite

**Before:** You should restart the service if the config has been changed.

**After:** If the config changed, restart the service.

Why this helps:
- puts the condition first
- removes weak modality
- shortens the sentence without losing the action

## Procedural rewrite with numbered steps

**Before:** Open the config file, change the timeout value, save the file, and run the command again.

**After:**
1. Open the config file.
2. Change the timeout value.
3. Save the file.
4. Run the command again.

Why this helps:
- keeps one action per step
- makes progress easy to track
- reduces the chance of skipping a step

## Descriptive rewrite

**Before:** The reporting workflow is designed to provide users with improved visibility into shipment delays.

**After:** The reporting workflow shows users where shipments are delayed.

Why this helps:
- replaces abstraction with a concrete result
- removes inflated phrasing
- keeps the same meaning

## Incident or status update rewrite

**Before:** We have identified an issue that may have impacted some users during the deployment window.

**After:** During the deployment window, some users could not complete requests.

Why this helps:
- states the effect directly
- removes hedged corporate phrasing
- keeps uncertainty bounded to what is actually unknown

## Support or operational reply

**Before:** It looks like there may be an authentication-related issue that could be affecting your ability to sign in. Please try clearing your browser cookies and cache.

**After:** Clear your browser cookies, then sign in again. The current session data may be invalid.

Why this helps:
- leads with the next action
- keeps the cause short and usable
- removes apology-style padding

## Error explanation pattern

**Before:** The process failed due to an issue with the uploaded file.

**After:** The upload failed because the file format is not supported. Upload a CSV or JSON file.

Why this helps:
- names the failure
- gives the cause if known
- ends with a clear next action

## Email or internal communication rewrite

**Before:** I just wanted to reach out and let you know that we are still waiting on the API key from the vendor, so the integration work is a little blocked right now.

**After:** We are still waiting on the vendor's API key, so the integration is blocked.

Why this helps:
- moves the update to the front
- removes throat-clearing
- preserves the relationship-neutral tone

## Voice-preserving rewrite

**Before:** We are absolutely thrilled to announce that our tiny team finally shipped the update we have been dreaming about for months.

**After:** We are thrilled to share the update our small team has worked toward for months.

Why this helps:
- keeps warmth and momentum
- removes inflation, not personality
- preserves promotional intent without over-flattening the line

## Audit example

**Source:** In order to ensure that users are able to successfully complete onboarding, the system should provide guidance that is intuitive and user-friendly.

**Audit finding:**
- **Category:** filler and weak modality
- **Source text:** "In order to ensure," "should provide guidance," "intuitive and user-friendly"
- **Risk:** The sentence hides whether this is a requirement or a descriptive claim. It also uses filler and vague quality terms.
- **Brief note:** If this is a requirement, the final rewrite should state the obligation directly. If it is product copy, the final rewrite should state the current behavior.

## Audit example with severity ordering

**Summary:** The passage buries the required action, uses weak modality, and mixes explanation with instruction.

**Highest-risk issue:** The reader may miss the required step because the command is hidden inside a long sentence.

**Finding:**
- **Category:** procedural structure
- **Source text:** "You may want to rotate the key after the deploy if the old secret is still active in production."
- **Risk:** The required action is easy to miss because the condition and command are buried in weak modality.
- **Brief note:** A rewrite should put the condition first and make the action explicit.

## Hybrid technical rewrite

**Before:** This guide helps teams get aligned on architecture decisions while providing a comprehensive overview of the system in a way that is approachable for both engineers and stakeholders.

**After:** This guide helps teams align on architecture decisions. It gives engineers and stakeholders a clear system overview.

Why this helps:
- keeps the persuasive value
- splits the abstract promise into direct claims
- stays readable without flattening the purpose

## Casual request where heavy structure would be wrong

**User asks:** "can you clean this up but keep it friendly?"

**Good response shape:**
- keep the warmth
- remove filler and repetition
- make the point easier to scan
- do not force numbered steps unless the text is actually procedural

This reminder helps you avoid over-applying technical or ADHD-oriented structure to simple human communication.

## Reusable example patterns

Use these patterns from this reference:
- before/after pairs for the same sentence or paragraph
- one instruction per step
- condition first, then action
- state the failure, the cause, and the next action
- show why a rewrite is better, not just that it is shorter

Do not copy examples too literally when they depend on:
- product-specific names
- commands or file paths from another project
- timestamps, metrics, or incidents from another system

## When to use this file

Use this file when:
- the request is ambiguous and a concrete pattern will help you choose the right mode
- the text mixes clarity goals with voice-sensitive constraints
- a procedural or support rewrite needs a quick anchor before drafting
- the model is over-correcting toward rigidity and needs examples of when to stay light
```

## Summary
- Task: Audit and rewrite behavior-defining prose for `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager` in strict mode, excluding frontmatter, and write the report only
- Output mode: audit plus rewrite
- Rewrite mode: mode=strict
- Artifact set reviewed: `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/SKILL.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/checklist.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/ste-rules.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/use-cases.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/examples.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/substitutions.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/adhd-patterns.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/rfc-2119.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/README.md`, `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/CHANGELOG.md`

## What changed
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/SKILL.md`
  - Changed: no
  - Why: Report-only run. Rewrite proposed without editing source files.
  - Notes: Proposed a strict-mode structural tightening after frontmatter only. The rewrite keeps trigger coverage, mode logic, output logic, and untouchables intact while making the workflow easier to scan.

## Other artifact-set files
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/examples.md`
  - Changed: no
  - Why: Report-only run. Rewrite proposed without editing source files.
  - Notes: Proposed audit-example wording that separates findings from rewrite output more cleanly.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/checklist.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already preserves the same verification workflow with strong scanability and low sentence-level drift risk.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/ste-rules.md`
  - Changed: no
  - Why: Rewrite would add drift risk without meaningful clarity gain
  - Notes: The file is long, but its sectioned reference format already supports selective loading and strict-mode use.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/use-cases.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file already separates contexts clearly and stays aligned with the default-versus-strict mode model.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/substitutions.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The guidance is compact, behaviorally clear, and already structured around exact modality and wording checks.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/adhd-patterns.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The action-first guidance is already clear and consistent with the core skill.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/references/rfc-2119.md`
  - Changed: no
  - Why: Already near minimum safe form
  - Notes: The file is tightly bounded and already uses precise obligation language.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/README.md`
  - Changed: no
  - Why: Out of scope for behavior-defining prose rewrite in this stage
  - Notes: Reviewed for cross-file consistency only. No source edits proposed.
- `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager/CHANGELOG.md`
  - Changed: no
  - Why: Out of scope for behavior-defining prose rewrite in this stage
  - Notes: Reviewed for version-history context only. No source edits proposed.

## Behavior check
- Trigger coverage: preserved
- Workflow semantics: preserved
- Guardrail strength: preserved
- Exact technical references: preserved

## Risks or limits
- Frontmatter was intentionally excluded from both audit findings and rewrite content, per instruction.
- No sibling `AGENTS.md` exists in `/Users/brandon.pierce/Projects/agent-skills/skills/accelint-english-manager`.
- This was a report-only run. The proposed rewrites were not applied to source files.
- No other artifact-set files changed.
