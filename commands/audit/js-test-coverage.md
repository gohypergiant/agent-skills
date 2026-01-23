---
description: Audit unit test coverage for branches, positive/negative cases, edge cases, error handling, boundaries, and async paths. Also audits existing tests for compliance with vitest-best-practices template format including AAA pattern, proper assertions, test descriptions, and structure.
argument-hint: "[path] [--fix-mode=interactive|all|none] [--extensions=<exts>] [--test-pattern=<pattern>]"
skills: vitest-best-practices, js-ts-best-practices
---

# audit-js-test-coverage

Comprehensive test coverage and format auditing for JavaScript and TypeScript codebases. Performs two types of analysis:

1. **Coverage Analysis**: Analyzes source files to identify all testable code paths (branches, error handling, boundaries, async patterns) and compares against existing test coverage to detect gaps.

2. **Format Compliance Analysis**: Audits existing tests for compliance with vitest-best-practices template format, checking for AAA pattern, sentence-style descriptions, strict assertions, proper async handling, and other best practices.

Generates detailed reports with missing test scenarios and format violations, and offers interactive or automatic fixing for both coverage gaps and format issues.

## Arguments

- `path` (string, optional, default: `.`): File path, directory path, or glob pattern to audit
  - Single file: `src/core.ts`
  - Directory (recursive): `src/`
  - Glob pattern: `src/**/*.ts`
  - Current directory: `.` or omit argument

- `--fix-mode` (string, optional, default: `interactive`): Controls how missing tests are handled
  - `interactive`: For each gap, prompt user to generate test, skip, generate all remaining, or abort
  - `all`: Automatically generate test skeletons for all gaps without prompting
  - `none`: Report gaps only, don't generate any tests

- `--extensions` (string, optional, default: `js,ts,jsx,tsx`): Comma-separated list of file extensions to audit
  - Example: `--extensions js,ts` to skip JSX/TSX files
  - Example: `--extensions ts` for TypeScript only

- `--test-pattern` (string, optional, default: `*.{test,spec}.{js,ts,jsx,tsx}`): Glob pattern to identify test files
  - Example: `--test-pattern *.test.ts` for TypeScript test files only
  - Example: `--test-pattern *.spec.js` for Jest spec files
  - Pattern is used to locate corresponding test files for each source file

## Workflow

**Overview**: This command performs two types of audits in parallel:
1. **Coverage Audit**: Identifies missing test scenarios for source code
2. **Format Audit**: Validates existing tests against vitest-best-practices template

Both audits run during analysis, and fixes can be applied for both types of issues based on the `--fix-mode` setting.

### Phase 1: Argument Parsing and File Discovery

1. Validate arguments:
   - Ensure `--fix-mode` is one of: `interactive`, `all`, `none` (default: `interactive`)
   - Validate `--extensions` format if provided
   - Validate `--test-pattern` is a valid glob pattern
   - Exit with clear error message if validation fails

2. Parse `path` argument to determine input type:
   - Single file: validate existence and extension
   - Directory: recursively find all files matching `--extensions`
   - Glob pattern: expand pattern and filter by extensions

3. Filter out test files from source files:
   - Use `--test-pattern` to identify test files
   - Separate source files from test files
   - Map each source file to its corresponding test file(s)

4. Report discovered files:
   - Count of source files to analyze
   - Count of test files found
   - Count of source files without corresponding tests

### Phase 2: Source Code Analysis

For each source file, parse and identify testable code paths:

1. **Parse file into AST** using TypeScript compiler API
   - Load `js-ts-best-practices` skill to understand code patterns
   - Extract function declarations, class methods, exported entities

2. **Identify branches** (control flow paths):
   - If/else statements (both branches)
   - Switch cases (all cases + default)
   - Ternary operators
   - Logical operators (&&, ||) with side effects
   - Optional chaining with fallback behavior

3. **Identify error handling paths**:
   - Try/catch blocks (both try and catch paths)
   - Throw statements
   - Error return values
   - Error callbacks
   - Validation checks that throw/return errors

4. **Identify boundary conditions**:
   - Array length checks (empty, single item, multiple items)
   - Null/undefined checks
   - Min/max value comparisons
   - String length validations
   - Numeric range checks (< 0, === 0, > 0)

5. **Identify async patterns**:
   - Promise resolve paths
   - Promise reject paths
   - Async/await with try/catch
   - Promise.all/race/allSettled usage
   - Callback error-first patterns

6. **Categorize testable scenarios**:
   - **Positive cases**: Happy path execution
   - **Negative cases**: Error conditions, invalid inputs
   - **Edge cases**: Boundaries, empty values, extremes
   - **Branch coverage**: All conditional paths
   - **Error handling**: Exception paths, error returns

7. Store code path metadata:
   - Function/method name
   - File path and line number
   - Code path type (branch, error, boundary, async)
   - Code snippet
   - Required test scenario description

### Phase 3: Test File Analysis

For each test file, parse and identify covered scenarios:

1. **Parse test file into AST**
   - Load `vitest-best-practices` skill for test pattern recognition
   - Detect test framework (vitest, jest, mocha) based on imports/globals

2. **Extract test structure**:
   - Test suite names (describe blocks)
   - Test case names (it/test blocks)
   - Setup/teardown hooks (beforeEach, afterEach)

3. **Identify tested scenarios**:
   - Match test descriptions to source code paths
   - Detect positive test cases (success scenarios)
   - Detect negative test cases (error scenarios)
   - Identify mocked dependencies
   - Identify assertion types (expect, assert)

4. **Map tests to source code**:
   - Link test cases to functions/methods under test
   - Identify which branches are covered by tests
   - Identify which error paths are covered
   - Track assertion coverage (multiple assertions per test)

5. **Analyze test quality and format compliance**:
   - **AAA pattern compliance**: Check for Arrange, Act, Assert structure with comments
   - **Test descriptions**: Verify sentence-style descriptions ("should do X when Y")
   - **Test organization**: Check for proper describe/it nesting (max 2-3 levels)
   - **Assertion quality**: Detect loose assertions (toBe vs toEqual, missing toStrictEqual)
   - **Test doubles usage**: Identify over-mocking or missing cleanup
   - **Async test handling**: Verify proper async/await usage, promise handling
   - **Error assertion patterns**: Check for proper toThrow/rejects usage
   - **Parameterized tests**: Identify tests that should use it.each()
   - **Test naming**: Detect vague test names ("test 1", "works correctly")

