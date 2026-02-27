#!/usr/bin/env bash
# generate-doc-audit-report.sh - Generate documentation audit report from detected issues
# Usage: generate-doc-audit-report.sh <jsdoc-issues.json> <comment-issues.json> <target-name>
# Output: Markdown audit report following assets/output-report-template.md structure

set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <jsdoc-issues.json> <comment-issues.json> <target-name>" >&2
  echo "Example: $0 jsdoc.json comments.json 'UserService'" >&2
  exit 1
fi

JSDOC_JSON="$1"
COMMENT_JSON="$2"
TARGET_NAME="$3"

if [[ ! -f "$JSDOC_JSON" ]]; then
  echo "Error: JSDoc issues file '$JSDOC_JSON' not found" >&2
  exit 1
fi

if [[ ! -f "$COMMENT_JSON" ]]; then
  echo "Error: Comment issues file '$COMMENT_JSON' not found" >&2
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed" >&2
  echo "Install: brew install jq (macOS) or apt-get install jq (Linux)" >&2
  exit 1
fi

# Count issues by category
JSDOC_COUNT=$(jq 'length' "$JSDOC_JSON")
COMMENT_COUNT=$(jq 'length' "$COMMENT_JSON")
TOTAL_COUNT=$((JSDOC_COUNT + COMMENT_COUNT))

# Count by severity
HIGH_COUNT=$(jq '[.[] | select(.severity == "High")] | length' "$JSDOC_JSON" "$COMMENT_JSON")
MEDIUM_COUNT=$(jq '[.[] | select(.severity == "Medium")] | length' "$JSDOC_JSON" "$COMMENT_JSON")
LOW_COUNT=$(jq '[.[] | select(.severity == "Low")] | length' "$JSDOC_JSON" "$COMMENT_JSON")

# Count by category
MISSING_DOC_COUNT=$(jq '[.[] | select(.category == "Missing Documentation")] | length' "$JSDOC_JSON")
INCOMPLETE_DOC_COUNT=$(jq '[.[] | select(.category == "Incomplete Documentation")] | length' "$JSDOC_JSON")
INCORRECT_SYNTAX_COUNT=$(jq '[.[] | select(.category == "Incorrect Syntax")] | length' "$JSDOC_JSON")
COMMENT_QUALITY_COUNT=$(jq '[.[] | select(.category == "Comment Quality")] | length' "$COMMENT_JSON")
DEAD_CODE_COUNT=$(jq '[.[] | select(.category == "Dead Code")] | length' "$COMMENT_JSON")

# Generate report header
cat <<EOF
# Documentation Audit Report: $TARGET_NAME

**Generated:** $(date '+%Y-%m-%d %H:%M:%S')
**Total Issues:** $TOTAL_COUNT

## Executive Summary

### By Severity
- **High:** $HIGH_COUNT issues
- **Medium:** $MEDIUM_COUNT issues
- **Low:** $LOW_COUNT issues

### By Category
**JSDoc Issues ($JSDOC_COUNT total):**
- Missing Documentation: $MISSING_DOC_COUNT
- Incomplete Documentation: $INCOMPLETE_DOC_COUNT
- Incorrect Syntax: $INCORRECT_SYNTAX_COUNT

**Comment Issues ($COMMENT_COUNT total):**
- Comment Quality: $COMMENT_QUALITY_COUNT
- Dead Code: $DEAD_CODE_COUNT

---

## Phase 1: Detailed Findings

EOF

# Generate JSDoc findings
if [[ $JSDOC_COUNT -gt 0 ]]; then
  echo "### JSDoc Documentation Issues"
  echo ""

  jq -r '.[] | "#### Finding: \(.issue)\n\n**File:** `\(.file):\(.line)`  \n**Severity:** \(.severity)  \n**Category:** \(.category)  \n**References:** \(.references | join(", "))\n\n**Code:**\n```typescript\n\(.code_snippet)\n```\n\n**Impact:** Incomplete API documentation reduces discoverability and increases support burden.\n\n**Recommended Fix:** Add comprehensive JSDoc following the patterns in `references/jsdoc.md`.\n\n---\n"' "$JSDOC_JSON"
fi

# Generate comment findings
if [[ $COMMENT_COUNT -gt 0 ]]; then
  echo "### Comment Quality Issues"
  echo ""

  jq -r '.[] | "#### Finding: \(.issue)\n\n**File:** `\(.file):\(.line)`  \n**Severity:** \(.severity)  \n**Category:** \(.category)  \n**References:** \(.references | join(", "))\n\n**Code:**\n```typescript\n\(.code_snippet)\n```\n\n**Impact:** Poor comment quality creates maintenance burden and reduces code clarity.\n\n**Recommended Fix:** Follow comment quality standards in `references/comments.md`.\n\n---\n"' "$COMMENT_JSON"
fi

# Generate Phase 2 summary table
cat <<EOF

## Phase 2: Summary Table

| # | File | Line | Issue | Severity | Category | Status |
|---|------|------|-------|----------|----------|--------|
EOF

# Add JSDoc issues to table
jq -r 'to_entries | .[] | "| \(.key + 1) | `\(.value.file)` | \(.value.line) | \(.value.issue) | \(.value.severity) | \(.value.category) | ⬜️ Todo |"' "$JSDOC_JSON"

# Add comment issues to table
JSDOC_OFFSET=$JSDOC_COUNT
jq -r --argjson offset "$JSDOC_OFFSET" 'to_entries | .[] | "| \(.key + 1 + $offset) | `\(.value.file)` | \(.value.line) | \(.value.issue) | \(.value.severity) | \(.value.category) | ⬜️ Todo |"' "$COMMENT_JSON"

cat <<EOF

---

## Next Steps

1. **Priority 1 (High Severity):** Address all high-severity issues first
   - Exported functions/types/classes without JSDoc
   - Functions with parameters missing @param tags
   - Generic functions/types missing @template tags

2. **Priority 2 (Medium Severity):** Fix syntax and completeness issues
   - @example tags without code fences
   - Code fences missing language identifiers
   - Commented-out code removal

3. **Priority 3 (Low Severity):** Improve comment quality
   - Vague TODO/FIXME markers
   - Edit history comments
   - Comment placement improvements

## References

- **JSDoc Standards:** See \`references/jsdoc.md\` for comprehensive examples
- **Comment Quality:** See \`references/comments.md\` for quality guidelines
- **Skill Documentation:** See \`SKILL.md\` for anti-patterns and best practices
EOF
