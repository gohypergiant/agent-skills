# Quick Optimization Reference

Quick lookup for common performance bottleneck patterns and optimization categories.

## Bottleneck → Category Mapping

### Nested Loops (O(n²) Complexity)

**Symptoms:**
- Multiple nested `for` loops
- `.filter()` inside `.map()` or other array methods
- Array methods called inside loops
- Linear search (`.includes()`, `.find()`) in hot paths

**Category:** Algorithmic optimization

**Reference files:**
- [reduce-looping.md](reduce-looping.md)
- [reduce-branching.md](reduce-branching.md)

**Expected speedup:** 10-1000x for large datasets

---

### Repeated Expensive Computations

**Symptoms:**
- Same calculation performed multiple times
- Function called with same arguments repeatedly
- Computed values recalculated in loops
- Invariant operations inside loops

**Category:** Caching & memoization

**Reference files:**
- [memoization.md](memoization.md)
- [cache-property-access.md](cache-property-access.md)

**Expected speedup:** 2-100x depending on computation cost

---

### Allocation-Heavy Code

**Symptoms:**
- Many small object creations in loops
- Excessive use of spread operator (`...`)
- Creating temporary arrays (`.slice()`, `[...arr]`)
- String concatenation in loops
- Frequent garbage collection (visible in profiler)

**Category:** Allocation reduction

**Reference files:**
- [avoid-allocations.md](avoid-allocations.md)
- [object-operations.md](object-operations.md)

**Expected speedup:** 1.5-5x plus reduced GC pauses

---

### Storage API in Loops

**Symptoms:**
- `localStorage.getItem()` in loops or hot paths
- `sessionStorage` reads inside iterations
- Cookie parsing on every function call
- Storage API calls not cached

**Category:** Caching

**Reference files:**
- [cache-storage-api.md](cache-storage-api.md)

**Expected speedup:** 5-20x for storage-heavy operations

---

### Sequential Async Operations

**Symptoms:**
- Multiple `await` statements in sequence
- `await` before conditional branches
- Promise chains that could be parallel
- Blocking on I/O that could be deferred

**Category:** I/O optimization

**Reference files:**
- [defer-await.md](defer-await.md)
- [batching.md](batching.md)

**Expected speedup:** 2-10x for I/O-bound operations

---

### Poor Memory Locality

**Symptoms:**
- Random access patterns in arrays
- Non-sequential iteration
- Struct of Arrays could be Array of Structs
- Cache misses visible in profiler

**Category:** Memory locality

**Reference files:**
- [predictable-execution.md](predictable-execution.md)

**Expected speedup:** 1.5-3x for large datasets

---

### Unbounded Iterations

**Symptoms:**
- Loops without maximum iteration counts
- Queue processing without bounds
- Recursive functions without depth limits
- User input controls iteration count

**Category:** Bounded execution

**Reference files:**
- [bounded-iteration.md](bounded-iteration.md)

**Expected speedup:** Prevents pathological cases (DoS prevention)

---

## Profiler Output → Category Lookup

| Profiler Shows | Issue Type | Category | Reference Files |
|----------------|------------|----------|-----------------|
| `Array.prototype.filter` high % | Chained array methods | Algorithmic | [reduce-looping.md](reduce-looping.md) |
| `Map.get` in tight loop | Should cache lookup | Caching | [cache-property-access.md](cache-property-access.md) |
| `Object.assign` / spread high % | Object allocation | Allocation | [object-operations.md](object-operations.md), [avoid-allocations.md](avoid-allocations.md) |
| `localStorage.getItem` frequent | Storage not cached | Caching | [cache-storage-api.md](cache-storage-api.md) |
| Long async function | Sequential awaits | I/O | [defer-await.md](defer-await.md) |
| GC taking >10% time | Allocation pressure | Allocation | [avoid-allocations.md](avoid-allocations.md) |
| Random access pattern | Poor locality | Memory locality | [predictable-execution.md](predictable-execution.md) |
| Nested loop consuming >20% | O(n²) algorithm | Algorithmic | [reduce-looping.md](reduce-looping.md), [reduce-branching.md](reduce-branching.md) |

---

## Decision Matrix: When to Optimize

```
┌─────────────────────────────────────────┐
│ Is profiler showing >5% time in code?  │
└─────────┬───────────────────────────────┘
          │
          ├─ NO ──→ Don't optimize (not a bottleneck)
          │
          └─ YES ──→ What's the issue?
                     │
                     ├─ O(n²) or worse ──→ Algorithmic fix (10-1000x)
                     │                      reduce-looping.md, reduce-branching.md
                     │
                     ├─ Repeated computation ──→ Caching (2-100x)
                     │                            memoization.md, cache-property-access.md
                     │
                     ├─ Many allocations ──→ Reduce GC (1.5-5x)
                     │                        avoid-allocations.md, object-operations.md
                     │
                     ├─ Sequential I/O ──→ Parallel/defer (2-50x)
                     │                      defer-await.md, batching.md
                     │
                     └─ Loop overhead ──→ Micro-optimization (1.05-2x)
                                         currying.md, performance-misc.md
                                         Only if hot path!
```

---

## Anti-Pattern Detection

**Before loading any references, scan for these common anti-patterns and identify categories:**

```typescript
// ❌ O(n²) - Category: Algorithmic
// References: reduce-looping.md, reduce-branching.md
for (const item of itemsA) {
  const match = itemsB.find(x => x.id === item.id);
}

// ❌ Repeated expensive computation - Category: Caching
// References: memoization.md, cache-property-access.md
for (let i = 0; i < array.length; i++) {
  const result = expensiveFunction(sameInput);
}

// ❌ Property access in loop - Category: Caching
// References: cache-property-access.md
for (let i = 0; i < items.length; i++) {
  process(config.settings.nested.property);
}

// ❌ Storage API not cached - Category: Caching
// References: cache-storage-api.md
function getValue() {
  return JSON.parse(localStorage.getItem('key') || '{}');
}

// ❌ Sequential awaits - Category: I/O
// References: defer-await.md, batching.md
async function process() {
  const a = await fetchA();
  const b = await fetchB(); // Could be parallel
  return combine(a, b);
}

// ❌ Allocation in loop - Category: Allocation
// References: avoid-allocations.md, object-operations.md
const results = [];
for (const item of items) {
  results.push({ ...item, newProp: value }); // Spread creates new object
}
```

**When you see these patterns:**
1. Identify the category from the comments
2. Load the reference files listed for that category
3. Find optimization patterns in the reference files
