# 3.1 Avoid Barrel File Imports

Import directly from source files instead of barrel files to avoid loading thousands of unused modules. **Barrel files** are entry points that re-export multiple modules (e.g., `index.js` that does `export * from './module'`).

**Why tree-shaking doesn't help:** When a library is marked as external (not bundled), the bundler can't optimize it. If you bundle it to enable tree-shaking, builds become substantially slower analyzing the entire module graph.

**❌ Incorrect: imports entire library**
```tsx
import { Check, X, Menu } from 'lucide-react'
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from '@mui/material'
// Loads 2,225 modules, takes ~4.2s extra in dev
```

**✅ Correct: imports only what you need**
```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// Loads only 3 modules (~2KB vs ~1MB)

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'
import groupBy from 'lodash-es/groupBy'
// Loads only what you use
```

## Next.js Optimization

Next.js 13.5+ includes `optimizePackageImports` to automatically transform barrel imports:

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@mui/material',
      '@mui/icons-material',
      'date-fns',
      'lodash-es'
    ]
  }
}
```

This automatically converts barrel imports to direct imports at build time, but:
- Only works for configured packages
- Doesn't help with your own barrel files
- Adds build-time overhead
- **Best practice:** Use direct imports from the start

## Migration Strategy

1. **Identify barrel imports:** Search for common patterns
2. **Check library docs:** Find the direct import path
3. **Update imports:** Change to direct imports
4. **Test:** Verify nothing broke
5. **Measure:** Check dev server startup time improvement

## Related Patterns

- 3.2 Server vs Client Component (prefer Server Components to reduce client bundle)
- 1.2 Parallelize Independent Operations (applies to build-time operations too)

## References

- [Vercel: How We Optimized Package Imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Next.js optimizePackageImports](https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports)
- [The Cost of Convenience](https://marvinh.dev/blog/the-cost-of-convenience/)
