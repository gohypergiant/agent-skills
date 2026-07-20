# Quick Start Examples

## Overview

This guide demonstrates the workflow for applying patterns from this skill: identify the issue, reference AGENTS.md, load the appropriate reference file, and implement the solution.

## Examples

### Example 1: Optimizing Array Operations

**❌ Incorrect: chained array methods create multiple iterations**
```ts
const result = items.filter(x => x.active).map(x => x.id);
```

**Issue:** Multiple passes over the same array (O(2n)) with intermediate array allocations.

**✅ Correct: single-pass reduce operation**
```ts
const result = items.reduce((acc, x) =>
  x.active ? [...acc, x.id] : acc,
  []
);
```

**Why this is better:** Single iteration (O(n)), though still creates intermediate arrays. For very large arrays, consider using a for loop with pre-allocated array or filtering into a Set.

**Reference:** [reduce-looping.md](reduce-looping.md)

### Example 2: Avoiding Needless Allocations

**❌ Incorrect: intermediate variable creates unnecessary allocation**
```ts
function randomInt(min: number, max: number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  const range = maxFloor - minCeil + 1;
  return Math.floor(Math.random() * range + minCeil);
}
```

**Issue:** The `range` variable is allocated on every call, creating GC pressure in hot paths.

**✅ Correct: inline simple computation**
```ts
function randomInt(min: number, max: number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil);
}
```

**Why this is better:** Eliminates allocation of intermediate variable, reducing GC pressure when called frequently.

**Reference:** [avoid-allocations.md](avoid-allocations.md)

### Example 3: Currying for Performance

**❌ Incorrect: recompute expensive operation every call**
```ts
export function round(precision: number, value: number): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

// In hot path
for (const price of prices) {
  rounded.push(round(2, price)); // Recomputes 10 ** 2 every iteration
}
```

**Issue:** Expensive exponentiation (`10 ** precision`) is recomputed on every call even though precision is constant.

**✅ Correct: curry to precompute constant parameters**
```ts
export function round(precision: number): (value: number) => number;
export function round(precision: number, value: number): number;
export function round(
  precision: number,
  value?: number,
): number | ((value: number) => number) {
  const multiplier = 10 ** precision;

  if (value === undefined) {
    return (v: number) => Math.round(v * multiplier) / multiplier;
  }

  return Math.round(value * multiplier) / multiplier;
}

// In hot path
const roundTo2 = round(2); // Compute 10 ** 2 once
for (const price of prices) {
  rounded.push(roundTo2(price)); // Reuse precomputed multiplier
}
```

**Why this is better:** Exponentiation computed once and captured in closure, eliminating repeated expensive operations. Supports both curried and direct-call patterns through function overloads.

**Reference:** [currying.md](currying.md)

### Example 4: Caching Storage API Calls

**❌ Incorrect: repeated storage reads in loop**
```ts
for (const item of items) {
  const theme = localStorage.getItem('theme');
  applyTheme(theme, item);
  // 100 iterations = 100 storage reads
}
```

**Issue:** `localStorage.getItem()` is synchronous but slow (disk I/O). Reading same key repeatedly wastes time.

**✅ Correct: cache storage reads in memory**
```ts
const storageCache = new Map<string, string | null>();

function getCached(key: string): string | null {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key));
  }
  return storageCache.get(key)!;
}

// Use cached version
for (const item of items) {
  const theme = getCached('theme');
  applyTheme(theme, item);
  // 100 iterations = 1 storage read
}

// Invalidate cache when storage changes
function setAndInvalidate(key: string, value: string): void {
  localStorage.setItem(key, value);
  storageCache.delete(key);
}
```

**Why this is better:** Reduces disk I/O from O(n) to O(1). Critical for loops over large datasets.

**Reference:** [cache-storage-api.md](cache-storage-api.md)

## Workflow Summary

1. **Identify the pattern** - Recognize anti-patterns (nested conditionals, chained array methods, repeated computations)
2. **Check AGENTS.md** - Find the relevant category and reference file link
3. **Load reference file** - Read detailed examples and explanations
4. **Apply the pattern** - Implement the ✅ correct version
5. **Verify improvement** - Benchmark if performance-related, test if safety-related
