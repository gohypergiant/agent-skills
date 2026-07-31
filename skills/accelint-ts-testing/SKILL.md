---
name: accelint-ts-testing
description: Use when writing, reviewing, refactoring, or auditing TypeScript tests that use Vitest or Vitest-style patterns. Best for requests involving `describe`, `it` or `test`, `expect`, `vi.fn`, `vi.mock`, `*.test.ts`, `*.spec.ts`, async test flakiness, loose assertions, over-mocking, parameterized cases, and property-based testing opportunities with fast-check. Prefer it for Vitest unit or integration test guidance and test-quality audits. Do not use it for Jest-only requests, Playwright end-to-end coverage, or TypeScript documentation work unless the real problem is still Vitest test quality.
compatibility: Requires vitest testing framework
license: Apache-2.0
metadata:
  author: accelint
  version: "3.1.1"
---

# Vitest Best Practices

Use this skill for maintainable, effective Vitest tests. It focuses on expert-level guidance for test organization, clarity, and performance.

## NEVER Do When Writing Vitest Tests

- **NEVER write tests for files with no behavior** - Constants files (just `export const X = value`), type definition files, GLSL uniform declarations, and pure data files contain no logic to test. Testing `expect(MY_CONSTANT).toBe(42)` verifies nothing: if the value changes, the test changes with it, providing zero protection. These "tests" waste CI time and create maintenance burden when values change. Test behavior (functions, logic, transformations), not data declarations. If a file exports only types, constants, or data structures with no functions or logic, skip testing it entirely.
- **NEVER skip global mock cleanup configuration** - Manual cleanup appears safe but creates "action at a distance" failures: a mock in test file A leaks into test file B running 3 files later, causing non-deterministic failures that only appear when tests run in specific orders. These Heisenbugs waste hours in CI debugging. Configure `clearMocks: true`, `mockReset: true`, `restoreMocks: true` in `vitest.config.ts` once to eliminate this entire class of order-dependent failure.
- **NEVER nest describe blocks more than 2 levels deep** - Deep nesting creates cognitive overhead and excessive indentation. Put context in test names instead: `it('should add item to empty cart')` vs `describe('when cart is empty', () => describe('addItem', ...))`.
- **NEVER write test descriptions that don't read as sentences** - Test descriptions must complete the sentence "it ..." in lowercase. Write `it('should add item to cart')` not `it('Add item to cart')` or `it('It should add item to cart')`. The description reads as a sentence when prefixed with "it": "it should add item to cart". Capitalized starts, non-sentence formats like `it('addToCart test')`, or redundant "It should" break readability and test output consistency. Example-based tests use `it('should...')` while property-based tests use `it('property: ...')` format.
- **NEVER test library internals that the library already tests** - Testing `expect(array.map(fn)).toEqual(expected)` wastes time verifying that Array.prototype.map works correctly. The JavaScript/TypeScript standard library and established third-party libraries are already well-tested. Focus tests on your business logic, not on proving that lodash, React, or the language itself works. If you find yourself testing "does this library function do what it claims?", you're testing the wrong layer. Test how your code uses libraries, not whether libraries work.
- **NEVER export internal functions just to test them** - Tests should verify behavior through the public API, not reach into implementation details. Exporting private helpers, internal utilities, or implementation functions solely to enable testing is a code smell that indicates either: (1) the public API is insufficient for testing the behavior, or (2) the tests are verifying implementation details instead of behavior. If internal logic is complex enough to warrant dedicated testing, extract it into a separate module with its own public API and test file. Private functions get tested indirectly through the public functions that call them.
- **NEVER mock your own pure functions** - Mocking internal code makes tests brittle and less valuable. Mock only external dependencies (APIs, databases, third-party libraries). Prefer fakes > stubs > spies > mocks.
- **NEVER use loose assertions like `toBeTruthy()` or `toBeDefined()`** - These assertions pass for multiple distinct values you never intended: `toBeTruthy()` passes for `1`, `"false"`, `[]`, and `{}` - all semantically different. When refactoring changes `getUser()` from returning `{id: 1}` to returning `1`, your test still passes but your production code breaks. Loose assertions create false confidence that evaporates in production. `toBeTypeOf()` is NOT a loose assertion.
- **NEVER test implementation details instead of behavior** - Tests that verify "function X was called 3 times" create false failures: you optimize code to call X once via memoization, all tests fail, yet the user experience is identical (and faster). These tests actively punish performance improvements and refactoring. Test what users observe (outputs given inputs), not how your code achieves it internally.
- **NEVER share mutable state between tests** - Tests that depend on execution order or previous test state create flaky, unreliable suites. Each test must be fully independent with fresh setup.
- **NEVER use `any` or skip type checking in test files** - When implementation signatures change, tests with `as any` silently pass while calling functions with wrong arguments. You ship broken code that TypeScript could have caught. Tests are executable documentation: `user as any` communicates nothing, but `createTestUser(Partial<User>)` shows exactly what properties matter for this test case.
- **NEVER mark test files as complete without running TypeScript type checking** - Test files are typically excluded from `tsconfig.json` compilation paths, so running `tsc` at the project root won't catch type errors in tests. Type errors in tests cause runtime failures, incorrect test behavior, and false confidence from tests that don't test what they claim. Before marking any test file as "done", you MUST run `tsc --noEmit` directly against the test file using the project's package manager (npm/pnpm/bun/yarn). For monorepos, `cd` into the specific package directory first, then run type checking. Fix all type errors before proceeding - never use `as any` or `@ts-ignore` to bypass errors.
- **NEVER assume TypeScript types prevent runtime errors** - TS types are compile-time only and vanish at runtime. Testing only "type-valid" inputs creates a false sense of security. In production, functions receive invalid data from JSON APIs without validation, `JSON.parse()` results, external libraries, user input, and database records. A function typed as `process(data: ValidData)` can still receive `null`, `undefined`, or malformed objects at runtime. Test defensive programming scenarios: pass `null` to non-nullable parameters, `undefined` to required fields, malformed objects to typed parameters. These "type-invalid" tests catch real bugs that TypeScript cannot prevent.
- **NEVER write weak properties when stronger ones exist** - Property-based tests that only verify "no exception thrown" or "returns a value" provide minimal coverage. When testing encode/decode pairs, verify roundtrip equality (`decode(encode(x)) === x`), not just that decode succeeds. When testing normalization, verify idempotence (`normalize(normalize(x)) === normalize(x)`), not just that it returns a string. Weak properties give false confidence: they pass but don't actually validate correctness.

