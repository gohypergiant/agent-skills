---
name: ts-performance
description: "Systematic JavaScript/TypeScript performance optimization using V8 profiling and runtime patterns. Use when: (1) Code is measurably slow (profiler data shows bottlenecks), (2) Optimizing hot paths with O(n²) complexity, excessive allocations, or I/O blocking, (3) Users say 'optimize performance', 'audit performance', 'this is slow', 'reduce allocations', 'improve speed', (4) Fixing V8 deoptimization (monomorphic/polymorphic issues, inline caching). Covers loops, caching, batching, memory locality, algorithmic complexity fixes with ❌/✅ patterns."
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
---

# TypeScript Performance Optimization

Systematic performance optimization for JavaScript/TypeScript codebases. Combines audit workflow with expert-level optimization patterns for runtime performance.

## NEVER Do When Optimizing Performance

**Note:** For general best practices (type safety with `any`/`enum`, avoiding `null`, not mutating parameters), use the `ts-best-practices` skill instead. This section focuses exclusively on performance-specific anti-patterns.

- **NEVER optimize without measuring first** - Use profilers (Chrome DevTools, Node.js --prof) to identify actual bottlenecks. Premature optimization wastes time on code that doesn't impact performance. 80% of runtime is typically spent in 20% of code; optimizing the wrong 80% yields zero user-visible improvement while adding maintenance burden.

- **NEVER apply all optimizations blindly** - Performance patterns have trade-offs. Micro-optimizations in cold paths (executed <100 times) add complexity without measurable benefit. A 2x speedup of code consuming 0.1% of runtime saves 0.05% total—unnoticeable to users. Profile-guided optimization is mandatory to focus effort where it matters.

