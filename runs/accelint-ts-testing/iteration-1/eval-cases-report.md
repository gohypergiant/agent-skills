# accelint-ts-testing eval coverage report

Generated 32 eval cases for `skills/accelint-ts-testing/evals/evals.json`.

## Coverage summary

- Core Vitest authoring guidance: direct test-writing trigger coverage, AAA clarity, parameterized tests, strict assertions, async/await discipline, and output-mode differences between direct fixes and formal audits.
- Test-quality guardrails: implementation-detail testing, mocking internal pure functions, test-double hierarchy, shared mutable state, deep `describe` nesting, sentence-style test names, and avoiding tests for constants-only or library-internal code.
- Type-safety and completion rules: direct test-file type-checking requirements, rejecting `as any` and `@ts-ignore`, and testing runtime-invalid inputs despite compile-time types.
- Property-based testing: encode/decode roundtrip properties, idempotence for normalizers, stronger-property guidance over weak properties, and the audit requirement to document fast-check opportunities.
- Progressive-disclosure and reference-loading behavior: async-testing, test-doubles, property-based-testing, vitest-features, snapshot-testing, and explicit cases where performance guidance should not be loaded by default.
- Boundary and near-miss coverage: generic Jest requests, Playwright E2E requests, and TypeScript documentation requests that should not be treated as primary triggers for this Vitest-focused skill.

## Validation

- JSON validated successfully with `python3` `json.load(...)`.
- Total eval cases: 32.
