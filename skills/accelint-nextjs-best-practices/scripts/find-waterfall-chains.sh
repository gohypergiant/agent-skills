#!/bin/bash
# Find potential waterfall chains (sequential awaits)

set -e

DIR="${1:-.}"

echo "🔍 Finding potential waterfall chains..."
echo

# Find files with multiple awaits in sequence
FILES=$(find "$DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null)

HAS_ISSUES=0

for file in $FILES; do
  # Look for multiple awaits within 5 lines of each other
  if grep -Pzo '(?s)await[^\n]*\n([^\n]*\n){0,5}await' "$file" > /dev/null 2>&1; then
    echo "⚠️  $file"
    echo "   Multiple awaits in sequence (potential waterfall)"

    # Show the problematic lines
    grep -n "await" "$file" | head -10
    echo
    HAS_ISSUES=1
  fi
done

if [ $HAS_ISSUES -eq 0 ]; then
  echo "✅ No obvious waterfall chains detected"
else
  echo
  echo "❌ Found potential waterfall chains"
  echo
  echo "Fix: Start independent operations immediately:"
  echo "  ❌ const a = await fetchA()"
  echo "     const b = await fetchB()"
  echo
  echo "  ✅ const aPromise = fetchA()"
  echo "     const bPromise = fetchB()"
  echo "     const [a, b] = await Promise.allSettled([aPromise, bPromise])"
  exit 1
fi
