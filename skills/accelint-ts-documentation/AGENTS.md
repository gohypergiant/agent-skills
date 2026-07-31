# Code Documentation Audit

## Abstract

This skill audits and improves JavaScript/TypeScript documentation. It covers JSDoc standards, comment markers, and code-comment quality. Each section summarizes the core rule here and links to detailed examples in the `references/` folder.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify the documentation issue.
2. **Load references as needed**: Open detailed examples only when you are implementing changes.
3. **Use progressive loading**: Each reference file is self-contained and includes ❌/✅ examples.

This structure reduces context use while preserving complete implementation guidance when you need it.

---

## Quick Reference

### When to Document

**Exported (Public API):**
- ✅ Always use comprehensive documentation. No exceptions.
- Required: description, `@param`, `@returns`, `@template`, `@throws`, `@example`

**Internal Code:**
- ✅ Document what is not obvious.
- Required: description, `@param` for non-obvious cases, `@returns` unless void or obvious, `@template`
- Optional: `@example`, `@throws`

---

## JSDoc Standards

### Functions
All functions need a description, `@param`, `@template` if generic, and `@returns` unless the return type is `void`. Exported functions also need `@throws` and `@example`.
[View detailed examples](references/jsdoc.md#functions)

### Types and Interfaces
All types and interfaces need a description and `@template` if generic. Exported types also need property descriptions.
[View detailed examples](references/jsdoc.md#types-and-interfaces)

### Classes
All classes need a description and `@template` if generic. Exported classes also need `@example`.
[View detailed examples](references/jsdoc.md#classes)

### Constants
All constants need a description. Exported constants should include units or constraints when applicable.
[View detailed examples](references/jsdoc.md#constants)

### Object Parameters
Use dot notation to document destructured parameters (e.g., props.children, config.timeout).
[View detailed examples](references/jsdoc.md#object-parameters-with-destructuring)

### Code Fence Requirement
All `@example` tags MUST use code fences with a language identifier (`typescript`, `javascript`, `tsx`, `jsx`).
[View detailed examples](references/jsdoc.md#example-code-fence-requirement)

---

## Comment Quality

### Comment Markers
Use `TODO`, `FIXME`, `HACK`, `NOTE`, `REVIEW`, `PERF`, `DEBUG`, and `REMARK` with context and ownership.
[View detailed examples](references/comments.md#comment-markers)

### Comments to Remove
Always remove commented-out code, edit history, and comments that restate obvious code.
[View detailed examples](references/comments.md#comments-to-remove)

### Comments to Preserve
Always keep marker comments, linter directives, business-logic explanations, and docblocks.
[View detailed examples](references/comments.md#comments-to-preserve)

### Comment Placement
Move end-of-line comments to their own line above the code. This improves readability.
[View detailed examples](references/comments.md#comments-placement)

---

## Common Anti-Patterns

**NEVER** do these:
- ❌ @example without code fences (won't render properly)
- ❌ Over-document internal utilities (noise vs signal)
- ❌ Leave commented-out code (git preserves history)
- ❌ Document HOW instead of WHAT/WHY
- ❌ Use @returns for void functions
- ❌ Add TODO without context ("fix this" is useless)

See SKILL.md for detailed anti-pattern examples with corrections.
