---
name: audit-documentation
description: Audit and improve JavaScript/TypeScript documentation including JSDoc comments (@param, @returns, @template, @example), comment markers (TODO, FIXME, HACK), and identifying comments to preserve or remove. Use when asked to 'add JSDoc', 'document this function', 'audit documentation', 'fix comments', or 'add TODO/FIXME markers'. Delegates to js-ts-best-practices skill.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
  requires: js-ts-best-practices
---

# Documentation Audit Skill

Focused wrapper around js-ts-best-practices that activates specifically for documentation-related tasks.

## When to Activate This Skill

Use this skill when the task involves:

### JSDoc Documentation
- Adding JSDoc comments to exported functions, types, interfaces, or classes
- Validating JSDoc completeness (missing @param, @returns, @template tags)
- Ensuring JSDoc @example tags use proper code fences
- Documenting object parameters with destructuring using dot notation

### Comment Quality
- Identifying and categorizing comments using proper markers (TODO, FIXME, HACK, NOTE, PERF, REVIEW, DEBUG, REMARK)
- Removing unnecessary comments (commented-out code, edit history, obvious statements)
- Preserving important comments (markers, linter directives, business logic)
- Improving comment placement (moving end-of-line comments above code)

### Documentation Audits
- Reviewing code for documentation completeness
- Ensuring exported code has comprehensive documentation
- Validating internal code has minimum required documentation

## When NOT to Use This Skill

Do not activate for:
- General code quality issues (use js-ts-best-practices instead)
- Performance optimization (use js-ts-best-practices instead)
- Type safety improvements (use js-ts-best-practices instead)
- Framework-specific documentation (React PropTypes, Vue props, etc.)

## How to Use

This skill delegates to js-ts-best-practices. When activated:

### 1. Verify Parent Skill Availability
Check that js-ts-best-practices skill is available. If not, inform the user.

### 2. Load Documentation References from Parent Skill

**Step 2a: Verify Current Structure**

First, check the parent skill's current organization by reading the "Documentation" section in `js-ts-best-practices/SKILL.md` (around lines 66-71) to confirm which files currently contain documentation rules.

**Step 2b: Load Documentation References**

**MANDATORY - Load all documentation-related files identified in Step 2a.**

As of this skill's last update, the expected files are:
1. **jsdoc.md** - JSDoc syntax, tag requirements, export documentation standards
2. **comment-markers.md** - TODO, FIXME, HACK, NOTE, PERF, REVIEW, DEBUG, REMARK markers
3. **comments-to-remove.md** - Commented code, edit history, obvious statements to delete
4. **comments-to-preserve.md** - Linter directives, business logic, marker comments to keep
5. **comments-placement.md** - Moving end-of-line comments above code for readability

**If parent skill has reorganized:**
- Look for files with "jsdoc", "comment", or "marker" in their names
- Load files listed under "Documentation" category in parent SKILL.md
- Load ALL documentation-related references, typically ~400-500 lines total

Read each file completely. Do NOT set line limits when reading these reference files.

**Do NOT load** other references (performance, safety, control-flow, state-management) from the parent skill for documentation-only audits.

### 3. Apply Documentation Audit Workflow

**Audit Mindset - Two-Tier Approach:**

**FIRST: Determine Scope (Public vs Internal)**

- **Is this exported/public API?** → Comprehensive documentation is REQUIRED (no exceptions)
  - All exports must have: description, @param, @returns (unless void), @template (if generic), @throws (if applicable), @example
  - Public API documentation is not optional, regardless of simplicity

- **Is this internal code?** → Apply judgment frameworks below to determine appropriate documentation level

**For Internal Code - Ask Before Documenting:**

1. **Complexity vs Clarity**
   - Is the logic self-explanatory from the code itself? Simple internal utilities may need only brief description
   - Does the function name and signature clearly convey intent? Good naming reduces doc needs
   - Are there subtle behaviors or edge cases? These MUST be documented even if code seems simple

2. **Maintenance Burden**
   - How often does this change? High-churn internal code should have focused docs that are easy to update
   - Are there non-obvious dependencies? Document these even for internal code
   - Will this confuse someone during code review? If yes, add clarifying comments

