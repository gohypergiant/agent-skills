# Next.js Best Practices - Automation Scripts

This directory contains helper scripts that detect common Next.js anti-patterns and optimization opportunities.

## Available Scripts

### check-server-actions-auth.sh

Validates that Server Actions include authentication checks.

**Usage:**
```bash
./scripts/check-server-actions-auth.sh [directory]
```

**What it checks:**
- ❌ Server Actions without auth checks
- ✅ Server Actions with `auth()`, `getCurrentUser()`, `requireAuth()`, etc.

**Related pattern:** [2.1 Authenticate Server Actions](../references/server-actions-security.md)

**Example:**
```bash
# Check current directory
./scripts/check-server-actions-auth.sh

# Check specific directory
./scripts/check-server-actions-auth.sh app/actions

# Use in CI
./scripts/check-server-actions-auth.sh app && echo "Auth checks OK"
```

---

### detect-barrel-imports.sh

Finds barrel-file imports from large libraries that can slow dev-server startup.

**Usage:**
```bash
./scripts/detect-barrel-imports.sh [directory]
```

**What it checks:**
- ❌ `import { Check } from 'lucide-react'` (barrel import)
- ❌ `import { Button } from '@mui/material'` (barrel import)
- ✅ `import Check from 'lucide-react/dist/esm/icons/check'` (direct import)
- ✅ `import Button from '@mui/material/Button'` (direct import)

**Related pattern:** [3.1 Avoid Barrel File Imports](../references/avoid-barrel-imports.md)

**Example:**
```bash
# Check for barrel imports
./scripts/detect-barrel-imports.sh app

# Check before build
./scripts/detect-barrel-imports.sh . && npm run build
```

---

### find-waterfall-chains.sh

Detects potential waterfall chains where independent operations are awaited in sequence.

**Usage:**
```bash
./scripts/find-waterfall-chains.sh [directory]
```

**What it detects:**
- Multiple `await` statements in sequence
- Potential parallelization opportunities

**Related pattern:** [1.1 Prevent Waterfall Chains](../references/prevent-waterfall-chains.md)

**Example:**
```bash
# Find potential waterfalls
./scripts/find-waterfall-chains.sh app/api

# Review findings
./scripts/find-waterfall-chains.sh . | less
```

---

## Running All Checks

You can run all checks together:

```bash
#!/bin/bash
echo "Running Next.js best practices checks..."

./scripts/check-server-actions-auth.sh app
./scripts/detect-barrel-imports.sh app
./scripts/find-waterfall-chains.sh app

echo "All checks complete!"
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Next.js Best Practices

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check Server Actions authentication
        run: ./scripts/check-server-actions-auth.sh app

      - name: Check for barrel imports
        run: ./scripts/detect-barrel-imports.sh app

      - name: Check for waterfall chains
        run: ./scripts/find-waterfall-chains.sh app
```

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running Next.js best practices checks..."

if ! ./scripts/check-server-actions-auth.sh app; then
  echo "❌ Server Actions auth check failed"
  exit 1
fi

if ! ./scripts/detect-barrel-imports.sh app; then
  echo "⚠️  Found barrel imports (consider fixing)"
  # Don't fail commit, just warn
fi

echo "✅ Pre-commit checks passed"
```

---

## Limitations

These scripts use simple pattern matching and can produce:

- **False positives** - Code that looks like an anti-pattern but is actually acceptable
- **False negatives** - Missed issues caused by complex code patterns
- **Context-unaware** - The scripts do not understand code semantics

Always manually review findings before making changes.

---

## Adding New Scripts

When adding new automation scripts:

1. **Name clearly** - Use verb-noun format such as `check-auth.sh`.
2. **Add help text** - Include usage and examples in the script header.
3. **Use colors** - Make output easy to scan (`red=error`, `yellow=warning`, `green=success`).
4. **Use exit codes** - Return `0` for success and `1` for failures.
5. **Document here** - Add the script to this README with usage examples.

---

## Related Resources

- [Quick Checklist](../references/quick-checklist.md) - Manual code review checklists
- [AGENTS.md](../AGENTS.md) - Complete pattern reference
- [Compound Patterns](../references/compound-patterns.md) - Real-world examples

---

## Notes

- These scripts are designed for Next.js App Router (13+)
- Adjust patterns if using Pages Router
- Scripts require `grep`, `find`, and basic Unix tools
- Works on macOS, Linux, and WSL

---

**Last Updated:** 2026-01-26
**Next.js Version:** App Router (13+)
