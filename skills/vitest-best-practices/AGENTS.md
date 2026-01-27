# Vitest Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring vitest tests. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for testing with `vitest`, designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

Use the `vitest` testing framework. Design tests to be short, simple, flat, and instantly understandable.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant patterns
2. **Check for existing setup files**: Before writing tests, look for setup files that configure global mocks and utilities
3. **Load references as needed**: Click through to detailed examples only when implementing
4. **Progressive loading**: Each reference file is self-contained with examples

This structure minimizes context usage while providing complete implementation guidance when needed.

## Workflow: Before Writing Tests

**1. Check vitest.config.ts for global configuration**
Verify mock cleanup is configured globally:
```ts
// Look for these settings:
clearMocks: true      // Mock cleanup configured?
resetMocks: true      // Mock reset configured?
restoreMocks: true    // Mock restore configured?
```

If not present, recommend adding them. This eliminates the entire class of mock cleanup errors.

**2. Discover existing test setup files**
Check common locations for test setup configuration:
- `test/setup.{ts,js}` or `testing/setup.{ts,js}`
- `vitest.setup.{ts,js}` or `src/test/setup.{ts,js}`
- Check `vitest.config.ts` for configured `setupFiles` and `globalSetup`

**3. Analyze setup file contents**
When found, identify:
- Global mocks (fetch, timers, etc.)
- Custom matchers (e.g., `@testing-library/jest-dom`)
- Test utilities and helpers
- Environment configuration

**4. Only add per-test cleanup for non-mock resources**
If global config handles mocks, DO NOT add manual mock cleanup:
- ❌ Don't add `vi.clearAllMocks()` (handled by config)
- ✅ Do clean up listeners, connections, custom state

**Principle: Configuration over repetition**
Mock cleanup is a safety concern. Configure it once globally to make forgetting impossible. Manual cleanup in every test violates DRY and creates maintenance burden.

See [vitest-features.md](references/vitest-features.md#discovering-existing-setup-files) and [performance.md](references/performance.md#cleanup-between-tests) for detailed examples.

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

### 1.7 Async Testing
Test promises, async/await, and timers correctly.
[View detailed examples](references/async-testing.md)

### 1.8 Performance
Keep tests fast through efficient setup and avoiding expensive operations.
[View detailed examples](references/performance.md)

### 1.9 Vitest Features
Use coverage, watch mode, benchmarking, and other vitest-specific features.
[View detailed examples](references/vitest-features.md)

### 1.10 Snapshot Testing
Use snapshots for appropriate cases; avoid common pitfalls.
[View detailed examples](references/snapshot-testing.md)
