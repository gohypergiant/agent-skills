# 5.1 JSDoc

All externally exposed APIs (exports) must have well-formed JSDoc comments.

```ts
/**
 * Clamps a number within the specified bounds.
 *
 * @param min - The lower bound to clamp to.
 * @param max - The upper bound to clamp to.
 * @param value - The number value to clamp to the given range.
 * @returns The clamped value.
 *
 * @throws {RangeError} Throws if min > max.
 *
 * @remarks
 * This is a pure function with no side effects.
 *
 * @example
 * ```typescript
 * const value = clamp(5, 15, 10); // 10
 * const value = clamp(5, 15, 2);  // 5
 * const value = clamp(5, 15, 20); // 15
 * ```
 */
export function clamp(min: number, max: number, value: number): number {
  if (min > max) {
    throw new RangeError(`min (${min}) > max (${max})`);
  }

  return Math.max(min, Math.min(max, value));
}
```

- At minimum: `@param`, `@template` (if applicable), `@returns`, `@throws` (if applicable), `@example`.
- Optional: `@see`/`@link`, `@remarks`, `@deprecated`.
