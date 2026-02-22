---
name: accelint-ts-audit-all
description: Comprehensive TypeScript file audit system. Command-only skill (no natural triggers). Accepts file or directory path to systematically audit through accelint-ts-testing, accelint-ts-best-practices, accelint-ts-performance, and accelint-ts-documentation skills. Maintains progress tracking across sessions with interactive change approval.
metadata:
  version: "2.0"
---

# Audit All

Comprehensive TypeScript file audit system that systematically applies multiple audit skills with progress tracking and interactive approval.

## NEVER Do When Running Audits

- **NEVER skip the initial test coverage step** - Refactoring without test coverage first leads to undetected breakage. Always run `accelint-ts-testing` before any code changes.
- **NEVER run best-practices and performance sequentially** - Running them separately creates contradictory recommendations for the same code. Always run in parallel to see merged suggestions.
- **NEVER present issues one-by-one for approval** - Always show ALL issues in a numbered table first, then display each issue's detailed before/after code, THEN ask for numbered list acceptance. This prevents wildly inconsistent presentations and allows users to spot conflicts across parallel processes.
- **NEVER auto-apply all recommendations** - Each change needs user approval (accept/deny/other) to maintain code ownership and prevent unwanted modifications.
- **NEVER run one-off commands instead of documented verification commands** - The audit-process file documents EXACT verification commands. Use those commands verbatim. Never improvise with `npm test`, `bun test`, or similar unless they match the documented commands exactly.
- **NEVER skip saving progress after completing a step** - After EVERY step completion (Steps 1, 2, 3, 4, 5, 6, 7, 8), immediately save detailed progress to audit-process file BEFORE moving to next step. Context limits will break otherwise.
- **NEVER skip the 100-pass PBT verification** - When property-based tests are added, you MUST run the test suite 100 times to verify stability. Random failures are common with PBT. This is a blocking requirement - do not proceed until 100 consecutive passes are achieved.
- **NEVER lose progress when context runs out** - Save detailed progress to audit-process file after each step. Context limits are guaranteed in large audits.
- **NEVER assume property-based tests are stable** - Random test failures are common with PBT. Run new property tests 100 times to verify stability before accepting.
- **NEVER add PERF comments everywhere** - Only add `// PERF:` comments when they provide meaningful insight that future developers wouldn't discover on their own.
- **NEVER mark a file complete without all 8 steps** - Partial audits leave files in inconsistent states. Complete all steps or mark as in-progress.
- **NEVER move on from a broken build** - Fix compilation errors, test failures, and lint issues immediately before proceeding to the next step.

## Before Starting an Audit, Ask

Apply these tests before launching a comprehensive audit:

### Scope Validation
- **Is this path valid and accessible?** Verify the file or directory exists before creating TODO lists.
- **Are there test and build commands available?** Check package.json or ask user for verification commands before starting.
- **How many files will this audit?** Large directories (>5 files) will require multiple sessions. Set expectations upfront.

### Session Management
- **Is this a new audit or resuming?** Check for existing audit-process files in `.agents/audit/` before creating new ones.
- **Will this fit in one session?** Estimate ~1-5 files per session max. Plan for resumption if larger.
- **Are verification commands known?** Document exact test/build/lint commands in the audit-process file from the start.

### Change Philosophy
- **What's the user's risk tolerance?** Some users want every suggestion, others only critical fixes. Clarify before first interactive prompt.
- **Should performance micro-optimizations be included?** 1.05x-1.15x gains may not be worth code churn for all projects.

## How to Use

This skill creates and maintains an audit process file that tracks progress across sessions. It systematically runs four audit skills on each file with interactive approval.

### Workflow Overview

1. **Initialize** - Create TODO list and audit tracking files
2. **For each file** - Run 8-step audit process with user approval
3. **Track progress** - Save after each step to survive context limits
4. **Archive completed** - Move finished files to history file

## Main Audit Workflow

### Step 1: Initialize the Audit

**Check for existing audit:** Look in `.agents/audit/` directory for existing audit-process files.

If resuming an existing audit, read the audit-process file and continue from "Resume Instructions" section. Skip to Step 2.

**For new audits, create tracking files:**

**MANDATORY - READ ENTIRE FILE**: Before creating any tracking files, you MUST read
[`assets/audit-process-template.md`](assets/audit-process-template.md) completely
from start to finish to understand the exact format and structure required.
**NEVER set any range limits when reading this file.**

Similarly, you MUST read [`assets/audit-history-template.md`](assets/audit-history-template.md)
to understand the archival format.

**Do NOT load** these templates again after the initial setup - they are only needed
once at the start of a new audit.

Create timestamped tracking files:
- `.agents/audit/audit-process-{YYYY-MM-DD-HHMMSS}.md` (use current timestamp)
- `.agents/audit/audit-history-{YYYY-MM-DD-HHMMSS}.md` (same timestamp)

