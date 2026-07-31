# accelint-persona-review audit report

## Grade
B+

## Summary
The skill has a solid core: clear purpose, relevant persona artifacts, and a useful evaluation framework grounded in operator workflows rather than generic UX advice. The main gaps were trigger coverage, ambiguity around evidence handling and fallback behavior, and light drift between the primary skill contract and the README.

## Findings
- Strength: The skill strongly emphasizes persona-specific critique and operational context.
- Strength: The reference set is focused and supports progressive disclosure well.
- Finding: The frontmatter description under-described when the skill should trigger, especially for broader persona-based review requests that do not explicitly mention a persona ID.
- Finding: The workflow did not clearly distinguish observed evidence from inference, which could lead to overstated conclusions during screenshot-only reviews.
- Finding: Fallback behavior for missing MCP context existed, but the output expectations did not consistently require scope-limit callouts.
- Finding: README wording lagged the skill contract in a few places, especially around fallback paths and review outputs.

## Applied optimizations
- Expanded `SKILL.md` description to improve trigger coverage for persona-based UX reviews, role-specific interface critique, and operator-workflow fit assessments.
- Tightened workflow steps to clarify persona-ID handling, review-scope capture, Figma fallback expectations, and Outline-source prioritization.
- Added explicit guidance to separate persona evidence, design evidence, supporting-doc evidence, and inference.
- Refined the output structure to require a clearer scope summary, operational summary, prioritized findings, and explicit uncertainty when evidence is incomplete.
- Updated evaluation principles and review guardrails to reinforce evidence discipline and operationally grounded recommendations.
- Aligned `README.md` with the revised skill behavior, including screenshot fallback and missing-documentation fallback.

## Changed files
- `skills/accelint-persona-review/SKILL.md`
- `skills/accelint-persona-review/README.md`
- `runs/accelint-persona-review/audit-report.md`
