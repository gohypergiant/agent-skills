# TypeScript Performance Optimization

## Abstract

Comprehensive performance optimization guide for JavaScript and TypeScript applications, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant optimizations
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Critical Performance Anti-Patterns

**NEVER** do these - they appear in codebases frequently but significantly degrade performance:

- **NEVER** chain array methods (.filter().map().reduce()) - creates intermediate arrays and multiple iterations; use single `reduce` pass (2-5x faster)
- **NEVER** use `Array.includes()` for repeated lookups - O(n) linear search; use `Set.has()` instead for O(1) hash lookup (10-100x faster)
- **NEVER** await before checking if you need the result - suspends execution unnecessarily; defer `await` into branches that actually use the value
- **NEVER** recompute constants inside loops - wastes CPU in every iteration; hoist invariants outside loops or curry functions to precompute
- **NEVER** create unbounded loops or queues - prevents runaway resource consumption; set explicit limits to prevent DoS and crashes
- **NEVER** place `try/catch` in hot paths - V8 cannot inline functions with try-catch (3-5x slowdown); validate inputs before loops

**Note:** For general best practices (type safety with `any`/`enum`, avoiding `null`, not mutating parameters), use the `accelint-ts-best-practices` skill instead.

See individual reference files for detailed alternatives and ✅ correct patterns.

---

## Performance Optimization Categories

**Before optimizing**: Profile first to identify actual bottlenecks. Premature optimization wastes effort on code that doesn't impact user experience.

Design for performance from the start. Optimize slowest resources first: `network >> disk >> memory >> cpu`

---

### 1. Algorithmic Optimization (10-1000x speedup)

Fix algorithmic complexity before applying micro-optimizations. O(n²) → O(n) provides orders of magnitude improvement.

#### 1.1 Reduce Branching
Use table lookups instead of conditionals for static values; hoist invariants out of conditionals; use early returns.
[View detailed examples](references/reduce-branching.md)

#### 1.2 Reduce Looping
Combine `.filter().map()` into single `reduce` pass; use `Set.has()` over `Array.includes()` for 10-50x speedup (O(1) vs O(n)); build lookups once.
[View detailed examples](references/reduce-looping.md)

---

### 2. Caching & Memoization (2-100x speedup)

Cache expensive computations and avoid repeated work. Trade memory for CPU when computation cost justifies it.

#### 2.1 Memoization
Hoist loop-invariant code; precompute constants at module load; memoize pure functions with limited input domain; avoid memoizing trivial computations.
[View detailed examples](references/memoization.md)

#### 2.2 Cache Property Access
Cache property lookups before loops; eliminate single-use aliases; avoid unnecessary destructuring; cache array.length.
[View detailed examples](references/cache-property-access.md)

#### 2.3 Cache Storage API Calls
Cache `localStorage`, `sessionStorage`, and `document.cookie` reads in memory; avoid repeated JSON.parse on same data.
[View detailed examples](references/cache-storage-api.md)

---

### 3. I/O Optimization (2-50x speedup)

Batch operations, parallelize independent work, defer blocking operations.

#### 3.1 Batching
Batch operations to amortize costly processes, especially for I/O-bound operations (network requests, database queries, file writes).
[View detailed examples](references/batching.md)

#### 3.2 Defer Await
Move `await` into branches where result is actually used; parallelize independent async operations; avoid blocking on I/O that could be deferred.
[View detailed examples](references/defer-await.md)

---

### 4. Memory & Allocation (1.5-5x speedup)

Reduce garbage collection pressure and object creation in hot paths.

#### 4.1 Object Operations
Mutate when safe (local scope, not returned/exposed); use shallow clones when needed; preallocate object shapes for V8 hidden classes.
[View detailed examples](references/object-operations.md)

#### 4.2 Avoid Needless Allocations
Inline simple computations; avoid intermediate variables in hot paths; reduce GC pressure by reusing objects when possible.
[View detailed examples](references/avoid-allocations.md)

---

### 5. Memory Locality (1.5-3x speedup)

Write cache-friendly code with sequential access patterns.

#### 5.1 Predictable Execution and Cache Locality
Write code with clear execution paths; use sequential memory access; group related data; prefer Array of Structs for sequential processing.
[View detailed examples](references/predictable-execution.md)

---

### 6. Safety & Bounds (DoS prevention)

Prevent runaway resource consumption and denial-of-service scenarios.

#### 6.1 Bounded Iteration
Set limits on all loops, queues, and data structures; prevent unbounded recursion; validate iteration counts from user input.
[View detailed examples](references/bounded-iteration.md)

---

### 7. Micro-optimizations (1.05-2x speedup)

Apply in hot paths only (>1000 executions/sec). Profile first to ensure impact justifies complexity.

#### 7.1 Currying and Partial Application
Curry functions to precompute constant parameters; reduce repeated work in loops and hot paths; optimize function call overhead.
[View detailed examples](references/currying.md)

#### 7.2 Additional Performance Concerns
Batch string operations; compile regex once; avoid async overhead for synchronous code; minimize closure scope; avoid try/catch in hot paths.
[View detailed examples](references/performance-misc.md)

---

## Quick Reference for Bottleneck Mapping

For systematic bottleneck identification and categorization, load [references/quick-reference.md](references/quick-reference.md) which provides:
- Bottleneck symptom → Category mapping
- Profiler output → Optimization category lookup
- Anti-pattern detection with concrete code examples
- Decision matrix for when to optimize

---

## Optimization Impact Summary

| Category | Typical Speedup | When to Apply |
|----------|-----------------|---------------|
| Algorithmic (O(n²) → O(n)) | 10-1000x | Always fix first |
| Caching & Memoization | 2-100x | Repeated expensive computations |
| I/O Optimization | 2-50x | Network, disk, async operations |
| Allocation Reduction | 1.5-5x | Hot paths with GC pressure |
| Memory Locality | 1.5-3x | Large datasets, sequential processing |
| Bounded Execution | Prevents DoS | All user-controlled iterations |
| Micro-optimizations | 1.05-2x | Hot paths only, after profiling |

**Priority order:** Fix algorithm first, then cache, then I/O, then allocations, then micro-optimize hot paths.

---

## Important Notes

- **Profile before optimizing** - Use Chrome DevTools (browser) or `node --prof` (Node.js). Target functions consuming >5% runtime.
- **Hot path definition** - Code executed >1000 times per user interaction or >100 times per second in server contexts.
- **Real-time systems** - For 60fps rendering (16.67ms frame budget), even 1.05x improvements in critical paths matter. Profile with frame timing.
- **Correctness is mandatory** - Run tests before and after. Performance bugs are still bugs.
- **Memory vs CPU trade-offs** - Caching trades memory for speed. Monitor memory usage in production.
