#!/usr/bin/env bash
# Generate test audit report from detected anti-patterns
# Usage: ./scripts/generate-test-audit-report.sh <anti-patterns.json> <target-name>
#
# Takes JSON output from detect-test-anti-patterns.sh and generates a pre-filled
# markdown audit report following the output-report-template.md structure.
#
# Parameters:
#   anti-patterns.json - JSON file from detect-test-anti-patterns.sh
#   target-name - Name of the audited test file/module (e.g., "UserService Tests")
#
# Output: Markdown report with:
#   - Executive summary with issue counts by severity and category
#   - Phase 1: Detailed findings with code snippets
#   - Phase 2: Summary table
#
# Requires: jq (JSON processor)

set -euo pipefail

if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed" >&2
  echo "Install: brew install jq (macOS) or apt-get install jq (Linux)" >&2
  exit 1
fi

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <anti-patterns.json> <target-name>" >&2
  echo "Example: $0 issues.json 'UserService Tests'" >&2
  exit 1
fi

JSON_FILE="$1"
TARGET_NAME="$2"

if [[ ! -f "$JSON_FILE" ]]; then
  echo "Error: File '$JSON_FILE' not found" >&2
  exit 1
fi

# Read JSON and count issues
TOTAL_ISSUES=$(jq 'length' "$JSON_FILE")

if [[ "$TOTAL_ISSUES" -eq 0 ]]; then
  echo "No issues found in $JSON_FILE"
  exit 0
fi

# Count by severity
CRITICAL_COUNT=$(jq '[.[] | select(.severity == "Critical")] | length' "$JSON_FILE")
HIGH_COUNT=$(jq '[.[] | select(.severity == "High")] | length' "$JSON_FILE")
MEDIUM_COUNT=$(jq '[.[] | select(.severity == "Medium")] | length' "$JSON_FILE")
LOW_COUNT=$(jq '[.[] | select(.severity == "Low")] | length' "$JSON_FILE")

# Get unique categories
CATEGORIES=$(jq -r '.[].category' "$JSON_FILE" | sort | uniq -c | sort -rn)

# Generate report
cat <<EOF
╭─────────────────────╮
│ accelint-ts-testing │
╰─────────────────────╯

<!-- Make sure to display this warning block to the user -->
┌─────────────────────────────────────────────────────┐
│ ⚠️  WARNING: This skill does it's best to process   │
│ the context needed to suggest correct unit tests    │
│ but it can make mistakes. Please make sure to read  │
│ the suggested unit tests to make sure that they are │
│ correct.                                            │
└─────────────────────────────────────────────────────┘

# Report: $TARGET_NAME

## Executive Summary

Completed systematic audit of **$TARGET_NAME** following accelint-ts-testing standards. Identified **$TOTAL_ISSUES** test quality issues across **4** severity levels.

**Key Findings:**
- **$CRITICAL_COUNT** Critical issues (false confidence, shared state, mock leakage)
- **$HIGH_COUNT** High severity issues (implementation testing, over-mocking, type safety gaps)
- **$MEDIUM_COUNT** Medium severity issues (hard to maintain, unclear structure)
- **$LOW_COUNT** Low severity issues (minor clarity and naming improvements)

**Category Breakdown:**
EOF

echo "$CATEGORIES" | while read -r count category; do
  echo "- **$category**: $count issues"
done

cat <<EOF

**Impact Assessment:**
EOF

# Generate impact based on severity distribution
if [[ "$CRITICAL_COUNT" -gt 0 ]]; then
  echo "- **False Confidence**: Critical issues found that cause tests to pass for unintended values or allow mock leakage between test files"
fi

if [[ "$HIGH_COUNT" -gt 0 ]]; then
  echo "- **Refactor Safety**: High severity issues that test implementation details, blocking safe refactoring"
fi

if [[ "$MEDIUM_COUNT" -gt 0 ]]; then
  echo "- **Maintainability**: Medium severity issues affecting test clarity and long-term maintenance"
fi

if [[ "$LOW_COUNT" -gt 0 ]]; then
  echo "- **Code Quality**: Low severity issues with minor improvements to consistency and readability"
fi

echo ""
echo "---"
echo ""
echo "## Phase 1: Identified Issues"
echo ""

# Generate findings grouped by pattern
issue_num=1

# Group issues by pattern
patterns=$(jq -r '.[].pattern' "$JSON_FILE" | sort -u)

