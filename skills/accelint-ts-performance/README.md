# TypeScript Performance Optimization

Performance audit and optimization for JavaScript/TypeScript codebases. This skill combines a 4-phase audit workflow with expert optimization patterns.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-performance
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-performance
```

## Overview

This skill provides:

- **4-phase workflow** (`Profile → Analyze → Optimize → Verify`) for systematic audits
- **Expert optimization patterns** with `❌` and `✅` examples for each category
- **Bottleneck categorization** and decision frameworks
- **Profiling tool guidance** (`Chrome DevTools`, `node --prof`)

## When to Use

Use this skill when:
- Auditing code for performance bottlenecks
- Optimizing loops, caching, or allocation patterns
- Profiling slow code paths
- Fixing algorithmic complexity (O(n²) → O(n))
- Users say `optimize performance`, `this is slow`, `why is this slow`, or `reduce allocations`

## Structure

```
accelint-ts-performance/
├── SKILL.md                    # 4-phase workflow + guidance
├── AGENTS.md                   # Compressed rule overview
├── README.md                   # This file
├── evals/
│   └── evals.json             # 24 test cases
├── assets/
│   └── output-report-template.md # Structured audit report template
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

This skill minimizes context usage:

1. **Start with `SKILL.md`** - Follow the 4-phase workflow.
2. **Load `AGENTS.md`** - Scan compressed rule summaries.
3. **Load specific references** - Use detailed `❌` and `✅` examples when implementing.

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

1. **Profile first** - Use Chrome DevTools or `node --prof` to find bottlenecks that consume >5% of runtime.
2. **Categorize issues** - Map bottlenecks to optimization categories. See `quick-reference.md`.
3. **Load the relevant pattern** - Open the reference file for `❌` and `✅` examples.
4. **Apply and verify** - Implement the change, measure the speedup, and validate correctness with tests.

## Critical Anti-Patterns

Never do these:
- `❌` Chain array methods (`.filter().map()`) - Use a single pass.
- `❌` Use `Array.includes()` for repeated lookups - Use `Set.has()` (O(n) → O(1)).
- `❌` `await` before checking whether it is needed - Defer `await` into the branch that uses the result.
- `❌` Recompute constants in loops - Hoist invariants outside the loop.
- `❌` Create unbounded loops - Set explicit limits.
- `❌` Place `try/catch` in hot paths - It degrades V8 optimization.

See reference files for ✅ correct patterns.

## Architecture & Development Guides

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - repository architecture and system design
- [AGENTS.md](../../AGENTS.md) - agent behavior rules and workflow conventions

## License

Apache-2.0