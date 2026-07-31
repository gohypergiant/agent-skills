---
name: accelint-ts-documentation
description: Use when JavaScript or TypeScript documentation quality is the main task, especially JSDoc, comment markers, or non-obvious code comments. Covers adding or reviewing JSDoc for exported APIs, validating tags such as `@param`, `@returns`, `@template`, `@throws`, and `@example`, cleaning up TODO or FIXME style markers, removing dead comments, improving comment placement, and judging whether internal documentation is sufficient. Do not use it for general TypeScript code-quality reviews unless documentation is the primary focus.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.1"
---

# Code Documentation Skill

Use this skill to audit or improve JavaScript/TypeScript documentation quality, especially JSDoc, comment markers, and non-obvious code comments.

## Never Do During Documentation Work

- NEVER document HOW when the reader needs WHAT or WHY.
- NEVER over-document obvious internal code just because a symbol lacks a docblock.
- NEVER approve `@example` tags without fenced code blocks and the correct language identifier.
- NEVER add vague markers like `TODO: fix this` without context.
- NEVER rewrite linter, formatter, or type-checker directive comments into JSDoc.
- NEVER load both references by default when the task clearly concerns only JSDoc or only comment quality.

## Before Auditing or Editing, Ask

Apply these checks before you change documentation:

- Is the target exported or internal? Exported APIs need comprehensive docs. Internal code needs judgment.
- Is the issue missing syntax, missing intent, or noisy comments? Fix the actual gap.
- Will the documentation stay accurate as the code changes? Prefer concise, stable facts over speculative detail.
- Does the task require implementation or only advice? Skip reference loading for answer-only questions.

## How to Use

### 1. Load References Based on Task Type

**For JSDoc additions or validation:**

Read [`jsdoc.md`](references/jsdoc.md) in full before you implement.
Critical content: `@example` code fence syntax, object-parameter dot notation, `@template` requirements, and edge cases.

Do NOT load `comments.md` unless the task explicitly mentions comment markers (`TODO`, `FIXME`, and similar) or comment-quality issues.

**For comment-quality audits:**

Read [`comments.md`](references/comments.md) in full before you implement.
Critical content: comment-marker standards, what to remove versus preserve, and placement rules.

Do NOT load `jsdoc.md` unless the task explicitly mentions JSDoc tags (`@param`, `@returns`, and similar) or function/type documentation.

Do NOT load any references when you are only answering questions, not implementing changes, or when the task is general code quality.

### 2. Expert Judgment Framework

Apply this thinking framework before auditing:

**Question 1: Who is the reader?**
- API consumers: Lack implementation context → Document comprehensively
- Team members: Have codebase context → Document non-self-evident behaviors only
- Future you (6 months): Will forget subtle decisions → Document rationale

**Question 2: Opacity vs Complexity?**
- Opacity = Intent is hidden → Must document (e.g., cache.invalidate() - why? performance? correctness?)
- Complexity = Implementation is intricate → Implementation comments, not JSDoc

