#!/usr/bin/env bash
# update-audit-status.sh - Update audit progress tracking
# Usage: update-audit-status.sh <timestamp> <filename> <step|complete> [status]
# Output: JSON with updated status

set -euo pipefail

TIMESTAMP="${1}"
FILENAME="${2}"
ACTION="${3}"
STATUS="${4:-complete}"

if [[ -z "$TIMESTAMP" ]] || [[ -z "$FILENAME" ]] || [[ -z "$ACTION" ]]; then
  echo "Error: Missing required arguments" >&2
  echo "Usage: update-audit-status.sh <timestamp> <filename> <step|complete> [status]" >&2
  echo "" >&2
  echo "Examples:" >&2
  echo "  # Mark step 1 as complete" >&2
  echo "  update-audit-status.sh 20240227-143022 src/utils.ts 1 complete" >&2
  echo "" >&2
  echo "  # Mark entire file as complete (archives to history)" >&2
  echo "  update-audit-status.sh 20240227-143022 src/utils.ts complete" >&2
  exit 1
fi

# Get repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")

# Paths
PROCESS_FILE="$REPO_ROOT/.agents/audit/audit-process-$TIMESTAMP.md"
HISTORY_FILE="$REPO_ROOT/.agents/audit/audit-history-$TIMESTAMP.md"

# Verify files exist
if [[ ! -f "$PROCESS_FILE" ]]; then
  echo "Error: Audit process file not found: $PROCESS_FILE" >&2
  exit 1
fi

# Get file list and counts
TOTAL_FILES=$(grep -c "^- \[.\] " "$PROCESS_FILE" || echo "0")
COMPLETED_FILES=$(grep -c "^- \[x\] " "$PROCESS_FILE" || echo "0")
PENDING_FILES=$((TOTAL_FILES - COMPLETED_FILES))

if [[ "$ACTION" == "complete" ]]; then
  # Mark file as complete and archive to history

  # Extract current file progress section
  PROGRESS_SECTION=$(/usr/bin/sed -n '/^## Current File - Detailed Progress$/,/^<!--/p' "$PROCESS_FILE")

  # Append to history file
  {
    echo ""
    echo "---"
    echo ""
    echo "## $FILENAME - Completed $(date +%Y-%m-%d)"
    echo ""
    echo "$PROGRESS_SECTION"
    echo ""
  } >> "$HISTORY_FILE"

  # Update file status in "Files to Audit" section
  /usr/bin/sed -i.bak "s|^- \[ \] $FILENAME$|- [x] $FILENAME|g" "$PROCESS_FILE"

  # Move file from Pending to Completed
  COMPLETED_FILES=$((COMPLETED_FILES + 1))
  PENDING_FILES=$((TOTAL_FILES - COMPLETED_FILES))

  # Update counts in headers
  /usr/bin/sed -i.bak "s/^### Pending ([0-9]*)/### Pending ($PENDING_FILES)/" "$PROCESS_FILE"
  /usr/bin/sed -i.bak "s/^### Completed ([0-9]*)/### Completed ($COMPLETED_FILES)/" "$PROCESS_FILE"

  # Update "Current Status" section
  PERCENT=$((COMPLETED_FILES * 100 / TOTAL_FILES))
  /usr/bin/sed -i.bak "s/^\*\*Files Completed:\*\* [0-9]* of [0-9]* ([0-9]*%)/**Files Completed:** $COMPLETED_FILES of $TOTAL_FILES (${PERCENT}%)/" "$PROCESS_FILE"
  /usr/bin/sed -i.bak "s/^\*\*Files Remaining:\*\* [0-9]*/**Files Remaining:** $PENDING_FILES/" "$PROCESS_FILE"

  # Find next pending file
  NEXT_FILE=$(grep "^- \[ \] " "$PROCESS_FILE" | head -1 | /usr/bin/sed 's/^- \[ \] //')

  if [[ -n "$NEXT_FILE" ]]; then
    # Update "Ready for" in Current Status
    /usr/bin/sed -i.bak "s|^\*\*Ready for:\*\* \`[^`]*\`|**Ready for:** \`$NEXT_FILE\`|" "$PROCESS_FILE"

    # Update "Next File" in Resume Instructions
    /usr/bin/sed -i.bak "s|^\*\*Next File:\*\* \`[^`]*\`|**Next File:** \`$NEXT_FILE\`|" "$PROCESS_FILE"

    # Update Resume Instructions code block
    /usr/bin/sed -i.bak "s|accelint-ts-testing [^ ]*|accelint-ts-testing $NEXT_FILE|g" "$PROCESS_FILE"
    /usr/bin/sed -i.bak "s|accelint-ts-best-practices [^ ]*|accelint-ts-best-practices $NEXT_FILE|g" "$PROCESS_FILE"
    /usr/bin/sed -i.bak "s|accelint-ts-performance [^ ]*|accelint-ts-performance $NEXT_FILE|g" "$PROCESS_FILE"
    /usr/bin/sed -i.bak "s|accelint-ts-documentation [^ ]*|accelint-ts-documentation $NEXT_FILE|g" "$PROCESS_FILE"
  else
    # No more files - audit complete
    /usr/bin/sed -i.bak "s|^\*\*Ready for:\*\* \`[^`]*\`|**Ready for:** All files complete! Ready to merge.|" "$PROCESS_FILE"
  fi

  # Clear "Current File - Detailed Progress" section
  /usr/bin/sed -i.bak '/^## Current File - Detailed Progress$/,/^<!--/{
    /^## Current File - Detailed Progress$/n
    /^$/n
    /^\*\*IMPORTANT:\*\*/n
    /^$/n
    /^\*\*Current File:\*\*/c\
