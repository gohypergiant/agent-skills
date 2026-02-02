╭────────────────────────────╮
│ accelint-ts-best-practices │
╰────────────────────────────╯
# Code Correctness Audit Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/module being audited (e.g., "User Authentication", "Data Processing Utils")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the scope
   - Count issues by severity and category
   - Include Impact Assessment explaining the potential risks and maintainability concerns

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group issues when they share the SAME root cause AND same fix pattern
   - Example: Multiple instances of `any` type → group together
   - Example: Different safety violations → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH ISSUE/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the issue
   - Severity (Critical, High, Medium, Low)
   - Category (Type Safety, Safety, State Management, Return Values, Code Quality)
   - Impact (potential bugs, type safety violations, maintainability concerns, runtime failures)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. SEVERITY LEVELS:
   - Critical: Could cause runtime crashes, data loss, security issues, unbounded resource consumption
     Examples: unbounded iteration, missing input validation, uncaught errors
   - High: Type safety violations, hidden side effects, maintainability risks
     Examples: using `any`, mutating parameters, missing error handling
   - Medium: Code quality issues affecting readability and maintainability
     Examples: poor naming, missing early returns, large functions
   - Low: Style preferences and minor improvements
     Examples: const vs let when value never changes, missing braces (if single line is clear)

6. CATEGORIES:
   - Type Safety: `any`, `enum`, `interface` vs `type` issues
   - Safety: Input validation, error handling, assertions, bounded iteration, error messages
   - State Management: Mutation, `const` vs `let`, pure functions
   - Return Values: Returning `null`/`undefined` instead of zero values
   - Code Quality: Naming conventions, function size, control flow, code duplication

7. IMPACT FIELD SHOULD DESCRIBE:
   - Potential bugs that could be introduced
   - Type safety violations and their consequences
   - Maintainability concerns for future developers
   - Runtime failure scenarios
   - Security or data integrity risks

8. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group

See assets/audit-report-example.md for a real-world example.
-->

## Executive Summary

Completed systematic audit of [file/module path] following accelint-ts-best-practices standards. Identified [N] code correctness issues across [N] severity levels. [Brief description of what this code does and why correctness matters].

**Key Findings:**
- [N] Critical issues (potential crashes, security risks, unbounded resource usage)
- [N] High severity issues (type safety violations, hidden side effects)
- [N] Medium severity issues (code quality and maintainability)
- [N] Low severity issues (minor improvements)

**Impact Assessment:**
[Explain the overall risk profile and maintainability concerns. Consider:]
- What are the potential runtime failures or security risks?
- How do type safety violations affect long-term maintainability?
- What hidden side effects or state mutations exist?
- Are there defensive programming gaps that could cause crashes?
- How do these issues affect team velocity and bug rates?

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
**Category:** [Type Safety|Safety|State Management|Return Values|Code Quality]
**Impact:**
- **Potential bugs:** [What could go wrong at runtime]
- **Type safety:** [How types are compromised or bypassed]
- **Maintainability:** [How this affects future development]
- **Runtime failures:** [Crash scenarios, error propagation issues]

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
**Category:** [Category Name]
**Impact:**
- **Potential bugs:** [Description]
- **Type safety:** [Description]
- **Maintainability:** [Description]
- **Runtime failures:** [Description]

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
**Category:** [Category Name]
**Impact:**
- **Potential bugs:** [Description across all instances]
- **Type safety:** [How types are compromised]
- **Maintainability:** [Overall maintainability impact]
- **Runtime failures:** [Failure scenarios]

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

| # | Location | Issue | Category | Severity |
|---|----------|-------|----------|----------|
| 1 | [file:line] | [Brief issue description] | [Category] | [Severity] |
| 2 | [file:line] | [Brief issue description] | [Category] | [Severity] |
| 3 | [file:line] | [Brief issue description] | [Category] | [Severity] |
| 4-N | [multiple] | [Brief issue description] | [Category] | [Severity] |

**Total Issues:** [N]
**By Severity:** Critical ([N]), High ([N]), Medium ([N]), Low ([N])
**By Category:** [Category1] ([N]), [Category2] ([N]), [Category3] ([N])