**Build the TODO list:**

Find all TypeScript files in the target directory, excluding `.test.ts`, `.spec.ts`, and `.bench.ts` files. If given a single file, validate it's not a test/benchmark file.

**Populate the audit-process file:**
- Add all files to "Files to Audit" section as "Pending"
- Document the exact verification commands (test/build/lint)
- Set "Current File" to first pending file
- Save the file

### Step 2: Audit Each File (8-Step Process)

For each file in the pending list, follow this exact sequence:

#### Phase 1: Initial Test Coverage

**Step 1: Run accelint-ts-testing skill**
```bash
/skill accelint-ts-testing <file-path>
```

**Step 2: Interactive Changes**
- Use the two-phase interactive pattern (table overview → detailed changes → numbered acceptance)
- Apply accepted changes
- **BLOCKING REQUIREMENT:** If property-based tests added, run verification:
  ```bash
  # Run test suite 100 times to verify PBT stability
  for i in {1..100}; do <test-command> || break; done
  ```
  - If ANY run fails, examine the seed that failed
  - Fix test properties (add constraints to arbitraries: date ranges, filtered NaNs, safe strings)
  - Re-run 100 times until 100 consecutive passes achieved
  - DO NOT proceed to Step 3 until this verification passes
- Document findings in "Current File - Detailed Progress" section
- Update status to show Step 1 ✅, Step 2 ✅
- **SAVE PROGRESS to audit-process file NOW before continuing**

#### Phase 2: Code Quality & Performance Analysis

**Step 3: Run BOTH skills in parallel**

CRITICAL: Run these together to avoid contradictory suggestions:
```bash
/skill accelint-ts-best-practices <file-path>
/skill accelint-ts-performance <file-path>
```

**Step 4: Interactive Changes**
- Review both sets of recommendations
- **If recommendations overlap:**
  - Try to merge them into single fix if possible
  - If conflicting, present both and let user choose
- Use the two-phase interactive pattern (table overview → detailed changes → numbered acceptance)
- Apply accepted changes
- Add `// PERF:` comments only where they add genuine insight
- Document in "Current File - Detailed Progress"
- Update status to show Step 3 ✅, Step 4 ✅
- **SAVE PROGRESS to audit-process file NOW before continuing**

#### Phase 3: Verify Changes

**Step 5: Run verification commands**

⚠️ **CRITICAL:** Use EXACT commands from audit-process file "Verification Commands" section. DO NOT improvise or run one-off commands.

Run ALL verification commands documented in audit-process file:
```bash
# Example commands (MUST match audit-process file exactly):
cd <project-root>; npm test
cd <project-root>; npm run build
cd <project-root>; npm run lint
```

**Step 6: Interactive Changes (if needed)**
- If verification fails, use two-phase interactive pattern to present fixes
- If verification passes, no changes needed
- Document results in "Current File - Detailed Progress"
- Update status to show Step 5 ✅, Step 6 ✅
- **SAVE PROGRESS to audit-process file NOW before continuing**

#### Phase 4: Documentation

**Step 7: Run accelint-ts-documentation skill**
```bash
/skill accelint-ts-documentation <file-path>
```

**Step 8: Interactive Changes**
- Use the two-phase interactive pattern (table overview → detailed changes → numbered acceptance)
- Apply accepted changes
- Run final verification to ensure docs didn't break anything (use EXACT commands from audit-process file)
- Document in "Current File - Detailed Progress"
- Update status to show Step 7 ✅, Step 8 ✅
- **SAVE PROGRESS to audit-process file NOW before continuing to Step 3 (Archive)**

### Step 3: Archive Completed File

When all 8 steps complete for a file:

1. **Move detailed progress to history file**
   - Copy entire "Current File - Detailed Progress" section
   - Append to audit-history file
   - Add summary statistics at end of file's section

2. **Update audit-process file**
   - Mark file as "Completed" in "Files to Audit" section
   - Clear "Current File - Detailed Progress" section
   - Set "Current File" to next pending file
   - Update "Resume Instructions" for next file
   - Update "Current Status" counts

3. **Save both files**

### Step 4: Continue or Complete

**If more pending files exist:**
- Return to Step 2 for next file
- Monitor context usage - if approaching limit, stop and save progress

**If all files completed:**
- Update audit-process file with completion summary
- Run final full test suite + lint verification
- Report total statistics across all files

## Progress Tracking Format

**File Status Markers:**
- `[ ]` - Pending (not started)
- `[x]` - Completed (all 8 steps done, moved to history)

**Step Status Markers:**
- ✅ - Complete
- 🔄 - In Progress
- ⏸️ - Pending (not started)