**Current File:** '"$(if [[ -n "$NEXT_FILE" ]]; then echo "None (ready to start \`$NEXT_FILE\`)"; else echo "All files completed"; fi)"'
    /^\*\*Status:\*\*/c\
**Status:** '"$(if [[ -n "$NEXT_FILE" ]]; then echo "Not started"; else echo "Complete"; fi)"'
    /^<!--/,$d
  }' "$PROCESS_FILE"

  # Re-add the comment template
  echo "" >> "$PROCESS_FILE"
  cat >> "$PROCESS_FILE" <<'TEMPLATE'
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
TEMPLATE

  # Clean up backup files
  rm -f "$PROCESS_FILE.bak"

  # Update Last Updated date
  /usr/bin/sed -i.bak "s/^\*\*Last Updated:\*\* [0-9-]*/**Last Updated:** $(date +%Y-%m-%d)/" "$PROCESS_FILE"
  rm -f "$PROCESS_FILE.bak"

  # Output JSON
  cat <<JSON
{
  "status": "success",
  "action": "file_complete",
  "timestamp": "$TIMESTAMP",
  "filename": "$FILENAME",
  "completed_files": $COMPLETED_FILES,
  "total_files": $TOTAL_FILES,
  "percent_complete": $PERCENT,
  "next_file": $(if [[ -n "$NEXT_FILE" ]]; then echo "\"$NEXT_FILE\""; else echo "null"; fi),
  "audit_complete": $(if [[ -z "$NEXT_FILE" ]]; then echo "true"; else echo "false"; fi)
}
JSON

else
  # Mark specific step as complete
  STEP_NUM="$ACTION"

  # Validate step number
  if ! [[ "$STEP_NUM" =~ ^[1-8]$ ]]; then
    echo "Error: Invalid step number '$STEP_NUM'. Must be 1-8 or 'complete'" >&2
    exit 1
  fi

  # This is a simple status update - just record it
  # The actual detailed progress is maintained by the agent in the "Current File - Detailed Progress" section
  # This script just provides a confirmation

  # Update Last Updated date
  /usr/bin/sed -i.bak "s/^\*\*Last Updated:\*\* [0-9-]*/**Last Updated:** $(date +%Y-%m-%d)/" "$PROCESS_FILE"
  rm -f "$PROCESS_FILE.bak"

  # Output JSON
  cat <<JSON
{
  "status": "success",
  "action": "step_update",
  "timestamp": "$TIMESTAMP",
  "filename": "$FILENAME",
  "step": $STEP_NUM,
  "step_status": "$STATUS",
  "message": "Step $STEP_NUM marked as $STATUS. Agent should update detailed progress in 'Current File - Detailed Progress' section."
}
JSON

fi
