#!/usr/bin/env bash
# detect-comment-issues.sh - Static analysis for comment quality issues
# Usage: detect-comment-issues.sh <file-or-directory>
# Output: JSON array of detected comment issues with locations, types, and references

set -euo pipefail

TARGET="${1:-.}"

if [[ ! -e "$TARGET" ]]; then
  echo "Error: Target '$TARGET' does not exist" >&2
  exit 1
fi

# Initialize JSON output
echo "["

FIRST=true

# Helper to emit JSON finding
emit_finding() {
  local file="$1"
  local line="$2"
  local issue="$3"
  local category="$4"
  local severity="$5"
  local references="$6"
  local code="$7"

  if [[ "$FIRST" == "true" ]]; then
    FIRST=false
  else
    echo ","
  fi

  cat <<EOF
  {
    "file": "$file",
    "line": $line,
    "issue": "$issue",
    "category": "$category",
    "severity": "$severity",
    "references": [$references],
    "code_snippet": $(echo "$code" | jq -Rs .)
  }
EOF
}

# Pattern 1: Vague TODO/FIXME markers (without clear actionable content)
while IFS=: read -r file line content; do
  # Extract the comment text after the marker
  marker_content=$(echo "$content" | /usr/bin/sed -E 's/^[[:space:]]*\/\/[[:space:]]*(TODO|FIXME|HACK):[[:space:]]*//')

  # Check for vague patterns
  if echo "$marker_content" | grep -qiE "^(fix this|fix it|improve|update|handle|refactor|broken|todo)(\s|$)"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Vague TODO/FIXME marker without actionable details" "Comment Quality" "Low" '"comments.md"' "$code"
  elif [[ $(echo "$marker_content" | wc -w) -lt 3 ]]; then
    # TODO with less than 3 words is likely too vague
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "TODO/FIXME too short to be actionable (< 3 words)" "Comment Quality" "Low" '"comments.md"' "$code"
  fi
done < <(grep -rn "//\s*\(TODO\|FIXME\|HACK\):" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 2: Commented-out code (lines starting with // followed by valid syntax patterns)
while IFS=: read -r file line content; do
  # Check for patterns that look like commented code
  if echo "$content" | grep -qE "^\s*//\s*(const|let|var|function|class|if|for|while|return|import|export)\s"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Commented-out code (should be deleted, git preserves history)" "Dead Code" "Medium" '"comments.md"' "$code"
  fi
done < <(grep -rn "^\s*//" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 3: Edit history comments (Added, Changed, Removed, Modified patterns)
while IFS=: read -r file line content; do
  if echo "$content" | grep -qiE "//\s*(Added|Changed|Removed|Modified|Updated)\s+(by|on|\d{4})"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Edit history comment (git provides history)" "Dead Code" "Low" '"comments.md"' "$code"
  fi
done < <(grep -rn "^\s*//" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 4: End-of-line comments that should be above code
while IFS=: read -r file line content; do
  # Check if comment is after code on the same line (not a linter directive)
  if echo "$content" | grep -qE "\S.*//\s*[^@]" && \
     ! echo "$content" | grep -qE "//\s*(eslint-disable|biome-ignore|prettier-ignore|@ts-|NOSONAR)"; then
    # Make sure it's not just a short annotation
    comment_text=$(echo "$content" | /usr/bin/sed -E 's/.*\/\/\s*//')
    if [[ $(echo "$comment_text" | wc -w) -gt 3 ]]; then
      code=$(/usr/bin/sed -n "${line}p" "$file")
      emit_finding "$file" "$line" "End-of-line comment should be moved above code for readability" "Comment Placement" "Low" '"comments.md"' "$code"
    fi
  fi
done < <(grep -rn "//" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 5: Comments restating obvious code (heuristic: comment matches nearby code structure)
while IFS=: read -r file line content; do
  # Extract comment text
  if echo "$content" | grep -qE "^\s*//\s*[^@/]"; then
    comment_text=$(echo "$content" | /usr/bin/sed -E 's/^\s*\/\/\s*//' | tr '[:upper:]' '[:lower:]')

    # Check if next line has similar keywords (simple heuristic)
    next_line=$((line + 1))
    next_content=$(/usr/bin/sed -n "${next_line}p" "$file" 2>/dev/null | tr '[:upper:]' '[:lower:]')

    # Common obvious patterns
    if echo "$comment_text" | grep -qE "^(increment|decrement|set|get|return|loop|check|validate)" && \
       echo "$next_content" | grep -qE "(++|--|=|return|for|if)"; then
      code=$(/usr/bin/sed -n "${line},$((line+1))p" "$file")
      emit_finding "$file" "$line" "Comment likely restates obvious code" "Comment Quality" "Low" '"comments.md"' "$code"
    fi
  fi
done < <(grep -rn "^\s*//\s*[^@/]" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 6: Multiple consecutive single-line comments (could be consolidated into block)
while IFS=: read -r file line content; do
  # Count consecutive // comment lines
  consecutive=1
  current_line=$((line + 1))

  while true; do
    next_content=$(/usr/bin/sed -n "${current_line}p" "$file" 2>/dev/null || echo "")
    if echo "$next_content" | grep -qE "^\s*//"; then
      consecutive=$((consecutive + 1))
      current_line=$((current_line + 1))
    else
      break
    fi
  done

  # If 5 or more consecutive single-line comments, suggest consolidation
  if [[ $consecutive -ge 5 ]]; then
    code=$(/usr/bin/sed -n "${line},$((line + 3))p" "$file")
    emit_finding "$file" "$line" "5+ consecutive single-line comments (consider block comment)" "Comment Quality" "Low" '"comments.md"' "$code"
  fi
done < <(grep -rn "^\s*//\s*[^/]" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null | awk -F: '{if (prev_file != $1 || prev_line != $2 - 1) print $0; prev_file=$1; prev_line=$2}')

echo ""
echo "]"
