---
name: accelint-ts-documentation
description: Use when JavaScript or TypeScript documentation quality is the main task, especially JSDoc, comment markers, or non-obvious code comments. Covers adding or reviewing JSDoc for exported APIs, validating tags such as `@param`, `@returns`, `@template`, `@throws`, and `@example`, cleaning up TODO or FIXME style markers, removing dead comments, improving comment placement, and judging whether internal documentation is sufficient. Do not use it for general TypeScript code-quality reviews unless documentation is the primary focus.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.2"
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

For JSDoc additions or validation:

- Read [`jsdoc.md`](references/jsdoc.md) in full before you implement.
- Prioritize `@example` code fence syntax, object-parameter dot notation, `@template` requirements, and edge cases.
- Do NOT load `comments.md` unless the task explicitly mentions comment markers (`TODO`, `FIXME`, and similar) or comment-quality issues.

For comment-quality audits:

- Read [`comments.md`](references/comments.md) in full before you implement.
- Prioritize comment-marker standards, what to remove versus preserve, and placement rules.
- Do NOT load `jsdoc.md` unless the task explicitly mentions JSDoc tags (`@param`, `@returns`, and similar) or function/type documentation.

Do NOT load any references when you are only answering questions, not implementing changes, or when the task is general code quality.

### 2. Expert Judgment Framework

Apply this framework before you audit:

Question 1: Who is the reader?
- API consumers: They lack implementation context, so document comprehensively.
- Team members: They have codebase context, so document non-self-evident behavior only.
- Future you (6 months): Document subtle rationale you are likely to forget.

Question 2: Is the problem opacity or complexity?
- Opacity: Intent is hidden, so you MUST document it. Example: `cache.invalidate()` needs rationale such as performance or correctness.
- Complexity: Implementation is intricate, so use implementation comments instead of JSDoc.

Question 3: What is the maintenance cost trade-off?
- High-churn code: Keep docs minimal because they are less likely to stay accurate.
- Stable API: Document comprehensively because the docs are more likely to stay accurate.
- Internal utilities: Keep docs brief because reader count and reuse frequency are both low.

#### Two-Tier Decision Rule

Apply this rule after the framework:

Is this exported (public API)?
- YES: Comprehensive documentation is REQUIRED.
- Include `@param`, `@returns`, `@template`, `@throws`, and `@example`.
- Keep this standard even when the API feels obvious, because consumers lack your context.

Is this internal code?
- Apply judgment. Document what is NOT self-evident from:
  1. Function name and type signature
  2. Parameter names and types
  3. Standard patterns in the codebase

Rule of thumb: If a competent team member would ask "why?" or "what's the edge case?", document it. If they would say "obvious", skip it.

### 3. Evaluate Documentation Sufficiency

Use this decision tree:

**Step 1: Determine visibility tier**
```
Is it exported (public API)?
  YES → Tier 1: Comprehensive documentation required
  NO  → Tier 2: Judgment-based minimal documentation
```

**Step 2: Apply entity-specific requirements**

Tier 1 (Exported) - Always required:
- Description with purpose, usage context, and "when to use" guidance when appropriate
- All `@param` tags, including property documentation for object parameters
- `@returns` unless the return type is `void`
- `@template` with constraint explanations for generics
- `@throws` with triggering conditions
- At least one realistic `@example`

Tier 2 (Internal) - Judgment-based:
- Brief description. One line is acceptable.
- `@param` for non-obvious parameters only
- `@returns` if the return value is non-obvious
- `@template` for generics
- `@example` only if the behavior is complex

Entity-specific additions:
- Classes (Tier 1): Constructor docs, public method docs, and an instantiation example
- Types/interfaces (Tier 1): Property descriptions for all public properties
- Constants/variables: Units or constraints when applicable, such as "milliseconds" or "must be positive"

Sufficiency checklist:

Before you mark documentation as sufficient, verify:
- [ ] All exported items have comprehensive documentation
- [ ] All `@param` tags describe what the parameter does, not just type information
- [ ] All `@returns` tags describe what is returned in different scenarios
- [ ] All `@example` tags use proper code fences with a language identifier
- [ ] No `@returns` tag appears on `void` functions
- [ ] Generic functions have `@template` for each type parameter
- [ ] Object parameters use dot notation for property documentation
- [ ] Descriptions focus on WHAT or WHY, not HOW

### 4. When References Are Insufficient

If you encounter a scenario that the references or standard patterns do not cover:

Fallback strategy:
1. Apply the two-tier rule (exported versus internal) as the foundation.
2. Prioritize clarity over completeness. It is better to document what you know than to guess syntax.
3. Use standard JSDoc conventions from the official TypeScript or JSDoc documentation.
4. Mark uncertainty with `// NOTE: JSDoc syntax may need review for [specific case]`.
5. If the case is truly ambiguous, ask the user for clarification instead of making assumptions.

This fallback is for rare edge cases only. Do not use it to avoid loading the relevant reference when the task clearly requires one.

Common uncovered scenarios:
- Exotic TypeScript features such as mapped types, conditional types, and template literal types
- Framework-specific patterns such as React hooks with generics or Vue composables
- Complex callback signatures with multiple overloads

For these cases, prefer clear natural-language descriptions over incomplete JSDoc tags.

### 5. Use the Report Template for Explicit Audit Requests

Use the standardized report format when users explicitly request a documentation audit or invoke the skill directly with `/accelint-ts-documentation <path>`.

Template: [`assets/output-report-template.md`](assets/output-report-template.md)

The audit report format provides:
- Numbered findings with clear before/after examples
- Categorization (`Missing`, `Incomplete`, `Incorrect Syntax`, `Quality`, `Internal`)
- References to detailed guidance in `jsdoc.md` or `comments.md`
- Summary table for tracking all issues

Use the audit template when:
- The skill is invoked directly via `/accelint-ts-documentation <path>`
- The user explicitly requests a "documentation audit" or "audit documentation"
- The user asks to "review all documentation" across files

Do NOT use the audit template when:
- The user asks to "add JSDoc to this function" and wants direct implementation
- The user asks "what's wrong with this comment?" and wants the question answered
- The user requests specific fixes and wants them applied directly
## Documentation Audit Anti-Patterns

When you perform documentation audits, avoid these common mistakes:

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
