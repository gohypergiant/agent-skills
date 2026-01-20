# React Best Practices - Automation Scripts

This directory contains helper scripts to automatically detect common React anti-patterns and optimization opportunities.

## Available Scripts

### check-imports.sh

Validates that React code uses named imports instead of default or wildcard imports.

**Usage:**
```bash
./scripts/check-imports.sh [directory]
```

**What it checks:**
- ❌ `import React from 'react'` (default import)
- ❌ `import * as React from 'react'` (wildcard import)
- ✅ `import { useState, useEffect } from 'react'` (named imports)

**Related pattern:** [4.1 Named Imports](../references/named-imports.md)

**Example:**
```bash
# Check current directory
./scripts/check-imports.sh

# Check specific directory
./scripts/check-imports.sh src/components

# Use in CI
./scripts/check-imports.sh src && echo "Imports OK"
```

---

### find-forwardref.sh

Finds deprecated `forwardRef` usage that should be migrated to React 19's ref-as-prop pattern.

**Usage:**
```bash
./scripts/find-forwardref.sh [directory]
```

**What it checks:**
- ❌ `import { forwardRef } from 'react'`
- ❌ `forwardRef((props, ref) => ...)`
- ✅ `function Component({ ref, ...props })`

**Related pattern:** [4.2 No forwardRef](../references/no-forwardref.md)

**Example:**
```bash
# Find all forwardRef usage
./scripts/find-forwardref.sh src

# Check before React 19 migration
./scripts/find-forwardref.sh . > forwardref-audit.txt
```

---

### detect-static-jsx.sh

Identifies potentially hoistable static JSX elements in React components.

**Usage:**
```bash
./scripts/detect-static-jsx.sh [directory]
```

**What it detects:**
- Skeleton/loading components defined inside functions
- Static SVG elements that don't use props
- Icon components that might not need to be functions

**Related pattern:** [2.3 Hoist Static JSX](../references/hoist-static-jsx.md)

**Important:** Only hoist JSX that doesn't depend on props or state. If React Compiler is enabled, manual hoisting is unnecessary.

**Example:**
```bash
# Scan for hoisting opportunities
./scripts/detect-static-jsx.sh src/components

# Review findings manually
./scripts/detect-static-jsx.sh . | less
```

---

## Running All Checks

You can run all checks together:

```bash
#!/bin/bash
echo "Running React best practices checks..."

./scripts/check-imports.sh src
./scripts/find-forwardref.sh src
./scripts/detect-static-jsx.sh src

echo "All checks complete!"
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: React Best Practices

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check React imports
        run: ./scripts/check-imports.sh src

      - name: Check for deprecated forwardRef
        run: ./scripts/find-forwardref.sh src
```

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running React best practices checks..."

if ! ./scripts/check-imports.sh src; then
  echo "❌ Import check failed"
  exit 1
fi

if ! ./scripts/find-forwardref.sh src; then
  echo "⚠️  Found deprecated forwardRef usage"
  # Don't fail commit, just warn
fi

echo "✅ Pre-commit checks passed"
```

---

## Limitations

These scripts use simple pattern matching and may produce:

- **False positives** - Code that looks like an anti-pattern but is actually fine
- **False negatives** - Missed issues due to complex code patterns
- **Context-unaware** - Scripts don't understand code semantics

Always manually review findings before making changes.

---

## Adding New Scripts

When adding new automation scripts:

1. **Name clearly** - Use verb-noun format (e.g., `check-imports.sh`)
2. **Add help text** - Include usage and examples in script header
3. **Use colors** - Make output easy to scan (red=error, yellow=warning, green=success)
4. **Exit codes** - Return 0 for success, 1 for failures
5. **Document here** - Add to this README with usage examples

---

## React Compiler Note

If your project uses React Compiler, some of these checks become less critical:

- **check-imports.sh** - Still important (syntax requirement)
- **find-forwardref.sh** - Still important (React 19 migration)
- **detect-static-jsx.sh** - Less important (compiler handles hoisting)

See [React Compiler Guide](../references/react-compiler-guide.md) for details.

---

## Related Resources

- [Quick Checklists](../references/quick-checklists.md) - Manual code review checklists
- [AGENTS.md](../AGENTS.md) - Complete pattern reference
- [Compound Patterns](../references/compound-patterns.md) - Real-world examples
