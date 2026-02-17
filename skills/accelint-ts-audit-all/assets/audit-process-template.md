# {Directory Name} Audit Process

**Directory:** `{full/path/to/directory}`
**Started:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}

---

## Audit Process Overview

For each code file, you MUST follow this sequence:

1. **Initial Test Coverage** - Run `accelint-ts-testing` to ensure good test coverage exists before refactoring
2. **Interactive Changes** - Present the proposed change for each recommendation, with accept/deny/other options
3. **Code Quality Analysis** - Run `accelint-ts-best-practices` AND `accelint-ts-performance` in parallel to avoid contradictory suggestions
4. **Interactive Changes** - Present the proposed change for each recommendation, with accept/deny/other options. If a quality and performance recommendation overlap, do the following:
   - If they are able to be merged, provide the merge recommendation
   - If they can not be merged, display each and allow me to chose which to implement.
   Include `// PERF:` comments where they add value
5. **Verify Changes** - Run `accelint-ts-testing` again to catch any issues from refactoring
6. **Interactive Changes (if needed)** - Present the proposed change for each recommendation, with accept/deny/other options
7. **Documentation Pass** - Run `accelint-ts-documentation` to complete the audit
8. **Interactive Changes** - Present the proposed change for each recommendation, with accept/deny/other options

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
- Performance comments (`// PERF:`) should only be added when they provide meaningful insight
- User must approve each change before applying (accept/deny/other workflow)
- This audit will require multiple sessions due to context window constraints
- Update this file after completing each step to track progress
- If a property based test are added, double and triple check that the test properties won't fail random. Have seen a lot of false positives thanks to randomness.
  - Run the tests for the changed file 100 times to make sure that there are not random failures
- If a property based test fails, make sure to check the fix against the exact seed that failed

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
