#!/usr/bin/env bash
# Check for suboptimal query patterns in React Testing Library tests
# Detects usage of getByTestId before trying accessible queries

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking for suboptimal query patterns in tests..."
echo

# Find test files
test_files=$(find . -type f \( -name "*.test.tsx" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.spec.ts" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/build/*")

issues_found=0

# Check for getByTestId usage
for file in $test_files; do
  if grep -n "getByTestId\|queryByTestId\|findByTestId\|getAllByTestId" "$file" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  $file${NC}"
    grep -n "getByTestId\|queryByTestId\|findByTestId\|getAllByTestId" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    💡 Consider: Can this use getByRole, getByLabelText, or getByText instead?"
    echo
    ((issues_found++))
  fi
done

# Check for container.querySelector usage
for file in $test_files; do
  if grep -n "container\.querySelector\|container\.querySelectorAll" "$file" > /dev/null 2>&1; then
    echo -e "${RED}❌ $file${NC}"
    grep -n "container\.querySelector\|container\.querySelectorAll" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    ❌ querySelector tests implementation details, not user experience"
    echo "    💡 Use screen.getByRole or other accessible queries"
    echo
    ((issues_found++))
  fi
done

# Check for destructured queries (potential stale queries)
for file in $test_files; do
  if grep -n "const { getBy.*} = render" "$file" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  $file${NC}"
    grep -n "const { getBy.*} = render" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    💡 Consider: Use screen.getBy* instead to avoid stale queries"
    echo
    ((issues_found++))
  fi
done

if [ $issues_found -eq 0 ]; then
  echo "✅ No query priority issues found!"
  exit 0
else
  echo "Found $issues_found files with potential query improvements"
  echo
  echo "Query priority recommendation:"
  echo "  1. getByRole        ← Most accessible"
  echo "  2. getByLabelText   ← For form fields"
  echo "  3. getByText        ← For static content"
  echo "  4. getByTestId      ← Last resort"
  exit 1
fi
