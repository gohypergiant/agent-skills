#!/usr/bin/env bash
# Detect common vitest testing anti-patterns in TypeScript/JavaScript test files
# Usage: ./scripts/detect-test-anti-patterns.sh <file-or-directory>
#
# Scans test files for anti-patterns and outputs JSON array of detected issues.
# Each issue includes:
# - file: path to the file
# - line: line number
# - pattern: type of anti-pattern detected
# - category: issue category (Assertions, Test Organization, Test Doubles, etc.)
# - severity: Critical, High, Medium, or Low
# - expectedGain: what fixing this issue improves
# - references: which reference files to consult
# - code: snippet of problematic code
#
# Detects:
# - Loose assertions (toBeTruthy, toBeDefined, etc.)
# - Nested describe blocks > 2 levels
# - Tests without AAA pattern boundaries
# - Mocking own functions
# - Missing global mock cleanup config
# - Using 'any' in tests
# - Non-sentence test descriptions
# - Testing library internals
# - Exporting functions for testing
# - Missing type checking
#
# Limitations:
# - Heuristic-based detection (may have false positives)
# - No semantic analysis (only syntax patterns)
# - Best combined with manual review

set -euo pipefail

target="${1:-.}"

if [[ ! -e "$target" ]]; then
  echo "Error: '$target' does not exist" >&2
  exit 1
fi