3. **Value vs Noise**
   - Does this documentation help the team 6 months from now? If not, it's noise
   - Am I stating the obvious or providing insight? "Gets name" is noise; "Cached for performance" is insight
   - Would a new team member benefit from this? If yes, document it

**Rule of thumb:** Public API = comprehensive docs always. Internal code = document what's not obvious.

**Audit Workflow Steps:**

When performing a documentation audit:

1. **Identify Scope**: Determine whether code is exported (public API) or internal
   - Exported code requires comprehensive documentation
   - Internal code requires minimal documentation (description, @param, @returns, @template)

2. **Check JSDoc Completeness**:
   - Functions: description, @param, @template (if generic), @returns (unless void)
   - Exported functions: also @throws and @example
   - Types/Interfaces: description, @template (if generic), property descriptions
   - Classes: description, @template (if generic), @example for exported classes
   - Constants: description

3. **Validate JSDoc Syntax**:
   - All @example tags must use code fences with language identifier
   - Object parameters must use dot notation for property documentation
   - Generic functions must include @template for each type parameter
   - void functions should not include @returns

4. **Review Comments**:
   - Apply appropriate markers (TODO, FIXME, HACK, NOTE, PERF, REVIEW, DEBUG, REMARK)
   - Remove commented-out code and edit history
   - Preserve linter directives and business logic explanations
   - Move end-of-line comments above code

5. **Report Findings**:
   - List missing JSDoc for exported code
   - Identify incomplete JSDoc (missing tags)
   - Flag incorrect JSDoc syntax (@example without code fence, missing @template)
   - List comments to remove or improve
   - Suggest marker additions where appropriate

### Evaluating Documentation Sufficiency

Use these decision trees to determine if documentation is complete:

**For Functions/Methods:**
```
Is it exported?
  YES → Must have:
    ✓ Description (what it does, not how)
    ✓ @param for each parameter (including object properties)
    ✓ @returns (unless void)
    ✓ @template (if generic)
    ✓ @throws (if throws errors)
    ✓ @example (at least one realistic example)

  NO (internal) → Must have:
    ✓ Description (brief, one line OK)
    ✓ @param for non-obvious parameters
    ✓ @returns (unless obvious or void)
    ✓ @template (if generic)
    Optional: @example if behavior is complex
```

**For Types/Interfaces:**
```
Is it exported?
  YES → Must have:
    ✓ Description (purpose and usage context)
    ✓ @template (if generic, explain type parameter constraints)
    ✓ Property descriptions for all public properties

  NO (internal) → Must have:
    ✓ Description (brief)
    ✓ Property descriptions for non-obvious properties
    Optional: @template description
```

**For Classes:**
```
Is it exported?
  YES → Must have:
    ✓ Class description (purpose, when to use)
    ✓ @template (if generic)
    ✓ @example (showing instantiation and basic usage)
    ✓ Constructor docs (if parameters exist)
    ✓ Public method docs (follow function rules)

  NO (internal) → Must have:
    ✓ Class description (brief)
    ✓ Public method docs (follow internal function rules)
    Optional: @example, detailed constructor docs
```

**For Constants/Variables:**
```
Is it exported?
  YES → Must have:
    ✓ Description (what it represents, when to use)
    ✓ Units/constraints if applicable (e.g., "milliseconds", "must be positive")

  NO (internal) → Must have:
    ✓ Description if non-obvious
    Optional: Inline comment if name is self-explanatory
```

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

## Documentation Audit Anti-Patterns

When performing documentation audits, NEVER:

❌ **Approve @example without code fences**
```typescript
// WRONG - will not render properly in most documentation tools
/**
 * @example
 * myFunction(42)
 */

// CORRECT - use code fence with language identifier
/**
 * @example
 * ```typescript
 * myFunction(42)
 * ```
 */
```

❌ **Over-document internal implementation details**
```typescript
// WRONG - internal utility with verbose documentation
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

// CORRECT - minimal docs for internal utilities, comprehensive for public API
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

❌ **Leave commented-out code after audit**
```typescript
// WRONG - dead code should be removed, not commented
function process(data) {
  // const oldWay = transform(data);
  // return oldWay.map(x => x * 2);
  return newWay(data);
}

