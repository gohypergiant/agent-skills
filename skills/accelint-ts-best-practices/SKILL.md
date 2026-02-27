---
name: accelint-ts-best-practices
description: Comprehensive TypeScript/JavaScript coding standards focusing on type safety, defensive programming, and code correctness. Use when (1) Writing or reviewing TS/JS code, (2) Fixing type errors or avoiding any/enum/null, (3) Implementing control flow, state management, or error handling, (4) Applying zero-value pattern or immutability, (5) Code review for TypeScript anti-patterns. Covers naming conventions, function design, return values, bounded iteration, input validation. For performance optimization, use accelint-ts-performance skill. For documentation, use accelint-ts-documentation skill.
license: Apache-2.0
metadata:
  author: accelint
  version: "2.0"
---

# JavaScript and TypeScript Best Practices

Comprehensive coding standards for JavaScript and TypeScript applications, designed for AI agents and LLMs working with modern JavaScript/TypeScript codebases.

**Note:** This skill focuses on general best practices, TypeScript patterns, and safety. For performance optimization, use the `accelint-ts-performance` skill instead.

## When to Use This Skill

This skill provides expert-level patterns for JavaScript and TypeScript code. Load [AGENTS.md](AGENTS.md) to scan rule summaries and identify relevant optimizations for your task.

## Decision Framework: How to Think About Trade-offs

Before writing or reviewing code, use these decision frameworks to navigate competing concerns. Expert developers don't just follow rules—they make intentional trade-offs.

### 1. Safety vs Performance

**Question**: Does this code handle external data, work with production data, or control resource usage?

- **YES** → **Prioritize safety first**
  - Bounded iteration (set `MAX_ITERATIONS`, `MAX_QUEUE_SIZE`)
  - Input validation with schemas (never trust external data)
  - Explicit error handling (no silent failures)
  - *Why*: Safety bugs cause outages, data loss, security vulnerabilities. Performance can be optimized later; safety bugs are expensive to fix in production.

- **NO** → **Optimize for readability and maintainability**
  - Clear naming and simple structure
  - Avoid premature optimization
  - *Why*: Internal code is refactored frequently. Readable code is easier to optimize when profiling shows it's necessary.

### 2. Type Strictness vs Pragmatism

**Question**: Am I at a system boundary (API endpoint, user input, third-party library, file I/O)?

- **YES** → **Use strict validation**
  - Use `unknown` instead of `any`
  - Validate explicitly with schemas (Zod, io-ts, Valibot)
  - Handle invalid data with clear error messages
  - *Why*: System boundaries are trust boundaries. One `any` at a boundary infects 50+ downstream variables with no type checking.

- **NO** → **Trust internal types, use generics for flexibility**
  - Internal functions can trust their inputs (validated at boundary)
  - Use generics `<T>` to preserve type information through transformations
  - *Why*: Over-validating internal code adds noise. Type safety propagates from boundaries through the codebase.

### 3. Abstraction vs Concreteness

**Question**: Does this pattern appear 3+ times with identical structure?

- **NO** → **Keep code concrete**
  - Inline implementation at each call site
  - Don't create abstractions for future flexibility
  - *Why*: Premature abstraction is harder to understand and change than duplicated concrete code. Wait until you have 3+ real cases to understand the actual pattern.

- **YES** → **Apply the "3×3 Rule" before abstracting**
  - ✅ Extract if: 3+ instances AND each is 3+ lines AND abstraction is simpler than duplication
  - ❌ Don't extract if: Pattern varies slightly between uses OR abstraction adds complexity
  - *Why*: Abstraction has a cost—cognitive load, indirection, inflexibility. Only abstract when duplication cost exceeds abstraction cost.

**Example of good abstraction timing**:
```ts
// After 1 use: Keep concrete
const user1 = await fetch('/user/1').then(r => r.json());

// After 2 uses: Still concrete (not 3+ yet)
const user2 = await fetch('/user/2').then(r => r.json());

// After 3 uses with identical structure: NOW abstract
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/user/${id}`);
  return response.json();
}
```

### 4. Null Handling Strategy

**Question**: Does the caller need to distinguish "value absent" from "value is zero/empty"?

- **NO** → **Return zero values** ([], {}, '', 0)
  - Eliminates null checks
  - Enables method chaining
  - *Why*: In most cases, "no results" and "empty results" are functionally equivalent. Zero values compose safely.

- **YES** → **Return union with undefined** (`T | undefined`)
  - Makes absence explicit in type system
  - Forces caller to handle absence
  - *Why*: Database lookups, cache misses, and optional configuration need to distinguish "not found" from "empty."

**When to use each**:
```ts
// Return zero value: "no results" = "empty results"
function getActiveUsers(): User[] {
  return users.filter(u => u.active);  // [] if none active
}

// Return T | undefined: absence has meaning
function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);  // undefined if not found
}
```

### 5. Error Handling Strategy

**Question**: Can this operation fail in ways the caller should handle?

- **YES** → **Make errors explicit**
  - Use Result types: `{ success: true, data: T } | { success: false, error: Error }`
  - Or throw typed errors with recovery instructions
  - *Why*: Forces callers to handle failures. Silent failures and swallowed errors cause silent data corruption.

- **NO** → **Crash with assertion**
  - Use `assert()` or `throw` for programmer errors
  - *Why*: Programmer errors (wrong function usage, violated invariants) should crash immediately, not propagate silently.

**When to use each**:
```ts
// Expected failure: use Result type
type ParseResult =
  | { success: true; data: User }
  | { success: false; error: string };

