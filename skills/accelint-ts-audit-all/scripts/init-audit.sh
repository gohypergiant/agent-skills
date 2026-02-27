#!/usr/bin/env bash
# init-audit.sh - Initialize comprehensive TypeScript audit workflow
# Usage: init-audit.sh <target-path> [test-cmd] [build-cmd] [lint-cmd]
# Output: JSON with worktree info and file list

set -euo pipefail

TARGET="${1:-.}"
TEST_CMD="${2:-npm test}"
BUILD_CMD="${3:-npm run build}"
LINT_CMD="${4:-npm run lint}"

if [[ ! -e "$TARGET" ]]; then
  echo "Error: Target '$TARGET' does not exist" >&2
  exit 1
fi

# Get absolute path
TARGET=$(cd "$(dirname "$TARGET")" && pwd)/$(basename "$TARGET")

# Get repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")

# Create timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

# Create worktree directory
WORKTREE_DIR="$REPO_ROOT/.agents/worktrees/audit-$TIMESTAMP"
AUDIT_BRANCH="audit/$TIMESTAMP"

# Create worktree
git worktree add "$WORKTREE_DIR" -b "$AUDIT_BRANCH" >/dev/null 2>&1

# Discover TypeScript files
if [[ -f "$TARGET" ]]; then
  # Single file mode
  if [[ "$TARGET" =~ \.(test|spec|bench)\.ts$ ]]; then
    echo "Error: Cannot audit test/benchmark files: $TARGET" >&2
    git worktree remove "$WORKTREE_DIR" 2>/dev/null || true
    exit 1
  fi
  FILES=("$TARGET")
  DIRECTORY_NAME=$(basename "$(dirname "$TARGET")")
else
  # Directory mode - use portable approach
  FILES=()
  while IFS= read -r file; do
    FILES+=("$file")
  done < <(find "$TARGET" -name "*.ts" ! -name "*.test.ts" ! -name "*.spec.ts" ! -name "*.bench.ts" -type f | sort)
  DIRECTORY_NAME=$(basename "$TARGET")
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "Error: No TypeScript files found in $TARGET" >&2
  git worktree remove "$WORKTREE_DIR" 2>/dev/null || true
  exit 1
fi

# Create audit directory in original repo
mkdir -p "$REPO_ROOT/.agents/audit"

# Read templates
PROCESS_TEMPLATE="$REPO_ROOT/skills/accelint-ts-audit-all/assets/audit-process-template.md"
HISTORY_TEMPLATE="$REPO_ROOT/skills/accelint-ts-audit-all/assets/audit-history-template.md"

# Check if templates exist (might be in .claude/skills or project skills/)
if [[ ! -f "$PROCESS_TEMPLATE" ]]; then
  PROCESS_TEMPLATE="$REPO_ROOT/.claude/skills/accelint-ts-audit-all/assets/audit-process-template.md"
fi
if [[ ! -f "$HISTORY_TEMPLATE" ]]; then
  HISTORY_TEMPLATE="$REPO_ROOT/.claude/skills/accelint-ts-audit-all/assets/audit-history-template.md"
fi

if [[ ! -f "$PROCESS_TEMPLATE" ]] || [[ ! -f "$HISTORY_TEMPLATE" ]]; then
  echo "Error: Could not find audit templates" >&2
  git worktree remove "$WORKTREE_DIR" 2>/dev/null || true
  exit 1
fi

# Create audit-process file
PROCESS_FILE="$REPO_ROOT/.agents/audit/audit-process-$TIMESTAMP.md"
HISTORY_FILE="$REPO_ROOT/.agents/audit/audit-history-$TIMESTAMP.md"

# Populate audit-process file
cat > "$PROCESS_FILE" <<EOF
# $DIRECTORY_NAME Audit Process

