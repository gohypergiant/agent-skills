# 1.7 Code Duplication (DRY Principle)

When refactoring code, look for common patterns that can be extracted into utility functions. Apply the DRY (Don't Repeat Yourself) principle by identifying duplicated logic and consolidating it into reusable functions.

## When to Extract Common Patterns

Extract common patterns when:
- The same logic appears in multiple places (2+ occurrences)
- Parameters differ but the core logic is identical
- The abstraction reduces complexity rather than adding it
- The utility function has a clear, single responsibility

## Guidelines

- The extracted function should be more maintainable than the duplicated code
- Prefer simple, focused utility functions over complex abstractions
- Use descriptive names that clearly indicate the function's purpose
- Keep the utility function in the same file if used only there; move to a utilities module if used across multiple files
- Ensure the abstraction doesn't hurt readability (3 lines duplicated may not need extraction)

## Examples

### Example 1: Extracting Padding Logic

**❌ Incorrect: duplicated padding logic**
```ts
const TWO_DIGIT_DEFAULT = '--';
const FOUR_DIGIT_DEFAULT = '----';

export function formatCodeM1(value?: string | number): string {
  if (value) {
    return `${value}`.padStart(2, '0');
  }

  return TWO_DIGIT_DEFAULT;
}

export function formatCodeM2(value?: string | number): string {
  if (value) {
    return `${value}`.padStart(4, '0');
  }

  return FOUR_DIGIT_DEFAULT;
}
```

**✅ Correct: extracted common pattern with optimizations**
```ts
const TWO_DIGIT_DEFAULT = '--';
const FOUR_DIGIT_DEFAULT = '----';

function formatCode(
  value: string | number | undefined,
  digits: 2 | 4,
): string {
  if (!value) {
    return digits === 2 ? TWO_DIGIT_DEFAULT : FOUR_DIGIT_DEFAULT;
  }

  // Optimize string coercion: avoid template literal overhead
  const str = typeof value === 'string' ? value : String(value);
  return str.padStart(digits, '0');
}

export function formatCodeM1(value?: string | number): string {
  return formatCode(value, 2);
}

export function formatCodeM2(value?: string | number): string {
  return formatCode(value, 4);
}
```

### Example 2: Extracting Validation Logic

**❌ Incorrect: duplicated validation**
```ts
export function updateEmail(email: string): void {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  // Update email logic
}

export function registerUser(email: string, password: string): void {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  // Registration logic
}
```

**✅ Correct: extracted validation function**
```ts
function validateEmail(email: string): void {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
}

export function updateEmail(email: string): void {
  validateEmail(email);
  // Update email logic
}

export function registerUser(email: string, password: string): void {
  validateEmail(email);
  // Registration logic
}
```

### Example 3: Extracting Data Transformation

**❌ Incorrect: duplicated transformation logic**
```ts
export function getUserDisplayName(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.lastName) {
    return user.lastName;
  }
  return 'Anonymous';
}

export function getAuthorDisplayName(author: Author): string {
  if (author.firstName && author.lastName) {
    return `${author.firstName} ${author.lastName}`;
  }
  if (author.firstName) {
    return author.firstName;
  }
  if (author.lastName) {
    return author.lastName;
  }
  return 'Anonymous';
}
```

**✅ Correct: extracted name formatting**
```ts
function formatFullName(
  firstName: string | undefined,
  lastName: string | undefined,
): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return 'Anonymous';
}

export function getUserDisplayName(user: User): string {
  return formatFullName(user.firstName, user.lastName);
}

export function getAuthorDisplayName(author: Author): string {
  return formatFullName(author.firstName, author.lastName);
}
```

## When NOT to Extract

**Don't extract if:**
- The duplication is incidental (similar-looking but semantically different)
- The abstraction makes the code harder to understand
- The logic is too simple (e.g., 1-2 line operations)
- Each instance is likely to diverge in future requirements

**❌ Incorrect: over-abstraction**
```ts
// Extracting trivial operations creates unnecessary indirection
function addOne(x: number): number {
  return x + 1;
}

const result = addOne(counter); // Just use counter + 1
```

**✅ Correct: keep it simple**
```ts
const result = counter + 1;
```

## Related Patterns

- See [1.2 Functions](functions.md) for function size and structure guidelines
- See [4.13 Currying](currying.md) for precomputing constant parameters
- See [1.6 Misc](misc.md) for zero technical debt principle
