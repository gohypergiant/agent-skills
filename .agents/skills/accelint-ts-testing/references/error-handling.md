# 1.4 Error Handling

Error handling is critical - test it as thoroughly as the happy path. Good error handling tests verify that your code fails gracefully and provides meaningful feedback.

## Basic Exception Testing

Use `toThrow` to verify exceptions are thrown for invalid inputs.

**✅ Correct: testing specific error messages**
```ts
describe('divide', () => {
  it('should throw TypeError for division by zero', () => {
    expect(() => divide(10, 0)).toThrow(TypeError);
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('should throw TypeError for non-numeric inputs', () => {
    expect(() => divide('10' as any, 5)).toThrow(TypeError);
    expect(() => divide('10' as any, 5)).toThrow('Arguments must be numbers');
  });
});
```

**❌ Incorrect: not testing error specifics**
```ts
it('should throw for division by zero', () => {
  expect(() => divide(10, 0)).toThrow(); // Which error? What message?
});
```
*Why?* Testing only that an error is thrown doesn't verify you're throwing the right error with the right message.

## Testing Error Types

Always verify the error type and message, not just that an error was thrown.

**✅ Correct: specific error type and message**
```ts
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

describe('validateUser', () => {
  it('should throw ValidationError for missing email', () => {
    const invalidUser = { name: 'John' };

    expect(() => validateUser(invalidUser)).toThrow(ValidationError);
    expect(() => validateUser(invalidUser)).toThrow('Email is required');
  });

  it('should throw ValidationError for invalid email format', () => {
    const invalidUser = { name: 'John', email: 'not-an-email' };

    expect(() => validateUser(invalidUser)).toThrow(ValidationError);
    expect(() => validateUser(invalidUser)).toThrow('Invalid email format');
  });
});
```

**❌ Incorrect: generic error testing**
```ts
it('should throw error for invalid user', () => {
  expect(() => validateUser({ name: 'John' })).toThrow(Error);
});
```
*Why?* Any error will pass this test, including unexpected errors from bugs in your code.

## Async Error Testing

Use `rejects` matchers for async functions that throw.

**✅ Correct: async error testing**
```ts
describe('fetchUser', () => {
  it('should reject with error for non-existent user', async () => {
    await expect(fetchUser('invalid-id')).rejects.toThrow('User not found');
  });

  it('should reject with NotFoundError', async () => {
    await expect(fetchUser('invalid-id')).rejects.toThrow(NotFoundError);
  });
});
```

**❌ Incorrect: improper async error testing**
```ts
it('should throw for non-existent user', async () => {
  try {
    await fetchUser('invalid-id');
    // Missing fail() here - test will pass if no error!
  } catch (error) {
    expect(error.message).toEqual('User not found');
  }
});
```
*Why?* If the function doesn't throw, the test will pass incorrectly. Use `rejects` matcher instead.

## Negative Testing

Test boundary conditions and invalid inputs comprehensively.

**✅ Correct: comprehensive negative testing**
```ts
describe('calculateAge', () => {
  it.each([
    { birthdate: 'not-a-date', error: 'Invalid date format' },
    { birthdate: new Date('2099-01-01'), error: 'Birth date cannot be in the future' },
    { birthdate: null, error: 'Birth date is required' },
    { birthdate: undefined, error: 'Birth date is required' },
  ])('should throw for invalid birthdate: $birthdate',
    ({ birthdate, error }) => {
      expect(() => calculateAge(birthdate as any)).toThrow(error);
    }
  );

  it('should calculate age for valid birthdate', () => {
    const birthdate = new Date('1990-01-01');
    const age = calculateAge(birthdate);
    expect(age).toBeGreaterThan(0);
  });
});
```

## Fault Injection

Simulate system failures to test error handling and resilience.

**✅ Correct: simulating network failures**
```ts
describe('DataService', () => {
  it('should retry on network failure', async () => {
    const apiClient = {
      fetch: vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: 'success' }),
    };

    const service = new DataService(apiClient);
    const result = await service.fetchWithRetry('/api/data');

    expect(result).toEqual({ data: 'success' });
    expect(apiClient.fetch).toHaveBeenCalledTimes(3);
  });

  it('should fail after max retries', async () => {
    const apiClient = {
      fetch: vi.fn().mockRejectedValue(new Error('Network error')),
    };

    const service = new DataService(apiClient);

    await expect(service.fetchWithRetry('/api/data'))
      .rejects.toThrow('Max retries exceeded');
    expect(apiClient.fetch).toHaveBeenCalledTimes(3);
  });
});
```

