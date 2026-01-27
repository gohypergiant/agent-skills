#!/bin/bash
# Find potential waterfall chains (sequential awaits)

set -e

DIR="${1:-.}"

echo "🔍 Finding potential waterfall chains..."
echo

# Find files with await statements
FILES=$(find "$DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null)

HAS_ISSUES=0

for file in $FILES; do
  # Count awaits in the file
  AWAIT_COUNT=$(grep -c "await " "$file" 2>/dev/null || echo "0")

  if [ "$AWAIT_COUNT" -gt 1 ]; then
    echo "⚠️  $file"
    echo "   Multiple awaits detected ($AWAIT_COUNT)"
    grep -n "await " "$file" | head -5
    echo
    HAS_ISSUES=1
  fi
done

if [ $HAS_ISSUES -eq 0 ]; then
  echo "✅ No obvious waterfall chains detected"
else
  echo
  echo "Review these files for potential parallelization opportunities"
  echo
  echo "Fix: Start independent operations immediately:"
  echo "  ❌ const a = await fetchA()"
  echo "     const b = await fetchB()"
  echo
  echo "  ✅ const [a, b] = await Promise.allSettled([fetchA(), fetchB()])"
fi
