# Testing Template

Use for: Test writing, test strategy, QA planning, coverage improvement.

## Structure

```
Write [TEST_TYPE] tests for [COMPONENT/FEATURE]

Test framework: [Jest/pytest/RSpec/etc]
Coverage target: [Percentage OR specific scenarios]

Test scope:
- What to test: [Component/feature boundaries]
- What NOT to test: [External dependencies, framework code]

Critical test cases (priority order):
1. [Scenario]: [Expected behavior]
2. [Scenario]: [Expected behavior]
3. [Scenario]: [Expected behavior]

Edge cases to cover:
- [Edge case 1]: [How to test]
- [Edge case 2]: [How to test]
- [Edge case 3]: [How to test]

Mocking strategy:
- Mock [external dependencies]: [Database, APIs, file system]
- Use real [internal dependencies]: [Utils, helpers]
- Rationale: [Why this mocking strategy]

Test organization:
- File location: [Where tests live]
- Naming convention: [Pattern to follow]
- Setup/teardown: [Test fixtures, database seeding]
- Test grouping: [Describe blocks, categories]

Success criteria:
✓ All critical scenarios covered
✓ Edge cases tested
✓ [Coverage target] achieved
✓ Tests are deterministic (no flakiness)
✓ Tests run in [acceptable time]
```

## Example Usage

```
Write unit and integration tests for the user authentication API endpoint.

Test framework: Jest with Supertest for API testing
Coverage target: 90%+ lines, 100% branches for auth logic

Test scope:
- What to test:
  - POST /auth/login endpoint
  - Authentication middleware logic
  - Token generation and validation
  - Error handling paths
- What NOT to test:
  - JWT library internals (third-party)
  - Express framework behavior (framework)
  - Database driver (external)

Critical test cases (priority order):
1. Valid credentials → Returns 200 with JWT token
2. Invalid password → Returns 401 with error message
3. Non-existent email → Returns 401 with generic error (no enumeration)
4. Missing fields → Returns 400 with validation errors
5. Expired token → Returns 401 when accessing protected route
6. Valid token → Populates req.user and allows access

Edge cases to cover:
- SQL injection attempt in email field → Safely handled, no execution
- Very long password (10k chars) → Rejects or handles gracefully
- Concurrent login requests for same user → Both succeed independently
- Token with manipulated payload → Rejected due to signature mismatch
- Token from different environment → Rejected due to different secret
- Whitespace in email/password → Trimmed and handled correctly

Mocking strategy:
- Mock database: Use in-memory SQLite or mock queries
  - Rationale: Tests should be fast and not depend on external database
  - Trade-off: Some DB-specific behavior not tested (use integration tests)
- Mock password hashing: Use bcrypt with low cost factor (faster tests)
  - Rationale: Real bcrypt too slow (100ms per hash), slows test suite
- Use real JWT: Don't mock JWT library
  - Rationale: Token generation/validation is core logic to test

Test organization:
- Unit tests: tests/unit/auth.test.ts
- Integration tests: tests/integration/auth-api.test.ts
- Naming: describe('POST /auth/login', () => it('returns 200 for valid credentials'))
- Setup: beforeEach seeds test users, afterEach cleans database
- Grouping: describe blocks by endpoint, nested by scenario type

TEST SUITE STRUCTURE:

Unit tests (tests/unit/auth.test.ts):

```javascript
describe('validateCredentials', () => {
  it('returns user for valid credentials', async () => {
    const user = await validateCredentials('test@example.com', 'correctPassword');
    expect(user).toMatchObject({ id: 1, email: 'test@example.com' });
  });

  it('returns null for invalid password', async () => {
    const user = await validateCredentials('test@example.com', 'wrongPassword');
    expect(user).toBeNull();
  });

  it('returns null for non-existent email', async () => {
    const user = await validateCredentials('nonexistent@example.com', 'anyPassword');
    expect(user).toBeNull();
  });
});

describe('generateToken', () => {
  it('creates JWT with user ID and expiration', () => {
    const token = generateToken({ id: 1 });
    const decoded = jwt.verify(token, SECRET);
    expect(decoded).toMatchObject({ userId: 1 });
    expect(decoded.exp).toBeDefined();
  });
});

describe('validateToken', () => {
  it('returns decoded payload for valid token', () => {
    const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: '1h' });
    const result = validateToken(token);
    expect(result.valid).toBe(true);
    expect(result.decoded.userId).toBe(1);
  });

  it('returns invalid for expired token', () => {
    const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: '-1h' });
    const result = validateToken(token);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('TOKEN_EXPIRED');
  });

  it('returns invalid for token with manipulated payload', () => {
    const token = jwt.sign({ userId: 1 }, 'wrong-secret');
    const result = validateToken(token);
    expect(result.valid).toBe(false);
  });
});
```

Integration tests (tests/integration/auth-api.test.ts):

```javascript
describe('POST /auth/login', () => {
  beforeEach(async () => {
    await seedTestUser({ email: 'test@example.com', password: 'SecurePass123!' });
  });

  describe('success cases', () => {
    it('returns 200 and JWT for valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'SecurePass123!' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(jwt.verify(response.body.token, SECRET)).toBeDefined();
    });

    it('allows accessing protected route with returned token', async () => {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'SecurePass123!' });

      const profileRes = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.email).toBe('test@example.com');
    });
  });

  describe('error cases', () => {
    it('returns 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'WrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('returns 401 with generic message for non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'AnyPassword' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password'); // Same message, no enumeration
    });

    it('returns 400 for missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'SecurePass123!' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });
  });

  describe('edge cases', () => {
    it('safely handles SQL injection attempt', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: "admin'--", password: 'anything' });

      expect(response.status).toBe(401); // Not 500, no error thrown
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('handles very long password gracefully', async () => {
      const longPassword = 'a'.repeat(10000);
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: longPassword });

      expect(response.status).toBe(401); // Completes without timeout
    });

    it('trims whitespace from email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: '  test@example.com  ', password: 'SecurePass123!' });

      expect(response.status).toBe(200); // Whitespace trimmed, login succeeds
    });
  });

  describe('security', () => {
    it('rejects token with manipulated user ID', async () => {
      const maliciousToken = jwt.sign({ userId: 999 }, 'wrong-secret');

      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${maliciousToken}`);

      expect(response.status).toBe(401);
    });

    it('rejects expired token', async () => {
      const expiredToken = jwt.sign({ userId: 1 }, SECRET, { expiresIn: '-1h' });

      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });
  });
});
```

Success criteria:
✓ All critical scenarios pass (valid/invalid credentials, missing fields)
✓ Edge cases handled (SQL injection, long inputs, whitespace)
✓ Security cases verified (token manipulation, expiration)
✓ 90%+ line coverage (verify with `npm run test:coverage`)
✓ 100% branch coverage for auth logic
✓ All tests pass consistently (no flakiness)
✓ Test suite completes in <10 seconds
```

## Common Pitfalls

- **Testing implementation details:** Test behavior, not internal structure
- **Flaky tests:** Time-dependent, race conditions, shared state → Make deterministic
- **Over-mocking:** Mocking everything → Tests don't catch integration issues
- **No edge cases:** Only happy path → Production bugs slip through
