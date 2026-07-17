# 4.3 Memoization and Redundant Calculations

## Issues

- Loop-invariant code inside loops
- Repeated function calls with same arguments
- Constant expressions computed at runtime
- Expensive operations that could be memoized
- Trivial operations being memoized unnecessarily

## Optimizations

- Hoist loop-invariant code
- Precompute constants at module load
- Memoize pure functions with limited input domain
- Cache results of expensive operations
- Avoid memoizing trivial computations

## Examples

### Avoid Trivial Memoization

**❌ Incorrect: trivial computation**
```ts
const ternMemo = memoize((pred) => pred ? 'Right!' : 'Wrong');
```

**✅ Correct: direct computation**
```ts
const result = test ? 'Right!' : 'Wrong';
```

### Hoist Loop-Invariant Calculations

**❌ Incorrect: calculations recomputed each iteration**
```ts
for (let i = 0; i < items.length; i++) {
  const prefix = config.namespace + '.';
  const multiplier = Math.PI * 2;
  process(items[i], prefix, multiplier);
}
```

**✅ Correct: hoist outside loop**
```ts
const prefix = config.namespace + '.';
const multiplier = Math.PI * 2;
const len = items.length;

for (let i = 0; i < len; i++) {
  process(items[i], prefix, multiplier);
}
```

### Precompute Constants

**❌ Incorrect: compute at runtime**
```ts
function calculateArea(radius) {
  const pi = Math.PI;
  return pi * radius * radius;
}
```

**✅ Correct: module-level constant**
```ts
const PI = Math.PI;

function calculateArea(radius) {
  return PI * radius * radius;
}
```

### Memoize Expensive Operations

**❌ Incorrect: repeated expensive calls**
```ts
function render() {
  const data = parseAndTransformData(rawData);
  return display(data);
}

// Called many times with same rawData
render();
render();
render();
```

**✅ Correct: memoize expensive function**
```ts
const memoizedParse = memoize(parseAndTransformData);

function render() {
  const data = memoizedParse(rawData);
  return display(data);
}
```

### Cache Function Results

**❌ Incorrect: repeated calculation**
```ts
function processItems(items) {
  for (const item of items) {
    const config = getConfig(item.type);
    apply(item, config);
  }
}

function getConfig(type) {
  // Expensive lookup/calculation
  return expensiveOperation(type);
}
```

**✅ Correct: cache results**
```ts
function processItems(items) {
  const configCache = new Map();

  for (const item of items) {
    if (!configCache.has(item.type)) {
      configCache.set(item.type, getConfig(item.type));
    }
    const config = configCache.get(item.type);
    apply(item, config);
  }
}
```

### Repeated Function Calls with Same Arguments

**❌ Incorrect: call multiple times**
```ts
function validate(data) {
  if (isValid(data.user) && isComplete(data.user)) {
    return processUser(data.user);
  }
  return null;
}

function isComplete(user) {
  return isValid(user) && user.profile && user.settings;
}
```

**✅ Correct: call once, reuse result**
```ts
function validate(data) {
  const valid = isValid(data.user);
  if (valid && isComplete(data.user, valid)) {
    return processUser(data.user);
  }
  return null;
}

function isComplete(user, alreadyValid = false) {
  return (alreadyValid || isValid(user)) && user.profile && user.settings;
}

## Fallback Patterns

When memoization doesn't work or creates problems, use these alternatives:

### Fallback 1: Skip memoization for trivial computations

**Scenario**: Computation is so cheap that caching overhead exceeds benefit
```ts
// ❌ Memoization overhead > computation cost
const cache = new Map<number, number>();

function double(n: number): number {
  if (cache.has(n)) return cache.get(n)!;
  const result = n * 2;
  cache.set(n, result);
  return result;
}
```

**✅ Just compute directly**
```ts
function double(n: number): number {
  return n * 2;
}
```

**When to skip memoization**:
- Simple arithmetic (addition, multiplication, modulo)
- Property access on in-memory objects
- String concatenation of short strings
- Array index lookups

**Why**: Map overhead (hashing, storage, lookup) exceeds cost of trivial operations. Memoize only when computation cost significantly exceeds cache overhead.

### Fallback 2: Limit cache size to prevent memory leaks

**Scenario**: Cache grows unbounded and causes memory exhaustion
```ts
// ❌ Unbounded cache can leak memory
const cache = new Map<string, Result>();

function compute(input: string): Result {
  if (cache.has(input)) return cache.get(input)!;
  const result = expensiveOperation(input);
  cache.set(input, result); // Cache grows forever
  return result;
}
```

**✅ Use LRU cache with size limit**
```ts
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private order: K[] = [];

  constructor(private maxSize: number = 100) {}

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.order = this.order.filter(k => k !== key);
      this.order.push(key);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.order = this.order.filter(k => k !== key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used
      const oldest = this.order.shift()!;
      this.cache.delete(oldest);
    }

    this.cache.set(key, value);
    this.order.push(key);
  }
}

