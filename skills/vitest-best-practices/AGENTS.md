# Vitest Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring vitest tests at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for testing with `vitest`, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

Use the `vitest` testing framework. Design tests to be short, simple, flat, and instantly understandable.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant patterns
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## General Test Structure

Use `it()` with sentence-style descriptions:

**✅ Correct: appropriate structure**
```ts
describe('ProductsService', () => {
  describe('Add new product', () => {
    it('should have status "pending approval" when no price is specified', () => {
      const newProduct = new ProductService().add(/*...*/);
      expect(newProduct.status).toEqual('pendingApproval');
    });
  });
});
```

---

## 1. General

### 1.1 Organization
Place test files next to implementation; one test file per module.
[View detailed examples](references/organization.md)

### 1.2 AAA Pattern
Structure tests as Arrange, Act, Assert for clarity.
[View detailed examples](references/aaa-pattern.md)

### 1.3 Parameterized Tests
Use `it.each` for variations; one behavior per test.
[View detailed examples](references/parameterized-tests.md)

### 1.4 Error Handling
Test negative cases, fault injection, and recovery thoroughly.
[View detailed examples](references/error-handling.md)

### 1.5 Assertions
Use strict assertions (`toEqual`, `toStrictEqual`) over loose ones.
[View detailed examples](references/assertions.md)

### 1.6 Test Doubles
Prefer fakes > stubs > spies/mocks; avoid over-mocking.
[View detailed examples](references/test-doubles.md)
