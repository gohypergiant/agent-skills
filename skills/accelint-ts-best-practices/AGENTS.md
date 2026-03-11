# JavaScript and TypeScript Best Practices

## Abstract

Comprehensive coding standards for JavaScript and TypeScript applications, designed for AI agents and LLMs. This guide focuses on **code correctness, type safety, and defensive programming**. Each rule includes one-line summaries here, with links to detailed examples in the `references/` folder. Load reference files only when you need detailed implementation guidance for a specific rule.

**Note:** For performance optimization tasks, use the `accelint-ts-performance` skill instead. For documentation tasks, use the `accelint-ts-documentation` skill.

---

## How to Use This Guide

### Option 1: Use Automation Scripts (Recommended)

For maximum efficiency, use the provided scripts to automate detection and reporting:
- **[scripts/detect-best-practice-violations.sh](scripts/detect-best-practice-violations.sh)** - Scan for violations, output JSON
- **[scripts/generate-audit-report.sh](scripts/generate-audit-report.sh)** - Generate pre-filled audit report
- **[scripts/quick-categorize.sh](scripts/quick-categorize.sh)** - Quick categorization lookup

Scripts catch ~60-70% of mechanical violations automatically. See [scripts/README.md](scripts/README.md) for coverage model and workflow.

**Context savings: ~2,100 tokens per audit**

### Option 2: Manual Review

1. **Start here**: Scan the rule summaries to identify relevant patterns
2. **Load references as needed**: Click through to detailed examples only when implementing
3. **Progressive loading**: Each reference file is self-contained with ❌/✅ examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Decision Framework (Read First)

Before applying specific rules, use these thinking frameworks for trade-offs:

1. **Safety vs Performance**: External/production data? → Safety first (bounded iteration, validation, explicit errors)
2. **Type Strictness vs Pragmatism**: System boundary (API, user input, third-party lib)? → Use `unknown` + validate
3. **Abstraction vs Concreteness**: Pattern appears 3+ times? → Apply "3×3 rule" (3+ instances AND 3+ lines AND simpler)
4. **Null Handling**: Caller distinguishes "absent" from "empty"? → NO: return [], YES: return T | undefined
5. **Error Handling**: Expected failure? → Result type; Programmer error? → Assertion/crash
6. **When to Break Rules**: External API contract, proven bottleneck (profile first), or type system limitation (document why)

See SKILL.md "Decision Framework" section for detailed guidance on each.

## Loading Strategy

**When writing new code:**
- **MANDATORY**: Read [quick-start.md](references/quick-start.md) for complete workflow examples
- Apply decision frameworks from SKILL.md before choosing patterns
- Load specific pattern files only as you encounter relevant scenarios
- Start with the pattern, then check related safety rules

**When reviewing existing code:**
- Start with the rule summaries below to identify anti-patterns
- Load corresponding reference files for detailed fixes
- **Do NOT load all references at once** - use progressive loading

**When fixing type errors:**
- Read [any.md](references/any.md) if encountering `any` types
- Read [enums.md](references/enums.md) if replacing `enum`
- Read [type-vs-interface.md](references/type-vs-interface.md) for declaration choices
- Read [edge-cases.md](references/edge-cases.md) for non-obvious TypeScript soundness holes

**When implementing safety features:**
- **MANDATORY**: Read [input-validation.md](references/input-validation.md) for external data
- Read [bounded-iteration.md](references/bounded-iteration.md) for any loops or queues
- Read [error-handling.md](references/error-handling.md) for proper error patterns

**General rule:** Load reference files on-demand based on the specific pattern you're implementing. Each reference is self-contained with ❌/✅ examples.

---

## Critical Anti-Patterns (Learned the Hard Way)

**NEVER** do these - each has caused production incidents:

- **NEVER** use `any` type — one `any` at API boundary infected 127 variables across 8 files, causing 2-day debugging incident when API changed; use `unknown` + validation
- **NEVER** use `enum` keyword — 50 enums added 8KB of dead code that couldn't tree-shake; use `as const` objects for zero-cost constants
- **NEVER** use `interface` for simple aliases — accidental declaration merging with third-party library caused runtime errors; use `type` by default
- **NEVER** mutate function parameters — `items.sort()` mutated React state directly, bypassing change detection and causing stale UI; use immutable patterns
- **NEVER** return `null` or `undefined` — one function returning `null` cascaded to 237 defensive null checks; return zero values ([], {}, 0, "")
- **NEVER** create unbounded loops or queues — queue exhaustion during traffic spike consumed 8GB RAM, caused 3-hour outage; set explicit `MAX_ITERATIONS`, `MAX_QUEUE_SIZE`

See individual reference files for detailed production lessons, alternatives, and ✅ correct patterns.

---

## 1. General Best Practices

### 1.1 Naming Conventions
Append qualifiers in descending order (latencyMsMax not maxLatencyMs) to enable autocomplete grouping; prefix booleans with `is`/`has`.
[View detailed examples](references/naming-conventions.md)

### 1.2 Functions
Keep functions under 50 lines; explicitly type return values; avoid defaults; use `function` keyword for pure functions.
[View detailed examples](references/functions.md)

### 1.3 Control Flow
Always use block style `{ }` for control flow (prevents bugs when adding code); use early returns for guard clauses.
[View detailed examples](references/control-flow.md)

### 1.4 State Management
Use `const` to signal immutability; never mutate function parameters (creates hidden side effects); keep leaf functions pure for testability.
[View detailed examples](references/state-management.md)

### 1.5 Return Values
Return zero values ([], {}, 0, '') instead of null/undefined to eliminate defensive null checks and enable method chaining and composition.
[View detailed examples](references/return-values.md)

### 1.6 Misc
Use Linux line endings; employ defensive programming; aim for zero technical debt.
[View detailed examples](references/misc.md)

### 1.7 Code Duplication (DRY Principle)
Extract common patterns into utility functions; consolidate duplicated logic; apply DRY when abstraction reduces complexity.
[View detailed examples](references/code-duplication.md)

---

## 2. TypeScript

### 2.1 Any
Never use `any` (disables type checking and propagates through codebase); use `unknown` to force validation or generics to preserve types.
[View detailed examples](references/any.md)

### 2.2 Enums
Never use `enum` (generates 5+ lines of runtime code per enum); use `as const` objects for zero-cost type-safe constants.
[View detailed examples](references/enums.md)

### 2.3 Type vs. Interface
Prefer `type` over `interface`; use `interface` only for declaration merging or class contracts.
[View detailed examples](references/type-vs-interface.md)

### 2.4 Edge Cases
Non-obvious TypeScript traps: array[0] undefined, Object.keys() widening, async error swallowing, MAX_SAFE_INTEGER, Partial<T> footgun, setTimeout types.
[View detailed examples](references/edge-cases.md)

---

## 3. Safety

### 3.1 Input Validation
Always validate and sanitize external data at system boundaries with schemas.
[View detailed examples](references/input-validation.md)

### 3.2 Assertions
Use assertions to detect programmer errors; split compound assertions; include values.
[View detailed examples](references/assertions.md)

### 3.3 Error Handling
Handle all errors explicitly; use Result types or try-catch blocks; never swallow errors silently.
[View detailed examples](references/error-handling.md)

### 3.4 Error Messages
Make user errors empathetic and actionable; make developer errors specific with values.
[View detailed examples](references/error-messages.md)

### 3.5 Bounded Iteration
Never create unbounded loops, queues, or recursive calls; set explicit limits to prevent runaway resource consumption and system crashes.
[View detailed examples](references/bounded-iteration.md)

---

## 4. Performance

**For performance optimization tasks**, use the `accelint-ts-performance` skill instead. It provides:
- 4-phase workflow (Profile → Analyze → Optimize → Verify)
- Comprehensive optimization patterns for all performance categories
- Profiling tool guidance (Chrome DevTools, Node.js --prof)
- Bottleneck categorization and decision frameworks

---

## 5. Documentation

**For documentation-specific tasks**, use the `accelint-ts-documentation` skill instead. It provides comprehensive guidance for JSDoc comments, comment markers, and code comment quality.