- **NEVER ignore algorithmic complexity** - Optimizing O(n²) code with micro-optimizations is futile. For n=1000, algorithmic fix (O(n² → O(n)) yields 1000x speedup; micro-optimizations yield 1.1-2x at best. Fix algorithm first: use Maps/Sets for O(1) lookups, eliminate nested iterations, choose appropriate data structures.

- **NEVER sacrifice correctness for speed** - Performance bugs are still bugs. Optimizations frequently break edge cases: off-by-one errors in manual loops, wrong behavior for empty arrays, null handling issues. Verify behavior matches before and after. Add comprehensive tests covering edge cases before optimizing—catching bugs in production costs far more than any performance gain.

- **NEVER optimize code you don't own** - Shared utilities, library internals, or code actively developed by others creates merge conflicts, duplicates effort, and confuses ownership. Performance changes affect all callers; coordinate with owners or defer optimization until code stabilizes.

- **NEVER ignore memory vs CPU trade-offs** - Caching trades memory for speed. Unbounded memoization causes memory leaks in long-running applications. A 2x CPU speedup that increases memory 10x can trigger OOM crashes or frequent GC pauses (worse than original slowness). Profile memory usage alongside CPU; set cache size limits; use WeakMap for lifecycle-bound caches.

- **NEVER assume performance across environments** - V8 optimizations differ between Node.js versions (v18 vs v20), browsers (Chrome vs Safari), and architectures (x64 vs ARM). An optimization yielding 3x speedup in Chrome may regress 1.5x in Safari. Profile in ALL target environments before shipping; maintain fallback implementations for environment-specific optimizations.

- **NEVER chain array methods** (.filter().map().reduce()) - Each method creates intermediate arrays and iterates separately. For arrays with 10k items, `.filter().map()` allocates 10k + 5k items (if 50% pass filter) and iterates twice. Use single `reduce` pass to iterate once with zero intermediate allocations, yielding 2-5x speedup in hot paths.

- **NEVER use `Array.includes()` for repeated lookups** - Array.includes() is O(n) linear search. Checking 1000 items against array of 100 is O(n×m) = 100k operations. Use `Set.has()` instead: O(1) lookup via hash table, reducing 100k operations to 1000 for ~100x speedup. Build Set once upfront; amortized cost is negligible.

- **NEVER await before checking if you need the result** - `await` suspends execution immediately, even if the value isn't needed. Move `await` into conditional branches that actually use the result. Example: `const data = await fetch(url); if (condition) { use(data); }` wastes I/O time when condition is false. Better: `if (condition) { const data = await fetch(url); use(data); }` skips fetch entirely when unneeded.

- **NEVER recompute constants inside loops** - Recomputing invariants wastes CPU in every iteration. For 10k iterations, `array.length` lookup (even if cached by engine) or `Math.max(a, b)` runs 10k times unnecessarily. Hoist invariants outside loops: `const len = array.length; for (let i = 0; i < len; i++)` or curry functions to precompute constant parameters once.

- **NEVER create unbounded loops or queues** - Prevents runaway resource consumption from bugs or malicious input. Set explicit limits (`for (let i = 0; i < Math.min(items.length, 10000); i++)`) or timeouts. Unbounded loops can freeze UI threads; unbounded queues cause OOM crashes. Fail fast with clear limits rather than degrading gracefully into unusability.

- **NEVER place `try/catch` in hot paths** - V8 cannot inline functions containing try-catch blocks and marks entire function as non-optimizable. Single try-catch in hot loop causes 3-5x slowdown by preventing inlining, escape analysis, and other optimizations. Validate inputs before hot paths using type guards; move try-catch outside loops to wrap entire operation; use Result types for expected errors.

## Before Optimizing Performance, Ask

Apply these tests to focus optimization efforts effectively:

### Impact Assessment
- **Is this code actually slow?** Profile first. User perception matters - if users don't notice, optimization isn't needed regardless of measurements.
- **What percentage of runtime does this represent?** Optimize the 20% of code that consumes 80% of runtime. Use flame graphs to identify hot paths.
- **Is this a hot path or cold path?** Hot paths demand optimization. Cold paths (initialization, error handling) don't.

### Correctness Verification
- **Do I have tests covering this code?** Performance bugs are subtle. Comprehensive tests catch regressions from optimizations. Add tests before optimizing.
- **What are the edge cases?** Off-by-one errors, empty arrays, null/undefined values become more likely with manual loop optimizations. Test exhaustively.

### Complexity vs Benefit
- **Is the algorithmic complexity optimal?** O(n) → O(1) is 1000x speedup. Micro-optimizations are 1.1-2x at best. Fix algorithm first.
- **Will this optimization persist?** If the code changes frequently, optimization may be discarded soon. Optimize stable code first.
- **What's the readability cost?** Manual loops are faster but harder to maintain than `.map()`. Balance performance with team velocity.

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Follow the 4-phase audit workflow below for systematic performance analysis.

### 2. Reference Performance Rules Overview (AGENTS.md)
Load [AGENTS.md](AGENTS.md) to scan compressed rule summaries organized by category.

### 3. Load Specific Performance Patterns as Needed
When you identify specific performance issues, load corresponding reference files for detailed ❌/✅ examples.

## Performance Optimization Workflow

**Copy this checklist to track progress:**

```
- [ ] Phase 1: Profile - Identify actual bottlenecks using profiling tools
- [ ] Phase 2: Analyze - Categorize issues by impact and optimization category
- [ ] Phase 3: Optimize - Apply performance patterns from references/
- [ ] Phase 4: Verify - Measure improvements and validate correctness
```

### Phase 1: Profile to Identify Bottlenecks

Use profiling tools to establish baseline measurements:
- **Browser**: Chrome DevTools Performance tab → identify functions consuming >5% total time
- **Node.js**: `node --prof script.js && node --prof-process isolate-*.log`

**Output**: List of functions/code sections consuming >5% of execution time. Focus only on hot paths.

**Skip this phase when**: Slow code is already known from production metrics or obvious from code inspection (e.g., O(n²) nested loops on 10k+ items).

### Phase 2: Analyze and Categorize Issues

For each identified bottleneck from Phase 1, categorize by optimization type:

**Categorize bottlenecks by optimization type:**

| Issue Type | Category | Typical Speedup |
|------------|----------|-----------------|
| Nested loops, O(n²) complexity | Algorithmic optimization | 10-1000x |
| Repeated expensive computations | Caching & memoization | 2-100x |
| Allocation-heavy code | Allocation reduction | 1.5-5x |
| Sequential access violations | Memory locality | 1.5-3x |
| Excessive I/O operations | I/O optimization | 5-50x |
| Blocking async operations | I/O optimization | 2-10x |
| Property access in loops | Caching & memoization | 1.2-2x |

**Quick reference for mapping bottlenecks:**

Load [references/quick-reference.md](references/quick-reference.md) for detailed bottleneck-to-category mapping and anti-pattern detection.

**Output:** Categorized list of bottlenecks with identified optimization categories. Load specific reference files in Phase 3.

### Phase 3: Optimize Using Performance Patterns

**Step 1: Identify your bottleneck category** from Phase 2 analysis.

**Step 2**: Load MANDATORY references for your category. Read each file completely with no range limits.

| Category | MANDATORY Files | Optional | Do NOT Load |
|----------|----------------|----------|-------------|
| **Algorithmic** (O(n²), nested loops, repeated lookups) | reduce-looping.md<br>reduce-branching.md | — | memoization, caching, I/O, allocation |
| **Caching** (property access in loops, repeated calculations) | memoization.md<br>cache-property-access.md | cache-storage-api.md (for Storage APIs) | I/O, allocation |
| **I/O** (blocking async, excessive I/O operations) | batching.md<br>defer-await.md | — | algorithmic, memory |
| **Memory** (allocation-heavy, GC pressure) | object-operations.md<br>avoid-allocations.md | — | I/O, caching |
| **Locality** (sequential access violations, cache misses) | predictable-execution.md | — | all others |
| **Safety** (unbounded loops, runaway queues) | bounded-iteration.md | — | all others |
| **Micro-opt** (hot path fine-tuning, 1.1-2x improvements) | currying.md<br>performance-misc.md | — | all others (apply only after algorithmic fixes) |

**Notes**:
- If bottleneck spans multiple categories, load references for all relevant categories
- Only apply micro-optimizations if: bottleneck is in hot path, algorithmic optimization already applied, need additional 1.1-2x performance

---

**Step 3: Scan for quick reference during optimization**

Load [AGENTS.md](AGENTS.md) to see compressed rule summaries organized by category. Use as a quick lookup while implementing patterns from the detailed reference files above.

**Apply patterns systematically:**

1. **Load the reference file** for the identified issue category
2. **Scan the ❌/✅ examples** to find matching patterns
3. **Apply the optimization** with minimal changes to preserve correctness
4. **Add comments** explaining the optimization and referencing the pattern

**Example optimization:**
```typescript
// ❌ Before: O(n²) - nested iteration
for (const user of users) {
  const items = allItems.filter(item => item.userId === user.id);
  process(items);
}

// ✅ After: O(n) - single pass with Map lookup
// Performance: reduce-looping.md - build lookup once pattern
const itemsByUser = new Map<string, Item[]>();
for (const item of allItems) {
  if (!itemsByUser.has(item.userId)) {
    itemsByUser.set(item.userId, []);
  }
  itemsByUser.get(item.userId)!.push(item);
}

for (const user of users) {
  const items = itemsByUser.get(user.id) ?? [];
  process(items);
}
```

### Phase 4: Verify Improvements

**Measure performance gain:**
1. Re-run profiler with same inputs
2. Compare before/after runtime percentages
3. Document speedup factor (e.g., "2.3x faster")

**Verify correctness:**
1. Run existing test suite - all tests must pass
2. Add new tests for edge cases affected by optimization
3. Manual testing for user-facing functionality

**Document optimization:**
```typescript
// Performance optimization applied: 2026-01-28
// Issue: Nested iteration causing O(n²) complexity with 10k items
// Pattern: reduce-looping.md - Map-based lookup
// Speedup: 145x faster (5200ms → 36ms)
// Verified: All tests pass, manual QA complete
```

**Deciding whether to keep the optimization:**
- **>10x speedup:** Always keep if tests pass
- **2-10x speedup:** Keep if tests pass and code remains maintainable
- **1.2-2x speedup:** Keep for hot paths (>1000 executions/sec) or real-time systems
- **1.05-1.2x speedup:** Keep only if trivial change or critical rendering/animation loop
- **<1.05x speedup:** Revert unless it also improves readability

**Real-time systems (60fps rendering, live data visualization):**
Even 1.05x improvements matter in critical hot paths. Use frame timing profiler to verify impact on frame budget (16.67ms for 60fps).

**If tests fail:** Fix the optimization or revert. Performance bugs are still bugs.

## Freedom Calibration

**Calibrate guidance specificity to optimization impact:**

| Optimization Type | Freedom Level | Guidance Format | Example |
|------------------|---------------|-----------------|---------|
| **Algorithmic (10x+ gain)** | Medium freedom | Multiple valid approaches, pick based on constraints | "Use Map for O(1) lookup or Set for deduplication" |
| **Caching (2-10x gain)** | Medium freedom | Pattern with examples, cache invalidation strategy | "Memoize with WeakMap if lifecycle matches source objects" |
| **Micro-optimization (1.1-2x)** | Low freedom | Exact pattern from reference, measure first | "Cache array.length in loop: `for (let i = 0, len = arr.length; ...)`" |

**The test:** "What's the speedup and maintenance cost?"
- 10x+ speedup → Worth complexity, medium freedom with patterns
- 2-10x speedup → Justify with measurements, medium freedom
- 1.2-2x speedup → Valuable for hot paths and real-time systems, low freedom with exact patterns
- 1.05-1.2x speedup → Only if trivial change or critical hot path (60fps rendering, etc.)

## Important Notes

- **Profiling is mandatory** - Every optimization must be justified by profiler data. Never optimize based on intuition alone.
- **Reference files are authoritative** - The patterns in references/ have been validated. Follow them exactly unless measurements prove otherwise.
- **Hot path definition** - Code executed >1000 times per user interaction or >100 times per second in server contexts. For real-time systems (60fps rendering, live visualization), hot paths are functions in the critical rendering loop consuming >1ms per frame.
- **Real-time systems have stricter requirements** - 60fps = 16.67ms frame budget. 120fps = 8.33ms. Even 1.05x improvements in hot paths are valuable. Profile with frame timing, not just total execution time.
- **Regression testing** - Performance optimizations frequently introduce subtle bugs in edge cases. Add tests before optimizing.
- **Memory profiling matters** - Some optimizations (memoization, caching) trade memory for speed. Monitor memory usage in production, especially for long-running real-time applications.

## Quick Decision Tree

Use this table to rapidly identify which optimization category applies:

| If You See... | Root Cause | Optimization Category | Expected Gain |
|---------------|------------|----------------------|---------------|
| Nested `for` loops over same data | O(n²) complexity | Algorithmic (reduce-looping) | 10-1000x |
| `.filter()` followed by `.find()` or `.map()` | Multiple passes over data | Algorithmic (reduce-looping) | 2-10x |
| Repeated `array.find()` or `.includes()` | O(n) linear search | Algorithmic (reduce-looping, use Set/Map) | 10-100x |
| Many `if/else` chains on same variable | Branch-heavy code | Algorithmic (reduce-branching) | 1.5-3x |
| Same function called with same inputs repeatedly | Redundant computation | Caching (memoization) | 2-100x |
| `obj.prop.nested.deep` accessed multiple times in loop | Property access overhead | Caching (cache-property-access) | 1.2-2x |
| `localStorage.getItem()` or `sessionStorage` in loop | Expensive I/O in loop | Caching (cache-storage-api) | 5-20x |
| Multiple `await fetch()` in sequence | Sequential I/O blocking | I/O (batching, defer-await) | 2-10x |
| `await` before conditional that might not need result | Premature async suspension | I/O (defer-await) | 1.5-3x |
| Many object spreads `{...obj}` or `[...arr]` | Allocation overhead | Memory (avoid-allocations) | 1.5-5x |
| Creating objects/arrays inside hot loops | GC pressure from allocations | Memory (avoid-allocations) | 2-5x |
| `Object.assign()` or spread when mutation is safe | Unnecessary immutability cost | Memory (object-operations) | 1.5-3x |
| Accessing array elements non-sequentially | Cache locality issues | Memory Locality (predictable-execution) | 1.5-3x |
| `while(true)` or unbounded queue growth | Runaway resource usage | Safety (bounded-iteration) | Prevents crashes |
| Function called with mostly same first N params | Repeated parameter passing | Micro-opt (currying) | 1.1-1.5x |
| `try/catch` inside hot loop | V8 deoptimization | Micro-opt (performance-misc) | 3-5x |
| String concatenation in loop with `+` | Quadratic string copying | Micro-opt (performance-misc) | 2-10x |

**How to use this table:**
1. Identify the pattern from profiler bottleneck
2. Find matching row in "If You See..." column
3. Jump to corresponding Optimization Category in Phase 3
4. Load MANDATORY reference files for that category
