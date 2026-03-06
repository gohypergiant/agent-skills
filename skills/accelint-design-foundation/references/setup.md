# Setup Guide

Complete setup requirements for `@accelint/design-foundation` to work correctly.

## Required Configuration

### 1. PostCSS Configuration (Required)

**Create `postcss.config.mjs` in project root:**

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

**What it does:** The `@accelint/postcss-tailwind-css-modules` plugin fixes named group selectors (like `group-hover/button:`) and @variant selectors in CSS module files.

**Without it:** Named groups and @variant selectors fail to resolve, causing build errors or non-functional styles.

**Example of what breaks without the plugin:**

```css
/* This won't work without the plugin */
.container {
  @variant group-hover/button {
    @apply bg-surface-hover;
  }
}

/* This also won't work */
.item {
  @apply group-hover/button:opacity-50;
}
```

### 2. CSS Module @reference Directive (Required)

**Every CSS module file must include a @reference directive at the top:**

**Option A - If project has custom CSS entrypoint:**

```css
@reference '#globals';

@layer components.l1 {
  .button {
    @apply px-m py-xs bg-interactive-bold;
  }
}
```

**Option B - If no custom entrypoint, reference design-foundation directly:**

```css
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .button {
    @apply px-m py-xs bg-interactive-bold;
  }
}
```

**What it does:** Imports design system tokens, utilities, and variant definitions into the CSS module scope.

**Without it:** Semantic tokens (`bg-surface-default`), @variant blocks, and @layer directives are undefined, causing "unknown variable" errors.

### 3. Package.json Imports (Optional - If Custom Entrypoint)

**If the project implements a custom CSS entrypoint for configuring tokens/utilities:**

```json
{
  "imports": {
    "#globals": "./src/styles/globals.css"
  }
}
```

**What it does:** Allows CSS modules to reference the custom entrypoint via `@reference '#globals';` instead of typing the full path.

**When to use:**
- Project needs custom token overrides
- Project adds custom utilities beyond design-foundation
- Project configures theme-specific values

**When to skip:**
- Using design-foundation as-is without customization
- Reference `'@accelint/design-foundation/styles'` directly instead

### 4. Custom CSS Entrypoint (Optional)

**If implementing custom tokens/utilities, create a CSS entrypoint:**

**`src/styles/globals.css`:**
```css
/* Import design foundation base */
@import "@accelint/design-foundation/styles";

/* Add custom token overrides */
@theme {
  --custom-brand-primary: #ff0000;
  --custom-brand-secondary: #00ff00;
}

/* Add custom utilities */
@utility custom-gradient {
  background: linear-gradient(to right, var(--custom-brand-primary), var(--custom-brand-secondary));
}
```

**Then import as FIRST import in root layout:**

```tsx
import './styles/globals.css'; // Must be first
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en">{children}</html>;
}
```

**Why first:** Design system styles must load before component styles for correct cascade.

## Setup Verification Checklist

```
[ ] PostCSS config exists with @accelint/postcss-tailwind-css-modules plugin
[ ] Every .module.css file has @reference directive at the top
[ ] If custom entrypoint: package.json has imports field pointing to it
[ ] If custom entrypoint: globals.css imports @accelint/design-foundation/styles
[ ] CSS entrypoint (custom or design-foundation) imported first in root layout
```

## Common Setup Issues

### Issue: "undefined variable --bg-surface-default"

**Cause:** Missing @reference directive in CSS module.

**Fix:** Add `@reference '#globals';` or `@reference '@accelint/design-foundation/styles';` at the top of the CSS module file.

```css
/* ✅ Correct */
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .card {
    @apply bg-surface-default; /* Now defined */
  }
}
```

### Issue: "@variant directive not recognized"

**Cause:** Missing @reference directive or PostCSS plugin not configured.

**Fix 1:** Verify @reference directive exists at top of CSS module.

**Fix 2:** Check `postcss.config.mjs` includes `@accelint/postcss-tailwind-css-modules` plugin.

