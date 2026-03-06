#!/usr/bin/env bash
# generate-audit-report.sh - Generate pre-filled audit report from anti-patterns JSON
# Usage: generate-audit-report.sh <anti-patterns.json> <target-name>
# Output: Markdown audit report following output-report-template.md structure

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: generate-audit-report.sh <anti-patterns.json> <target-name>" >&2
  exit 1
fi

JSON_FILE="$1"
TARGET_NAME="$2"

if [[ ! -f "$JSON_FILE" ]]; then
  echo "Error: JSON file '$JSON_FILE' not found" >&2
  exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed" >&2
  echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)" >&2
  exit 1
fi

# Parse JSON and count issues by category
TOTAL_ISSUES=$(jq 'length' "$JSON_FILE")
CATEGORIES=$(jq -r '.[].category' "$JSON_FILE" | sort | uniq -c | sort -rn)

# Generate header
cat <<EOF
╭──────────────────────────╮
│ accelint-ts-performance  │
╰──────────────────────────╯

⚠️  WARNING: This skill assumes hot path first. If you know that the suggested change
is only used in a cold path and won't be used in a hot path then you are free to
ignore any micro-opt suggestions. You know better than the robots. When in doubt,
assume hot path.

# Report: $TARGET_NAME

## Executive Summary

Completed systematic audit of $TARGET_NAME following accelint-ts-performance workflow. Identified **$TOTAL_ISSUES** performance anti-patterns.

**Key Findings:**
EOF

# Group findings by category
while read -r count category; do
  # Get gain range for this category
  GAIN=$(jq -r "[.[] | select(.category == \"$category\")] | .[0].expected_gain" "$JSON_FILE")
  echo "- **$count** $category issues ($GAIN potential gain)"
done <<< "$CATEGORIES"

cat <<EOF

**Impact Assessment:**
[TODO: Explain WHY these optimizations matter for $TARGET_NAME. Consider:]
- Where is this code likely called? (hot paths, rendering loops, batch processing)
- What operations trigger it? (user interactions, real-time updates, data processing)
- Why do even small gains matter? (frame budgets, throughput requirements, scale)

---

## Phase 1: Identified Anti-Patterns

EOF

# Generate findings
ISSUE_NUM=1
jq -c '.[]' "$JSON_FILE" | while read -r issue; do
  FILE=$(echo "$issue" | jq -r '.file')
  LINE=$(echo "$issue" | jq -r '.line')
  PATTERN=$(echo "$issue" | jq -r '.pattern')
  CATEGORY=$(echo "$issue" | jq -r '.category')
  GAIN=$(echo "$issue" | jq -r '.expected_gain')
  REFS=$(echo "$issue" | jq -r '.references | join(", ")')
  CODE=$(echo "$issue" | jq -r '.code_snippet')

  cat <<EOF
### $ISSUE_NUM. $PATTERN

**Location:** \`$FILE:$LINE\`

\`\`\`typescript
// ❌ Current: $PATTERN
$CODE
\`\`\`

**Issue:**
- [TODO: Explain the specific problem]
- [TODO: Quantify the impact if possible]

**Expected Gain:** $GAIN
**Category:** $CATEGORY
**Pattern Reference:** $REFS

**Recommended Fix:**
\`\`\`typescript
// ✅ [TODO: Add optimized version]
// See $REFS for examples
\`\`\`

---

EOF

  ((ISSUE_NUM++)) || true
done

# Generate Phase 2 summary table
cat <<EOF
## Phase 2: Categorized Issues

| # | Location | Issue | Category | Expected Gain |
|---|----------|-------|----------|---------------|
EOF

ISSUE_NUM=1
jq -c '.[]' "$JSON_FILE" | while read -r issue; do
  FILE=$(echo "$issue" | jq -r '.file' | sed 's/.*\///')  # basename only
  LINE=$(echo "$issue" | jq -r '.line')
  PATTERN=$(echo "$issue" | jq -r '.pattern')
  CATEGORY=$(echo "$issue" | jq -r '.category')
  GAIN=$(echo "$issue" | jq -r '.expected_gain')

  echo "| $ISSUE_NUM | \`$FILE:$LINE\` | $PATTERN | $CATEGORY | $GAIN |"

  ((ISSUE_NUM++)) || true
done

cat <<EOF

**Total Issues:** $TOTAL_ISSUES
**Primary Categories:** $(echo "$CATEGORIES" | head -3 | awk '{print $2 " (" $1 ")"}' | paste -sd ", " -)

---

## Next Steps

1. Review each issue and verify the optimization is appropriate
2. Load referenced files for detailed implementation patterns
3. Apply optimizations with correctness verification
4. Measure improvements (Phase 4 of workflow)
EOF
