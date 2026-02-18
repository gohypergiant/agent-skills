# 1.1 Organization

## File Placement and Naming

Place test files next to their implementation for easy discovery and maintenance.

**❌ Incorrect: separate test directory**
```
src/
  components/
    button.tsx
  utils/
    formatters.ts
tests/
  components/
    button.test.tsx
  utils/
    formatters.test.ts
```

**✅ Correct: co-located test files**
```
src/
  components/
    button.tsx
    button.test.tsx
  utils/
    formatters.ts
    formatters.test.ts
  services/
    api.ts
    api.test.ts
```
*Why?* Separate test directories make it harder to find tests, keep them in sync with implementation, and increase cognitive overhead.

## Naming Conventions

Use consistent naming patterns for test files:
- `*.test.ts` or `*.spec.ts` for tests

**❌ Incorrect: vague or inconsistent names**
```
test1.ts
user_tests.ts       // snake_case instead of kebab-case
payment.spec.js     // mixing .js and .ts
authTest.ts         // camelCase instead of kebab-case
```

**✅ Correct: descriptive test file names**
```
user-service.test.ts
payment-processor.test.ts
auth.integration.test.ts
```

## One Test File Per Module

Each module, component, or class should have exactly one corresponding test file.

**❌ Incorrect: multiple test files for one module**
```
user-service.test.ts
user-service.get-user.test.ts
user-service.update-user.test.ts
```

**✅ Correct: one-to-one mapping**
```ts
// user-service.ts
export class UserService {
  getUser(id: string) { /* ... */ }
  updateUser(id: string, data: UserData) { /* ... */ }
}

// user-service.test.ts
describe('UserService', () => {
  describe('getUser', () => { /* ... */ });
  describe('updateUser', () => { /* ... */ });
});
```
*Why?* Multiple test files fragment related tests, making it harder to understand the full behavior of a module.

## Shared Test Utilities

Store reusable test setup, fixtures, and helpers in dedicated directories.

**✅ Correct: organized test utilities**
```
src/
  test-utils/
    setup.ts          // Global test configuration
    factories.ts      // Test data factories
    matchers.ts       // Custom matchers
  fixtures/
    users.json        // Test data
    products.json
  __tests__/
    integration/      // Shared integration test setup
      db-setup.ts
```

**Example test utility:**
```ts
// test-utils/factories.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

// user-service.test.ts
import { createMockUser } from '../test-utils/factories';

it('should update user email', () => {
  const user = createMockUser({ email: 'old@example.com' });
  // ...
});
```
## Test Only the Public API Surface

Never export internal functions, private helpers, or implementation details just to make them testable.

**❌ Incorrect: exporting internal functions for testing**
```ts
// user-service.ts
export class UserService {
  createUser(data: UserData): User {
    const validated = this.validateUserData(data);
    const normalized = this.normalizeEmail(validated.email);
    return { ...validated, email: normalized };
  }

  // ❌ Exported only for testing!
  export function validateUserData(data: UserData): UserData { /* ... */ }

  // ❌ Exported only for testing!
  export function normalizeEmail(email: string): string { /* ... */ }
}

// user-service.test.ts
describe('UserService', () => {
  // ❌ Testing implementation details
  it('should validate user data', () => {
    const result = validateUserData({ email: 'TEST@EXAMPLE.COM' });
    expect(result).toBeDefined();
  });

  // ❌ Testing implementation details
  it('should normalize email', () => {
    expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
  });
});
```
*Why?* This creates several problems: (1) Pollutes the module's public API with implementation details, (2) Makes refactoring harder because "private" functions are now part of the public contract, (3) Tests become coupled to implementation, breaking when you refactor even if behavior is unchanged.

**✅ Correct: test through public API**
```ts
// user-service.ts
export class UserService {
  createUser(data: UserData): User {
    const validated = this.validateUserData(data);
    const normalized = this.normalizeEmail(validated.email);
    return { ...validated, email: normalized };
  }

  // Private - not exported
  private validateUserData(data: UserData): UserData { /* ... */ }

  // Private - not exported
  private normalizeEmail(email: string): string { /* ... */ }
}

// user-service.test.ts
describe('UserService', () => {
  describe('createUser', () => {
    // ✅ Test validation through public API
    it('should reject invalid email addresses', () => {
      const service = new UserService();
      expect(() => service.createUser({ email: 'not-an-email' }))
        .toThrow('Invalid email');
    });

    // ✅ Test normalization through public API
    it('should normalize email to lowercase', () => {
      const service = new UserService();
      const user = service.createUser({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM'
      });
      expect(user.email).toBe('test@example.com');
    });

    // ✅ Test multiple validation rules through public API
    it('should accept valid user data', () => {
      const service = new UserService();
      const user = service.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });
});
```
*Why?* Private functions are tested indirectly through the public API that uses them. This makes tests resilient to refactoring - you can change how validation or normalization works internally without breaking tests, as long as the behavior stays the same.

