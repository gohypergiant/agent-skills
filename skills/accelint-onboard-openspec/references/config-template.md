# OpenSpec config template

Use this template when you show the full preview or build the final `openspec/config.yaml`. Replace unresolved items with `# TODO: fill in` instead of omitting sections.

```yaml
schema: spec-driven

# Project Context
# Injected into every AI-generated artifact (proposal, design, spec, tasks).
# QRSPI principle: objective research layer — facts only, no opinions.

context: |
  # ═══════════════════════════════════════════════════════════════════════════
  # STACK FACTS
  # ═══════════════════════════════════════════════════════════════════════════

  ## Project Identity
  [project name and one-sentence purpose]
  [repo structure: monorepo / single-package / workspaces list]
  [build system and task orchestration]
  [package manager + registries]

  ## Tech Stack
  - Runtime:            [e.g., Node.js 20 LTS]
  - Language:           [e.g., TypeScript 5.4, strict mode, exactOptionalPropertyTypes]
  - Framework:          [e.g., Next.js 14 App Router]
  - Key Libraries:      [domain-specific dependencies with versions]
  - Data Layer:         [databases, ORMs, data formats, query builders]
  - Testing:            [framework, utilities, coverage tooling]
  - Linting/Formatting: [tools and config files in use]
  - Build Tools:        [bundlers, compilers, transpilers]
  - CI/CD:              [platform and key workflow names]
  - Versioning:         [release strategy and changelog tooling]

  ## Architecture Patterns
  - Organisation: [feature-based / layer-based / domain-driven / other]
  - Shared code:  [path to shared utilities / packages]
  - Path aliases: [list of aliases and their resolved paths]
  - Key patterns: [design patterns in common use]

  ## Domain Concepts
  - [Entity or concept]: [one-line definition]
  - [Entity or concept]: [one-line definition]
  - [Entity or concept]: [one-line definition]

  ## Performance Targets
  - [metric]: [target value and context]

  ### TypeScript/JavaScript Performance (if applicable)
  - Hot paths:    [functions executed >1000 times per interaction or >100 times/sec]
  - Frame budget: [for real-time systems: 60fps = 16.67ms, 120fps = 8.33ms]
  - Constraints:  Bounded iteration (explicit limits on loops/queues), O(n) or better algorithmic complexity

  # ═══════════════════════════════════════════════════════════════════════════
  # PATTERNS TO FOLLOW
  # ═══════════════════════════════════════════════════════════════════════════

  ## Code Patterns
  - Exports:         [named / default / mixed — and when each applies]
  - Naming:          [files, variables, functions, constants, types]
  - Error handling:  [throw / Result<T,E> / boundaries / other]
  - Validation:      [approach and library]
  - Constants:       Use `as const` objects, never `enum`
  - Classes:         Prefer functions over classes unless state management required or extending existing class
  - Return values:   Return zero values (empty array, empty string, 0, false) instead of null/undefined
  - Leaf functions:  Leaf functions (bottom of call stack) should be pure — same inputs produce same outputs, no side effects. Centralize state manipulation in parent/orchestrator functions.
  - Type safety:     Avoid `any` (use `unknown` or generics); avoid `enum` (use `as const` objects); use `type` over `interface`
  - Immutability:    Prefer `const`, immutable data structures, pure functions
  - Documentation:   Comprehensive JSDoc for all exported code (@param, @returns, @template, @example)
  - Order:           Internal functions, variables and types should be defined before they are used (internal/export types -> internal/export constants -> internal/export functions)
  - Parameter order: Data-last ordering — place the data being operated on as the final parameter. Enables partial application and composition.
  - Composition:     Use curried functions when the same first parameter(s) recur across call sites.

  ## Architecture Patterns
  - [pattern name]: [brief description of how it's used here]

  ## Testing Patterns
  - Pattern:        AAA (Arrange, Act, Assert) with clear boundaries
  - Property-based: (If available) Use `fast-check` for encode/decode pairs, validators, normalizers, pure functions
  - Test scope:     Never test library internals; never export internals to test them; never mock own pure functions
  - Structure:      [describe/it nesting convention]
  - File location:  [co-located / __tests__ / other]
  - Test doubles:   Hierarchy: real implementation > fakes > stubs > spies > mocks
  - Fixtures:       [factory functions / fixture files / inline data]
  - Assertions:     [preferred assertion style]
  - Nesting:        Max 2 levels of describe blocks — use descriptive test names instead
  - Verification:   MUST run `tsc --noEmit` on test files before marking complete
  - Benchmarks:     [approach if any]

  # NOTE: Commit message convention, PR workflow, and tool preferences
  # are behavioral — they belong in AGENTS.md, not here.

  # ═══════════════════════════════════════════════════════════════════════════
  # PATTERNS TO AVOID
  # ═══════════════════════════════════════════════════════════════════════════

  ## Code Anti-Patterns
  - Using `any` instead of `unknown` or generics
  - Using `enum` instead of `as const` objects
  - Using `interface` when `type` works (prefer type)
  - Returning `null`/`undefined` instead of zero values (empty arrays, empty strings, 0, false)
  - Not validating external data with schemas
  - Deep nesting instead of early returns

  - [anti-pattern]: [why it's banned or deprecated]

  ## Performance Anti-Patterns
  - Chaining array methods (`.filter().map().reduce()`) — use single reduce pass
  - Using `Array.includes()` for repeated lookups (use `Set.has()` for O(1) lookups)
  - Recomputing constants inside loops (hoist invariants outside)
  - Unbounded loops or queues (set explicit limits to prevent runaway resource consumption)
  - Placing `try/catch` in hot paths (V8 cannot inline, 3-5x slowdown)

  - [anti-pattern]: [why it's banned or deprecated]

  ## Testing Anti-Patterns
  - Testing library internals (e.g., verifying Array.prototype.map works)
  - Exporting internal functions just to test them
  - Loose assertions in tests (toBeTruthy, toBeDefined)
  - Nested describe blocks >2 levels deep
  - Testing implementation details instead of behavior

  - [anti-pattern]: [why it's banned or deprecated]

  ## Documentation Anti-Patterns
  - Missing JSDoc on exported functions/types
  - Documenting HOW instead of WHAT/WHY in JSDoc
  - Vague comment markers (`// TODO: fix this` instead of `// TODO: Replace with binary search for O(log n)`)

