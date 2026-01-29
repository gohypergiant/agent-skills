---
name: js-ts-best-practices
description: Use when writing JavaScript/TypeScript code, implementing control flow or state management, fixing type errors, adding validation or error handling. For performance optimization, use ts-performance skill. For documentation tasks, use ts-documentation skill.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "2.1"
---

# JavaScript and TypeScript Best Practices

Comprehensive coding standards for JavaScript and TypeScript applications, designed for AI agents and LLMs working with modern JavaScript/TypeScript codebases.

**Note:** This skill focuses on general best practices, TypeScript patterns, and safety. For performance optimization, use the `ts-performance` skill instead.

## When to Use This Skill

This skill provides expert-level patterns for JavaScript and TypeScript code. Load [AGENTS.md](AGENTS.md) to scan rule summaries and identify relevant optimizations for your task.

## How to Use

This skill uses a **progressive disclosure** structure to minimize context usage:

### 1. Start with the Overview (AGENTS.md)
Read [AGENTS.md](AGENTS.md) for a concise overview of all rules with one-line summaries organized by category.

### 2. Load Specific Rules as Needed
When you identify a relevant pattern or issue, load the corresponding reference file for detailed implementation guidance:

**Quick Start:**
- [quick-start.md](references/quick-start.md) - Complete workflow examples with before/after code

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

**Safety:**
- [input-validation.md](references/input-validation.md) - Validate external data with schemas
- [assertions.md](references/assertions.md) - Split assertions, include values
- [error-handling.md](references/error-handling.md) - Handle all errors explicitly
- [error-messages.md](references/error-messages.md) - User-friendly vs developer-specific messages

**Performance:**
- **For performance optimization tasks**, use the `ts-performance` skill for comprehensive profiling workflows and optimization patterns

**Documentation:**
- **For documentation tasks**, use the `ts-documentation` skill for comprehensive JSDoc and comment guidance

### 3. Apply the Pattern
Each reference file contains:
- ❌ Incorrect examples showing the anti-pattern
- ✅ Correct examples showing the optimal implementation
- Explanations of why the pattern matters

