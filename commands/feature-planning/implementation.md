---
description: "Deep codebase research and create detailed implementation tasks"
---

# Implementation: Research & Task Planning

## Mission

Perform comprehensive codebase analysis and create detailed, ordered implementation tasks.

**Core Principle**: Zero code changes. Research patterns and create executable task list.

**When Stuck**: Ask the user. If you get stuck or are unsure, ask the user to clarify.

**Input**: Requirements file from acceptance phase as $ARGUMENTS
**Output**: Implementation plan in `.agents/implementation/{feature-name}-plan.md`

## Process

### Step 1: Load Requirements

```bash
REQUIREMENTS_PATH="$ARGUMENTS"
test -f "$REQUIREMENTS_PATH" || { echo "Requirements not found"; exit 1; }

FEATURE_NAME=$(rg "^# Acceptance: " "$REQUIREMENTS_PATH" | cut -d' ' -f3)
```

### Step 2: Codebase Intelligence - Find Patterns

**Project Structure Analysis:**
```bash
# Identify language, frameworks, structure
cat package.json tsconfig.json Cargo.toml pyproject.toml 2>/dev/null
fd -t f -e ts -e rs -e c -e py | head -20
```

**Pattern Recognition - Find Similar Code:**
```bash
# Search for similar features/implementations
rg -i "similar_keyword" --type ts -C 3
```

Document:
- File organization patterns
- Naming conventions (files, variables, types, classes)
- Import/export patterns
- Logger usage patterns
- Error handling patterns
- Anti-patterns to avoid

**Check Project Conventions:**
```bash
bat CLAUDE.md AGENTS.md .agents/README.md 2>/dev/null
```

### Step 3: Identify Integration Points

**Files to Read (with specific line numbers):**
```bash
# Find similar implementations to understand patterns
bat path/to/similar/feature.ts
```

Document with line numbers:
- `path/to/file.ts` (lines X-Y) - Why: Pattern for feature type
- `path/to/model.ts` (lines A-B) - Why: Type structure to follow

**Files to Create:**
- List all new files with full paths
- Explain purpose of each file
- Follow project structure patterns

**Files to Update:**
- Identify existing files that need modification
- Specify what kind of update (add export, register route, etc.)

### Step 4: External Documentation Research

**Find Official Documentation:**

Use web_search if needed to find:
- Currently used library versions
- Official docs with **section anchors** (#specific-section)
- Implementation examples
- Known gotchas
- Breaking changes
- Security considerations

**Document with specific sections:**
```markdown
- [Library Docs](https://example.com/docs#section-anchor)
  - Specific section: {Section Name}
  - Why: {Why this is needed}
```

### Step 5: Extract Code Patterns

**From codebase, extract actual code examples for:**

**Copyright Header** (if project uses):
```typescript
/*
 * Copyright...
 */
```

**Naming Conventions:**
```typescript
// Classes: PascalCase
// Files: kebab-case
// Variables: camelCase
// Constants: SCREAMING_SNAKE_CASE
```

**Common Patterns:**
```typescript
// Error handling pattern from: src/path/file.ts:lines
type Result<T, E> = ...

// Logger pattern from: src/utils/logger.ts:lines
const logger = getLogger({ ... })

// Testing pattern from: tests/example.test.ts:lines
describe('Feature', () => { ... })
```

### Step 6: Create Implementation Phases

**High-level phases (3-5 phases):**

```markdown
### Phase 1: Foundation - {What}
{Description of foundational work}

**Tasks:**
- {High-level task 1}
- {High-level task 2}

### Phase 2: Core Implementation - {What}
{Description of main implementation}

**Tasks:**
- {High-level task 1}
- {High-level task 2}
```

### Step 7: Create Atomic Tasks

**Transform phases into atomic, ordered tasks.**

**For each task, include:**
- **Action**: CREATE | UPDATE | ADD | REMOVE | REFACTOR
- **Target**: File path
- **IMPLEMENT**: What to build (include code template)
- **PATTERN**: Reference to existing code (file:line)
- **IMPORTS**: Required imports
- **GOTCHA**: Known issues, constraints
- **VALIDATE**: Executable validation command

**Example:**
```markdown
### CREATE src/features/new/types.ts

- **IMPLEMENT**: Type definitions
  ```typescript
  type FeatureInput = {
    readonly field: string;
  }
  ```
- **PATTERN**: src/existing/types.ts:15-30 - use `type` over `interface`
- **IMPORTS**: None
- **GOTCHA**: Use `readonly` for immutability, prefer `type` over `interface`
- **VALIDATE**: `pnpm typecheck -- src/features/new/types.ts`
```

**Order tasks by dependency:**
1. Types/interfaces (no dependencies)
2. Utilities/helpers (depend on types)
3. Core logic (depend on utils)
4. Integration (depend on core)
5. Tests (depend on all)

### Step 8: Design Decisions & Notes

**Document key decisions:**

```markdown
## NOTES

### Design Decisions

**Decision 1: {Choice}**
- Rationale: {Why}
- Trade-off: {What we're sacrificing}
- Alternative considered: {What else was considered}

### Performance Considerations

- {Performance aspect 1}
- {Performance aspect 2}

### Trade-offs

- {Trade-off 1}
- {Trade-off 2}

### Future Enhancements

1. {Possible enhancement 1}
2. {Possible enhancement 2}
```

## Output Format

**File**: `.agents/implementation/{kebab-case-feature-name}-plan.md`

```markdown
# Implementation Plan: {feature-name}

Date: {timestamp}

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `path/to/file.ts` (lines 15-45) - Why: {Specific pattern to follow}
- `path/to/model.ts` (lines 100-120) - Why: {Type structure reference}

### New Files to Create

- `path/to/new/file.ts` - {Purpose and description}
- `path/to/test.ts` - {Test file purpose}

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Docs Link](https://example.com/docs#section)
  - Specific section: {Section name}
  - Why: {Why needed}

### Patterns to Follow

**Copyright Header:**
```typescript
{Actual copyright header from project}
```

**Naming Conventions:**
- Classes: PascalCase
- Files: kebab-case
- Variables: camelCase

**{Pattern Name}:**
```typescript
// From: src/path/file.ts:lines
{Actual code example}
```

---

## IMPLEMENTATION PLAN

### Phase 1: {Phase Name}

{Description}

**Tasks:**
- {High-level task}

### Phase 2: {Phase Name}

{Description}

**Tasks:**
- {High-level task}

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### {ACTION} {target_file}

- **IMPLEMENT**: {What to build}
  ```typescript
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

### Performance Considerations

{Document performance implications and optimizations}

### Trade-offs

{Document what was chosen and what was sacrificed}

### Related Documentation

{Additional useful links for future reference}

### Future Enhancements

{Possible improvements for later}
```

## Report to User

After completion:
- Implementation plan file path
- Number of tasks created
- Number of codebase patterns documented
- Number of external docs referenced
- Ready for testing planning: YES/NO