6. **Detect format violations**:
   - Missing AAA comments in test body
   - Non-sentence-style test descriptions
   - Deep nesting (>3 levels of describe)
   - Loose assertions (toBe for objects/arrays)
   - Missing toStrictEqual when checking object equality
   - Improper async test structure (missing await, not returning promises)
   - Vague test descriptions (no "should" statement)
   - Multiple unrelated assertions in single test
   - Missing error message assertions in toThrow checks
   - Improper use of test doubles (spies instead of fakes)
   - Missing cleanup in afterEach for stateful mocks

7. **Categorize format violations by severity**:
   - **Critical**: Missing async/await, improper error assertions, missing cleanup
   - **High**: Loose assertions, missing AAA pattern, vague descriptions
   - **Medium**: Deep nesting, over-mocking, missing parameterization
   - **Low**: Missing AAA comments, minor naming improvements

### Phase 4: Coverage Gap Detection

Compare source code paths against test coverage:

1. **Identify untested functions/methods**:
   - Exported functions without any tests
   - Public class methods without tests
   - Utility functions without coverage

2. **Identify untested branches**:
   - If/else branches with only one branch tested
   - Switch cases without corresponding tests
   - Ternary conditions with single path tested

3. **Identify untested error handling**:
   - Try/catch blocks without catch path tests
   - Throw statements without error assertion tests
   - Error validation without negative test cases

4. **Identify untested boundaries**:
   - Array operations without empty array tests
   - Numeric comparisons without boundary value tests
   - String operations without empty string tests

5. **Identify untested async paths**:
   - Promises without rejection tests
   - Async functions without error path tests
   - Callback patterns without error callback tests

6. **Categorize gaps by severity**:
   - **Critical**: No tests for exported functions, uncaught error paths
   - **High**: Missing branch coverage, missing error handling tests
   - **Medium**: Missing boundary tests, missing negative cases
   - **Low**: Missing edge cases, incomplete assertion coverage

### Phase 5: Report Generation

Generate detailed gap report with hierarchical structure including both coverage gaps and format violations:

```
=== Test Coverage Audit Report ===

src/core.ts (Coverage: 45.2%, Format Compliance: 62.5%)
  ✗ Function 'processData' - Missing tests (Critical)
    Line 45-67
    Required test scenarios:
      - Positive case: Valid input data
      - Negative case: Invalid input format
      - Edge case: Empty input array
      - Error handling: Throws on null input

  ✗ Function 'validateUser' - Partial coverage (High)
    Line 89-112
    Tested scenarios:
      ✓ Positive case: Valid user object
    Missing scenarios:
      - Negative case: Missing required fields
      - Negative case: Invalid email format
      - Edge case: Empty string values
      - Boundary: Username length limits

  ✗ Function 'fetchData' - Missing async error tests (High)
    Line 134-156
    Tested scenarios:
      ✓ Positive case: Successful fetch
    Missing scenarios:
      - Error handling: Network failure (Promise rejection)
      - Error handling: Timeout scenario
      - Error handling: Invalid response format

src/core.test.ts (Format Compliance: 62.5%)
  ⚠ Test 'validateUser - valid user object' - Format violations (High)
    Line 23-28
    Issues:
      - Missing AAA pattern comments
      - Loose assertion: using toBe for object comparison (should use toEqual)
      - Vague description: missing "should" statement

  ⚠ Test 'fetchData test' - Format violations (High)
    Line 45-52
    Issues:
      - Vague test name: "test" is not descriptive
      - Missing async/await: promise not properly handled
      - Missing AAA pattern comments

  ⚠ Nested describe blocks exceed 3 levels (Medium)
    Line 12
    Issues:
      - Deep nesting makes tests harder to read
      - Consider flattening structure

src/utils/formatters.ts (Coverage: 78.5%, Format Compliance: 85.3%)
  ✗ Function 'formatDate' - Missing branch coverage (Medium)
    Line 23-45
    Tested scenarios:
      ✓ Positive case: Valid date formatting
    Missing scenarios:
      - Branch: Undefined date parameter
      - Boundary: Invalid date object
      - Edge case: Timezone handling

  ✓ Function 'formatCurrency' - Full coverage
    Line 67-89
    All scenarios tested ✓

src/utils/formatters.test.ts (Format Compliance: 85.3%)
  ⚠ Test 'formatCurrency - formats correctly' - Format violations (Low)
    Line 34-41
    Issues:
      - Missing AAA pattern comments
      - Consider more specific description
```

### Phase 6: Statistics Reporting

Output comprehensive coverage and format compliance statistics:

```
=== Coverage Statistics ===

Total source files scanned: 45
Source files with tests: 38 (84.4%)
Source files without tests: 7 (15.6%)

Overall coverage: 67.3%
- Functions tested: 145/215 (67.4%)
- Branches covered: 234/387 (60.5%)
- Error paths covered: 78/142 (54.9%)
- Boundary cases covered: 89/156 (57.1%)
- Async paths covered: 56/89 (62.9%)

Coverage gap breakdown by severity:
- Critical: 23 gaps (untested functions, uncaught errors)
- High: 67 gaps (missing branches, error handling)
- Medium: 89 gaps (boundaries, negative cases)
- Low: 45 gaps (edge cases, incomplete assertions)

Coverage gap breakdown by category:
- Untested functions: 23
- Missing branch coverage: 153
- Missing error handling tests: 64
- Missing boundary tests: 67
- Missing async error tests: 33
- Missing edge cases: 45

=== Test Format Compliance Statistics ===

Total test files analyzed: 38
Overall format compliance: 73.5%

Format violation breakdown by severity:
- Critical: 12 violations (missing async/await, improper error assertions)
- High: 45 violations (loose assertions, missing AAA pattern, vague descriptions)
- Medium: 67 violations (deep nesting, over-mocking)
- Low: 89 violations (missing AAA comments, minor naming)

Format violation breakdown by category:
- Missing AAA pattern comments: 89
- Vague test descriptions: 45
- Loose assertions (toBe vs toEqual): 34
- Missing toStrictEqual for objects: 23
- Improper async handling: 12
- Deep nesting (>3 levels): 15
- Over-mocking: 28
- Missing error message assertions: 18
- Multiple unrelated assertions: 12
- Missing cleanup in afterEach: 8
- Should use parameterized tests: 16

Test quality metrics:
- Tests using AAA pattern with comments: 296/385 (76.9%)
- Tests with sentence-style descriptions: 312/385 (81.0%)
- Tests with strict assertions: 267/385 (69.4%)
- Tests with proper async handling: 77/89 (86.5%)
- Tests with proper error assertions: 56/72 (77.8%)
- Async tests with error assertions: 56/89 (62.9%)

Per-file coverage (bottom 10):
1. src/legacy/parser.ts: 12.5% coverage, 45.2% format (5 coverage gaps, 12 format violations)
2. src/utils/validators.ts: 34.2% coverage, 67.8% format (12 coverage gaps, 8 format violations)
3. src/core.ts: 45.2% coverage, 62.5% format (8 coverage gaps, 15 format violations)
4. src/api/client.ts: 52.8% coverage, 78.3% format (6 coverage gaps, 5 format violations)
5. src/formatters.ts: 58.3% coverage, 85.3% format (4 coverage gaps, 3 format violations)
...

Files by total issues (coverage gaps + format violations):
1. src/core.ts: 23 issues (8 coverage gaps, 15 format violations)
2. src/utils/validators.ts: 20 issues (12 coverage gaps, 8 format violations)
3. src/legacy/parser.ts: 17 issues (5 coverage gaps, 12 format violations)
...
```

