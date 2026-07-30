# Use cases and adaptation notes

Use this reference to adapt the core writing method to different contexts. Do not flatten everything into the same style.

The core defaults still apply:
- preserve meaning and constraints
- state the point early
- use direct concrete wording
- keep terms stable
- keep the text easy to scan
- preserve real nuance

## Technical documentation

Default mode: `mode=default`

Escalate to `mode=strict` when the user asks for STE-style discipline or when the text is high-consequence and tightly controlled.

Use:
- direct wording
- stable terminology
- short sentences
- procedural vs descriptive separation
- exact preservation of commands and identifiers

Best for:
- READMEs
- setup guides
- architecture docs
- API guides
- release notes

## Runbooks and operational procedures

Default mode: often `mode=strict`

Use:
- imperative steps
- one action per step
- condition before command
- warning before risk
- numbered procedures

This context benefits strongly from stronger STE-style structure and stronger ADHD-friendly shaping.

## Error messages and support answers

Default mode: `mode=default`

Pattern:
1. state what happened
2. state the cause if known
3. state the next action

Preserve warmth when the user wants it. Keep the answer easy to act on.

## Incident reports and status updates

Default mode: `mode=default`

Use:
- time-bounded facts
- simple present or simple past
- one main fact per sentence
- direct wording instead of hedged corporate phrasing

**Before:** "We have identified an issue that may have impacted some users."
**After:** "Some users could not complete requests during the deployment window."

## Emails and internal communication

Default mode: `mode=default`

Use:
- direct ask or update early
- remove throat-clearing
- keep tone appropriate to the relationship
- preserve warmth if the sender wants warmth

## Persuasive or hybrid technical writing

Default mode: `mode=default`

Use this section for writing that must be technically clear but still needs persuasion, trust, or brand fit.

Examples:
- RFC summaries
- architecture overviews
- design proposals
- product docs near marketing surfaces
- onboarding copy for developer tools

Use:
- direct claims supported by facts
- stable technical terms
- plain wording for the recommendation or benefit
- preserved warmth, rhythm, or confidence when those moves help the text do its job

Do not flatten these texts into dry manuals unless the user asked for strict technical tone.

## UI copy and empty states

Default mode: `mode=default`

Use:
- short body copy
- one action per line
- concrete labels
- no decorative filler

**Example:** "No projects yet. Create a project to start."

## Creative or voice-sensitive writing

Default mode: `mode=default`

Use the discipline as a filter, not a mold.

Keep:
- deliberate rhythm
- character voice
- meaningful ambiguity
- rhetorical force
- warmth, humor, or persuasion when intentionally requested

Still remove:
- inherited clichés
- evasive padding
- fake sophistication
- abstraction that weakens the line

## ADHD-friendly chat or coaching output

Default mode: `mode=default`, plus `references/adhd-patterns.md` when the reader needs stronger execution shaping

Use:
- action first
- numbered steps when the task is genuinely multi-step
- visible progress when the exchange spans multiple turns
- one concrete next action when something remains open
- short lists

## Where not to force strictness

Do not force `mode=strict` onto:
- poetry
- fiction
- marketing pages
- brand voice work
- speeches that rely on rhythm and repetition

In those cases, improve clarity without erasing the form.