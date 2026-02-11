╭───────────────────────────╮
│ accelint-ts-documentation │
╰───────────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌─────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill does it's best to process   │
│ the context needed to suggest correct documentation │
│ but it can make mistakes in large systems. Please   │
│ verify the correctness of the documentation.        │
│ Particularly any suggested @links tags.             │
└─────────────────────────────────────────────────────┘

# Report: [Target Name]

<!--
INSTRUCTIONS FOR COMPLETING THIS TEMPLATE:

1. Replace [Target Name] with the file(s)/module being audited

2. FINDINGS STRUCTURE:
   - Each finding should be numbered sequentially (1, 2, 3, etc.)
   - Don't group issues - document each one individually
   - Focus on showing the before/after clearly

3. EACH FINDING MUST INCLUDE:
   - Clear title describing the issue
   - Location (file:line)
   - Current code with ❌ marker
   - Clear explanation of the issue (bullet points)
   - Category (see categories below)
   - Reference (which references/*.md file)
   - Recommended Fix with ✅ marker

4. CATEGORIES:
   - Missing Documentation: Exported APIs with no JSDoc at all
   - Incomplete Documentation: JSDoc missing @param, @returns, @example, @throws, etc.
   - Incorrect Syntax: Wrong JSDoc syntax (@example without code fence, malformed tags)
   - Quality Improvements: Comment markers, placement, removing obvious comments
   - Internal Documentation: Non-obvious internal code needing explanation

5. REFERENCES:
   - jsdoc.md - For JSDoc-related issues (missing, incomplete, incorrect syntax)
   - comments.md - For inline comments, markers (TODO/FIXME), comment quality

6. SUMMARY TABLE:
   - Keep it concise - one row per finding
   - Should match the numbered findings above

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
