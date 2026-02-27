#!/usr/bin/env bash
# Detect common TypeScript/JavaScript best practice violations
# Usage: ./scripts/detect-best-practice-violations.sh <file-or-directory>
#
# Scans TypeScript/JavaScript files for best practice violations and outputs JSON array.
# Each issue includes:
# - file: path to the file
# - line: line number
# - pattern: type of violation detected
# - category: issue category (Type Safety, Safety, State Management, Return Values, Code Quality)
# - severity: Critical, High, Medium, or Low
# - expectedGain: what fixing this issue improves
# - references: which reference files to consult
# - code: snippet of problematic code
#
# Detects:
# - 'any' type usage
# - 'enum' keyword usage
# - 'interface' usage (where 'type' is preferred)
# - Returning null/undefined instead of zero values
# - Unbounded while(true) loops
# - Boolean variables without is/has prefix
# - let usage where const could be used
# - Control flow without block style {}
# - Parameter mutations
# - Magic numbers without constants
#
# Limitations:
# - Heuristic-based detection (may have false positives)
# - No semantic analysis (only syntax patterns)
# - Cannot detect all violations requiring domain knowledge
# - Best combined with manual review for ~30-40% of violations

set -euo pipefail

target="${1:-.}"

if [[ ! -e "$target" ]]; then
  echo "Error: '$target' does not exist" >&2
  exit 1
fi

# Collect TypeScript/JavaScript files
if [[ -d "$target" ]]; then
  files=$(find "$target" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -not -path "*/node_modules/*" 2>/dev/null || echo "")
elif [[ -f "$target" ]]; then
  files="$target"
else
  echo "Error: Invalid target '$target'" >&2
  exit 1
fi

if [[ -z "$files" ]]; then
  echo "[]"
  exit 0
fi

# Initialize JSON array
first=true
echo "["

