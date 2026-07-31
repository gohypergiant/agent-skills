# JavaScript and TypeScript Best Practices

Comprehensive coding standards for JavaScript and TypeScript applications, designed for AI agents and LLMs working with modern codebases.

## Overview

This skill provides structured guidance for JavaScript and TypeScript development across four areas:
- **General Best Practices**: Naming, control flow, state management, functions
- **TypeScript**: Avoid any/enum, prefer type over interface
- **Safety**: Input validation, assertions, error handling, bounded iteration
- **Audit Workflow**: Standardized reporting for code-quality reviews

Based on ["HyperStyle"](https://docs.accelint.dev/doc/hyperstyle-javascript-urdYtXRUfn), a coding philosophy that prioritizes **safety**, **performance**, and **developer experience**, in that order. Inspired by [TigerBeetle's](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md) practices, it builds robust, efficient, and maintainable software through disciplined engineering.

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
- Reviewing code for common JavaScript/TypeScript anti-patterns
- Understanding safety-first programming principles
- Systematic code quality improvement
- Learning consistent TypeScript coding conventions

---

## Structure

### Progressive Disclosure
- **SKILL.md**: Activation criteria and usage workflow
- **AGENTS.md**: One-line summaries with links to detailed references
- **references/**: 17 self-contained files with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

### Safety-First Philosophy
Design for correctness before performance:
- Validate at boundaries (all external data with schemas)
- Assertions for programmer errors (crash on corrupted state)
- Explicit error handling (no silent failures)
- Zero values (eliminate downstream null checks)
- Bounded iteration (prevent runaway loops, queues, and recursion)

If the primary goal becomes profiling or runtime optimization, switch to the `accelint-ts-performance` skill.

---

## Reference Files

### General Best Practices
- [naming-conventions.md](references/naming-conventions.md)
- [functions.md](references/functions.md)
- [control-flow.md](references/control-flow.md)
- [state-management.md](references/state-management.md)
- [return-values.md](references/return-values.md)
- [code-duplication.md](references/code-duplication.md)
- [misc.md](references/misc.md)

### TypeScript
- [any.md](references/any.md)
- [enums.md](references/enums.md)
- [type-vs-interface.md](references/type-vs-interface.md)
- [bundler-paths.md](references/bundler-paths.md)

### Safety
- [input-validation.md](references/input-validation.md)
- [assertions.md](references/assertions.md)
- [error-handling.md](references/error-handling.md)
- [error-messages.md](references/error-messages.md)
- [bounded-iteration.md](references/bounded-iteration.md)

### Workflow
- [quick-start.md](references/quick-start.md)

---

## Audit Workflow

When performing formal code audits, this skill includes a standardized report template:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (potential bugs, type safety, maintainability, runtime failures)
- Categorization (Type Safety, Safety, State Management, Return Values, Code Quality)
- Pattern references linking to detailed guidance in `references/`
- Phase 2 summary table for tracking all issues

Use the audit template when:
- Skill invoked directly via command
- User asks to "review code quality" or "audit code" across file(s)

Do not use the report template when:
- User asks to "fix this type error" (direct implementation)
- User asks "what's wrong with this code?" (answer the question)
- User requests specific fixes (apply fixes directly)

---

## Contributing

When adding new patterns:

1. **Create reference file** in `references/` following the standard format:
   - Clear title and one-line summary
   - ❌ Incorrect example(s) showing the anti-pattern
   - ✅ Correct example(s) showing the optimal implementation
   - Explanation of why the pattern matters
2. **Add to AGENTS.md** with one-line summary and link
3. **Update SKILL.md** if adding new categories or changing routing guidance
4. **Keep README and AGENTS.md aligned** when category descriptions or workflow expectations change
5. **Consider real-world usage** - Ensure patterns solve actual problems, not hypothetical ones

---

## Architecture & Development Guides

For broader repository and codebase context:
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Repository architecture and component overview

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
