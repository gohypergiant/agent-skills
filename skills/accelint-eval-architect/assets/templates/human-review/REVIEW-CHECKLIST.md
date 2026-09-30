# Review checklist — __SKILL_NAME__

Repeatable human-review rubric. Use one copy per output reviewed. This skill's
output is taste-based; no LLM judge scores the judgment section.

Reviewer: ______________   Date: ____________   Input reviewed: ______________

## Automated gate (must pass before human review)
<!-- Deterministic checks that CAN be automated. If an evals/ harness exists,
     these are run there; list them so the reviewer confirms they passed. -->
- [ ] __DETERMINISTIC_CHECK_1__
- [ ] __DETERMINISTIC_CHECK_2__

## Human judgment (no judge should score these)
For each dimension, mark Poor / OK / Good and add one sentence of why.
<!-- Derive dimensions from the skill's purpose and its NEVER section: those
     anti-patterns are exactly what a reviewer confirms the output avoided. -->

| Dimension | Poor · OK · Good | Note |
|---|---|---|
| __TASTE_DIMENSION_1__ | | |
| __TASTE_DIMENSION_2__ | | |
| __TASTE_DIMENSION_3__ | | |

## Verdict
- [ ] Ship
- [ ] Revise (notes above)
- [ ] Reject
