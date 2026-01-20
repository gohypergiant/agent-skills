# 1.3 Parameterized Tests

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
