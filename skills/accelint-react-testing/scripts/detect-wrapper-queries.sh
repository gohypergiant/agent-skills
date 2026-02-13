#!/usr/bin/env bash
# Detect deprecated wrapper/container query patterns
# Tests should use screen queries instead

set -Eeuo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Detecting deprecated wrapper and container query patterns..."
echo

mapfile -t test_files < <(find . -type f \( -name "*.test.tsx" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.spec.ts" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/build/*" || true)

issues_found=0

# Check for wrapper usage
for file in "${test_files[@]}"; do
  if grep -n "const { wrapper" "$file" > /dev/null 2>&1; then
    if [ $issues_found -eq 0 ]; then
      echo -e "${RED}❌ Found deprecated wrapper usage:${NC}"
      echo
    fi
    
    echo -e "${YELLOW}$file${NC}"
    grep -n "const { wrapper" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    ❌ wrapper is deprecated"
    echo "    💡 Use screen.getBy* or within() for scoped queries"
    echo
    issues_found=$((issues_found + 1))
  fi
done

# Check for wrapper.getBy* calls
for file in "${test_files[@]}"; do
  if grep -n "wrapper\.getBy\|wrapper\.findBy\|wrapper\.queryBy" "$file" > /dev/null 2>&1; then
    echo -e "${YELLOW}$file${NC}"
    grep -n "wrapper\.getBy\|wrapper\.findBy\|wrapper\.queryBy" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    ❌ wrapper queries are deprecated"
    echo "    💡 Replace with screen.getBy* or within()"
    echo
    issues_found=$((issues_found + 1))
  fi
done

# Check for container.firstChild
for file in "${test_files[@]}"; do
  if grep -n "container\.firstChild\|container\.children" "$file" > /dev/null 2>&1; then
    echo -e "${YELLOW}$file${NC}"
    grep -n "container\.firstChild\|container\.children" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    ❌ Testing DOM structure directly"
    echo "    💡 Use semantic queries that match user behavior"
    echo
    issues_found=$((issues_found + 1))
  fi
done

# Check for rerender usage (potential anti-pattern)
for file in "${test_files[@]}"; do
  if grep -n "const { rerender" "$file" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  $file${NC}"
    grep -n "const { rerender" "$file" | while read -r line; do
      echo "    $line"
    done
    echo "    ⚠️  Using rerender - consider testing through user interactions instead"
    echo "    💡 Trigger state changes via userEvent.click(), etc."
    echo
    issues_found=$((issues_found + 1))
  fi
done

if [ $issues_found -eq 0 ]; then
  echo "✅ No deprecated patterns found!"
  exit 0
else
  echo "Found $issues_found files with deprecated patterns"
  echo
  echo "Recommended changes:"
  echo "  • Replace wrapper.getBy* with screen.getBy*"
  echo "  • Replace container.querySelector with screen.getByRole"
  echo "  • Replace rerender() with user interactions"
  echo "  • Use within() for scoped queries within a region"
  exit 1
fi
