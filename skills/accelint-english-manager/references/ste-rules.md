# STE-style rules for technical clarity

Use this reference when the request is technical, procedural, instructional, or explicitly asks for STE or ASD-STE100-style writing. It is the main overlay for `mode=strict`.

Load only the section or rule group that the current request needs. You do not need this whole file for every strict request.

This is a software-oriented, STE-inspired synthesis for technical clarity and LLM-output cleanup. It is not an official copy of the ASD dictionary and does not claim compliance.

## 1. Start by classifying the passage

| Type | Purpose | Main form | Default limit |
|---|---|---|---|
| Procedural | Tell the reader what to do | Imperative | 20 words per sentence when feasible |
| Descriptive | Explain what something is, does, or what happened | Simple present/past/future | 25 words per sentence when feasible |

Do not mix the two carelessly.

- Procedures instruct.
- Descriptions explain.
- A note inside a procedure is descriptive.
- A safety instruction prevents harm and must not be hidden inside a note or ordinary description.

## 2. Vocabulary discipline

### One concept, one term

Pick one word for each repeated concept and keep it.

Examples:

- check / verify / confirm / validate / ensure
- config / settings / options / configuration
- run / execute / invoke / launch

Repeated clarity is better than stylistic variation, especially in technical and procedural text.

### Prefer common words when accuracy survives

- use short, familiar words
- avoid slang and decorative jargon
- avoid turning nouns into verbs when plain English gives a better verb
- do not replace a term just because a synonym sounds friendlier

**Before:** We will leverage the configuration to facilitate validation.
**After:** We will use the configuration to check the result.

Choose the clearest word for the exact meaning in context. Do not treat plain language as a mechanical synonym swap.

### Keep technical terms when needed

A domain term is legal when it is the clearest accurate term.

Examples:

- webhook
- endpoint
- deploy
- compile
- hydrate

If a technical term may confuse the intended reader, define it once or link to its definition. Do not replace an official or canonical technical name with a friendlier phrase if that would reduce precision.

### Keep one meaning and one grammatical role when possible

When a word has multiple common meanings, choose wording that makes the intended meaning obvious.
Avoid broad verbs when a narrower verb would be clearer.
Avoid turning nouns into verbs or verbs into nouns unless that form is established and accurate in the domain.

### Prefer internationally clear wording

When two phrasings are equally correct, prefer the one that is easier for non-native readers to understand and easier to translate.

Prefer:

- stable terminology over stylistic variety
- explicit actors, conditions, and results over implied meaning
- repeated clarity over natural-sounding variation
- a rewritten sentence over a risky one-word substitution

## 3. Verb discipline

Prefer:

- imperative for procedures
- simple present, simple past, simple future for explanation
- active voice by default

Avoid when plain alternatives exist:

- progressive clutter: "is being updated"
- perfect constructions that blur time: "has been failing"
- noun-heavy action phrases: "perform a validation"
- phrasal verbs when a clearer direct verb exists
- "-ing" clause chains that compress too many actions into one sentence

**Before:** The migration has been running and the table is being rebuilt.
**After:** The migration started. The database rebuilds the table.

Prefer active voice, but passive can be acceptable in descriptive writing when the actor is unknown or irrelevant and active phrasing would reduce accuracy.

Use a different sentence structure when a direct word swap would distort the meaning.

## 4. Condition before command

When an instruction depends on a condition, put the condition first.

**Before:** Increase the timeout if the network is slow.
**After:** If the network is slow, increase the timeout.

This is especially important for:

- warnings
- dangerous commands
- prompts and interface instructions
- operational runbooks

## 5. Short sentences and bounded paragraphs

Prefer:

- one main action or fact per sentence
- one topic or subject per descriptive sentence
- short noun groups
- one topic per paragraph
- short paragraphs for scanability

Target a maximum of 20 words for procedure steps and 25 words for descriptive sentences. Exceed that only when splitting would reduce accuracy or readability.

Break long noun chains with prepositions.
Preserve official long names on first mention. Then shorten carefully or use an established abbreviation if that improves clarity.
Use hyphens only when they clarify grouping.

