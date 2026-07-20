# 4.13 Currying and Partial Application for Performance

## Overview

Convert functions to curried form when parameters are constant across many calls. Precompute expensive operations (exponentiation, regex compilation, lookups) and cache them in closures to eliminate repeated work in loops and hot paths.

## Examples

### Currying for Expensive Computation

**❌ Incorrect: recompute multiplier every call**
```ts
export function round(precision: number, value: number): number {
  if (!Number.isInteger(precision)) {
    throw new Error('Precision must be an integer.');
  }

  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}

// In hot path
for (const price of prices) {
  rounded.push(round(2, price)); // Recomputes 10 ** 2 every iteration
}
```

**✅ Correct: curry to precompute multiplier**
```ts
export function round(precision: number): (value: number) => number;
export function round(precision: number, value: number): number;
export function round(
  precision: number,
  value?: number,
): number | ((value: number) => number) {
  if (!Number.isInteger(precision)) {
    throw new Error('Precision must be an integer.');
  }

  const multiplier = 10 ** precision;

  if (value === undefined) {
    // Return curried function with precomputed multiplier
    return (v: number) => Math.round(v * multiplier) / multiplier;
  }

  return Math.round(value * multiplier) / multiplier;
}

// In hot path
const roundTo2 = round(2); // Compute 10 ** 2 once
for (const price of prices) {
  rounded.push(roundTo2(price)); // Reuse precomputed multiplier
}
```

The curried version computes `10 ** precision` once and captures it in the closure, avoiding repeated exponentiation.

### Currying for Regex Compilation

**❌ Incorrect: recompile regex every call**
```ts
function validate(pattern: string, value: string): boolean {
  const regex = new RegExp(pattern);
  return regex.test(value);
}

for (const email of emails) {
  if (validate('^[a-z]+@[a-z]+\\.[a-z]+$', email)) {
    validEmails.push(email);
  }
}
```

**✅ Correct: curry to compile regex once**
```ts
function validate(pattern: string): (value: string) => boolean;
function validate(pattern: string, value: string): boolean;
function validate(
  pattern: string,
  value?: string,
): boolean | ((value: string) => boolean) {
  const regex = new RegExp(pattern);

  if (value === undefined) {
    return (v: string) => regex.test(v);
  }

  return regex.test(value);
}

const isValidEmail = validate('^[a-z]+@[a-z]+\\.[a-z]+$');
for (const email of emails) {
  if (isValidEmail(email)) {
    validEmails.push(email);
  }
}
```

### Currying for Configuration

**❌ Incorrect: pass same config repeatedly**
```ts
function formatCurrency(config: FormatConfig, amount: number): string {
  const symbol = config.currencySymbol;
  const decimals = config.decimalPlaces;
  const multiplier = 10 ** decimals;

  return symbol + (Math.round(amount * multiplier) / multiplier).toFixed(decimals);
}

// Called thousands of times with same config
for (const transaction of transactions) {
  display(formatCurrency(usdConfig, transaction.amount));
}
```

**✅ Correct: curry to capture config**
```ts
function formatCurrency(config: FormatConfig): (amount: number) => string;
function formatCurrency(config: FormatConfig, amount: number): string;
function formatCurrency(
  config: FormatConfig,
  amount?: number,
): string | ((amount: number) => string) {
  const symbol = config.currencySymbol;
  const decimals = config.decimalPlaces;
  const multiplier = 10 ** decimals;

  const format = (amt: number) =>
    symbol + (Math.round(amt * multiplier) / multiplier).toFixed(decimals);

  if (amount === undefined) {
    return format;
  }

  return format(amount);
}

const formatUSD = formatCurrency(usdConfig);
for (const transaction of transactions) {
  display(formatUSD(transaction.amount));
}
```

### Partial Application with bind

**❌ Incorrect: repeated identical calls**
```ts
function scale(factor: number, base: number, value: number): number {
  return base + value * factor;
}

for (const measurement of measurements) {
  scaled.push(scale(2.5, 100, measurement));
}
```

**✅ Correct: use bind for partial application**
```ts
function scale(factor: number, base: number, value: number): number {
  return base + value * factor;
}

const scaleMeasurement = scale.bind(null, 2.5, 100);
for (const measurement of measurements) {
  scaled.push(scaleMeasurement(measurement));
}
```

**Note**: `bind()` has overhead. For hot paths, prefer explicit currying as shown in previous examples.

### Currying for Validation Rules

**❌ Incorrect: recreate validators**
```ts
function validateRange(min: number, max: number, value: number): boolean {
  return value >= min && value <= max;
}

for (const score of scores) {
  if (!validateRange(0, 100, score)) {
    errors.push(`Invalid score: ${score}`);
  }
}
```

**✅ Correct: curry to create reusable validator**
```ts
function validateRange(min: number, max: number): (value: number) => boolean;
function validateRange(min: number, max: number, value: number): boolean;
function validateRange(
  min: number,
  max: number,
  value?: number,
): boolean | ((value: number) => boolean) {
  const check = (v: number) => v >= min && v <= max;

  if (value === undefined) {
    return check;
  }

  return check(value);
}

const isValidScore = validateRange(0, 100);
for (const score of scores) {
  if (!isValidScore(score)) {
    errors.push(`Invalid score: ${score}`);
  }
}
```

