# Property-Based Testing with fast-check

Property-based testing generates hundreds of random test inputs to verify that properties (invariants) hold for all inputs, providing stronger coverage than example-based tests. Use fast-check with vitest for TypeScript/JavaScript property testing.

## When to Use Property-Based Testing

**High-value patterns where PBT provides stronger coverage:**

| Pattern | Example Code | Property to Test |
|---------|--------------|------------------|
| **Encode/decode pairs** | `encode()` / `decode()` | Roundtrip: `decode(encode(x)) === x` |
| **Serialization** | `toJSON()` / `fromJSON()` | Roundtrip equality |
| **Normalization** | `normalize()`, `sanitize()` | Idempotence: `f(f(x)) === f(x)` |
| **Validators** | `isValid()`, `validate()` | Valid after normalize |
| **Pure functions** | No side effects | Multiple properties apply |
| **Data structures** | Custom collections | Invariants preserved |
| **Parsers** | URL, config, protocol | Inverse or invariants |
| **Sorting/ordering** | `sort()`, `compare()` | Ordering + idempotence |

**When NOT to use PBT:**
- Simple CRUD without complex validation
- UI/presentation logic
- Integration tests requiring complex external setup
- Prototyping with fluid requirements

## Prerequisites

Property-based testing with vitest requires the `fast-check` package.

**Before writing property-based tests**, verify it's installed:

```bash
# Check if fast-check is in package.json devDependencies
grep -q "fast-check" package.json && echo "✓ fast-check is installed" || echo "⚠ fast-check not found"
```

If `fast-check` is not installed, you have two options:

1. **Install it** (requires user approval):
   - Detect the package manager by checking for lock files (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `bun.lockb` → bun)
   - Use the appropriate command:
     ```bash
     npm install --save-dev fast-check    # for npm
     pnpm add -D fast-check              # for pnpm
     bun add -d fast-check               # for bun
     ```

2. **Write example-based tests instead** - Use standard vitest assertions without property-based testing.

**Important:** Do not install packages without explicit user permission. If fast-check is missing, inform the user and ask whether to:
- Install fast-check and write property-based tests (detect and use their package manager)
- Write example-based tests with the existing setup

## Property Catalog

| Property | Formula | When to Use |
|----------|---------|-------------|
| **Roundtrip** | `decode(encode(x)) === x` | Serialization, conversion pairs |
| **Idempotence** | `f(f(x)) === f(x)` | Normalization, formatting, sorting |
| **Invariant** | Property holds before/after | Any transformation |
| **Commutativity** | `f(a, b) === f(b, a)` | Binary/set operations |
| **Associativity** | `f(f(a,b), c) === f(a, f(b,c))` | Combining operations |
| **Identity** | `f(x, identity) === x` | Operations with neutral element |
| **Inverse** | `f(g(x)) === x` | encrypt/decrypt, compress/decompress |
| **Oracle** | `newImpl(x) === reference(x)` | Optimization, refactoring |
| **Easy to Verify** | `isSorted(sort(x))` | Complex algorithms |
| **Type Preservation** | Output type matches expected | Typed transformations |
| **No Exception** | No crash on valid input | Baseline (weakest) property |

**Strength hierarchy** (weakest to strongest):
No Exception → Type Preservation → Invariant → Idempotence → Roundtrip

## Basic Pattern with Vitest

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('MessageCodec', () => {
  it('roundtrip: decode(encode(x)) === x', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          content: fc.string({ maxLength: 1000 }),
          priority: fc.integer({ min: 1, max: 10 }),
        }),
        (msg) => {
          const encoded = encode(msg)
          const decoded = decode(encoded)
          expect(decoded).toEqual(msg)
        }
      )
    )
  })
})
```

## Fast-Check Arbitraries (Generators)

### Primitive Types

```typescript
fc.integer()                           // Any integer
fc.integer({ min: 0, max: 100 })      // Constrained range
fc.float()                             // Floating point
fc.boolean()                           // true/false
fc.string()                            // Any string
fc.string({ maxLength: 100 })         // Size-limited string
fc.constantFrom('a', 'b', 'c')        // Enum-like
fc.uuid()                              // UUID v4
fc.emailAddress()                      // Email format
fc.webUrl()                            // Valid URLs
fc.date()                              // Date objects
```

### Collections

```typescript
fc.array(fc.integer())                 // Array of integers
fc.array(fc.string(), { maxLength: 10 }) // Size-limited array
fc.set(fc.integer())                   // Set (unique values)
fc.dictionary(fc.string(), fc.integer()) // Object with string keys
fc.tuple(fc.string(), fc.integer())    // Fixed-size tuple
fc.option(fc.string())                 // string | null
fc.oneof(fc.string(), fc.integer())    // Union types
```

### Complex Objects

```typescript
// Using fc.record for object types
const userArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  age: fc.integer({ min: 0, max: 150 }),
  email: fc.emailAddress(),
  tags: fc.array(fc.string(), { maxLength: 10 }),
})

