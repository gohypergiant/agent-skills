# JavaScript and TypeScript Best Practices

Comprehensive coding standards and performance optimization guide for JavaScript and TypeScript applications, designed for AI agents and LLMs working with modern JavaScript/TypeScript codebases.

## Overview

This skill provides structured guidance for JavaScript and TypeScript development, covering:
- Naming conventions and code style
- Control flow and state management
- TypeScript best practices (avoid any/enum, prefer type over interface)
- Safety patterns (input validation, assertions, error handling)
- Performance optimization (reduce branching/looping, memoization, caching)
- Documentation standards (JSDoc, comment markers)

Based on ["HyperStyle"](https://docs.accelint.dev/doc/hyperstyle-javascript-urdYtXRUfn), a coding philosophy that prioritizes **safety**, **performance**, and **developer experience**, in that order. Inspired by [TigerBeetle's](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md) practices, it aims to build robust, efficient, and maintainable software through disciplined engineering.

**Note:** This skill focuses on JavaScript/TypeScript-specific patterns. Framework-specific optimizations (React, Vue, Angular) should use their dedicated skills.

---

## Quick Start

### For Agents/LLMs

1. **Read [SKILL.md](SKILL.md)** - Understand when to activate this skill and how to use it
2. **Reference [AGENTS.md](AGENTS.md)** - Browse rule summaries organized by category
3. **Load specific patterns** - Access detailed examples in `references/` as needed
4. **Apply the pattern** - Each reference file contains ❌/✅ examples

### For Humans

This skill is optimized for AI agents but humans may find it useful for:
- Learning JavaScript/TypeScript performance optimization
- Reviewing code for common anti-patterns
- Understanding safety-first programming principles
- Systematic code quality improvement
- Writing better documentation

---

## Rule Categories

### 1. General Best Practices
Foundational patterns for clean, maintainable code:
- Naming conventions (descriptive names, qualifier ordering, boolean prefixes)
- Functions (keep under 50 lines, avoid defaults, pure functions)
- Control flow (early returns, flat structure, block style)
- State management (const over let, immutability, pure functions)
- Return values (zero values instead of null/undefined)
- Misc (line endings, defensive programming, technical debt)

### 2. TypeScript
TypeScript-specific patterns for type safety:
- Avoid `any` (use `unknown` or generics)
- Avoid `enum` (use `as const` objects)
- Prefer `type` over `interface` (except for declaration merging)

### 3. Safety
Patterns for building robust, error-resistant code:
- Input validation (validate external data with schemas)
- Assertions (split assertions, include values)
- Error handling (handle all errors explicitly)
- Error messages (user-friendly vs developer-specific)

### 4. Performance
Patterns to optimize execution and reduce bottlenecks:
- Reduce branching (lookup tables vs conditionals)
- Reduce looping (reduce vs chained methods, Set.has() vs Array.includes())
- Memoization (when to cache, avoid trivial computations)
- Batching (group I/O operations)
- Predictable execution (clear paths for CPU caching)
- Bounded iteration (set limits on loops and queues)
- Defer await (move await into branches that need it)
- Cache property access (reduce lookups in hot paths)
- Cache storage API (localStorage/sessionStorage/cookie reads)

### 5. Documentation
Patterns for clear, maintainable documentation:
- JSDoc (all exports need @param, @returns, @example)
- Comment markers (TODO, FIXME, HACK, NOTE, PERF)
- Comments to remove (commented code, edit history)
- Comments to preserve (markers, linter directives, business logic)
- Comments placement (move end-of-line comments above code)

---

## Key Features

### Progressive Disclosure
- Start with rule summaries in AGENTS.md
- Load detailed examples only when needed
- Minimizes context usage for LLMs

### Safety-First Philosophy
Design for correctness before performance:
- Validate at boundaries (all external data)
- Assertions for programmer errors (crash on corrupted state)
- Explicit error handling (no silent failures)
- Zero values (eliminate downstream null checks)

### Performance Optimization Hierarchy
Optimize slowest resources first:
```
network >> disk >> memory >> cpu
```
Always benchmark assumptions before moving on.

### Comprehensive Examples
Each reference file includes:
- ❌ Incorrect examples showing anti-patterns
- ✅ Correct examples showing optimal implementations
- Explanations of why the pattern matters

---

## Examples

### Example 1: Optimizing Array Operations

**Task:** "This filter().map() chain is slow on large arrays"

**Before:**
```ts
const result = items.filter(x => x.active).map(x => x.id);
```

**After:**
```ts
const result = items.reduce((acc, x) =>
  x.active ? [...acc, x.id] : acc,
  []
);
```

See [reduce-looping.md](references/reduce-looping.md) for details.

### Example 2: Fixing TypeScript `any` Usage

**Task:** "Replace `any` types with proper TypeScript types"

**Before:**
```ts
function process(data: any): any { /**/ }
```

**After:**
```ts
function process<T>(data: T): Result<T> { /**/ }
// or
function process(data: unknown): User { /**/ }
```

See [any.md](references/any.md) for details.

### Example 3: Improving Error Messages

**Task:** "Make error messages more helpful for users"

**Before:**
```ts
throw new Error('500');
```

**After:**
```ts
alert(
  'We\'re having trouble connecting to our server.\n' +
  'Please check your internet connection and try again.'
);
```

See [error-messages.md](references/error-messages.md) for details.

### Example 4: Caching Storage API Calls

**Task:** "This function calls localStorage.getItem() 100 times in a loop"

**Before:**
```ts
for (const item of items) {
  const theme = localStorage.getItem('theme');
  // ... 100 storage reads
}
```

**After:**
```ts
const storageCache = new Map();
function getCached(key) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key));
  }
  return storageCache.get(key);
}

for (const item of items) {
  const theme = getCached('theme');
  // ... 1 storage read
}
```

See [cache-storage-api.md](references/cache-storage-api.md) for details.

---

## Usage in Claude Code

This skill is designed to be used with environments such as Claude Code and automatically activates when:
- Writing JavaScript/TypeScript functions, classes, or modules
- Implementing control flow logic (conditionals, loops, early returns)
- Fixing type errors or improving type safety
- Refactoring nested conditionals or complex control flow
- Adding input validation or error handling
- Optimizing performance (loops, array operations, caching)
- Writing or improving documentation
- Reviewing code for quality and safety issues

See [SKILL.md](SKILL.md) for complete activation criteria and trigger phrases.

---

## Contributing

When adding new patterns:

1. **Create reference file** in `references/` following the standard format:
   - Clear title and one-line summary
   - ❌ Incorrect example(s) showing the anti-pattern
   - ✅ Correct example(s) showing the optimal implementation
   - Additional context if needed
2. **Add to AGENTS.md** with one-line summary and link
3. **Update SKILL.md** categorization if needed
4. **Consider real-world usage** - Ensure patterns solve actual problems, not hypothetical ones

---

## Coding Philosophy

This skill follows these principles:

1. **Safety first** - Correctness before performance; avoid bugs through validation and assertions
2. **Performance by design** - Design for performance from the start; optimize slowest operations first (network >> disk >> memory >> cpu)
3. **Defensive programming** - Return zero values, assert invariants, validate boundaries, handle all errors
4. **Simplicity over cleverness** - Prefer readable code over premature optimization
5. **Measure before optimizing** - Benchmark assumptions; profile to identify real bottlenecks
6. **Document non-obvious patterns** - Explain "why", not "what"; preserve business logic context