**✅ Correct: simulating database errors**
```ts
describe('UserRepository', () => {
  it('should handle database connection errors', async () => {
    const db = {
      query: vi.fn().mockRejectedValue(new Error('Connection lost')),
    };

    const repo = new UserRepository(db);

    await expect(repo.findById('user-123'))
      .rejects.toThrow('Database error: Connection lost');
  });

  it('should handle query timeouts', async () => {
    const db = {
      query: vi.fn().mockRejectedValue(new Error('Query timeout')),
    };

    const repo = new UserRepository(db);

    await expect(repo.findById('user-123'))
      .rejects.toThrow('Query timeout');
  });
});
```

## Recovery Testing

Verify that systems can recover from failures and return to normal operation.

**✅ Correct: testing circuit breaker recovery**
```ts
describe('CircuitBreaker', () => {
  it('should open circuit after threshold failures', async () => {
    const failingService = vi.fn().mockRejectedValue(new Error('Service down'));
    const breaker = new CircuitBreaker(failingService, { threshold: 3 });

    // Trigger failures to open circuit
    for (let i = 0; i < 3; i++) {
      await expect(breaker.call()).rejects.toThrow('Service down');
    }

    // Circuit should now be open
    await expect(breaker.call()).rejects.toThrow('Circuit breaker is open');
    expect(failingService).toHaveBeenCalledTimes(3); // No more calls
  });

  it('should close circuit after recovery period', async () => {
    vi.useFakeTimers();

    const service = vi.fn()
      .mockRejectedValueOnce(new Error('Service down'))
      .mockResolvedValue('success');

    const breaker = new CircuitBreaker(service, {
      threshold: 1,
      resetTimeout: 5000,
    });

    // Open circuit
    await expect(breaker.call()).rejects.toThrow('Service down');
    await expect(breaker.call()).rejects.toThrow('Circuit breaker is open');

    // Wait for reset timeout
    vi.advanceTimersByTime(5000);

    // Circuit should allow retry
    const result = await breaker.call();
    expect(result).toEqual('success');

    vi.useRealTimers();
  });
});
```

## Error Guessing

Anticipate edge cases based on domain knowledge.

**✅ Correct: testing common edge cases**
```ts
describe('parseJSON', () => {
  it.each([
    { input: '', description: 'empty string' },
    { input: 'null', description: 'null value' },
    { input: 'undefined', description: 'undefined as string' },
    { input: '{broken json', description: 'malformed JSON' },
    { input: '{"key": undefined}', description: 'undefined in object' },
    { input: 'NaN', description: 'NaN value' },
    { input: '{\"key\": Infinity}', description: 'Infinity value' },
  ])('should handle $description gracefully', ({ input }) => {
    expect(() => parseJSON(input)).toThrow(SyntaxError);
  });
});

describe('processFile', () => {
  it.each([
    { filename: '', error: 'Filename cannot be empty' },
    { filename: '../../../etc/passwd', error: 'Invalid filename' },
    { filename: 'file\x00name', error: 'Invalid characters' },
    { filename: '.'.repeat(300), error: 'Filename too long' },
  ])('should reject dangerous filename: "$filename"',
    ({ filename, error }) => {
      expect(() => processFile(filename)).toThrow(error);
    }
  );
});
```

## Testing Error Boundaries (React)

For React components, test error boundaries handle errors gracefully.

**✅ Correct: testing error boundary**
```ts
describe('ErrorBoundary', () => {
  it('should catch errors and display fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { getByText } = render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Error occurred')).toBeInTheDocument();
  });

  it('should log error to error reporting service', () => {
    const errorLogger = vi.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary onError={errorLogger}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(errorLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error',
      })
    );
  });
});
```

## Validation Errors

Test comprehensive input validation.