// Using custom constraints
const positiveIntegerArbitrary = fc.integer({ min: 1 })
```

### Building Constraints into Arbitraries

❌ **Incorrect - using filter (slow, rejection-prone):**

```typescript
fc.assert(
  fc.property(
    fc.integer(),
    (x) => {
      fc.pre(x > 0 && x < 100)  // BAD: high rejection rate
      expect(process(x)).toBeGreaterThan(0)
    }
  )
)
```

✅ **Correct - constraints in arbitrary:**

```typescript
fc.assert(
  fc.property(
    fc.integer({ min: 1, max: 99 }),  // GOOD: built-in constraints
    (x) => {
      expect(process(x)).toBeGreaterThan(0)
    }
  )
)
```

## Common Patterns

### Pattern 1: Roundtrip (Encode/Decode)

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { encodeMessage, decodeMessage } from './codec'

describe('Message codec roundtrip', () => {
  it('decode(encode(msg)) === msg', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          body: fc.string({ maxLength: 1000 }),
          timestamp: fc.date(),
        }),
        (msg) => {
          const encoded = encodeMessage(msg)
          const decoded = decodeMessage(encoded)
          expect(decoded).toEqual(msg)
        }
      ),
      { numRuns: 100 }  // Run 100 random examples
    )
  })

  it('encoding is deterministic', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          body: fc.string(),
        }),
        (msg) => {
          expect(encodeMessage(msg)).toEqual(encodeMessage(msg))
        }
      )
    )
  })
})
```

### Pattern 2: Idempotence (Normalization)

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { normalizeEmail } from './validators'

describe('Email normalization', () => {
  it('normalize(normalize(email)) === normalize(email)', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          const normalized = normalizeEmail(email)
          expect(normalizeEmail(normalized)).toBe(normalized)
        }
      )
    )
  })

  it('normalized emails are always lowercase', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          const normalized = normalizeEmail(email)
          expect(normalized).toBe(normalized.toLowerCase())
        }
      )
    )
  })
})
```

### Pattern 3: Validator + Normalizer

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { isValidUsername, normalizeUsername } from './validators'

describe('Username validation', () => {
  it('normalized usernames always pass validation', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (username) => {
          const normalized = normalizeUsername(username)
          if (normalized !== null) {
            expect(isValidUsername(normalized)).toBe(true)
          }
        }
      )
    )
  })
})
```

### Pattern 4: Invariants

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { sort } from './utils'

describe('Sort function', () => {
  it('maintains length', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (arr) => {
          expect(sort(arr)).toHaveLength(arr.length)
        }
      )
    )
  })

  it('maintains elements', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (arr) => {
          const sorted = sort(arr)
          expect([...sorted].sort((a, b) => a - b)).toEqual(
            [...arr].sort((a, b) => a - b)
          )
        }
      )
    )
  })

  it('produces ordered output', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (arr) => {
          const sorted = sort(arr)
          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i]).toBeLessThanOrEqual(sorted[i + 1])
          }
        }
      )
    )
  })

  it('is idempotent', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (arr) => {
          expect(sort(sort(arr))).toEqual(sort(arr))
        }
      )
    )
  })
})
```

### Pattern 5: Oracle (Refactoring)

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { optimizedSearch, referenceSearch } from './search'

describe('Optimized search matches reference', () => {
  it('optimizedSearch(q, items) === referenceSearch(q, items)', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.record({
          id: fc.uuid(),
          title: fc.string(),
          content: fc.string(),
        })),
        (query, items) => {
          expect(optimizedSearch(query, items)).toEqual(
            referenceSearch(query, items)
          )
        }
      )
    )
  })
})
```