**Question 3: Maintenance cost trade-off?**
- High churn code: Minimal docs (won't stay accurate)
- Stable API: Comprehensive docs (will stay accurate)
- Internal utilities: Brief docs (low reader count × low frequency = minimal ROI)

#### Two-Tier Decision Rule

After applying the thinking framework:

**Is this exported (public API)?**
→ YES: Comprehensive documentation REQUIRED
- All @param, @returns, @template, @throws, @example
- Even if "obvious" - consumers lack your context

**Is this internal code?**
→ Apply judgment: Document what's NOT self-evident from:
1. Function name and type signature
2. Parameter names and types
3. Standard patterns in the codebase

**Rule of thumb**: If a competent team member would ask "why?" or "what's the edge case?" - document it. If they'd say "obvious" - skip it.

### 3. Evaluating Documentation Sufficiency

Use this decision tree to determine if documentation is complete:

**Step 1: Determine visibility tier**
```
Is it exported (public API)?
  YES → Tier 1: Comprehensive documentation required
  NO  → Tier 2: Judgment-based minimal documentation
```

**Step 2: Apply entity-specific requirements**

**Tier 1 (Exported) - Always Required:**
- Description (purpose, usage context, "when to use" for appropriate entities)
- All @param with property documentation for objects
- @returns (unless void)
- @template with constraint explanations for generics
- @throws with triggering conditions
- At least one realistic @example

**Tier 2 (Internal) - Judgment-Based:**
- Brief description (one line acceptable)
- @param for non-obvious parameters only
- @returns if non-obvious
- @template for generics
- @example only if behavior is complex

**Entity-Specific Additions:**
- **Classes (Tier 1)**: Constructor docs, public method docs, instantiation example
- **Types/Interfaces (Tier 1)**: Property descriptions for all public properties
- **Constants/Variables**: Units/constraints if applicable (e.g., "milliseconds", "must be positive")

**Sufficiency Checklist:**

Before marking documentation as "sufficient", verify:
- [ ] All exported items have comprehensive documentation
- [ ] All @param tags describe what the parameter does (not just type info)
- [ ] All @returns tags describe what is returned in different scenarios
- [ ] All @example tags use proper code fences with language identifier
- [ ] No @returns on void functions
- [ ] Generic functions have @template for each type parameter
- [ ] Object parameters use dot notation for property documentation
- [ ] Descriptions focus on WHAT/WHY, not HOW

### 4. When References Are Insufficient

If you encounter scenarios not covered in the references or standard patterns:

**Fallback strategy:**
1. Apply the two-tier rule (export vs internal) as your foundation.
2. Prioritize clarity over completeness. It is better to document what you know than to guess syntax.
3. Use standard JSDoc conventions from the official TypeScript or JSDoc documentation.
4. Document your uncertainty with a NOTE marker: `// NOTE: JSDoc syntax may need review for [specific case]`.
5. If the case is truly ambiguous, ask the user for clarification instead of making assumptions.

This fallback is for rare edge cases only. Do not use it to avoid loading the relevant reference when the task clearly requires one.

**Common uncovered scenarios:**
- Exotic TypeScript features (mapped types, conditional types, template literal types)
- Framework-specific patterns (React hooks with generics, Vue composables)
- Complex callback signatures with multiple overloads

For these, default to clear descriptions in natural language rather than incomplete JSDoc tags.

### 5. Use the Report Template (For Explicit Audit Requests)

When users explicitly request a documentation audit or invoke the skill directly (`/accelint-ts-documentation <path>`), use the standardized report format:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The audit report format provides:
- Numbered findings with clear before/after examples
- Categorization (Missing, Incomplete, Incorrect Syntax, Quality, Internal)
- References to detailed guidance (jsdoc.md, comments.md)
- Summary table for tracking all issues

**When to use the audit template:**
- Skill invoked directly via `/accelint-ts-documentation <path>`
- User explicitly requests "documentation audit" or "audit documentation"
- User asks to "review all documentation" across file(s)

**When NOT to use the audit template:**
- User asks to "add JSDoc to this function" (direct implementation)
- User asks "what's wrong with this comment?" (answer the question)
- User requests specific fixes (apply fixes directly without formal report)

## Documentation Audit Anti-Patterns

When performing documentation audits, avoid these common mistakes:

### ❌ Incorrect: Over-documenting internal code

```typescript
// Internal utility with verbose documentation
/**
 * Internal helper function that validates input
 * @internal
 * @param x - The input value
 * @returns True if valid, false otherwise
 * @example
 * ```typescript
 * if (isValid(data)) { ... }
 * ```
 */
function isValid(x: unknown): boolean {
  return x != null;
}
```

Why this is wrong: Internal docs rot faster than public API docs because they're adjacent to frequently-changed implementation. Team members can read the actual implementation faster than reading outdated documentation that creates confusion. Reserve comprehensive docs for stable exported APIs where consumers cannot access implementation.

### ✅ Correct: Minimal internal docs, comprehensive public API docs

```typescript
// Internal utility - minimal documentation
/** Checks if value is not null/undefined */
function isValid(x: unknown): boolean {
  return x != null;
}

// Public API - comprehensive documentation even if "obvious"
/**
 * Validates user input data
 * @param data - User input to validate
 * @returns True if data is defined and not null
 * @example
 * ```typescript
 * if (validateInput(userData)) {
 *   processData(userData);
 * }
 * ```
 */
export function validateInput(data: unknown): boolean {
  return data != null;
}
```

### ❌ Incorrect: Documenting HOW instead of WHAT/WHY

```typescript
// JSDoc describes implementation details
/**
 * Loops through array using reduce to accumulate values into a sum
 */
function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

Why this is wrong: JSDoc appears in IDE autocomplete for API consumers who don't have access to implementation. Explaining HOW in JSDoc creates confusion ("why am I seeing implementation details in my autocomplete?") and increases refactoring surface area - every implementation change requires doc updates, leading to drift.

### ✅ Correct: Describe purpose and behavior, not implementation

```typescript
/**
 * Calculates the sum of all numbers in the array
 * @param numbers - Array of numbers to sum
 * @returns The total sum, or 0 for empty array
 */
function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### ❌ Incorrect: Using vague comment markers

```typescript
// Not actionable
// TODO: fix this
// TODO: improve performance
```

Why this is wrong: "TODO: fix this" creates diffusion of responsibility. After months pass, nobody knows if it's still relevant, who should fix it, or what "this" refers to. Vague markers accumulate as noise that reduces trust in ALL markers, making developers ignore even critical ones.

### ✅ Correct: Specific markers with ownership and context

```typescript
// TODO(username): Replace with binary search for O(log n) lookup
// FIXME(username): Throws error on empty array, add guard clause
```

## Documentation Quality Example

### Excellent Public API Documentation

```typescript
/**
 * Fetches user profile data from the authentication service
 *
 * Automatically retries up to 3 times on network failures with exponential
 * backoff. Throws if user is not authenticated or profile doesn't exist.
 *
 * @param userId - Unique identifier for the user profile to fetch
 * @param options - Configuration for fetch behavior
 * @param options.includeMetadata - Include account metadata (creation date, last login)
 * @param options.timeout - Request timeout in milliseconds (default: 5000)
 * @returns User profile with email, name, and optional metadata
 * @throws {AuthenticationError} When user session is expired or invalid
 * @throws {NotFoundError} When user profile doesn't exist
 * @throws {NetworkError} When all retry attempts are exhausted
 *
 * @example
 * ```typescript
 * // Basic usage
 * const profile = await fetchUserProfile('user-123');
 * console.log(profile.email);
 *
 * // With metadata and custom timeout
 * const profile = await fetchUserProfile('user-123', {
 *   includeMetadata: true,
 *   timeout: 10000
 * });
 * ```
 */
export async function fetchUserProfile(
  userId: string,
  options?: { includeMetadata?: boolean; timeout?: number }
): Promise<UserProfile> {
  // implementation
}
```

**What makes this excellent:**
- Describes hidden behaviors (retry logic with exponential backoff)
- Documents object parameters with dot notation (options.*)
- @throws lists all possible errors with triggering conditions
- @example shows both basic and advanced usage patterns
- Mentions defaults and constraints (timeout default: 5000)
- Focuses on WHAT/WHY (user needs), not HOW (implementation details)

## Conflict Resolution Principles

When judgment calls conflict, apply these priorities:

1. **Consistency > Perfection**: Follow existing codebase patterns
2. **Consumer > Maintainer**: Public API docs serve users without your context - be comprehensive
3. **Intent > Implementation**: Document WHAT/WHY, not HOW
4. **Stable > Churning**: Comprehensive docs for stable code, minimal for high-churn code
5. **Future clarity test**: "Would this help me in 6 months?" If no, remove it

## Edge Cases Require Reference Loading

Complex scenarios such as deprecated APIs, overloaded functions, generic utility types, callback parameters, builder patterns, and event emitters require detailed syntax guidance. When you encounter them:

Load the `jsdoc.md` reference. It contains comprehensive examples for these edge cases with the correct syntax patterns.

Key principle: Edge cases still follow the two-tier rule (export vs internal), but syntax details matter more. Do not guess. Load the reference.
