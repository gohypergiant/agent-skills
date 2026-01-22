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

**❌ Incorrect: two iterations**
```ts
const result = arr.filter(predicate).map(mapper);
```

**✅ Correct: single iteration**
```ts
const result = arr.reduce((acc, curr) =>
  predicate(curr) ? [...acc, mapper(curr)] : acc,
  []
);
```

### Linear Search to O(1) Lookup

**❌ Incorrect: O(n)**
```ts
const keys = Object.keys(someObj);
if (keys.includes(id)) { /**/ }
```

**✅ Correct: O(1)**
```ts
const keys = new Set(Object.keys(someObj));
if (keys.has(id)) { /**/ }
```

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

**❌ Incorrect: generic array**
```ts
const pixels = new Array(width * height);
for (let i = 0; i < pixels.length; i++) {
  pixels[i] = Math.random() * 255;
}
```

**✅ Correct: typed array**
```ts
const pixels = new Uint8Array(width * height);
for (let i = 0; i < pixels.length; i++) {
  pixels[i] = Math.random() * 255;
}
```