**✅ Correct: thorough validation testing**
```ts
describe('createOrder', () => {
  it('should validate all required fields', () => {
    const invalidOrders = [
      { error: 'Customer ID is required' },
      { customerId: 'c1', error: 'Items array cannot be empty' },
      { customerId: 'c1', items: [], error: 'Items array cannot be empty' },
      { customerId: '', items: [{ id: 1 }], error: 'Customer ID is required' },
    ];

    invalidOrders.forEach(({ error, ...order }) => {
      expect(() => createOrder(order as any)).toThrow(error);
    });
  });

  it('should validate item quantities', () => {
    const order = {
      customerId: 'c1',
      items: [{ id: 1, quantity: -1 }],
    };

    expect(() => createOrder(order)).toThrow('Quantity must be positive');
  });

  it('should validate item prices', () => {
    const order = {
      customerId: 'c1',
      items: [{ id: 1, quantity: 1, price: -10 }],
    };

    expect(() => createOrder(order)).toThrow('Price cannot be negative');
  });
});
```

## Error Messages Quality

Test that error messages are helpful and actionable.

**✅ Correct: descriptive error messages**
```ts
describe('processPayment', () => {
  it('should provide helpful error for insufficient funds', async () => {
    const payment = { amount: 1000, accountBalance: 100 };

    await expect(processPayment(payment))
      .rejects.toThrow('Insufficient funds: balance $100, required $1000');
  });

  it('should include transaction ID in error messages', async () => {
    const payment = { amount: 1000, transactionId: 'txn-123' };

    await expect(processPayment(payment))
      .rejects.toThrow(expect.stringContaining('txn-123'));
  });
});
```

**❌ Incorrect: vague error messages**
```ts
it('should throw error for invalid payment', async () => {
  await expect(processPayment(payment)).rejects.toThrow('Error'); // Not helpful!
});
```

## Testing Runtime Validation (Beyond TypeScript Types)

**Critical concept:** TypeScript types are compile-time only and provide zero runtime protection. At runtime, functions can receive any value regardless of type annotations.

### Why Type-Invalid Tests Matter

TypeScript types vanish during compilation. Your typed function can receive:
- `null` or `undefined` despite non-nullable types
- Wrong types from `JSON.parse()` results
- Malformed data from external APIs
- Invalid objects from untyped libraries
- User input that bypasses type checking
- Database records with missing fields

**❌ Incorrect: only testing type-valid inputs**
```ts
// Function signature
function processUser(user: User): string {
  return `${user.name} <${user.email}>`;
}

// Only testing type-valid inputs
describe('processUser', () => {
  it('should format user with name and email', () => {
    const user = { name: 'Alice', email: 'alice@example.com' };
    expect(processUser(user)).toEqual('Alice <alice@example.com>');
  });
});
```

*Why incorrect?* This test assumes TypeScript prevents invalid inputs. In production, `processUser` might receive `null`, `undefined`, or `{ name: 'Bob' }` (missing email) from:
- `JSON.parse(apiResponse)` without validation
- External library returning unexpected data
- Database query with null fields

**✅ Correct: testing defensive runtime validation**
```ts
describe('processUser', () => {
  it('should format valid user', () => {
    const user = { name: 'Alice', email: 'alice@example.com' };

    const result = processUser(user);

    expect(result).toEqual('Alice <alice@example.com>');
  });

  it('should handle null user', () => {
    expect(() => processUser(null as any))
      .toThrow('User cannot be null or undefined');
  });

  it('should handle undefined user', () => {
    expect(() => processUser(undefined as any))
      .toThrow('User cannot be null or undefined');
  });

  it('should handle missing name field', () => {
    const user = { email: 'alice@example.com' };

    expect(() => processUser(user as any))
      .toThrow('User name is required');
  });

  it('should handle missing email field', () => {
    const user = { name: 'Alice' };

    expect(() => processUser(user as any))
      .toThrow('User email is required');
  });

  it('should handle empty object', () => {
    expect(() => processUser({} as any))
      .toThrow('User name is required');
  });
});
```

*Why correct?* These tests verify the function has defensive runtime validation. The `as any` casts are intentional—they simulate real runtime scenarios where type safety is bypassed.

### Common Runtime Validation Scenarios

