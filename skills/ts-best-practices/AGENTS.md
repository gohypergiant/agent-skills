# JavaScript and TypeScript Best Practices

## Abstract

Comprehensive coding standards for JavaScript and TypeScript applications, designed for AI agents and LLMs. This guide focuses on **code correctness, type safety, and defensive programming**. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

**Note:** For performance optimization tasks, use the `ts-performance` skill instead. For documentation tasks, use the `ts-documentation` skill.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant patterns
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Critical Anti-Patterns

**NEVER** do these - they appear in codebases frequently but significantly degrade code quality, safety, or maintainability:

- **NEVER** use `any` type - use `unknown` for truly unknown types or generics for flexible types
- **NEVER** use `enum` keyword - use `as const` objects to avoid extra JavaScript output and runtime overhead
- **NEVER** mutate function parameters - creates hidden side effects and breaks pure function principles
- **NEVER** return `null` or `undefined` - return zero values instead ([], {}, 0, "") to eliminate downstream null checks
- **NEVER** create unbounded loops or queues - set explicit limits to prevent runaway resource consumption and crashes

See individual reference files for detailed alternatives and ✅ correct patterns.

---

## 1. General Best Practices

### 1.1 Naming Conventions
Append qualifiers in descending order (latencyMsMax not maxLatencyMs) to enable autocomplete grouping; prefix booleans with `is`/`has`.
[View detailed examples](references/naming-conventions.md)

### 1.2 Functions
Keep functions under 50 lines; explicitly type return values; avoid defaults; use `function` keyword for pure functions.
[View detailed examples](references/functions.md)

### 1.3 Control Flow
Always use block style `{ }` for control flow (prevents bugs when adding code); use early returns for guard clauses.
[View detailed examples](references/control-flow.md)

### 1.4 State Management
Use `const` to signal immutability; never mutate function parameters (creates hidden side effects); keep leaf functions pure for testability.
[View detailed examples](references/state-management.md)

### 1.5 Return Values
Return zero values ([], {}, 0, '') instead of null/undefined to eliminate defensive null checks and enable method chaining and composition.
[View detailed examples](references/return-values.md)

### 1.6 Misc
Use Linux line endings; employ defensive programming; aim for zero technical debt.
[View detailed examples](references/misc.md)

### 1.7 Code Duplication (DRY Principle)
Extract common patterns into utility functions; consolidate duplicated logic; apply DRY when abstraction reduces complexity.
[View detailed examples](references/code-duplication.md)

---

## 2. TypeScript

### 2.1 Any
Never use `any` (disables type checking and propagates through codebase); use `unknown` to force validation or generics to preserve types.
[View detailed examples](references/any.md)

### 2.2 Enums
Never use `enum` (generates 5+ lines of runtime code per enum); use `as const` objects for zero-cost type-safe constants.
[View detailed examples](references/enums.md)

### 2.3 Type vs. Interface
Prefer `type` over `interface`; use `interface` only for declaration merging or class contracts.
[View detailed examples](references/type-vs-interface.md)

---

## 3. Safety

### 3.1 Input Validation
Always validate and sanitize external data at system boundaries with schemas.
[View detailed examples](references/input-validation.md)

### 3.2 Assertions
Use assertions to detect programmer errors; split compound assertions; include values.
[View detailed examples](references/assertions.md)

### 3.3 Error Handling
Handle all errors explicitly; use Result types or try-catch blocks; never swallow errors silently.
[View detailed examples](references/error-handling.md)

### 3.4 Error Messages
Make user errors empathetic and actionable; make developer errors specific with values.
[View detailed examples](references/error-messages.md)

### 3.5 Bounded Iteration
Never create unbounded loops, queues, or recursive calls; set explicit limits to prevent runaway resource consumption and system crashes.
[View detailed examples](references/bounded-iteration.md)

---

## 4. Performance

**For performance optimization tasks**, use the `ts-performance` skill instead. It provides:
- 4-phase workflow (Profile → Analyze → Optimize → Verify)
- Comprehensive optimization patterns for all performance categories
- Profiling tool guidance (Chrome DevTools, Node.js --prof)
- Bottleneck categorization and decision frameworks

---

## 5. Documentation

**For documentation-specific tasks**, use the `ts-documentation` skill instead. It provides comprehensive guidance for JSDoc comments, comment markers, and code comment quality.