function parseUser(input: unknown): ParseResult {
  // User input can be invalid - expected failure
}

// Programmer error: crash with assertion
function getFirst<T>(arr: T[]): T {
  assert(arr.length > 0, 'getFirst() requires non-empty array');
  return arr[0];
}
```

### 6. When to Break the Rules

Every rule has exceptions. Break rules when:

1. **External API contract requires it**
   - Example: Third-party library expects `null` return → return `null`
   - Example: Legacy API requires `enum` → use `enum` for compatibility

2. **Performance profiling proves it's a bottleneck**
   - Example: Bounded iteration adds 50ms to hot path → profile first, optimize if confirmed
   - *Why*: Measure before optimizing. Intuition about performance is often wrong.

3. **Type system limitation forces it**
   - Example: Complex conditional type breaks inference → use `any` with explicit comment and runtime validation
   - *Why*: Rare cases where TypeScript's type system isn't expressive enough. Document why and add runtime safety.

**When breaking rules, always**:
- Add a comment explaining why (reference specific constraint)
- Add runtime validation if removing type safety
- Link to issue/ticket for future resolution

## How to Use

This skill uses a **progressive disclosure** structure to minimize context usage:

### 1. Use Automation Scripts (Recommended)
For maximum efficiency, use the provided scripts to automate detection and reporting:
- **[scripts/detect-best-practice-violations.sh](scripts/detect-best-practice-violations.sh)** - Scans code for best practice violations, outputs JSON
- **[scripts/generate-audit-report.sh](scripts/generate-audit-report.sh)** - Generates pre-filled audit report from JSON
- **[scripts/quick-categorize.sh](scripts/quick-categorize.sh)** - Quick lookup for violation categorization

**Example workflow:**
```bash
# Detect violations in a file/directory
./scripts/detect-best-practice-violations.sh src/ > violations.json

# Generate audit report
./scripts/generate-audit-report.sh violations.json "MyComponent" > report.md

# Quick categorize a specific issue
echo "using any type" | ./scripts/quick-categorize.sh
```

See [scripts/README.md](scripts/README.md) for detailed usage, coverage model, and workflow examples.

Scripts automate detection of ~60-70% of mechanical violations. **Context savings: ~2,100 tokens per full audit workflow**.

### 2. Start with the Overview (AGENTS.md)
Read [AGENTS.md](AGENTS.md) for a concise overview of all rules with one-line summaries organized by category.

### 3. Load Specific Rules as Needed
When you identify a relevant pattern or issue, load the corresponding reference file for detailed implementation guidance:

**Quick Start:**
- [quick-start.md](references/quick-start.md) - Complete workflow examples with before/after code

**General Best Practices:**
- [naming-conventions.md](references/naming-conventions.md) - Descriptive names, qualifier ordering, boolean prefixes
- [functions.md](references/functions.md) - Function size, parameters, explicit values
- [control-flow.md](references/control-flow.md) - Early returns, flat structure, block style
- [state-management.md](references/state-management.md) - const vs let, immutability, pure functions
- [return-values.md](references/return-values.md) - Return zero values instead of null/undefined
- [misc.md](references/misc.md) - Line endings, defensive programming, technical debt
- [code-duplication.md](references/code-duplication.md) - Extract common patterns, DRY principle, when to consolidate

**TypeScript:**
- [any.md](references/any.md) - Avoid any, use unknown or generics; propagation trap
- [enums.md](references/enums.md) - Use as const objects instead of enum; bundle size impact
- [type-vs-interface.md](references/type-vs-interface.md) - Prefer type over interface
- [edge-cases.md](references/edge-cases.md) - Non-obvious TypeScript traps and soundness holes

**Safety:**
- [input-validation.md](references/input-validation.md) - Validate external data with schemas
- [assertions.md](references/assertions.md) - Split assertions, include values
- [error-handling.md](references/error-handling.md) - Handle all errors explicitly
- [error-messages.md](references/error-messages.md) - User-friendly vs developer-specific messages

**Performance:**
- **For performance optimization tasks**, use the `accelint-ts-performance` skill for comprehensive profiling workflows and optimization patterns

**Documentation:**
- **For documentation tasks**, use the `accelint-ts-documentation` skill for comprehensive JSDoc and comment guidance

### 4. Apply the Pattern
Each reference file contains:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

### 5. Use the Report Template (For Manual Audits)
When this skill is invoked, use the standardized report format:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (potential bugs, type safety, maintainability, runtime failures)
- Categorization (Type Safety, Safety, State Management, Return Values, Code Quality)
- Pattern references linking to detailed guidance in references/
- Phase 2 summary table for tracking all issues

**When to use the audit template:**
- Skill invoked directly via `/accelint-ts-best-practices <path>`
- User asks to "review code quality" or "audit code" across file(s), invoking skill implicitly

**When NOT to use the report template:**
- User asks to "fix this type error" (direct implementation)
- User asks "what's wrong with this code?" (answer the question)
- User requests specific fixes (apply fixes directly without formal report)

