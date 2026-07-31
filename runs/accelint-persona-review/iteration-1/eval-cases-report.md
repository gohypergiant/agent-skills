# accelint-persona-review eval case summary

Generated default non-interactive eval coverage for `skills/accelint-persona-review/evals/evals.json`.

## Coverage overview

- 10 total eval cases
- 8 positive / should-use cases
- 2 negative / near-miss cases

## Positive coverage areas

1. Figma URL review for `air-surveillance-tech` with emphasis on track validation, weather discrimination, sensor-health coordination, and operational prioritization.
2. Loose-role mapping for `weapons-director`, ensuring the skill handles natural language role requests without unnecessary clarification.
3. Screenshot-only fallback for `mission-crew-commander`, with explicit scope-limit handling when Figma MCP is unavailable.
4. Outline-unavailable review for `air-surveillance-tech`, validating fallback behavior when supporting docs cannot be accessed.
5. Ambiguous persona request using "director", ensuring the skill asks for clarification between nearby supported personas.
6. Invalid persona request (`intel analyst`), ensuring the skill does not invent personas and instead offers supported choices.
7. Single-persona scope discipline for `surveillance-tech`, ensuring the skill does not broaden into comparison mode unless asked.
8. Evidence/uncertainty discipline for `senior-director`, ensuring the review distinguishes observed evidence from inference on partial workflows.

## Negative / boundary coverage

9. Generic UI-polish Figma feedback request that should not be treated as a persona-based operator review.
10. Non-design SOP-writing request that should not trigger the persona-review workflow.

## Assertion themes

Assertions across the set check for:

- correct persona selection or clarification behavior
- adherence to Figma / screenshot / Outline fallback rules
- persona-grounded findings tied to responsibilities, systems, comms, and pain points
- operational-impact prioritization over generic UX polish
- actionable recommendations
- uncertainty and evidence-discipline
- refusal to fabricate unsupported personas or force persona review onto near-miss requests