### Phase 7: Fix Application (based on fix-mode)

**If `fix-mode=interactive`:**

First, process coverage gaps:
- For each coverage gap:
  - Display gap details (file, function, missing scenario)
  - Show code snippet from source file
  - Prompt user with options:
    - `[g]enerate` - Generate test skeleton for this gap
    - `[s]kip` - Skip this gap
    - `[c]ustom` - Provide custom test implementation
    - `[a]ll` - Generate tests for all remaining coverage gaps
    - `[q]uit` - Abort and exit
  - If user chooses generate/all:
    - Create or append to test file
    - Generate test skeleton using `vitest-best-practices` patterns
    - Include AAA pattern structure with comments
    - Add TODO comments for assertion logic
    - Use appropriate test framework syntax (detected from existing tests)
    - Confirm test was generated successfully
  - If user chooses custom:
    - Prompt for test description/implementation
    - Apply custom test code
  - If user chooses skip:
    - Track gap in skipped-gaps list
  - If user chooses quit:
    - Display summary of tests generated
    - Exit workflow

Then, process format violations:
- For each format violation:
  - Display violation details (test file, test name, line, issues)
  - Show current test code with issues highlighted
  - Prompt user with options:
    - `[f]ix` - Automatically fix this violation
    - `[s]kip` - Skip this violation
    - `[a]ll` - Fix all remaining format violations
    - `[q]uit` - Abort and exit
  - If user chooses fix/all:
    - Apply format fixes based on violation type:
      - Add AAA pattern comments if missing
      - Rewrite test description to sentence-style if vague
      - Replace loose assertions (toBe → toEqual, add toStrictEqual)
      - Add proper async/await syntax
      - Flatten deep nesting where possible
      - Add error message assertions to toThrow
      - Refactor to parameterized tests if applicable
      - Add cleanup in afterEach if missing
    - Confirm fix was applied successfully
  - If user chooses skip:
    - Track violation in skipped-violations list
  - If user chooses quit:
    - Display summary of fixes applied
    - Exit workflow

**If `fix-mode=all`:**

First, auto-fix coverage gaps:
- Display message: "Auto-generating tests for all N coverage gaps..."
- For each gap:
  - Generate test skeleton in appropriate test file
  - Create test file if it doesn't exist
  - Use framework-agnostic syntax or match detected framework
  - Follow vitest-best-practices template (AAA comments, sentence-style descriptions, strict assertions)
  - Show progress: "Generated M/N tests..."
  - Track all generated tests
- Display completion message with total tests generated

Then, auto-fix format violations:
- Display message: "Auto-fixing all M format violations..."
- For each violation:
  - Apply appropriate fix based on violation type
  - Preserve test logic while improving format
  - Show progress: "Fixed K/M violations..."
  - Track all applied fixes
- Display completion message with total fixes applied

**If `fix-mode=none`:**
- Display message: "Report-only mode: no tests will be generated or modified"
- Skip test generation entirely
- Skip format fixes entirely
- All gaps and violations remain in report for manual implementation

### Test Skeleton Generation

Generated test skeletons should follow this structure:

```typescript
describe('functionName', () => {
  // Positive case
  test('should handle valid input successfully', () => {
    // Arrange
    const input = // TODO: provide valid input

    // Act
    const result = functionName(input)

    // Assert
    expect(result).toBeDefined()
    // TODO: add specific assertions
  })

  // Negative case
  test('should handle invalid input', () => {
    // Arrange
    const invalidInput = // TODO: provide invalid input

    // Act & Assert
    expect(() => functionName(invalidInput)).toThrow()
    // TODO: verify error message/type
  })

  // Edge case
  test('should handle empty input', () => {
    // Arrange
    const emptyInput = // TODO: provide empty/boundary input

    // Act
    const result = functionName(emptyInput)

    // Assert
    // TODO: verify boundary behavior
  })

  // Error handling
  test('should handle errors gracefully', async () => {
    // Arrange
    // TODO: set up error condition

    // Act & Assert
    await expect(functionName()).rejects.toThrow()
  })
})
```

### Format Fix Application

When applying format fixes, the following transformations are made:

**1. Add AAA Pattern Comments**
```typescript
// Before
test('should validate user', () => {
  const user = { name: 'John' };
  const result = validateUser(user);
  expect(result).toBe(true);
});

// After
test('should validate user', () => {
  // Arrange
  const user = { name: 'John' };

  // Act
  const result = validateUser(user);

  // Assert
  expect(result).toBe(true);
});
```

**2. Improve Test Descriptions**
```typescript
// Before
test('validates correctly', () => { /* ... */ });
test('user test', () => { /* ... */ });

// After
test('should validate user when all required fields are provided', () => { /* ... */ });
test('should reject user when email is invalid', () => { /* ... */ });
```

**3. Fix Loose Assertions**
```typescript
// Before
expect(user).toBe({ name: 'John' }); // Will always fail
expect(list).toBe([1, 2, 3]); // Will always fail

// After
expect(user).toEqual({ name: 'John' });
expect(list).toEqual([1, 2, 3]);
```

**4. Add Strict Equality Checks**
```typescript
// Before
expect(result).toEqual({ id: 1, name: 'John' });

// After (when checking exact object structure)
expect(result).toStrictEqual({ id: 1, name: 'John' });
```

**5. Fix Async Test Handling**
```typescript
// Before
test('fetches data', () => {
  fetchData().then(data => {
    expect(data).toBeDefined();
  });
});

// After
test('should fetch data successfully', async () => {
  // Arrange
  // (setup if needed)

  // Act
  const data = await fetchData();

  // Assert
  expect(data).toBeDefined();
});
```

**6. Add Error Message Assertions**
```typescript
// Before
test('should throw on invalid input', () => {
  expect(() => validateUser(null)).toThrow();
});

// After
test('should throw error when user is null', () => {
  // Arrange
  const invalidUser = null;

  // Act & Assert
  expect(() => validateUser(invalidUser)).toThrow('User cannot be null');
});
```

