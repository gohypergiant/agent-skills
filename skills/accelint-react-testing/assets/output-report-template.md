╭────────────────────────╮
│ accelint-react-testing │
╰────────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌──────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill does it's best to process    │
│ the context needed to suggest correct react tests    │
│ but it can make mistakes. Please make sure to read   │
│ the suggested tests to make sure that they are       │
│ correct.                                             │
└──────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/component being audited (e.g., "LoginForm Tests", "UserCard.test.tsx")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the scope
   - Count issues by severity and category
   - Include Impact Assessment explaining confidence in user experience and accessibility

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group issues when they share the SAME root cause AND same fix pattern
   - Example: Multiple getByTestId calls that should be getByRole → group together
   - Example: Different async testing violations → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH ISSUE/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the issue
   - Severity (Critical, High, Medium, Low)
   - Category (Query Priority, Query Variants, User Events, Async Testing, Custom Render, Accessibility, Anti-patterns)
   - Impact (accessibility confidence, test reliability, user-centric coverage)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. SEVERITY LEVELS:
   - Critical: Tests that ship inaccessible UIs or miss bugs real users would hit
     Examples: getByTestId bypassing accessibility verification, stale destructured queries missing DOM updates, fireEvent missing full interaction sequences that break in production
   - High: Tests that break on safe refactors or hide user-facing bugs
     Examples: testing implementation details (state variables, function call counts), side effects inside waitFor running actions multiple times, snapshot entire component trees masking real issues
   - Medium: Tests that are brittle, unclear, or fail to cover important scenarios
     Examples: missing custom render wrapper for components with providers, wrong query variant (getBy for async content), waitFor for promise-based queries that findBy handles better
   - Low: Minor improvements to query clarity or test structure
     Examples: could use more descriptive query options (name, level), minor async pattern improvements

6. CATEGORIES:
   - Query Priority: getByRole > getByLabelText > getByText > getByTestId hierarchy violations; test IDs used before trying accessible queries
   - Query Variants: Wrong getBy/findBy/queryBy selection; getBy for async content, queryBy where getBy gives better errors, findBy where waitFor is used
   - User Events: fireEvent used instead of userEvent; missing await on userEvent (async); event sequence gaps causing undetected bugs
   - Async Testing: waitFor misuse (side effects inside, polling when findBy works), missing await on async queries, act warnings from unhandled state updates
   - Custom Render: Missing provider wrappers (Context, Redux, Router), undocumented render utilities, repeated provider setup across test files
   - Accessibility: Test-only ARIA attributes added to pass tests, labels/roles only added for test purposes rather than accessibility
   - Anti-patterns: Implementation testing (state/internals), container/wrapper usage, stale destructured queries instead of screen, excessive snapshots

7. IMPACT FIELD SHOULD DESCRIBE:
   - Accessibility confidence: Does a passing test mean the UI is accessible to real users and screen readers?
   - User-centric confidence: Does a passing test mean a real user can complete this interaction?
   - Test reliability: Could this test fail non-deterministically, go stale after re-renders, or have race conditions?
   - Refactor safety: Will this test break when safely refactoring internals without changing user-visible behavior?
   - Production safety: What bugs could ship to users because this test doesn't catch them?
   - Maintenance cost: How much churn does this test create for legitimate changes?

8. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group

See references/ for pattern guidance on each category.
-->

## Executive Summary

Completed systematic audit of [file/component path] following accelint-react-testing standards. Identified [N] test quality issues across [N] severity levels. [Brief description of what this component does and why user-centric, accessible tests matter here].

**Key Findings:**
- [N] Critical issues (inaccessible queries, stale DOM references, missing interaction sequences)
- [N] High severity issues (implementation testing, waitFor side effects, excessive snapshots)
- [N] Medium severity issues (wrong query variants, missing providers, brittle async patterns)
- [N] Low severity issues (minor query or async improvements)

**Impact Assessment:**
[Explain the overall confidence in user experience and accessibility coverage. Consider:]
- Do passing tests guarantee the UI is accessible to screen readers and keyboard users?
- Are tests verifying user-observable behavior or React internals?
- Are there stale queries that miss DOM updates after interactions?
- Are async interactions properly awaited to avoid race conditions and act warnings?
- Will these tests survive a refactor from useState to useReducer, or Context to Redux?

---

## Phase 1: Identified Issues

### 1. [Component/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```tsx
// ❌ Current: [Brief description of problem]
[code snippet showing the issue]
```

**Issue:**
- [Point 1 explaining the problem]
- [Point 2 with specifics about the violation]
- [Point 3 quantifying the impact if possible]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Query Priority|Query Variants|User Events|Async Testing|Custom Render|Accessibility|Anti-patterns]
**Impact:**
- **Accessibility confidence:** [Does a passing test mean the UI is usable by screen readers?]
- **User-centric confidence:** [Does a passing test mean a real user can complete this interaction?]
- **Reliability:** [Could this go stale, have race conditions, or fail non-deterministically?]
- **Refactor safety:** [Will this break when refactoring internals without changing behavior?]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```tsx
// ✅ [Brief description of solution]
[code snippet showing the fix]
```

---

### 2. [Component/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```tsx
// ❌ Current: [Brief description of problem]
[code snippet]
```

**Issue:**
- [Explanation]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Query Priority|Query Variants|User Events|Async Testing|Custom Render|Accessibility|Anti-patterns]
**Impact:**
- **Accessibility confidence:** [Does a passing test mean the UI is usable by screen readers?]
- **User-centric confidence:** [Does a passing test mean a real user can complete this interaction?]
- **Reliability:** [Could this go stale, have race conditions, or fail non-deterministically?]
- **Refactor safety:** [Will this break when refactoring internals without changing behavior?]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```tsx
// ✅ [Brief description of solution]
[code snippet]
```

---

### 3-N. [Grouped Issues] - [Shared Issue Type] ([N] instances)

<!-- Use this format when multiple issues share the same root cause and fix pattern -->

**Locations:**
- `[file:line]` - [component/context]
- `[file:line]` - [component/context]
- `[file:line]` - [component/context]

**Example from [specific location]:**
```tsx
// ❌ Current: [Brief description of problem]
[representative code snippet]
```

**Issue:**
- [Shared root cause explanation]
- [Why this pattern is problematic]
- [Impact across all instances]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Query Priority|Query Variants|User Events|Async Testing|Custom Render|Accessibility|Anti-patterns]
**Impact:**
- **Accessibility confidence:** [Does a passing test mean the UI is usable by screen readers, across all instances?]
- **User-centric confidence:** [Does a passing test mean a real user can complete these interactions?]
- **Reliability:** [Could these go stale, have race conditions, or fail non-deterministically?]
- **Refactor safety:** [Will these break when refactoring internals without changing behavior?]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```tsx
// ✅ [Brief description of solution]
[fixed code snippet]
```

**Same pattern applies to all [N] instances:**
```tsx
// [Component/location 2]
// ❌ Current
[code snippet]

// ✅ Better
[fixed snippet]

// [Component/location 3]
// ❌ Current
[code snippet]

// ✅ Better
[fixed snippet]
```

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
