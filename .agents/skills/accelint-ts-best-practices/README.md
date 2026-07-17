# JavaScript and TypeScript Best Practices

Comprehensive coding standards and performance optimization guide for JavaScript and TypeScript applications, designed for AI agents and LLMs working with modern JavaScript/TypeScript codebases.

## Overview

This skill provides structured guidance for JavaScript and TypeScript development across five categories:
- **General Best Practices**: Naming, control flow, state management, functions
- **TypeScript**: Avoid any/enum, prefer type over interface
- **Safety**: Input validation, assertions, error handling
- **Performance**: Reduce branching/looping, memoization, caching, deferred await
- **Documentation**: JSDoc, comment markers, code clarity

Based on ["HyperStyle"](https://docs.accelint.dev/doc/hyperstyle-javascript-urdYtXRUfn), a coding philosophy that prioritizes **safety**, **performance**, and **developer experience**, in that order. Inspired by [TigerBeetle's](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md) practices, it aims to build robust, efficient, and maintainable software through disciplined engineering.

**Note:** This skill focuses on JavaScript/TypeScript-specific patterns. Framework-specific optimizations (React, Vue, Angular) should use their dedicated skills.

---

## Quick Start

### For Agents/LLMs

1. **Read [SKILL.md](SKILL.md)** - Understand when to activate this skill and how to use it
2. **Reference [AGENTS.md](AGENTS.md)** - Browse rule summaries organized by category
3. **Load specific patterns** - Access detailed examples in `references/` as needed
4. **Apply the pattern** - Each reference file contains ❌/✅ examples

See [references/quick-start.md](references/quick-start.md) for complete workflow examples with before/after code.

### For Humans

This skill is optimized for AI agents but humans may find it useful for:
- Learning JavaScript/TypeScript performance optimization
- Reviewing code for common anti-patterns
- Understanding safety-first programming principles
- Systematic code quality improvement
- Writing better documentation

---

## Structure

### Progressive Disclosure
- **SKILL.md**: Activation criteria and usage workflow
- **AGENTS.md**: One-line summaries with links to detailed references
- **references/**: 33 self-contained files with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

### Safety-First Philosophy
Design for correctness before performance:
- Validate at boundaries (all external data with schemas)
- Assertions for programmer errors (crash on corrupted state)
- Explicit error handling (no silent failures)
- Zero values (eliminate downstream null checks)

### Performance Optimization Hierarchy
Optimize slowest resources first:
```
network >> disk >> memory >> cpu
```
Always benchmark assumptions. Profile to identify real bottlenecks before optimizing.

---

## Contributing

When adding new patterns:

1. **Create reference file** in `references/` following the standard format:
   - Clear title and one-line summary
   - ❌ Incorrect example(s) showing the anti-pattern
   - ✅ Correct example(s) showing the optimal implementation
   - Explanation of why the pattern matters
2. **Add to AGENTS.md** with one-line summary and link
3. **Update SKILL.md** if adding new categories
4. **Consider real-world usage** - Ensure patterns solve actual problems, not hypothetical ones

---

## License

Apache-2.0

---

## Coding Philosophy

This skill follows these principles:

1. **Safety first** - Correctness before performance; avoid bugs through validation and assertions
2. **Performance by design** - Design for performance from the start; optimize slowest operations first (network >> disk >> memory >> cpu)
3. **Defensive programming** - Return zero values, assert invariants, validate boundaries, handle all errors
4. **Simplicity over cleverness** - Prefer readable code over premature optimization
5. **Measure before optimizing** - Benchmark assumptions; profile to identify real bottlenecks
6. **Document non-obvious patterns** - Explain "why", not "what"; preserve business logic context
