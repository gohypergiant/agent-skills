# STE-Compatible Clarity and Usability Rubric

## Scope and authority

Use this rubric as a behavior-preserving clarity lens. It is compatible with selected Simplified Technical English ideas, such as direct wording, stable terminology, explicit conditions, and clear actor/action relationships. It is **not** ASD-STE100 compliance guidance and must not be applied mechanically.

The external Simple English, Orwell-writing, and ADHD-oriented skills that informed this rubric are supplementary examples only. They are not governing standards for behavior-defining prose.

## Audit objective

Evaluate whether target prose is direct, scannable, and actionable while preserving trigger scope, workflow semantics, guardrail strength, rationale, and exact technical anchors.

## Observable criteria

Evaluate and cite the target text for each applicable criterion:

1. **Direct and scannable instruction** — Check whether the action, boundary, or decision is visible without avoidable abstraction, filler, or overloaded sentence structure.
2. **Actors, terms, and referents** — Check that behavior-bearing actors, objects, conditions, and pronouns have clear referents. Keep one term for one concept when the source treats terms as equivalent.
3. **Instruction and explanation separation** — Check that procedures, rationale, examples, notes, and policy statements are distinguishable without converting descriptive text into a new instruction.
4. **Actionable conditions** — Check that conditions and fallback branches are operational enough to guide behavior. Flag qualitative wording only when it acts as a hidden gate, permission slip, exception, or unbounded fallback.
5. **Technical-anchor preservation** — Check that paths, commands, flags, fields, identifiers, inline code, code blocks, quoted text, and scope-defining examples remain exact unless explicitly approved for change.
6. **Precision over mechanical simplification** — Check that sentence splitting, active voice, terminology normalization, or list restructuring does not alter actor, scope, timing, obligation, rationale, or technical precision.

## Grade each category on the shared 0–5 scale

- **0 — Critical behavioral defect:** explicit wording permits, requires, or obscures behavior likely to alter scope, safety, approval, or execution order.
- **1 — Major defect:** a material ambiguity makes correct interpretation unreliable.
- **2 — Needs revision:** a concrete clarity weakness could create drift, but the intended behavior is recoverable.
- **3 — Adequate:** prose is mostly clear; only bounded, lower-risk improvements remain.
- **4 — Strong:** direct, precise, traceable prose with preserved anchors and no material defect.
- **5 — Exemplary:** strong plus exceptionally clear, stable, and low-ambiguity behavior guidance without unnecessary controls.

This local scale prioritizes findings. It is not a validated measurement instrument and must not conceal unresolved evidence.

## Required finding record

For this rubric, record:

- grade and finding state: `finding`, `no issue found`, `unresolved`, or `not applicable with evidence`;
- exact target text and the competing reading, omitted anchor, or ambiguity it creates;
- the behavior risk: scope drift, timing ambiguity, loss of rationale, hidden branch, technical-anchor loss, or unclear action;
- a prioritized, actionable recommendation that names the specific wording, referent, condition, instruction/explanation boundary, or technical anchor to change; explains the trigger, workflow, guardrail, rationale, or exact-anchor behavior that must be preserved; and gives a rewrite action; and
- the change classification: wording-only, behavior-preserving structural rewrite, or approval-required change.

## Recommendation and approval rules

- A **wording-only** recommendation may remove filler, clarify a referent, split an overloaded sentence, or make an existing condition/action relationship visible without changing behavior.
- A **behavior-preserving structural rewrite** may separate existing instructions, rationale, warnings, and examples when the current organization itself causes skipping or ambiguity. It must preserve the source contract and disclose the structural change.
- An **approval-required** change alters trigger coverage, workflow order, guardrail strength, exact technical meaning, or a repository-defined approval boundary.
- Recommend **no change** when compact or unusual source wording is the safest way to preserve an exact anchor, rationale, format, or behavior.

## Remediation guide

| Finding | Concrete remediation |
|---|---|
| Action is buried in abstraction | Lead with the existing action or boundary; retain source conditions and rationale. |
| Pronoun or term has competing referents | Name the source-supported noun consistently; do not merge terms that may differ in scope or permission. |
| Explanation became a hidden instruction | Separate the existing rationale from the command; do not create a new gate. |
| Qualitative phrase controls a branch | Replace it only with a source-supported operational condition; otherwise report unresolved policy ambiguity. |
| Exact anchor would be paraphrased | Preserve the anchor verbatim and clarify only surrounding prose. |
