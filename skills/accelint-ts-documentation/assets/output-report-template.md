╭───────────────────────────╮
│ accelint-ts-documentation │
╰───────────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌─────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill does its best to process    │
│ the context needed to suggest correct documentation │
│ but it can make mistakes in large systems. Please   │
│ verify the correctness of the documentation.        │
│ Particularly any suggested @links tags.             │
└─────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the file(s) or module being audited.

2. FINDINGS STRUCTURE:
   - Number each finding sequentially (1, 2, 3, and so on).
   - Do not group issues. Document each one individually.
   - Show the before and after clearly.

3. EACH FINDING MUST INCLUDE:
   - A clear title that describes the issue.
   - The location (`file:line`).
   - The current code with a ❌ marker.
   - A clear explanation of the issue in bullet points.
   - The category (see categories below).
   - The reference (`references/*.md` file).
   - The recommended fix with a ✅ marker.

4. CATEGORIES:
   - Missing Documentation: Exported APIs with no JSDoc at all.
   - Incomplete Documentation: JSDoc missing `@param`, `@returns`, `@example`, `@throws`, or similar tags.
   - Incorrect Syntax: Wrong JSDoc syntax, such as `@example` without a code fence or malformed tags.
   - Quality Improvements: Comment markers, comment placement, or removing obvious comments.
   - Internal Documentation: Non-obvious internal code that needs explanation.

5. REFERENCES:
   - jsdoc.md - For JSDoc-related issues (missing, incomplete, incorrect syntax)
   - comments.md - For inline comments, markers (TODO/FIXME), comment quality

6. SUMMARY TABLE:
   - Keep it concise. Use one row per finding.
   - Match the numbered findings above.

See this file for a complete example of what a real audit looks like.
-->

## Findings

### 1. [Function/Type Name] - [Issue Type]

**Location:** `[file:line]`

```ts
// ❌ Current: [Brief description of problem]
[code snippet showing the issue]
```

**Issue:**
- [Point 1 explaining the documentation problem]
- [Point 2 with specifics about what's missing or incorrect]
- [Point 3 about impact on users/maintainers]

**Category:** [Missing Documentation|Incomplete Documentation|Incorrect Syntax|Quality Improvements|Internal Documentation]
**Reference:** [jsdoc.md|comments.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of solution]
[code snippet with proper documentation]
```

---

### 2. [Function/Type Name] - [Issue Type]

**Location:** `[file:line]`

```ts
// ❌ Current: [Brief description of problem]
[code snippet]
```

**Issue:**
- [Explanation of the problem]

**Category:** [Category Name]
**Reference:** [filename.md]

**Recommended Fix:**
```ts
// ✅ [Brief description of solution]
[code snippet with fix]
```

---

### 3. [Continue for each finding...]

---

## Summary

| # | Location | Issue | Category |
|---|----------|-------|----------|
| 1 | [file:line] | [Brief issue description] | [Category] |
| 2 | [file:line] | [Brief issue description] | [Category] |
| 3 | [file:line] | [Brief issue description] | [Category] |

**Total Issues:** [N]
**By Category:** [Category1] ([N]), [Category2] ([N]), [Category3] ([N])
