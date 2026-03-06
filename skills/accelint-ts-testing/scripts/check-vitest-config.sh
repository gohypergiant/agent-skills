#!/usr/bin/env bash
# Check vitest.config for required global mock cleanup settings
# Usage: ./scripts/check-vitest-config.sh
#
# This script verifies that global mock cleanup is configured to prevent
# "action at a distance" test failures where mocks leak between test files.
#
# Required settings:
# - clearMocks: true
# - mockReset: true
# - restoreMocks: true
#
# These eliminate the entire class of order-dependent test failures.
#
# Limitations: Uses grep-based checking. Follows local imports but cannot
# resolve settings from external packages (e.g., @company/vitest-config).
# When config inheritance is detected but settings aren't found, reports
# a warning and suggests manual verification.

set -euo pipefail

# Find vitest config file (supports .ts, .js, .mjs extensions)
config_file=$(find . -maxdepth 3 -name "vitest.config.*" -type f -not -path "*/node_modules/*" | head -1)

if [[ -z "$config_file" ]]; then
  echo "❌ No vitest.config file found"
  echo ""
  echo "Searched for: vitest.config.{ts,js,mjs}"
  exit 1
fi

echo "Checking $config_file for global mock cleanup settings..."
echo ""

# Collect all files to check (config + any imported local configs)
files_to_check=("$config_file")

# Look for imported base configs (local relative imports only)
config_dir=$(dirname "$config_file")
base_imports=$(grep -h "import.*from.*['\"]\..*" "$config_file" 2>/dev/null | \
  sed -E "s/.*from ['\"]([^'\"]+)['\"].*/\1/" || true)

# Resolve relative imports
for import_path in $base_imports; do
  # Only handle relative imports (starts with . or ..)
  if [[ "$import_path" == ./* ]] || [[ "$import_path" == ../* ]]; then
    resolved_path="$config_dir/$import_path"
    # Try common extensions if no extension provided
    for ext in "" ".ts" ".js" ".mjs"; do
      if [[ -f "$resolved_path$ext" ]]; then
        files_to_check+=("$resolved_path$ext")
        break
      fi
    done
  fi
done

# Show which files we're checking
if [[ ${#files_to_check[@]} -gt 1 ]]; then
  echo "Checking config files:"
  printf '  - %s\n' "${files_to_check[@]}"
  echo ""
fi

# Check all files for the settings
found_clear=false
found_reset=false
found_restore=false

for file in "${files_to_check[@]}"; do
  if [[ -f "$file" ]]; then
    grep -q "clearMocks.*true" "$file" 2>/dev/null && found_clear=true
    grep -q "mockReset.*true" "$file" 2>/dev/null && found_reset=true
    grep -q "restoreMocks.*true" "$file" 2>/dev/null && found_restore=true
  fi
done

# Determine what's missing
missing=()
$found_clear || missing+=("clearMocks: true")
$found_reset || missing+=("mockReset: true")
$found_restore || missing+=("restoreMocks: true")

if [[ ${#missing[@]} -eq 0 ]]; then
  echo "✅ All global mock cleanup settings found"
  echo ""
  echo "Mock cleanup is handled globally. No manual cleanup needed in tests."
  exit 0
fi

# Settings are missing - check if config uses external imports
has_external_import=false
if grep -q "from ['\"][^'\"./]" "$config_file" 2>/dev/null; then
  has_external_import=true
fi

has_merge_pattern=false
if grep -q "mergeConfig\|\.\.\..*config\|extends.*config" "$config_file" 2>/dev/null; then
  has_merge_pattern=true
fi

# If using external imports or merging, it might be a false negative
if $has_external_import || $has_merge_pattern; then
  echo "⚠️  Settings not found in checked files, but config uses inheritance:"
  printf '   - %s\n' "${missing[@]}"
  echo ""

  if $has_external_import; then
    echo "Config imports from external packages that we cannot inspect."
    external_imports=$(grep -h "from ['\"][^'\"./]" "$config_file" | sed -E "s/.*from ['\"]([^'\"]+)['\"].*/\1/" | sort -u)
    echo "External imports found:"
    echo "$external_imports" | while read -r pkg; do
      echo "  - $pkg"
    done
    echo ""
  fi

  echo "These settings might be defined in:"
  echo "  - External config packages"
  echo "  - Base configs we couldn't resolve"
  echo ""
  echo "To verify, run your tests and check for mock leakage issues."
  echo "Or manually inspect the resolved config in your test output."
  echo ""
  echo "If settings are truly missing, add them to $config_file:"
  echo ""
  echo "export default defineConfig({"
  echo "  test: {"
  printf '    %s,\n' "${missing[@]}"
  echo "  }"
  echo "})"
  exit 2  # Warning exit code (not a hard failure)
else
  # No inheritance detected - settings are definitely missing
  echo "❌ Missing global mock cleanup settings:"
  printf '   - %s\n' "${missing[@]}"
  echo ""
  echo "Add these to $config_file:"
  echo ""
  echo "export default defineConfig({"
  echo "  test: {"
  printf '    %s,\n' "${missing[@]}"
  echo "  }"
  echo "})"
  echo ""
  echo "This eliminates order-dependent test failures from mock leakage."
  exit 1
fi
