# STE-style rules for technical clarity

Use this reference when the request is technical, procedural, instructional, or explicitly asks for STE or ASD-STE100-style writing.

This is a working synthesis, not an official copy of the ASD dictionary.

## 1. Start by classifying the passage

| Type | Purpose | Main form | Default limit |
|---|---|---|---|
| Procedural | Tell the reader what to do | Imperative | 20 words per sentence when feasible |
| Descriptive | Explain what something is, does, or what happened | Simple present/past/future | 25 words per sentence when feasible |

Do not mix the two carelessly.

- Procedures instruct.
- Descriptions explain.
- A note inside a procedure is descriptive.

## 2. Vocabulary discipline

### One concept, one term

Pick one word for each repeated concept and keep it.

Examples:

- check / verify / confirm / validate / ensure
- config / settings / options / configuration
- run / execute / invoke / launch

### Prefer common words when accuracy survives

- use short, familiar words
- avoid slang and decorative jargon
- avoid turning nouns into verbs when plain English gives a better verb

**Before:** We will leverage the configuration to facilitate validation.
**After:** We will use the configuration to check the result.

### Keep technical terms when needed

A domain term is legal when it is the clearest accurate term.

Examples:

- webhook
- endpoint
- deploy
- compile
- hydrate

If a technical term may confuse the intended reader, define it once or link to its definition.

## 3. Verb discipline

Prefer:

- imperative for procedures
- simple present, simple past, simple future for explanation
- active voice by default

Avoid when plain alternatives exist:

- progressive clutter: "is being updated"
- perfect constructions that blur time: "has been failing"
- noun-heavy action phrases: "perform a validation"

**Before:** The migration has been running and the table is being rebuilt.
**After:** The migration started. The database rebuilds the table.

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
- short noun groups
- one topic per paragraph
- short paragraphs for scanability

Break long noun chains with prepositions.

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

**Before:** Data loss may occur if you use `--force` in production.
**After:** CAUTION: Do not use `--force` in production. The flag can delete live data.

## 8. Avoid filler and AI-slop markers

Common patterns to delete or rewrite:

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

## 9. Keep grammar complete

Plain English is not telegraph style.

Keep:

- articles where needed
- explicit subjects
- the word "that" when it prevents ambiguity

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

## 11. When strictness should relax

Relax these rules when the user explicitly wants:

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
