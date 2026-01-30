#!/bin/bash
# Detect barrel file imports from large libraries

set -e

DIR="${1:-.}"

echo "🔍 Detecting barrel file imports..."
echo

# Common libraries with barrel file issues
LIBRARIES=(
  "lucide-react"
  "@mui/material"
  "@mui/icons-material"
  "react-icons"
  "antd"
  "@ant-design/icons"
)

HAS_ISSUES=0

for lib in "${LIBRARIES[@]}"; do
  # Find imports from barrel files (not sub-paths)
  MATCHES=$(grep -rn "from ['\"]$lib['\"]" "$DIR" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true)

  if [ -n "$MATCHES" ]; then
    echo "⚠️  Found barrel imports from $lib:"
    echo "$MATCHES" | head -5
    echo
    HAS_ISSUES=1
  fi
done

if [ $HAS_ISSUES -eq 0 ]; then
  echo "✅ No barrel file imports detected"
else
  echo
  echo "❌ Found barrel file imports"
  echo
  echo "Fix examples:"
  echo "  ❌ import { Check } from 'lucide-react'"
  echo "  ✅ import Check from 'lucide-react/dist/esm/icons/check'"
  echo
  echo "  ❌ import { Button } from '@mui/material'"
  echo "  ✅ import Button from '@mui/material/Button'"
  echo
  echo "Or use Next.js optimizePackageImports in next.config.js"
  exit 1
fi