## Before Writing Tests, Ask

Use these checks before you implement tests:

### Should This File Be Tested?
- **Does this file contain behavior to test?** Files that only declare constants, types, or data structures without logic don't need tests. Constants files (`export const X = 42`), type definition files (`type User = {...}`), GLSL uniform declarations, configuration objects, and pure data files have no behavior to verify. If the file contains no functions, no logic, no transformations - skip testing it. Test behavior, not data.

### Test Isolation and Setup
- **Where should cleanup logic live?** Think in layers: configuration eliminates entire error classes (mock cleanup in vitest.config.ts), setup files handle project-wide concerns (custom matchers, global mocks), beforeEach handles test-specific state. Each test doing its own mock cleanup is like each function doing its own null checks - it works but misses the point. Push concerns to the highest appropriate layer.
- **Does this test depend on previous tests or shared state?** Test suites are parallel universes - each test should work identically whether it runs first, last, or alone. State dependency creates "quantum tests" that pass or fail based on execution order. If a test needs data from another test, they're actually one test split artificially.

### What to Test
- **Am I testing behavior or implementation?** Test what users experience (inputs → outputs), not how code achieves it (which functions were called). Implementation tests break during safe refactoring.
- **What's the simplest dependency I can use?** Real implementation > fake > stub > spy > mock. Each step down this hierarchy adds brittleness. Mock only when using real code is impractical (external APIs, slow operations).

### Test Clarity
- **Can someone understand this test in 5 seconds?** Follow AAA pattern (Arrange, Act, Assert) with clear boundaries. If setup is complex, extract to helper functions with descriptive names.
- **Are there multiple variations of the same behavior?** Use `it.each()` for parameterized tests instead of copying test structure. One assertion per concept keeps tests focused.

