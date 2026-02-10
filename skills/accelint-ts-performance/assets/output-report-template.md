╭──────────────────────────╮
│ accelint-ts-performance  │
╰──────────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill assumes hot path first. If │
│ you know that the suggested change is only used in │
│ a cold path and won't be used in a hot path then   │
│ you are free to ignore any micro-opt suggestions.  │
│ You know better than the robots. When in doubt,    │
│ assume hot path.                                   │
└────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/module being audited (e.g., "Color Converters", "Authentication Service")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the workflow used
   - Count issues by category (e.g., "4 allocation anti-patterns, 5 array method inefficiencies")
   - Include Impact Assessment explaining WHY optimizations matter for this specific code (infer from context)

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group issues when they share the SAME root cause AND same fix pattern
   - Example: Multiple instances of `.every()` with inline closures → group together
   - Example: Different allocation patterns → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH ISSUE/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the issue
   - Expected Gain (use ranges from skill categories - see below)
   - Category (Algorithmic, Caching, I/O, Memory, Locality, Safety, Micro-opt)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. EXPECTED GAIN RANGES BY CATEGORY:
   - Algorithmic (O(n²) → O(n)): 10-1000x
   - Caching & Memoization: 2-100x
   - I/O Optimization: 2-50x
   - Allocation Reduction (Memory): 1.5-5x
   - Memory Locality: 1.5-3x
   - Safety (Bounded Iteration): Prevents DoS/crashes
   - Micro-optimizations: 1.05-2x

6. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group

See assets/audit-report-example.md for a real-world example.
-->

## Executive Summary

Completed systematic audit of [file/module path] following accelint-ts-performance workflow. Identified [N] performance anti-patterns with expected gains ranging from [min]x to [max]x. [Brief description of what this code does and why performance matters].

**Key Findings:**
- [N] [category] anti-patterns ([gain range] potential gain each)
- [N] [category] issues ([gain range] each)
- [N] [other category] opportunities ([gain range])

**Impact Assessment:**
[Explain WHY these optimizations matter for this specific code. Consider:]
- Where is this code likely called? (hot paths, rendering loops, batch processing, etc.)
- What operations trigger it? (user interactions, real-time updates, data processing)
- Why do even small gains matter? (frame budgets, throughput requirements, scale)

---

## Phase 1: Identified Anti-Patterns

### 1. [Function/Location] - [Issue Type]

**Location:** `[file:line]` or `[file:line-range]`

```ts
// ❌ Current: [Brief description of problem]
[code snippet showing the issue]
```

**Issue:**
- [Point 1 explaining the problem]
- [Point 2 with specifics about allocations/iterations/complexity]
- [Point 3 quantifying the impact if possible]

**Expected Gain:** [range]x
**Category:** [Algorithmic|Caching|I/O|Memory|Locality|Safety|Micro-opt]
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

**Expected Gain:** [range]x
**Category:** [Category Name]
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

**Expected Gain:** [range]x each
**Category:** [Category Name]
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

## Phase 2: Categorized Issues

| # | Location | Issue | Category | Expected Gain |
|---|----------|-------|----------|---------------|
| 1 | [file:line] | [Brief issue description] | [Category] | [range]x |
| 2 | [file:line] | [Brief issue description] | [Category] | [range]x |
| 3 | [file:line] | [Brief issue description] | [Category] | [range]x |
| 4-N | [multiple] | [Brief issue description] | [Category] | [range]x |

**Total Issues:** [N]
**Primary Categories:** [Category1] ([N]), [Category2] ([N]), [Category3] ([N])
