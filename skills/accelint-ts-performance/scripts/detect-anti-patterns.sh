#!/usr/bin/env bash
# detect-anti-patterns.sh - Static analysis for TypeScript/JavaScript performance anti-patterns
# Usage: detect-anti-patterns.sh <file-or-directory>
# Output: JSON array of detected anti-patterns with locations, types, and suggested categories

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
  local pattern="$3"
  local category="$4"
  local gain="$5"
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
    "pattern": "$pattern",
    "category": "$category",
    "expected_gain": "$gain",
    "references": [$references],
    "code_snippet": $(echo "$code" | jq -Rs .)
  }
EOF
}

# Pattern 1: Nested for loops (O(n²))
while IFS=: read -r file line content; do
  # Simple heuristic: two 'for' keywords on adjacent lines
  if echo "$content" | grep -q 'for.*{'; then
    next_line=$((line + 1))
    next_content=$(sed -n "${next_line}p" "$file" 2>/dev/null || echo "")
    if echo "$next_content" | grep -q 'for.*{'; then
      code=$(sed -n "${line},$((line+2))p" "$file")
      emit_finding "$file" "$line" "Nested loops (potential O(n²))" "Algorithmic" "10-1000x" '"reduce-looping.md", "reduce-branching.md"' "$code"
    fi
  fi
done < <(grep -rn "for.*{" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 2: Array method chains (.filter().map())
while IFS=: read -r file line content; do
  code=$(sed -n "${line}p" "$file")
  emit_finding "$file" "$line" "Array method chaining" "Algorithmic" "2-10x" '"reduce-looping.md"' "$code"
done < <(grep -rn "\.filter(.*\.map(" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 3: Array.includes() in loops
while IFS=: read -r file line content; do
  # Check if this line is inside a loop (heuristic: look for 'for' in previous 5 lines)
  start=$((line > 5 ? line - 5 : 1))
  context=$(sed -n "${start},${line}p" "$file")
  if echo "$context" | grep -q 'for\|while'; then
    code=$(sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Array.includes() in loop (use Set.has() instead)" "Algorithmic" "10-100x" '"reduce-looping.md"' "$code"
  fi
done < <(grep -rn "\.includes(" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 4: try/catch in loops
while IFS=: read -r file line content; do
  # Check if try is inside a loop
  start=$((line > 10 ? line - 10 : 1))
  context=$(sed -n "${start},${line}p" "$file")
  if echo "$context" | grep -q 'for\|while'; then
    code=$(sed -n "${line},$((line+2))p" "$file")
    emit_finding "$file" "$line" "try/catch in hot path (prevents V8 inlining)" "Micro-optimization" "3-5x" '"performance-misc.md"' "$code"
  fi
done < <(grep -rn "^[[:space:]]*try[[:space:]]*{" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 5: Unbounded while(true) loops
while IFS=: read -r file line content; do
  code=$(sed -n "${line},$((line+2))p" "$file")
  emit_finding "$file" "$line" "Unbounded loop (should have explicit limit)" "Safety" "Prevents DoS" '"bounded-iteration.md"' "$code"
done < <(grep -rn "while[[:space:]]*([[:space:]]*true[[:space:]]*)" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 6: Sequential awaits
while IFS=: read -r file line content; do
  next_line=$((line + 1))
  next_content=$(sed -n "${next_line}p" "$file" 2>/dev/null || echo "")
  if echo "$next_content" | grep -q "await"; then
    code=$(sed -n "${line},$((line+1))p" "$file")
    emit_finding "$file" "$line" "Sequential awaits (could be parallel)" "I/O" "2-10x" '"defer-await.md", "batching.md"' "$code"
  fi
done < <(grep -rn "^[[:space:]]*const.*await" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 7: localStorage/sessionStorage in loops
while IFS=: read -r file line content; do
  start=$((line > 5 ? line - 5 : 1))
  context=$(sed -n "${start},${line}p" "$file")
  if echo "$context" | grep -q 'for\|while'; then
    code=$(sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Storage API call in loop (should cache)" "Caching" "5-20x" '"cache-storage-api.md"' "$code"
  fi
done < <(grep -rn "localStorage\|sessionStorage" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 8: Spread operator in loops
while IFS=: read -r file line content; do
  start=$((line > 5 ? line - 5 : 1))
  context=$(sed -n "${start},${line}p" "$file")
  if echo "$context" | grep -q 'for\|while'; then
    code=$(sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Spread operator in loop (creates allocations)" "Memory" "1.5-5x" '"avoid-allocations.md", "object-operations.md"' "$code"
  fi
done < <(grep -rn "\.\.\." --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 9: Property access in loops (heuristic: repeated . access)
while IFS=: read -r file line content; do
  if echo "$content" | grep -qE '\w+\.\w+\.\w+'; then
    start=$((line > 5 ? line - 5 : 1))
    context=$(sed -n "${start},${line}p" "$file")
    if echo "$context" | grep -q 'for\|while'; then
      code=$(sed -n "${line}p" "$file")
      emit_finding "$file" "$line" "Nested property access in loop (should cache)" "Caching" "1.2-2x" '"cache-property-access.md"' "$code"
    fi
  fi
done < <(grep -rn "\w\+\.\w\+\.\w\+" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

# Pattern 10: Template literals that could be String()
while IFS=: read -r file line content; do
  if echo "$content" | grep -qE '\$\{[^}]+\}[[:space:]]*`'; then
    # Single variable in template literal
    code=$(sed -n "${line}p" "$file")
    emit_finding "$file" "$line" "Template literal with single variable (use String() instead)" "Memory" "1.5-2x" '"avoid-allocations.md"' "$code"
  fi
done < <(grep -rn '`${' --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" "$TARGET" 2>/dev/null || true)

echo ""
echo "]"
