# {Directory Name} Audit Process

**Directory:** `{full/path/to/directory}`
**Started:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}

---

## Audit Process Overview

For each code file, you MUST follow this sequence:

1. **Initial Test Coverage** - Run `accelint-ts-testing` to ensure good test coverage exists before refactoring
2. **Interactive Changes** - Use two-phase pattern: show ALL issues in numbered table with emoji severity (🛑⚠️⚡🔵✅), display detailed before/after for each, accept via numbered list. If PBTs added, MUST run test suite 100 times and achieve 100 consecutive passes before proceeding. **SAVE PROGRESS after this step.**
3. **Code Quality Analysis** - Run `accelint-ts-best-practices` AND `accelint-ts-performance` in parallel to avoid contradictory suggestions
4. **Interactive Changes** - Use two-phase pattern with numbered table. If quality and performance recommendations overlap: merge if possible, otherwise present both and let user choose. Include `// PERF:` comments only where they add genuine insight. **SAVE PROGRESS after this step.**
5. **Verify Changes** - Run EXACT verification commands from "Verification Commands" section below (NEVER improvise)
6. **Interactive Changes (if needed)** - Use two-phase pattern if verification fails. **SAVE PROGRESS after this step.**
7. **Documentation Pass** - Run `accelint-ts-documentation` to complete the audit
8. **Interactive Changes** - Use two-phase pattern with numbered table. **SAVE PROGRESS after this step before archiving.**

**Progress Tracking:**
- After each step, save detailed progress to the "Current File - Detailed Progress" section in this file
- When a file is complete (all 8 steps done), move its detailed progress to `audit-history-{same date as audit-process file}-{same time as audit-process file}.md`
- Update the file status in the "Files to Audit" section (Pending → In Progress → Completed)

---

## Files to Audit ({total} total)

### Pending ({count})
- [ ] file1.ts
- [ ] file2.ts
- [ ] file3.ts

### In Progress (0)

### Completed (0)

> **Note:** Detailed progress for completed files is archived in `audit-history.md`. Only read that file if you need to understand previous decisions or revert changes.

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

# Step 9: Final verification
{exact lint command}
```

---

## Notes

### File Organization
- **In-progress work** → Document in "Current File - Detailed Progress" section of this file
- **Completed work** → Move to `audit-history.md` when all 8 steps are done
- **Historical reference** → Only read `audit-history.md` if you need to revert or understand past decisions

### Audit Guidelines
- Test files (*.test.ts) and benchmark files (*.bench.ts) are excluded from this audit
- **ALWAYS use two-phase interactive pattern:** Show ALL issues in emoji severity table first, then detailed before/after for each, then accept via numbered list. NEVER present one-by-one.
- Performance comments (`// PERF:`) should only be added when they provide meaningful insight
- User must approve each change before applying (numbered list acceptance workflow)
- **BLOCKING:** Save progress to this file after completing EACH step (2, 4, 6, 8) before continuing
- This audit will require multiple sessions due to context window constraints
- **BLOCKING:** If property-based tests are added, run test suite 100 times and achieve 100 consecutive passes before proceeding. Random failures are common with PBT.
  - If ANY run fails, examine the seed that failed
  - Fix test properties (add constraints to arbitraries: date ranges, filtered NaNs, safe strings)
  - Re-run 100 times until 100 consecutive passes achieved
- **Use EXACT verification commands from "Verification Commands" section - NEVER improvise or run one-off commands**

---

## Verification Commands

You MUST run the provided commands exactly when they are needed:
- Test changes: `{exact test command}`
- Verify build/check tsc types: `{exact build command}`
- Test benches (±0.05x is acceptable variance): `{exact bench command}` (if applicable)
- Verify correct formatting: `{exact lint command}`

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

**Overall Progress:** X% complete (Step Y of 8)

#### ✅ Step 1: Test Coverage - COMPLETE
[Details of findings and changes]

#### 🔄 Step 2: Interactive Changes - IN PROGRESS
[Current status and what needs to happen next]

#### ⏸️ Step 3: Code Quality Analysis - PENDING
[Not started yet]

etc.

-->
