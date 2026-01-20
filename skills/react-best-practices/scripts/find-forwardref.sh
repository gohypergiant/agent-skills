#!/bin/bash

# find-forwardref.sh
# Finds deprecated forwardRef usage in React code
# Related to: 4.2 No forwardRef (references/no-forwardref.md)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to current directory if no argument provided
SEARCH_DIR="${1:-.}"

echo "Checking for deprecated forwardRef usage in: $SEARCH_DIR"
echo "----------------------------------------"

# Find forwardRef imports
FORWARDREF_IMPORTS=$(grep -rn "import.*forwardRef.*from ['\"]react['\"]" "$SEARCH_DIR" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true)

# Find forwardRef usage
FORWARDREF_USAGE=$(grep -rn "\bforwardRef\s*(" "$SEARCH_DIR" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true)

ISSUES_FOUND=0

if [ -n "$FORWARDREF_IMPORTS" ]; then
  echo -e "${RED}❌ Found forwardRef imports:${NC}"
  echo "$FORWARDREF_IMPORTS"
  echo ""
  ISSUES_FOUND=1
fi

if [ -n "$FORWARDREF_USAGE" ]; then
  echo -e "${RED}❌ Found forwardRef usage:${NC}"
  echo "$FORWARDREF_USAGE"
  echo ""
  ISSUES_FOUND=1
fi

if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ No deprecated forwardRef usage found!${NC}"
  exit 0
else
  echo -e "${YELLOW}💡 Migration guide:${NC}"
  echo ""
  echo "   Before (React 18):"
  echo "   const Input = forwardRef((props, ref) => <input ref={ref} {...props} />)"
  echo ""
  echo "   After (React 19):"
  echo "   function Input({ ref, ...props }) {"
  echo "     return <input ref={ref} {...props} />"
  echo "   }"
  echo ""
  echo "See: references/no-forwardref.md"
  exit 1
fi
