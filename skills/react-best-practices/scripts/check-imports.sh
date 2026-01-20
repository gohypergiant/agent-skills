#!/bin/bash

# check-imports.sh
# Validates that React code uses named imports instead of default or wildcard imports
# Related to: 4.1 Named Imports (references/named-imports.md)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to current directory if no argument provided
SEARCH_DIR="${1:-.}"

echo "Checking React imports in: $SEARCH_DIR"
echo "----------------------------------------"

# Find files with default React import
DEFAULT_IMPORTS=$(grep -r "^import React from ['\"]react['\"]" "$SEARCH_DIR" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true)

# Find files with wildcard React import
WILDCARD_IMPORTS=$(grep -r "^import \* as React from ['\"]react['\"]" "$SEARCH_DIR" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" 2>/dev/null || true)

ISSUES_FOUND=0

if [ -n "$DEFAULT_IMPORTS" ]; then
  echo -e "${RED}❌ Found default imports (use named imports instead):${NC}"
  echo "$DEFAULT_IMPORTS"
  echo ""
  ISSUES_FOUND=1
fi

if [ -n "$WILDCARD_IMPORTS" ]; then
  echo -e "${RED}❌ Found wildcard imports (use named imports instead):${NC}"
  echo "$WILDCARD_IMPORTS"
  echo ""
  ISSUES_FOUND=1
fi

if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ All React imports are using named imports!${NC}"
  exit 0
else
  echo -e "${YELLOW}💡 Fix: Replace with named imports like:${NC}"
  echo "   import { useState, useEffect } from 'react'"
  echo ""
  echo "See: references/named-imports.md"
  exit 1
fi
