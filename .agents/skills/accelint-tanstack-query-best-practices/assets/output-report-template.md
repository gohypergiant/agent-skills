╭────────────────────────────────────────╮
│ accelint-tanstack-query-best-practices │
╰────────────────────────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌──────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill does it's best to process    │
│ the context needed to suggest correct best practices │
│ but it can make mistakes. Please make sure to read   │
│ the summary section of each issue to make sure it    │
│ isn't a false positive.                              │
└──────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/module being audited (e.g., "User Authentication", "Data Processing Utils")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the scope (query hooks, mutations, QueryClient setup, etc.)
   - Count issues by severity and category
   - Include Impact Assessment explaining TanStack Query-specific risks (data leakage, infinite requests, observer economics, cache invalidation issues)

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
   - Critical: Could cause data leakage, infinite requests, app crashes, or security vulnerabilities
     Examples: singleton QueryClient on server, unstable query keys with Date.now(), missing AbortController support
   - High: Causes N duplicate requests, stale data bugs, or significant performance degradation
     Examples: N queries in list items, synchronizing query data to useState, missing enabled guards on dependent queries
   - Medium: Suboptimal patterns affecting performance or cache efficiency
     Examples: high observer count (50-100), structural sharing on large datasets, missing onSettled in optimistic updates
   - Low: Minor configuration optimizations and cache tuning
     Examples: could adjust staleTime/gcTime for data lifecycle, could disable structural sharing for better performance

6. CATEGORIES:
   - Query Configuration: staleTime, gcTime, refetchInterval, structuralSharing, retry settings
   - Query Keys: Stability (deterministic serialization), hierarchy (factory patterns), temporal values
   - Observer Economics: N queries vs N observers, hoisting patterns, parent-child data flow
   - Mutations: Optimistic vs pessimistic patterns, onMutate/onError/onSettled lifecycle, rollback handling
   - Cache Invalidation: invalidateQueries, setQueryData, cancelQueries, structural sharing preservation
   - Server Integration: QueryClient singleton issues, HydrationBoundary, SSR/SSG patterns, dehydration
   - Performance: Structural sharing overhead, observer count, data size, network efficiency
   - Code Quality: Query hook patterns, enabled guards, dependent queries, AbortController integration

7. IMPACT FIELD SHOULD DESCRIBE:
   - Data leakage risks (server singleton causing cross-user cache pollution)
   - Network efficiency (N duplicate requests, infinite request loops)
   - Cache performance (high observer count causing O(n) iterations on every update)
   - Stale data bugs (synchronizing to useState, missing invalidation)
   - Hydration issues (SSR mismatches, HydrationBoundary problems)
   - Mutation correctness (missing rollback, optimistic updates without onSettled)
   - Observer economics (list items with individual queries vs parent query)
   - Maintainability concerns (unstable keys, missing enabled guards, no AbortController)

8. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group

See assets/audit-report-example.md for a real-world example.
-->

## Executive Summary

Completed systematic audit of [file/module path] following accelint-tanstack-query-best-practices standards. Identified [N] TanStack Query configuration and usage issues across [N] severity levels. [Brief description of what this feature does and how it uses TanStack Query].

**Key Findings:**
- [N] Critical issues (server singleton QueryClient, unstable query keys, data leakage risks)
- [N] High severity issues (N queries in list items, missing enabled guards, synchronizing to useState)
- [N] Medium severity issues (suboptimal cache configuration, high observer count, missing onSettled)
- [N] Low severity issues (minor optimizations, cache tuning opportunities)

**Impact Assessment:**
[Explain the overall TanStack Query usage patterns and concerns. Consider:]
- Are there data leakage risks from server singleton QueryClient usage?
- Are there infinite request loops from unstable query keys?
- How many observers are subscribed to each cache entry? (use DevTools to check)
- Are queries properly hoisted or are list items creating N duplicate requests?
- Are mutations using appropriate optimistic/pessimistic patterns for the use case?
- Are there cache invalidation issues or stale data problems?
- Are server-client integration patterns correct for SSR/hydration?

---

## Phase 1: Identified Issues

### 1. [Function/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```tsx
// ❌ Current: [Brief description of problem]
// Example: useQuery({ queryKey: ['data', Date.now()], ... })
[code snippet showing the TanStack Query issue]
```

**Issue:**
- [Point 1 explaining the problem - reference NEVER/Before patterns from SKILL.md]
- [Point 2 with specifics about the violation - reference pattern files]
- [Point 3 quantifying the impact - observer count, network requests, cache pollution, etc.]

**Severity:** [Critical|High|Medium|Low]
**Category:** [Query Configuration|Query Keys|Observer Economics|Mutations|Cache Invalidation|Server Integration|Performance|Code Quality]
**Impact:**
- **Data integrity:** [Cross-user leakage, stale data bugs, cache corruption]
- **Network efficiency:** [Duplicate requests, infinite loops, wasted bandwidth]
- **Cache performance:** [Observer count impact, structural sharing overhead]
- **Correctness:** [Missing rollback, hydration mismatches, unstable keys]

**Pattern Reference:** [references/filename.md from the skill]

**Recommended Fix:**
```tsx
// ✅ [Brief description of solution]
// Example: Use stable key factory: useQuery({ queryKey: keys.detail(id), ... })
[code snippet showing the TanStack Query fix with proper patterns]
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
**Category:** [Query Configuration|Query Keys|Observer Economics|Mutations|Cache Invalidation|Server Integration|Performance|Code Quality]
**Impact:**
- **Data integrity:** [Cross-user leakage, stale data bugs, cache corruption]
- **Network efficiency:** [Duplicate requests, infinite loops, wasted bandwidth]
- **Cache performance:** [Observer count impact, structural sharing overhead]
- **Correctness:** [Missing rollback, hydration mismatches, unstable keys]

**Pattern Reference:** [references/filename.md from the skill]

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
**Category:** [Query Configuration|Query Keys|Observer Economics|Mutations|Cache Invalidation|Server Integration|Performance|Code Quality]
**Impact:**
- **Data integrity:** [Cross-user leakage, stale data bugs across all instances]
- **Network efficiency:** [Duplicate requests, wasted bandwidth across N locations]
- **Cache performance:** [Observer count impact, structural sharing overhead]
- **Correctness:** [Missing rollback, hydration mismatches, unstable keys]

**Pattern Reference:** [references/filename.md from the skill]

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
