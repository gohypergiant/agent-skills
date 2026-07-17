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

## What to Test: Your Code, Not Libraries

Test your business logic, not library internals. Standard libraries (JavaScript/TypeScript built-ins) and well-established third-party libraries are already thoroughly tested. Testing that libraries work correctly wastes time and adds no value.

**❌ Incorrect: testing library functionality**
```ts
describe('array operations', () => {
  // ❌ Testing that Array.prototype.map works
  it('should map array values', () => {
    const input = [1, 2, 3];
    const result = input.map(x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  // ❌ Testing that Array.prototype.filter works
  it('should filter array values', () => {
    const input = [1, 2, 3, 4];
    const result = input.filter(x => x > 2);
    expect(result).toEqual([3, 4]);
  });

  // ❌ Testing that lodash works
  it('should deeply clone object', () => {
    const input = { a: { b: 1 } };
    const result = _.cloneDeep(input);
    expect(result).toEqual({ a: { b: 1 } });
    expect(result).not.toBe(input);
  });
});

describe('React hooks', () => {
  // ❌ Testing that useState works
  it('should update state', () => {
    const { result } = renderHook(() => useState(0));
    const [, setState] = result.current;
    act(() => setState(1));
    expect(result.current[0]).toBe(1);
  });
});

describe('axios', () => {
  // ❌ Testing that axios makes HTTP requests
  it('should make GET request', async () => {
    const response = await axios.get('https://api.example.com/data');
    expect(response.status).toBe(200);
  });
});
```

*Why incorrect?* These tests verify that the language, framework, and libraries work correctly. JavaScript's `Array.prototype.map`, lodash's `cloneDeep`, React's `useState`, and axios's HTTP functionality are already extensively tested by their maintainers. These tests add no value and waste time.

**✅ Correct: test how YOUR code uses libraries**
```ts
describe('UserProcessor', () => {
  // ✅ Testing business logic that happens to use map
  it('should extract user IDs from user objects', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const processor = new UserProcessor();
    const ids = processor.extractIds(users);

    expect(ids).toEqual([1, 2]);
  });

  // ✅ Testing business rules that use filter
  it('should return only active premium users', () => {
    const users = [
      { id: 1, status: 'active', tier: 'premium' },
      { id: 2, status: 'inactive', tier: 'premium' },
      { id: 3, status: 'active', tier: 'free' },
    ];

    const processor = new UserProcessor();
    const activePremium = processor.getActivePremiumUsers(users);

    expect(activePremium).toEqual([
      { id: 1, status: 'active', tier: 'premium' },
    ]);
  });

  // ✅ Testing business logic that uses lodash
  it('should create user snapshot without modifying original', () => {
    const user = { id: 1, profile: { name: 'Alice' } };

    const processor = new UserProcessor();
    const snapshot = processor.createSnapshot(user);
    snapshot.profile.name = 'Bob';

    // Testing OUR business requirement: snapshots are independent
    expect(user.profile.name).toBe('Alice');
    expect(snapshot.profile.name).toBe('Bob');
  });
});

describe('useUserData hook', () => {
  // ✅ Testing custom hook behavior, not useState itself
  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useUserData('user-123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  // ✅ Testing business logic: error handling
  it('should set error when user not found', async () => {
    mockAPI.getUser.mockRejectedValue(new Error('User not found'));

    const { result } = renderHook(() => useUserData('invalid-id'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('User not found');
    });
  });
});

describe('ApiClient', () => {
  // ✅ Testing OUR API client logic, not axios
  it('should add authentication header to requests', async () => {
    const mockAxios = { get: vi.fn().mockResolvedValue({ data: 'test' }) };
    const client = new ApiClient(mockAxios, 'auth-token-123');

    await client.fetchData('/api/users');

    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        headers: { Authorization: 'Bearer auth-token-123' },
      })
    );
  });

  // ✅ Testing OUR retry logic, not axios
  it('should retry failed requests up to 3 times', async () => {
    const mockAxios = {
      get: vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: 'success' }),
    };
    const client = new ApiClient(mockAxios);

    const result = await client.fetchWithRetry('/api/data');

    expect(result).toBe('success');
    expect(mockAxios.get).toHaveBeenCalledTimes(3);
  });
});
```

*Why correct?* These tests verify YOUR business logic, YOUR error handling, YOUR authentication logic, and YOUR retry strategy. The libraries are implementation details—you could swap lodash for Ramda, or axios for fetch, and these tests should still pass (after adjusting the implementation).

### Guidelines for What to Test

**Test YOUR code:**
- Business logic and rules
- Data transformations specific to your domain
- Error handling and edge cases in your code
- Integration points where your code coordinates multiple libraries
- Custom behavior and workflows

**Do NOT test library code:**
- Standard library methods (`Array.map`, `String.split`, `Object.keys`)
- Framework internals (React hooks, Vue reactivity, Angular services)
- Third-party library functionality (lodash, axios, moment, zod)
- Language features (promises, async/await, destructuring)

### When Library Usage Needs Testing

Test library usage only when:

1. **You're wrapping/adapting the library** → Test your wrapper, not the library
```ts
// ✅ Test your date formatting wrapper
it('should format date in US format', () => {
  const formatter = new DateFormatter();
  expect(formatter.toUSFormat(new Date('2024-01-15'))).toBe('01/15/2024');
});
```

2. **You're combining libraries in complex ways** → Test the integration
```ts
// ✅ Test how you integrate zod validation with axios
it('should validate response schema before returning data', async () => {
  const client = new TypedApiClient(UserSchema);
  await expect(client.fetchUser('invalid'))
    .rejects.toThrow('Invalid response schema');
});
```

3. **You suspect the library has a bug** → Fix/report the bug upstream, don't test around it
```ts
// ❌ Don't test library bugs in your test suite
it('should work around lodash bug in version X.Y.Z', () => {
  // This belongs in the library's test suite, not yours
});
```

### The "Trust Boundary" Principle

Libraries you depend on form a **trust boundary**:
- **Inside the boundary (your code):** Test thoroughly
- **Outside the boundary (libraries):** Trust, don't test
- **At the boundary (integration points):** Test that your code uses libraries correctly

```
┌─────────────────────────────────────┐
│  Your Application (test this)       │
│  ┌────────────────────────────────┐ │
│  │ Business Logic                 │ │ ← Test
│  │ Error Handling                 │ │ ← Test
│  │ Data Transformations           │ │ ← Test
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ Library Integration Layer      │ │ ← Test (how you use libraries)
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Libraries (don't test)              │
│  ├─ React, lodash, axios, zod       │ ← Don't test
│  ├─ Array.map, Promise, fetch       │ ← Don't test
│  └─ TypeScript standard library     │ ← Don't test
└─────────────────────────────────────┘
```

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
