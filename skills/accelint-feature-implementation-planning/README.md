# Feature Implementation Planning

Transform acceptance criteria into detailed, executable implementation plans through comprehensive codebase research.

## Overview

This skill performs deep codebase analysis to create ordered, atomic implementation tasks. It bridges the gap between "what to build" (acceptance criteria) and "how to build it" (implementation tasks).

## When to Use

Use this skill when:
- You have acceptance criteria and need an implementation plan
- Converting requirements into executable development tasks
- Need to research codebase patterns before implementing
- Creating detailed task lists with validation steps

**Typical workflow:**
1. `accelint-feature-acceptance-planning` → Creates acceptance criteria
2. **`accelint-feature-implementation-planning`** → Creates implementation plan (this skill)
3. Execute tasks from the plan

## What This Skill Does

**Input:** Acceptance criteria file (`.agents/acceptance/{feature-name}-requirements.md`)

**Output:** Implementation plan (`.agents/implementation/{feature-name}-plan.md`)

**The plan contains:**
- Codebase patterns to follow (with line numbers)
- Ordered, atomic tasks with validation commands
- External documentation links
- Design decisions and trade-offs
- Integration points (files to create/update)

## Key Principles

### Zero Code Changes
This is pure research. No files are edited during planning.

### Pattern-Based
Extract actual code examples from the codebase to guide implementation.

### Dependency-Ordered
Tasks are sequenced to prevent build failures: types → utils → core → integration → tests.

### Independently Testable
Every task includes an executable validation command.

## File Structure

```
skills/accelint-feature-implementation-planning/
├── SKILL.md          # Main workflow (8 steps)
├── AGENTS.md         # Detailed conventions and rules
└── README.md         # This file
```

## Usage Example

```bash
# User provides acceptance criteria file
/accelint-feature-implementation-planning .agents/acceptance/user-auth-requirements.md
```

**The skill will:**
1. Load the requirements
2. Research the codebase for patterns
3. Identify integration points
4. Extract code examples
5. Create dependency-ordered tasks
6. Document design decisions

**Result:** `.agents/implementation/user-auth-plan.md` with 20-30 atomic tasks ready to execute.

## Output Example

```markdown
# Implementation Plan: user-auth

## CONTEXT REFERENCES

### Relevant Codebase Files
- `src/features/session/types.ts` (lines 15-45) - Session type structure to follow
- `src/utils/crypto.ts` (lines 67-89) - Password hashing pattern

### Patterns to Follow

**Error Handling:**
```typescript
// From: src/utils/errors.ts:23-34
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

## STEP-BY-STEP TASKS

### CREATE src/features/auth/types.ts

- **IMPLEMENT**: Authentication type definitions
  ```typescript
  export type AuthRequest = {
    readonly email: string;
    readonly password: string;
  };
  ```
- **PATTERN**: src/features/user/types.ts:10-15 - Use readonly for immutability
- **IMPORTS**: None
- **GOTCHA**: Use type over interface per project convention
- **VALIDATE**: `pnpm typecheck -- src/features/auth/types.ts`
```

## Progressive Disclosure

The skill uses progressive disclosure:
- **SKILL.md** - Start here for the 8-step workflow
- **AGENTS.md** - Load for detailed conventions and rules
- No additional references needed

## Design Philosophy

**High Consequence = Low Freedom**

Implementation planning is fragile:
- Wrong task order = broken builds
- Missing validation = undetected errors
- Vague references = unusable plans

Therefore, this skill uses:
- Exact file paths with line numbers
- Executable validation commands
- Strict dependency ordering
- Specific code templates

**The goal:** Create plans so clear that implementation becomes mechanical execution.

## Integration

**Works with:**
- `accelint-feature-acceptance-planning` - Provides input (acceptance criteria)
- `accelint-ts-best-practices` - TypeScript patterns referenced in plans
- `accelint-react-best-practices` - React patterns referenced in plans
- `accelint-ts-testing` - Testing patterns referenced in plans

**Output used by:**
- Developers executing the implementation tasks
- Other agents assigned to implement features

## Common Scenarios

### Scenario 1: New Feature
**Input:** Acceptance criteria for new authentication feature
**Output:** 25 tasks covering types, validation, service, routes, tests

### Scenario 2: Enhancement
**Input:** Acceptance criteria for adding OAuth to existing auth
**Output:** 15 tasks focused on integration points and updates

### Scenario 3: Refactor
**Input:** Acceptance criteria for restructuring session management
**Output:** 30 tasks with careful dependency ordering to avoid breaking changes

## Success Metrics

A good implementation plan:
- ✅ Every task is independently testable
- ✅ Task order prevents circular dependencies
- ✅ Pattern references include specific line numbers
- ✅ Validation commands are executable
- ✅ Design decisions explain rationale
- ✅ External docs link to specific sections

## License

Apache-2.0