**7. Convert to Parameterized Tests**
```typescript
// Before
test('should validate email format - valid', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});
test('should validate email format - invalid', () => {
  expect(validateEmail('invalid')).toBe(false);
});
test('should validate email format - empty', () => {
  expect(validateEmail('')).toBe(false);
});

// After
test.each([
  { email: 'test@example.com', expected: true, scenario: 'valid email' },
  { email: 'invalid', expected: false, scenario: 'missing @ symbol' },
  { email: '', expected: false, scenario: 'empty string' },
  { email: 'no-domain@', expected: false, scenario: 'missing domain' },
])('should return $expected when validating $scenario', ({ email, expected }) => {
  // Arrange
  // (input provided by test.each)

  // Act
  const result = validateEmail(email);

  // Assert
  expect(result).toBe(expected);
});
```

**8. Flatten Deep Nesting**
```typescript
// Before (4 levels deep)
describe('UserService', () => {
  describe('authentication', () => {
    describe('login', () => {
      describe('with valid credentials', () => {
        test('should succeed', () => { /* ... */ });
      });
    });
  });
});

// After (2 levels)
describe('UserService', () => {
  describe('Login with valid credentials', () => {
    test('should authenticate user successfully', () => { /* ... */ });
  });
});
```

**9. Add Cleanup Hooks**
```typescript
// Before
describe('Database tests', () => {
  test('should insert record', () => {
    const db = new Database();
    db.insert({ id: 1 });
    expect(db.count()).toBe(1);
  });

  test('should update record', () => {
    const db = new Database();
    db.update({ id: 1, name: 'updated' });
    // State from previous test may leak
  });
});

// After
describe('Database tests', () => {
  let db: Database;

  beforeEach(() => {
    db = new Database();
  });

  afterEach(() => {
    db.close();
    db = null;
  });

  test('should insert record', () => {
    // Arrange
    const record = { id: 1 };

    // Act
    db.insert(record);

    // Assert
    expect(db.count()).toBe(1);
  });

  test('should update record', () => {
    // Arrange
    const record = { id: 1, name: 'updated' };

    // Act
    db.update(record);

    // Assert
    expect(db.get(1).name).toEqual('updated');
  });
});
```

### Error Handling

- Invalid `--fix-mode` value: Display error and exit with valid options
- Invalid file paths: Report error and skip file
- Unparseable source files: Log syntax errors and continue
- Unparseable test files: Log errors and treat as no coverage
- Permission errors: Report and skip file
- Empty directories: Warn user and exit gracefully
- No files matching extension filter: Inform user and suggest checking `--extensions`
- Test file creation fails: Report error and continue with next gap
- Test file modification fails: Report error and continue with next violation
- User quits during interactive mode: Display summary of tests generated and fixes applied before exit

## Statistics Reporting

The command outputs detailed statistics in multiple dimensions:

### File-Level Statistics
- Total source files scanned (with breakdown by extension)
- Files with tests vs without tests (percentage)
- Overall coverage percentage
- Bottom N files by coverage (default N=10)

### Function-Level Statistics
- Total functions/methods analyzed
- Functions with complete coverage
- Functions with partial coverage
- Functions with no coverage

### Code Path Statistics
- Total branches identified vs covered (percentage)
- Total error paths identified vs covered
- Total boundary conditions identified vs covered
- Total async paths identified vs covered

### Gap Statistics by Severity
- Critical gaps (untested functions, uncaught errors)
- High gaps (missing branches, error handling)
- Medium gaps (boundaries, negative cases)
- Low gaps (edge cases, incomplete assertions)

### Gap Statistics by Category
- Untested functions count
- Missing branch coverage count
- Missing error handling tests count
- Missing boundary tests count
- Missing async error tests count
- Missing edge cases count

### Test Quality Statistics
- AAA pattern compliance (percentage)
- Proper mocking usage (percentage)
- Async error handling coverage (percentage)

### Fix Application Statistics (if fix-mode ≠ none)
- Test files created count
- Test files modified count
- Test cases generated by category
- Gaps skipped (if interactive mode)

### Example Output Structure

**Interactive mode (default):**
```
Discovering files...
Found 45 source files and 38 test files

Analyzing source code...
[========================================] 45/45 files
Identified 387 branches, 142 error paths, 156 boundaries, 89 async paths

Analyzing test coverage...
[========================================] 38/38 test files
Found 385 existing test cases

=== Test Coverage Audit Report ===

src/core.ts (Coverage: 45.2%)
  ✗ Function 'processData' - Missing tests (Critical)
    Line 45-67
    Required test scenarios:
      - Positive case: Valid input data
      - Negative case: Invalid input format
      - Edge case: Empty input array
      - Error handling: Throws on null input
...

=== Coverage Statistics ===
Total source files scanned: 45
Overall coverage: 67.3%
Gap breakdown by severity:
- Critical: 23 gaps
- High: 67 gaps
- Medium: 89 gaps
- Low: 45 gaps

Gap 1/224: src/core.ts:45 - processData (Critical)
Missing: Positive case - Valid input data

Generate test skeleton for this scenario?
[g]enerate | [s]kip | [c]ustom | [a]ll | [q]uit?
```

**Auto-fix mode (--fix-mode=all):**
```
[Same discovery and analysis output]

=== Test Coverage Audit Report ===
[Same report]

=== Coverage Statistics ===
[Same statistics]

Auto-generating tests for all 224 gaps...
Generated 224/224 tests

=== Tests Generated ===

Created 7 new test files:
- src/legacy/parser.test.ts (23 tests)
- src/utils/validators.test.ts (12 tests)
...

Modified 31 existing test files:
- src/core.test.ts (added 8 tests)
- src/api/client.test.ts (added 6 tests)
...

Tests by category:
- Positive cases: 89
- Negative cases: 64
- Edge cases: 45
- Error handling: 64
- Boundary tests: 67
- Async error tests: 33

Total test cases generated: 224
```

**Report-only mode (--fix-mode=none):**
```
[Same discovery, analysis, report, and statistics output]

Report-only mode: no tests will be generated
Audit complete.
```

## Examples

### Example 1: Audit Current Directory

```bash
$ claude audit:js-test-coverage
```

