# Code Documentation Audit

## Abstract

Comprehensive guide for auditing and improving JavaScript/TypeScript documentation. Covers JSDoc standards, comment markers, and code comment quality. Each section includes one-line summaries here, with links to detailed examples in the `references/` folder.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify documentation issues
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Quick Reference

### When to Document

**Exported (Public API):**
- ✅ Always comprehensive documentation (no exceptions)
- Required: description, @param, @returns, @template, @throws, @example

**Internal Code:**
- ✅ Document what's not obvious
- Required: description, @param (for non-obvious), @returns (unless void/obvious), @template
- Optional: @example, @throws

---

## JSDoc Standards

### Functions
All functions need: description, @param, @template (if generic), @returns (unless void). Exported functions also need @throws and @example.
[View detailed examples](references/jsdoc.md#functions)

### Types and Interfaces
All types/interfaces need: description, @template (if generic). Exported types also need property descriptions.
[View detailed examples](references/jsdoc.md#types-and-interfaces)

### Classes
All classes need: description, @template (if generic). Exported classes also need @example.
[View detailed examples](references/jsdoc.md#classes)

### Constants
All constants need: description. Exported constants should include units/constraints if applicable.
[View detailed examples](references/jsdoc.md#constants)

### Object Parameters
Use dot notation to document destructured parameters (e.g., props.children, config.timeout).
[View detailed examples](references/jsdoc.md#object-parameters-with-destructuring)

### Code Fence Requirement
All @example tags MUST use code fences with language identifier (typescript, javascript, tsx, jsx).
[View detailed examples](references/jsdoc.md#example-code-fence-requirement)

---

## Comment Quality

### Comment Markers
Use TODO, FIXME, HACK, NOTE, REVIEW, PERF, DEBUG, REMARK with context and ownership.
[View detailed examples](references/comments.md#comment-markers)

### Comments to Remove
Always remove: commented-out code, edit history, comments restating obvious code.
[View detailed examples](references/comments.md#comments-to-remove)

### Comments to Preserve
Always keep: marker comments, linter directives, business logic explanations, docblocks.
[View detailed examples](references/comments.md#comments-to-preserve)

### Comment Placement
Move end-of-line comments to their own line above the code (improves readability).
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
