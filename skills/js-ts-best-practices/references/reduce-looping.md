# 4.2 Reduce Looping

## Issues

- Multiple passes over same array (`.map().filter().reduce()`)
- Unnecessary array creation (spreading, slicing)
- Array methods in loops
- Linear searches that could use Sets/Maps
- Incorrect collection type for access pattern

## Optimizations

- Combine multiple array operations into single pass
- Use index-based loops for performance-critical paths
- Replace O(n) lookups with O(1) using Set/Map
- Use typed arrays for numeric data
- Reuse arrays when function owns them (local scope, not returned/exposed)

## Examples

### Chained Methods to Single Reduce

**❌ Incorrect: multiple passes over array**
```ts
const result = arr.filter(predicate).map(mapper);
// Pass 1: filter creates intermediate array
// Pass 2: map creates final array
```

**✅ Correct: single pass**
```ts
const result = arr.reduce((acc, curr) =>
  predicate(curr) ? [...acc, mapper(curr)] : acc,
  []
);
// Single pass: test and transform in one iteration
```

**Why this matters**: Each array method creates a new array and iterates all elements. For large arrays, this means:
- Extra memory allocation for intermediate arrays
- Cache misses from jumping between arrays
- Double the loop overhead (iterator setup, bounds checks)

For 10,000 items, chaining `.filter().map()` means 20,000+ iterations plus temporary array allocation. Single `reduce` = 10,000 iterations, zero intermediate arrays.

### Linear Search to O(1) Lookup

**❌ Incorrect: O(n) - searches entire array every time**
```ts
const keys = Object.keys(someObj);
if (keys.includes(id)) { /**/ }

// In a loop, this becomes O(n * m):
for (const id of userIds) {        // n iterations
  if (keys.includes(id)) { /**/ }  // m lookups each
}
```

**✅ Correct: O(1) - hash lookup**
```ts
const keys = new Set(Object.keys(someObj));
if (keys.has(id)) { /**/ }

// In a loop, this is O(n + m):
for (const id of userIds) {    // n iterations
  if (keys.has(id)) { /**/ }   // O(1) lookup each
}
```

**Why this matters**: `Array.includes()` scans the entire array linearly. For 100 items and 100 lookups, that's 10,000 comparisons. `Set.has()` uses hashing for O(1) lookups: 100 items and 100 lookups = 200 operations (100 to build Set, 100 to lookup). That's a **50x speedup**.

### Array Methods in Loops

**❌ Incorrect: nested iterations**
```ts
for (const user of users) {
  const active = items.filter(item => item.userId === user.id);
  process(active);
}
```

**✅ Correct: build lookup once**
```ts
const itemsByUser = new Map();
for (const item of items) {
  if (!itemsByUser.has(item.userId)) {
    itemsByUser.set(item.userId, []);
  }
  itemsByUser.get(item.userId).push(item);
}

for (const user of users) {
  const active = itemsByUser.get(user.id) || [];
  process(active);
}
```

### Unnecessary Array Creation

**❌ Incorrect: creates intermediate arrays**
```ts
const result = [...arr].slice(0, 10).map(transform);
```

**✅ Correct: process directly**
```ts
const result = [];
const len = Math.min(arr.length, 10);
for (let i = 0; i < len; i++) {
  result.push(transform(arr[i]));
}
```

### Index-Based Loops for Hot Paths

**❌ Incorrect: slower iteration**
```ts
for (const item of largeArray) {
  // performance-critical operation
  processPixel(item);
}
```

**✅ Correct: index-based**
```ts
const len = largeArray.length;
for (let i = 0; i < len; i++) {
  processPixel(largeArray[i]);
}
```

### Typed Arrays for Numeric Data

**❌ Incorrect: generic array stores boxed numbers**
```ts
const pixels = new Array(width * height);
for (let i = 0; i < pixels.length; i++) {
  pixels[i] = Math.random() * 255;
}
// Each number is a heap-allocated object
// Array can contain mixed types (slow property access)
```

**✅ Correct: typed array uses contiguous memory**
```ts
const pixels = new Uint8Array(width * height);
for (let i = 0; i < pixels.length; i++) {
  pixels[i] = Math.random() * 255;
}
// Fixed-type, contiguous memory buffer
// Direct memory access without boxing
```

**Why this matters**:

1. **Memory efficiency**: Generic arrays store numbers as heap-allocated objects (~16 bytes each). Typed arrays use raw bytes (1 byte for Uint8, 4 bytes for Float32). For 1920×1080 image: generic array = ~31MB, Uint8Array = 2MB.

2. **Cache locality**: Typed arrays are contiguous memory buffers. CPU can prefetch and cache efficiently. Generic arrays are pointer arrays - each access may cause cache miss.

