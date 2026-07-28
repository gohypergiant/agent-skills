# Skill prose checklist

Run this before you deliver an audit or rewrite.

## 1. Trigger safety

- Would the rewritten description still trigger for the same real requests?
- Did any scope-defining phrase disappear?
- Did any new trigger family appear without an explicit request?
- Did a short description turn into a broader trigger inventory?

## 2. Workflow safety

- Would an agent following only the rewrite behave the same way?
- Did any step move earlier or later?
- Did any approval gate, timing rule, or condition become less clear?
- Did any warning lose the reason the step matters?
- Did any behavior-bearing verb change meaning, such as `stop` → `pause`, `wait` → `delay`, or `must` → `should`?

## 3. Guardrail strength

- Did any `must`, `do not`, `never`, `required`, or `critical` wording get softer?
- Did any prohibition become advice?
- Did any safety caveat disappear?

## 4. Exact-reference safety

Check that these stayed exact unless the user asked otherwise:

- file paths
- commands and flags
- field names and keys
- identifiers
- slash-joined references
- inline code and code blocks
- quoted errors and logs
- cross-reference filenames and section labels
- exact verbs when verb choice defines behavior, permission, or timing

## 5. Vocabulary and synonym control

- Did you pick one term for each repeated concept and keep it?
- Did any accidental synonym drift appear after editing?
- Are scope-defining verbs still the same ones the source used where that distinction matters?

## 6. Audit severity calibration

- If you used severity labels, do they match real behavior risk rather than rhetorical emphasis?
- Is `Critical` reserved for issues likely to materially change trigger routing, workflow behavior, approval handling, or safety boundaries?
- Would a calmer label still communicate the same risk just as well?

## 7. Clarity and tightening

- Is the rewrite clearer, not just shorter?
- Did you remove filler without removing behavior?
- Did you split overloaded sentences without changing order?
- Did you keep examples that define scope?
- Did you preserve rationale sentences that explain a guardrail, checkpoint, or timing rule?

## 8. Output-mode compliance

- If the request was audit-only, did you avoid rewriting the full passage?
- If the request was rewrite-only, did you avoid prepending audit notes?
- If the safest result was no rewrite, did you say so explicitly instead of forcing a cosmetic edit?

## 9. Final question

- Is this behaviorally safer than an ordinary prose edit?
- If risk remains, should you revise less or recommend no rewrite?

