# 1.7 Performance

## Overview

Performance changes are where cleanup work most often adds risk for nothing: a memoized selector, a hand-rolled loop or a cache on a path that runs twice per session costs review time and future maintenance and changes nothing a user notices. This skill makes performance changes only where the team has said speed matters, and only with numbers.

## Key Principles

1. **Hot paths are declared, not guessed**: Only files matching overlay `hotPaths` globs are eligible; check with `node scripts/hot-paths.mjs <worktree> <file>...` rather than matching globs by eye. A file joins `hotPaths` when someone has profile evidence (a trace, a flame graph, a user-visible slowdown) and the team agrees. With no `hotPaths` declared, every performance finding is report-only.
2. **Measured before and after, on the same machine**: Every performance change carries a benchmark run before and after it. No numbers, no change.
3. **Behavior checks still apply**: A faster version that returns different results is a bug. Run every check in [behavior-checks.md](behavior-checks.md) first; the benchmark comes last.
4. **Small gains are not worth it**: Below a 10% improvement on the benchmark, or within the run-to-run noise, revert the change and record it in the report.
5. **Everything off the hot path is report-only**: List it under "Report only" with "no profile shows this path matters".

## Benchmark Procedure

| Stack | Tool | Before | After | Compare |
|-------|------|--------|-------|---------|
| TypeScript (Vitest) | `vitest bench` | `vitest bench --run <file>.bench.ts --outputJson before.json` | same, `--outputJson after.json` | `vitest bench --run <file>.bench.ts --compare before.json` |
| TypeScript (no Vitest) | `tinybench` or `mitata` in a script the repo already depends on | run the script, save the ops/sec | same | ratio of medians |
| Go | `go test -bench` + `benchstat` | `go test -run=^$ -bench=<Name> -count=10 ./<pkg> > before.txt` | same, `> after.txt` | `benchstat before.txt after.txt` |
| React rendering | React Profiler or a performance trace | record the interaction 3 times | same | median commit duration of the component |

If the repo has no benchmark for the path, write one first as its own commit, run it on the unchanged code, and only then make the change. A benchmark file is a test-like file and goes in the same MR/PR as the change it justifies.

Keep the conditions equal: same machine, no other heavy processes, production-like build flags (`NODE_ENV=production` for React), and warm-up iterations enabled.

## Examples

### Pattern 1: Optimizing without a hot path

**❌ Incorrect**
```ts
// "Performance: memoize the formatter" in a settings panel opened once per session
const format = useMemo(() => makeFormatter(locale), [locale]);
```

**Why this is wrong:** No evidence the panel is slow; the change adds a dependency array to maintain and nothing measurable.

**✅ Correct**
```
Report only: "Memoize formatter in settings-panel.tsx — not a declared hot path, no profile."
```

### Pattern 2: Hot path with numbers

**✅ Correct: MR description excerpt**
```
Hot path: packages/map/src/render/** (overlay hotPaths, trace in #412).
Change: replace per-frame array spread in buildFeatureList with a reused buffer.

benchstat (10 runs each):
  BuildFeatureList-8   1.92ms ± 2%   1.31ms ± 1%   -31.8%  (p=0.000 n=10+10)

Behavior checks: all passed; export diff unchanged.
```

## Common Pitfalls

- Benchmarking in development mode. React dev builds are several times slower and change the relative cost of operations; use a production build.
- Comparing single runs. Run at least 10 iterations (Go `-count=10`, Vitest's defaults) and compare medians or `benchstat` output, not one number.
- Keeping a change because it is "not slower". A change that does not help is churn; revert it.
- Adding a hot path to the overlay to justify a change you already want to make. `hotPaths` changes go through review like any other overlay change, with the evidence linked.