emit_finding() {
  local file="$1"
  local line="$2"
  local pattern="$3"
  local category="$4"
  local severity="$5"
  local gain="$6"
  local references="$7"
  local code="$8"

  # Escape quotes and newlines in code
  code=$(echo "$code" | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/  */ /g')

  if [[ "$first" == true ]]; then
    first=false
  else
    echo ","
  fi

  cat <<EOF
  {
    "file": "$file",
    "line": $line,
    "pattern": "$pattern",
    "category": "$category",
    "severity": "$severity",
    "expectedGain": "$gain",
    "references": "$references",
    "code": "$code"
  }
EOF
}

# Pattern detection
for file in $files; do
  # Skip if file doesn't exist
  [[ ! -f "$file" ]] && continue

  # 1. Detect 'any' type usage (Critical)
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    emit_finding "$file" "$linenum" "Using 'any' type (disables type checking)" "Type Safety" "Critical" "Enables type safety and refactoring confidence" "any.md" "$code"
  done < <(grep -nE ':\s*any\b|<any>|as any|Array<any>|\bany\[\]' "$file" 2>/dev/null || true)

  # 2. Detect 'enum' keyword usage (High)
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    emit_finding "$file" "$linenum" "Using 'enum' keyword (generates runtime code)" "Type Safety" "High" "Eliminates runtime overhead, use 'as const' instead" "enums.md" "$code"
  done < <(grep -nE '\benum\s+\w+\s*\{' "$file" 2>/dev/null || true)

  # 3. Detect 'interface' usage (Medium)
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    emit_finding "$file" "$linenum" "Using 'interface' (prefer 'type' for simple aliases)" "Type Safety" "Medium" "Consistency and simpler type composition" "type-vs-interface.md" "$code"
  done < <(grep -nE '^\s*interface\s+\w+' "$file" 2>/dev/null || true)

  # 4. Detect 'return null' or 'return undefined' (High)
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    emit_finding "$file" "$linenum" "Returning null/undefined (use zero values instead)" "Return Values" "High" "Eliminates defensive null checks throughout codebase" "return-values.md" "$code"
  done < <(grep -nE 'return\s+(null|undefined)\b' "$file" 2>/dev/null || true)

  # 5. Detect unbounded while(true) loops (Critical)
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    code_snippet=$(sed -n "${linenum},$((linenum+2))p" "$file" | tr '\n' ' ')
    emit_finding "$file" "$linenum" "Unbounded loop (should have explicit limit)" "Safety" "Critical" "Prevents runaway resource consumption" "bounded-iteration.md" "$code_snippet"
  done < <(grep -nE 'while\s*\(\s*true\s*\)' "$file" 2>/dev/null || true)

  # 6. Detect boolean variables without is/has prefix (Low)
  # Only check declarations with explicit boolean type
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    # Extract variable name
    varname=$(echo "$code" | sed -nE 's/.*\b(const|let|var)\s+([a-z][a-zA-Z0-9]*)\s*:\s*boolean.*/\2/p')
    if [[ -n "$varname" ]] && ! echo "$varname" | grep -qE '^(is|has|should|can)'; then
      emit_finding "$file" "$linenum" "Boolean variable without is/has/should/can prefix" "Code Quality" "Low" "Improves type clarity and readability" "naming-conventions.md" "$code"
    fi
  done < <(grep -nE '\b(const|let|var)\s+[a-z][a-zA-Z0-9]*\s*:\s*boolean' "$file" 2>/dev/null || true)

  # 7. Detect inline control flow without braces (Medium)
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    # Look for if/while/for without opening brace on same or next line
    if echo "$code" | grep -qE '\b(if|while|for)\s*\([^)]*\)\s*[^{]' && ! echo "$code" | grep -qE '\{'; then
      emit_finding "$file" "$linenum" "Control flow without block style {} (prevents bugs)" "Code Quality" "Medium" "Prevents silent bugs when adding statements" "control-flow.md" "$code"
    fi
  done < <(grep -nE '\b(if|while|for)\s*\(' "$file" 2>/dev/null || true)

  # 8. Detect let declarations that could be const (Low)
  # Simple heuristic: let with immediate assignment and no reassignment on next 5 lines
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    # Extract variable name
    varname=$(echo "$code" | sed -nE 's/.*\blet\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=.*/\1/p')
    if [[ -n "$varname" ]]; then
      # Check next 5 lines for reassignment
      end_line=$((linenum + 5))
      context=$(sed -n "${linenum},${end_line}p" "$file" 2>/dev/null || echo "")
      # Simple check: if varname appears on left side of assignment again
      if ! echo "$context" | tail -n +2 | grep -qE "^\s*${varname}\s*="; then
        emit_finding "$file" "$linenum" "Using 'let' where 'const' could be used" "State Management" "Low" "Signals immutability and reduces cognitive load" "state-management.md" "$code"
      fi
    fi
  done < <(grep -nE '\blet\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=' "$file" 2>/dev/null || true)

  # 9. Detect parameter mutation (High)
  # Heuristic: function parameter followed by assignment to same name
  while IFS=: read -r linenum code; do
    # Skip comments
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*'; then
      continue
    fi
    # Look for function declaration
    if echo "$code" | grep -qE '\bfunction\s+\w+\s*\('; then
      # Extract parameter names (very simple heuristic)
      params=$(echo "$code" | sed -nE 's/.*function\s+\w+\s*\(([^)]*)\).*/\1/p' | tr ',' '\n')
      for param in $params; do
        param=$(echo "$param" | sed -E 's/\s*:\s*\w+.*//; s/\s*=.*//; s/^\s*//; s/\s*$//')
        if [[ -n "$param" ]]; then
          # Check next 20 lines for mutation
          end_line=$((linenum + 20))
          context=$(sed -n "${linenum},${end_line}p" "$file" 2>/dev/null || echo "")
          # Check for direct assignment or property mutation
          if echo "$context" | grep -qE "^\s*${param}\s*=|^\s*${param}\.\w+\s*="; then
            code_snippet=$(sed -n "${linenum},$((linenum+3))p" "$file" | tr '\n' ' ')
            emit_finding "$file" "$linenum" "Mutating function parameter (creates hidden side effects)" "State Management" "High" "Prevents hidden side effects and maintains pure functions" "state-management.md" "$code_snippet"
            break
          fi
        fi
      done
    fi
  done < <(grep -nE '\bfunction\s+\w+\s*\(' "$file" 2>/dev/null || true)

  # 10. Detect magic numbers (Low)
  # Look for numeric literals > 1 not in const declarations
  while IFS=: read -r linenum code; do
    # Skip comments, const declarations, and common patterns
    if echo "$code" | grep -qE '^\s*//' || echo "$code" | grep -qE '^\s*\*' || echo "$code" | grep -qE '\bconst\s+'; then
      continue
    fi
    # Look for magic numbers (excluding 0, 1, -1, array indices)
    if echo "$code" | grep -qE '[^a-zA-Z0-9_]\d{2,}[^a-zA-Z0-9_]' && ! echo "$code" | grep -qE '\[\d+\]'; then
      emit_finding "$file" "$linenum" "Magic number without constant declaration" "Code Quality" "Low" "Improves maintainability and self-documentation" "misc.md" "$code"
    fi
  done < <(grep -nE '[^a-zA-Z0-9_][0-9]{2,}' "$file" 2>/dev/null || true)

done

# Close JSON array
echo ""
echo "]"
