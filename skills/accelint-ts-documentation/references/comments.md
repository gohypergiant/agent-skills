# Comment Quality Standards

## Comment Markers

Use "better comment" markers for non-docblock comments to categorize different types of annotations:

- `TODO:` - Future changes or unimplemented features
- `FIXME:` - Known bugs or critical defects
- `HACK:` - Workarounds or sub-optimal solutions
- `NOTE:` - Important informational points
- `REVIEW:` - Areas requiring code review or scrutiny
- `PERF:` - Performance bottlenecks or optimizations
- `DEBUG:` - Temporary debugging code (remove later)
- `REMARK:` - General observations

**❌ Incorrect: Vague markers without context**
```typescript
// TODO: fix this
// TODO: improve performance
// TODO: handle edge cases
```

**✅ Correct: Specific markers with context and ownership**
```typescript
// TODO(username): Replace with binary search for O(log n) lookup
// FIXME(username): Throws error on empty array, add guard clause
// HACK(username): Temporary workaround for API bug #1234, remove when fixed
```

## Comments to Remove

Always remove these types of comments during audits:

### Commented-Out Code
Dead code should be deleted, not commented. Version control preserves history.

**❌ Incorrect: Dead code should be removed**
```typescript
function process(data) {
  // const oldWay = transform(data);
  // return oldWay.map(x => x * 2);
  return newWay(data);
}
```

**✅ Correct: Delete dead code**
```typescript
function process(data) {
  return newWay(data);
}
```

### Edit History Comments
Comments like "added", "removed", "changed" should be removed. Git provides change history.

**❌ Incorrect: Edit history in comments**
```typescript
// Added 2024-01-15: Support for new API
// Changed by John: Use async/await
// Removed error handling (not needed)
function fetchData() {
  // ...
}
```

**✅ Correct: Remove edit history**
```typescript
function fetchData() {
  // ...
}
```

### Comments Restating Code
Comments that merely restate what the code clearly does add no value.

**❌ Incorrect: Obvious comment**
```typescript
// Increment counter by 1
counter++;

// Loop through all users
for (const user of users) {
  // ...
}

// Return true
return true;
```

**✅ Correct: Only comment non-obvious intent**
```typescript
// Reset counter for next batch
counter = 0;

// Process users in registration order (stable sort required)
for (const user of users) {
  // ...
}
```

## Comments to Preserve

Always keep these types of comments during audits:

### Comments with Markers
All comments using TODO, FIXME, HACK, NOTE, REVIEW, PERF, DEBUG, or REMARK markers should be preserved.

**✅ Correct: Preserve marker comments**
```typescript
// TODO(alice): Implement caching for repeated queries
// FIXME(bob): Race condition when concurrent requests
// PERF(charlie): This loop is O(n²), optimize to O(n log n)
```

### Linter and Tool Directives
These have specific syntax required by tools and must not be modified.

**✅ Correct: Preserve tool directives unchanged**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = parseUnknownFormat(input);

// biome-ignore lint/suspicious/noExplicitAny: External API requires any
function processExternal(input: any): void {
  // ...
}

// prettier-ignore
const matrix = [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
];

// @ts-expect-error - Testing error handling
const result = functionThatThrows();
```

### Business Logic Explanations
Comments explaining why code works a certain way (not what it does) are valuable.

**✅ Correct: Preserve business logic explanations**
```typescript
// Apply 10% discount only on weekdays per marketing policy
const discount = isWeekday ? 0.10 : 0;

// Cache must be invalidated after 5 minutes due to API rate limits
const CACHE_TTL = 5 * 60 * 1000;

// Use binary search because data is pre-sorted by database
const index = binarySearch(sortedData, target);
```

### Docblock Comments
All JSDoc comments should be preserved (and improved if incomplete).

**✅ Correct: Preserve and enhance docblocks**
```typescript
/**
 * Calculates the total price including tax.
 * @param basePrice - Price before tax in dollars
 * @param taxRate - Tax rate as decimal (0.08 = 8%)
 * @returns Total price with tax applied
 */
function calculateTotal(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate);
}
```

## Comments Placement

Move end-of-line comments to their own line above the code they describe. This improves readability and prevents comments from being lost at the end of long lines.

**❌ Incorrect: End-of-line comments**
```typescript
const MAX_RETRIES = 3; // Maximum number of retry attempts
const TIMEOUT = 5000; // Request timeout in milliseconds

function process(data: Data): Result {
  const normalized = normalize(data); // Convert to standard format
  const validated = validate(normalized); // Check all required fields
  return transform(validated); // Apply business rules
}
```

**✅ Correct: Comments above code**
```typescript
// Maximum number of retry attempts
const MAX_RETRIES = 3;

// Request timeout in milliseconds
const TIMEOUT = 5000;

function process(data: Data): Result {
  // Convert to standard format
  const normalized = normalize(data);

  // Check all required fields
  const validated = validate(normalized);

  // Apply business rules
  return transform(validated);
}
```

**Exception: Short inline clarifications are acceptable**
```typescript
const result = value ?? fallback; // Use fallback if value is null/undefined
return items.filter(x => x > 0); // Remove negative values
```