**Output:**
```
Discovering files...
Found 45 source files and 38 test files
7 source files without corresponding tests

Analyzing source code...
[========================================] 45/45 files
Identified 387 branches, 142 error paths, 156 boundaries, 89 async paths

Analyzing test coverage...
[========================================] 38/38 test files
Found 385 existing test cases

Analyzing test format compliance...
[========================================] 38/38 test files
Found 213 format violations

=== Test Coverage Audit Report ===

src/core.ts (Coverage: 45.2%, Format Compliance: 62.5%)
  ✗ Function 'processData' - Missing tests (Critical)
    Line 45-67
    Required test scenarios:
      - Positive case: Valid input data
      - Negative case: Invalid input format
      - Edge case: Empty input array
      - Error handling: Throws on null input

  ✗ Function 'validateUser' - Partial coverage (High)
    Line 89-112
    Tested scenarios:
      ✓ Positive case: Valid user object
    Missing scenarios:
      - Negative case: Missing required fields
      - Negative case: Invalid email format
      - Edge case: Empty string values

src/core.test.ts (Format Compliance: 62.5%)
  ⚠ Test 'validateUser - valid user object' - Format violations (High)
    Line 23-28
    Issues:
      - Missing AAA pattern comments
      - Loose assertion: using toBe for object comparison
      - Vague description: missing "should" statement

  ⚠ Test 'processData test' - Format violations (High)
    Line 34-40
    Issues:
      - Vague test name: "test" is not descriptive
      - Missing AAA pattern comments
...

=== Coverage Statistics ===
Total source files scanned: 45
Overall coverage: 67.3%
Coverage gap breakdown by severity:
- Critical: 23 gaps
- High: 67 gaps
- Medium: 89 gaps
- Low: 45 gaps

=== Test Format Compliance Statistics ===
Total test files analyzed: 38
Overall format compliance: 44.7%
Format violation breakdown by severity:
- Critical: 12 violations
- High: 45 violations
- Medium: 67 violations
- Low: 89 violations

Processing coverage gaps...

Gap 1/224: src/core.ts:45 - processData (Critical)
Missing: Positive case - Valid input data

Source code:
  export function processData(input: Data[]): Result {
    if (!input || input.length === 0) {
      throw new Error('Input required')
    }
    return { processed: input.map(transform) }
  }

Suggested test:
  test('should process data when valid input is provided', () => {
    // Arrange
    const input = [{ id: 1, value: 'test' }]

    // Act
    const result = processData(input)

    // Assert
    expect(result.processed).toHaveLength(1)
    // TODO: add specific assertions
  })

Generate test skeleton for this scenario?
[g]enerate | [s]kip | [c]ustom | [a]ll | [q]uit?
```

### Example 2: Audit Specific Directory with Auto-fix

```bash
$ claude audit:js-test-coverage src/utils --fix-mode=all
```

**Output:**
```
Discovering files...
Found 12 source files and 8 test files

Analyzing source code...
[========================================] 12/12 files
Identified 89 branches, 34 error paths, 45 boundaries, 23 async paths

Analyzing test coverage...
[========================================] 8/8 test files
Found 67 existing test cases

Analyzing test format compliance...
[========================================] 8/8 test files
Found 34 format violations

=== Test Coverage Audit Report ===

src/utils/validators.ts (Coverage: 34.2%, Format Compliance: 68.3%)
  ✗ Function 'validateEmail' - Missing tests (Critical)
    Line 12-28
    Required test scenarios:
      - Positive case: Valid email format
      - Negative case: Invalid email format
      - Edge case: Empty string
      - Boundary: Maximum length email

src/utils/formatters.ts (Coverage: 78.5%, Format Compliance: 82.1%)
  ✗ Function 'formatDate' - Missing branch coverage (Medium)
    Line 45-67
    Missing scenarios:
      - Branch: Undefined date parameter
      - Boundary: Invalid date object
...

src/utils/validators.test.ts (Format Compliance: 68.3%)
  ⚠ Multiple tests with format violations
    - 5 tests missing AAA comments
    - 3 tests with vague descriptions
    - 2 tests with loose assertions

src/utils/formatters.test.ts (Format Compliance: 82.1%)
  ⚠ Multiple tests with format violations
    - 4 tests missing AAA comments
    - 1 test with improper async handling
...

=== Coverage Statistics ===
Total source files scanned: 12
Overall coverage: 58.7%

Coverage gap breakdown:
- Critical: 5 gaps
- High: 18 gaps
- Medium: 23 gaps
- Low: 12 gaps

=== Test Format Compliance Statistics ===
Total test files analyzed: 8
Overall format compliance: 72.4%

Format violation breakdown:
- Critical: 2 violations
- High: 15 violations
- Medium: 12 violations
- Low: 5 violations

Auto-generating tests for all 58 coverage gaps...
[========================================] 58/58 tests
Generated 58/58 tests

=== Coverage Tests Generated ===

Created 4 new test files:
- src/utils/validators.test.ts (12 tests)
- src/utils/helpers.test.ts (8 tests)
- src/utils/parsers.test.ts (6 tests)
- src/utils/converters.test.ts (5 tests)

Modified 4 existing test files:
- src/utils/formatters.test.ts (added 15 tests)
- src/utils/transforms.test.ts (added 7 tests)
- src/utils/filters.test.ts (added 3 tests)
- src/utils/sorters.test.ts (added 2 tests)

Tests by category:
- Positive cases: 23
- Negative cases: 18
- Edge cases: 12
- Error handling: 18
- Boundary tests: 23
- Async error tests: 7

Total test cases generated: 58

Auto-fixing all 34 format violations...
[========================================] 34/34 violations
Fixed 34/34 violations

=== Format Fixes Applied ===

Modified 8 test files:
- src/utils/validators.test.ts (fixed 10 violations)
- src/utils/formatters.test.ts (fixed 5 violations)
- src/utils/helpers.test.ts (fixed 6 violations)
- src/utils/parsers.test.ts (fixed 4 violations)
- src/utils/converters.test.ts (fixed 3 violations)
- src/utils/transforms.test.ts (fixed 3 violations)
- src/utils/filters.test.ts (fixed 2 violations)
- src/utils/sorters.test.ts (fixed 1 violation)

Fixes by category:
- Added AAA pattern comments: 18
- Improved test descriptions: 8
- Fixed loose assertions: 5
- Added async/await: 2
- Added error message assertions: 1

Total format violations fixed: 34

Audit complete.
Coverage: 92.4% (up from 58.7%)
Format compliance: 100% (up from 72.4%)
```

### Example 3: Audit Single File with Interactive Mode

```bash
$ claude audit:js-test-coverage src/api/client.ts
```

