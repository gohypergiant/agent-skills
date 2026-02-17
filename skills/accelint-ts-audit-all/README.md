# JavaScript and TypeScript udit All

Comprehensive JavaScript and TypeScript file audit system that systematically applies multiple audit skills with progress tracking and interactive approval.

## Overview

`accelint-ts-audit-all` is a meta-skill that orchestrates four specialized JavaScript and TypeScript audit skills (`accelint-ts-testing`, `accelint-ts-best-practices`, `accelint-ts-performance`, `accelint-ts-documentation`) in a systematic 8-step process. It maintains detailed progress tracking across sessions and requires interactive approval for all changes.

**Key Features:**
- 🔄 8-step audit process per file with progress tracking
- 🤝 Interactive change approval (accept/deny/other)
- 📊 Parallel execution of quality + performance to avoid contradictions
- 💾 Session persistence with audit-process and audit-history files
- ✅ Comprehensive verification between steps

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-audit-all
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-audit-all
```

## Usage

This is a command-only skill with no natural triggers. Invoke explicitly with a file or directory path:

```bash
/skill accelint-ts-audit-all path/to/file.ts
```

Or for an entire directory:

```bash
/skill accelint-ts-audit-all path/to/src
```

If you don't provide a path, the skill will ask for one.

## What It Does

For each TypeScript file (excluding `.test.ts`, `.spec.ts`, `.bench.ts`), the skill runs this 8-step process:

### Phase 1: Initial Test Coverage
1. Run `accelint-ts-testing` to check test quality
2. Interactively apply test improvements

### Phase 2: Code Quality & Performance
3. Run `accelint-ts-best-practices` AND `accelint-ts-performance` in parallel
4. Interactively apply improvements (merging overlapping recommendations)

### Phase 3: Verification
5. Run test/build/lint commands to verify changes
6. Fix any issues that arise

### Phase 4: Documentation
7. Run `accelint-ts-documentation` to improve code comments
8. Interactively apply documentation fixes

**Progress Tracking:**
- Creates `.agents/audit/audit-process-{date}-{time}.md` to track in-progress work
- Creates `.agents/audit/audit-history-{date}-{time}.md` to archive completed files
- Survives context window limits by saving after each step

## Example Session

**Initial invocation:**
```bash
User: /skill accelint-ts-audit-all packages/core/src
Agent: Found 15 TypeScript files to audit. Creating audit tracking files...
       Starting with `utils.ts`...

       **Step 1: Test Coverage Analysis**

       Issue 1 (High): Loose assertion on line 42
       ❌ expect(result).toBeTruthy()
       ✅ expect(result).toBe(true)

       Options: 1) Accept 2) Deny 3) Other
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
       Resuming from: validation.ts (file 8 of 15)
       Last completed: Step 4 - Interactive Changes
       Next: Step 5 - Verify Changes
```

## What's Included

- **SKILL.md** - Main workflow and audit process documentation
- **assets/audit-process-template.md** - Template for tracking in-progress audits
- **assets/audit-history-template.md** - Template for archiving completed audits

## Requirements

This skill requires these other skills to be installed:
- `accelint-ts-testing` - Test coverage and quality analysis
- `accelint-ts-best-practices` - Code quality and type safety checks
- `accelint-ts-performance` - Performance optimization analysis
- `accelint-ts-documentation` - JSDoc and comment quality

**Verification Commands:**
Your project needs test/build/lint commands. The skill will ask for exact commands on first run:
- Test command (e.g., `npm test`, `bun run test`)
- Build command (e.g., `npm run build`, `tsc`)
- Lint command (e.g., `npm run lint`, `biome check`)

## Design Philosophy

This skill embodies these principles:

1. **Interactive Ownership** - Every change requires user approval to maintain code ownership and prevent unwanted modifications
2. **Progressive Context** - Detailed progress tracking allows audits to span multiple sessions without losing state
3. **Parallel Analysis** - Running quality + performance skills together prevents contradictory recommendations on the same code
4. **Verification First** - Test coverage check before refactoring, verification after changes, ensures safety
5. **Complete or In-Progress** - Files are either fully audited (all 8 steps) or marked in-progress, never partially done with no record

## Common Scenarios

### Large Directory Audit
For directories with >20 files, expect multiple sessions:
- The skill saves progress after each step
- Context window limits will naturally pause the audit
- Resume by re-invoking with the same directory path
- Progress files track exactly where to continue

### Property-Based Test Failures
If property-based tests fail randomly:
- Note the exact seed that failed
- Add constraints to arbitraries (date ranges, NaN filtering)
- Run tests 100 times to verify stability
- Document any constraints in test comments

### Overlapping Recommendations
When quality + performance suggest changes to same code:
- Skill attempts to merge into single fix
- If conflicting, presents both options
- User chooses which to apply
- Decision documented in audit history

### Build Failures After Changes
If verification fails after applying changes:
- Progress stops (won't move to next step)
- User can revert, modify, or debug
- Once fixed, continue from current step
- All verification results documented

## Learn More

- [SKILL.md](SKILL.md) - Detailed workflow and instructions
- [ts-testing](../accelint-ts-testing/) - Test quality skill
- [ts-best-practices](../accelint-ts-best-practices/) - Code quality skill
- [ts-performance](../accelint-ts-performance/) - Performance skill
- [ts-documentation](../accelint-ts-documentation/) - Documentation skill
