---
name: js-ts-best-practices
description: Use when writing JavaScript/TypeScript code, implementing control flow or state management, fixing type errors, adding validation or error handling, optimizing performance (loops, conditionals, caching), or improving documentation (JSDoc, comments).
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.3"
---

# JavaScript and TypeScript Best Practices

Comprehensive coding standards and performance optimization guide for JavaScript and TypeScript applications, designed for AI agents and LLMs working with modern JavaScript/TypeScript codebases.

## When to Use This Skill

This skill provides expert-level patterns for JavaScript and TypeScript code. Load [AGENTS.md](AGENTS.md) to scan rule summaries and identify relevant optimizations for your task.

## How to Use

This skill uses a **progressive disclosure** structure to minimize context usage:

### 1. Start with the Overview (AGENTS.md)
Read [AGENTS.md](AGENTS.md) for a concise overview of all rules with one-line summaries organized by category.

### 2. Load Specific Rules as Needed
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
- [any.md](references/any.md) - Avoid any, use unknown or generics
- [enums.md](references/enums.md) - Use as const objects instead of enum
- [type-vs-interface.md](references/type-vs-interface.md) - Prefer type over interface

**Safety:**
- [input-validation.md](references/input-validation.md) - Validate external data with schemas
- [assertions.md](references/assertions.md) - Split assertions, include values
- [error-handling.md](references/error-handling.md) - Handle all errors explicitly
- [error-messages.md](references/error-messages.md) - User-friendly vs developer-specific messages

**Performance:**
- [reduce-branching.md](references/reduce-branching.md) - Convert conditionals to lookups, hoist invariants, early returns
- [reduce-looping.md](references/reduce-looping.md) - Single-pass operations, O(1) lookups, typed arrays
- [memoization.md](references/memoization.md) - Hoist invariants, precompute constants, cache expensive operations
- [batching.md](references/batching.md) - Batch I/O operations
- [predictable-execution.md](references/predictable-execution.md) - Sequential access, cache locality, grouped data
- [bounded-iteration.md](references/bounded-iteration.md) - Set limits on loops and queues
- [defer-await.md](references/defer-await.md) - Move await into branches that need it
- [cache-property-access.md](references/cache-property-access.md) - Cache lookups, eliminate aliases, avoid unnecessary destructuring
- [cache-storage-api.md](references/cache-storage-api.md) - Cache localStorage/sessionStorage/cookie reads
- [object-operations.md](references/object-operations.md) - Safe mutation, shallow clones, preallocate shapes
- [avoid-allocations.md](references/avoid-allocations.md) - Inline simple computations, avoid needless variables, reduce GC pressure
- [currying.md](references/currying.md) - Curry to precompute constant parameters, optimize hot paths
- [performance-misc.md](references/performance-misc.md) - Strings, regex, async overhead, closures, try/catch

**Documentation:**
- [jsdoc.md](references/jsdoc.md) - Well-formed JSDoc for exports
- [comment-markers.md](references/comment-markers.md) - TODO, FIXME, HACK, NOTE markers
- [comments-to-remove.md](references/comments-to-remove.md) - Commented code, edit history
- [comments-to-preserve.md](references/comments-to-preserve.md) - Markers, linter directives, business logic
- [comments-placement.md](references/comments-placement.md) - Move end-of-line comments above code

### 3. Apply the Pattern
Each reference file contains:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

