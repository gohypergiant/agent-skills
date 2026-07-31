# accelint-ts-best-practices eval coverage report

- Generated 16 eval cases in `skills/accelint-ts-best-practices/evals/evals.json`.
- Coverage includes core rule areas: `any`, input validation, return zero values, enums, `type` vs `interface`, control flow, function design, state management, error handling, error messages, bounded iteration, code duplication, and bundler-friendly paths.
- Included both direct code-review prompts and explicit audit-report prompts to cover normal usage and formal `/accelint-ts-best-practices <path>` workflows.
- Added scope-boundary cases that should redirect to `accelint-ts-documentation` and `accelint-ts-performance` rather than over-triggering this skill.
- Several cases combine multiple anti-patterns in one prompt to test prioritization and correct reference selection, not just single-rule recall.
