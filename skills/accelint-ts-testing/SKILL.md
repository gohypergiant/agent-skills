---
name: accelint-ts-testing
description: Comprehensive vitest testing guidance for TypeScript projects. Use when (1) Writing new tests with AAA pattern, parameterized tests, or async/await, (2) Reviewing test code for anti-patterns like loose assertions (toBeTruthy), over-mocking, or nested describe blocks, (3) Optimizing slow test suites, (4) Implementing property-based testing with fast-check - especially for encode/decode pairs, roundtrip properties, validators, normalizers, and idempotence checks. Covers test organization, assertions, test doubles hierarchy (fakes/stubs/mocks), async testing, performance patterns, and property-based testing patterns. Trigger keywords on vitest, *.test.ts, describe, it, expect, vi.mock, fast-check, fc.property, roundtrip, idempotence.
compatibility: Requires vitest testing framework
license: Apache-2.0
metadata:
  author: accelint
  version: "3.2"
---

# Vitest Best Practices

Comprehensive patterns for writing maintainable, effective vitest tests. Focused on expert-level guidance for test organization, clarity, and performance.

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

Apply these expert thinking patterns before implementing tests:

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
- **Will this test still be valuable in 6 months?** Score the test to decide:
  - Does it prevent real bugs users experience? (+3)
  - Does it test business logic vs library behavior? (+2)
  - Would removing it make refactoring riskier? (+2)
  - Does it require updates when unrelated code changes? (-2)
  - Does it test trivial operations or framework internals? (-3)

  **Score ≥5:** Keep it. **Score <5:** Consider removing or simplifying.

- **Is this test fast enough to run on every save?** Target: <50ms per test, <5s for entire suite.
  - Test takes >100ms? → Check for: real database calls, actual network requests, unmocked timers/delays
  - Use hierarchy: real implementation (fast) > fake (ms) > stub (ms) > mock (ms) > real DB/API (seconds)
  - If test needs slow operations, isolate to separate suite with `.slow` marker

## Freedom Calibration

Different aspects of testing require different levels of constraint. Know when to apply rigid rules vs judgment:

### MANDATORY (zero freedom - must be followed exactly)

These are safety-critical requirements where deviation causes bugs or false confidence:

- **TypeScript type checking must pass before marking test files complete** - Test files are typically excluded from the project's `tsconfig.json` (not in `include` paths), so running `tsc` at the root WON'T catch type errors in tests. You MUST run type checking TARGETED at the specific test file using `scripts/check-test-types.sh path/to/test.test.ts`. Type errors in tests cause runtime failures, incorrect test behavior, and false confidence. Never bypass with `as any` or `@ts-ignore`.
- **Global mock cleanup must be configured** - `clearMocks: true`, `mockReset: true`, `restoreMocks: true` in vitest.config.ts (verify with `scripts/check-vitest-config.sh`). Manual per-test cleanup creates order-dependent failures.
- **Test descriptions must read as sentences** - `it('should add item to cart')` not `it('Add item to cart')`. The "it" prefix forms a sentence: "it should add item to cart".
- **No loose assertions** - `toBeTruthy()` and `toBeDefined()` pass for values you never intended. Use `toEqual()`, `toBe()`, `toStrictEqual()` instead.
- **Each test must be independent** - No shared mutable state, no execution order dependencies. Tests are parallel universes.

### PRINCIPLED (medium freedom - apply judgment within guidelines)

Follow the principle, but adapt to context:

- **Test doubles hierarchy (fakes > stubs > mocks)** - Prefer simpler test doubles, but use judgment. External APIs may need mocks, internal pure functions should use real implementation.
- **AAA pattern boundaries** - Make them semantically meaningful, not mechanical. Complex setup can be extracted to helpers with clear names.
- **What to test** - Focus on behavior over implementation. Use the "Before Writing Tests, Ask" frameworks to guide decisions.
- **Property-based testing opportunities** - When you see encode/decode pairs, validators, normalizers, or pure functions with invariants, consider PBT. But example-based tests are fine for simple cases.
- **Test organization** - Prefer co-location (test next to implementation), but monorepo structure or team conventions may require adaptation.

### FLEXIBLE (high freedom - use your judgment)

These have multiple valid approaches:

- **Helper function naming and extraction** - Extract when it improves clarity, keep inline when it's simple. No rigid rules.
- **Setup complexity vs inline setup** - Balance: too much extraction obscures test intent, too much inline creates noise. Optimize for 5-second understanding.
- **describe block structure** - Flat structure (no nesting) vs 1-level nesting (grouped related tests) are both valid. NEVER exceed 2 levels.
- **Assertion specificity** - `expect.any(String)` vs exact value depends on whether the exact value matters for the test's purpose.
- **Test file size** - One large file vs multiple small files - both work if tests are well-organized and independent.