// CORRECT - delete dead code (git preserves history)
function process(data) {
  return newWay(data);
}
```

❌ **Document internal implementation in JSDoc**
```typescript
// WRONG - JSDoc should describe WHAT/WHY, not HOW
/**
 * Loops through array using reduce to accumulate values into a sum
 */
function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// CORRECT - describe purpose and behavior, not implementation
/**
 * Calculates the sum of all numbers in the array
 * @param numbers - Array of numbers to sum
 * @returns The total sum, or 0 for empty array
 */
function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

❌ **Use @returns for void functions**
```typescript
// WRONG - void functions don't return values
/**
 * Logs a message to the console
 * @returns Nothing
 */
function logMessage(msg: string): void {
  console.log(msg);
}

// CORRECT - omit @returns for void functions
/**
 * Logs a message to the console
 * @param msg - The message to log
 */
function logMessage(msg: string): void {
  console.log(msg);
}
```

❌ **Add TODO without context**
```typescript
// WRONG - vague TODOs don't provide actionable information
// TODO: fix this
// TODO: improve performance
// TODO: handle edge cases

// CORRECT - specific TODOs with context and ownership
// TODO(username): Replace with binary search for O(log n) lookup
// FIXME(username): Throws error on empty array, add guard clause
// HACK(username): Temporary workaround for API bug #1234, remove when fixed
```

## Documentation Quality Examples

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

**Why this is excellent:**
- Describes WHAT (fetches profile) and WHY behaviors exist (retry logic)
- Documents object parameters with dot notation
- @throws lists all possible errors with conditions
- @example shows both basic and advanced usage
- Mentions defaults and constraints (timeout default: 5000)

### Poor Documentation

```typescript
/**
 * Gets user
 * @param id - user id
 * @returns user object
 */
export async function fetchUserProfile(
  userId: string,
  options?: { includeMetadata?: boolean; timeout?: number }
): Promise<UserProfile> {
  // implementation
}
```

