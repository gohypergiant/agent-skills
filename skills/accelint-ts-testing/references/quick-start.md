# Quick Start Example

## Overview

This example shows how to turn an unclear test into a clear, maintainable one by following Vitest best practices.

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
- Uses a less intent-revealing matcher choice for this value comparison
- Abbreviated variable names

**✅ Correct: improved with Vitest best practices**
```ts
describe('ProductService', () => {
  it('should have status "pending approval" when no price is specified', () => {
    // Arrange
    const productService = new ProductService();

    // Act
    const newProduct = productService.add({name: 'Widget'});

    // Assert
    expect(newProduct.status).toEqual('pendingApproval');
  });
});
```

**Improvements:**
- Clear, descriptive test name that explains the behavior
- Test description in lowercase, reads as sentence: "it should have status..."
- AAA pattern with comment markers for clarity
- Simple organization with one module-level `describe()` and one focused `it()`
- Descriptive variable names (not abbreviated)
- Matcher choice makes the expected value comparison explicit

## Key Transformations

1. **Test name**: `'product test'` → `'should have status "pending approval" when no price is specified'`
2. **Organization**: Flat `test()` → One module-level `describe()` with a focused `it()`
3. **Structure**: Mixed code → Clear AAA sections
4. **Variables**: `p` → `newProduct`
5. **Assertions**: Less explicit value comparison → `toEqual()` for a clearer expected value check

This example applies these principles:
- [organization.md](organization.md) - Describe block structure
- [aaa-pattern.md](aaa-pattern.md) - Arrange-Act-Assert separation
- [assertions.md](assertions.md) - Strict assertions