const cache = new LRUCache<string, Result>(100);

function compute(input: string): Result {
  const cached = cache.get(input);
  if (cached) return cached;

  const result = expensiveOperation(input);
  cache.set(input, result);
  return result;
}
```

**Why**: Unbounded caches leak memory. LRU (Least Recently Used) eviction maintains fixed memory usage while keeping hot data cached.

### Fallback 3: Time-based cache invalidation for stale data

**Scenario**: Cached data becomes stale and must be refreshed
```ts
// ❌ Cache never expires, returns stale data
const cache = new Map<string, UserData>();

function getUserData(userId: string): UserData {
  if (cache.has(userId)) return cache.get(userId)!;
  const data = fetchUserData(userId);
  cache.set(userId, data);
  return data;
}
```

**✅ Add TTL (time-to-live) to cache entries**
```ts
interface CacheEntry<T> {
  value: T;
  expires: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<UserData>>();

function getUserData(userId: string): UserData {
  const entry = cache.get(userId);
  const now = Date.now();

  if (entry && entry.expires > now) {
    return entry.value; // Still valid
  }

  const data = fetchUserData(userId);
  cache.set(userId, {
    value: data,
    expires: now + TTL_MS,
  });

  return data;
}
```

**Why**: Some data changes over time (user profiles, prices, inventory). TTL ensures cache freshness without manual invalidation.

### Fallback 4: Recompute instead of complex cache key generation

**Scenario**: Cache key generation is expensive or complex
```ts
// ❌ Complex cache key generation
const cache = new Map<string, Result>();

function process(obj: ComplexObject): Result {
  // Expensive: serialize entire object to create key
  const key = JSON.stringify(obj);
  if (cache.has(key)) return cache.get(key)!;

  const result = expensiveOperation(obj);
  cache.set(key, result);
  return result;
}
```

**✅ Skip memoization, just recompute**
```ts
function process(obj: ComplexObject): Result {
  return expensiveOperation(obj);
}
```

**When to skip memoization due to key complexity**:
- Cache key requires serialization (JSON.stringify, hash computation)
- Objects are large or deeply nested
- Key generation cost approaches computation cost

**Why**: If key generation (serialization, hashing) costs 80% of the computation, memoization provides minimal benefit. Only memoize when key generation is trivial compared to computation.

### Fallback 5: Use WeakMap for object-keyed caches

**Scenario**: Caching results keyed by objects, need automatic cleanup
```ts
// ❌ Regular Map prevents garbage collection
const cache = new Map<object, Result>();

function process(obj: SomeObject): Result {
  if (cache.has(obj)) return cache.get(obj)!;
  const result = expensiveOperation(obj);
  cache.set(obj, result); // obj can never be GC'd
  return result;
}
```

**✅ Use WeakMap for automatic cleanup**
```ts
const cache = new WeakMap<object, Result>();

function process(obj: SomeObject): Result {
  const cached = cache.get(obj);
  if (cached) return cached;

  const result = expensiveOperation(obj);
  cache.set(obj, result);
  return result;
}

// When obj goes out of scope, cache entry is automatically removed
```

**Why**: WeakMap allows garbage collection of keys. When the object is no longer referenced elsewhere, the cache entry is automatically cleaned up, preventing memory leaks.

### Fallback 6: Precomputation instead of runtime memoization

**Scenario**: All possible inputs are known ahead of time
```ts
// ❌ Compute and cache at runtime
const cache = new Map<number, number>();

function factorial(n: number): number {
  if (cache.has(n)) return cache.get(n)!;
  const result = n <= 1 ? 1 : n * factorial(n - 1);
  cache.set(n, result);
  return result;
}
```

**✅ Precompute all values at startup**
```ts
// Precompute factorials for n = 0 to 20
const FACTORIALS = [
  1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880,
  3628800, 39916800, 479001600, 6227020800, 87178291200,
  1307674368000, 20922789888000, 355687428096000,
  6402373705728000, 121645100408832000, 2432902008176640000
];

function factorial(n: number): number {
  if (n < 0 || n >= FACTORIALS.length) {
    throw new Error(`Factorial(${n}) out of range [0, ${FACTORIALS.length - 1}]`);
  }
  return FACTORIALS[n];
}
```

**When to precompute**:
- Input space is small and finite (< 1000 values)
- All inputs are known at compile time
- Computation is expensive but only needs to run once

**Why**: Precomputation eliminates runtime overhead (cache checks, storage). Array lookup is faster than Map lookup. Memory cost is paid upfront and constant.
```
