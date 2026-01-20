#!/bin/bash

# detect-static-jsx.sh
# Identifies potentially hoistable static JSX in React components
# Related to: 2.3 Hoist Static JSX (references/hoist-static-jsx.md)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to current directory if no argument provided
SEARCH_DIR="${1:-.}"

echo "Detecting potentially hoistable static JSX in: $SEARCH_DIR"
echo "----------------------------------------"
echo ""

# Find common patterns of static JSX that could be hoisted
# Pattern 1: Skeleton/loading components defined inside functions
echo -e "${BLUE}Checking for inline skeleton/loading components...${NC}"
SKELETON_PATTERNS=$(grep -rn "return.*<.*skeleton\|loading\|spinner.*>" "$SEARCH_DIR" --include="*.tsx" --include="*.jsx" -A 2 -B 2 2>/dev/null | grep -i "className.*skeleton\|className.*loading" || true)

# Pattern 2: Static SVG elements
echo -e "${BLUE}Checking for static SVG elements...${NC}"
STATIC_SVG=$(grep -rn "return.*<svg" "$SEARCH_DIR" --include="*.tsx" --include="*.jsx" -A 5 2>/dev/null | grep -v "props\|{" | head -20 || true)

# Pattern 3: Icon components that don't use props
echo -e "${BLUE}Checking for potentially static icon components...${NC}"
STATIC_ICONS=$(grep -rn "function.*Icon.*{" "$SEARCH_DIR" --include="*.tsx" --include="*.jsx" -A 10 2>/dev/null | grep "return <svg" | head -10 || true)

FINDINGS_COUNT=0

if [ -n "$SKELETON_PATTERNS" ]; then
  echo -e "${YELLOW}⚠️  Found potentially hoistable skeleton/loading components:${NC}"
  echo "$SKELETON_PATTERNS" | head -20
  echo ""
  FINDINGS_COUNT=$((FINDINGS_COUNT + 1))
fi

if [ -n "$STATIC_SVG" ]; then
  echo -e "${YELLOW}⚠️  Found potentially static SVG elements:${NC}"
  echo "$STATIC_SVG"
  echo ""
  FINDINGS_COUNT=$((FINDINGS_COUNT + 1))
fi

if [ -n "$STATIC_ICONS" ]; then
  echo -e "${YELLOW}⚠️  Found icon components that might be static:${NC}"
  echo "$STATIC_ICONS"
  echo ""
  FINDINGS_COUNT=$((FINDINGS_COUNT + 1))
fi

if [ $FINDINGS_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ No obvious static JSX hoisting opportunities found!${NC}"
  echo ""
  echo "Note: This is a heuristic check. Manual review may find additional opportunities."
  exit 0
else
  echo -e "${BLUE}💡 Optimization guide:${NC}"
  echo ""
  echo "   Before (recreated on every render):"
  echo "   function Component() {"
  echo "     return loading ? <Skeleton /> : <Content />"
  echo "   }"
  echo ""
  echo "   After (hoisted to module scope):"
  echo "   const skeleton = <Skeleton />"
  echo "   function Component() {"
  echo "     return loading ? skeleton : <Content />"
  echo "   }"
  echo ""
  echo "See: references/hoist-static-jsx.md"
  echo ""
  echo -e "${YELLOW}⚠️  Note: Only hoist JSX that doesn't depend on props/state!${NC}"
  echo "         If React Compiler is enabled, manual hoisting is unnecessary."
  exit 0
fi
