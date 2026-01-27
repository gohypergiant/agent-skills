# Vitest Best Practices

Comprehensive guide for writing maintainable, effective tests with Vitest. This skill provides patterns, examples, and best practices for testing TypeScript/JavaScript applications.

## Quick Start

### Installation

```bash
# Install vitest
npm install -D vitest

# Install optional dependencies
npm install -D @vitest/ui @vitest/coverage-v8
```

### Basic Configuration

**Note:** Before creating a new config, check if `vitest.config.ts` already exists in your project. See [AGENTS.md](AGENTS.md#workflow-before-writing-tests) for the discovery workflow.

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    // Mock cleanup - prevents flaky tests
    clearMocks: true,      // Clear call history before each test
    resetMocks: true,      // Reset implementation before each test
    restoreMocks: true,    // Restore original implementation before each test

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
```

### Your First Test

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// math.test.ts
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-2, 3)).toBe(1);
  });
});
```

### Run Tests

```bash
# Run tests once
npx vitest run

# Run in watch mode
npx vitest

# Run with coverage
npx vitest --coverage

# Run with UI
npx vitest --ui
```

## What This Skill Covers

### Core Testing Patterns

1. **[Organization](references/organization.md)** - File placement, naming, and test structure
2. **[AAA Pattern](references/aaa-pattern.md)** - Arrange-Act-Assert for clear tests
3. **[Parameterized Tests](references/parameterized-tests.md)** - Using `it.each()` for variations
4. **[Error Handling](references/error-handling.md)** - Testing exceptions and edge cases
5. **[Assertions](references/assertions.md)** - Choosing the right matchers
6. **[Test Doubles](references/test-doubles.md)** - Fakes, stubs, mocks, and spies

### Advanced Topics

7. **[Async Testing](references/async-testing.md)** - Promises, async/await, and timers
8. **[Performance](references/performance.md)** - Keeping tests fast and efficient
9. **[Vitest Features](references/vitest-features.md)** - Coverage, watch mode, and more
10. **[Snapshot Testing](references/snapshot-testing.md)** - When and how to use snapshots

## Key Principles

- **Clarity over cleverness**: Tests should be instantly understandable
- **Flat structure**: Avoid deep nesting in describe blocks
- **One assertion per concept**: Focus tests on single behaviors
- **Strict assertions**: Prefer `toEqual` over `toBe`, `toStrictEqual` when needed
- **Minimal mocking**: Use real implementations when practical
- **Fast execution**: Keep tests quick through efficient setup/teardown
- **Configuration over repetition**: Use `clearMocks: true` in config to eliminate cleanup errors

## Progressive Documentation Structure

This skill uses **progressive disclosure** to minimize context usage:

1. **Start with AGENTS.md** - Scan rule summaries and workflow for discovering existing test configuration
2. **Check existing config** - Before writing tests, verify `vitest.config.ts` has mock cleanup configured
3. **Load specific references** - Click through to detailed examples only when implementing
4. **Each reference is self-contained** - Complete implementation guidance with examples

This structure provides complete guidance while keeping your context lean.

## Example: Complete Test

Here's a well-structured test following all the best practices:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user-service';
import { InMemoryUserRepository } from './test-utils/repositories';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    userService = new UserService(userRepo);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Act
      const user = await userService.createUser(userData);

      // Assert
      expect(user).toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: expect.any(Date),
      });
    });

    it.each([
      { email: '', error: 'Email is required' },
      { email: 'invalid', error: 'Invalid email format' },
      { email: 'test@', error: 'Invalid email format' },
    ])('should throw for invalid email: "$email"', async ({ email, error }) => {
      // Arrange
      const userData = { name: 'John', email };

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(error);
    });
  });

  describe('updateUser', () => {
    it('should update user name', async () => {
      // Arrange
      const user = await userService.createUser({
        name: 'John',
        email: 'john@example.com',
      });

      // Act
      const updated = await userService.updateUser(user.id, { name: 'Jane' });

      // Assert
      expect(updated.name).toBe('Jane');
      expect(updated.email).toBe('john@example.com');
    });
  });
});
```

## Common Commands

```bash
# Run all tests
vitest run

# Watch mode
vitest

# Run specific file
vitest run user-service.test.ts

# Run tests matching pattern
vitest run --grep "UserService"

# Update snapshots
vitest run -u

# Generate coverage
vitest run --coverage

# Run with UI
vitest --ui

# Type check
vitest typecheck
```

## Integration with Package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:typecheck": "vitest typecheck"
  }
}
```

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## Version Compatibility

This skill is designed for:
- **Vitest**: v1.0.0+
- **Node.js**: v18.0.0+
- **TypeScript**: v5.0.0+