# TypeScript Documentation Skill

Audit and improve JavaScript/TypeScript documentation quality: JSDoc completeness, comment markers, dead-comment cleanup, and documentation judgment for exported APIs versus internal code.

## What This Skill Does

This skill audits and improves TypeScript and JavaScript documentation. It enforces comprehensive docs for exported APIs, uses judgment for internal code, validates JSDoc syntax, audits comment quality, and produces either formal reports or direct fixes.

### Core capabilities

- **JSDoc validation** — Check exported functions, types, interfaces, classes, and constants for missing or incomplete documentation
- **Comment-quality audits** — Review TODO/FIXME/HACK markers, remove dead code comments, improve comment placement
- **Two-tier documentation** — Exported APIs get comprehensive docs; internal code uses judgment
- **Syntax enforcement** — Validate `@param`, `@returns`, `@template`, `@throws`, `@example` tags and code-fence requirements
- **Formal audit reports** — Structured findings with before/after examples, categorization, and references

### When to use this skill

Use this skill when:

- Adding or reviewing JSDoc on exported functions, types, or classes
- Auditing documentation drift after refactors
- Cleaning up vague TODO/FIXME markers or dead comments
- Validating that `@example` tags use fenced code blocks with language identifiers
- Determining whether internal code needs documentation
- Producing formal documentation audit reports for review

Do not use this skill for:

- General TypeScript code-quality reviews focused on type safety, correctness, or performance
- Test-writing or test-quality audits
- Security reviews or vulnerability assessments

## How It Works

### The two-tier rule

This skill applies different standards based on code visibility:

**Exported (public API)** → Comprehensive documentation required:
- Description with purpose and usage context
- All `@param`, `@returns`, `@template`, `@throws` tags
- At least one realistic `@example` with fenced code blocks
- Property descriptions for interfaces and types

**Internal code** → Judgment-based minimal documentation:
- Brief description (one line acceptable)
- `@param` only for non-obvious parameters
- `@returns` if non-obvious
- `@template` for generics
- Skip `@example` and `@throws` unless behavior is complex

### Workflow modes

**Direct implementation** — When you ask to "add JSDoc to this function" or "clean up comments in this file", the skill loads the relevant reference, applies fixes, and returns the updated code.

**Formal audit** — When you invoke `/accelint-ts-documentation <path>` or explicitly request a documentation audit, the skill produces a structured report using the standardized template with categorized findings, before/after examples, and actionable recommendations.

**Answer-only guidance** — When you ask "should internal helpers get @example tags?", the skill answers the policy question directly without loading references or implementing changes.

### Reference loading strategy

The skill loads references only when needed:

- **JSDoc work** → Load `references/jsdoc.md` for syntax rules, tag requirements, and edge cases
- **Comment-quality work** → Load `references/comments.md` for marker standards, removal rules, and placement
- **Mixed tasks** → Load both when the request covers JSDoc and comment cleanup
- **Answer-only questions** → Skip reference loading and answer directly

## Usage Examples

### Example 1: Audit exported function JSDoc

```typescript
// You provide:
export function clamp(min: number, max: number, value: number): number {
  if (min > max) throw new RangeError('bad range');
  return Math.max(min, Math.min(max, value));
}

// Skill identifies:
// - Missing description
// - Missing @param tags for all three parameters
// - Missing @returns
// - Missing @throws for RangeError
// - Missing @example with fenced code block
```

### Example 2: Internal helper judgment

```typescript
// You provide:
/** Checks if a value is not null or undefined. */
function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

// Skill evaluates:
// Brief internal documentation is sufficient here.
// Could add @template for the generic, but not required.
// No need for @example or @throws on simple internal helpers.
```

### Example 3: Fix @example syntax

```typescript
// Before:
/**
 * Formats a username for display.
 * @param value - Raw username.
 * @returns Formatted username.
 * @example
 * formatUser('sam');
 */
export function formatUser(value: string): string {
  return value.trim();
}

// After:
/**
 * Formats a username for display.
 * @param value - Raw username.
 * @returns Formatted username.
 * @example
 * ```typescript
 * const formatted = formatUser('sam');
 * console.log(formatted); // 'sam'
 * ```
 */
export function formatUser(value: string): string {
  return value.trim();
}
```

### Example 4: Clean up vague markers

```typescript
// Before:
// TODO: fix this
// TODO: improve performance

// After:
// TODO(alice): Replace with binary search for O(log n) lookup
// PERF(alice): Current linear scan is O(n), bottleneck for >1000 items
```

## Key Documentation Standards

### JSDoc requirements

**All exported code must have:**
- Description explaining purpose and behavior
- `@param` for every parameter (use dot notation for object properties)
- `@returns` unless the function returns `void`
- `@template` for each generic type parameter with constraint explanation
- `@throws` for all possible errors with triggering conditions
- At least one `@example` with fenced code blocks and language identifier

