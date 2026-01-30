# Implementation Planning - Agent Guidelines

This document provides detailed conventions and rules for creating implementation plans.

## File System Conventions

### Input File Location

Expect acceptance criteria file as `$ARGUMENTS` parameter:
- Typically located in `.agents/acceptance/{feature-name}-requirements.md`
- Created by the `accelint-feature-acceptance-planning` skill
- Must exist and be readable before planning begins

### Output File Location

**Implementation plans must be written to:**
```
.agents/implementation/{feature-name}-plan.md
```

**Feature name extraction:**
```bash
# Extract from acceptance file header
FEATURE_NAME=$(rg "^# Acceptance: " "$REQUIREMENTS_PATH" | cut -d' ' -f3)

# Convert to kebab-case if needed
# Example: "User Auth" -> "user-auth"
```

**Ensure directory exists:**
```bash
mkdir -p .agents/implementation
```

### Project Structure Discovery

**Configuration files to check (in order):**
1. `package.json` - Node.js/TypeScript projects
2. `tsconfig.json` - TypeScript configuration
3. `Cargo.toml` - Rust projects
4. `pyproject.toml` or `setup.py` - Python projects
5. `go.mod` - Go projects

**Sample file structure:**
```bash
# Find source files to understand organization
fd -t f -e ts -e rs -e py -e go | head -20

# Look for common patterns
ls -la src/ lib/ pkg/ app/ 2>/dev/null
```

## Pattern Recognition

### Finding Similar Code

**Use Grep with context:**
```bash
# Find similar features (case-insensitive, with context)
rg -i "authentication\|auth" --type ts -C 3

# Find specific patterns
rg "export (type|interface)" --type ts
rg "class.*Error" --type ts
```

**File organization patterns to identify:**
- Feature folders: `src/features/{feature}/*.ts`
- Flat structure: `src/*.ts`
- Domain-driven: `src/{domain}/{feature}/*.ts`
- Component-based: `src/components/{name}/{name}.tsx`

### Code Pattern Categories

**Extract examples for each:**

1. **Error Handling**
   - Result types: `type Result<T, E>`
   - Error classes: `class ValidationError extends Error`
   - Try-catch patterns
   - Error logging approaches

2. **Logging**
   - Logger initialization: `getLogger({ name: '...' })`
   - Log levels used: `logger.info()`, `logger.error()`
   - Structured logging format

3. **Testing**
   - Test file naming: `{name}.test.ts` vs `{name}.spec.ts`
   - Test structure: `describe/it` vs `test`
   - Assertion library: `expect` vs `assert`
   - Mocking patterns

4. **Type Definitions**
   - `type` vs `interface` preference
   - `readonly` usage
   - Union types for errors
   - Generic patterns

5. **Imports/Exports**
   - Default vs named exports
   - Barrel files: `index.ts` re-exports
   - Path aliases: `@/utils` vs `../../utils`

6. **Naming Conventions**
   - Files: `kebab-case.ts`, `PascalCase.tsx`, `snake_case.py`
   - Variables: `camelCase`, `snake_case`
   - Constants: `SCREAMING_SNAKE_CASE`
   - Types: `PascalCase`
   - Interfaces: `PascalCase`, `IPascalCase`

## Documentation Research

### Version Identification

**Always check current versions:**
```bash
# Node.js projects
jq '.dependencies,.devDependencies' package.json

# Python projects
cat requirements.txt pyproject.toml

# Rust projects
rg "^[a-z-]+ = " Cargo.toml
```

### Documentation Link Format

**Requirements for documentation links:**
- Include version number if possible
- Link to specific section with anchor: `#section-name`
- Note the exact section title
- Explain why this section is relevant

**Example:**
```markdown
- [Fastify Validation - JSON Schema](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validation)
  - Specific section: Validation
  - Why: Demonstrates request body validation pattern
  - Version: 4.25.2 (from package.json)
  - Gotcha: Schema must be compiled separately for performance
```

### When to Use WebSearch

Use WebSearch sparingly when:
- Library version is newer than knowledge cutoff
- Need current best practices (2026 patterns)
- Looking for known security issues or breaking changes
- No local examples of a required pattern exist

