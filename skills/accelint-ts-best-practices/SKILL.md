---
name: accelint-ts-best-practices
description: Use this skill for TypeScript/JavaScript code-health work: a review, audit, or refactor whose goal is safer, more predictable, more maintainable code. Invoke it when the user wants a “look over,” “scan,” “clean up,” or best-practices pass on TS/JS modules, helpers, utilities, or packages, or when type errors after a refactor point to weak code patterns rather than framework behavior. It is the right fit for issues around unsafe `any`, weak union narrowing, null/undefined hazards, inconsistent return values, `enum` replacement, `type` vs `interface`, mutation/state handling, loop or control-flow mistakes, incomplete error paths, duplication, naming, and external-input validation. Prefer this skill when the user cares more about correctness and maintainability than speed. Do not use it for performance tuning, tests, security review, docs/JSDoc, or framework-specific debugging.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.2.2"
---

# JavaScript and TypeScript Best Practices

Comprehensive coding standards for JavaScript and TypeScript applications for AI agents and LLMs working with modern JavaScript/TypeScript codebases.

This skill focuses on general best practices, TypeScript patterns, and safety. For performance optimization, use the `accelint-ts-performance` skill instead.

## When to Use This Skill

Use this skill for JavaScript or TypeScript coding work where the right answer depends on type safety, defensive programming, error handling, return-value design, control flow, state management, or common TS anti-patterns. This includes writing new code, reviewing existing code, fixing type errors, refactoring unsafe patterns, and running code-quality audits. Start by loading [AGENTS.md](AGENTS.md) to scan rule summaries and identify the narrowest relevant references for the task.

## How to Use

This skill uses a progressive disclosure structure to minimize context usage.

### 1. Start with the overview (`AGENTS.md`)
Read [AGENTS.md](AGENTS.md) for a concise overview of all rules, organized by category with one-line summaries.

### 2. Load specific rules as needed
When you identify a relevant pattern or issue, load the corresponding reference file for detailed implementation guidance:

**Quick Start:**
- [quick-start.md](references/quick-start.md) - Complete workflow examples showing how to identify a pattern, load the right reference, and apply a fix

**General Best Practices:**
- [naming-conventions.md](references/naming-conventions.md) - Descriptive names, qualifier ordering, boolean prefixes
- [functions.md](references/functions.md) - Function size, parameters, explicit values
- [control-flow.md](references/control-flow.md) - Early returns, flat structure, block style
- [state-management.md](references/state-management.md) - const vs let, immutability, pure functions
- [return-values.md](references/return-values.md) - Return zero values instead of null/undefined
- [misc.md](references/misc.md) - Line endings, defensive programming, technical debt
- [code-duplication.md](references/code-duplication.md) - Extract common patterns, DRY principle, when to consolidate

**TypeScript:**
- [any.md](references/any.md) - Avoid any, use unknown or generics
- [enums.md](references/enums.md) - Use as const objects instead of enum
- [type-vs-interface.md](references/type-vs-interface.md) - Prefer type over interface
- [bundler-paths.md](references/bundler-paths.md) - Use statically analyzable import and file-system paths for optimal bundling

**Safety:**
- [input-validation.md](references/input-validation.md) - Validate external data with schemas
- [assertions.md](references/assertions.md) - Split assertions, include values
- [error-handling.md](references/error-handling.md) - Handle all errors explicitly
- [error-messages.md](references/error-messages.md) - User-friendly vs developer-specific messages

**Performance:**
- If the main task is speed, allocations, algorithmic complexity, caching, profiling, or runtime bottlenecks, use the `accelint-ts-performance` skill instead of this one

**Documentation:**
- If the main task is JSDoc, comments, TODO/FIXME markers, or documentation audits, use the `accelint-ts-documentation` skill instead of this one

### 3. Apply the Pattern
Each reference file contains:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

### 4. Use the report template when auditing
When the task is an audit or code-quality review, use the standardized report format:

**Template:** [`assets/output-report-template.md`](assets/output-report-template.md)

The report format provides:
- Executive Summary with impact assessment
- Severity levels (Critical, High, Medium, Low) for prioritization
- Impact analysis (potential bugs, type safety, maintainability, runtime failures)
- Categorization (Type Safety, Safety, State Management, Return Values, Code Quality)
- Pattern references linking to detailed guidance in `references/`
- Phase 2 summary table for tracking all issues

**When to use the audit template:**
- Skill invoked directly via `/accelint-ts-best-practices <path>`
- User asks to "review code quality" or "audit code" across file(s), invoking skill implicitly

**When NOT to use the report template:**
- User asks to "fix this type error" (direct implementation)
- User asks "what's wrong with this code?" (answer the question)
- User requests specific fixes (apply fixes directly without formal report)