**Directory:** \`$TARGET\`
**Started:** $(date +%Y-%m-%d)
**Last Updated:** $(date +%Y-%m-%d)

---

## Worktree Information

**Worktree Path:** \`$WORKTREE_DIR\`
**Audit Branch:** \`$AUDIT_BRANCH\`
**Original Branch:** \`$CURRENT_BRANCH\`

> All audit work happens in an isolated worktree to prevent conflicts with parallel audits. When complete, changes will be merged back to the original branch.

---

## Audit Process Overview

For each code file, you MUST follow this sequence:

1. **Initial Test Coverage** - Run \`accelint-ts-testing\` to ensure good test coverage exists before refactoring
2. **Interactive Changes** - Use two-phase pattern: show ALL issues in numbered table with emoji severity (🛑⚠️⚡🔵✅), display detailed before/after for each, accept via numbered list. If PBTs added, MUST run test suite 100 times and achieve 100 consecutive passes before proceeding. Run with tests with coverage disabled. **SAVE PROGRESS after this step.**
3. **Code Quality Analysis** - Run \`accelint-ts-best-practices\` AND \`accelint-ts-performance\` in parallel to avoid contradictory suggestions
4. **Interactive Changes** - Use two-phase pattern with numbered table. If quality and performance recommendations overlap: merge if possible, otherwise present both and let user choose. Include \`// PERF:\` comments only where they add genuine insight. **SAVE PROGRESS after this step.**
5. **Verify Changes** - Run EXACT verification commands from "Verification Commands" section below (NEVER improvise)
6. **Interactive Changes (if needed)** - Use two-phase pattern if verification fails. **SAVE PROGRESS after this step.**
7. **Documentation Pass** - Run \`accelint-ts-documentation\` to complete the audit
8. **Interactive Changes** - Use two-phase pattern with numbered table. **SAVE PROGRESS after this step before archiving.**

**Progress Tracking:**
- After each step, save detailed progress to the "Current File - Detailed Progress" section in this file
- When a file is complete (all 8 steps done), move its detailed progress to \`audit-history-$TIMESTAMP.md\`
- Update the file status in the "Files to Audit" section (Pending → In Progress → Completed)

---

## Files to Audit (${#FILES[@]} total)

### Pending (${#FILES[@]})
EOF

# Add file list
for file in "${FILES[@]}"; do
  # Make path relative to repo root
  rel_path=${file#$REPO_ROOT/}
  echo "- [ ] $rel_path" >> "$PROCESS_FILE"
done

cat >> "$PROCESS_FILE" <<EOF

### In Progress (0)

### Completed (0)

> **Note:** Detailed progress for completed files is archived in \`audit-history-$TIMESTAMP.md\`. Only read that file if you need to understand previous decisions or revert changes.

---

## Resume Instructions for Next Session

**Next File:** \`${FILES[0]#$REPO_ROOT/}\` (first in pending list)

**Process:**
\`\`\`bash
# Step 1: Test coverage analysis
/skill accelint-ts-testing ${FILES[0]#$REPO_ROOT/}

# Step 2: Apply user-selected test improvements

# Step 3: Analyze code quality (run both in parallel)
/skill accelint-ts-best-practices ${FILES[0]#$REPO_ROOT/}
/skill accelint-ts-performance ${FILES[0]#$REPO_ROOT/}

# Step 4: Apply changes interactively with user approval

# Step 5: Verify with tests
$TEST_CMD
$BUILD_CMD

# Step 6: Apply changes interactively with user approval (if needed)

# Step 7: Documentation pass
/skill accelint-ts-documentation ${FILES[0]#$REPO_ROOT/}

# Step 8: Apply changes interactively with user approval
\`\`\`

---

## Notes

### File Organization
- **In-progress work** → Document in "Current File - Detailed Progress" section of this file
- **Completed work** → Move to \`audit-history-$TIMESTAMP.md\` when all 8 steps are done
- **Historical reference** → Only read \`audit-history.md\` if you need to revert or understand past decisions

### Audit Guidelines
- Test files (*.test.ts) and benchmark files (*.bench.ts) are excluded from this audit
- **ALWAYS use two-phase interactive pattern:** Show ALL issues in emoji severity table first, then detailed before/after for each, then accept via numbered list. NEVER present one-by-one.
- Performance comments (\`// PERF:\`) should only be added when they provide meaningful insight
- User must approve each change before applying (numbered list acceptance workflow)
- **BLOCKING:** Save progress to this file after completing EACH step before continuing
- This audit will require multiple sessions due to context window constraints
- **BLOCKING:** If property-based tests are added, run test suite 100 times and achieve 100 consecutive passes before proceeding. Random failures are common with PBT.
  - If ANY run fails, examine the seed that failed
  - Fix test properties (add constraints to arbitraries: date ranges, filtered NaNs, safe strings)
  - Re-run 100 times until 100 consecutive passes achieved
- **Use EXACT verification commands from "Verification Commands" section - NEVER improvise or run one-off commands**

---

## Verification Commands

You MUST run the provided commands exactly when they are needed:
- Test changes: \`$TEST_CMD\`
- Verify build/check tsc types: \`$BUILD_CMD\`
- Verify correct formatting: \`$LINT_CMD\`

---

## Current Status

**Ready for:** \`${FILES[0]#$REPO_ROOT/}\` (next file in pending list)
**Files Completed:** 0 of ${#FILES[@]} (0%)
**Files Remaining:** ${#FILES[@]}

---

## Current File - Detailed Progress

**IMPORTANT:** Use this section to track in-progress work. When a file is completed, move its detailed progress to \`audit-history-$TIMESTAMP.md\`.

**Current File:** None (ready to start \`${FILES[0]#$REPO_ROOT/}\`)
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
EOF

# Create empty history file
cat > "$HISTORY_FILE" <<EOF
# $DIRECTORY_NAME Audit History

**Directory:** \`$TARGET\`
**Started:** $(date +%Y-%m-%d)

This file contains detailed progress for completed files. Each file's audit process is archived here after all 8 steps are complete.

---

<!-- Completed file audits will be appended here -->

EOF

# Output JSON result
cat <<JSON
{
  "timestamp": "$TIMESTAMP",
  "worktree_path": "$WORKTREE_DIR",
  "audit_branch": "$AUDIT_BRANCH",
  "original_branch": "$CURRENT_BRANCH",
  "process_file": "$PROCESS_FILE",
  "history_file": "$HISTORY_FILE",
  "total_files": ${#FILES[@]},
  "files": [
$(for i in "${!FILES[@]}"; do
  rel_path=${FILES[$i]#$REPO_ROOT/}
  if [[ $i -eq $((${#FILES[@]} - 1)) ]]; then
    echo "    \"$rel_path\""
  else
    echo "    \"$rel_path\","
  fi
done)
  ],
  "verification_commands": {
    "test": "$TEST_CMD",
    "build": "$BUILD_CMD",
    "lint": "$LINT_CMD"
  }
}
JSON
