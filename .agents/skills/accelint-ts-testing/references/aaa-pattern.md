# 1.2 AAA Pattern

Structure tests as **Arrange**, **Act**, **Assert** for maximum clarity and readability.

## What is AAA?

- **Arrange**: Set up the test data, dependencies, and preconditions
- **Act**: Execute the code under test
- **Assert**: Verify the expected outcome

This pattern makes tests instantly understandable by separating setup, execution, and verification.

## Basic AAA Structure

**❌ Incorrect: mixed arrange/act/assert**
```ts
it('should return the default value for an unknown property', () => {
  const defaultColor: Color = [128, 128, 128, 155];
  const colorLookup = lookup(colorTable, defaultVal(defaultColor));
  const actual = colorLookup('UNKNOWN');
  expect(actual).toEqual(defaultColor);

  // Another test mixed in!
  const result2 = colorLookup('ANOTHER');
  expect(result2).toEqual(defaultColor);
});
```

**✅ Correct: clear AAA structure with comments**
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
*Why?* Without clear separation and with multiple behaviors tested together, it's hard to understand what's being tested and why a test fails.

## Blank Lines for Separation

Use blank lines between AAA sections even without comments for simple tests.

**❌ Incorrect: no visual separation**
```ts
it('should calculate total price with tax', () => {
  const cart = new ShoppingCart();
  cart.addItem({ name: 'Widget', price: 100 });
  const total = cart.calculateTotal(0.08);
  expect(total).toEqual(108);
});
```

**✅ Correct: visual separation with blank lines**
```ts
it('should calculate total price with tax', () => {
  const cart = new ShoppingCart();
  cart.addItem({ name: 'Widget', price: 100 });

  const total = cart.calculateTotal(0.08);

  expect(total).toEqual(108);
});
```
*Why?* Without visual separation, it's harder to quickly identify where setup ends and the actual test logic begins.

## Multiple Assertions for Same Behavior

Multiple assertions are OK when they verify different aspects of the **same behavior**.

**❌ Incorrect: testing multiple unrelated behaviors**
```ts
it('should handle user operations', () => {
  // Testing creation
  const user = createUser({ email: 'test@example.com' });
  expect(user.email).toEqual('test@example.com');

  // Testing update (different behavior!)
  updateUser(user.id, { name: 'Updated' });
  expect(user.name).toEqual('Updated');

  // Testing deletion (different behavior!)
  deleteUser(user.id);
  expect(getUser(user.id)).toBeNull();
});
```

**✅ Correct: multiple assertions for one behavior**
```ts
it('should create user with all required fields', () => {
  // Arrange
  const userData = { email: 'test@example.com', name: 'Test User' };

  // Act
  const user = createUser(userData);

  // Assert
  expect(user.email).toEqual('test@example.com');
  expect(user.name).toEqual('Test User');
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeInstanceOf(Date);
});
```
*Why?* Each test should verify one behavior. Split this into three separate tests: creation, update, and deletion.

## Avoid Logic in Tests

Keep the AAA sections simple - avoid conditional logic, loops, or complex calculations.

**❌ Incorrect: complex logic in test**
```ts
it('should filter active users', () => {
  const users = generateUsers(100); // Hidden complexity
  const userService = new UserService(users);
  const activeUsers = userService.getActiveUsers();

  // Complex verification logic
  let count = 0;
  for (const user of users) {
    if (user.active) {
      expect(activeUsers).toContain(user);
      count++;
    }
  }
  expect(activeUsers).toHaveLength(count);
});
```

**✅ Correct: straightforward test logic**
```ts
it('should filter active users', () => {
  // Arrange
  const users = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true },
  ];
  const userService = new UserService(users);

  // Act
  const activeUsers = userService.getActiveUsers();

  // Assert
  expect(activeUsers).toHaveLength(2);
  expect(activeUsers[0].name).toEqual('Alice');
  expect(activeUsers[1].name).toEqual('Charlie');
});
```
*Why?* If the test has bugs, you won't know if the test or the code is wrong. Keep tests simple and obvious.

## Complex Arrange Sections

For complex setup, extract to helper functions or factories.

**❌ Incorrect: complex setup in test**
```ts
it('should apply discount to orders over $50', () => {
  // Arrange - too much going on!
  const order = new Order();
  const items = [];
  for (let i = 0; i < 10; i++) {
    const item = {
      id: i,
      name: `Item ${i}`,
      price: 10 * i,
      category: i % 2 === 0 ? 'even' : 'odd',
      taxable: i > 5,
    };
    items.push(item);
    order.addItem(item);
  }
  const discountService = new DiscountService();

  // Act
  const discountedTotal = discountService.applyDiscount(order);

  // Assert
  expect(discountedTotal).toBeLessThan(order.total);
});
```

