---
name: accelint-feature-test-planning
description: Use when users say "create test plan", "plan testing", "testing strategy", or when defining validation and test coverage for a feature. Analyzes implementation plans to create comprehensive testing strategies with unit tests, integration tests, edge cases, and validation commands. Keywords: test planning, testing strategy, validation, test coverage, QA planning.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
---

# Feature Test Planning

Define comprehensive testing strategy and validation commands for feature implementations.

## NEVER Do When Planning Tests

- **NEVER create test plans without reading the implementation plan** - Testing strategy must align with actual implementation. Testing blindly leads to gaps in coverage.
- **NEVER omit edge cases and boundary conditions** - Empty inputs, null values, max limits, concurrent access are where bugs hide. Testing only happy paths is incomplete.
- **NEVER write generic test examples** - "Test the feature works" is useless. Provide concrete test code with actual assertions, fixtures, and expected values.
- **NEVER ignore existing test patterns** - Every codebase has established test conventions (describe/it structure, fixture patterns, assertion style). Breaking convention creates maintenance burden.
- **NEVER skip validation commands** - Each test level needs exact executable commands. "Run tests" is vague; `pnpm test -- src/feature.test.ts` is actionable.
- **NEVER forget manual validation steps** - Not everything is unit testable. UI verification, visual checks, performance validation need manual procedures.
- **NEVER create tests without framework detection** - Testing approach varies by framework (Jest/Vitest/pytest/cargo test). Must detect and follow project conventions.
- **NEVER omit coverage requirements** - Test coverage standards (80%+ or project-specific) drive testing scope. Check CI config and package.json for requirements.

## Before Planning Tests, Ask

Apply these tests to ensure comprehensive test coverage:

### Test Coverage Analysis
- **What are all the code paths?** Success case, error cases, edge cases, boundary conditions. Testing only success leaves vulnerabilities.
- **What integration points exist?** Where does this feature connect to external systems, APIs, databases? Integration failures are common.
- **What can the user break?** Invalid inputs, unexpected sequences, race conditions. Think adversarially.

### Framework & Tooling
- **What test framework does the project use?** Jest, Vitest, pytest, cargo test, Unity - each has different patterns and capabilities.
- **What's the test file structure?** Co-located with code? Separate tests/ directory? Naming conventions matter for auto-discovery.
- **What coverage tools are configured?** Check package.json, CI config for coverage thresholds and reporting tools.

### Validation Strategy
- **What's the validation pyramid?** Level 1: Syntax/style. Level 2: Type/build. Level 3: Unit tests. Level 4: Manual. Level 5: Performance/bundle.
- **Which validations can be automated?** Maximize automation, minimize manual testing where possible.

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with the Workflow (SKILL.md)
Follow the test planning workflow below to create comprehensive testing strategies.

### 2. Reference Implementation Details (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for test pattern examples and validation level definitions.

### 3. Load Test Framework Patterns as Needed
When implementing specific test types, load corresponding reference files for framework-specific examples.

## Test Planning Workflow

Follow this 7-step workflow to create comprehensive test plans:

**Copy this checklist to track progress:**

```
- [ ] Step 1: Load Implementation Plan - Read implementation plan from previous phase
- [ ] Step 2: Identify Testing Framework - Detect test framework and conventions
- [ ] Step 3: Define Unit Test Strategy - Plan isolated component testing
- [ ] Step 4: Define Integration Test Strategy - Plan end-to-end scenarios
- [ ] Step 5: Identify Edge Cases - Document boundary conditions and error scenarios
- [ ] Step 6: Define Validation Commands - Extract project-specific validation commands
- [ ] Step 7: Create Test Examples - Provide concrete test code examples
```

### Step 1: Load Implementation Plan

Read the implementation plan file provided by the user (passed as argument or specified in request).

**Extract feature name for consistent naming:**
```bash
# Feature name should be kebab-case from implementation plan
rg "^# Implementation Plan: " "$PLAN_PATH" | cut -d':' -f2 | tr -d ' '
```

**Validate plan exists and contains implementation details.**

Skip this step only if implementation plan is already loaded and understood.

### Step 2: Identify Testing Framework

