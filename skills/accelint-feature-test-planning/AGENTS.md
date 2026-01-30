# Feature Test Planning

> **Note:**
> This document is mainly for agents and LLMs to follow when creating testing strategies for feature implementations. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

This guide provides detailed test planning patterns and validation strategies. Each rule includes one-line summaries with links to detailed examples in the `references/` folder.

**Token efficiency principle:** This guide maximizes knowledge delta by providing only expert-level testing insights Claude doesn't already know. All rules assume Claude understands standard testing concepts (unit vs integration, mocking, assertions). Focus is on non-obvious decisions, edge case patterns, and validation strategies.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant guidance
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Quick Reference

- [1.1 Test Framework Detection](#11-test-framework-detection) - Identify project test framework and conventions
- [1.2 Test File Organization](#12-test-file-organization) - Structure test files matching project patterns
- [1.3 Edge Case Categories](#13-edge-case-categories) - Systematic edge case identification
- [1.4 Validation Level Definitions](#14-validation-level-definitions) - Five-level validation pyramid
- [2.1 Unit Test Patterns](#21-unit-test-patterns) - Arrange-Act-Assert and fixture patterns
- [2.2 Integration Test Strategies](#22-integration-test-strategies) - API, UI, and system integration testing
- [2.3 Coverage Requirements](#23-coverage-requirements) - Extract and document coverage thresholds

---

## 1. Test Planning Fundamentals

### 1.1 Test Framework Detection

Identify test framework from project configuration files before creating test strategy. Different frameworks have different conventions (describe/it vs test(), different assertion libraries, different fixture patterns).

**Detection commands:**
```bash
# Check package.json for test dependencies and scripts
cat package.json | jq '.devDependencies | keys[] | select(contains("test") or contains("jest") or contains("vitest"))'
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("test"))'

# Find test configuration files
fd "vitest.config|jest.config|pytest.ini|Cargo.toml"

# Sample existing test files for patterns
bat tests/**/*.test.* | head -50
```

**Common frameworks by language:**
- **TypeScript/JavaScript**: Jest, Vitest, Mocha, Jasmine
- **Python**: pytest, unittest
- **Rust**: cargo test (built-in)
- **C**: Unity, CUnit, Check

### 1.2 Test File Organization

Test file structure varies by project. Must detect and follow existing conventions.

**Common patterns:**

❌ **Incorrect: Assuming pattern without checking**
```
Creating tests/myFeature.spec.ts when project uses src/**/__tests__/*.test.ts
```

✅ **Correct: Detect and follow project pattern**
```bash
# Find existing test files to understand structure
fd "test\.(ts|js|py|rs)$" | head -10
# Output shows: src/components/__tests__/Button.test.tsx
# Therefore: Use src/features/auth/__tests__/validator.test.ts
```

**Detection strategy:**
1. Search for existing test files: `fd "test\.(ts|js|py|rs)$"`
2. Analyze directory structure (co-located vs separate tests/)
3. Check naming convention (*.test.*, *.spec.*, *_test.*)
4. Follow discovered pattern for new test files

### 1.3 Edge Case Categories

Systematic approach to identifying edge cases. Most bugs occur at boundaries and error conditions.

**Standard edge case categories:**

1. **Input Validation**
   - Null/undefined values
   - Empty strings/arrays/objects
   - Invalid type (string when number expected)
   - Out-of-range values

2. **Boundary Conditions**
   - Zero, negative numbers
   - MIN_VALUE, MAX_VALUE
   - Empty collections, single-element collections
   - Exactly at limit vs one over/under

3. **Error Scenarios**
   - Network failures (timeout, 404, 500)
   - Permission denied
   - Resource exhausted (disk full, memory)
   - Invalid state transitions

4. **Concurrency** (if applicable)
   - Race conditions
   - Deadlocks
   - Multiple simultaneous access
   - Resource contention

5. **Performance/Resource Limits** (for systems languages)
   - Large inputs (memory exhaustion)
   - Infinite loops
   - File handle leaks
   - Stack overflow

**Example documentation:**
```markdown
### Edge Cases

- **Null input**: `validator(null)` - Should throw ValidationError with message "Input cannot be null"
- **Empty email**: `validator('')` - Should return `{ valid: false, error: 'Email required' }`
- **Boundary: MAX_LENGTH**: `validator('a'.repeat(256))` - Should reject emails over 254 chars per RFC 5321
- **Network timeout**: API call exceeds 5s - Should return `{ error: 'timeout' }` and not hang
```

### 1.4 Validation Level Definitions

Five-level validation pyramid ensures comprehensive quality checks. Execute from Level 1 to Level 5, stopping at first failure.

**Level 1: Syntax & Style**
- Fast feedback (<10 seconds)
- Catches typos, formatting issues, import errors
- Commands: lint, format check, basic syntax validation
- Example: `pnpm lint`, `pnpm format:check`

**Level 2: Type Checking & Build**
- Validates type correctness and successful compilation
- Catches type errors, missing imports, build configuration issues
- Commands: typecheck, build
- Example: `pnpm typecheck`, `pnpm build`

**Level 3: Unit Tests**
- Validates component behavior in isolation
- Catches logic errors, edge case failures
- Commands: test, test with coverage
- Example: `pnpm test`, `pnpm test:coverage`

**Level 4: Manual Validation**
- Human verification of UI, UX, visual correctness
- Catches issues automation cannot detect (aesthetics, usability)
- Procedure: Start dev server, perform specific user actions, verify visually

**Level 5: Additional Validation** (Optional)
- Project-specific checks: bundle size, performance benchmarks, accessibility
- Commands: bundle analysis, performance tests, lighthouse
- Example: `pnpm analyze`, `pnpm benchmark`

**Validation command extraction:**
```bash
# Find all validation commands in package.json
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("lint") or contains("format") or contains("test") or contains("build") or contains("typecheck"))'
```

---

## 2. Test Pattern Implementation

### 2.1 Unit Test Patterns

Unit tests should follow Arrange-Act-Assert (AAA) pattern and match existing project conventions.

**Standard AAA structure:**

✅ **Correct: Clear AAA sections**
```typescript
describe('EmailValidator', () => {
  it('should validate correct email format', () => {
    // Arrange
    const validator = new EmailValidator()
    const validEmail = 'user@example.com'

    // Act
    const result = validator.validate(validEmail)

    // Assert
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject invalid email format', () => {
    // Arrange
    const validator = new EmailValidator()
    const invalidEmail = 'not-an-email'

    // Act
    const result = validator.validate(invalidEmail)

    // Assert
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Invalid email format')
  })
})
```

❌ **Incorrect: Mixed concerns, unclear structure**
```typescript
it('email validation', () => {
  const v = new EmailValidator()
  expect(v.validate('user@example.com').valid).toBe(true)
  expect(v.validate('bad').valid).toBe(false)
  // Multiple unrelated assertions in one test
})
```

**Fixture patterns:**
When multiple tests need same setup, extract to fixtures or beforeEach:

```typescript
describe('AuthService', () => {
  let authService: AuthService
  let mockDatabase: MockDatabase

  beforeEach(() => {
    // Arrange: Common setup
    mockDatabase = new MockDatabase()
    authService = new AuthService(mockDatabase)
  })

  it('should authenticate valid user', async () => {
    // Arrange: Test-specific data
    mockDatabase.addUser({ email: 'user@example.com', password: 'hash' })

    // Act
    const result = await authService.login('user@example.com', 'password')

    // Assert
    expect(result.success).toBe(true)
  })
})
```

### 2.2 Integration Test Strategies

Integration tests validate feature interaction with external systems (APIs, databases, UI components).

**API Integration Testing:**
```typescript
describe('User API Integration', () => {
  it('should create user via POST /users', async () => {
    // Arrange
    const userData = { email: 'test@example.com', name: 'Test User' }

    // Act
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    const result = await response.json()

    // Assert
    expect(response.status).toBe(201)
    expect(result.id).toBeDefined()
    expect(result.email).toBe(userData.email)
  })
})
```

**UI Component Integration (Playwright/Cypress):**
```typescript
test('user can complete signup flow', async ({ page }) => {
  // Arrange
  await page.goto('/signup')

  // Act
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'SecurePass123')
  await page.click('button[type="submit"]')

  // Assert
  await expect(page.locator('.success-message')).toBeVisible()
  await expect(page).toHaveURL('/dashboard')
})
```

**Database Integration:**
```typescript
describe('User Repository', () => {
  it('should persist user to database', async () => {
    // Arrange
    const user = { email: 'user@example.com', name: 'User' }
    const repo = new UserRepository(testDatabase)

    // Act
    const savedUser = await repo.save(user)

    // Assert
    const retrieved = await repo.findById(savedUser.id)
    expect(retrieved).toEqual(savedUser)
  })
})
```

### 2.3 Coverage Requirements

Extract coverage requirements from project configuration. Most projects have minimum coverage thresholds.

**Detection commands:**
```bash
# Check for coverage configuration
cat package.json | jq '.jest.coverageThreshold // .vitest.coverage'
cat vitest.config.ts | rg "coverage|threshold"
cat .github/workflows/*.yml | rg "coverage"
```

**Common thresholds:**
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

**Document in test strategy:**
```markdown
**Coverage Requirements**: 80%+ statements, 75%+ branches (from vitest.config.ts)
```

**Validation command:**
```bash
pnpm test:coverage
# Should show coverage report and fail if below threshold
```

---

## 3. Test Strategy Documentation

### Output File Structure

Test strategy files should be saved to `.agents/testing/{feature-name}-testing.md`.

**File naming:**
- Use kebab-case matching feature name from implementation plan
- Example: `user-authentication-testing.md`, `email-validator-testing.md`

**Required sections:**
1. **TESTING STRATEGY** - Unit tests, integration tests, edge cases
2. **VALIDATION COMMANDS** - Five levels of validation
3. **Test Examples** - 2-3 concrete test code examples

**Section order matters:**
1. Context (what's being tested)
2. Strategy (how to test)
3. Commands (how to validate)
4. Examples (concrete implementations)

---

## 4. Common Patterns by Language

### TypeScript/JavaScript (Jest/Vitest)

**Typical test structure:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { FeatureUnderTest } from './feature'

describe('FeatureUnderTest', () => {
  it('should handle expected behavior', () => {
    // AAA pattern
  })
})
```

**Validation commands:**
```bash
pnpm test
pnpm test:coverage
pnpm test -- src/feature.test.ts  # Run specific file
```

### Python (pytest)

**Typical test structure:**
```python
import pytest
from module import function_under_test

def test_expected_behavior():
    # Arrange
    input_data = "test"

    # Act
    result = function_under_test(input_data)

    # Assert
    assert result == "expected"
```

**Validation commands:**
```bash
pytest
pytest --cov=src --cov-report=html
pytest tests/test_feature.py  # Run specific file
```

### Rust (cargo test)

**Typical test structure:**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_expected_behavior() {
        // Arrange
        let input = "test";

        // Act
        let result = function_under_test(input);

        // Assert
        assert_eq!(result, "expected");
    }
}
```

**Validation commands:**
```bash
cargo test
cargo test --coverage
cargo test test_feature  # Run specific test
```

---

## Important Reminders

- Always detect test framework before creating test strategy
- Extract exact validation commands from package.json - don't invent them
- Edge cases are critical - document them explicitly
- Test examples must be concrete, not pseudocode
- Follow existing project test patterns exactly
- Coverage requirements come from project configuration, not assumptions
