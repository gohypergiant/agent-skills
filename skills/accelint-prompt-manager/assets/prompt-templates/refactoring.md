# Refactoring Template

Use for: Code improvement, restructuring, technical debt reduction, pattern extraction.

## Structure

```
Refactor [CODE/COMPONENT] to improve [SPECIFIC_ASPECT]

Current problems:
- [Issue 1 with current code]
- [Issue 2 with current code]
- [Issue 3 with current code]

Goals:
- [Improvement 1]: measured by [metric]
- [Improvement 2]: measured by [metric]
- [Improvement 3]: measured by [metric]

Constraints:
- Preserve existing functionality (all current behavior must work)
- Maintain public API (no breaking changes for consumers)
- No breaking changes without explicit user approval
- [Other constraints: performance, compatibility]

Testing strategy:
1. Add tests for current behavior (if missing)
2. Refactor incrementally (small, verifiable changes)
3. Verify tests still pass after each change
4. Add new tests for improved structure

Refactoring approach:
1. [Step 1]: [What to change, why]
2. [Step 2]: [What to change, why]
3. [Step 3]: [What to change, why]

Success criteria:
✓ [Goal 1 metric achieved]
✓ All existing tests pass
✓ No regressions in functionality
✓ [Code quality metrics improved]: [e.g., complexity, duplication]
```

## Example Usage

```
Refactor the authentication middleware to improve testability and reduce complexity.

Current problems:
- 150-line function doing too much (auth validation + session management + logging)
- Direct database queries mixed with business logic (hard to test)
- Cyclomatic complexity of 15 (target: <10)
- Duplicate error handling across multiple branches
- No tests (too coupled to test easily)

Goals:
- Testability: Each component testable in isolation (measured by: can mock dependencies)
- Complexity: Reduce cyclomatic complexity to <10 (measured by: static analysis)
- Maintainability: Clear separation of concerns (measured by: SRP compliance)
- Test coverage: Achieve 80%+ coverage (measured by: coverage report)

Constraints:
- Preserve existing functionality (all current auth flows must work identically)
- Maintain public API (middleware signature: (req, res, next) => void unchanged)
- No breaking changes (existing routes using this middleware unaffected)
- Performance: No measurable latency increase (current: ~8ms, must stay <10ms)

Testing strategy:
1. Add integration tests for current behavior
   - Valid token → req.user populated, next() called
   - Invalid token → 401 response
   - Missing token → 401 response
   - Expired token → 401 response
2. Refactor incrementally with tests passing after each step
3. Add unit tests for extracted functions
4. Verify integration tests still pass

Refactoring approach:

Step 1: Extract validation logic
- Create validateToken(token) function
- Returns: { valid: boolean, decoded: object | null, error: string | null }
- Why: Separate validation concern, easy to unit test
- Tests: Mock JWT library, test various token scenarios

Step 2: Extract session management
- Create getSession(userId) function
- Returns: Session object or null
- Why: Database query separated from middleware, can mock in tests
- Tests: Mock database, test session retrieval

Step 3: Extract error handling
- Create sendAuthError(res, errorType) function
- Why: Centralize error response formatting, reduce duplication
- Tests: Verify correct status codes and response formats

Step 4: Simplify main middleware
- Use extracted functions
- Reduce to: validate → getSession → attach to req → next()
- Why: Main logic now clear, <20 lines, complexity <5

Step 5: Add comprehensive tests
- Unit tests for each extracted function
- Integration test for middleware with mocked dependencies
- Coverage report: Aim for 80%+

Before (complexity 15, 150 lines):
```javascript
async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    // ... 140 more lines of validation, session lookup, error handling
  } catch (error) {
    // ... complex error handling
  }
}
```

After (complexity 4, 30 lines):
```javascript
async function authMiddleware(req, res, next) {
  const token = extractToken(req);
  if (!token) return sendAuthError(res, 'MISSING_TOKEN');

  const validation = await validateToken(token);
  if (!validation.valid) return sendAuthError(res, validation.error);

  const session = await getSession(validation.decoded.userId);
  if (!session) return sendAuthError(res, 'SESSION_NOT_FOUND');

  req.user = session.user;
  next();
}
```

Success criteria:
✓ Cyclomatic complexity reduced from 15 to <10
✓ All existing auth flows work identically (verified by integration tests)
✓ 80%+ test coverage achieved
✓ Each function <30 lines
✓ No duplicate error handling code
✓ Latency remains <10ms (verified by benchmarks)
✓ No breaking changes to public API
```

## Common Pitfalls

- **Refactor without tests:** Risk breaking existing behavior
- **Big bang refactor:** Rewrite everything at once → hard to debug if something breaks
- **Unclear success:** "Make it cleaner" → Define what "cleaner" means measurably
- **Ignoring performance:** Refactor adds abstraction layers that slow things down