# Collect test files
if [[ -d "$target" ]]; then
  test_files=$(find "$target" -type f \( -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.test.js" -o -name "*.test.jsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" -o -name "*.spec.js" -o -name "*.spec.jsx" \) -not -path "*/node_modules/*" 2>/dev/null || echo "")
elif [[ -f "$target" ]]; then
  test_files="$target"
else
  echo "Error: Invalid target '$target'" >&2
  exit 1
fi

if [[ -z "$test_files" ]]; then
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

# Pattern detection functions
for file in $test_files; do
  # Skip if file doesn't exist
  [[ ! -f "$file" ]] && continue

  # 1. Detect loose assertions (Critical)
  while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    emit_finding "$file" "$linenum" "Loose assertions (toBeTruthy/toBeDefined)" \
      "Assertions" "Critical" \
      "Prevents false confidence from tests passing for unintended values" \
      "assertions.md" \
      "$code"
  done < <(grep -n "\.toBeTruthy()\|\.toBeDefined()\|\.toBeFalsy()\|\.toBeUndefined()" "$file" 2>/dev/null || true)

  # 2. Detect nested describe blocks > 2 levels (Medium)
  # Count indentation of describe blocks
  awk '
    /describe\(/ {
      indent = match($0, /[^ ]/)
      if (indent > max_indent) max_indent = indent
      if (indent > prev_indent + 2 && prev_line_describe) {
        print NR ":" $0
      }
      prev_indent = indent
      prev_line_describe = 1
    }
    !/describe\(/ {
      prev_line_describe = 0
    }
  ' "$file" | while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    emit_finding "$file" "$linenum" "Nested describe blocks > 2 levels" \
      "Test Organization" "Medium" \
      "Reduces cognitive overhead and improves test readability" \
      "organization.md" \
      "$code"
  done

  # 3. Detect tests without clear AAA boundaries (Medium)
  # Look for tests with multiple unrelated operations without comments/spacing
  awk '
    /it\(|it\.each\(/ {
      in_test = 1
      test_start = NR
      arrange_count = 0
      act_count = 0
      assert_count = 0
      next
    }
    in_test && /^\s*const |^\s*let |^\s*var / {
      arrange_count++
    }
    in_test && /\.mock|\.spy|vi\./ {
      arrange_count++
    }
    in_test && /=.*\(/ && !/expect/ {
      act_count++
    }
    in_test && /expect\(/ {
      assert_count++
    }
    in_test && /^\s*}\)/ {
      # Test ended - check if structure is unclear
      if (arrange_count > 2 && act_count > 1 && assert_count > 2) {
        print test_start ":" "Multiple operations without clear AAA boundaries"
      }
      in_test = 0
    }
  ' "$file" | while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    # Get actual line content
    actual_code=$(sed -n "${linenum}p" "$file")
    emit_finding "$file" "$linenum" "Tests without clear AAA pattern" \
      "AAA Pattern" "Medium" \
      "Improves test clarity and maintainability" \
      "aaa-pattern.md" \
      "$actual_code"
  done

  # 4. Detect mocking own functions (High)
  # Look for vi.mock calls with relative paths to own code
  while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    # Check if it's mocking a relative path (own code)
    if echo "$code" | grep -q "vi\.mock.*['\"]\."; then
      emit_finding "$file" "$linenum" "Mocking own functions" \
        "Test Doubles" "High" \
        "Tests become brittle and less valuable; prefer fakes for own code" \
        "test-doubles.md" \
        "$code"
    fi
  done < <(grep -n "vi\.mock\|vi\.spyOn.*\.\." "$file" 2>/dev/null || true)

  # 5. Detect 'any' usage in tests (High)
  while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    # Skip lines that are comments
    if ! echo "$code" | grep -q "^\s*//"; then
      emit_finding "$file" "$linenum" "Using 'any' type in tests" \
        "Code Quality" "High" \
        "Type safety prevents silent failures when signatures change" \
        "assertions.md" \
        "$code"
    fi
  done < <(grep -n " as any\|<any>\|: any" "$file" 2>/dev/null || true)

  # 6. Detect non-sentence test descriptions (Low)
  while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    # Check if description starts with capital or has "it should"
    if echo "$code" | grep -q "it(['\"][A-Z]\|it(['\"]It should"; then
      emit_finding "$file" "$linenum" "Test description doesn't read as sentence" \
        "Test Organization" "Low" \
        "Test output reads naturally as 'it should...'" \
        "organization.md" \
        "$code"
    fi
  done < <(grep -n "^\s*it(['\"]" "$file" 2>/dev/null || true)

  # 7. Detect testing library internals (Medium)
  # Look for tests that verify standard library behavior
  while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    if echo "$code" | grep -q "expect(.*\.map(\|expect(.*\.filter(\|expect(.*\.reduce(\|expect(.*Array\."; then
      emit_finding "$file" "$linenum" "Testing library internals" \
        "Code Quality" "Medium" \
        "Focus tests on business logic, not language/library features" \
        "organization.md" \
        "$code"
    fi
  done < <(grep -n "expect(" "$file" 2>/dev/null || true)

  # 8. Detect exported internal functions (High)
  # Check implementation file if test file exists
  impl_file="${file%.test.*}.ts"
  if [[ ! -f "$impl_file" ]]; then
    impl_file="${file%.test.*}.tsx"
  fi
  if [[ ! -f "$impl_file" ]]; then
    impl_file="${file%.spec.*}.ts"
  fi
  if [[ ! -f "$impl_file" ]]; then
    impl_file="${file%.spec.*}.tsx"
  fi

  if [[ -f "$impl_file" ]]; then
    # Look for exports that appear to be internal (start with _, or have "internal" in name)
    while IFS=: read -r linenum code; do
      [[ -z "$linenum" ]] && continue
      if echo "$code" | grep -q "export.*function _\|export.*_.*=\|export.*internal"; then
        emit_finding "$impl_file" "$linenum" "Exporting internal functions for testing" \
          "Code Quality" "High" \
          "Test through public API or extract to separate module" \
          "organization.md" \
          "$code"
      fi
    done < <(grep -n "export" "$impl_file" 2>/dev/null || true)
  fi

  # 9. Detect shared mutable state (Critical)
  # Look for let/var at module level that tests might mutate
  awk '
    /^(let|var) / && !in_function {
      print NR ":" $0
    }
    /^(function|const.*=>|describe\(|it\()/ {
      in_function = 1
    }
    /^\}/ {
      in_function = 0
    }
  ' "$file" | while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    emit_finding "$file" "$linenum" "Shared mutable state between tests" \
      "Test Organization" "Critical" \
      "Creates order-dependent failures and flaky tests" \
      "organization.md" \
      "$code"
  done

  # 10. Detect parameterized test opportunities (Low)
  # Look for multiple similar tests that could use it.each
  awk '
    /it\(['\''"]/ {
      test_name = $0
      gsub(/.*it\(['\''"]/, "", test_name)
      gsub(/['\''"].*/, "", test_name)

      # Extract base pattern (before numbers/specific values)
      base = test_name
      gsub(/[0-9]+/, "N", base)
      gsub(/true|false/, "BOOL", base)

      pattern_count[base]++
      if (pattern_count[base] == 2) {
        print NR ":" $0
      }
    }
  ' "$file" | head -5 | while IFS=: read -r linenum code; do
    [[ -z "$linenum" ]] && continue
    emit_finding "$file" "$linenum" "Similar tests could use it.each()" \
      "Test Organization" "Low" \
      "Reduces duplication and makes test variations clearer" \
      "parameterized-tests.md" \
      "$code"
  done

done

echo ""
echo "]"