### Issue: "group-hover/button: selector not working"

**Cause:** Missing `@accelint/postcss-tailwind-css-modules` plugin.

**Fix:** Add plugin to `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {}, // Add this
  },
};
```

### Issue: Styles not applying / tokens showing as raw values

**Cause:** CSS entrypoint not imported or imported too late.

**Fix:** Ensure globals.css (or `@accelint/design-foundation/styles`) is the FIRST import in root layout:

```tsx
// ✅ Correct order
import './styles/globals.css'; // First
import './other-styles.css';
import Component from './Component';

// ❌ Wrong order
import Component from './Component';
import './styles/globals.css'; // Too late
```

### Issue: "Cannot find module '#globals'"

**Cause:** Missing package.json imports field or path incorrect.

**Fix:** Add imports to package.json:

```json
{
  "imports": {
    "#globals": "./src/styles/globals.css"
  }
}
```

**Or:** Change @reference to direct path:

```css
@reference './styles/globals.css';
```

**Or:** Use design-foundation directly:

```css
@reference '@accelint/design-foundation/styles';
```

## Architecture Decision: Custom Entrypoint vs Direct Import

### Use Custom Entrypoint When:
- Adding project-specific token overrides
- Implementing custom utilities beyond design-foundation
- Configuring brand-specific theme values
- Need centralized place for design system extensions

**Setup:**
```json
// package.json
{ "imports": { "#globals": "./src/styles/globals.css" } }
```

```css
/* CSS modules */
@reference '#globals';
```

### Use Direct Import When:
- Using design-foundation as-is without customization
- No need for project-specific tokens or utilities
- Simpler setup with fewer files

**Setup:**
```css
/* CSS modules */
@reference '@accelint/design-foundation/styles';
```

## Examples

### Minimal Setup (No Custom Entrypoint)

**postcss.config.mjs:**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

**Button.module.css:**
```css
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .button {
    @apply px-m py-xs bg-interactive-bold fg-inverse-bold;
  }
}
```

**layout.tsx:**
```tsx
import '@accelint/design-foundation/styles'; // First import
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html>{children}</html>;
}
```

### Full Setup (With Custom Entrypoint)

**postcss.config.mjs:**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

**package.json:**
```json
{
  "imports": {
    "#globals": "./src/styles/globals.css"
  }
}
```

**src/styles/globals.css:**
```css
@import "@accelint/design-foundation/styles";

@theme {
  --custom-brand-red: #ff0000;
}
```

**Button.module.css:**
```css
@reference '#globals';

@layer components.l1 {
  .button {
    @apply px-m py-xs bg-interactive-bold fg-inverse-bold;
  }

  .buttonBrand {
    background: var(--custom-brand-red);
  }
}
```

**layout.tsx:**
```tsx
import './styles/globals.css'; // First import
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html>{children}</html>;
}
```

## Anti-Patterns

### ❌ Missing @reference Directive

```css
/* ❌ Wrong - no @reference */
@layer components.l1 {
  .button {
    @apply bg-surface-default; /* Error: undefined */
  }
}

/* ✅ Correct - has @reference */
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .button {
    @apply bg-surface-default; /* Works */
  }
}
```

### ❌ Wrong @reference Location

```css
/* ❌ Wrong - @reference not at top */
@layer components.l1 {
  @reference '#globals';
  .button { /* ... */ }
}

/* ✅ Correct - @reference at top */
@reference '#globals';

@layer components.l1 {
  .button { /* ... */ }
}
```

### ❌ Importing Styles Too Late

```tsx
// ❌ Wrong - imports after components
import Button from './components/Button';
import Card from './components/Card';
import './styles/globals.css'; // Too late!

// ✅ Correct - styles first
import './styles/globals.css'; // First
import Button from './components/Button';
import Card from './components/Card';
```

### ❌ Missing PostCSS Plugin

```javascript
// ❌ Wrong - missing CSS modules plugin
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

// ✅ Correct - includes both plugins
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```
