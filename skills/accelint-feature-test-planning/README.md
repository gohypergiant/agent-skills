# Feature Test Planning

Comprehensive testing strategy and validation planning for feature implementations.

## Overview

The `accelint-feature-test-planning` skill helps create thorough testing strategies by analyzing implementation plans and generating:

- Unit test specifications with coverage requirements
- Integration test scenarios for system interactions
- Edge case documentation for boundary conditions
- Multi-level validation commands for quality assurance
- Concrete test code examples following project conventions

This skill transforms implementation plans into actionable testing strategies, ensuring zero regressions and complete feature coverage.

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-feature-test-planning
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-feature-test-planning
```

## Usage

### Via Prompt

```bash
Persona:
You are a QA engineer creating a comprehensive testing strategy.

Objective:
1. Read the implementation plan from .agents/implementation/user-auth-plan.md
2. Use the accelint-feature-test-planning skill to create a testing strategy
3. Identify test framework, define unit/integration tests, document edge cases
4. Create validation commands and concrete test examples
5. Output testing strategy to .agents/testing/user-auth-testing.md

Output:
Testing strategy document with unit tests, integration tests, edge cases,
validation commands (5 levels), and concrete test examples.
```

### Via Command (if integrated)

```bash
/test-planning .agents/implementation/user-auth-plan.md
```

### Expected Workflow

1. **Input**: Implementation plan file path (from previous planning phase)
2. **Process**:
   - Detects test framework from project configuration
   - Analyzes implementation plan for testable components
   - Identifies edge cases and boundary conditions
   - Extracts validation commands from package.json
   - Creates concrete test examples matching project patterns
3. **Output**: Testing strategy file in `.agents/testing/{feature-name}-testing.md`

## What's Included

- **SKILL.md** - Main workflow for test planning (7 steps)
- **AGENTS.md** - Detailed test patterns, validation levels, framework-specific examples
- **references/** - (Reserved for future framework-specific examples)
- **scripts/** - (Reserved for future automation scripts)
- **assets/** - (Reserved for future test templates)

## Features

### 1. Automatic Test Framework Detection

Detects project test framework from:
- `package.json` dependencies and scripts
- Test configuration files (vitest.config, jest.config, pytest.ini)
- Existing test file patterns

Supports: Jest, Vitest, pytest, cargo test, Unity, and more.

### 2. Comprehensive Edge Case Identification

Documents edge cases across categories:
- Input validation (null, empty, invalid types)
- Boundary conditions (min/max, zero, empty collections)
- Error scenarios (network failures, permissions, resource limits)
- Concurrency (race conditions, deadlocks)
- Performance limits (memory, stack overflow)

### 3. Five-Level Validation Pyramid

Creates executable validation commands:
- **Level 1**: Syntax & Style (lint, format)
- **Level 2**: Type Checking & Build (typecheck, build)
- **Level 3**: Unit Tests (test, coverage)
- **Level 4**: Manual Validation (dev server, visual checks)
- **Level 5**: Additional (bundle size, performance benchmarks)

### 4. Concrete Test Examples

Generates actual test code (not pseudocode) following:
- Project test framework conventions
- Arrange-Act-Assert pattern
- Existing fixture and assertion patterns
- Coverage requirements from configuration

## Requirements

- Implementation plan file (output from implementation planning phase)
- Project with configured test framework
- Access to project configuration files (package.json, test configs)

## Example Output

### Unit Test Strategy
```markdown
### Unit Tests

**Framework**: Vitest
**Location**: `src/features/**/__tests__/*.test.ts`
**Coverage Requirements**: 80%+ (from vitest.config.ts)

**Scope**:
- EmailValidator - Email format validation, RFC 5322 compliance
- AuthService - Login flow, token generation, error handling
- UserRepository - Database CRUD operations

**Test Files**:
- `src/features/auth/__tests__/validator.test.ts` - Email validation tests
- `src/features/auth/__tests__/service.test.ts` - Auth service tests
```

### Edge Cases
```markdown
### Edge Cases

- **Null email input**: `validator(null)` - Should throw ValidationError
- **Empty password**: `login('user@example.com', '')` - Should return error
- **Boundary: Max email length**: Test 254 chars (RFC limit) vs 255 (should fail)
- **Network timeout**: API call exceeds 5s - Should return timeout error
```

### Validation Commands
```bash
# Level 1: Syntax & Style
pnpm lint
pnpm format:check

# Level 2: Type Checking & Build
pnpm typecheck
pnpm build

# Level 3: Unit Tests
pnpm test
pnpm test:coverage
pnpm test -- src/features/auth
```

## Contributing

Contributions are welcome! When contributing to this skill:

1. **CRITICAL**: Ensure description field in SKILL.md answers WHAT/WHEN/KEYWORDS
2. Follow the skill structure guidelines in accelint-skill-manager
3. Ensure all examples use ❌/✅ format for clarity
4. Keep SKILL.md focused on workflow (move details to AGENTS.md)
5. Add framework-specific examples to `references/` directory
6. Test changes with actual projects using different test frameworks

**NEVER create:**
- CHANGELOG.md - Use git history and `metadata.version` in frontmatter
- CONTRIBUTING.md - Keep contribution guide in README only
- INSTALLATION.md - Keep installation in README only

---

## Skill Architecture Philosophy

This skill follows these principles:

1. **Test Early, Test Often** - Comprehensive test planning prevents bugs before implementation
2. **Framework Agnostic** - Detects and adapts to any test framework
3. **Edge Cases First** - Most bugs hide at boundaries; document them explicitly
4. **Executable Validation** - Every command must be exact and runnable
5. **Progressive Disclosure** - Core workflow in SKILL.md, details in AGENTS.md

---

## Learn More

- [Agent Skills Specification](https://agentskills.io/specification)
- [SKILL.md](SKILL.md) - Main test planning workflow
- [AGENTS.md](AGENTS.md) - Detailed test patterns and validation strategies

---

## License

Apache-2.0