**✅ Alternative: extract complex logic into separate module**
```ts
// email-validator.ts (new module with its own public API)
export function isValidEmail(email: string): boolean { /* ... */ }
export function normalizeEmail(email: string): string { /* ... */ }

// email-validator.test.ts
describe('Email Validator', () => {
  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
    });
  });

  describe('normalizeEmail', () => {
    it('should convert to lowercase', () => {
      expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    });
  });
});

// user-service.ts (uses the new module)
import { isValidEmail, normalizeEmail } from './email-validator';

export class UserService {
  createUser(data: UserData): User {
    if (!isValidEmail(data.email)) {
      throw new Error('Invalid email');
    }
    return { ...data, email: normalizeEmail(data.email) };
  }
}

// user-service.test.ts (tests high-level behavior)
describe('UserService', () => {
  it('should create user with normalized email', () => {
    const service = new UserService();
    const user = service.createUser({
      name: 'Test',
      email: 'TEST@EXAMPLE.COM',
    });
    expect(user.email).toBe('test@example.com');
  });
});
```
*Why?* If internal logic is complex enough to deserve dedicated unit tests, it's complex enough to be its own module. This gives it a real public API, makes it reusable, and allows both focused unit tests (email-validator.test.ts) and integration tests (user-service.test.ts).

## Describe Block Organization

Use flat, focused describe blocks to group related tests.

**❌ Incorrect: deep nesting**
```ts
describe('ShoppingCart', () => {
  describe('when cart is empty', () => {
    describe('addItem', () => {
      describe('with valid item', () => {
        it('should add item', () => { /* ... */ });
      });
      describe('with invalid item', () => {
        it('should throw', () => { /* ... */ });
      });
    });
  });
  describe('when cart has items', () => {
    describe('addItem', () => {
      // deeply nested...
    });
  });
});
```

**✅ Correct: flat structure, grouped by method**
```ts
describe('ShoppingCart', () => {
  describe('addItem', () => {
    it('should add item to empty cart', () => { /* ... */ });
    it('should increment quantity when adding existing item', () => { /* ... */ });
    it('should throw when adding invalid item', () => { /* ... */ });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => { /* ... */ });
    it('should throw when removing non-existent item', () => { /* ... */ });
  });

  describe('calculateTotal', () => {
    it('should return 0 for empty cart', () => { /* ... */ });
    it('should sum all item prices', () => { /* ... */ });
  });
});
```
*Why?* Deep nesting makes tests harder to read and adds unnecessary indentation. Put context in the test name instead.

## Test Description Format

Test descriptions must be written in lowercase and complete the sentence "it ...".

**❌ Incorrect: capitalized or non-sentence formats**
```ts
describe('ShoppingCart', () => {
  it('Add item to cart', () => { /* ... */ });
  it('It should calculate total', () => { /* ... */ });
  it('Calculate Total', () => { /* ... */ });
  it('SHOULD_REMOVE_ITEM', () => { /* ... */ });
  it('addToCart test', () => { /* ... */ });
});
```

**✅ Correct: lowercase sentence format**
```ts
describe('ShoppingCart', () => {
  it('should add item to cart', () => { /* ... */ });
  it('should calculate total price', () => { /* ... */ });
  it('should remove item when quantity reaches zero', () => { /* ... */ });
  it('should apply discount to premium members', () => { /* ... */ });
});
```
*Why?* The test description completes the sentence "it ..." — reading as "it should add item to cart", "it should calculate total price". This creates natural, readable test output and maintains consistency across test suites. When tests fail, the output reads like English: "ShoppingCart › should add item to cart ✗".

**Pattern: it('should [action] [context]')**
- Start with "should" to describe expected behavior
- Use lowercase for the entire description
- Be specific about what is being tested
- Include relevant context when needed

**Examples of good test descriptions:**
```ts
it('should return empty array when no results found')
it('should throw error for invalid email format')
it('should update user profile with new data')
it('should calculate discount for premium members')
it('should preserve order when sorting by date')
it('should retry failed requests up to 3 times')
```

**Special case: Property-based tests**
```ts
// Property-based tests use 'property:' prefix
it('property: decode(encode(x)) === x for all valid inputs', () => {
  fc.assert(fc.property(fc.string(), (input) => {
    expect(decode(encode(input))).toEqual(input);
  }));
});
```

## Setup and Teardown

Use `beforeEach` and `afterEach` for common setup, but keep tests independent.

**❌ Incorrect: shared mutable state between tests**
```ts
describe('DatabaseService', () => {
  const db = createTestDatabase(); // Shared across all tests!

  it('should insert record', async () => {
    await db.insert({ name: 'Test' });
    // ...
  });

  it('should update record', async () => {
    // Depends on previous test's data!
    await db.update(1, { name: 'Updated' });
  });
});
```

**✅ Correct: clean setup per test**
```ts
describe('DatabaseService', () => {
  let db: Database;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  afterEach(async () => {
    await db.close();
  });

  it('should insert record', async () => {
    await db.insert({ name: 'Test' });
    const records = await db.query('SELECT * FROM users');
    expect(records).toHaveLength(1);
  });
});
```
*Why?* Tests that share state are fragile and order-dependent. Each test should be fully independent.
