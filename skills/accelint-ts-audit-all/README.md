# JavaScript and TypeScript Audit All

Comprehensive JavaScript and TypeScript file audit system that applies multiple audit skills with progress tracking and interactive approval.

## Overview

`accelint-ts-audit-all` orchestrates four specialized audit skills through 8 execution steps per file, followed by archive/completion bookkeeping. It tracks detailed progress across sessions and requires interactive approval for all changes.

This is a command-only skill. It runs only when explicitly invoked with `/skill accelint-ts-audit-all <path>`. It does not trigger from natural-language requests.

**Key Features:**
- 8 execution steps per file plus archive/completion bookkeeping
- Interactive change approval using emoji severity tables (🛑⚠️⚡🔵✅)
- Parallel execution of quality and performance skills to avoid contradictory recommendations
- Session persistence with audit-process and audit-history tracking files
- Isolated git worktrees for safe parallel audits and easy rollback
- Comprehensive verification between steps

## Installation

This skill is part of the agent-skills repository. Add it using the skills CLI:

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-audit-all
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-audit-all
```

## Usage

Invoke the skill explicitly with a file or directory path:

```bash
/skill accelint-ts-audit-all path/to/file.ts
```

Or audit an entire directory:

```bash
/skill accelint-ts-audit-all path/to/src
```

If you don't provide a path, the skill prompts for one.

## What It Does

For each auditable TypeScript file (excluding generated outputs, declaration files, `.test.ts`, `.spec.ts`, and `.bench.ts`), the skill runs this process:

### Phase 1: Initial Test Coverage
1. Run `accelint-ts-testing` to check test quality
2. Apply test improvements interactively
3. If property-based tests are added, run the test suite 100 times to verify stability

### Phase 2: Code Quality & Performance
3. Run `accelint-ts-best-practices` AND `accelint-ts-performance` in parallel
4. Apply improvements interactively, merging overlapping recommendations when possible

### Phase 3: Verification
5. Run test, build, and lint commands to verify changes
6. Fix any issues that arise

### Phase 4: Documentation
7. Run `accelint-ts-documentation` to improve code comments and JSDoc
8. Apply documentation fixes interactively

**Progress Tracking:**
- Creates `.agents/audit/audit-process-{timestamp}.md` to track in-progress work
- Creates `.agents/audit/audit-history-{timestamp}.md` to archive completed files
- Runs execution work in an isolated `.agents/worktrees/audit-{timestamp}` worktree
- Survives context window limits by saving progress after each step

**Note:** Add `.agents/` to your `.gitignore` to prevent committing audit tracking files.

## Example Session

**Initial invocation:**
```bash
User: /skill accelint-ts-audit-all packages/core/src
Agent: Found 15 TypeScript files to audit. Creating audit tracking files...
       Starting with `utils.ts`...

       **Step 1: Test Coverage Analysis**

       | # | Severity | Type | Lines | Description |
       |---|----------|------|-------|-------------|
       | 1 | ⚠️ High | Test Quality | 42 | Loose assertion - toBeTruthy should be toBe(true) |

       ---

       ### Issue #1: Loose assertion (⚠️ High - Test Quality)
       ❌ expect(result).toBeTruthy()
       ✅ expect(result).toBe(true)

       Options: Apply which issues? (e.g., "1" or "all" or "skip")
User: 1
Agent: Applied. Running verification...
       ✅ All 150 tests passing

       **Step 3: Code Quality & Performance**
       [Runs both skills, presents merged recommendations...]
```

**Resuming later:**
```bash
User: /skill accelint-ts-audit-all packages/core/src
Agent: Found existing audit at .agents/audit/audit-process-2026-02-14-143022.md
       Resuming: validation.ts (file 8 of 15)
       Last completed: Step 4 - Interactive Changes
       Next: Step 5 - Verify Changes
```

## What's Included

- **SKILL.md** - Main workflow and audit process documentation
- **assets/audit-process-template.md** - Template for tracking in-progress audits
- **assets/audit-history-template.md** - Template for archiving completed audits
- **evals/** - Evaluation test cases for skill behavior verification

## Requirements

This skill requires these other skills:
- `accelint-ts-testing` - Test coverage and quality analysis
- `accelint-ts-best-practices` - Code quality and type safety checks
- `accelint-ts-performance` - Performance optimization analysis
- `accelint-ts-documentation` - JSDoc and comment quality

**Verification Commands:**
Your project needs test, build, and lint commands. The skill prompts for exact commands on first run:
- Test command (e.g., `npm test`, `bun run test`)
- Build command (e.g., `npm run build`, `tsc`)
- Lint command (e.g., `npm run lint`, `biome check`)

## Design Philosophy

This skill follows these principles:

1. **Interactive Ownership** - Every change requires user approval to maintain code ownership and prevent unwanted modifications
2. **Progressive Context** - Detailed progress tracking allows audits to span multiple sessions without losing state
3. **Parallel Analysis** - Running quality and performance skills together prevents contradictory recommendations
4. **Verification First** - Test coverage check before refactoring, verification after changes
5. **Complete or In-Progress** - Files are either fully audited (all 9 steps) or marked in-progress, never partially done

## Guardrails

- Multiple audit-process files are resolved by matching target path, timestamp, and in-progress status
- If the target path resolves to zero auditable files after exclusions, the skill stops and explains why
- Tracking files stay in the original repository root under `.agents/audit/`
- Code changes happen in an isolated worktree at `.agents/worktrees/audit-{timestamp}`
- Verification uses exact commands from the audit-process file (never improvised commands)

## Common Scenarios

### Large Directory Audit
For directories with more than 5-10 files, expect multiple sessions:
- The skill saves progress after each step
- Context window limits naturally pause the audit
- Resume by re-invoking with the same directory path
- Progress files track exactly where to continue

### Property-Based Test Failures
If property-based tests fail randomly:
- Note the exact seed that failed
- Add constraints to arbitraries (date ranges, NaN filtering)
- Run tests 100 times with coverage disabled to verify stability
- Document any constraints in test comments

### Overlapping Recommendations
When quality and performance suggest changes to the same code:
- The skill attempts to merge them into a single fix
- If conflicting, it presents both options
- User chooses which to apply
- Decision is documented in audit history

### Build Failures After Changes
If verification fails after applying changes:
- Progress stops (won't move to next step)
- User can revert, modify, or debug
- Once fixed, continue from current step
- All verification results are documented

## Architecture & Development Guides

Related documentation for this repository:

- [AGENTS.md](../../AGENTS.md) - Agent behavior, workflow, and guardrails
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Technical architecture and system overview

## Learn More

- [SKILL.md](SKILL.md) - Detailed workflow and instructions
- [accelint-ts-testing](../accelint-ts-testing/) - Test quality skill
- [accelint-ts-best-practices](../accelint-ts-best-practices/) - Code quality skill
- [accelint-ts-performance](../accelint-ts-performance/) - Performance skill
- [accelint-ts-documentation](../accelint-ts-documentation/) - Documentation skill