**Why this is poor:**
- Doesn't explain retry behavior (hidden behavior)
- Doesn't document object properties (options.*)
- No @throws (function can throw 3 error types!)
- No @example (users don't know how to use it)
- Restates obvious info ("user id" doesn't add value beyond parameter name)

## Resolving Documentation Conflicts

When audit guidelines seem to conflict, use these resolution principles:

### Conflict: Comprehensive vs Concise

**Situation:** Public API seems "obvious" but requires comprehensive docs

**Resolution:** Public API documentation is for consumers who don't have implementation context. Always comprehensive for exports, even if obvious to maintainers.

```typescript
// Seems obvious to maintainers, but still needs comprehensive docs
/**
 * Calculates the total price including tax
 * @param basePrice - Price before tax in dollars
 * @param taxRate - Tax rate as decimal (0.08 = 8%)
 * @returns Total price with tax applied, rounded to 2 decimal places
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.08); // 108.00
 * ```
 */
export function calculateTotal(basePrice: number, taxRate: number): number {
  return Math.round((basePrice * (1 + taxRate)) * 100) / 100;
}
```

### Conflict: Document Internal Complexity vs Avoid Noise

**Situation:** Internal function is complex but well-named

**Resolution:** If the function name clearly conveys intent and the complexity is implementation detail, keep docs minimal but mention non-obvious behaviors.

```typescript
// Well-named but complex internally - minimal docs with key behaviors noted
/**
 * Validates and sanitizes user input. Removes HTML tags and trims whitespace.
 */
function sanitizeInput(raw: string): string {
  // 50 lines of complex regex and validation logic
}
```

### Conflict: Stable API vs Changing Requirements

**Situation:** API is stable but requirements discussion is ongoing

**Resolution:** Document current behavior comprehensively. Use @remarks or TODO for future considerations.

```typescript
/**
 * Authenticates user with email and password
 * @param email - User email address
 * @param password - User password (plain text, hashed internally)
 * @returns Authentication token valid for 24 hours
 * @remarks Currently uses JWT tokens. OAuth integration planned for v2.0.
 */
export function authenticate(email: string, password: string): Promise<string> {
  // implementation
}
```

### Conflict: Multiple Valid Documentation Approaches

**Situation:** Uncertainty about level of detail or structure

**Resolution Priority:**
1. Follow existing codebase patterns (consistency > perfection)
2. Favor user perspective over implementation perspective
3. When in doubt, ask: "Would this help me in 6 months?"
4. Prefer specific examples over abstract explanations

## Edge Cases and Special Scenarios

### Deprecated APIs

```typescript
/**
 * Authenticates user with username and password
 * @deprecated Since v2.0. Use authenticateWithEmail() instead for better security.
 * @param username - User's username (deprecated: use email instead)
 * @param password - User's password
 * @returns Authentication token
 * @see authenticateWithEmail
 */
export function authenticate(username: string, password: string): Promise<string> {
  // implementation
}
```

**Guidelines:**
- Use @deprecated with version and migration path
- Use @see to point to replacement
- Keep documentation minimal (deprecated APIs don't need examples)

### Overloaded Functions

```typescript
/**
 * Parses date from string or timestamp
 * @param input - Date string (ISO 8601) or Unix timestamp in milliseconds
 * @returns Parsed Date object
 * @throws {TypeError} When input is neither string nor number
 * @example
 * ```typescript
 * const date1 = parseDate('2024-01-15'); // from ISO string
 * const date2 = parseDate(1705276800000); // from timestamp
 * ```
 */
export function parseDate(input: string | number): Date;
```

**Guidelines:**
- Single documentation block covers all overloads
- @param describes all accepted types
- @example shows usage for each overload variant

### Generic Utility Types

```typescript
/**
 * Makes all properties of T optional and nullable
 * @template T - The type to transform
 * @example
 * ```typescript
 * type User = { name: string; age: number };
 * type PartialUser = Maybe<User>;
 * // Result: { name?: string | null; age?: number | null }
 * ```
 */
export type Maybe<T> = { [K in keyof T]?: T[K] | null };
```

**Guidelines:**
- @template explains type parameter purpose
- @example shows input type and resulting transformed type
- Include comment showing the result type for clarity

### Callback Parameters

```typescript
/**
 * Processes array items with custom handler
 * @param items - Array of items to process
 * @param handler - Callback invoked for each item
 * @param handler.item - Current item being processed
 * @param handler.index - Index of current item
 * @param handler.array - Original array reference
 * @returns Array of handler return values
 */
export function processItems<T, R>(
  items: T[],
  handler: (item: T, index: number, array: T[]) => R
): R[] {
  // implementation
}
```

**Guidelines:**
- Document callback using dot notation (handler.item, handler.index)
- Explain what the callback receives and should return
- Use @template for callback input/output types

### Builder Pattern / Fluent APIs

```typescript
/**
 * Creates a database query builder
 * @returns Query builder with chainable methods
 * @example
 * ```typescript
 * const users = await query()
 *   .from('users')
 *   .where('age', '>', 18)
 *   .limit(10)
 *   .execute();
 * ```
 */
export function query(): QueryBuilder {
  // implementation
}
```

**Guidelines:**
- Document the entry point function with full chain example
- Show realistic usage pattern in @example
- Individual builder methods can have minimal docs if chain example is clear

### Event Emitters / Listeners

```typescript
/**
 * Registers handler for connection events
 * @param event - Event name to listen for
 * @param handler - Callback invoked when event fires
 * @param handler.data - Event-specific data payload
 * @example
 * ```typescript
 * connection.on('data', (data) => {
 *   console.log('Received:', data.bytes);
 * });
 * ```
 */
on(event: 'data', handler: (data: { bytes: number }) => void): void;
```

**Guidelines:**
- Document each event type separately if payloads differ
- Use @param handler.data to describe event payload structure
- @example shows typical event handler pattern

## Relationship to js-ts-best-practices

This skill provides a **focused activation trigger** for documentation tasks. It:

- Activates on documentation-specific keywords
- Loads only relevant references from the parent skill
- Uses the same rules but with narrowed scope
- Avoids content duplication and drift

When documentation auditing reveals other code quality issues, suggest using js-ts-best-practices for comprehensive improvements.