## Configuration

### Test Settings

```typescript
fc.assert(
  fc.property(
    arbitrary,
    (value) => {
      // test
    }
  ),
  {
    numRuns: 100,        // Number of test cases (default: 100)
    seed: 42,            // Reproducible randomness
    endOnFailure: false, // Continue after first failure
    verbose: true,       // Show counterexamples
  }
)
```

**Recommended settings by environment:**

```typescript
// Development (fast feedback)
{ numRuns: 10 }

// CI (thorough)
{ numRuns: 200 }

// Nightly/Release (exhaustive)
{ numRuns: 1000 }
```

### Including Edge Cases

Always add explicit examples alongside property tests:

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Process function', () => {
  // Property-based test
  it('handles all valid inputs', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        (arr) => {
          expect(process(arr)).toBeDefined()
        }
      )
    )
  })

  // Explicit edge cases
  it('handles empty array', () => {
    expect(process([])).toEqual([])
  })

  it('handles single element', () => {
    expect(process([1])).toEqual([1])
  })

  it('handles duplicates', () => {
    expect(process([1, 1, 1])).toEqual([1])
  })

  it('handles negative numbers', () => {
    expect(process([-1, -2, -3])).toBeDefined()
  })
})
```

## Anti-Patterns

### ❌ Tautological Properties

Tests that are always true regardless of implementation:

```typescript
// BAD - compares function to itself
it('tautology', () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer()),
      (arr) => {
        expect(sort(arr)).toEqual(sort(arr))  // Always true!
      }
    )
  )
})
```

### ❌ Weak Properties Only

Testing only that function doesn't crash:

```typescript
// WEAK - only tests no exception
it('weak property', () => {
  fc.assert(
    fc.property(
      fc.string(),
      (s) => {
        process(s)  // No assertion!
      }
    )
  )
})

// BETTER - test actual behavior
it('stronger property', () => {
  fc.assert(
    fc.property(
      fc.string(),
      (s) => {
        const result = process(s)
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThanOrEqual(0)
      }
    )
  )
})
```

### ❌ Reimplementing the Function

```typescript
// BAD - just reimplements the logic
it('reimplementation', () => {
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer(),
      (a, b) => {
        expect(add(a, b)).toBe(a + b)  // If add is `a + b`, tests nothing
      }
    )
  )
})

// BETTER - test algebraic properties
it('algebraic properties', () => {
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer(),
      (a, b) => {
        expect(add(a, 0)).toBe(a)           // Identity
        expect(add(a, b)).toBe(add(b, a))   // Commutativity
      }
    )
  )
})
```

### ❌ Over-filtering with fc.pre()

```typescript
// BAD - high rejection rate
it('over-filtered', () => {
  fc.assert(
    fc.property(
      fc.integer(),
      (x) => {
        fc.pre(x > 0 && x < 100 && x % 2 === 0)  // Rejects most inputs
        expect(process(x)).toBeGreaterThan(0)
      }
    )
  )
})

// GOOD - constraints in arbitrary
it('constrained properly', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 1, max: 99 }).filter(x => x % 2 === 0),
      (x) => {
        expect(process(x)).toBeGreaterThan(0)
      }
    )
  )
})
```

## Detecting PBT Opportunities

When writing or reviewing tests, look for these patterns:

**1. Serialization/Deserialization:**
```typescript
// Code pattern detected:
function encode(data: T): string
function decode(encoded: string): T

// Suggest: Roundtrip property
```

**2. Validation + Normalization:**
```typescript
// Code pattern detected:
function normalize(input: string): string
function isValid(input: string): boolean

// Suggest: "isValid(normalize(x)) always true" property
```

**3. Pure Functions with Types:**
```typescript
// Code pattern detected:
function transform(input: Input): Output

// Suggest: Multiple properties (type preservation, invariants)
```

## Integration with Existing Tests

Property-based tests complement example-based tests:

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Password validation', () => {
  // Example-based tests for specific cases
  it('rejects passwords shorter than 8 characters', () => {
    expect(isValidPassword('abc')).toBe(false)
  })

  it('rejects passwords without numbers', () => {
    expect(isValidPassword('abcdefgh')).toBe(false)
  })

  it('accepts valid passwords', () => {
    expect(isValidPassword('abcd1234')).toBe(true)
  })

  // Property-based test for broad coverage
  it('all valid passwords meet minimum requirements', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 8, maxLength: 100 })
          .filter(s => /\d/.test(s) && /[a-z]/.test(s)),
        (password) => {
          if (isValidPassword(password)) {
            expect(password.length).toBeGreaterThanOrEqual(8)
            expect(password).toMatch(/\d/)
            expect(password).toMatch(/[a-z]/)
          }
        }
      )
    )
  })
})
```

