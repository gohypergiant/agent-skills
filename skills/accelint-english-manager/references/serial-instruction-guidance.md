# Serial-instruction guidance

Use this reference when the text contains ordered actions, implied sequence, gating, or workflow-like prose that can fail if an agent reads it as unordered advice.

## What to detect

Check for explicit serial instructions first.

Common signals:
- numbered steps
- `Step 1`, `Stage 2`, `First`, `Next`, `Then`, `After that`, `Finally`
- `before`, `after`, `until`, `once`, `when`, `only then`, `do not ... until`
- `requires`, `depends on`, `done when`, `if this passes, continue`
- branch markers such as `if`, `otherwise`, `else`, `skip`, `return to`

Then check for implied sequence.

Common signals:
- one sentence contains two or more actions joined by `and`, `and then`, `then`, or commas
- a warning tells the reader to validate, review, confirm, or approve before a later action
- a paragraph mixes setup, execution, validation, and delivery in one block
- a list uses bullets for work that is actually ordered
- the text assumes an output from one action is needed by the next action

Also check for sequencing cues in skill files and other prompt artifacts.

Common signals:
- trigger text that implies an audit before a rewrite
- workflow sections that tell the agent to ask first, then choose a mode, then edit
- approval rules that require the user to confirm before a later action
- reference-loading rules that depend on the request type or risk level
- self-check sections that must happen before delivery

Also check for sequencing cues in general prose.

Common signals:
- instructions for a user to follow
- onboarding, support, setup, incident, or release notes that hide action order in paragraphs
- explanatory prose that contains real commands or gates inside the explanation
- normative or procedural text where order affects safety, correctness, or obligation

## What to do when sequence matters

Use the smallest structure that makes the order hard to miss.

### Step 1: Choose the structure by workflow size
Use a numbered list for 2 to 3 short steps.
Use `### Step 0: Track progress`, then `### Step N: Name`, for 4 or more ordered steps.
Done when: the workflow shape has one explicit ordered structure.

### Step 2: Add dependency and gate markers
Requires: Step 1 is complete.
Add `Requires:` when a step depends on an earlier step.
Add `Done when:` when later work depends on a successful check.
Add an explicit failure route such as `If this fails, return to Step 3.`
Done when: later steps cannot start without their named prerequisite or passing check.

### Step 3: Add stage containers only when the workflow needs them
Requires: Steps 1 and 2 are complete.
If you need a higher-level container above ordered steps, prefer a neutral section label such as `## Stage N` or a descriptive heading. Put ordered steps inside the container. Give the container an exit condition when the outcome matters.
Done when: the stage container adds grouping without hiding step order.

### Step 4: Name every branch destination
Requires: Steps 1 to 3 are complete when branching exists.
Do not leave a branch implied.

Good pattern:
- `If X, go to Step 4a.`
- `If not X, go to Step 4b.`
- `Both branches return to Step 5.`

Done when: every branch names its next step and rejoin point.

## Rewrite rules

- One step is one action. Split any step that says `and then`.
- Do not use empty step headings. Every `### Step N: Name` block must contain at least one operational sentence, gate, or completion condition.
- If a step heading only labels a principle, convert that principle into an action the reader or agent can execute.
- Put the condition before the action when that makes timing easier to follow.
- Replace emphasis-only warnings with enforceable gates when the text really depends on order.
- Never leave ordered work in plain bullets.
- Do not merge setup, action, validation, and delivery into one instruction.
- Keep sequence visible in the main artifact. Move heuristics, examples, and edge cases to a reference file.

## Delivery checks

Before you deliver, confirm this in order:
1. Every ordered action is visible as an ordered action.
2. No step heading is empty or purely decorative.
3. Every dependent step names what must be true first.
4. Every validation or approval gate blocks the later step clearly.
5. Every branch names its next step.
6. The final text cannot be read as `do these in any order` when order matters.
7. Any checklist or progress-tracking instruction appears before the workflow it tracks.

If any check fails, fix the earliest failed item first, then rerun the later checks.

## Notes for this skill

Apply this reference when you are rewriting or auditing:
- procedures
- support instructions
- operational notes
- prompts or agent instructions
- any prose where the reader must act in sequence

When sequence is weak but real, make it explicit. Do not preserve a soft, paragraph-shaped workflow just because it sounds natural.