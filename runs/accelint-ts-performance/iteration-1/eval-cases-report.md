# accelint-ts-performance eval coverage report

- Total eval cases: 24
- JSON validation: passed

## Coverage summary

The eval set covers both major operating modes and the skill's core decision rules:
- Audit mode vs implementation mode, including explicit audit-report behavior
- Profiling-first prioritization when runtime evidence exists
- Static-review behavior when profiler data is unavailable, with hypothesis-level labeling
- Algorithmic issues: nested loops, repeated `find`/`filter`, repeated `includes`, and branch-heavy hot paths
- Caching and repeated-work issues: loop invariants, deep property access, and storage API caching
- I/O issues: sequential awaits, batching opportunities, and deferring `await` until needed
- Allocation and GC pressure: object spread in loops and string-building hot paths
- Deoptimization and runtime behavior: `try/catch` in hot loops and memory-locality concerns
- Safety and evidence-based tradeoffs: bounded iteration, memory-vs-CPU cache risks, environment-specific performance variance, and verification after optimization
- Boundary coverage for near-miss requests that belong to TS best-practices or TS documentation instead of this skill

## Notable additions

Added strong coverage for:
- profiler-driven prioritization
- hypothesis vs measured-bottleneck framing
- deoptimization awareness
- memory/locality guidance
- keep-or-revert verification criteria
- trigger boundaries to prevent over-invocation
