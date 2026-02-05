╭────────────────────────────────╮
│ accelint-nextjs-best-practices │
╰────────────────────────────────╯
# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the specific file/module being audited (e.g., "User Dashboard", "API Routes", "Product Catalog")

2. EXECUTIVE SUMMARY: Provide a high-level overview
   - Summarize what was audited and the scope
   - Count issues by severity and category
   - Include Impact Assessment explaining the potential risks and performance concerns

3. PHASE 1 - ISSUE GROUPING RULES:
   - Group issues when they share the SAME root cause AND same fix pattern
   - Example: Multiple instances of sequential data fetching → group together
   - Example: Different security violations in Server Actions → separate issues
   - Use subsections (4-8) for grouped issues, individual numbers (1, 2, 3) for unique issues

4. PHASE 1 - EACH ISSUE/GROUP MUST INCLUDE:
   - Location (file:line or file:line-range)
   - Current code with ❌ marker
   - Clear explanation of the issue
   - Severity (Critical, High, Medium, Low)
   - Category (Server Actions, RSC Serialization, Data Fetching, Component Architecture, etc.)
   - Impact (security, performance, data transfer, maintainability)
   - Pattern Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

5. SEVERITY LEVELS:
   - Critical: Security vulnerabilities, unauthenticated Server Actions, exposed sensitive data
     Examples: missing authentication in Server Action, SQL injection vulnerability, exposed API keys
   - High: Major performance issues, data waterfalls, excessive serialization, blocking operations
     Examples: sequential data fetching causing 2s+ delays, 500KB+ RSC payload, blocking await before conditional
   - Medium: Suboptimal patterns affecting performance or maintainability
     Examples: missing Suspense boundaries, barrel imports in server components, no request deduplication
   - Low: Minor optimizations and best practice improvements
     Examples: could use React.cache(), could parallelize independent operations

6. CATEGORIES:
   - Server Actions Security: Authentication, authorization, input validation, CSRF protection
   - RSC Serialization: Payload size, duplicate serialization, unnecessary data transfer
   - Data Fetching: Waterfalls, parallelization, caching, request deduplication
   - Component Architecture: Server vs Client Component decisions, Suspense boundaries
   - Performance: Blocking operations, defer-await patterns, after() usage for non-blocking ops
   - Imports: Barrel import issues, unnecessary client bundles
   - Code Quality: Component organization, naming conventions, readability

7. IMPACT FIELD SHOULD DESCRIBE:
   - Security impact (unauthorized access, data exposure, CSRF attacks)
   - Performance impact (response time increases, page load delays, TTFB)
   - Data transfer impact (payload size, bandwidth costs, slower on mobile)
   - User experience impact (slow page loads, blocking UI, poor perceived performance)
   - Maintainability concerns for future developers

8. PHASE 2: Generate summary table from Phase 1 findings
   - Include all issues with their numbers
   - Keep it concise - one row per issue/group
-->

## Executive Summary

Completed systematic audit of [file/module path] following accelint-nextjs-best-practices standards. Identified [N] security, performance, and architectural issues across [N] severity levels. [Brief description of what this component/feature does and why these patterns matter].

**Key Findings:**
- [N] Critical issues (security vulnerabilities, unauthenticated Server Actions, data exposure)
- [N] High severity issues (data waterfalls, excessive serialization, blocking operations)
- [N] Medium severity issues (suboptimal patterns, missing Suspense boundaries)
- [N] Low severity issues (minor optimizations)

**Impact Assessment:**
[Explain the overall security posture, performance profile, and user experience concerns. Consider:]
- What are the security risks from unauthenticated Server Actions or missing validation?
- How do data waterfalls affect page load time and TTFB?
- What is the RSC serialization overhead and impact on bandwidth/mobile users?
- Are there blocking operations delaying critical rendering?
- How do these issues affect maintainability and scalability?

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
**Category:** [Server Actions Security|RSC Serialization|Data Fetching|Component Architecture|Performance|Imports|Code Quality]
**Impact:**
- **Security:** [Authentication/authorization bypass, data exposure, CSRF vulnerability]
- **Performance:** [Response time increase, page load delay, TTFB impact]
- **Data transfer:** [Payload size increase, bandwidth costs, mobile impact]
- **User experience:** [Slow page loads, blocking UI, poor perceived performance]

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
**Category:** [Server Actions Security|RSC Serialization|Data Fetching|Component Architecture|Performance|Imports|Code Quality]
**Impact:**
- **Security:** [Authentication/authorization bypass, data exposure, CSRF vulnerability]
- **Performance:** [Response time increase, page load delay, TTFB impact]
- **Data transfer:** [Payload size increase, bandwidth costs, mobile impact]
- **User experience:** [Slow page loads, blocking UI, poor perceived performance]

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
**Category:** [Server Actions Security|RSC Serialization|Data Fetching|Component Architecture|Performance|Imports|Code Quality]
**Impact:**
- **Security:** [Authentication/authorization bypass, data exposure, CSRF vulnerability]
- **Performance:** [Response time increase, page load delay, TTFB impact]
- **Data transfer:** [Payload size increase, bandwidth costs, mobile impact]
- **User experience:** [Slow page loads, blocking UI, poor perceived performance]

**Pattern Reference:** [filename.md]

**Recommended Fix:**
```tsx
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
