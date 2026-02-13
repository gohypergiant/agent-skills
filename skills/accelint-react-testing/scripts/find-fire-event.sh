#!/usr/bin/env bash
# Detect fireEvent usage that should be userEvent
# fireEvent should only be used for non-user events (scroll, resize, etc.)

set -Eeuo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "🔍 Detecting fireEvent usage in tests..."
echo

mapfile -t test_files < <(find . -type f \( -name "*.test.tsx" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.spec.ts" \) ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/build/*" || true)

issues_found=0

# User interaction events that should use userEvent
user_events=(
  "click"
  "dblClick"
  "change"
  "input"
  "keyDown"
  "keyUp"
  "keyPress"
  "mouseOver"
  "mouseEnter"
  "mouseLeave"
  "mouseDown"
  "mouseUp"
  "focus"
  "blur"
  "submit"
  "paste"
  "copy"
)

# Non-user events where fireEvent is acceptable
acceptable_events=(
  "scroll"
  "resize"
  "animationEnd"
  "transitionEnd"
  "load"
  "error"
)

for file in "${test_files[@]}"; do
  for event in "${user_events[@]}"; do
    if grep -n "fireEvent\.$event\|fireEvent\.(['\"]$event" "$file" > /dev/null 2>&1; then
      if [ $issues_found -eq 0 ]; then
        echo -e "${RED}❌ Found fireEvent usage for user interactions:${NC}"
        echo
      fi
      
      echo -e "${YELLOW}$file${NC}"
      grep -n "fireEvent\.$event" "$file" | while read -r line; do
        echo "    $line"
      done
      echo "    ❌ Use userEvent.$event() instead of fireEvent.$event()"
      echo "    💡 userEvent simulates complete interaction sequences"
      echo
      issues_found=$((issues_found + 1))
    fi
  done
done

# Report acceptable fireEvent usage
acceptable_found=0
for file in "${test_files[@]}"; do
  for event in "${acceptable_events[@]}"; do
    if grep -n "fireEvent\.$event" "$file" > /dev/null 2>&1; then
      if [ $acceptable_found -eq 0 ]; then
        echo -e "${GREEN}✅ Acceptable fireEvent usage (non-user events):${NC}"
        echo
        acceptable_found=1
      fi
      
      echo -e "${GREEN}$file${NC}"
      grep -n "fireEvent\.$event" "$file" | while read -r line; do
        echo "    $line"
      done
      echo
    fi
  done
done

if [ $issues_found -eq 0 ]; then
  echo "✅ No problematic fireEvent usage found!"
  exit 0
else
  echo "Found $issues_found files using fireEvent for user interactions"
  echo
  echo "Migration guide:"
  echo "  1. Import: import userEvent from '@testing-library/user-event';"
  echo "  2. Setup: const user = userEvent.setup();"
  echo "  3. Replace: await user.click(element);"
  echo "  4. Remember: userEvent methods return Promises - always await!"
  exit 1
fi