# ═══════════════════════════════════════════════════════════════════════════
# PER-ARTIFACT RULES
# ═══════════════════════════════════════════════════════════════════════════

rules:
  proposal:
    # QRSPI: Scope definition, not a plan.
    - State the requirement or ticket driving this change
    - Define scope boundaries — explicitly list what is OUT of scope
    - Keep under 100 lines (tight and focused)
    [user-specific proposal rules]

  design:
    # QRSPI: The "brain surgery" checkpoint — reviewed before any code is written.
    # Target ~200 lines capturing current state, desired state, open questions.

    # Required sections (in this order):
    - Start with "Current State": what the code does today, key files, entry
      points, relevant data flows
    - "Desired End State": what changes after this work, what stays the same
    - "Patterns to Follow": ONLY if specific files/functions to reference exist
      for this change's domain
    - "Patterns to Avoid": ONLY if specific anti-patterns apply to this change
    - "Open Questions": genuine uncertainties requiring human input. If none,
      state explicitly "No unresolved questions."
    - "Resolved Decisions": numbered (Decision 1, Decision 2…) with Choice,
      Rationale, Alternatives Considered

    # Technical depth:
    - Use ASCII diagrams for data flows, state machines, architecture
    - Call out performance implications where relevant
    [user-specific design rules]

    # Constraints:
    - Keep under 250 lines total

  tasks:
    # QRSPI: Vertical slicing for early failure detection.

    # Vertical slicing (strong preference):
    - Order as vertical slices — each task delivers a testable end-to-end path
    - Do NOT group by architectural layer unless explicitly justified
    - Horizontal (layer-by-layer) only for pure infrastructure; include
      justification in the task description when used
    - Each task MUST include an explicit "Test:" line describing what to verify
      before proceeding to the next task
    - Prefer 3–5 major slices; more than 5 suggests scope is too large

    # Granularity:
    - Max 2 hours per task; break larger work into subtasks
    [user-specific task tagging, e.g., [PKG:name] or [MODULE:name]]
    - Call out inter-task dependencies explicitly
    [user-specific rollback requirements]
    [user-specific deployment test gates]

  spec:
    - Use Given/When/Then for behaviour specifications
    - Include concrete example data relevant to the domain
    - Document edge cases explicitly
    [user-specific spec rules]

# ═══════════════════════════════════════════════════════════════════════════
# RELATED DOCUMENTATION
# ═══════════════════════════════════════════════════════════════════════════
# Include only files that actually exist in the repository:
# - ARCHITECTURE.md: System overview, deployment, component interactions, data flows
# - AGENTS.md: Agent behavior rules, workflow procedures, communication style
# - README.md: Installation, quick start, usage guide
```
