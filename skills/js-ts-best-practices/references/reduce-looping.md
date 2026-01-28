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