**Do not use WebSearch for:**
- Basic language features
- Standard library documentation
- Patterns that exist in the codebase

## Task Creation Rules

### Task Naming Format

**Pattern:**
```
### {ACTION} {full/path/to/file.ts}
```

**Actions (in order of common usage):**
- `CREATE` - New file from scratch
- `UPDATE` - Modify existing file (specify what kind of update in IMPLEMENT)
- `ADD` - Add specific element to existing file (function, export, import)
- `REMOVE` - Delete code or file
- `REFACTOR` - Restructure without behavior change

### Task Structure

Each task must have all five components:

```markdown
### CREATE src/features/auth/validator.ts

- **IMPLEMENT**: {What to build - be specific}
  ```typescript
  {Code template showing structure, types, key logic}
  ```
- **PATTERN**: {file.ts:start-end} - {Why this pattern}
- **IMPORTS**: {List actual imports needed}
- **GOTCHA**: {Specific issues to avoid or handle}
- **VALIDATE**: `{Exact command that verifies this works}`
```

### IMPLEMENT Section

**Include:**
- Core type definitions
- Function signatures
- Key logic structure
- Important constants

**Don't include:**
- Full implementation (that's what agent will write)
- Obvious boilerplate
- Every single function (just key ones)

**Example:**
```typescript
export type ValidationResult =
  | { valid: true; data: User }
  | { valid: false; errors: string[] };

export function validateEmail(email: string): boolean {
  // RFC 5322 validation logic
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### PATTERN Section

**Format:**
```
{file_path}:{start_line}-{end_line} - {Why relevant}
```

**Examples:**
```
- **PATTERN**: src/utils/validator.ts:23-45 - Use same regex pattern for consistency
- **PATTERN**: src/features/user/types.ts:10-15 - Follow readonly field convention
- **PATTERN**: tests/utils.test.ts:8-20 - Use this describe/it structure
```

**Rules:**
- Always include line numbers
- Explain why this pattern is relevant
- Reference actual code that exists in the codebase

### IMPORTS Section

**Be specific about what needs to be imported:**

```markdown
- **IMPORTS**:
  - `import { z } from 'zod'` - Schema validation
  - `import type { User } from '@/types/user'` - User type definition
  - `import { logger } from '@/utils/logger'` - Logging utility
```

**Not acceptable:**
```markdown
- **IMPORTS**: Standard library imports
- **IMPORTS**: Whatever is needed
```

### GOTCHA Section

**Document specific issues:**

```markdown
- **GOTCHA**:
  - Email validation must handle plus-addressing (user+tag@domain.com)
  - Password field should use constant-time comparison to prevent timing attacks
  - Remember to sanitize error messages (don't leak internal details)
```

**Rules:**
- Each gotcha should be specific and actionable
- Explain why it matters
- Reference security considerations, edge cases, platform quirks

### VALIDATE Section

**Must be an executable command:**

```markdown
- **VALIDATE**: `pnpm typecheck -- src/features/auth/validator.ts`
- **VALIDATE**: `pnpm test -- src/features/auth/validator.test.ts`
- **VALIDATE**: `pnpm build && node -e "require('./dist/validator').validateEmail('test@example.com')"`
```

**Rules:**
- Must be copy-paste executable
- Should test only what this task created
- Use project's build/test commands
- Include file path to limit scope

**Not acceptable:**
```markdown
- **VALIDATE**: Run tests
- **VALIDATE**: Make sure it works
- **VALIDATE**: Test the function
```

## Dependency Ordering

### Task Sequence Rules

**Order tasks by dependency level (top to bottom):**

```
Level 0: Types, Interfaces, Constants
  ↓
Level 1: Utility Functions, Helpers
  ↓
Level 2: Core Business Logic
  ↓
Level 3: Integration, API Routes, Exports
  ↓
Level 4: Tests
```

**Example ordering:**

```markdown
1. CREATE src/features/auth/types.ts          # Level 0: Types
2. CREATE src/features/auth/errors.ts         # Level 0: Error types
3. CREATE src/features/auth/constants.ts      # Level 0: Constants
4. CREATE src/features/auth/validator.ts      # Level 1: Utility
5. CREATE src/features/auth/service.ts        # Level 2: Core logic
6. UPDATE src/routes/index.ts                 # Level 3: Integration
7. CREATE tests/features/auth/service.test.ts # Level 4: Tests
```

### Circular Dependency Detection

**Watch for:**
- Type A imports Type B, Type B imports Type A
- Utility imports from service, service imports from utility

**Solutions:**
- Extract shared types to separate file
- Use dependency injection
- Reorganize file structure

## Design Decision Documentation

### Decision Template

```markdown
**Decision: {Clear statement of what was decided}**
- Rationale: {Why this choice makes sense}
- Trade-off: {What we're giving up or accepting}
- Alternative considered: {What else was evaluated and why it was rejected}
```

### Categories to Document

**Architectural Decisions:**
- File organization approach
- Error handling strategy
- State management pattern
- API design (REST, GraphQL, RPC)

**Technology Choices:**
- Library selection (validation, testing, logging)
- Framework features used
- Database approach

**Performance Decisions:**
- Caching strategy
- Async vs sync operations
- Data structure choices

**Security Decisions:**
- Authentication approach
- Input validation strategy
- Error message exposure

## Common Anti-Patterns

### Pattern Extraction Anti-Patterns

❌ **Vague references:**
```markdown
- **PATTERN**: See the auth module
```

✅ **Specific references:**
```markdown
- **PATTERN**: src/auth/validator.ts:34-56 - Email validation with RFC 5322 compliance
```

### Task Definition Anti-Patterns

❌ **Ambiguous tasks:**
```markdown
### UPDATE src/index.ts
- **IMPLEMENT**: Add the feature
```

✅ **Specific tasks:**
```markdown
### UPDATE src/index.ts
- **IMPLEMENT**: Export AuthService from features/auth
  ```typescript
  export { AuthService } from './features/auth/service';
  ```
```

### Validation Anti-Patterns

❌ **Non-executable validation:**
```markdown
- **VALIDATE**: Make sure tests pass
```

✅ **Executable validation:**
```markdown
- **VALIDATE**: `pnpm test -- src/features/auth/service.test.ts --verbose`
```

## Phase Breakdown Guidelines

### Phase Characteristics

**Good phases:**
- Represent logical completion points
- Group related tasks together
- Build on previous phases
- Can be validated independently

**Phase count: 3-5 phases typical**
- Too few (1-2): Not enough structure
- Too many (6+): Over-segmentation

### Phase Templates

**Phase 1: Foundation**
- Type definitions
- Constants
- Error types
- Core utilities

**Phase 2: Core Implementation**
- Business logic
- Services
- Algorithms
- Data processing

**Phase 3: Integration**
- API routes
- Exports
- Configuration
- Wiring to existing systems

**Phase 4: Testing & Validation**
- Unit tests
- Integration tests
- Validation against acceptance criteria

**Optional Phase 5: Documentation & Polish**
- Code comments (if required by project)
- API documentation
- Migration guides
- Cleanup

## Output File Quality Checklist

Before finalizing the implementation plan, verify:

```
- [ ] All pattern references include specific line numbers
- [ ] Every task has executable validation command
- [ ] Tasks are ordered by dependency (no circular deps)
- [ ] External documentation includes version numbers and section anchors
- [ ] Code templates show structure, not full implementation
- [ ] Gotchas are specific and actionable
- [ ] Design decisions document rationale and trade-offs
- [ ] File paths match project structure conventions
- [ ] Import statements are complete and specific
- [ ] Phase breakdown is 3-5 logical groupings
```

## Integration with Acceptance Planning

The implementation plan builds on acceptance criteria from `accelint-feature-acceptance-planning`:

**Acceptance criteria provides:**
- What needs to be built (requirements)
- Success criteria (testable outcomes)
- User stories (context)

**Implementation plan provides:**
- How to build it (patterns, code structure)
- Execution order (dependency-ordered tasks)
- Validation approach (test commands)

**These should align:**
- Acceptance criteria "User can login with email/password"
  → Implementation tasks for email validation, password hashing, session creation
- Acceptance success metric "Response time < 200ms"
  → Implementation note on performance consideration
