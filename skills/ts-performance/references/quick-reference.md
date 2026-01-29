# Quick Optimization Reference

Quick lookup for common performance bottleneck patterns and optimization categories.

**Note:** This reference uses categories rather than specific filenames to avoid drift. To find actual reference files:
1. Check ts-best-practices/SKILL.md Performance section
2. List files: `ls ./.claude/skills/ts-best-practices/references/` (or `~/.claude/skills/...`)
3. Match category keywords (loop, cache, alloc, batch, etc.) to file names

## Bottleneck → Category Mapping

### Nested Loops (O(n²) Complexity)

**Symptoms:**
- Multiple nested `for` loops
- `.filter()` inside `.map()` or other array methods
- Array methods called inside loops
- Linear search (`.includes()`, `.find()`) in hot paths

**Category:** Algorithmic optimization

**Search for files containing:** "loop", "looping", "branch", "branching"

**Expected speedup:** 10-1000x for large datasets

---

### Repeated Expensive Computations

**Symptoms:**
- Same calculation performed multiple times
- Function called with same arguments repeatedly
- Computed values recalculated in loops
- Invariant operations inside loops

**Category:** Caching & memoization

**Search for files containing:** "memoiz", "cache", "property"

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

**Search for files containing:** "alloc", "allocation", "object", "operation"

**Expected speedup:** 1.5-5x plus reduced GC pauses

---

### Storage API in Loops

**Symptoms:**
- `localStorage.getItem()` in loops or hot paths
- `sessionStorage` reads inside iterations
- Cookie parsing on every function call
- Storage API calls not cached

**Category:** Caching

**Search for files containing:** "cache", "storage"

**Expected speedup:** 5-20x for storage-heavy operations

---

### Sequential Async Operations

**Symptoms:**
- Multiple `await` statements in sequence
- `await` before conditional branches
- Promise chains that could be parallel
- Blocking on I/O that could be deferred

**Category:** I/O optimization

**Search for files containing:** "defer", "await", "batch", "async"

**Expected speedup:** 2-10x for I/O-bound operations

---

### Poor Memory Locality

**Symptoms:**
- Random access patterns in arrays
- Non-sequential iteration
- Struct of Arrays could be Array of Structs
- Cache misses visible in profiler

**Category:** Memory locality

**Search for files containing:** "predict", "execution", "sequential", "locality"

**Expected speedup:** 1.5-3x for large datasets

---

### Unbounded Iterations

**Symptoms:**
- Loops without maximum iteration counts
- Queue processing without bounds
- Recursive functions without depth limits
- User input controls iteration count

**Category:** Bounded execution

**Search for files containing:** "bound", "iteration", "limit"

**Expected speedup:** Prevents pathological cases (DoS prevention)

---

## Profiler Output → Category Lookup

| Profiler Shows | Issue Type | Category | Search Keywords |
|----------------|------------|----------|-----------------|
| `Array.prototype.filter` high % | Chained array methods | Algorithmic | loop, looping, reduce |
| `Map.get` in tight loop | Should cache lookup | Caching | cache, property |
| `Object.assign` / spread high % | Object allocation | Allocation | alloc, object |
| `localStorage.getItem` frequent | Storage not cached | Caching | cache, storage |
| Long async function | Sequential awaits | I/O | defer, await |
| GC taking >10% time | Allocation pressure | Allocation | alloc, allocation |
| Random access pattern | Poor locality | Memory locality | predict, execution |
| Nested loop consuming >20% | O(n²) algorithm | Algorithmic | loop, looping |

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
                     │                      Search: loop, branch files
                     │
                     ├─ Repeated computation ──→ Caching (2-100x)
                     │                            Search: memoiz, cache files
                     │
                     ├─ Many allocations ──→ Reduce GC (1.5-5x)
                     │                        Search: alloc, object files
                     │
                     ├─ Sequential I/O ──→ Parallel/defer (2-50x)
                     │                      Search: defer, await, batch files
                     │
                     └─ Loop overhead ──→ Micro-optimization (1.05-2x)
                                         Search: cache, property files
                                         Only if hot path!
```

**To find files:** Use `ls ./.claude/skills/ts-best-practices/references/ | grep <keyword>` or consult SKILL.md Performance section.

---

## Anti-Pattern Detection

**Before loading any references, scan for these common anti-patterns and identify categories:**

```typescript
// ❌ O(n²) - Category: Algorithmic (search: loop, branch)
for (const item of itemsA) {
  const match = itemsB.find(x => x.id === item.id);
}

// ❌ Repeated expensive computation - Category: Caching (search: memoiz, cache)
for (let i = 0; i < array.length; i++) {
  const result = expensiveFunction(sameInput);
}

// ❌ Property access in loop - Category: Caching (search: cache, property)
for (let i = 0; i < items.length; i++) {
  process(config.settings.nested.property);
}

// ❌ Storage API not cached - Category: Caching (search: cache, storage)
function getValue() {
  return JSON.parse(localStorage.getItem('key') || '{}');
}

// ❌ Sequential awaits - Category: I/O (search: defer, await, batch)
async function process() {
  const a = await fetchA();
  const b = await fetchB(); // Could be parallel
  return combine(a, b);
}

// ❌ Allocation in loop - Category: Allocation (search: alloc, object)
const results = [];
for (const item of items) {
  results.push({ ...item, newProp: value }); // Spread creates new object
}
```

**When you see these patterns:**
1. Identify the category from the comments
2. Search ts-best-practices/references/ for files matching the keywords
3. Load relevant reference files to find optimization patterns
