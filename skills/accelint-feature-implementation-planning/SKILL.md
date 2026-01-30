---
name: accelint-feature-implementation-planning
description: Use when users say "create implementation plan", "plan the implementation", "research for implementation", or when turning acceptance criteria into executable tasks. Performs deep codebase analysis to create detailed, ordered implementation tasks with patterns, validation, and dependencies. Keywords: implementation plan, task planning, codebase research, implementation tasks, development planning.
license: Apache-2.0
metadata:
  author: gohypergiant
  version: "1.0"
---

# Feature Implementation Planning

Transform acceptance criteria into detailed, executable implementation plans through comprehensive codebase research.

## NEVER Do When Planning Implementation

- **NEVER make code changes during planning** - This phase is pure research. Zero edits. Document patterns, don't modify them.
- **NEVER create tasks without dependency ordering** - Tasks must be sequenced: types → utils → core → integration → tests. Wrong order = broken builds.
- **NEVER reference code without specific line numbers** - "See auth.ts" is useless. "See auth.ts:45-67 for error handling pattern" is actionable.
- **NEVER omit validation commands** - Every task needs an executable validation step. "Run tests" is vague; `pnpm test -- src/feature.test.ts` is concrete.
- **NEVER skip pattern extraction** - Implementation needs actual code examples: error handling, logging, naming conventions, file structure. Generic advice fails.
- **NEVER create ambiguous tasks** - "Add feature logic" is unclear. "CREATE src/features/auth/validator.ts implementing email validation per RFC 5322" is specific.
- **NEVER forget external documentation** - Link to specific sections with anchors: `https://docs.example.com#exact-section`, not just homepage URLs.
- **NEVER assume one approach** - Document design decisions, trade-offs, and alternatives considered. Future maintainers need context.

## Before Planning Implementation, Ask

Apply these tests to ensure thorough planning:

### Pattern Recognition
- **What similar features already exist?** Finding analogous implementations reveals project conventions faster than reading docs.
- **What are the naming patterns?** File naming (kebab-case vs snake_case), variable conventions, type definitions must match existing code.
- **How does error handling work here?** Result types? Exceptions? Try-catch? Logging patterns? Extract actual examples with line references.

### Dependency Mapping
- **What's the dependency order?** Types can't depend on implementation. Tests depend on everything. Map the DAG before creating tasks.
- **What integration points exist?** Where does new code connect to existing systems? Router registration? Export additions? Configuration updates?

### Validation Strategy
- **How do I verify each step?** Every task needs objective validation: typecheck, test, lint, build. Catch errors early.
- **What could break?** Known gotchas, library quirks, platform constraints must be documented upfront.

## Implementation Planning Process

Follow this 8-step workflow to create comprehensive implementation plans:

**Copy this checklist to track progress:**

```
- [ ] Step 1: Load Requirements - Read acceptance criteria file
- [ ] Step 2: Codebase Intelligence - Find patterns and conventions
- [ ] Step 3: Integration Points - Identify files to read/create/update
- [ ] Step 4: External Documentation - Research libraries and APIs
- [ ] Step 5: Code Pattern Extraction - Extract actual code examples
- [ ] Step 6: Implementation Phases - Create high-level phases
- [ ] Step 7: Atomic Tasks - Break into ordered, testable tasks
- [ ] Step 8: Design Decisions - Document rationale and trade-offs
```

### Step 1: Load Requirements

Read the acceptance criteria file provided by the user.

**Extract feature name for consistent naming:**
```bash
# Feature name should be kebab-case from acceptance file
rg "^# Acceptance: " "$REQUIREMENTS_PATH" | cut -d' ' -f3
```

**Validate requirements exist and are readable.**

Skip this step only if requirements are already loaded and understood.

### Step 2: Codebase Intelligence - Find Patterns

**Identify project structure and language:**
```bash
# Check for config files to understand project type
cat package.json tsconfig.json Cargo.toml pyproject.toml 2>/dev/null

# Sample file structure to understand organization
fd -t f -e ts -e rs -e c -e py | head -20
```

**Find similar implementations:**
Use Grep to search for analogous features or patterns. Look for:
- Similar domain logic (auth, validation, API endpoints)
- Common patterns (error handling, logging, testing)
- File organization conventions

**Document from the codebase:**
- File organization patterns (feature folders, flat structure, domain-driven)
- Naming conventions (files: kebab-case? variables: camelCase? types: PascalCase?)
- Import/export patterns (default exports vs named, barrel files)
- Logger usage patterns (which logger? How instantiated? Log levels?)
- Error handling patterns (Result types? Try-catch? Error classes?)
- Anti-patterns observed (what NOT to do based on existing issues)

**Check project conventions:**
```bash
# Look for project-specific guidelines
bat CLAUDE.md AGENTS.md .agents/README.md 2>/dev/null
```

