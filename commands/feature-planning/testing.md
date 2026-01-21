---
description: "Define comprehensive testing strategy and validation commands"
---

# Testing: Validation Strategy

## Mission

Define how the feature will be tested and validated for quality and correctness.

**Core Principle**: Zero code changes. Plan testing approach and validation steps.

**When Stuck**: Ask the user. If you get stuck or are unsure, ask the user to clarify.

**Input**: Implementation plan from previous phase as $ARGUMENTS
**Output**: Testing strategy in `.agents/testing/{feature-name}-testing.md`

## Process

### Step 1: Load Implementation Plan

```bash
PLAN_PATH="$ARGUMENTS"
test -f "$PLAN_PATH" || { echo "Implementation plan not found"; exit 1; }
```

### Step 2: Identify Testing Framework

**Detect test framework:**
```bash
# Check package.json for test scripts
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("test"))'

# Find test files to understand structure
fd test.ts test.rs test.c test.py | head -5
bat tests/**/example.test.* | head -50
```

Document:
- Test framework: Jest | Vitest | pytest | cargo test | Unity
- Test file locations: tests/ structure
- Test naming patterns
- Coverage requirements (check CI config, package.json)

### Step 3: Define Unit Test Strategy

**Scope**: Test individual functions and classes in isolation

```markdown
### Unit Tests

**Framework**: {Vitest | Jest | pytest | cargo test}
**Location**: {tests/ structure}
**Coverage Requirements**: {80%+ or project standard}

**Scope**:
- {Component 1} - {What to test}
- {Component 2} - {What to test}
- {Utility function 1} - {What to test}

Design unit tests with fixtures and assertions following existing patterns.

**Test Files**:
- `path/to/component.test.ts` - {What it tests}
- `path/to/utils.test.ts` - {What it tests}

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

**Scope**: Test feature integration with existing systems

```markdown
### Integration Tests

**Scope**: {What end-to-end scenarios to test}

**Approach**:
- {Integration point 1} - {How to test}
- {Integration point 2} - {How to test}

**Test in {Storybook | Playwright | Cypress}** (if applicable):
- Visual verification of {UI element}
- Interaction testing for {user action}
- {Other integration scenarios}
```

### Step 5: Identify Edge Cases

**Critical edge cases to test:**

```markdown
### Edge Cases

- **{Edge Case 1}**: {Description} - {Expected behavior}
- **{Edge Case 2}**: {Description} - {Expected behavior}
- **{Boundary Condition 1}**: {Description} - {Expected behavior}
- **{Error Scenario 1}**: {Description} - {Expected behavior}

**Examples**:
- **Null/undefined inputs**: Should validate or reject gracefully
- **Boundary values**: Test 0, -1, MAX_INT, empty arrays
- **Concurrent access**: Test race conditions (if applicable)
- **Memory limits**: Test large inputs (for Rust/C)
```

### Step 6: Define Validation Commands

**Extract from project:**
```bash
# Find lint/format commands
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("lint") or contains("format"))'

# Find test commands
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("test"))'

# Find build commands
cat package.json | jq '.scripts | to_entries[] | select(.key | contains("build"))'
```

**Create validation levels:**

```markdown
## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
{Project-specific lint command}
{Project-specific format command}
{Project-specific typecheck command}
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
{Project-specific test for specific file command}
```

### Level 4: Manual Validation

```bash
{Start dev server command}

# {Manual test steps}:
# 1. {Step 1}
# 2. {Step 2}
# Visual checks:
# - {Check 1}
# - {Check 2}
```

### Level 5: Additional Validation (Optional)

```bash
{Bundle size check}
{Performance benchmark}
{Additional project-specific validations}
```
```

### Step 7: Create Test Examples

**Provide concrete test examples for key scenarios:**

```markdown
## Test Examples

### Example 1: {Test Name}

```typescript
// Test: {What this tests}
describe('{ComponentName}', () => {
  it('{specific behavior}', () => {
    // Arrange
    const input = { ... }

    // Act
    const result = component(input)

    // Assert
    expect(result).toEqual(expected)
  })
})
```

### Example 2: {Test Name}

{Another concrete test example}
```

## Output Format

**File**: `.agents/testing/{kebab-case-feature-name}-testing.md`

```markdown
# Testing Strategy: {feature-name}

Date: {timestamp}

---

## TESTING STRATEGY

### Unit Tests

**Scope**: {What will be tested in isolation}

**Framework**: {Test framework name}
**Location**: {Test file structure}
**Coverage Requirements**: {Percentage}

Design unit tests with the following focus:
- {Focus area 1}
- {Focus area 2}
- Edge cases: {list edge cases}

**Test Files**:
- `path/to/test1.test.ts` - {Purpose}
- `path/to/test2.test.ts` - {Purpose}

### Integration Tests

**Scope**: {What integration scenarios to test}

**Approach**:
- {Approach 1}
- {Approach 2}

**Test in {Tool name}**:
- {Test type 1}
- {Test type 2}

### Edge Cases

- **{Edge Case Name}**: {Description and expected behavior}
- **{Edge Case Name}**: {Description and expected behavior}
- **{Boundary Condition}**: {Description and expected behavior}

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
{Command 1}
{Command 2}
```

### Level 2: Type Checking & Build

```bash
{Command 1}
{Command 2}
```

### Level 3: Unit Tests

```bash
{Command 1}
{Command 2}
```

### Level 4: Manual Validation

```bash
{Start command}

# Manual test steps:
# 1. {Step}
# 2. {Step}
```

### Level 5: Additional Validation (Optional)

```bash
{Optional validation commands}
```

---

## Test Examples

### {Test Scenario 1}

```typescript
{Concrete test code example}
```

### {Test Scenario 2}

```typescript
{Concrete test code example}
```
```

## Report to User

After completion:
- Testing strategy file path
- Test framework identified
- Number of validation levels defined
- Number of edge cases identified
- Ready for plan assembly: YES/NO