**Output:**
```
Analyzing file: src/api/client.ts
Found corresponding test file: src/api/client.test.ts

Analyzing source code...
Identified 23 branches, 8 error paths, 12 boundaries, 15 async paths

Analyzing test coverage...
Found 34 existing test cases in src/api/client.test.ts

Analyzing test format compliance...
Found 8 format violations in src/api/client.test.ts

=== Test Coverage Audit Report ===

src/api/client.ts (Coverage: 52.8%, Format Compliance: 76.5%)
  ✗ Function 'fetchUser' - Missing async error tests (High)
    Line 34-56
    Tested scenarios:
      ✓ Positive case: Successful fetch
    Missing scenarios:
      - Error handling: Network failure (Promise rejection)
      - Error handling: 404 response
      - Error handling: Timeout scenario

  ✗ Function 'updateUser' - Partial coverage (High)
    Line 78-102
    Tested scenarios:
      ✓ Positive case: Successful update
    Missing scenarios:
      - Error handling: Validation error response
      - Branch: User not found
      - Boundary: Empty update payload

src/api/client.test.ts (Format Compliance: 76.5%)
  ⚠ Test 'fetches user' - Format violations (High)
    Line 12-17
    Issues:
      - Vague description: missing "should" statement
      - Missing AAA pattern comments
      - Loose assertion: using toBe for object comparison

  ⚠ Test 'update test' - Format violations (High)
    Line 23-29
    Issues:
      - Vague test name: "test" is not descriptive
      - Missing AAA pattern comments

=== Coverage Statistics ===
Total source files scanned: 1
Overall coverage: 52.8%
Coverage gap breakdown:
- High: 6 gaps

=== Test Format Compliance Statistics ===
Total test files analyzed: 1
Overall format compliance: 76.5%
Format violation breakdown:
- High: 8 violations

Processing coverage gaps...

Gap 1/6: src/api/client.ts:34 - fetchUser (High)
Missing: Error handling - Network failure (Promise rejection)

Source code:
  async fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  }

Suggested test:
  test('should handle network failure when fetch rejects', async () => {
    // Arrange
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    // Act & Assert
    await expect(client.fetchUser('123')).rejects.toThrow('Network error')
  })

Generate test skeleton for this scenario?
[g]enerate | [s]kip | [c]ustom | [a]ll | [q]uit? g

Generated test in src/api/client.test.ts

Gap 2/6: src/api/client.ts:34 - fetchUser (High)
Missing: Error handling - 404 response

[g]enerate | [s]kip | [c]ustom | [a]ll | [q]uit? a

Generating tests for all remaining coverage gaps...
Generated 5/5 tests

=== Coverage Tests Generated ===

Modified 1 file:
- src/api/client.test.ts (added 6 tests)

Tests by category:
- Error handling: 3
- Branch coverage: 2
- Boundary tests: 1

Processing format violations...

Violation 1/8: src/api/client.test.ts:12 - 'fetches user' (High)
Issues:
  - Vague description: missing "should" statement
  - Missing AAA pattern comments
  - Loose assertion: using toBe for object comparison

Current code:
  test('fetches user', () => {
    const result = client.fetchUser('123')
    expect(result).toBe({ id: '123', name: 'John' })
  })

Suggested fix:
  test('should fetch user by ID successfully', async () => {
    // Arrange
    const userId = '123'

    // Act
    const result = await client.fetchUser(userId)

    // Assert
    expect(result).toEqual({ id: '123', name: 'John' })
  })

Apply this fix?
[f]ix | [s]kip | [a]ll | [q]uit? f

Applied fix to src/api/client.test.ts:12

Violation 2/8: src/api/client.test.ts:23 - 'update test' (High)
Issues:
  - Vague test name: "test" is not descriptive
  - Missing AAA pattern comments

Apply fix for this violation?
[f]ix | [s]kip | [a]ll | [q]uit? a

Fixing all remaining format violations...
Fixed 7/7 violations

=== Format Fixes Applied ===

Modified 1 file:
- src/api/client.test.ts (fixed 8 violations)

Fixes by category:
- Added AAA pattern comments: 6
- Improved test descriptions: 4
- Fixed loose assertions: 2
- Added async/await: 1

Audit complete.
Final coverage: 87.3% (up from 52.8%)
Final format compliance: 100% (up from 76.5%)
```

### Example 4: Report-Only Mode for Review

```bash
$ claude audit:js-test-coverage src/core --fix-mode=none --extensions ts
```

**Output:**
```
Discovering files...
Found 8 TypeScript source files and 6 test files

Analyzing source code...
[========================================] 8/8 files
Identified 67 branches, 28 error paths, 34 boundaries, 19 async paths

Analyzing test coverage...
[========================================] 6/6 test files
Found 89 existing test cases

Analyzing test format compliance...
[========================================] 6/6 test files
Found 45 format violations

=== Test Coverage Audit Report ===

src/core/processor.ts (Coverage: 45.2%, Format Compliance: 73.6%)
  ✗ Function 'processData' - Missing tests (Critical)
  ✗ Function 'validateInput' - Partial coverage (High)
  ✗ Function 'transformResult' - Missing branch coverage (Medium)

src/core/processor.test.ts (Format Compliance: 73.6%)
  ⚠ Multiple format violations (18 total)
    - 12 tests missing AAA comments
    - 4 tests with vague descriptions
    - 2 tests with loose assertions

src/core/validator.ts (Coverage: 67.8%, Format Compliance: 81.2%)
  ✗ Function 'checkBoundaries' - Missing boundary tests (Medium)
  ✗ Function 'validateSchema' - Missing error handling tests (High)

src/core/validator.test.ts (Format Compliance: 81.2%)
  ⚠ Multiple format violations (8 total)
    - 6 tests missing AAA comments
    - 2 tests with improper async handling

src/core/transformer.ts (Coverage: 82.3%, Format Compliance: 92.5%)
  ✓ Full coverage

src/core/transformer.test.ts (Format Compliance: 92.5%)
  ⚠ Minor format violations (3 total)
    - 3 tests missing AAA comments

=== Coverage Statistics ===

Total source files scanned: 8
Source files with tests: 6 (75.0%)
Source files without tests: 2 (25.0%)

Overall coverage: 67.3%
- Functions tested: 34/48 (70.8%)
- Branches covered: 45/67 (67.2%)
- Error paths covered: 18/28 (64.3%)
- Boundary cases covered: 21/34 (61.8%)
- Async paths covered: 13/19 (68.4%)

Coverage gap breakdown by severity:
- Critical: 4 gaps
- High: 12 gaps
- Medium: 18 gaps
- Low: 8 gaps

=== Test Format Compliance Statistics ===

Total test files analyzed: 6
Overall format compliance: 79.3%

Format violation breakdown by severity:
- Critical: 2 violations
- High: 12 violations
- Medium: 18 violations
- Low: 13 violations

Format violation breakdown by category:
- Missing AAA pattern comments: 21
- Vague test descriptions: 8
- Loose assertions: 6
- Improper async handling: 2
- Deep nesting: 3
- Missing error message assertions: 5

Per-file statistics:
1. src/core/processor.ts: 45.2% coverage, 73.6% format (8 coverage gaps, 18 format violations)
2. src/core/validator.ts: 67.8% coverage, 81.2% format (5 coverage gaps, 8 format violations)
3. src/core/transformer.ts: 82.3% coverage, 92.5% format (0 coverage gaps, 3 format violations)
4. src/core/formatter.ts: 78.9% coverage, 85.7% format (2 coverage gaps, 6 format violations)
...

Report-only mode: no tests will be generated or modified
Audit complete.
```