**Detect test framework from project configuration:**
```bash
# Check package.json for test scripts
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("test"))'

# Find test files to understand structure
fd "test\.(ts|rs|c|py)$" | head -5

# Read example test files for patterns
bat tests/**/example.test.* | head -50
```

**Document:**
- Test framework: Jest | Vitest | pytest | cargo test | Unity | other
- Test file locations: Directory structure and naming patterns
- Test naming patterns: Conventions for describe/it blocks or test function names
- Coverage requirements: Check CI config, package.json for thresholds

**Example findings:**
```markdown
**Framework**: Vitest
**Location**: `tests/` directory, mirroring `src/` structure
**Naming**: `{feature}.test.ts` for unit tests
**Coverage**: 80%+ required (from vitest.config.ts)
```

### Step 3: Define Unit Test Strategy

**Scope**: Test individual functions and classes in isolation.

**For each component identified in implementation plan, specify:**
- What to test (specific functions, classes, utilities)
- Expected test files with paths
- Coverage focus areas
- Example test pattern from existing codebase

**Structure:**
```markdown
### Unit Tests

**Framework**: {Test framework name}
**Location**: {Test file structure pattern}
**Coverage Requirements**: {Percentage or project standard}

**Scope**:
- {Component 1 from implementation} - {What aspects to test}
- {Component 2 from implementation} - {What aspects to test}
- {Utility function 1} - {What edge cases to cover}

Design unit tests with fixtures and assertions following existing patterns.

**Test Files**:
- `path/to/component.test.ts` - {What it tests - be specific}
- `path/to/utils.test.ts` - {What utilities covered}

**Example Pattern** (from existing tests):
```typescript
// Pattern from: tests/example.test.ts:15-30
describe('featureName', () => {
  it('should handle success case', () => {
    const result = feature({ input: 'valid' })
    expect(result).toEqual(expected)
  })

  it('should handle error case', () => {
    expect(() => feature({ input: 'invalid' })).toThrow()
  })
})
```
```

### Step 4: Define Integration Test Strategy

**Scope**: Test feature integration with existing systems, APIs, UI components.

**Identify integration points:**
- API endpoint integration
- Database interaction
- UI component integration (if applicable)
- External service communication

**Structure:**
```markdown
### Integration Tests

**Scope**: {What end-to-end scenarios to test}

**Approach**:
- {Integration point 1 from implementation} - {How to test}
- {Integration point 2} - {Test approach and tools}

**Test in {Storybook | Playwright | Cypress | other}** (if applicable):
- Visual verification of {UI element}
- Interaction testing for {user action}
- {Other integration scenarios}

**Integration Test Files**:
- `path/to/integration.test.ts` - {What integration scenario}
```

### Step 5: Identify Edge Cases

**Critical edge cases to test based on implementation:**

**Analyze implementation plan for:**
- Input validation requirements
- Boundary conditions (min/max values, empty collections)
- Error scenarios (network failures, invalid data, permissions)
- Concurrent access patterns (if applicable)
- Resource limits (memory, file size for Rust/C)

**Structure:**
```markdown
### Edge Cases

- **{Edge Case Name}**: {Description of scenario} - {Expected behavior}
- **{Edge Case Name}**: {Specific condition} - {How system should respond}
- **{Boundary Condition}**: {Limit being tested} - {Expected handling}
- **{Error Scenario}**: {Failure mode} - {Graceful degradation expected}

**Examples**:
- **Null/undefined inputs**: Should validate inputs and reject gracefully with clear error
- **Boundary values**: Test 0, -1, MAX_INT, empty arrays, single-element arrays
- **Concurrent access**: Test race conditions if feature has shared state
- **Memory limits**: Test large inputs for Rust/C features with bounded resources
```

### Step 6: Define Validation Commands

**Extract validation commands from project configuration:**
```bash
# Find lint/format commands
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("lint") or contains("format"))'

# Find test commands
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("test"))'

# Find build commands
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("build"))'

# Check for additional validation (bundle size, performance)
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("bundle") or contains("perf"))'
```

**Create validation levels using actual project commands:**

```markdown
## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
{Project-specific lint command from package.json}
{Project-specific format command}
{Project-specific typecheck command if separate}
```

