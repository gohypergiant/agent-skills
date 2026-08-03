# Serial-instruction guidance for behavior-defining prose

Use this reference when a skill, prompt, `AGENTS.md`, `CLAUDE.md`, workflow note, or guardrail text contains ordered actions, implied sequence, approval timing, validation loops, or branch logic.

## Why this matters here

In behavior-defining prose, sequence is part of the contract.

If the source says an agent must ask first, wait for approval, load references before rewriting, validate before delivery, or return to an earlier step after a failed check, that order is behavior-bearing. A rewrite that makes the prose cleaner but less ordered is a behavior change.

## Detection pass

Run this pass before you edit workflow-bearing prose.

### 1. Detect explicit serial instructions
Look for:
- numbered lists
- `Step 1`, `Stage 2`, `First`, `Next`, `Then`, `After`, `Finally`
- `before`, `after`, `until`, `once`, `when`, `only then`
- `requires`, `depends on`, `done when`
- `if this fails, return to`
- `do not proceed until`
- approval gates such as `ask first`, `wait for confirmation`, `pause`, `stop`, or `resume`

### 2. Detect implied step ordering
Look for:
- one sentence that contains two or more actions joined by `and`, `then`, or commas
- paragraphs that mix discovery, decision, rewrite, and verification in one block
- warnings that imply a missing gate
- references that must be loaded before a later action is safe
- statements where one action clearly uses the result of an earlier action

### 3. Detect sequencing cues in skill files
Look for:
- output-mode selection before delivery rules
- rewrite-mode selection before rewriting
- artifact discovery before cross-file edits
- reference-loading conditions before rule citation
- self-check requirements before delivery
- approval rules before edits that would broaden scope or change structure

### 4. Detect sequencing cues in general prose
Look for:
- procedural guidance hidden inside paragraphs
- policy or workflow notes that bury a timing rule inside rationale
- branches written as straight lists
- bullets that are really ordered tasks
- banner warnings that try to enforce order without a gate

## Preferred structures

Choose the smallest structure that preserves behavior and makes the order hard to miss.

### 2 to 3 short ordered steps
Use a numbered list.

### 4 or more ordered steps
Use this pattern by default:

### Step 0: Track progress
Use a checklist or task-tracking step before the workflow.

Then use:
- `### Step N: Name`
- `Requires:` for dependencies
- `Done when:` for gates that later steps rely on
- an explicit failure route such as `If this check fails, return to Step 3.`

### Multi-stage workflows
If you need a higher-level container above ordered steps, prefer `## Stage N` or a descriptive section heading. Ordered steps still need their own numbered step headings inside that container.

### Branching workflows
Name each branch and the join point.

Good pattern:
- `If X, go to Step 4a.`
- `If not X, go to Step 4b.`
- `Both branches return to Step 5.`

## Rewrite rules

- Treat one step as one action. Split any step that says `and then`.
- Do not use empty step headings. Every `### Step N: Name` block must contain at least one operational sentence, gate, or completion condition.
- If a step heading only labels a principle, convert that principle into an action the agent or reader can execute.
- Never leave ordered work in plain bullets. Replace plain bullets with ordered steps when the work is not actually optional or unordered.
- Move conditions before actions when that makes timing clearer without changing behavior.
- Replace emphasis-only warnings with enforceable gates when the workflow depends on order.
- Keep approval, validation, and retry logic explicit.
- Keep sequencing cues in the operational file. Move heuristics, examples, and edge cases to references.
- If the source contract is weakly ordered but clearly intends sequence, strengthen the wording. Do not preserve weak sequencing just because it is already present.

## Audit questions

Ask these before you finalize the edit:
1. Could an agent now do these steps out of order and still claim compliance?
2. Did any `ask first`, `wait`, `pause`, `stop`, `return`, or `do not proceed until` rule become softer?
3. Did any step heading stay empty or act only as decoration instead of instruction?
4. Did a paragraph still hide multiple actions that should be separate steps?
5. Did any branch lose its named destination or rejoin point?
6. Did any validation or approval rule stay as emphasis instead of becoming a gate?
7. Would an agent reading only the rewritten text still follow the same order under load?

## Notes for this skill

Load this reference whenever workflow order, approval semantics, guardrail timing, reference-loading order, or validation loops are central to the edit.

For small local edits, keep the main file compact. For heavier sequencing logic, keep the main `SKILL.md` operational and use this reference for the detection pass, structure rules, and edge cases.