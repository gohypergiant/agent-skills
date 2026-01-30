# 4.12 Avoid Needless Allocations

## Issues

- Intermediate variables that add allocation overhead
- Unnecessary variable assignments in hot paths
- Creating objects/arrays when inline computation suffices
- GC pressure from avoidable allocations
- Trading readability for performance in cold paths

## Optimizations

- Inline simple computations instead of storing in variables
- Avoid intermediate variables in hot paths and tight loops
- Balance readability vs performance based on call frequency
- Use variables for complex expressions or multiple uses
- Reserve intermediate variables for semantic value, not simple math

## Examples

### Inline Simple Computations

**❌ Incorrect: needless allocation**
```ts
function randomInt(min: number, max: number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  const range = maxFloor - minCeil + 1;

  return Math.floor(Math.random() * range + minCeil);
}
```

**✅ Correct: inline computation**
```ts
function randomInt(min: number, max: number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil + 1) + minCeil);
}
```

The `range` variable creates an allocation that provides no semantic value. When called frequently, these allocations create GC pressure.

### Avoid Allocations in Loops

**❌ Incorrect: allocate per iteration**
```ts
for (let i = 0; i < items.length; i++) {
  const scaledIndex = i * scaleFactor;
  const offset = baseOffset + padding;
  process(items[scaledIndex + offset]);
}
```

**✅ Correct: compute inline or hoist**
```ts
const offset = baseOffset + padding;

for (let i = 0; i < items.length; i++) {
  process(items[i * scaleFactor + offset]);
}
```

If `offset` is loop-invariant, hoist it. If `scaledIndex` is only used once, compute inline.

### When to Use Variables

**✅ Good: complex expression used multiple times**
```ts
function calculatePrice(quantity: number, basePrice: number): number {
  const discountedPrice = basePrice * (1 - getDiscount(quantity));
  return discountedPrice * quantity + getTax(discountedPrice);
}
```

Variables are warranted when:
- Expression is complex and inlining hurts readability
- Value is used multiple times
- Expression has side effects that shouldn't repeat
- Debugging would benefit from named intermediate values

**✅ Good: semantic value in business logic**
```ts
function validateOrder(order: Order): boolean {
  const hasValidItems = order.items.length > 0;
  const isWithinLimit = order.total <= order.user.creditLimit;
  const hasShippingAddress = !!order.shippingAddress;

  return hasValidItems && isWithinLimit && hasShippingAddress;
}
```

These variables add semantic clarity to business logic. The readability benefit outweighs the allocation cost in validation code.

### Inline vs Variable Trade-offs

**❌ Incorrect: variable for trivial computation**
```ts
function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dxSquared = dx * dx;
  const dySquared = dy * dy;
  const sum = dxSquared + dySquared;

  return Math.sqrt(sum);
}
```

**✅ Correct: inline simple math**
```ts
function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}
```

Use variables for `dx` and `dy` (reused), but inline `dx * dx` and `dy * dy` (simple, single-use).

### Object/Array Allocations in Hot Paths

**❌ Incorrect: create objects in loop**
```ts
function processPoints(points: Point[]): number {
  let sum = 0;
  for (const point of points) {
    const normalized = { x: point.x / 100, y: point.y / 100 };
    sum += normalized.x + normalized.y;
  }
  return sum;
}
```

**✅ Correct: inline computation**
```ts
function processPoints(points: Point[]): number {
  let sum = 0;
  for (const point of points) {
    sum += point.x / 100 + point.y / 100;
  }
  return sum;
}
```

Avoid creating objects when you can compute inline. The `normalized` object creates allocation overhead.

### Temporary Arrays

**❌ Incorrect: intermediate array**
```ts
function firstThreeValid(items: Item[]): Item[] {
  const validItems = items.filter(isValid);
  return validItems.slice(0, 3);
}
```

**✅ Correct: single pass**
```ts
function firstThreeValid(items: Item[]): Item[] {
  const result: Item[] = [];
  for (const item of items) {
    if (isValid(item)) {
      result.push(item);
      if (result.length === 3) break;
    }
  }
  return result;
}
```

Avoids allocating the full `validItems` array when you only need three elements.

## Guidelines

- **Hot paths**: Prefer inline computation to minimize allocations
- **Cold paths**: Prefer named variables for readability
- **Frequency matters**: Profile to identify hot paths before optimizing
- **Semantic value**: Use variables when they clarify intent
- **Multiple uses**: Always use variables for repeated expressions
- **Balance**: Don't sacrifice all readability for micro-optimizations

## When to Optimize

Optimize allocations when:
- Function is called thousands+ times per second
- Profiling shows GC pressure
- Running in memory-constrained environments
- Inside tight loops or hot paths

Don't optimize when:
- Function is called infrequently
- Readability significantly suffers
- No measurable performance impact
- Premature optimization in cold paths