**✅ Correct: testing JSON API responses**
```ts
describe('parseUserResponse', () => {
  it('should parse valid response', () => {
    const json = '{"id": 1, "name": "Alice", "email": "alice@example.com"}';

    const user = parseUserResponse(json);

    expect(user).toEqual({ id: 1, name: 'Alice', email: 'alice@example.com' });
  });

  it('should reject response missing required fields', () => {
    const json = '{"id": 1, "name": "Alice"}'; // Missing email

    expect(() => parseUserResponse(json))
      .toThrow('Email is required');
  });

  it('should reject malformed JSON', () => {
    const json = '{invalid json}';

    expect(() => parseUserResponse(json))
      .toThrow('Invalid JSON');
  });

  it('should reject null response', () => {
    const json = 'null';

    expect(() => parseUserResponse(json))
      .toThrow('Response cannot be null');
  });

  it('should reject response with wrong types', () => {
    const json = '{"id": "not-a-number", "name": "Alice", "email": "alice@example.com"}';

    expect(() => parseUserResponse(json))
      .toThrow('ID must be a number');
  });
});
```

**✅ Correct: testing external library responses**
```ts
describe('processExternalData', () => {
  it('should handle library returning null', () => {
    const mockLib = { getData: () => null };

    expect(() => processExternalData(mockLib))
      .toThrow('Library returned null data');
  });

  it('should handle library returning unexpected structure', () => {
    const mockLib = { getData: () => ({ wrongField: 'value' }) };

    expect(() => processExternalData(mockLib))
      .toThrow('Invalid data structure');
  });

  it('should handle library throwing non-Error objects', () => {
    const mockLib = { getData: () => { throw 'string error'; } };

    expect(() => processExternalData(mockLib))
      .toThrow('Unexpected error type');
  });
});
```

### When to Use `as any` in Tests

Using `as any` is **intentional and correct** when testing defensive programming:

**✅ Correct use of `as any`:**
```ts
// Testing that function validates inputs at runtime
it('should reject null input', () => {
  expect(() => processData(null as any))
    .toThrow('Input cannot be null');
});

// Testing JSON parsing scenarios
it('should handle API returning wrong type', () => {
  const response = { id: 'string-instead-of-number' };
  expect(() => validate(response as any))
    .toThrow('ID must be number');
});
```

**❌ Incorrect use of `as any`:**
```ts
// Bypassing types to make broken code compile
it('should process user', () => {
  const user = { name: 'Alice' } as any; // Missing required email
  const result = processUser(user); // Should fail in test, not production
  expect(result).toBeDefined();
});
```

### Validation Testing Patterns

**✅ Comprehensive validation testing pattern:**
```ts
describe('createOrder', () => {
  // Test happy path with valid input
  it('should create order with valid data', () => {
    const validOrder = {
      customerId: 'c-123',
      items: [{ id: 'i-1', quantity: 2, price: 10.00 }],
    };

    const order = createOrder(validOrder);

    expect(order.total).toEqual(20.00);
  });

  // Test null/undefined inputs
  it.each([
    { input: null, expected: 'Order data cannot be null' },
    { input: undefined, expected: 'Order data cannot be undefined' },
  ])('should reject $input', ({ input, expected }) => {
    expect(() => createOrder(input as any)).toThrow(expected);
  });

  // Test missing required fields
  it.each([
    { data: {}, field: 'customerId' },
    { data: { customerId: 'c-123' }, field: 'items' },
  ])('should reject missing $field', ({ data, field }) => {
    expect(() => createOrder(data as any))
      .toThrow(`${field} is required`);
  });

  // Test wrong types
  it.each([
    { data: { customerId: 123, items: [] }, field: 'customerId', expectedType: 'string' },
    { data: { customerId: 'c-123', items: 'not-array' }, field: 'items', expectedType: 'array' },
  ])('should reject wrong type for $field', ({ data, field, expectedType }) => {
    expect(() => createOrder(data as any))
      .toThrow(`${field} must be ${expectedType}`);
  });

  // Test invalid values
  it('should reject empty items array', () => {
    const order = { customerId: 'c-123', items: [] };

    expect(() => createOrder(order))
      .toThrow('Order must contain at least one item');
  });

  it('should reject negative quantities', () => {
    const order = {
      customerId: 'c-123',
      items: [{ id: 'i-1', quantity: -1, price: 10.00 }],
    };

    expect(() => createOrder(order))
      .toThrow('Quantity must be positive');
  });
});
```

### Key Principles

1. **TypeScript types are documentation, not runtime protection** - Always validate inputs at runtime
2. **Test the validators, not the types** - Verify your validation logic catches invalid data
3. **`as any` is correct in validation tests** - It simulates real runtime scenarios
4. **Test all input sources** - JSON APIs, external libraries, databases, user input
5. **Defensive programming is testable** - These tests verify your code fails safely