**The principle:** Rigidity increases with consequence. Type errors and loose assertions cause production bugs → mandatory. Helper naming affects only readability → flexible.

## What This Skill Covers

Expert guidance on vitest testing patterns:

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

This skill uses a **progressive disclosure** structure to minimize context usage:

### 1. Start with the Overview (AGENTS.md)
Read [AGENTS.md](AGENTS.md) for a concise overview of all rules with one-line summaries and the workflow for discovering existing test configuration.

### 2. Use Automation Scripts (Recommended)
For maximum efficiency, use the provided scripts to automate detection, reporting, and validation:

**Before Writing Tests:**
- **[scripts/check-vitest-config.sh](scripts/check-vitest-config.sh)** - Verify global mock cleanup settings
- **[scripts/find-setup-files.sh](scripts/find-setup-files.sh)** - Discover existing test setup files

**For Test Audits:**
- **[scripts/detect-test-anti-patterns.sh](scripts/detect-test-anti-patterns.sh)** - Scan test files for anti-patterns, outputs JSON
- **[scripts/generate-test-audit-report.sh](scripts/generate-test-audit-report.sh)** - Generate pre-filled audit report from JSON

**After Writing/Fixing Tests:**
- **[scripts/check-test-types.sh](scripts/check-test-types.sh)** - Verify TypeScript type correctness

See [scripts/README.md](scripts/README.md) for detailed usage and workflow examples.

Scripts automate repetitive validation tasks and handle edge cases (config inheritance, package manager detection). **Context savings: ~2,000 tokens per full audit workflow**.

### 3. Load Specific Rules as Needed
Use these explicit triggers to know when to load each reference file:

**MANDATORY Loading (load entire file):**
- **Writing async tests with promises/timers** → [async-testing.md](references/async-testing.md)
- **Working with mocks, stubs, spies, or fakes** → [test-doubles.md](references/test-doubles.md)
- **Auditing/reviewing existing test files** → [property-based-testing.md](references/property-based-testing.md) (to identify PBT opportunities)

**Load When You See These Patterns:**
- **Nested describe blocks >2 levels deep** → [organization.md](references/organization.md)
- **Test files not co-located with implementation** → [organization.md](references/organization.md)
- **Tests without clear Arrange/Act/Assert structure** → [aaa-pattern.md](references/aaa-pattern.md)
- **Duplicate test code with slight variations** → [parameterized-tests.md](references/parameterized-tests.md)
- **Missing error case tests or inadequate edge case coverage** → [error-handling.md](references/error-handling.md)
- **Loose assertions like `toBeTruthy()` or `toBeDefined()`** → [assertions.md](references/assertions.md)
- **Tests running slow (>100ms per test)** → [performance.md](references/performance.md)
- **Need coverage, watch mode, or vitest-specific features** → [vitest-features.md](references/vitest-features.md)
- **Considering or reviewing snapshot tests** → [snapshot-testing.md](references/snapshot-testing.md)
- **Encode/decode pairs, validators, normalizers, or pure functions** → [property-based-testing.md](references/property-based-testing.md)
- **Code with invariants, mathematical properties, or data transformations** → [property-based-testing.md](references/property-based-testing.md)
- **Existing fast-check or property-based tests** → [property-based-testing.md](references/property-based-testing.md)

**Do NOT Load Unless Specifically Needed:**
- Do NOT load [performance.md](references/performance.md) if tests are fast (<50ms)
- Do NOT load [snapshot-testing.md](references/snapshot-testing.md) unless snapshots are mentioned
- Do NOT load [vitest-features.md](references/vitest-features.md) for basic test writing

### 4. Apply the Pattern
Each reference file contains:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

### 5. Use the Report Template
When this skill is invoked for test code review, use the standardized report format:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with test quality impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (test reliability, maintainability, performance, clarity)
- Categorization (Test Organization, Assertions, Test Doubles, Async Testing, Performance)
- Pattern references linking to detailed guidance in references/
- Summary table for tracking all issues

**When to use the report template:**
- Skill invoked directly via `/accelint-ts-testing <path>`
- User asks to "review test code" or "audit tests" across file(s), invoking skill implicitly

**When NOT to use the report template:**
- User asks to "write a test for this function" (direct implementation)
- User asks "what's wrong with this test?" (answer the question)
- User requests specific test fixes (apply fixes directly without formal report)

**IMPORTANT: When auditing tests, ALWAYS check for property-based testing opportunities**
- Load [property-based-testing.md](references/property-based-testing.md) during every audit
- Follow the "Workflow: Test Code Review/Audit" in [AGENTS.md](AGENTS.md)
- Check for high-value PBT patterns: encode/decode pairs, normalizers, validators, pure functions, sorting functions
- Include PBT opportunities in the audit report even if no other issues are found

## Quick Example

See [quick-start.md](references/quick-start.md) for a complete before/after example showing how this skill transforms unclear tests into clear, maintainable ones.
