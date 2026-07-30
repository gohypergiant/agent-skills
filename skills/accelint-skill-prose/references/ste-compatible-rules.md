# STE-compatible rules for skill prose

Use this reference when editing behavior-defining prompt artifacts and you want the clarity benefits of Simplified Technical English without importing its full controlled-language regime.

Load this reference when sentence-level clarity problems, synonym drift, hidden omissions, or procedure-versus-description confusion are part of the task.

This is a distilled, skill-specific adaptation. It is not the ASD-STE100 document, and it is not a substitute for preserving behavior.

## What this reference is for

Use these rules to make skill prose:

- easier to read
- less ambiguous
- more consistent
- safer to edit without changing behavior

These rules are subordinate to the main skill contract:

1. Preserve trigger coverage
2. Preserve workflow semantics
3. Preserve guardrail strength
4. Preserve exact technical meaning
5. Improve clarity
6. Improve brevity only when it is safe

## 1. Keep one term for one concept

Pick one term for each behavior-bearing concept and keep it.

Examples:

- trigger coverage
- workflow semantics
- guardrail strength
- exact reference
- audit only
- rewrite only

Do not rotate terms for style if the terms might suggest different scope or force.

## 2. Keep the intended meaning, not just the topic

A rewrite is unsafe if it preserves the topic but changes what the text allows, requires, or prevents.

Pay special attention to verbs and qualifiers that carry behavior:

- must
- should
- may
- never
- do not
- before
- after
- unless
- only if
- required
- optional

If the rewrite changes timing, permission, scope, or obligation level, it changed behavior.

## 3. Prefer short, explicit sentences

Use short sentences when they improve clarity.

Good uses:

- split stacked conditions
- separate rationale from the command it supports
- separate two different obligations into two sentences

Do not shorten mechanically. If a longer sentence is carrying a necessary boundary, keep it or rewrite it carefully.

## 4. Do not omit words just to sound concise

Keep required subjects, verbs, nouns, and articles when dropping them would make the meaning less exact.

Risky compression patterns include:

- dropping the actor
- dropping the object of a rule
- dropping an article that distinguishes a general case from a specific case
- collapsing two conditions into one vague sentence

In behavior-defining prose, concise but underspecified is worse than slightly longer and exact.

## 5. Prefer active voice, but keep passive when meaning requires it

Active voice usually makes behavior clearer.

**Before:** The description can be tightened after the trigger phrases are reviewed.
**After:** Review the trigger phrases, then tighten the description.

Keep passive wording when the actor is unknown, intentionally unspecified, or when active voice would distort scope.

## 6. Separate procedures from descriptions

Procedural text tells the agent what to do. Descriptive text explains what something means, why a rule exists, or when a rule applies.

Use imperative wording for real steps. Use descriptive wording for explanation, policy, rationale, and scope.

Do not force descriptive or policy text into commands if that would make the rule sound narrower, broader, or more executable than intended.

## 7. Put the condition before the command when it helps

When a rule depends on a condition, put the condition first if doing so makes the logic clearer.

**Before:** Split the sentence if the trigger phrase is buried.
**After:** If the trigger phrase is buried, split the sentence.

Do not reorder text if the original sequence carries timing or emphasis that matters.

## 8. Use notes for information, not hidden requirements

If a point is required for correct behavior, do not bury it in a note-like aside. Move it into the main instruction.

Use note-style text for:

- context
- explanation
- rationale
- examples

Do not use note-style text for:

- mandatory steps
- approval gates
- hard limits
- hidden conditions

## 9. Keep technical and repo-specific terms when they are the precise terms

Apply this across the skill's linked file set when the task covers a whole skill. If `SKILL.md` and `references/` use different terms for the same behavior-bearing concept, normalize them deliberately rather than letting synonym drift persist across files.

Do not replace exact repo vocabulary with plainer but broader wording.

Preserve terms such as:

- file names and paths
- commands and flags
- field names and keys
- identifiers
- exact tokens
- workflow labels

Prefer clarity around the term, not substitution of the term.

## 10. Keep lists behaviorally clean

Use lists to make multi-part logic easier to scan.

Good list items are parallel and bounded.

Do not mix different functions in one list when the distinction matters. In particular, keep these separate when possible:

- instructions
- descriptions
- warnings
- examples
- exceptions

## 11. Keep warnings direct

When text prevents breakage, drift, or unsafe execution, say that directly.

Good pattern:

- command or prohibition
- what can go wrong

**Example:** Do not paraphrase exact references just because the paraphrase sounds cleaner. The paraphrase can change behavior.

## 12. Prefer no rewrite over unsafe rewrite

If the safest edit is to leave the wording alone, say so.

This is not a failure. It is correct behavior for high-risk prose.

## When not to apply these rules mechanically

Relax or adapt these rules when:

- exact wording is itself part of the behavior
- a rationale sentence prevents policy drift
- an example defines scope
- a longer phrase is the precise technical term
- the user asked for audit only
- forcing brevity would weaken obligation strength

## Final check

Before you deliver, run the fuller verification in `checklist.md`.

For this reference, confirm these sentence-level checks:

1. Did any sentence get shorter but less precise?
2. Did you turn explanation into instruction by accident?
3. Did you use STE-like discipline to clarify the prose rather than flatten it mechanically?
