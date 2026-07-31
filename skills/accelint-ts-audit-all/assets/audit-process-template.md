# {Directory Name} Audit Process

**Directory:** `{full/path/to/directory}`
**Started:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}

---

## Worktree Information

**Original Branch:** `{branch-name}`

> All audit work happens in an isolated worktree (derived from this file's timestamp) to prevent conflicts with parallel audits. When complete, changes will be merged back to the original branch.

---

## Audit Process Overview

For each code file, you MUST follow this exact sequence:

1. **Initial Test Coverage** - Run `accelint-ts-testing` to ensure good test coverage exists before refactoring.
2. **Interactive Changes** - Use the two-phase pattern: show ALL issues in a numbered table with emoji severity (🛑⚠️⚡🔵✅), show detailed before/after code for EVERY issue, and accept changes through a numbered list. If PBTs are added, you MUST run the test suite 100 times and achieve 100 consecutive passes before you proceed. Run the tests with coverage disabled. **SAVE PROGRESS after this step.**
3. **Code Quality Analysis** - Run `accelint-ts-best-practices` AND `accelint-ts-performance` in parallel to avoid contradictory suggestions.
4. **Interactive Changes** - Use the two-phase pattern with a numbered table. If quality and performance recommendations overlap, merge them if possible. Otherwise, present both and let the user choose. Include `// PERF:` comments only where they add genuine insight. **SAVE PROGRESS after this step.**
5. **Verify Changes** - Run the EXACT verification commands from the "Verification Commands" section below. NEVER improvise.
6. **Interactive Changes (if needed)** - Use the two-phase pattern if verification fails. **SAVE PROGRESS after this step.**
7. **Documentation Pass** - Run `accelint-ts-documentation` to complete the audit.
8. **Interactive Changes** - Use the two-phase pattern with a numbered table. **SAVE PROGRESS after this step before archiving.**

Do not skip any step. If a step is blocked, record the blocking state in this file before you stop.

**Progress Tracking:**
- After each step, save detailed progress to the "Current File - Detailed Progress" section in this file.
- When a file is complete (all 8 execution steps plus archive are done), move its detailed progress to `audit-history-{same date as audit-process file}-{same time as audit-process file}.md`.
- Update the file status in the "Files to Audit" section (Pending → In Progress → Completed).

---

## Files to Audit ({total} total)

### Pending ({count})
- [ ] file1.ts
- [ ] file2.ts
- [ ] file3.ts

### In Progress (0)

### Completed (0)

> **Note:** Detailed progress for completed files is archived in `audit-history-{timestamp}.md`. Only read that file if you need to understand previous decisions or revert changes.

---

## Resume Instructions for Next Session

**Next File:** `{filename.ts}` (first in pending list)

**Process:**
```bash
# Step 1: Test coverage analysis
/skill accelint-ts-testing {path/to/file.ts}

# Step 2: Apply user-selected test improvements

# Step 3: Analyze code quality (run both in parallel)
/skill accelint-ts-best-practices {path/to/file.ts}
/skill accelint-ts-performance {path/to/file.ts}

# Step 4: Apply changes interactively with user approval

# Step 5: Verify with tests
{exact test command}
{exact build command}

# Step 6: Apply changes interactively with user approval (if needed)

# Step 7: Documentation pass
/skill accelint-ts-documentation {path/to/file.ts}

# Step 8: Apply changes interactively with user approval

# Final verification after Step 8
{exact lint command}
```

---

## Notes

### File Organization
- **In-progress work** → Document in "Current File - Detailed Progress" section of this file
- **Completed work** → Move to `audit-history.md` when all 8 execution steps plus archive are done
- **Historical reference** → Only read `audit-history.md` if you need to revert or understand past decisions

### Audit Guidelines
- Test files (`*.test.ts`), spec files (`*.spec.ts`), and benchmark files (`*.bench.ts`) are excluded from this audit
- **ALWAYS use the two-phase interactive pattern:** Show ALL issues in the emoji severity table first, then show detailed before/after code for EVERY issue, then accept changes through a numbered list. NEVER present issues one by one.
- Performance comments (`// PERF:`) should be added only when they provide meaningful insight.
- The user must approve each change before you apply it (numbered-list acceptance workflow).
- **BLOCKING:** Save progress to this file after you complete EACH step and before you continue.
- This audit will require multiple sessions because of context window constraints.
- **BLOCKING:** If property-based tests are added, run the test suite 100 times without coverage and achieve 100 consecutive passes before you proceed. Random failures are common with PBT.
  - If ANY run fails, examine the seed that failed.
  - Fix test properties (add constraints to arbitraries: date ranges, filtered NaNs, safe strings).
  - Re-run 100 times until 100 consecutive passes are achieved.
- **Use EXACT verification commands from the "Verification Commands" section. NEVER improvise or run one-off commands.**

---

## Verification Commands

You MUST run the provided commands exactly when they are needed:
- Test changes: `{exact test command}`
- Verify build or TypeScript checks: `{exact build command}`
- Verify lint or formatting: `{exact lint command}`
- Optional benchmark verification when the target package already has a documented bench command: `{exact bench command}` (if applicable)

---

## Current Status

**Ready for:** `{filename.ts}` (next file in pending list)
**Files Completed:** 0 of {total} (0%)
**Files Remaining:** {total}

---

## Current File - Detailed Progress

**IMPORTANT:** Use this section to track in-progress work. When a file is completed, move its detailed progress to `audit-history.md`.

**Current File:** None (ready to start `{filename.ts}`)
**Status:** Not started

<!-- When you start working on a file, replace the above with detailed step-by-step progress like:

### filename.ts - Audit Status 🔄 IN PROGRESS

**Overall Progress:** X% complete (Execution Step Y of 8)

#### ✅ Step 1: Test Coverage - COMPLETE
[Details of findings and changes]

#### 🔄 Step 2: Interactive Changes - IN PROGRESS
[Current status and what needs to happen next]

#### ⏸️ Step 3: Code Quality Analysis - PENDING
[Not started yet]

etc.

-->
