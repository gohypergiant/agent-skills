╭─────────────────────╮
│ accelint-ts-testing │
╰─────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌─────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill does it's best to process   │
│ the context needed to suggest correct unit tests    │
│ but it can make mistakes. Please make sure to read  │
│ the suggested unit tests to make sure that they are │
│ correct.                                            │
└─────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/module being audited (e.g., "UserService Tests", "cart.test.ts")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the scope
   - Count issues by severity and category
   - Include Impact Assessment explaining test reliability risks and maintainability concerns

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group issues when they share the SAME root cause AND same fix pattern
   - Example: Multiple instances of loose toBeTruthy() assertions → group together
   - Example: Different async testing violations → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH ISSUE/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the issue
   - Severity (Critical, High, Medium, Low)
   - Category (Test Organization, AAA Pattern, Assertions, Test Doubles, Async Testing, Performance, Snapshot Testing, Code Quality)
   - Impact (false confidence, test flakiness, maintainability concerns)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. SEVERITY LEVELS:
   - Critical: Tests that actively lie — give false confidence that code is correct when it isn't
     Examples: loose toBeTruthy() on return values with multiple valid types, shared mutable state causing order-dependent failures, missing global mock cleanup leaking across files
   - High: Tests that punish safe refactoring or hide real bugs
     Examples: testing implementation details (spy call counts on internal functions), mocking your own pure functions, using `any` types that let wrong argument types pass silently
   - Medium: Tests that are hard to maintain or understand
     Examples: describe nesting >2 levels deep, duplicate test structures that should be parameterized, unclear AAA boundaries, no error case coverage
   - Low: Minor clarity and style improvements
     Examples: could use it.each() for small variations, test name could be more descriptive, minor naming issues

6. CATEGORIES:
   - Test Organization: File placement, describe nesting depth, test naming, co-location with implementation
   - AAA Pattern: Missing or unclear Arrange/Act/Assert boundaries, multiple concepts per test
   - Assertions: Loose assertions (toBeTruthy, toBeDefined), wrong assertion for the type, multiple unrelated assertions per test
   - Test Doubles: Wrong level of hierarchy (using mocks when fakes/stubs suffice), mocking own pure functions, over-mocking
   - Async Testing: Missing await, incorrect async patterns, timer handling, concurrent test issues
   - Performance: Tests running >100ms, expensive setup in tests, missing global mock config (clearMocks/resetMocks/restoreMocks)
   - Snapshot Testing: Overuse of snapshots, unstable snapshots, snapshots masking real assertions
   - Code Quality: Using `any` in tests, unclear naming, missing type coverage, poor test isolation

7. IMPACT FIELD SHOULD DESCRIBE:
   - False confidence: Does this test pass for values you never intended?
   - Test reliability: Could this test fail non-deterministically (flakiness, order-dependence)?
   - Refactor safety: Will this test break when you safely refactor internals without changing behavior?
   - Test clarity: Can someone understand what this test verifies in 5 seconds?
   - CI performance: Is this slowing the test suite and feedback loop?
   - Production safety: What bugs could ship because this test doesn't catch them?

8. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group

See references/ for pattern guidance on each category.
-->

## Executive Summary

Completed systematic audit of [file/module path] following accelint-ts-testing standards. Identified [N] test quality issues across [N] severity levels. [Brief description of what this module does and why reliable tests matter here].

**Key Findings:**
- [N] Critical issues (false confidence, shared state, mock leakage across test files)
- [N] High severity issues (implementation testing, over-mocking, type safety gaps)
- [N] Medium severity issues (hard to maintain, missing parameterization, unclear structure)
- [N] Low severity issues (minor clarity and naming improvements)

**Impact Assessment:**
[Explain the overall test quality and reliability concerns. Consider:]
- Are there tests that always pass but don't catch real bugs (false confidence)?
- Are there flaky tests that fail non-deterministically due to shared state or mock leakage?
- Do implementation tests block safe refactoring of internals?
- Are async tests properly awaited to avoid race conditions?
- Does the test suite run fast enough to support TDD workflows?

---

## Phase 1: Identified Issues

