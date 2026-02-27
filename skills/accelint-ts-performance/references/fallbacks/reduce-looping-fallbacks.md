# Fallback Patterns for Reduce Looping

When the primary optimization doesn't work, use these alternatives:

## Fallback 1: Keep chained methods for readability in cold paths

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

## Fallback 2: Use `for` loop when reduce becomes unreadable

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

## Fallback 3: Keep Set.has() but add graceful degradation

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

## Fallback 4: Use Array.includes() with small arrays

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

## Fallback 5: Typed arrays with fallback for compatibility

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

## Fallback 6: Index-based loop with early exit

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