**Detailed Progress Template:**
```markdown
### filename.ts - Audit Status 🔄 IN PROGRESS

**Overall Progress:** X% complete (Step Y of 8)

#### ✅ Step 1: Test Coverage - COMPLETE
[Findings, changes applied, test results]

#### 🔄 Step 2: Interactive Changes - IN PROGRESS
[Current change being reviewed, user decision needed]

#### ⏸️ Step 3: Code Quality Analysis - PENDING
[Not started yet]
```

## Interactive Change Approval Pattern

**CRITICAL:** Always use the two-phase presentation pattern. NEVER present issues one-by-one or ask for approval before showing all changes.

### Phase 1: Overview Table (Quick Scan)

Present ALL issues in a numbered table using emoji severity indicators:

```markdown
## Found Issues Summary (X total)

| # | Severity | Type | Lines | Description |
|---|----------|------|-------|-------------|
| 1 | 🛑 Critical | Type Safety | 45-47 | Missing null check on user object |
| 2 | ⚠️ High | Performance | 89 | N+1 query in loop - use batch fetch |
| 3 | ⚡ Medium | Performance | 120-125 | Filter+map → single pass with reduce |
| 4 | 🔵 Low | Best Practice | 78 | Use const assertion for readonly array |
| 5 | ✅ Info | Documentation | 12 | Missing JSDoc return type |
```

**Severity Legend:**
- 🛑 **Critical** - Causes runtime errors, security vulnerabilities, or data loss
- ⚠️ **High** - Type errors, significant performance issues, or API breaking changes
- ⚡ **Medium** - Moderate performance gains, maintainability improvements
- 🔵 **Low** - Minor optimizations, style improvements
- ✅ **Info** - Documentation, comments, non-functional improvements

### Phase 2: Detailed Changes (Full Context)

After showing the overview table, display each issue with complete before/after code:

```markdown
---

### Issue #1: Missing null check (🛑 Critical - Type Safety)
**Lines:** 45-47
**Problem:** Function doesn't handle null user case
**Impact:** Runtime TypeError when user is null

❌ **Before:**
```typescript
function getUsername(user: User | null) {
  return user.name; // TS error + runtime crash
}
```

✅ **After:**
```typescript
function getUsername(user: User | null) {
  return user?.name ?? 'Anonymous';
}
```

**Expected Benefit:** Prevents runtime TypeError, fixes TS compilation error

---

### Issue #2: N+1 Query Performance (⚠️ High - Performance)
[... same detailed format for each issue ...]

---

### Issue #3: Filter+map optimization (⚡ Medium - Performance)
[... same detailed format for each issue ...]

---

[Continue for all issues...]

---

**Apply which issues?** Enter numbers (e.g., "1, 2, 5" or "all" or "skip"):
```

**Key Benefits:**
- Overview table allows quick scanning for conflicts across parallel processes
- Numbered list makes acceptance explicit and trackable
- All code changes shown upfront before any approval
- Emoji severity indicators enable instant visual prioritization
- Consistent format prevents wildly varying presentations

Wait for user response with numbered list before applying any changes.

## Verification Commands

The audit-process file MUST document exact verification commands. Common patterns:

**Node.js projects:**
```bash
cd <project-root>; npm test
cd <project-root>; npm run build
cd <project-root>; npm run lint
```

**Bun projects:**
```bash
cd <project-root>; bun run test
cd <project-root>; bun run build
cd <project-root>; bun run lint
cd <project-root>; bun run bench  # if applicable
```

**Monorepo packages:**
```bash
cd <workspace-root>/packages/<package-name>; npm test
```

Always use the EXACT commands from the audit-process file. Never guess.

## Important Notes

- **Do NOT load README.md** - It contains user-facing documentation that duplicates this file. All Agent instructions are contained in SKILL.md.
- **Property-based test stability:** If property tests fail randomly, check the exact seed that failed and verify the fix against that seed. Add constraints to arbitraries (date ranges, filtered NaNs, safe strings) to prevent false positives.
- **Parallel skill execution:** When running ts-best-practices and ts-performance in parallel, wait for BOTH to complete before presenting recommendations. This allows you to identify and merge overlapping suggestions.
- **Context window management:** Audit-process files are designed to survive context limits. After completing each step, save progress. If you must stop mid-file, document exactly which step you're on and what the next action should be.
- **Build failures block progress:** Never proceed to the next step if verification commands fail. Fix the issue or roll back the change first.
- **PERF comment guidelines:** Only add performance comments when the optimization is non-obvious. "Using for...of instead of map" doesn't need a comment. "Memoizing deserializer to avoid repeated JSON parsing" does.
- **History file is write-only:** Only read audit-history file if you need to understand a previous decision or consider reverting a change. Otherwise, it's purely archival.