## Implementation Notes

### TypeScript Compiler API Usage

Parse source files to identify testable code paths:

```typescript
import * as ts from 'typescript';

function analyzeSourceFile(filepath: string): CodePath[] {
  const sourceFile = ts.createSourceFile(
    filepath,
    fs.readFileSync(filepath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  const codePaths: CodePath[] = [];

  function visitNode(node: ts.Node): void {
    // Identify branches
    if (ts.isIfStatement(node)) {
      codePaths.push({
        type: 'branch',
        subtype: 'if-else',
        line: sourceFile.getLineAndCharacterOfPosition(node.pos).line,
        branches: [
          { condition: 'true', tested: false },
          { condition: 'false', tested: !!node.elseStatement }
        ]
      });
    }

    // Identify error handling
    if (ts.isTryStatement(node)) {
      codePaths.push({
        type: 'error-handling',
        subtype: 'try-catch',
        line: sourceFile.getLineAndCharacterOfPosition(node.pos).line,
        paths: [
          { path: 'try', tested: false },
          { path: 'catch', tested: false }
        ]
      });
    }

    // Identify async patterns
    if (ts.isCallExpression(node) &&
        node.expression.getText() === 'Promise') {
      codePaths.push({
        type: 'async',
        subtype: 'promise',
        line: sourceFile.getLineAndCharacterOfPosition(node.pos).line,
        paths: [
          { path: 'resolve', tested: false },
          { path: 'reject', tested: false }
        ]
      });
    }

    ts.forEachChild(node, visitNode);
  }

  visitNode(sourceFile);
  return codePaths;
}
```

### Test File Analysis

Parse test files to identify coverage:

```typescript
function analyzeTestFile(testPath: string, sourcePath: string): Coverage {
  const testSource = ts.createSourceFile(
    testPath,
    fs.readFileSync(testPath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  const coverage: Coverage = {
    testedFunctions: new Set(),
    testedBranches: new Map(),
    testedErrorPaths: new Set(),
    testCases: []
  };

  function visitTestNode(node: ts.Node): void {
    // Detect test framework (vitest, jest, mocha)
    if (ts.isCallExpression(node)) {
      const funcName = node.expression.getText();

      // Test case detection
      if (['test', 'it', 'should'].includes(funcName)) {
        const testName = node.arguments[0]?.getText() || '';
        const testBody = node.arguments[1];

        coverage.testCases.push({
          name: testName,
          type: detectTestType(testName, testBody),
          assertions: extractAssertions(testBody)
        });
      }
    }

    ts.forEachChild(node, visitTestNode);
  }

  visitTestNode(testSource);
  return coverage;
}

function detectTestType(name: string, body: ts.Node): TestType[] {
  const types: TestType[] = [];
  const lowerName = name.toLowerCase();

  if (/valid|success|should work|correct/.test(lowerName)) {
    types.push('positive');
  }
  if (/invalid|error|fail|throw|reject/.test(lowerName)) {
    types.push('negative');
  }
  if (/empty|null|undefined|zero|boundary|edge/.test(lowerName)) {
    types.push('edge');
  }
  if (/error|exception|catch|reject/.test(lowerName)) {
    types.push('error-handling');
  }

  return types.length > 0 ? types : ['positive']; // Default to positive
}
```

### Gap Detection Logic

Compare source paths against test coverage:

```typescript
function detectGaps(
  codePaths: CodePath[],
  coverage: Coverage,
  sourceFile: string
): Gap[] {
  const gaps: Gap[] = [];

  for (const path of codePaths) {
    const functionName = getFunctionName(path);

    // Check if function is tested at all
    if (!coverage.testedFunctions.has(functionName)) {
      gaps.push({
        severity: 'critical',
        category: 'untested-function',
        file: sourceFile,
        line: path.line,
        function: functionName,
        description: `Function '${functionName}' has no tests`,
        scenarios: generateRequiredScenarios(path)
      });
      continue;
    }

    // Check specific path coverage
    if (path.type === 'branch') {
      const testedBranches = coverage.testedBranches.get(functionName) || [];
      const missingBranches = path.branches.filter(
        b => !testedBranches.includes(b.condition)
      );

      if (missingBranches.length > 0) {
        gaps.push({
          severity: 'high',
          category: 'missing-branch',
          file: sourceFile,
          line: path.line,
          function: functionName,
          description: `Missing branch coverage: ${missingBranches.map(b => b.condition).join(', ')}`,
          scenarios: missingBranches.map(b => ({
            type: 'branch',
            description: `Branch: ${b.condition} path`
          }))
        });
      }
    }

    // Similar logic for error handling, boundaries, async paths
  }

  return gaps;
}
```

### Test Skeleton Generation

Generate framework-agnostic test skeletons:

```typescript
function generateTestSkeleton(gap: Gap, framework: TestFramework): string {
  const { function: funcName, scenarios } = gap;

  const testCases = scenarios.map(scenario => {
    switch (scenario.type) {
      case 'positive':
        return `
  test('should ${scenario.description}', () => {
    // Arrange
    const input = // TODO: provide valid input

    // Act
    const result = ${funcName}(input)

    // Assert
    expect(result).toBeDefined()
    // TODO: add specific assertions
  })`;

      case 'negative':
        return `
  test('should handle ${scenario.description}', () => {
    // Arrange
    const invalidInput = // TODO: provide invalid input

    // Act & Assert
    expect(() => ${funcName}(invalidInput)).toThrow()
    // TODO: verify error message/type
  })`;

      case 'edge':
        return `
  test('should handle ${scenario.description}', () => {
    // Arrange
    const edgeInput = // TODO: provide edge case input

    // Act
    const result = ${funcName}(edgeInput)

    // Assert
    // TODO: verify edge case behavior
  })`;

      case 'async-error':
        return `
  test('should handle ${scenario.description}', async () => {
    // Arrange
    // TODO: set up error condition

    // Act & Assert
    await expect(${funcName}()).rejects.toThrow()
    // TODO: verify error type
  })`;

      default:
        return `
  test('${scenario.description}', () => {
    // TODO: implement test
  })`;
    }
  });

  return `
