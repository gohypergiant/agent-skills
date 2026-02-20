# Vitest Best Practices

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining, generating, or refactoring vitest tests. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Expert-level vitest testing guidance designed for AI agents and LLMs. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

**Token efficiency principle:** This guide focuses on expert-level insights and non-obvious patterns. It assumes understanding of basic vitest concepts (`describe`, `it`, `expect`, `vi`) and focuses on decisions experts make: when to mock vs use real code, how to structure tests for maintainability, and performance optimization patterns.

---

## How to Use This Guide

1. **Start here**: Scan the rule summaries to identify relevant patterns
2. **Check for existing setup files**: Before writing tests, look for setup files that configure global mocks and utilities
3. **Load references as needed**: Click through to detailed examples only when implementing
4. **Progressive loading**: Each reference file is self-contained with examples

This structure minimizes context usage while providing complete implementation guidance when needed.

## Workflow: Before Writing Tests

**1. Check vitest.config.ts for global configuration**
Verify mock cleanup is configured globally:
```ts
// Look for these settings:
clearMocks: true      // Mock cleanup configured?
mockReset: true       // Mock reset configured?
restoreMocks: true    // Mock restore configured?
```

If not present, recommend adding them. This eliminates the entire class of mock cleanup errors.

**2. Discover existing test setup files**
Check common locations for test setup configuration:
- `test/setup.{ts,js}` or `testing/setup.{ts,js}`
- `vitest.setup.{ts,js}` or `src/test/setup.{ts,js}`
- Check `vitest.config.ts` for configured `setupFiles` and `globalSetup`

**3. Analyze setup file contents**
When found, identify:
- Global mocks (fetch, timers, etc.)
- Custom matchers (e.g., `@testing-library/jest-dom`)
- Test utilities and helpers
- Environment configuration

**4. Only add per-test cleanup for non-mock resources**
If global config handles mocks, DO NOT add manual mock cleanup:
- ❌ Don't add `vi.clearAllMocks()` (handled by config)
- ✅ Do clean up listeners, connections, custom state

**Principle: Configuration over repetition**
Mock cleanup is a safety concern. Configure it once globally to make forgetting impossible. Manual cleanup in every test violates DRY and creates maintenance burden.

