# Common Issues and Solutions

This reference provides solutions to frequently encountered issues when working with @accelint/design-foundation.

## Issue: "undefined variable --bg-surface-default"

**Cause:** Missing @reference directive in CSS module.

**Symptom:** Build error when using semantic tokens like `bg-surface-default`, `fg-primary-bold`, etc.

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

---

## Issue: "@variant directive not recognized"

**Cause:** Missing @reference directive or PostCSS plugin not configured.

**Symptom:** Build error when using `@variant` blocks like `@variant color-info { ... }`

**Fix 1:** Verify @reference directive exists at top of CSS module.

**Fix 2:** Check `postcss.config.mjs` includes `@accelint/postcss-tailwind-css-modules` plugin:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {}, // Add this
  },
};
```

---

## Issue: "group-hover/button: selector not working"

**Cause:** Missing `@accelint/postcss-tailwind-css-modules` plugin.

**Symptom:** Named group selectors like `group-hover/button:` don't apply styles in CSS modules.

**Fix:** Add plugin to `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {}, // Required for named groups
  },
};
```

---

## Issue: Styles not applying / tokens showing as raw values

**Cause:** CSS entrypoint not imported or imported too late in component tree.

**Symptom:** Semantic tokens render as literal `var(--bg-surface-default)` instead of colors, or styles don't apply at all.

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

---

## Issue: "Cannot find module '#globals'"

**Cause:** Missing package.json imports field or path incorrect.

**Symptom:** Build error when using `@reference '#globals';` in CSS modules.

**Fix Option 1:** Add imports to package.json:

```json
{
  "imports": {
    "#globals": "./src/styles/globals.css"
  }
}
```

**Fix Option 2:** Change @reference to direct relative path:

```css
@reference './styles/globals.css';
```

**Fix Option 3:** Use design-foundation directly:

```css
@reference '@accelint/design-foundation/styles';
```

---

## Issue: Multiple @apply directives break IDE plugins

**Cause:** Using separate @apply statements instead of single combined statement.

**Symptom:** Tailwind IDE extension doesn't provide autocomplete, sorting, or error detection.

**Fix:** Combine all classes into single @apply:

```css
/* ✅ Correct - single @apply */
.button {
  @apply bg-surface-default outline-1 outline-interactive p-m;
}

/* ❌ Wrong - multiple @apply statements */
.button {
  @apply bg-surface-default;
  @apply outline-1 outline-interactive;
  @apply p-m;
}
```

---

## Issue: Tailwind defaults not working

**Cause:** Design foundation removes Tailwind's default theme values.

**Symptom:** Classes like `text-gray-500`, `shadow-lg`, `text-base` don't work or produce unexpected results.

**Fix:** Use only the semantic tokens and utilities provided by the design system. Don't rely on Tailwind defaults.

```css
/* ✅ Correct - design foundation tokens */
.card {
  @apply bg-surface-default fg-primary-bold shadow-elevation-raised-muted;
}

/* ❌ Wrong - Tailwind defaults (removed) */
.card {
  @apply bg-gray-100 text-gray-900 shadow-lg;
}
```

---

## Issue: p-4 produces 4px instead of 16px

**Cause:** Design foundation uses 1:1 numeric spacing relationship, not Tailwind's 4px multiplier.

**Symptom:** `p-4` produces 4px padding instead of expected 16px.

**Fix:** Use semantic spacing scale (`xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`, `oversized`) as primary approach:

```css
/* ✅ Correct - semantic scale */
.button {
  @apply px-m py-xs; /* Semantic, adapts to context */
}

/* ⚠️  Acceptable but rare - numeric with 1:1 relationship */
.custom {
  @apply p-16; /* 16px exactly, not 64px */
}
```

---

## Issue: Dark mode styles not applying

**Cause:** Using Tailwind's `dark:` variant prefix instead of semantic tokens.

**Symptom:** Styles don't adapt when theme changes from light to dark.

**Fix:** Use semantic tokens that automatically adapt to theme:

```css
/* ✅ Correct - semantic tokens adapt automatically */
.card {
  @apply bg-surface-default fg-primary-bold;
}

/* ❌ Wrong - manual theme handling */
.card {
  @apply bg-white fg-black dark:bg-gray-900 dark:fg-white;
}
```

---

## Issue: Border affecting layout dimensions

**Cause:** Using `border` instead of `outline` classes.

**Symptom:** Element dimensions change when border is added, breaking layout alignment.

**Fix:** Use `outline` classes which overlay without affecting dimensions:

```css
/* ✅ Correct - outline doesn't affect size */
.card {
  @apply outline-1 outline-interactive;
}

/* ❌ Wrong - border adds to dimensions */
.card {
  @apply border-2 border-gray-300;
}
```

---

## Diagnostic Checklist

When encountering issues, verify this setup checklist:

- [ ] `postcss.config.mjs` includes `@accelint/postcss-tailwind-css-modules` plugin
- [ ] Every CSS module has `@reference` directive at top
- [ ] CSS entrypoint (`globals.css` or `@accelint/design-foundation/styles`) is imported FIRST in root layout
- [ ] If using `#globals`, package.json has `imports` field with correct path
- [ ] Using semantic tokens (`bg-surface-default`) not Tailwind defaults (`bg-gray-100`)
- [ ] Using semantic spacing (`p-m`) not assuming 4px multiplier (`p-4` = 4px not 16px)
- [ ] Single `@apply` statement per rule (not multiple)
- [ ] Using `@variant` blocks not attribute selectors (`[data-size="small"]`)
