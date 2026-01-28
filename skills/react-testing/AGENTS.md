# React Testing Library

> **Note:**
> This document is mainly for agents and LLMs to follow when writing or reviewing React component tests with Testing Library. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for React Testing Library best practices, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

**Token efficiency principle:** This guide maximizes knowledge delta by providing only expert-level insights Claude doesn't already know. All rules assume Claude understands Testing Library basics, React fundamentals, and standard testing patterns. Focus is on non-obvious decisions, accessibility-first testing, and avoiding common pitfalls.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant optimizations
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Quick Reference

- [1.1 Query Priority](#11-query-priority) - Use accessible queries before test IDs (role > label > text > testId)
- [1.2 Query Variants](#12-query-variants) - getBy for sync, findBy for async, queryBy for absence
- [1.3 User Events](#13-user-events) - Use userEvent over fireEvent for realistic interactions
- [1.4 Async Testing](#14-async-testing) - Handle promises with findBy, waitFor, act patterns
- [1.5 Custom Render](#15-custom-render) - Wrap components with providers in test utils
- [1.6 Accessibility Queries](#16-accessibility-queries) - Query by role, ARIA attributes, semantic HTML
- [1.7 Anti-patterns](#17-anti-patterns) - Avoid implementation details, container queries, wrapper usage
- [1.8 Assertions](#18-assertions) - Use jest-dom matchers for clear, semantic test assertions

---

## 1. Testing Patterns

### 1.1 Query Priority
Use accessible query hierarchy: getByRole > getByLabelText > getByText > getByTestId.
[View detailed examples](references/query-priority.md)

### 1.2 Query Variants
getBy* for immediate presence, findBy* for async appearance, queryBy* to assert absence.
[View detailed examples](references/query-variants.md)

### 1.3 User Events
Use @testing-library/user-event for realistic interaction sequences, not fireEvent.
[View detailed examples](references/user-events.md)

### 1.4 Async Testing
Handle async with findBy queries and waitFor; avoid act warnings with proper awaiting.
[View detailed examples](references/async-testing.md)

### 1.5 Custom Render
Create test utils that wrap components with Context, Redux, Router providers.
[View detailed examples](references/custom-render.md)

### 1.6 Accessibility Queries
Query by semantic roles and labels; test ensures accessibility by design.
[View detailed examples](references/accessibility-queries.md)

### 1.7 Anti-patterns
Never test implementation details, use container queries, rely on excessive snapshots, use queryBy for presence, or put side effects in waitFor.
[View detailed examples](references/anti-patterns.md)

### 1.8 Assertions
Use jest-dom matchers (toBeInTheDocument, toHaveAccessibleName) for semantic assertions.
[View detailed examples](references/assertions.md)