### When NOT to Curry

**✅ Good: parameters vary frequently**
```ts
function add(a: number, b: number): number {
  return a + b;
}

// Both parameters change every call
for (let i = 0; i < items.length; i++) {
  totals[i] = add(items[i].price, items[i].tax);
}
```

Don't curry when:
- Parameters vary on every call
- Function is called infrequently
- Setup cost is negligible
- Currying adds more overhead than it saves

### Currying with TypeScript Generics

**❌ Incorrect: lose type information**
```ts
function map<T, U>(fn: (item: T) => U, items: T[]): U[] {
  return items.map(fn);
}

// Have to pass fn and items together
const doubled = map((x: number) => x * 2, [1, 2, 3]);
```

**✅ Correct: curry with generics**
```ts
function map<T, U>(fn: (item: T) => U): (items: T[]) => U[];
function map<T, U>(fn: (item: T) => U, items: T[]): U[];
function map<T, U>(
  fn: (item: T) => U,
  items?: T[],
): U[] | ((items: T[]) => U[]) {
  const mapper = (arr: T[]) => arr.map(fn);

  if (items === undefined) {
    return mapper;
  }

  return mapper(items);
}

// Create reusable mapper
const double = map((x: number) => x * 2);
const doubled1 = double([1, 2, 3]);
const doubled2 = double([4, 5, 6]);
```

## Guidelines

- **Profile first**: Measure to confirm the parameter is expensive to compute
- **Constant parameters**: Curry when some parameters are constant across many calls
- **Hot paths**: Prioritize currying in loops, event handlers, and frequently-called functions
- **Expensive setup**: Curry functions with expensive validation, computation, or object creation
- **TypeScript**: Use function overloads to support both curried and direct-call APIs
- **Closure cost**: Be aware curried functions capture variables in closure (minimal overhead)

## When to Use Currying

Curry functions when:
- Parameters include expensive computations (exponentiation, regex, lookup tables)
- Some parameters are constant across hundreds/thousands of calls
- Function is in a hot path (loop, render, event handler)
- Setup/validation cost is significant
- Creating specialized versions improves API ergonomics

## When NOT to Use Currying

Avoid currying when:
- All parameters vary on every call
- Function is called infrequently
- Setup cost is trivial (simple primitives)
- Currying complexity outweighs performance gain
- Premature optimization in cold paths

## Fallback Patterns

When currying doesn't work, use these alternatives:

### Fallback 1: Direct function calls when parameters vary

**Scenario**: All parameters change on every call
```ts
// ❌ Don't curry - no benefit
const add = (a: number) => (b: number) => a + b;

for (let i = 0; i < items.length; i++) {
  totals[i] = add(items[i].price)(items[i].tax); // Awkward and slow
}
```

**✅ Use direct function call**
```ts
function add(a: number, b: number): number {
  return a + b;
}

for (let i = 0; i < items.length; i++) {
  totals[i] = add(items[i].price, items[i].tax); // Clear and fast
}
```

**Why**: Currying adds closure overhead (function creation, variable capture) with zero benefit when all parameters vary.

### Fallback 2: Inline computation when setup cost is trivial

**Scenario**: Operation is so simple that currying adds complexity
```ts
// ❌ Over-engineered
const multiply = (factor: number) => (value: number) => factor * value;
const double = multiply(2);

for (const x of values) {
  results.push(double(x));
}
```

**✅ Inline the trivial operation**
```ts
for (const x of values) {
  results.push(x * 2); // No abstraction needed
}
```

**Why**: For trivial operations (multiplication, addition), the overhead of function calls exceeds any benefit. Inline when the operation is simpler than the abstraction.

### Fallback 3: Memoization for expensive pure functions

**Scenario**: Function is expensive but parameters vary frequently
```ts
// ❌ Currying doesn't help - parameters vary
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Called with different values each time
for (const num of numbers) {
  results.push(fibonacci(num)); // O(2^n) each call
}
```

**✅ Use memoization instead**
```ts
const fibCache = new Map<number, number>();

function fibonacci(n: number): number {
  if (n <= 1) return n;
  if (fibCache.has(n)) return fibCache.get(n)!;

  const result = fibonacci(n - 1) + fibonacci(n - 2);
  fibCache.set(n, result);
  return result;
}

for (const num of numbers) {
  results.push(fibonacci(num)); // O(n) total with cache
}
```

**Why**: When parameters vary but repeat, memoization is more effective than currying. Cache stores results by input rather than precomputing constants.

### Fallback 4: Loop hoisting for simple invariants

**Scenario**: Simple invariant doesn't need currying
```ts
// ❌ Overkill for simple hoisting
const addTax = (rate: number) => (amount: number) => amount * (1 + rate);
const withTax = addTax(0.08);

for (const price of prices) {
  totals.push(withTax(price));
}
```

**✅ Hoist the invariant**
```ts
const TAX_RATE = 1.08;

for (const price of prices) {
  totals.push(price * TAX_RATE); // Simple and clear
}
```

**Why**: When the invariant is a simple primitive, hoisting it outside the loop is clearer than creating a curried function.
