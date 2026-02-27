#!/usr/bin/env bash
# merge-audit.sh - Complete audit and merge back to original branch
# Usage: merge-audit.sh <timestamp> [commit-message]
# Output: JSON with merge status and commit hash

set -euo pipefail

TIMESTAMP="${1}"

if [[ -z "$TIMESTAMP" ]]; then
  echo "Error: Timestamp required" >&2
  echo "Usage: merge-audit.sh <timestamp> [commit-message]" >&2
  exit 1
fi

# Get repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")

# Paths
WORKTREE_DIR="$REPO_ROOT/.agents/worktrees/audit-$TIMESTAMP"
AUDIT_BRANCH="audit/$TIMESTAMP"
PROCESS_FILE="$REPO_ROOT/.agents/audit/audit-process-$TIMESTAMP.md"

# Verify audit-process file exists
if [[ ! -f "$PROCESS_FILE" ]]; then
  echo "Error: Audit process file not found: $PROCESS_FILE" >&2
  exit 1
fi

# Extract original branch from audit-process file
ORIGINAL_BRANCH=$(grep "^**Original Branch:**" "$PROCESS_FILE" | /usr/bin/sed -E 's/.*`([^`]+)`.*/\1/')

if [[ -z "$ORIGINAL_BRANCH" ]]; then
  echo "Error: Could not extract original branch from audit-process file" >&2
  exit 1
fi

# Verify worktree exists
if [[ ! -d "$WORKTREE_DIR" ]]; then
  echo "Error: Worktree not found: $WORKTREE_DIR" >&2
  echo "It may have already been merged and cleaned up" >&2
  exit 1
fi

# Get current model for co-authored-by
CURRENT_MODEL="${ANTHROPIC_MODEL:-Claude Opus 4.6}"

# Default commit message
DEFAULT_COMMIT_MSG="refactor: complete TypeScript audit

- Improved test coverage across all files
- Applied type safety and best practice improvements
- Optimized performance where beneficial
- Enhanced documentation

Co-Authored-By: $CURRENT_MODEL <noreply@anthropic.com>"

COMMIT_MSG="${2:-$DEFAULT_COMMIT_MSG}"

# Switch to worktree
cd "$WORKTREE_DIR"

# Check if there are changes to commit
if ! git diff-index --quiet HEAD --; then
  # Commit all changes in worktree
  git add -A
  git commit -m "$COMMIT_MSG"
  COMMIT_HASH=$(git rev-parse HEAD)
else
  echo "Warning: No changes to commit in worktree" >&2
  COMMIT_HASH=$(git rev-parse HEAD)
fi

# Switch back to original branch
cd "$REPO_ROOT"
git checkout "$ORIGINAL_BRANCH" >/dev/null 2>&1

# Merge the audit branch
git merge --no-ff "$AUDIT_BRANCH" -m "Merge audit branch $AUDIT_BRANCH" >/dev/null 2>&1
MERGE_HASH=$(git rev-parse HEAD)

# Update audit-process file with completion
{
  echo ""
  echo "---"
  echo ""
  echo "## ✅ AUDIT COMPLETE"
  echo ""
  echo "**Completed:** $(date +%Y-%m-%d)"
  echo "**Merge Commit:** \`$MERGE_HASH\`"
  echo "**Merged to Branch:** \`$ORIGINAL_BRANCH\`"
  echo ""
  echo "All files have been audited and changes have been merged back to the original branch."
} >> "$PROCESS_FILE"

# Output JSON result
cat <<JSON
{
  "status": "success",
  "timestamp": "$TIMESTAMP",
  "original_branch": "$ORIGINAL_BRANCH",
  "audit_branch": "$AUDIT_BRANCH",
  "worktree_path": "$WORKTREE_DIR",
  "commit_hash": "$COMMIT_HASH",
  "merge_hash": "$MERGE_HASH",
  "ready_for_cleanup": true,
  "cleanup_commands": [
    "git worktree remove $WORKTREE_DIR",
    "git branch -d $AUDIT_BRANCH"
  ]
}
JSON
