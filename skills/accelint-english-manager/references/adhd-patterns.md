# ADHD-friendly output patterns

Use this reference when the user explicitly asks for ADHD-friendly output, when the reader needs highly actionable formatting, or when a response will be used under stress, low focus, or high task-switching.

These patterns shape delivery. They do not override the user's meaning or explicit tone constraints.

## Why this works

Assume these reader constraints:

1. Working memory is limited.
2. Starting is often the hardest step.
3. Vague time and scope estimates are hard to act on.
4. Tangents compete with the main task.
5. Visible progress increases follow-through.

## Core patterns

### 1. Lead with the next action

The first line should help the reader do something now.

- start with the command, path, decision, or first step
- do not start with a preamble
- context comes after the action

**Bad:** "Great question. There are a few things to consider first."
**Better:** "Open `src/auth.ts`, then replace `verifyToken`."

### 2. Number multi-step work

When the reader must do more than one thing:

- use a numbered list
- keep each step bounded
- avoid stacking many actions into one step

### 3. Restate current state

Across turns, restate what is done and what is next.

Good pattern:

- Step 2 of 4 done: config updated.
- Next: run the migration.

### 4. End with one concrete next action

If work remains open, end with one thing the reader can do in under two minutes.

Examples:

- Run `npm test`.
- Open `README.md`.
- Paste the first error line.

### 5. Suppress tangents

If a second issue appears:

- finish the current issue first
- mention the second issue briefly only if it matters now
- otherwise surface it after the main fix

### 6. Make progress visible

Name what now works.

**Weak:** "I made several updates."
**Better:** "Login now works with magic links."

### 7. Give specific time estimates

Use concrete ranges when estimates help execution.

- "5 minutes"
- "about 20 minutes if tests already exist"
- "an afternoon if the schema also changes"

Avoid:

- "some work"
- "a bit"
- "should be quick"

### 8. Use matter-of-fact error language

State:

1. what failed
2. why, if known
3. what to do next

Avoid:

- "Uh oh"
- apology filler
- vague sympathy that hides the fix

## Turn-shaping rules

Default response shape for operational help:

1. next action
2. numbered steps if needed
3. only the context required to act safely
4. visible result or one remaining next action

## When to relax these patterns

Relax or adapt them when:

- the user asked for a full explanation or walkthrough
- the text is creative or rhetorical by design
- a warm tone is an explicit requirement
- a destructive action needs confirmation first
- the real answer is a ranked option set, not one action path

## Pre-send cleanup

Delete when they add no value:

- preambles
- recap paragraphs
- vague closers
- by-the-way sidebars
- idioms that hide the literal action