describe('${funcName}', () => {${testCases.join('\n')}
})`;
}
```

### Framework Detection

Auto-detect test framework from existing tests:

```typescript
function detectTestFramework(testFilePath: string): TestFramework {
  const content = fs.readFileSync(testFilePath, 'utf-8');

  if (/from ['"]vitest['"]/.test(content) || /import.*vitest/.test(content)) {
    return 'vitest';
  }
  if (/from ['"]@jest\/globals['"]/.test(content) || /jest\./.test(content)) {
    return 'jest';
  }
  if (/from ['"]mocha['"]/.test(content) || /describe.*it/.test(content)) {
    return 'mocha';
  }

  // Default to framework-agnostic syntax (works with most frameworks)
  return 'generic';
}
```

### Severity Calculation

Assign severity based on code path importance:

```typescript
function calculateSeverity(gap: Gap): Severity {
  // Untested exported functions = critical
  if (gap.category === 'untested-function' && gap.isExported) {
    return 'critical';
  }

  // Uncaught error paths = critical
  if (gap.category === 'missing-error-handling' && gap.canThrow) {
    return 'critical';
  }

  // Missing branch coverage = high
  if (gap.category === 'missing-branch') {
    return 'high';
  }

  // Missing async error paths = high
  if (gap.category === 'async-error' && gap.hasPromiseRejection) {
    return 'high';
  }

  // Missing boundary tests = medium
  if (gap.category === 'missing-boundary') {
    return 'medium';
  }

  // Missing edge cases = low
  if (gap.category === 'edge-case') {
    return 'low';
  }

  return 'medium'; // Default
}
```

### Format Violation Detection

Analyze test structure and code patterns to detect violations:

```typescript
interface FormatViolation {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  file: string;
  line: number;
  testName: string;
  description: string;
  currentCode: string;
  suggestedFix: string;
}

function detectFormatViolations(testFile: string): FormatViolation[] {
  const violations: FormatViolation[] = [];
  const ast = parseTestFile(testFile);

  // Check each test case
  for (const testCase of extractTestCases(ast)) {
    // 1. Check for AAA pattern comments
    if (!hasAAAComments(testCase.body)) {
      violations.push({
        severity: testCase.hasMultipleAssertions ? 'high' : 'low',
        category: 'missing-aaa-comments',
        file: testFile,
        line: testCase.line,
        testName: testCase.name,
        description: 'Missing AAA pattern comments (Arrange, Act, Assert)',
        currentCode: testCase.code,
        suggestedFix: addAAAComments(testCase.code)
      });
    }

    // 2. Check test description quality
    if (isVagueDescription(testCase.name)) {
      violations.push({
        severity: 'high',
        category: 'vague-description',
        file: testFile,
        line: testCase.line,
        testName: testCase.name,
        description: 'Vague test description - should use sentence style with "should"',
        currentCode: testCase.code,
        suggestedFix: improvTestDescription(testCase)
      });
    }

    // 3. Check for loose assertions
    const looseAssertions = findLooseAssertions(testCase.body);
    for (const assertion of looseAssertions) {
      if (assertion.method === 'toBe' && assertion.expectedType === 'object') {
        violations.push({
          severity: 'high',
          category: 'loose-assertion',
          file: testFile,
          line: assertion.line,
          testName: testCase.name,
          description: 'Using toBe for object comparison (should use toEqual or toStrictEqual)',
          currentCode: assertion.code,
          suggestedFix: assertion.code.replace('toBe', 'toEqual')
        });
      }
    }

    // 4. Check async handling
    if (testCase.hasAsyncCode && !testCase.isAsyncFunction) {
      violations.push({
        severity: 'critical',
        category: 'improper-async',
        file: testFile,
        line: testCase.line,
        testName: testCase.name,
        description: 'Async code without async/await - promises may not be properly handled',
        currentCode: testCase.code,
        suggestedFix: convertToAsyncAwait(testCase.code)
      });
    }

    // 5. Check error assertions
    const errorAssertions = findErrorAssertions(testCase.body);
    for (const assertion of errorAssertions) {
      if (!hasErrorMessageCheck(assertion)) {
        violations.push({
          severity: 'medium',
          category: 'missing-error-message',
          file: testFile,
          line: assertion.line,
          testName: testCase.name,
          description: 'toThrow without error message assertion',
          currentCode: assertion.code,
          suggestedFix: addErrorMessageAssertion(assertion.code)
        });
      }
    }

    // 6. Check for parameterization opportunities
    const similarTests = findSimilarTests(testCase, ast);
    if (similarTests.length >= 3) {
      violations.push({
        severity: 'medium',
        category: 'should-parameterize',
        file: testFile,
        line: testCase.line,
        testName: testCase.name,
        description: `${similarTests.length} similar tests could be parameterized with it.each()`,
        currentCode: combineTestCode(similarTests),
        suggestedFix: convertToParameterized(similarTests)
      });
    }
  }

  // Check describe block nesting depth
  const deepNesting = findDeepNesting(ast, maxDepth: 3);
  for (const nested of deepNesting) {
    violations.push({
      severity: 'medium',
      category: 'deep-nesting',
      file: testFile,
      line: nested.line,
      testName: nested.path.join(' > '),
      description: `Nesting depth ${nested.depth} exceeds recommended maximum of 3`,
      currentCode: nested.code,
      suggestedFix: flattenNesting(nested)
    });
  }

  return violations;
}

function isVagueDescription(name: string): boolean {
  const vaguePatterns = [
    /^test/i,
    /^it /,
    /works?$/i,
    /correctly$/i,
    /test \d+/i,
    /^[a-z]+ test$/i
  ];

  return vaguePatterns.some(pattern => pattern.test(name)) ||
         !name.toLowerCase().includes('should');
}

function hasAAAComments(code: string): boolean {
  const arrangePattern = /\/\/\s*Arrange/i;
  const actPattern = /\/\/\s*Act/i;
  const assertPattern = /\/\/\s*Assert/i;

  return arrangePattern.test(code) &&
         actPattern.test(code) &&
         assertPattern.test(code);
}
```

### Exit Codes

- `0`: Successful audit (with or without gaps/violations found)
- `1`: Error during execution (invalid path, permission denied, parse error)
- `2`: No source files found matching criteria
- `3`: Test generation or format fixing failed (if fix-mode ≠ none)
