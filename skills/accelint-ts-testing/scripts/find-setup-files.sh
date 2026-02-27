#!/usr/bin/env bash
# Find and list vitest setup files
# Usage: ./scripts/find-setup-files.sh
#
# This script discovers existing test setup files in common locations:
# - test/setup.{ts,js}
# - testing/setup.{ts,js}
# - vitest.setup.{ts,js}
# - src/test/setup.{ts,js}
#
# Also checks vitest.config for configured setupFiles and globalSetup.
#
# Use this before writing tests to understand what's already configured.

set -euo pipefail

echo "Searching for vitest setup files..."
echo ""

# Find setup files in common locations
setup_files=$(find . -type f \( \
  -path "*/test/setup.*" -o \
  -path "*/testing/setup.*" -o \
  -path "*/vitest.setup.*" -o \
  -path "*/src/test/setup.*" \
  \) -not -path "*/node_modules/*" 2>/dev/null || true)

if [[ -n "$setup_files" ]]; then
  echo "Found setup files:"
  echo "$setup_files" | while read -r file; do
    echo "  📄 $file"
  done
  echo ""
else
  echo "No setup files found in common locations."
  echo ""
fi

# Check vitest.config for setupFiles configuration
config_file=$(find . -maxdepth 3 -name "vitest.config.*" -type f -not -path "*/node_modules/*" | head -1)

if [[ -n "$config_file" ]]; then
  echo "Checking $config_file for setupFiles configuration..."
  echo ""

  if grep -A 5 "setupFiles\|globalSetup" "$config_file" | grep -v "^--$" > /dev/null 2>&1; then
    echo "Setup configuration in $config_file:"
    grep -B 2 -A 5 "setupFiles\|globalSetup" "$config_file" | grep -v "^--$" || true
  else
    echo "No setupFiles or globalSetup configured in vitest.config"
  fi
else
  echo "No vitest.config file found."
fi

echo ""
echo "💡 Setup files typically contain:"
echo "   - Global mocks (fetch, timers, etc.)"
echo "   - Custom matchers (@testing-library/jest-dom)"
echo "   - Test utilities and helpers"
echo "   - Environment configuration"
