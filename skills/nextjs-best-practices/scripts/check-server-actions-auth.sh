#!/bin/bash
# Check for Server Actions without authentication checks

set -e

DIR="${1:-.}"

echo "🔍 Checking for Server Actions without authentication..."
echo

# Find all files with 'use server'
FILES=$(grep -r -l "'use server'\|\"use server\"" "$DIR" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true)

if [ -z "$FILES" ]; then
  echo "✅ No Server Actions found"
  exit 0
fi

HAS_ISSUES=0

for file in $FILES; do
  # Extract Server Action functions
  while IFS= read -r line; do
    # Check if function has auth check keywords
    if ! grep -q -E "auth\(\)|verifySession\(\)|requireAuth\(\)|getCurrentUser\(\)|getSession\(\)" "$file"; then
      echo "⚠️  $file"
      echo "   Missing authentication check"
      echo
      HAS_ISSUES=1
    fi
  done < <(grep -n "export.*async function" "$file")
done

if [ $HAS_ISSUES -eq 0 ]; then
  echo "✅ All Server Actions have authentication checks"
else
  echo
  echo "❌ Found Server Actions without authentication"
  echo
  echo "Fix: Add authentication check inside each Server Action:"
  echo "  const user = await getCurrentUser()"
  echo "  if (!user) throw new Error('Unauthorized')"
  exit 1
fi
