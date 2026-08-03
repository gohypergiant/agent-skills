# Serial-instruction guidance

Use this reference when the text contains ordered actions, implied sequence, gating, or workflow-like prose that can fail if an agent reads it as unordered advice.

## What to detect

Check for explicit serial instructions first.

Common signals:
- numbered steps
- `Step 1`, `Phase 2`, `First`, `Next`, `Then`, `After that`, `Finally`
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

### For 2 to 3 short steps
Use a numbered list.

### For 4 or more ordered steps
Use this pattern by default:
1. Add `### Step 0: Track progress`.
2. Put a checklist under Step 0.
3. Convert each ordered action into `### Step N: Name`.
4. Add `Requires:` when a step depends on an earlier step.
5. Add `Done when:` when later work depends on a successful check.
6. Add an explicit failure route such as `If this fails, return to Step 3.`

### For phases
Use `## Phase N` only as a container. Put ordered steps inside the phase. Give the phase an exit condition when the outcome matters.

### For branches
Name the branch destination. Do not leave a branch implied.

Good pattern:
- `If X, go to Step 4a.`
- `If not X, go to Step 4b.`
- `Both branches return to Step 5.`

## Rewrite rules

- One step is one action. Split any step that says `and then`.
- Put the condition before the action when that makes timing easier to follow.
- Replace emphasis-only warnings with enforceable gates when the text really depends on order.
- Never leave ordered work in plain bullets.
- Do not merge setup, action, validation, and delivery into one instruction.
- Keep sequence visible in the main artifact. Move heuristics, examples, and edge cases to a reference file.

## Delivery checks

Before you deliver, confirm:
1. Every ordered action is visible as an ordered action.
2. Every dependent step names what must be true first.
3. Every validation or approval gate blocks the later step clearly.
4. Every branch names its next step.
5. The final text cannot be read as `do these in any order` when order matters.
6. Any checklist or progress-tracking instruction appears before the workflow it tracks.

## Notes for this skill

Apply this reference when you are rewriting or auditing:
- procedures
- support instructions
- operational notes
- prompts or agent instructions
- any prose where the reader must act in sequence

When sequence is weak but real, make it explicit. Do not preserve a soft, paragraph-shaped workflow just because it sounds natural.