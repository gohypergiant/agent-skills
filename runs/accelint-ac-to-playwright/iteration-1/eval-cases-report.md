# Eval cases report

Recommended coverage for `accelint-ac-to-playwright`:

1. Clean markdown AC assessment pass — confirms assessment-only behavior and conversion-ready output.
2. Vague action / missing literal assessment fail — catches unsupported verbs and unquoted values.
3. Invalid target naming assessment fail — checks area.component.intent enforcement and controlled vocabulary guidance.
4. Gherkin step-ordering fail — validates Given/When/Then structure handling.
5. Weak expected-outcome fail — rejects implied or non-measurable assertions.
6. Multi-file conversion with one failing file — verifies assessment across all files and whole-workflow stop behavior.
7. Conversion request without output directories — verifies the skill requests required destinations before writing.
8. Markdown conversion success — checks one-file/one-suite and one-bullet/one-test mapping.
9. Gherkin Scenario Outline success — checks row expansion, tag handling, and parameter suffix naming.
10. Playwright guardrail compliance — verifies label-based select behavior, URL assertions, and explicit-only assertions.
11. Keyboard-combo translation — verifies `keyDown` → `press` → `keyUp` sequencing.
12. Ambiguous conversion input — verifies the skill does not guess missing targets or values.

## Risks and gaps
- The highest-risk failures are workflow violations: skipping assessment, partially converting mixed-quality batches, or generating files during assessment mode.
- Referenced-file guidance (`acceptance-criteria.md`, `test-hooks.md`) may need transcript-aware evals to confirm the skill actually follows the required reading/loading rules.
