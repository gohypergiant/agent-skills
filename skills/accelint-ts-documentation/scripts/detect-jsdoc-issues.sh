#!/usr/bin/env bash
# detect-jsdoc-issues.sh - Static analysis for JSDoc documentation issues
# Usage: detect-jsdoc-issues.sh <file-or-directory>
# Output: JSON array of detected JSDoc violations with locations, types, and references

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

# Pattern 1: Exported functions without JSDoc
while IFS=: read -r file line content; do
  # Check if there's a JSDoc comment in the previous 10 lines
  start=$((line > 10 ? line - 10 : 1))
  context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file" 2>/dev/null || echo "")

  if ! echo "$context" | grep -q "/\*\*"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Exported function missing JSDoc" "Missing Documentation" "High" '"jsdoc.md"' "$code"
  fi
done < <(grep -rn "^export function\|^export async function" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 2: Exported types/interfaces without JSDoc
while IFS=: read -r file line content; do
  start=$((line > 10 ? line - 10 : 1))
  context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file" 2>/dev/null || echo "")

  if ! echo "$context" | grep -q "/\*\*"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Exported type/interface missing JSDoc" "Missing Documentation" "High" '"jsdoc.md"' "$code"
  fi
done < <(grep -rn "^export type\|^export interface" --include="*.ts" --include="*.tsx" "$TARGET" 2>/dev/null || true)

# Pattern 3: Exported classes without JSDoc
while IFS=: read -r file line content; do
  start=$((line > 10 ? line - 10 : 1))
  context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file" 2>/dev/null || echo "")

  if ! echo "$context" | grep -q "/\*\*"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Exported class missing JSDoc" "Missing Documentation" "High" '"jsdoc.md"' "$code"
  fi
done < <(grep -rn "^export class" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 4: @example without code fence
while IFS=: read -r file line content; do
  # Check if next line starts a code fence
  next_line=$((line + 1))
  next_content=$(/usr/bin/sed -n "${next_line}p" "$file" 2>/dev/null || echo "")

  # If @example is not followed by ``` within 2 lines, it's likely missing code fence
  if ! echo "$next_content" | grep -q "^\s*\*\s*\`\`\`"; then
    two_lines_after=$((line + 2))
    two_lines_content=$(/usr/bin/sed -n "${two_lines_after}p" "$file" 2>/dev/null || echo "")
    if ! echo "$two_lines_content" | grep -q "^\s*\*\s*\`\`\`"; then
      code=$(/usr/bin/sed -n "${line},$((line+2))p" "$file")
      emit_finding "$file" "$line" "@example missing code fence" "Incorrect Syntax" "Medium" '"jsdoc.md"' "$code"
    fi
  fi
done < <(grep -rn "@example" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 5: Code fence without language identifier
while IFS=: read -r file line content; do
  # Check if this is a code fence with just ``` and no language
  if echo "$content" | grep -qE "^\s*\*\s*\`\`\`\s*$"; then
    # Check if there's an @example marker in previous 5 lines
    start=$((line > 5 ? line - 5 : 1))
    context=$(/usr/bin/sed -n "${start},${line}p" "$file")
    if echo "$context" | grep -q "@example"; then
      code=$(/usr/bin/sed -n "${line}p" "$file")
      emit_finding "$file" "$line" "Code fence missing language identifier (typescript/javascript/tsx/jsx)" "Incorrect Syntax" "Medium" '"jsdoc.md"' "$code"
    fi
  fi
done < <(grep -rn "^\s*\*\s*\`\`\`" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 6: @returns on void functions (heuristic: check if function returns void)
while IFS=: read -r file line content; do
  # Find the function declaration (look ahead up to 10 lines)
  end=$((line + 10))
  context=$(/usr/bin/sed -n "${line},${end}p" "$file" 2>/dev/null || echo "")

  # If function signature has ": void" return type
  if echo "$context" | grep -qE ":\s*void\s*(\{|;)"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "@returns tag on void function" "Incorrect Usage" "Low" '"jsdoc.md"' "$code"
  fi
done < <(grep -rn "@returns" --include="*.ts" --include="*.tsx" "$TARGET" 2>/dev/null || true)

# Pattern 7: Functions with parameters but no @param tags
while IFS=: read -r file line content; do
  # If this is a function with parameters
  if echo "$content" | grep -qE "function\s+\w+\s*\([^)]+\)"; then
    # Check if there's @param in the JSDoc above (previous 20 lines)
    start=$((line > 20 ? line - 20 : 1))
    context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file")

    # If there's a JSDoc block but no @param
    if echo "$context" | grep -q "/\*\*"; then
      if ! echo "$context" | grep -q "@param"; then
        code=$(/usr/bin/sed -n "${line}p" "$file")
        emit_finding "$file" "$line" "Function with parameters missing @param tags" "Incomplete Documentation" "Medium" '"jsdoc.md"' "$code"
      fi
    fi
  fi
done < <(grep -rn "^export function\|^export async function\|^function\|^async function" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 8: Generic functions/types without @template
while IFS=: read -r file line content; do
  # If this is a generic function/type (has <T> or similar)
  if echo "$content" | grep -qE "<[A-Z][^>]*>"; then
    # Check if there's @template in the JSDoc above
    start=$((line > 20 ? line - 20 : 1))
    context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file")

    # If there's a JSDoc block but no @template
    if echo "$context" | grep -q "/\*\*"; then
      if ! echo "$context" | grep -q "@template"; then
        code=$(/usr/bin/sed -n "${line}p" "$file")
        emit_finding "$file" "$line" "Generic function/type missing @template tag" "Incomplete Documentation" "Medium" '"jsdoc.md"' "$code"
      fi
    fi
  fi
done < <(grep -rn "^export function.*<\|^export type.*<\|^export interface.*<\|^function.*<\|^type.*<\|^interface.*<" --include="*.ts" --include="*.tsx" "$TARGET" 2>/dev/null || true)

# Pattern 9: Functions that throw but no @throws tag (heuristic: look for 'throw' keyword in function body)
while IFS=: read -r file line content; do
  # Get function body (next 50 lines as heuristic)
  end=$((line + 50))
  body=$(/usr/bin/sed -n "${line},${end}p" "$file" 2>/dev/null || echo "")

  # If function body contains 'throw'
  if echo "$body" | grep -q "throw "; then
    # Check if there's @throws in the JSDoc above
    start=$((line > 20 ? line - 20 : 1))
    context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file")

    # If there's a JSDoc block but no @throws
    if echo "$context" | grep -q "/\*\*"; then
      if ! echo "$context" | grep -q "@throws"; then
        code=$(/usr/bin/sed -n "${line}p" "$file")
        emit_finding "$file" "$line" "Function throws errors but missing @throws tag" "Incomplete Documentation" "Low" '"jsdoc.md"' "$code"
      fi
    fi
  fi
done < <(grep -rn "^export function\|^export async function" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 10: Exported constants without JSDoc
while IFS=: read -r file line content; do
  start=$((line > 10 ? line - 10 : 1))
  context=$(/usr/bin/sed -n "${start},$((line-1))p" "$file" 2>/dev/null || echo "")

  if ! echo "$context" | grep -q "/\*\*"; then
    code=$(/usr/bin/sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Exported constant missing JSDoc" "Missing Documentation" "Medium" '"jsdoc.md"' "$code"
  fi
done < <(grep -rn "^export const" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

echo ""
echo "]"