for pattern in $patterns; do
  # Get all issues for this pattern
  issues_json=$(jq "[.[] | select(.pattern == \"$pattern\")]" "$JSON_FILE")
  issue_count=$(echo "$issues_json" | jq 'length')

  if [[ "$issue_count" -eq 0 ]]; then
    continue
  fi

  # Get first issue for details
  first_issue=$(echo "$issues_json" | jq '.[0]')
  file=$(echo "$first_issue" | jq -r '.file')
  line=$(echo "$first_issue" | jq -r '.line')
  category=$(echo "$first_issue" | jq -r '.category')
  severity=$(echo "$first_issue" | jq -r '.severity')
  gain=$(echo "$first_issue" | jq -r '.expectedGain')
  refs=$(echo "$first_issue" | jq -r '.references')
  code=$(echo "$first_issue" | jq -r '.code')

  if [[ "$issue_count" -eq 1 ]]; then
    # Single issue
    echo "### $issue_num. $pattern"
    echo ""
    echo "**Location:** \`$file:$line\`"
    echo ""
    echo '```ts'
    echo "// ❌ Current: $pattern"
    echo "$code"
    echo '```'
    echo ""
    echo "**Issue:**"
    echo "- $gain"
    echo ""
    echo "**Severity:** $severity"
    echo "**Category:** $category"
    echo "**Impact:**"

    # Generate impact based on pattern
    case "$severity" in
      Critical)
        echo "- **False confidence:** This pattern allows tests to pass for values you never intended"
        echo "- **Test reliability:** Creates order-dependent or non-deterministic failures"
        ;;
      High)
        echo "- **Refactor safety:** Tests break when safely refactoring internals"
        echo "- **Production safety:** Type changes can ship broken code that tests don't catch"
        ;;
      Medium)
        echo "- **Test clarity:** Difficult to understand what the test verifies"
        echo "- **Maintainability:** Adds cognitive overhead and duplication"
        ;;
      Low)
        echo "- **Code consistency:** Minor improvements to readability"
        ;;
    esac

    echo ""
    echo "**Pattern Reference:** $refs"
    echo ""
    echo "**Recommended Fix:**"
    echo '```ts'
    echo "// ✅ See $refs for correct implementation"
    echo '```'
    echo ""
    echo "---"
    echo ""

    issue_num=$((issue_num + 1))

  else
    # Multiple issues - group them
    echo "### $issue_num-$((issue_num + issue_count - 1)). $pattern ($issue_count instances)"
    echo ""
    echo "**Locations:**"

    # List all locations
    echo "$issues_json" | jq -r '.[] | "- `\(.file):\(.line)`"'

    echo ""
    echo "**Example from \`$file:$line\`:**"
    echo '```ts'
    echo "// ❌ Current: $pattern"
    echo "$code"
    echo '```'
    echo ""
    echo "**Issue:**"
    echo "- $gain"
    echo "- Found in $issue_count locations"
    echo ""
    echo "**Severity:** $severity"
    echo "**Category:** $category"
    echo "**Impact:**"

    case "$severity" in
      Critical)
        echo "- **False confidence:** These patterns allow tests to pass for values you never intended"
        echo "- **Test reliability:** Creates order-dependent or non-deterministic failures across $issue_count tests"
        ;;
      High)
        echo "- **Refactor safety:** Tests break when safely refactoring internals"
        echo "- **Production safety:** Type changes can ship broken code that tests don't catch"
        ;;
      Medium)
        echo "- **Test clarity:** Difficult to understand what tests verify in $issue_count locations"
        echo "- **Maintainability:** Adds cognitive overhead and duplication"
        ;;
      Low)
        echo "- **Code consistency:** Minor improvements to readability in $issue_count locations"
        ;;
    esac

    echo ""
    echo "**Pattern Reference:** $refs"
    echo ""
    echo "**Recommended Fix:**"
    echo '```ts'
    echo "// ✅ See $refs for correct implementation"
    echo "// Apply same fix pattern to all $issue_count instances"
    echo '```'
    echo ""
    echo "---"
    echo ""

    issue_num=$((issue_num + issue_count))
  fi
done

# Phase 2: Summary table
echo "## Phase 2: Categorized Issues"
echo ""
echo "| # | Location | Issue | Category | Severity |"
echo "|---|----------|-------|----------|----------|"

# Generate table rows
jq -r '.[] | "\(.file):\(.line)|\(.pattern)|\(.category)|\(.severity)"' "$JSON_FILE" | \
  nl -w1 -s'|' | \
  sed 's/^/| /' | \
  sed 's/$/|/' | \
  sed 's/|/| /g'

echo ""
echo "**Total Issues:** $TOTAL_ISSUES"
echo "**By Severity:** Critical ($CRITICAL_COUNT), High ($HIGH_COUNT), Medium ($MEDIUM_COUNT), Low ($LOW_COUNT)"

# Count by category
echo -n "**By Category:** "
first_cat=true
while read -r count category; do
  if [[ "$first_cat" == true ]]; then
    first_cat=false
  else
    echo -n ", "
  fi
  echo -n "$category ($count)"
done < <(echo "$CATEGORIES")
echo ""
