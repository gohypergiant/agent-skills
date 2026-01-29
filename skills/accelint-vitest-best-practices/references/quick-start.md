# Quick Start Example

## Overview

This example demonstrates how to transform an unclear test into a clear, maintainable one following vitest best practices.

## Before and After

**❌ Incorrect: unclear test**
```ts
test('product test', () => {
  const p = new ProductService().add({name: 'Widget'});
  expect(p.status).toBe('pendingApproval');
});
```

**Issues:**
- Vague test name doesn't describe behavior
- No AAA structure separation
- Unclear what's being tested
- Uses loose assertion (`toBe` instead of `toEqual`)
- No describe blocks for organization
- Abbreviated variable names

**✅ Correct: optimized with vitest best practices**
```ts
describe('ProductService', () => {
  describe('Add new product', () => {
    it('should have status "pending approval" when no price is specified', () => {
      // Arrange
      const productService = new ProductService();

      // Act
      const newProduct = productService.add({name: 'Widget'});

      // Assert
      expect(newProduct.status).toEqual('pendingApproval');
    });
  });
});
```

**Improvements:**
- Clear, descriptive test name that explains the behavior
- AAA pattern with comment markers for clarity
- Organized with describe blocks (module > behavior)
- Descriptive variable names (not abbreviated)
- Strict assertion (`toEqual` instead of `toBe`)
- Uses `it()` for sentence-style readability

## Key Transformations

1. **Test name**: `'product test'` → `'should have status "pending approval" when no price is specified'`
2. **Organization**: Flat `test()` → Nested `describe()` blocks with `it()`
3. **Structure**: Mixed code → Clear AAA sections
4. **Variables**: `p` → `newProduct`
5. **Assertions**: `toBe()` → `toEqual()`

This example applies principles from:
- [organization.md](organization.md) - Describe block structure
- [aaa-pattern.md](aaa-pattern.md) - Arrange-Act-Assert separation
- [assertions.md](assertions.md) - Strict assertions
