# Vitest Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring vitest tests at Accelint. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for testing with `vitest`, designed for AI agents and LLMs. Each rule includes detailed explanations, and real-world examples comparing incorrect vs. correct implementations to guide automated refactoring and code generation. 

Use the `vitest` testing framework. Design tests to be short, simple, flat, and instantly understandable.

---

## Table of Contents

1. [General](#1-general)
    - 1.1 [Organization](#11-organization)
    - 1.2 [AAA Pattern](#12-aaa-pattern)
    - 1.3 [Parameterized Tests](#13-parameterized-tests)
    - 1.4 [Error Handling](#14-erorr-handling)
    - 1.5 [Assertions](#15-assertions)
2. [Test Doubles](#2-test-doubles)

---

## 1. General

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

### 1.1 Organization

- Place test files next to implementation (`foo.ts` / `foo.test.ts`)
- One test file per component, module, or class
- Store reusable setup in `fixtures/` or `test-utils/`

### 1.2 AAA Pattern

Structure tests as **Arrange**, **Act**, **Assert**:

```ts
it('should return the default value for an unknown property', () => {
  // Arrange
  const defaultColor: Color = [128, 128, 128, 155];
  const colorLookup = lookup(colorTable, defaultVal(defaultColor));

  // Act
  const actual = colorLookup('UNKNOWN');

  // Assert
  expect(actual).toEqual(defaultColor);
});
```

### 1.3 Parameterized Tests

One behavior per test. Use `it.each` for variations:

**✅ Correct: it.each for variations**
```ts
describe('factorial', () => {
  it.each([
    { input: 0, expected: 1 },
    { input: 1, expected: 1 },
    { input: 5, expected: 120 },
    { input: 7, expected: 5040 },
  ])('should return $expected when given $input', ({ input, expected }) => {
    expect(factorial(input)).toBe(expected);
  });

  it('should throw when the input is negative', () => {
    expect(() => factorial(-1)).toThrow('Number must not be negative');
  });
});
```

### 1.4 Error Handling

Test error-handling code thoroughly:

- **Negative Testing**: Deliberately introduce invalid inputs
- **Fault Injection**: Simulate system malfunctions or network issues
- **Recovery Testing**: Verify application can recover
- **Error Guessing**: Anticipate potential errors based on domain knowledge

### 1.5 Assertions

Use strict assertions:

**❌ Incorrect: loose or fuzzy assertion**
```ts
expect(content).toContain('valid-content');
```

**✅ Correct: strict assertion**
```ts
expect(content).toEqual({ key: 'valid-content' });
```

**✅ Correct: ultra strict assertion**
```ts
expect(content).toStrictEqual({ key: 'valid-content' });
```

---

## 2. Test Doubles

Prefer in this order:
1. **Fakes**: Lightweight in-memory implementations
2. **Stubs**: Pre-configured responses
3. **Spies/Mocks**: Interaction verification (last resort)

Avoid over-mocking:
- Only mock what you don't control (third-party libraries, networks, file systems)
- Don't mock pure functions or internal helpers
- Don't mock our own code
- Prefer record/replay frameworks over manual mocking
