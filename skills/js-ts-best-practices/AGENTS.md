# JavaScript and TypeScript Best Practices

## Abstract

Comprehensive performance optimization guide for JavaScript or TypeScript applications, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant optimizations
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Critical Anti-Patterns

**NEVER** do these - they appear in codebases frequently but significantly degrade performance or maintainability:

- **NEVER** use `any` type - use `unknown` for truly unknown types or generics for flexible types
- **NEVER** use `enum` keyword - use `as const` objects to avoid extra JavaScript output
- **NEVER** chain array methods (.filter().map().reduce()) - use single `reduce` pass for better performance
- **NEVER** use `Array.includes()` for repeated lookups - use `Set.has()` instead (O(n) → O(1))
- **NEVER** await before checking if you need the result - defer `await` into branches that use it
- **NEVER** recompute constants inside loops - hoist invariants or curry functions to precompute
- **NEVER** mutate function parameters - creates hidden side effects and breaks pure function principles
- **NEVER** return `null` or `undefined` - return zero values instead ([], {}, 0, "") to eliminate downstream null checks
- **NEVER** create unbounded loops or queues - set explicit limits to prevent runaway resource consumption
- **NEVER** place `try/catch` in hot paths - degrades V8 optimization; validate inputs instead

See individual reference files for detailed alternatives and ✅ correct patterns.

---

## 1. General

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
Return zero values ([], {}, 0, '') instead of null/undefined to eliminate defensive null checks and enable method chaining.
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
Handle all errors explicitly.
[View detailed examples](references/error-handling.md)

### 3.4 Error Messages
Make user errors empathetic and actionable; make developer errors specific with values.
[View detailed examples](references/error-messages.md)

---

## 4. Performance

**Before optimizing**: Profile first to identify actual bottlenecks. Premature optimization wastes effort on code that doesn't impact user experience.

Design for performance from the start. Optimize slowest resources first: `network >> disk >> memory >> cpu`

### 4.1 Reduce Branching
Use table lookups instead of conditionals for static values.
[View detailed examples](references/reduce-branching.md)

### 4.2 Reduce Looping
Combine `.filter().map()` into single `reduce` pass; use `Set.has()` over `Array.includes()` for 10-50x speedup (O(1) vs O(n)).
[View detailed examples](references/reduce-looping.md)

### 4.3 Memoization
Use only when appropriate; avoid memoizing trivial computations.
[View detailed examples](references/memoization.md)

### 4.4 Batching
Batch operations to amortize costly processes, especially for I/O-bound operations.
[View detailed examples](references/batching.md)

### 4.5 Predictable Execution and Cache Locality
Write code with clear execution paths; use sequential memory access; group related data.
[View detailed examples](references/predictable-execution.md)

### 4.6 Bounded Iteration
Set limits on all loops, queues, and data structures.
[View detailed examples](references/bounded-iteration.md)

### 4.7 Defer Await
Move `await` into branches where they're actually used to avoid blocking.
[View detailed examples](references/defer-await.md)

### 4.8 Cache Property Access and Variable Aliases
Cache property lookups; eliminate single-use aliases; avoid unnecessary destructuring.
[View detailed examples](references/cache-property-access.md)

### 4.9 Cache Storage API Calls
Cache `localStorage`, `sessionStorage`, and `document.cookie` reads in memory.
[View detailed examples](references/cache-storage-api.md)

### 4.10 Object Operations
Mutate when safe; use shallow clones when needed; preallocate object shapes.
[View detailed examples](references/object-operations.md)

### 4.11 Additional Performance Concerns
Batch string operations; compile regex once; avoid async overhead; minimize closure scope.
[View detailed examples](references/performance-misc.md)

### 4.12 Avoid Needless Allocations
Inline simple computations; avoid intermediate variables in hot paths; reduce GC pressure.
[View detailed examples](references/avoid-allocations.md)

### 4.13 Currying and Partial Application
Curry functions to precompute constant parameters; reduce repeated work in loops and hot paths.
[View detailed examples](references/currying.md)

---

## 5. Documentation

**For documentation-specific tasks**, use the `audit-documentation` skill instead. It provides comprehensive guidance for JSDoc comments, comment markers, and code comment quality.