**@example code fence syntax:**
```typescript
/**
 * @example
 * ```typescript
 * const result = add(1, 2);
 * console.log(result); // 3
 * ```
 */
```

### Comment markers

Use specific markers with context and ownership:

- `TODO(username):` — Future changes or unimplemented features
- `FIXME(username):` — Known bugs or critical defects
- `HACK(username):` — Workarounds or sub-optimal solutions
- `NOTE:` — Important informational points
- `PERF(username):` — Performance bottlenecks or optimizations

### Comments to remove

Always remove during audits:
- Commented-out code (version control preserves history)
- Edit history ("Added 2024-01-15", "Changed by John")
- Obvious restatements (`// increment counter` above `counter++`)

### Comments to preserve unchanged

Never modify tool directives:
- Linter: `// eslint-disable-next-line`, `// biome-ignore`
- Type checker: `// @ts-expect-error`, `// @ts-ignore`
- Formatter: `// prettier-ignore`

## Anti-Patterns

### ❌ Over-documenting internal code

```typescript
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

Internal docs rot faster than public API docs. Team members read implementation faster than outdated documentation. Reserve comprehensive docs for stable exported APIs.

### ✅ Minimal internal, comprehensive public

```typescript
// Internal - minimal
/** Checks if value is not null/undefined */
function isValid(x: unknown): boolean {
  return x != null;
}

// Public - comprehensive
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

### ❌ Documenting HOW instead of WHAT/WHY

```typescript
/**
 * Loops through array using reduce to accumulate values into a sum
 */
function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

JSDoc appears in IDE autocomplete. Consumers don't have access to implementation. Explaining HOW increases refactoring burden.

### ✅ Describe behavior, not implementation

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

## Formal Audit Reports

When you invoke the skill with `/accelint-ts-documentation <path>` or explicitly request a documentation audit, the skill produces a structured report:

**Report structure:**
- Numbered findings with clear titles
- File and line location for each issue
- Before (❌) and after (✅) code examples
- Issue explanation in bullet points
- Category (Missing, Incomplete, Incorrect Syntax, Quality, Internal)
- Reference to detailed guidance (`jsdoc.md` or `comments.md`)
- Summary table with all findings

Example finding:

```markdown
### 1. fetchUserProfile - Missing @throws documentation

**Location:** `src/api/client.ts:45`

❌ Current: Function throws errors but does not document them
```typescript
export async function fetchUserProfile(userId: string): Promise<Profile> {
  // implementation
}
```

**Issue:**
- Missing @throws for AuthenticationError
- Missing @throws for NotFoundError
- Missing @throws for NetworkError

**Category:** Incomplete Documentation
**Reference:** jsdoc.md

✅ Recommended:
```typescript
/**
 * Fetches user profile data from the authentication service
 * @param userId - Unique identifier for the user
 * @returns User profile with email and name
 * @throws {AuthenticationError} When session is expired
 * @throws {NotFoundError} When profile doesn't exist
 * @throws {NetworkError} When all retries are exhausted
 */
export async function fetchUserProfile(userId: string): Promise<Profile> {
  // implementation
}
```
```

## Edge Cases

The skill handles complex scenarios documented in `references/jsdoc.md`:

- **Deprecated APIs** — Use `@deprecated`, `@see`, and migration path guidance
- **Overloaded functions** — Single doc block with multiple examples
- **Generic utility types** — `@template` explanations for type transformations
- **Destructured parameters** — Document object parameter with dot notation for properties
- **Builder patterns** — Show method chaining in examples
- **Event emitters** — Document event-specific payloads

## References

Detailed guidance lives in the skill's reference files:

- **[references/jsdoc.md](references/jsdoc.md)** — JSDoc syntax, tag requirements, exported vs internal standards, edge cases
- **[references/comments.md](references/comments.md)** — Comment markers, removal rules, preservation rules, placement standards
- **[assets/output-report-template.md](assets/output-report-template.md)** — Formal audit report structure

## Evaluation Coverage

The skill includes 20 evaluation cases in `evals/evals.json` covering:

- JSDoc completeness for exported functions, types, interfaces, classes, and constants
- Internal code judgment calls
- Generic type parameter documentation (`@template`)
- `@example` code fence validation
- Void function `@returns` removal
- Object parameter dot notation
- Comment marker quality (TODO/FIXME/HACK)
- Dead code and edit-history comment removal
- Tool directive preservation (eslint, @ts-expect-error)
- Business-logic comment preservation
- Reference loading strategy (JSDoc vs comments vs both)
- Formal audit vs direct implementation workflows
- Skill boundary cases (not triggering on generic TS reviews)

## Repository Context

This skill is part of the agent-skills repository. Related documentation:

- **[ARCHITECTURE.md](/Users/brandon.pierce/Projects/agent-skills/ARCHITECTURE.md)** — Repository structure and component architecture
- **[AGENTS.md](/Users/brandon.pierce/Projects/agent-skills/AGENTS.md)** — Agent behavior and workflow conventions

## License

Apache-2.0
