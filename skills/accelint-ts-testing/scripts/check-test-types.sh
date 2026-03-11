#!/usr/bin/env bash
# Check TypeScript types for test files
# Usage: ./scripts/check-test-types.sh path/to/test.test.ts
#
# This script automates the "Before Marking Test Files Complete" workflow by:
# 1. Detecting the package manager (bun, pnpm, yarn, npm)
# 2. Running tsc --noEmit on the test file
# 3. Catching type errors that tsconfig.json might miss
#
# Why this matters: Test files are often excluded from tsconfig.json,
# so running tsc at project root won't catch test type errors.

set -euo pipefail

test_file="${1:?Usage: $0 <test-file-path>}"

if [[ ! -f "$test_file" ]]; then
  echo "Error: Test file not found: $test_file"
  exit 1
fi

# Detect package manager by lock file
if [[ -f "bun.lockb" ]] || [[ -f "bun.lock" ]]; then
  cmd="bunx tsc --noEmit"
elif [[ -f "pnpm-lock.yaml" ]]; then
  cmd="pnpm exec tsc --noEmit"
elif [[ -f "yarn.lock" ]]; then
  cmd="yarn exec tsc --noEmit"
elif [[ -f "package-lock.json" ]]; then
  cmd="npm exec tsc -- --noEmit"
else
  echo "Error: No lock file found (bun.lockb, pnpm-lock.yaml, yarn.lock, package-lock.json)"
  echo "Cannot detect package manager. Please run tsc manually."
  exit 1
fi

echo "Running: $cmd $test_file"
echo ""

if $cmd "$test_file"; then
  echo ""
  echo "✅ No type errors found in $test_file"
  exit 0
else
  echo ""
  echo "❌ Type errors found in $test_file"
  echo ""
  echo "Fix all type errors before marking test complete."
  echo "Do NOT use 'as any' or '@ts-ignore' to bypass errors."
  exit 1
fi