## When to Suggest PBT to Users

If you detect high-value PBT patterns while writing tests, offer PBT as an option:

**Codebase has fast-check installed:**
```
"This codebase uses fast-check. I'll write property-based tests for this
encode/decode pair using a roundtrip property for stronger coverage."
```

**Codebase doesn't have fast-check:**
```
"I notice encode/decode is a serialization pair. Property-based testing with
fast-check would provide stronger coverage than example tests. Want me to:
1. Write example-based tests (simpler, already set up)
2. Add fast-check and write property-based tests (stronger coverage)"
```

**User declines:**
Write good example-based tests without further prompting.

## Debugging Failed Properties

When fast-check finds a counterexample:

```typescript
// Fast-check output:
// Property failed after 42 tests
// Counterexample: { id: "", content: "a", priority: 0 }
// Shrunk 5 times
// Seed: 1234567890
```

**Steps:**
1. **Reproduce**: Use the seed to reproduce: `{ seed: 1234567890 }`
2. **Analyze**: The counterexample is already minimized (shrunk)
3. **Fix**: Either fix the implementation or adjust the property/arbitrary
4. **Verify**: Re-run with same seed to confirm fix

## Complete Example

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { ConfigParser } from './config-parser'

describe('ConfigParser properties', () => {
  const configArbitrary = fc.record({
    apiUrl: fc.webUrl(),
    timeout: fc.integer({ min: 0, max: 30000 }),
    retries: fc.integer({ min: 0, max: 10 }),
    enabled: fc.boolean(),
  })

  it('roundtrip: parse(serialize(config)) === config', () => {
    fc.assert(
      fc.property(
        configArbitrary,
        (config) => {
          const serialized = ConfigParser.serialize(config)
          const parsed = ConfigParser.parse(serialized)
          expect(parsed).toEqual(config)
        }
      ),
      { numRuns: 200 }
    )
  })

  it('serialization is deterministic', () => {
    fc.assert(
      fc.property(
        configArbitrary,
        (config) => {
          const first = ConfigParser.serialize(config)
          const second = ConfigParser.serialize(config)
          expect(first).toBe(second)
        }
      )
    )
  })

  it('serialized format is always valid JSON', () => {
    fc.assert(
      fc.property(
        configArbitrary,
        (config) => {
          const serialized = ConfigParser.serialize(config)
          expect(() => JSON.parse(serialized)).not.toThrow()
        }
      )
    )
  })

  // Edge cases as example-based tests
  it('handles empty timeout (0)', () => {
    const config = { apiUrl: 'http://api.com', timeout: 0, retries: 3, enabled: true }
    expect(ConfigParser.parse(ConfigParser.serialize(config))).toEqual(config)
  })

  it('handles maximum retries', () => {
    const config = { apiUrl: 'http://api.com', timeout: 1000, retries: 10, enabled: false }
    expect(ConfigParser.parse(ConfigParser.serialize(config))).toEqual(config)
  })
})
```

## Review Checklist

When reviewing property-based tests:

- [ ] Not tautological (doesn't compare same expression)
- [ ] Strong property (not just "no crash")
- [ ] Arbitraries have realistic constraints
- [ ] Not over-filtered (minimal use of `fc.pre()`)
- [ ] Edge cases covered with explicit example tests
- [ ] Appropriate numRuns for context (dev vs CI)
- [ ] Not reimplementing function logic
- [ ] Properties match code patterns (roundtrip for encode/decode, etc.)

## Summary

Property-based testing with fast-check provides:
- **Broader coverage**: Tests hundreds of generated inputs
- **Edge case discovery**: Finds cases you didn't think of
- **Regression prevention**: Failing seeds can be preserved
- **Refactoring confidence**: Properties ensure behavior preserved

Use PBT for high-value patterns (serialization, validation, pure functions) and complement with example-based tests for specific cases.