**✅ Correct: extracted setup helper**
```ts
function createTestOrder(items: number = 3): Order {
  const order = new Order();
  for (let i = 0; i < items; i++) {
    order.addItem({ id: i, name: `Item ${i}`, price: 10 * i });
  }
  return order;
}

it('should apply discount to orders over $50', () => {
  // Arrange
  const order = createTestOrder(10);
  const discountService = new DiscountService();

  // Act
  const discountedTotal = discountService.applyDiscount(order);

  // Assert
  expect(discountedTotal).toBeLessThan(order.total);
  expect(discountService.discountApplied).toEqual(0.1);
});
```
*Why?* Complex setup obscures the test's purpose. Extract to helper functions or test-utils.

## Extracting Duplicated Setup Code

When the same setup code appears in multiple tests, extract it into a generic setup function.

**❌ Incorrect: duplicated setup across tests**
```ts
describe('callNextSecond', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute callback at next clock second', () => {
    // Arrange
    const callback = vi.fn();
    const now = 1234567890;
    const SECOND = 1000;
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND);

    // Act
    callNextSecond(callback);

    // Assert
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(expectedDelay);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should set timeout with correct delay', () => {
    // Arrange
    const callback = vi.fn();
    const now = 1500; // 1500 % 1000 = 500
    const SECOND = 1000;
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND); // 500

    // Act
    callNextSecond(callback);

    // Assert
    vi.advanceTimersByTime(expectedDelay - 1);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

**✅ Correct: extracted generic setup function**
```ts
describe('callNextSecond', () => {
  const SECOND = 1000;

  /**
   * Sets up test environment for timer tests
   * @returns Test fixtures with callback, expected delay, and utility to advance timers
   */
  function setupTimerTest(now: number) {
    const callback = vi.fn();
    vi.setSystemTime(now);
    const expectedDelay = SECOND - (now % SECOND);

    return {
      callback,
      expectedDelay,
      advanceToNextSecond: () => vi.advanceTimersByTime(expectedDelay),
    };
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute callback at next clock second', () => {
    // Arrange
    const { callback, advanceToNextSecond } = setupTimerTest(1234567890);

    // Act
    callNextSecond(callback);

    // Assert
    expect(callback).not.toHaveBeenCalled();
    advanceToNextSecond();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should set timeout with correct delay', () => {
    // Arrange
    const { callback, expectedDelay } = setupTimerTest(1500);

    // Act
    callNextSecond(callback);

    // Assert
    vi.advanceTimersByTime(expectedDelay - 1);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```
*Why?* Duplicated setup code makes tests harder to maintain and increases the chance of inconsistencies. Extract common setup into a function that returns test fixtures. This also allows you to add useful utilities (like `advanceToNextSecond()`) that make tests more readable.

## Async/Await with AAA

AAA works perfectly with async tests - just add await in the Act section.

**❌ Incorrect: mixing setup with async calls**
```ts
it('should fetch user from API', async () => {
  const userId = 'user-123';
  const apiClient = new ApiClient();
  const user = await apiClient.getUser(userId); // Act hidden in middle
  const profile = await apiClient.getProfile(userId); // More acts!
  expect(user.id).toEqual(userId);
  expect(profile.userId).toEqual(userId);
});
```

**✅ Correct: async AAA pattern**
```ts
it('should fetch user from API', async () => {
  // Arrange
  const userId = 'user-123';
  const apiClient = new ApiClient();

  // Act
  const user = await apiClient.getUser(userId);

  // Assert
  expect(user.id).toEqual(userId);
  expect(user.name).toBeDefined();
});
```
*Why?* Multiple async operations without clear separation make it unclear what's being tested.

## When to Omit AAA Comments

For simple tests (≤10 lines with obvious structure), AAA comments add noise without value. Use blank lines for separation instead.

**✅ Correct: simple test without AAA comments**
```ts
it('should add two numbers', () => {
  const calculator = new Calculator();

  const result = calculator.add(2, 3);

  expect(result).toEqual(5);
});
```

**Guidelines for AAA comments:**
- **Omit** for simple tests: single setup line, single action, single assertion
- **Include** for complex tests: multiple setup steps, complex assertions, or when AAA boundaries are unclear
- **Always use blank lines** between sections regardless of whether comments are present

**✅ More examples of simple tests without AAA comments:**
```ts
it('should return empty array for no items', () => {
  const cart = new ShoppingCart();

  const items = cart.getItems();

  expect(items).toEqual([]);
});

it('should concatenate strings', () => {
  const result = concat('hello', 'world');

  expect(result).toEqual('helloworld');
});
```

**When the test structure is obvious from blank lines alone, omit the comments.** Comments should clarify, not state the obvious.