See [vitest-features.md](references/vitest-features.md#discovering-existing-setup-files) and [performance.md](references/performance.md#cleanup-between-tests) for detailed examples.

## Workflow: Before Marking Test Files Complete

Before marking any test file as "complete" or "done", verify type correctness:

**Why this matters:** Test files are typically excluded from `tsconfig.json` compilation (not in `include` paths), so running `tsc` won't catch type errors in tests. Type errors in tests can cause:
- Runtime failures that should have been caught at compile time
- Incorrect test behavior due to type mismatches
- False confidence from tests that don't actually test what they claim

**Verification steps:**

1. **Check test file directly with TypeScript:**
Use the project's package manager to run TypeScript:
```bash
# Detect which package manager to use:
# - npm: npm exec tsc -- --noEmit path/to/test.test.ts
# - pnpm: pnpm exec tsc --noEmit path/to/test.test.ts
# - bun: bunx tsc --noEmit path/to/test.test.ts
# - yarn: yarn exec tsc --noEmit path/to/test.test.ts
```

To detect the package manager, check for:
- `bun.lockb` → use `bunx`
- `pnpm-lock.yaml` → use `pnpm exec`
- `yarn.lock` → use `yarn exec`
- `package-lock.json` → use `npm exec`

2. **Look for common type issues:**
- Mock types not matching actual implementation types
- Test data with missing or incorrect properties
- Assertion types that don't match expected values
- Missing type parameters on generic functions
- Incorrect use of type guards or type assertions

3. **Fix all type errors before marking complete**
- Do NOT use `as any` or `@ts-ignore` to bypass type checking
- Update test data to match actual types
- Fix mock return types to match implementation
- Add proper type annotations where TypeScript cannot infer

**Example type errors to catch:**

```typescript
// ❌ Type error: property 'email' is missing
const user = createUser({ name: 'Alice' })

// ✅ Correct: all required properties provided
const user = createUser({ name: 'Alice', email: 'alice@example.com' })

// ❌ Type error: vi.fn() returns unknown, not User
const mockGetUser = vi.fn().mockReturnValue({ id: 1 })

// ✅ Correct: explicitly type the mock
const mockGetUser = vi.fn<() => User>().mockReturnValue({ id: 1, name: 'Alice', email: 'test@example.com' })
```

**Principle: Type-safe tests prevent silent failures**
Type errors in tests are as critical as type errors in production code. Catch them before marking work complete.

## Workflow: Test Code Review/Audit

When reviewing existing test code (skill invoked with file path or user asks to "review tests" or "audit tests"), follow this systematic approach:

**1. Load property-based-testing.md for pattern detection**
Always load [property-based-testing.md](references/property-based-testing.md) during test audits to check for PBT opportunities.

**2. Identify anti-patterns and violations**
Check for violations of rules in sections 1.1-1.10 below.

**3. Check for property-based testing opportunities**
For each test file, analyze the code under test and identify high-value PBT patterns:

**ALWAYS check for these patterns:**
- **Encode/decode pairs**: Functions like `encode()`/`decode()`, `serialize()`/`deserialize()`, `toJSON()`/`fromJSON()` → Suggest roundtrip property
- **Normalization functions**: `normalize()`, `sanitize()`, `format()` → Suggest idempotence property
- **Validator + normalizer pairs**: `isValid()` + `normalize()` → Suggest "isValid(normalize(x)) always true"
- **Pure transformation functions**: No side effects, deterministic → Multiple properties may apply
- **Sorting/ordering functions**: `sort()`, `compare()` → Suggest ordering + idempotence properties
- **Data structure operations**: Custom collections with invariants → Suggest invariant properties

**When identifying PBT opportunities:**
- Check if fast-check is installed (`package.json` devDependencies)
- If installed: Recommend PBT improvements directly
- If NOT installed: Suggest PBT as an option with user approval required

**4. Generate report using template**
Use [assets/output-report-template.md](assets/output-report-template.md) and include PBT opportunities in a dedicated section.

**Example PBT opportunity detection:**

```typescript
// Code under test:
function get<T>(obj: Record<string, T>, path: string): T | undefined

// Example-based test found:
it('gets nested value', () => {
  expect(get({ a: { b: 1 } }, 'a.b')).toBe(1)
})

// PBT opportunity identified:
// ✅ EXCELLENT CANDIDATE for property-based testing
// Pattern: Pure function with clear invariants
// Properties to test:
// 1. get(obj, path) returns undefined for non-existent paths
// 2. get(obj, path) preserves type (type preservation)
// 3. get(obj, path) never throws on valid inputs
```

**Principle: Proactive improvement suggestions**
Don't wait for users to ask "would any benefit from PBT?" — proactively identify and suggest PBT opportunities as part of every test audit.

---

## 1. General

### 1.1 Organization
Place test files next to implementation; one test file per module.
[View detailed examples](references/organization.md)

### 1.2 AAA Pattern
Structure tests as Arrange, Act, Assert for clarity.
[View detailed examples](references/aaa-pattern.md)

### 1.3 Parameterized Tests
Use `it.each` for variations; one behavior per test.
[View detailed examples](references/parameterized-tests.md)

### 1.4 Error Handling
Test negative cases, fault injection, and recovery thoroughly.
[View detailed examples](references/error-handling.md)

### 1.5 Assertions
Use strict assertions (`toEqual`, `toStrictEqual`) over loose ones.
[View detailed examples](references/assertions.md)

### 1.6 Test Doubles
Prefer fakes > stubs > spies/mocks; avoid over-mocking.
[View detailed examples](references/test-doubles.md)

### 1.7 Async Testing
Test promises, async/await, and timers correctly.
[View detailed examples](references/async-testing.md)

### 1.8 Performance
Keep tests fast through efficient setup and avoiding expensive operations.
[View detailed examples](references/performance.md)

### 1.9 Vitest Features
Use coverage, watch mode, benchmarking, and other vitest-specific features.
[View detailed examples](references/vitest-features.md)

### 1.10 Snapshot Testing
Use snapshots for appropriate cases; avoid common pitfalls.
[View detailed examples](references/snapshot-testing.md)

### 1.11 Property-Based Testing
Use fast-check for stronger coverage with generated inputs; test encode/decode pairs, validators, normalizers, and invariants.
[View detailed examples](references/property-based-testing.md)
