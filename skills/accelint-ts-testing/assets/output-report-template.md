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

1. Replace [Target Name] with the specific file/module being audited (e.g., "User Authentication", "Data Processing Utils")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the scope
   - Count issues by severity and category
   - Include Impact Assessment explaining the potential risks and maintainability concerns

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group issues when they share the SAME root cause AND same fix pattern
   - Example: Multiple instances of missing memoization → group together
   - Example: Different safety violations → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH ISSUE/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the issue
   - Severity (Critical, High, Medium, Low)
   - Category (Derived State, Safety, State Management, Hoisting Static JSX, Code Quality, etc...)
   - Impact (potential bugs, maintainability concerns, runtime failures)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. SEVERITY LEVELS:
   - Critical: Could cause infinite re-renders, memory leaks, hydration failures, app crashes
     Examples: missing useCallback in effect dependencies, infinite effect loops, client-only state in SSR
   - High: Causes frequent unnecessary re-renders, stale closure bugs, or significant performance degradation
     Examples: inline object/array creation in props, missing memoization on expensive computations, effect dependency issues
   - Medium: Suboptimal patterns affecting performance or maintainability
     Examples: large static JSX not hoisted, missing content-visibility on long lists, unnecessary useMemo
   - Low: Minor optimizations and style preferences
     Examples: could use lazy initialization, could extract component for clarity

6. CATEGORIES:
   - Re-render Optimization: Unnecessary re-renders, missing memoization, inline object creation
   - Hooks: useEffect dependencies, stale closures, infinite loops, useCallback/useMemo usage
   - State Management: Derived state, functional updates, state initialization, ref usage
   - Performance: Bundle size (static JSX hoisting, SVG optimization), rendering performance (content-visibility)
   - Hydration: SSR/SSG mismatches, client-only state, synchronization issues
   - React 19: forwardRef deprecation, named imports, Activity component, useEffectEvent
   - Code Quality: Component extraction, naming conventions, readability

7. IMPACT FIELD SHOULD DESCRIBE:
   - User experience impact (UI jank, input lag, slow page loads)
   - Re-render frequency and performance degradation
   - Memory leaks or infinite loops that could crash the app
   - Hydration mismatches that break SSR/SSG
   - Bundle size impact on load time
   - Stale closure bugs that cause incorrect behavior
   - Maintainability concerns for future developers

8. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group

See assets/audit-report-example.md for a real-world example.
-->

## Executive Summary

Completed systematic audit of [file/module path] following accelint-react-best-practices standards. Identified [N] performance and correctness issues across [N] severity levels. [Brief description of what this component/feature does and why performance matters].

**Key Findings:**
- [N] Critical issues (infinite re-renders, memory leaks, hydration mismatches)
- [N] High severity issues (unnecessary re-renders, stale closures, effect dependency problems)
- [N] Medium severity issues (suboptimal patterns, bundle size concerns)
- [N] Low severity issues (minor optimizations)

**Impact Assessment:**
[Explain the overall performance profile and user experience concerns. Consider:]
- What are the potential runtime failures or performance degradation issues?
- How do unnecessary re-renders affect user experience (UI jank, input lag)?
- What hydration mismatches or SSR issues exist?
- Are there memory leaks in effects or subscriptions?
- How do these issues affect bundle size, load time, and interactivity?

---

## Phase 1: Identified Issues

### 1. [Function/Location] - [Issue Type]

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
**Category:** [Re-render Optimization|Hooks|State Management|Performance|Hydration|React 19|Code Quality]
**Impact:**
- **User experience:** [UI jank, input lag, slow renders]
- **Re-renders:** [How often and why unnecessary re-renders occur]
- **Performance:** [Bundle size, memory, runtime performance impact]
- **Correctness:** [Stale closures, hydration mismatches, infinite loops]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```tsx
// ✅ [Brief description of solution]
[code snippet showing the fix]
```

---

### 2. [Function/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```tsx
// ❌ Current: [Brief description of problem]
[code snippet]
```

**Issue:**
- [Explanation]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Re-render Optimization|Hooks|State Management|Performance|Hydration|React 19|Code Quality]
**Impact:**
- **User experience:** [UI jank, input lag, slow renders]
- **Re-renders:** [How often and why unnecessary re-renders occur]
- **Performance:** [Bundle size, memory, runtime performance impact]
- **Correctness:** [Stale closures, hydration mismatches, infinite loops]

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
- `[file:line]` - [function/context]
- `[file:line]` - [function/context]
- `[file:line]` - [function/context]

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
**Category:** [Re-render Optimization|Hooks|State Management|Performance|Hydration|React 19|Code Quality]
**Impact:**
- **User experience:** [UI jank, input lag, slow renders across all instances]
- **Re-renders:** [How often and why unnecessary re-renders occur]
- **Performance:** [Bundle size, memory, runtime performance impact]
- **Correctness:** [Stale closures, hydration mismatches, infinite loops]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of solution]
[fixed code snippet]
```

**Same pattern applies to all [N] instances:**
```tsx
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