### Level 2: Type Checking & Build

```bash
{Project-specific build command}
{Project-specific package lint command}
```

### Level 3: Unit Tests

```bash
{Project-specific test command}
{Project-specific test with coverage command}
{Project-specific test for specific file pattern}
```

### Level 4: Manual Validation

```bash
{Start dev server command}

# Manual test steps:
# 1. {Specific user action to test}
# 2. {Expected outcome verification}
# Visual checks:
# - {UI element verification}
# - {Behavior verification}
```

### Level 5: Additional Validation (Optional)

```bash
{Bundle size check if configured}
{Performance benchmark if applicable}
{Additional project-specific validations}
```
```

### Step 7: Create Test Examples

**Provide 2-3 concrete test examples for key scenarios from implementation plan.**

**Each example should include:**
- Actual test code (not pseudocode)
- Arrange-Act-Assert structure
- Specific assertions with expected values
- Reference to component being tested

**Structure:**
```markdown
## Test Examples

### Example 1: {Specific Test Scenario}

```typescript
// Test: {What this validates from acceptance criteria}
// Component: {From implementation plan}
describe('{ComponentName}', () => {
  it('{specific behavior being tested}', () => {
    // Arrange
    const input = { field: 'value' }
    const expected = { result: 'expected' }

    // Act
    const result = componentFunction(input)

    // Assert
    expect(result).toEqual(expected)
  })

  it('{error case from edge cases}', () => {
    // Arrange
    const invalidInput = { field: null }

    // Act & Assert
    expect(() => componentFunction(invalidInput)).toThrow('Expected error message')
  })
})
```

### Example 2: {Another Key Scenario}

```typescript
{Another concrete test example from implementation plan}
```
```

## Output Format

**File location**: `.agents/testing/{kebab-case-feature-name}-testing.md`

The testing strategy file structure:

```markdown
# Testing Strategy: {Feature Name}

Date: {ISO 8601 timestamp}

---

## TESTING STRATEGY

### Unit Tests

**Framework**: {Test framework name from detection}
**Location**: {Test file structure pattern}
**Coverage Requirements**: {Percentage or standard}

**Scope**:
- {Component 1} - {What to test}
- {Component 2} - {What to test}
- Edge cases: {List specific edge cases}

Design unit tests with the following focus:
- {Focus area 1 from implementation}
- {Focus area 2}

**Test Files**:
- `path/to/test1.test.ts` - {Purpose and coverage}
- `path/to/test2.test.ts` - {Purpose and coverage}

### Integration Tests

**Scope**: {What integration scenarios to test}

**Approach**:
- {Approach 1 with specific integration point}
- {Approach 2}

**Test in {Tool name}**:
- {Specific test type}
- {Specific scenario}

### Edge Cases

- **{Edge Case Name}**: {Description} - {Expected behavior}
- **{Boundary Condition}**: {Description} - {Expected handling}
- **{Error Scenario}**: {Description} - {Graceful degradation}

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
{Command 1 from package.json}
{Command 2}
```

### Level 2: Type Checking & Build

```bash
{Build command}
{Type check command}
```

### Level 3: Unit Tests

```bash
{Test command}
{Coverage command}
```

### Level 4: Manual Validation

```bash
{Dev server start command}

# Manual test steps:
# 1. {Specific step}
# 2. {Verification step}
# Visual checks:
# - {Check 1}
# - {Check 2}
```

### Level 5: Additional Validation (Optional)

```bash
{Optional validation commands if configured}
```

---

## Test Examples

### {Test Scenario 1 Name}

```typescript
{Concrete test code with actual assertions}
```

### {Test Scenario 2 Name}

```typescript
{Concrete test code}
```
```

## Report to User

After completing the test planning:
- Testing strategy file path
- Test framework identified
- Number of validation levels defined
- Number of edge cases identified
- Number of test examples provided
- Coverage requirements documented

## Important Notes

- Test planning is research-only work. Never write actual test code during planning phase.
- Validation commands must be exact and executable. Copy them from package.json scripts.
- Edge cases are where bugs hide. Document them explicitly for implementation phase.
- Test examples should match existing project patterns to ensure consistency.