### 1. [Function/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```ts
// ❌ Current: [Brief description of problem]
[code snippet showing the issue]
```

**Issue:**
- [Point 1 explaining the problem]
- [Point 2 with specifics about the violation]
- [Point 3 quantifying the impact if possible]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Test Organization|AAA Pattern|Assertions|Test Doubles|Async Testing|Performance|Snapshot Testing|Code Quality]
**Impact:**
- **False confidence:** [Does this test pass for values you never intended?]
- **Reliability:** [Could this fail non-deterministically or due to test order?]
- **Refactor safety:** [Will this break when safely refactoring internals?]
- **Production safety:** [What bugs could ship undetected?]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of solution]
[code snippet showing the fix]
```

---

### 2. [Function/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```ts
// ❌ Current: [Brief description of problem]
[code snippet]
```

**Issue:**
- [Explanation]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Test Organization|AAA Pattern|Assertions|Test Doubles|Async Testing|Performance|Snapshot Testing|Code Quality]
**Impact:**
- **False confidence:** [Does this test pass for values you never intended?]
- **Reliability:** [Could this fail non-deterministically or due to test order?]
- **Refactor safety:** [Will this break when safely refactoring internals?]
- **Production safety:** [What bugs could ship undetected?]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of solution]
[code snippet]
```

---

### 3-N. [Grouped Issues] - [Shared Issue Type] ([N] instances)

<!-- Use this format when multiple issues share the same root cause and fix pattern -->

**Locations:**
- `[file:line]` - [function/context]
- `[file:line]` - [function/context]
- `[file:line]` - [function/context]

**Example from [specific location]:**
```ts
// ❌ Current: [Brief description of problem]
[representative code snippet]
```

**Issue:**
- [Shared root cause explanation]
- [Why this pattern is problematic]
- [Impact across all instances]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Test Organization|AAA Pattern|Assertions|Test Doubles|Async Testing|Performance|Snapshot Testing|Code Quality]
**Impact:**
- **False confidence:** [Does this test pass for values you never intended, across all instances?]
- **Reliability:** [Could these fail non-deterministically or due to test order?]
- **Refactor safety:** [Will these break when safely refactoring internals?]
- **Production safety:** [What bugs could ship undetected?]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of solution]
[fixed code snippet]
```

**Same pattern applies to all [N] instances:**
```ts
// [Location/function 2]
// ❌ Current
[code snippet]

// ✅ Better
[fixed snippet]

// [Location/function 3]
// ❌ Current
[code snippet]

// ✅ Better
[fixed snippet]
```

---

## Property-Based Testing Opportunities

<!-- ALWAYS include this section when performing test audits. Check for high-value PBT patterns. -->

### [Function/Pattern] - [PBT Pattern Type]

**Location:** `[file:line]` (implementation under test)

**Current Test Approach:**
```ts
// Example-based test
[current test code snippet]
```

**Why Property-Based Testing Would Help:**
- [Reason 1: broader coverage, edge case discovery, etc.]
- [Reason 2: specific property that example tests can't verify]
- [Reason 3: quantify improvement - "100 generated inputs vs 3 examples"]

**Pattern Identified:** [Encode/Decode | Normalization | Validator | Pure Function | Sorting | Data Structure | Other]

**Recommended Properties to Test:**
1. **[Property name]**: `[property formula]`
   - Verifies: [what this property guarantees]
2. **[Property name]**: `[property formula]`
   - Verifies: [what this property guarantees]

**Implementation Sketch:**
```ts
// ✅ Property-based test with fast-check
import fc from 'fast-check'

it('[property description]', () => {
  fc.assert(
    fc.property(
      [arbitrary],
      (input) => {
        // Property verification
        expect([assertion]).toBe([expected])
      }
    )
  )
})
```

**Prerequisites:**
- [ ] fast-check installed? [Yes/No - if No, requires `npm install -D fast-check`]

---

**Summary:**
Identified [N] high-value opportunities for property-based testing. These patterns would benefit from broader input coverage and stronger guarantees than example-based tests alone provide.

---

## Phase 2: Categorized Issues

| # | Location | Issue | Category | Severity |
|---|----------|-------|----------|----------|
| 1 | [file:line] | [Brief issue description] | [Category] | [Severity] |
| 2 | [file:line] | [Brief issue description] | [Category] | [Severity] |
| 3 | [file:line] | [Brief issue description] | [Category] | [Severity] |
| 4-N | [multiple] | [Brief issue description] | [Category] | [Severity] |

**Total Issues:** [N]
**By Severity:** Critical ([N]), High ([N]), Medium ([N]), Low ([N])
**By Category:** [Category1] ([N]), [Category2] ([N]), [Category3] ([N])