3. **Predictable performance**: V8 can't optimize generic arrays if types change. Typed arrays are monomorphic by definition - V8 generates optimal machine code.

Use typed arrays for: pixel data, audio samples, 3D coordinates, binary protocols, large numeric datasets.

## Fallback Patterns

When the primary optimization doesn't work, use these alternatives:

### Fallback 1: Keep chained methods for readability in cold paths

**Scenario**: Code runs infrequently or with small datasets
```ts
// In configuration loading (runs once at startup)
const activeUsers = users
  .filter(u => u.status === 'active')
  .map(u => u.name)
  .sort();
```

**When to keep chained methods**:
- Non-performance-critical code (configuration, initialization)
- Small datasets (< 100 items)
- Readability is more valuable than microsecond gains

**Why**: Single-pass reduce is harder to read. In cold paths with small data, clarity trumps optimization.

### Fallback 2: Use `for` loop when reduce becomes unreadable

**Scenario**: Complex logic makes reduce hard to understand
```ts
// ❌ Reduce is technically correct but hard to parse
const result = items.reduce((acc, item) => {
  if (item.active && item.score > 50) {
    const processed = processItem(item);
    if (processed.valid) {
      acc.valid.push(processed);
    } else {
      acc.invalid.push(item.id);
    }
  }
  return acc;
}, { valid: [], invalid: [] });
```

**✅ Use explicit for loop**
```ts
const result = { valid: [], invalid: [] };

for (const item of items) {
  if (!item.active || item.score <= 50) continue;

  const processed = processItem(item);
  if (processed.valid) {
    result.valid.push(processed);
  } else {
    result.invalid.push(item.id);
  }
}
```

**Why**: When reduce logic becomes nested or complex, explicit loops are clearer. Performance difference is minimal, readability difference is significant.

### Fallback 3: Keep Set.has() but add graceful degradation

**Scenario**: Set might contain many items, memory becomes a concern
```ts
// ❌ Set could consume excessive memory for very large datasets
const keys = new Set(allKeys); // allKeys has 10M items

for (const id of userIds) {
  if (keys.has(id)) { /* ... */ }
}
```

**✅ Add size check and fallback**
```ts
const MAX_SET_SIZE = 100000;
let lookup: Set<string> | string[];

if (allKeys.length > MAX_SET_SIZE) {
  // Fall back to sorted array with binary search
  lookup = [...new Set(allKeys)].sort();
} else {
  lookup = new Set(allKeys);
}

function contains(id: string): boolean {
  if (lookup instanceof Set) {
    return lookup.has(id);
  }

  // Binary search on sorted array
  let left = 0;
  let right = lookup.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (lookup[mid] === id) return true;
    if (lookup[mid] < id) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return false;
}
```

**Why**: Set.has() is O(1) but uses ~10x memory per element compared to arrays. For very large datasets, sorted array with binary search (O(log n)) may be better.

### Fallback 4: Use Array.includes() with small arrays

**Scenario**: Array has few items and won't grow
```ts
// ✅ Array.includes() is fine here
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

if (ALLOWED_METHODS.includes(method)) {
  // Only 4 items - Set overhead not worth it
}
```

**When Array.includes() is acceptable**:
- Array has < 10 items
- Array is constant (not built dynamically)
- Lookup happens infrequently

**Why**: Set overhead (construction, memory) exceeds benefit for small constant arrays. Linear search of 10 items is faster than Set construction.

### Fallback 5: Typed arrays with fallback for compatibility

**Scenario**: Need typed array performance but must support old environments
```ts
function createBuffer(size: number): Uint8Array | number[] {
  try {
    return new Uint8Array(size);
  } catch {
    // Fall back to regular array in environments without TypedArray support
    return new Array(size).fill(0);
  }
}

function setValue(buffer: Uint8Array | number[], index: number, value: number): void {
  buffer[index] = Math.floor(value) & 0xFF; // Works for both types
}
```

**Why**: Typed arrays aren't supported everywhere. Graceful degradation maintains functionality while optimizing for modern environments.

### Fallback 6: Index-based loop with early exit

**Scenario**: Need to stop iteration early, `for...of` doesn't allow break with value
```ts
// ❌ for...of doesn't work well with early exit + return value
function findFirstMatch(items: Item[]): Item | undefined {
  for (const item of items) {
    if (matches(item)) {
      return item; // Works but not optimal for large arrays
    }
  }
}
```

**✅ Index-based loop for early exit**
```ts
function findFirstMatch(items: Item[]): Item | undefined {
  const len = items.length;

  for (let i = 0; i < len; i++) {
    if (matches(items[i])) {
      return items[i]; // Can exit immediately
    }
  }

  return undefined;
}
```

**Why**: Built-in methods like `.find()` create function call overhead. Index-based loops are fastest for early-exit scenarios and allow fine-grained control.