### Step 3: Identify Integration Points

Determine what files need to be touched.

**Files to Read (with specific line ranges):**

Find existing implementations that provide patterns:
```bash
# Example: Find similar feature for pattern reference
bat path/to/similar/feature.ts
```

Document with precise line numbers and rationale:
- `path/to/file.ts` (lines X-Y) - Why: Pattern for feature type
- `path/to/model.ts` (lines A-B) - Why: Type structure to follow
- `path/to/handler.ts` (lines C-D) - Why: Error handling approach

**Files to Create:**

List all new files with:
- Full paths following project structure
- Purpose and description
- Why this file is needed

**Files to Update:**

Identify existing files requiring modification:
- What needs updating (add export, register route, import type)
- Where in the file (approximate line range if known)
- Why the update is needed

### Step 4: External Documentation Research

**Find official documentation for libraries and APIs.**

When using external libraries or frameworks:
- Identify currently used versions from package.json or equivalent
- Find official docs with **specific section anchors** (#installation, #api-reference)
- Look for implementation examples
- Note known gotchas, breaking changes, security considerations
- Check for migration guides if version upgrades are needed

**Document with precision:**
```markdown
- [Library Name - Specific Feature](https://example.com/docs#section-anchor)
  - Specific section: Authentication Flow
  - Why: Demonstrates OAuth2 implementation pattern
  - Version: 2.3.1 (current in package.json)
  - Gotcha: Requires callback URL configuration
```

Use WebSearch sparingly for current library documentation when local examples are insufficient.

### Step 5: Extract Code Patterns

**Extract actual code examples from the codebase** for implementation reference.

**Copyright Header (if project uses one):**
```typescript
/*
 * Copyright...
 */
```

**Naming Conventions:**
Document with examples:
```typescript
// Classes: PascalCase (example: UserAuthenticator)
// Files: kebab-case (example: user-authenticator.ts)
// Variables: camelCase (example: currentUser)
// Constants: SCREAMING_SNAKE_CASE (example: MAX_RETRY_COUNT)
```

**Common Patterns:**

Extract these with file references:

```typescript
// Error handling pattern from: src/utils/errors.ts:23-45
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Logger pattern from: src/utils/logger.ts:12-18
const logger = getLogger({
  name: 'feature-name',
  level: 'info'
});

// Testing pattern from: tests/auth.test.ts:8-15
describe('FeatureName', () => {
  it('should handle expected case', () => {
    // Arrange, Act, Assert
  });
});
```

**Reference each pattern with source location** - file path and line numbers.

### Step 6: Create Implementation Phases

**Break work into 3-5 high-level phases.**

Phases should represent logical groupings of work:

```markdown
### Phase 1: Foundation - Types & Utilities
Set up core type definitions and shared utilities that other phases depend on.

**Tasks:**
- Create type definitions
- Build validation utilities
- Set up error types

### Phase 2: Core Implementation - Business Logic
Implement the main feature logic using foundation from Phase 1.

**Tasks:**
- Implement core algorithms
- Add business logic handlers
- Create service layer

### Phase 3: Integration - Connect to System
Wire the feature into existing application structure.

**Tasks:**
- Register routes/exports
- Update configuration
- Add API endpoints

### Phase 4: Testing & Validation
Ensure feature works correctly with comprehensive tests.

**Tasks:**
- Write unit tests
- Add integration tests
- Validate against acceptance criteria
```

### Step 7: Create Atomic Tasks

**Transform phases into atomic, independently testable tasks ordered by dependency.**

For each task, structure as:

```markdown
### {ACTION} {target_file_path}

- **IMPLEMENT**: {What to build}
  ```{language}
  {Code template or example showing structure}
  ```
- **PATTERN**: {file:line reference to existing code to follow}
- **IMPORTS**: {Required imports - be specific}
- **GOTCHA**: {Known issues, constraints, edge cases}
- **VALIDATE**: `{Exact executable command to verify this task}`
```

**Action verbs:**
- CREATE - New file from scratch
- UPDATE - Modify existing file (specify what kind of change)
- ADD - Add to existing file (export, import, function)
- REMOVE - Delete code or file
- REFACTOR - Restructure without changing behavior

**Example Task:**

```markdown
### CREATE src/features/auth/types.ts

- **IMPLEMENT**: Authentication type definitions
  ```typescript
  export type AuthRequest = {
    readonly email: string;
    readonly password: string;
  };

  export type AuthResponse = {
    readonly token: string;
    readonly expiresAt: number;
  };

  export type AuthError =
    | { type: 'invalid_credentials' }
    | { type: 'account_locked' }
    | { type: 'network_error'; message: string };
  ```
- **PATTERN**: src/features/user/types.ts:15-30 - use `type` over `interface`, prefer `readonly`
- **IMPORTS**: None (base types)
- **GOTCHA**: Use `readonly` for immutability; prefer `type` over `interface` per project convention
- **VALIDATE**: `pnpm typecheck -- src/features/auth/types.ts`
```

**Dependency Order (execute top to bottom):**

1. **Types/Interfaces** - No dependencies, needed by everything
2. **Constants** - Simple values, no logic
3. **Utilities/Helpers** - Depend on types, used by core
4. **Core Logic** - Depends on utilities and types
5. **Integration** - Depends on core being complete
6. **Tests** - Depends on everything being implemented

### Step 8: Design Decisions & Notes

**Document architectural choices and rationale.**

Capture:
- Why this approach over alternatives
- Trade-offs accepted
- Performance considerations
- Future enhancement opportunities

```markdown
## NOTES

### Design Decisions

**Decision: Use Result type instead of exceptions**
- Rationale: Makes error handling explicit and type-safe
- Trade-off: More verbose than try-catch, but prevents unhandled errors
- Alternative considered: Traditional exceptions - rejected due to lack of compile-time safety

**Decision: Feature folder structure**
- Rationale: Collocates related code, easier to understand feature scope
- Trade-off: Slight duplication of utilities vs shared utils folder
- Alternative considered: Flat structure - rejected for large codebase complexity

### Performance Considerations

- Validation runs synchronously - keep rules lightweight
- Consider caching parsed results if validation is expensive
- Database queries should use indexes on email field

### Trade-offs

- Chose simplicity over flexibility - single auth method for now
- Validation is strict - may reject some edge cases initially
- No auto-retry logic - keeps error handling simple

### Future Enhancements

1. Add OAuth provider support
2. Implement rate limiting on auth endpoints
3. Add session management layer
4. Consider multi-factor authentication
```

## Output Format

**File location**: `.agents/implementation/{feature-name}-plan.md`

The plan file structure:

```markdown
# Implementation Plan: {Feature Name}

Date: {ISO timestamp}

---

## CONTEXT REFERENCES

### Relevant Codebase Files
**IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!**

- `path/to/file.ts` (lines 15-45) - Why: {Specific pattern to follow}
- `path/to/model.ts` (lines 100-120) - Why: {Type structure reference}

### New Files to Create

- `path/to/new/file.ts` - {Purpose and description}
- `path/to/test.ts` - {Test file purpose}

### Files to Update

- `path/to/existing.ts` - {What kind of update needed}

### Relevant Documentation
**YOU SHOULD READ THESE BEFORE IMPLEMENTING!**

- [Library Docs - Section](https://example.com/docs#section)
  - Specific section: {Section name}
  - Why: {Why this is needed}
  - Version: {version from package.json}

### Patterns to Follow

**Copyright Header:**
```{language}
{Actual copyright header from project}
```

**Naming Conventions:**
- Classes: {convention with example}
- Files: {convention with example}
- Variables: {convention with example}

**Error Handling Pattern:**
```{language}
// From: src/path/file.ts:lines
{Actual code example}
```

**Logger Pattern:**
```{language}
// From: src/path/logger.ts:lines
{Actual code example}
```

**Testing Pattern:**
```{language}
// From: tests/example.test.ts:lines
{Actual code example}
```

---

## IMPLEMENTATION PLAN

### Phase 1: {Phase Name}

{Description of what this phase accomplishes}

**Tasks:**
- {High-level task 1}
- {High-level task 2}

### Phase 2: {Phase Name}

{Description}

**Tasks:**
- {High-level task}

{... additional phases ...}

---

## STEP-BY-STEP TASKS

**IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.**

### {ACTION} {target_file}

- **IMPLEMENT**: {What to build}
  ```{language}
  {Code template/example}
  ```
- **PATTERN**: {file:line reference}
- **IMPORTS**: {Required imports}
- **GOTCHA**: {Known issues/constraints}
- **VALIDATE**: `{executable command}`

{Repeat for all tasks in dependency order}

---

## NOTES

### Design Decisions

{Document key architectural and design choices with rationale}

**Decision: {Choice}**
- Rationale: {Why}
- Trade-off: {What we're sacrificing}
- Alternative considered: {What else was considered}

### Performance Considerations

{Document performance implications and optimizations}

### Trade-offs

{Document what was chosen and what was sacrificed}

### Future Enhancements

{Possible improvements for later}
```

## Report to User

After completing the implementation plan, report:
- Implementation plan file path
- Number of phases created
- Number of atomic tasks created
- Number of codebase patterns documented
- Number of external docs referenced
- Estimated complexity (Low/Medium/High based on task count and dependencies)

## Important Notes

- This is research-only work. Never edit code during planning.
- Line numbers make patterns actionable. Always include them.
- Validation commands catch errors early. Every task needs one.
- Dependency order prevents build failures. Types before implementation.
- Design decisions preserve context for future maintainers.
