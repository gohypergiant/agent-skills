# TypeScript Performance Optimization

Systematic performance optimization for JavaScript/TypeScript codebases. Combines audit workflow with expert-level optimization patterns for runtime performance.

## Overview

This skill provides:

- **4-phase workflow** (Profile → Analyze → Optimize → Verify) for systematic performance auditing
- **Expert optimization patterns** with ❌/✅ examples for all performance categories
- **Bottleneck categorization** and decision frameworks for when to optimize
- **Profiling tool guidance** (Chrome DevTools, Node.js --prof)

## When to Use

Use this skill when:
- Auditing code for performance bottlenecks
- Optimizing loops, caching, or allocation patterns
- Profiling slow code paths
- Fixing algorithmic complexity issues (O(n²) → O(n))
- Users say "optimize performance", "this is slow", "why is this slow", "reduce allocations"

## Structure

```
accelint-ts-performance/
├── SKILL.md                    # 4-phase workflow + guidance
├── AGENTS.md                   # Compressed rule overview
├── README.md                   # This file
└── references/
    ├── quick-reference.md      # Bottleneck → category mapping
    ├── reduce-branching.md     # Convert conditionals to lookups
    ├── reduce-looping.md       # Single-pass operations, O(1) lookups
    ├── memoization.md          # Hoist invariants, cache results
    ├── cache-property-access.md # Cache lookups, eliminate aliases
    ├── cache-storage-api.md    # Cache localStorage/sessionStorage
    ├── batching.md             # Batch I/O operations
    ├── defer-await.md          # Defer awaits, parallelize async
    ├── object-operations.md    # Safe mutation, shallow clones
    ├── avoid-allocations.md    # Inline ops, reduce GC pressure
    ├── predictable-execution.md # Sequential access, cache locality
    ├── bounded-iteration.md    # Set limits on loops and queues
    ├── currying.md             # Precompute constant parameters
    └── performance-misc.md     # Strings, regex, closures, try/catch
```

## Progressive Disclosure

This skill minimizes context usage through progressive loading:

1. **Start with SKILL.md** - Follow the 4-phase workflow
2. **Load AGENTS.md** - Scan compressed rule summaries
3. **Load specific references** - Detailed ❌/✅ examples when implementing

## Performance Categories

| Category | Typical Speedup | Reference Files |
|----------|-----------------|-----------------|
| Algorithmic optimization | 10-1000x | reduce-branching.md, reduce-looping.md |
| Caching & memoization | 2-100x | memoization.md, cache-property-access.md, cache-storage-api.md |
| I/O optimization | 2-50x | batching.md, defer-await.md |
| Allocation reduction | 1.5-5x | object-operations.md, avoid-allocations.md |
| Memory locality | 1.5-3x | predictable-execution.md |
| Safety & bounds | DoS prevention | bounded-iteration.md |
| Micro-optimizations | 1.05-2x | currying.md, performance-misc.md |

## Quick Start

1. **Profile first** - Use Chrome DevTools or `node --prof` to identify bottlenecks consuming >5% runtime
2. **Categorize issues** - Map bottlenecks to optimization categories (see quick-reference.md)
3. **Load relevant pattern** - Open corresponding reference file for ❌/✅ examples
4. **Apply and verify** - Implement optimization, measure speedup, validate correctness with tests

## Critical Anti-Patterns

**NEVER** do these:
- ❌ Chain array methods (`.filter().map()`) - use single `reduce` pass
- ❌ Use `Array.includes()` for repeated lookups - use `Set.has()` (O(n) → O(1))
- ❌ Await before checking if needed - defer `await` into branches
- ❌ Recompute constants in loops - hoist invariants outside
- ❌ Create unbounded loops - set explicit limits
- ❌ Place `try/catch` in hot paths - degrades V8 optimization

See reference files for ✅ correct patterns.

## License

Apache-2.0