### Performance and Maintenance
- **Will this test still be valuable in 6 months?** Avoid testing framework internals or trivial operations. Focus on business logic, edge cases, and error handling that actually prevent bugs.
- **Is this test fast enough to run on every save?** Avoid expensive operations in tests. Use fakes for databases, mock timers for delays, stub external calls. Tests should complete in milliseconds.

## What This Skill Covers

This skill covers these Vitest testing patterns:

1. **Organization** - File placement, naming, describe block structure
2. **AAA Pattern** - Arrange, Act, Assert for instant clarity
3. **Parameterized Tests** - Using `it.each()` to reduce duplication
4. **Error Handling** - Testing exceptions, edge cases, fault injection
5. **Assertions** - Strict assertions to catch unintended values
6. **Test Doubles** - Fakes, stubs, mocks, spies hierarchy and when to use each
7. **Async Testing** - Promises, async/await, timers, concurrent tests
8. **Performance** - Fast tests through efficient setup and global config
9. **Vitest Features** - Coverage, watch mode, setup files, config discovery
10. **Snapshot Testing** - When snapshots help vs hurt maintainability
11. **Property-Based Testing** - Using fast-check for stronger coverage with generated inputs

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Overview (AGENTS.md)
Read [AGENTS.md](AGENTS.md) first for the concise rule index and the required pre-write, pre-complete, and audit workflows.

### 2. Follow the matching workflow
Choose the lightest path that fits the task:
- **Writing or refactoring tests**: verify the target file has behavior worth testing, then inspect `vitest.config.*` and setup files before adding mocks or cleanup.
- **Auditing existing tests**: load [property-based-testing.md](references/property-based-testing.md) up front, then inspect only the references needed for the problems you find.
- **Marking test work complete**: run direct TypeScript type checking against the touched test files using the package's actual package manager.

### 3. Load specific references only when triggered

**Always load for these tasks:**
- **Async tests with promises, timers, polling, or fake timers** → [async-testing.md](references/async-testing.md)
- **Mocks, spies, stubs, fakes, or interaction-heavy tests** → [test-doubles.md](references/test-doubles.md)
- **Any audit or review of existing test code** → [property-based-testing.md](references/property-based-testing.md)

**Load when these signals appear:**
- **Nested describe blocks, poor co-location, weak naming** → [organization.md](references/organization.md)
- **Missing or blurry Arrange / Act / Assert separation** → [aaa-pattern.md](references/aaa-pattern.md)
- **Repeated cases with small input/output changes** → [parameterized-tests.md](references/parameterized-tests.md)
- **Missing failure paths, edge cases, or fault injection** → [error-handling.md](references/error-handling.md)
- **Loose assertions such as `toBeTruthy()` or `toBeDefined()`** → [assertions.md](references/assertions.md)
- **Slow tests, repeated setup, or manual mock cleanup hooks** → [performance.md](references/performance.md)
- **Coverage, setup files, `expectTypeOf`, watch mode, or Vitest-specific APIs** → [vitest-features.md](references/vitest-features.md)
- **Snapshot tests or requests about snapshots** → [snapshot-testing.md](references/snapshot-testing.md)
- **Encode/decode, normalize/sanitize, validators, sorters, or pure transforms** → [property-based-testing.md](references/property-based-testing.md)

**Do not load unless needed:**
- Skip [performance.md](references/performance.md) when performance is not part of the problem.
- Skip [snapshot-testing.md](references/snapshot-testing.md) unless snapshots are present or requested.
- Skip [vitest-features.md](references/vitest-features.md) for straightforward unit-test authoring.

### 4. Apply only the relevant pattern
Each reference file should give enough detail to fix the issue directly with concrete good and bad examples.

### 5. Use the report template only for audits
For file or package test audits, use [`assets/output-report-template.md`](assets/output-report-template.md).
Do not force the template for direct implementation or one-off debugging.

**Audit requirement:** always document property-based testing opportunities when reviewing test code, even if you do not add fast-check in that stage.

## Quick Example

See [quick-start.md](references/quick-start.md) for a before-and-after example that shows how this skill turns unclear Vitest tests into clear, maintainable ones.