**Before:** connection pool timeout configuration value
**After:** timeout value for the connection pool

## 6. One instruction per step

In procedures:

- use one instruction per step or sentence
- split sequences that hide multiple actions
- use numbered steps for multi-step tasks

**Before:** Open the file, find the setting, update it, and rerun the command.
**After:**
1. Open the file.
2. Find the setting.
3. Update the setting.
4. Run the command again.

## 7. Warnings and cautions

Put the command or condition first. Then state the risk.

- Use the higher-severity category when both personal harm and equipment or data damage are possible.
- State the hazard or result concretely, not as abstract seriousness.
- Do not hide a safety instruction inside a note or a descriptive paragraph.

**Before:** Data loss may occur if you use `--force` in production.
**After:** CAUTION: Do not use `--force` in production. The flag can delete live data.

## 8. Avoid filler and AI-slop markers

Delete or rewrite these common patterns:

- it is worth noting that
- crucially
- simply
- seamlessly
- robust
- powerful
- comprehensive
- aims to
- designed to
- under the hood
- out of the box

Replace them with facts or delete them.
Do not "humanize" technical text by adding warmth, motion, or conversational filler unless the user asked for that effect.

## 9. Keep grammar complete

Plain English is not telegraph style.

Keep:

- articles where needed
- explicit subjects
- explicit verbs
- the word "that" when it prevents ambiguity
- full wording when omission would confuse a global reader
- no contractions in technical prose
- explicit noun references when pronouns such as "this," "it," or "they" could point to more than one thing

**Too thin:** Ensure file exists before running.
**Better:** Make sure that the file exists before you run the command.

## 10. Preserve untouchables

Do not rewrite:

- code
- commands
- identifiers
- file paths
- quoted errors
- config keys
- product names

## 11. Rewrite the construction, not just the word

If a one-word replacement changes the meaning, sounds unnatural, or forces the wrong part of speech, rewrite the sentence.

Common cases:

- an adjective must become a verb phrase
- a noun-heavy sentence must become an action sentence
- a synonym is close in tone but wrong in meaning
- a direct replacement keeps the grammar but loses the real instruction or result
- a long sentence mixes instruction, explanation, condition, and result

Prefer a clear reconstruction over a technically simpler but misleading sentence.

## 11A. Notes carry information, not action

Use notes only for supporting information.
Do not put required actions, pass/fail limits, or safety-critical behavior in a note.
If the reader must do it, move it into the step.
If it prevents harm, move it into a safety instruction.

## 12. Writing practices for cleanup

When you clean up technical prose:

- restructure when substitution fails
- do not assume a familiar English word has the right meaning in technical context
- avoid idiomatic phrasal verbs when a more literal verb is clearer
- keep terminology and sentence style consistent across repeated actions
- use "that" when it prevents ambiguity
- prefer explicit noun reference over vague pronouns
- avoid Latin abbreviations in technical prose when plain English is clearer
- prefer inclusive neutral wording when it fits the meaning
- avoid semicolons in technical mode because they often hide overloaded sentences
- use hyphens to bind compound modifiers when they reduce ambiguity
- do not overload list introductions before the colon

## 13. Practical extensions beyond classic STE

These extra rules are practical software-documentation and LLM-cleanup adaptations, not formal STE doctrine:

- avoid filler and AI-slop markers
- preserve code-like untouchables exactly
- relax for explicitly requested warmth, brand tone, or dialogue realism

## 14. How this overlay fits the core skill

Use this overlay strongly for:

- procedures
- runbooks
- troubleshooting steps
- support instructions
- product and process documentation
- release and migration notes
- LLM-generated technical drafts that need stabilization
- explicit `mode=strict` requests

Stay in the core default method, or relax this overlay, when the user explicitly wants:

- creative voice
- brand tone
- warmth or empathy
- persuasive rhythm
- dialogue realism

Even then, keep the strongest principles:

- cut filler
- avoid stale phrasing
- keep syntax clear
- preserve meaning
- do not let voice create ambiguity
