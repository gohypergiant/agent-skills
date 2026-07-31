---
name: accelint-design-foundation
description: Use when styling or reviewing components that use @accelint/design-foundation or @accelint/design-toolkit, especially when the user asks to style or theme a component, convert vanilla Tailwind to design foundation conventions, fix design foundation CSS module or PostCSS setup, choose semantic tokens or spacing, work with @variant or React Aria state styling, or troubleshoot .module.css issues in this stack. Prefer this skill whenever the codebase uses these packages or the user mentions design foundation, design toolkit, semantic tokens, @variant, CSS modules, or setup/build errors tied to this styling system.
license: Apache-2.0
metadata:
  author: accelint
  version: "1.1.0"
---

# Accelint Design Foundation

Expert knowledge for styling with `@accelint/design-foundation` and `@accelint/design-toolkit` — opinionated Tailwind conventions that differ from vanilla implementations.

## Primary Responsibilities

- Translate generic styling requests into design foundation conventions rather than vanilla Tailwind habits.
- Check setup first when the user mentions build errors, missing tokens, broken `@variant`, or CSS module issues.
- Prefer the smallest reference load that answers the task. Read only the relevant reference file unless setup is in doubt.
- Preserve the design system intent: semantic tokens, semantic spacing, outlines, layered CSS modules, and supported variants.

## NEVER Do When Styling with Design Foundation

- **NEVER use numeric spacing classes as the first choice** - Strongly prefer the semantic scale: `p-xxs`, `gap-m`, `m-l`. Numeric classes like `p-4` and `gap-6` use a 1:1 relationship (`p-1` = 1px, not 4px like vanilla Tailwind), but only use them for rare non-conforming designs. The semantic scale preserves design system consistency.
- **NEVER use manual theme handling with raw color values** - Avoid `dark:bg-gray-900` or `className={theme === 'dark' ? 'bg-black' : 'bg-white'}`. Use semantic color classes like `bg-surface-default` and `fg-primary-bold`, which adapt automatically to light and dark themes.
- **NEVER use borders for sizing elements** - Use `outline` instead of `border` classes. Borders add to element dimensions and can break layouts. Outlines overlay without affecting size. Elements should size consistently from content and padding only.
- **NEVER use arbitrary Tailwind variants** - Arbitrary values like `hover:[&>svg]:opacity-50` break the design system. Use supported React Aria variants or conditional class rendering with `clsx`.
- **NEVER bypass CSS layers when styling components** - Use `@layer components.l1` and `@layer components.l2` for cascade hierarchy. Bypassing layers causes specificity wars and makes overrides unpredictable.
- **NEVER use primitive or domain tokens as the first choice** - Strongly prefer semantic tokens (`bg-surface-default`, `fg-primary-bold`) in components. The utility classes (`bg-*`, `fg-*`, `icon-*`, `outline-*`) provide fallback access to `domain-*` and `primitive-*` tokens for rare cases where designs go beyond the design system, but this should be exceptional. Semantic tokens preserve theming flexibility and design system consistency.
- **NEVER use inline Tailwind classes for component styling** - Component styles belong in CSS modules, not inline `className` props. Inline Tailwind should only be used for minor one-off overrides. Using inline classes for all component styling makes code harder to maintain and loses the benefits of CSS modules: scoping, organization, and reusability.
- **NEVER use multiple `@apply` directives in one CSS rule** - Group all Tailwind classes into one `@apply` statement. Multiple `@apply` directives prevent Tailwind IDE plugins from sorting classes and identifying issues. Write `@apply bg-surface-default outline-1 outline-interactive p-m;`, not separate `@apply` lines.
- **NEVER use attribute selectors for variants in CSS modules** - Use `@variant` directive blocks, not attribute selectors like `[data-size="small"]`. Write `@variant size-small { @apply p-s; }`, not `.button[data-size="small"] { @apply p-s; }`. The `@variant` directive applies styles automatically when the matching data attribute is present.
- **NEVER use Tailwind's default theme values** - Design foundation removes and replaces Tailwind defaults. Relying on default shadows, font sizes, or colors will break. Use only the semantic classes provided by the design system.
- **NEVER omit the `@reference` directive in CSS modules** - Every CSS module file must include `@reference '#globals';` (if a custom entrypoint exists) or `@reference '@accelint/design-foundation/styles';` at the top. Without this, semantic tokens and `@variant` blocks are undefined, which causes build errors.
- **NEVER skip PostCSS configuration** - The `@accelint/postcss-tailwind-css-modules` plugin is required in `postcss.config.mjs`. Without it, named group selectors like `group-hover/button:` and `@variant` selectors fail to resolve in CSS modules.
- **NEVER import `clsx` directly from the `clsx` package** - Always import from `@accelint/design-foundation/lib/utils` instead: `import { clsx } from '@accelint/design-foundation/lib/utils';`. Design foundation re-exports `clsx` with additional type support and design system integration. Importing it directly bypasses those enhancements.

## Before Styling a Component, Ask

Apply these tests to ensure styling aligns with the design system:

### Theme Compatibility
- **Will this work in both light and dark themes?** Use semantic color tokens that adapt automatically. Test by toggling between `@variant light` and `@variant dark`.
- **Am I using raw color values?** If yes, replace with semantic tokens. Raw values don't theme.

### Token System
- **Am I using the correct token type?** Strongly prefer semantic tokens (`bg-surface-default`, `fg-primary-bold`). Only use `domain-*` or `primitive-*` fallbacks for exceptional cases where design goes beyond the system.
- **Is there a semantic token for this?** Check the token catalog first. If no semantic token exists and the design genuinely requires it, fallback to `domain-*` or `primitive-*` is acceptable but rare.

### Token Selection Framework

When choosing a token, follow this decision tree:
1. **Identify element purpose** - Is this a surface, text, icon, or outline?
2. **Determine hierarchy** - Primary, secondary, or tertiary emphasis?
3. **Consider state** - Default, hover, active, or disabled?
4. **Check status** - Info, success, warning, or danger?

**Example:** "I need text color for a primary heading"
→ Purpose: text (`fg-*`)
→ Hierarchy: primary with emphasis (`primary-bold`)
→ Result: `fg-primary-bold`

**Example:** "I need background for an interactive button in hover state"
→ Purpose: background (`bg-*`)
→ State: interactive hover (`interactive-bold-hover`)
→ Result: `bg-interactive-bold-hover`

### Spacing System
- **Does this spacing value exist in the semantic scale?** Use `xxs/xs/s/m/l/xl/xxl/oversized` scale. If a value isn't in the scale, question whether it's needed or use the closest semantic value.
- **Need a non-standard spacing value?** Numeric classes (`p-1`, `m-12`) work with 1:1 relationship (p-1 = 1px, NOT 4px), but only use for rare non-conforming design cases. Semantic scale is strongly preferred for consistency.

### Variant Usage
- **Can this be expressed with data attributes?** Use `data-color="info"` with supported variants instead of arbitrary classes.
- **Am I overriding Design Toolkit components correctly?** Use `className` or `classNames` props, not custom CSS files.

### Layout Impact
- **Will outlines work here or do I need borders?** Outlines work for most cases. Borders are only needed when the border must affect layout dimensions.

### Styling Approach
- **Should this be in CSS modules or inline?** Component styles belong in CSS modules (.module.css). Only use inline Tailwind classes for minor one-off overrides or adjustments.
- **Is this a reusable component or one-off instance?** Reusable components require CSS modules. One-off instances can use inline classes for small tweaks.

### Setup Verification
- **Is PostCSS configured correctly?** Check that `@accelint/postcss-tailwind-css-modules` plugin is in `postcss.config.mjs`. Without it, named groups and @variant selectors won't work in CSS modules.
- **Does every CSS module have @reference?** Each `.module.css` file must reference either `'#globals'` (custom entrypoint) or `'@accelint/design-foundation/styles'` at the top.
- **Is the CSS entrypoint imported first?** Custom globals.css (or design-foundation/styles) must be the first import in the root layout.

## Setup Requirements

Design foundation requires specific PostCSS and CSS module configuration to work correctly.

### PostCSS Configuration

Create or update `postcss.config.mjs` in project root:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {}, // Required for CSS modules
  },
};
```

**Why:** The `@accelint/postcss-tailwind-css-modules` plugin fixes named group resolution in CSS module selectors (e.g., `group-hover/button:`) and @variant selectors. Without it, these selectors fail to resolve correctly in CSS module files.

### Package.json Imports (If Custom CSS Entrypoint Exists)

If the project implements a custom CSS entrypoint for token/utility configuration:

```json
{
  "imports": {
    "#globals": "./src/styles/globals.css"
  }
}
```

**Purpose:** This allows CSS modules to reference the custom entrypoint through `@reference '#globals';`

### CSS Module Reference Pattern

**Every CSS module file must include an `@reference` directive:**

```css
/* If project has custom CSS entrypoint (defined in package.json imports): */
@reference '#globals';

@layer components.l1 {
  .button {
    @apply px-m py-xs;
  }
}
```

```css
/* If NO custom CSS entrypoint, reference design-foundation directly: */
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .button {
    @apply px-m py-xs;
  }
}
```

**Why:** The `@reference` directive imports the design system's tokens, utilities, and variant definitions. Without it, semantic tokens and `@variant` blocks are undefined.

### Custom CSS Entrypoint (Optional)

If implementing custom tokens or utilities, create a CSS entrypoint (e.g., `src/styles/globals.css`):

```css
/* Import design foundation base */
@import "@accelint/design-foundation/styles";

/* Add custom token overrides or utilities here */
@theme {
  --custom-brand-color: #ff0000;
}
```

**Then:** Import this file as the **first import** in your root layout component:

```tsx
import './styles/globals.css'; // First import
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html>{children}</html>;
}
```

## How to Use

This skill uses **progressive disclosure** to minimize context usage:

### 1. Start with Core Patterns (SKILL.md)
Follow the styling patterns and token usage below for consistent implementation.

### 2. Reference Token Catalog (AGENTS.md)
Load [AGENTS.md](AGENTS.md) for quick reference of available tokens, spacing scale, and variant patterns.

### 3. Load Detailed References as Needed

Load these references only in the matching scenarios:

**Setting up design foundation for the first time:**
- Load [references/setup.md](references/setup.md) (~8.9K) completely when the user says "setup design foundation", "configure design foundation", or "install design foundation", or when the user encounters build errors like "undefined variable" or "@variant not found".
- Do not load `token-reference.md`, `variant-system.md`, `spacing-scale.md`, or `migration-guide.md` for this scenario.

**Choosing tokens or understanding token hierarchy:**
- Load [references/token-reference.md](references/token-reference.md) (~6.5K) when you are unsure which semantic token to use or when the user needs the complete token catalog.
- Do not load `setup.md` unless there are build errors. Do not load `migration-guide.md` unless the task is a migration.

**Working with the `@variant` system or component variants:**
- Load [references/variant-system.md](references/variant-system.md) (~5.8K) when implementing data attribute variants or working with React Aria states.
- Do not load `setup.md` unless there are build errors. Do not load `migration-guide.md` unless the task is a migration.

**Understanding the spacing scale or numeric fallbacks:**
- Load [references/spacing-scale.md](references/spacing-scale.md) (~8.5K) when semantic versus numeric spacing is unclear or when the user needs the complete spacing catalog.
- Do not load `token-reference.md` unless the task also needs color guidance. Do not load `setup.md` unless there are build errors.

**Migrating from vanilla Tailwind:**
- Load [references/migration-guide.md](references/migration-guide.md) (~4.2K) when converting existing Tailwind code to design foundation conventions.
- Do not load other references unless specific issues appear after migration.

**Troubleshooting build errors or setup issues:**
- Load [references/setup.md](references/setup.md) completely when the user encounters errors like "undefined variable", "@variant not found", or "group-hover/button: not working".
- Do not load other references until setup is confirmed to work.

## Styling Patterns

### CSS Modules for Component Styling

**Default approach: Component styles in CSS modules with @apply directives.**

**user-card.module.css:**
```css
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  /* ✅ Single @apply per rule - enables IDE plugin support */
  .card {
    @apply bg-surface-default outline-1 outline-interactive shadow-elevation-raised-muted p-m;
  }

  .header {
    @apply flex items-center justify-between mb-s;
  }

  .title {
    @apply fg-primary-bold text-body-l;
  }

  .content {
    @apply space-y-xs mb-m;
  }

  .email {
    @apply fg-primary-bold text-body-m;
  }

  .role {
    @apply fg-primary-muted text-body-s;
  }

  .actions {
    @apply flex gap-s;
  }
}

/* ❌ Wrong - multiple @apply directives break IDE plugins */
/*
.card {
  @apply bg-surface-default;
  @apply outline-1 outline-interactive;
  @apply shadow-elevation-raised-muted;
  @apply p-m;
}
*/
```

**user-card.tsx:**
```tsx
import styles from './user-card.module.css';

export function UserCard({ name, email, role }) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
      </header>
      <div className={styles.content}>
        <p className={styles.email}>{email}</p>
        <p className={styles.role}>{role}</p>
      </div>
    </article>
  );
}
```

**Inline classes only for one-off overrides:**

```tsx
// ✅ Correct - CSS module + inline override for specific instance
<UserCard className="mb-xl" /> {/* One-off spacing adjustment */}

// ❌ Wrong - all styling inline
<div className="bg-surface-default outline-1 outline-interactive shadow-elevation-raised-muted p-m">
  <h3 className="fg-primary-bold text-body-l">{name}</h3>
</div>
```

**Conditional classes with clsx:**

```tsx
// ✅ Correct - import clsx from design foundation
import { clsx } from '@accelint/design-foundation/lib/utils';
import styles from './Button.module.css';

export function Button({ variant, isActive }) {
  return (
    <button className={clsx(styles.button, isActive && styles.active)}>
      Click me
    </button>
  );
}

// ❌ Wrong - importing directly from clsx package
import clsx from 'clsx';
```

### Token Categories

**Background tokens (`bg-*`):**
- `bg-surface-default` - Primary surface (page/card background)
- `bg-surface-raised` - Raised/elevated surface
- `bg-interactive-bold` - Primary action background
- `bg-info-muted` - Info message backgrounds
- `bg-advisory-muted` - Warning message backgrounds
- `bg-critical-muted` - Error/danger message backgrounds
- `bg-normal-muted` - Success message backgrounds

**Foreground tokens (`fg-*`):**
- `fg-primary-bold` - Primary text (headlines, body text)
- `fg-primary-muted` - Subtle text (captions, secondary content)
- `fg-inverse-bold` - Text on dark/colored backgrounds
- `fg-accent-primary-bold` - Interactive text/links
- `fg-critical-bold` - Error/danger text

**Outline tokens (`outline-*`):**
- `outline-interactive` - Interactive outlines (buttons, inputs)
- `outline-static` - Static outlines (borders, dividers)
- `outline-info-bold` - Info state outlines
- `outline-advisory-bold` - Warning state outlines
- `outline-critical-bold` - Error/danger state outlines

**Token fallback pattern:**
```tsx
// ✅ Preferred - semantic tokens
<div className="bg-surface-default fg-primary-bold">Content</div>

// ⚠️  Acceptable but rare - domain/primitive fallback for edge cases
<div className="bg-domain-brand fg-primitive-blue-500">
  {/* Use only when design exceeds system */}
</div>

// ❌ Wrong - using fallbacks when semantic tokens exist
<div className="bg-primitive-neutral-100 fg-primitive-neutral-900">
  {/* Should use bg-surface-default fg-primary-bold */}
</div>
```

### Spacing Scale

**Eight-step semantic scale:** `xxs` → `xs` → `s` → `m` → `l` → `xl` → `xxl` → `oversized`

Think semantic meaning, not pixels. `m` means "medium for this context", not a specific pixel value.

**CSS module usage:**
```css
.button {
  @apply px-m py-xs; /* ✅ Semantic spacing - preferred */
}

.card {
  @apply p-m space-y-s; /* ✅ Semantic scale for consistency */
}

/* ⚠️  Acceptable but rare - numeric fallback for edge cases */
.nonStandardLayout {
  @apply p-13; /* 13px exactly - use only for non-conforming designs */
  /* Note: p-1 = 1px (not 4px like vanilla Tailwind) */
}
```

**Spacing fallback pattern:**
- **Preferred**: Use semantic scale (`p-m`, `gap-s`, `mb-l`)
- **Fallback**: Numeric classes available with 1:1 relationship (p-1 = 1px, p-12 = 12px)
- **When to use numeric**: Only for non-conforming designs where semantic scale doesn't fit

### Outlines vs Borders

**Prefer outlines** - they don't affect element dimensions.

```css
/* ✅ Correct - outline doesn't impact layout */
.card {
  @apply outline-1 outline-interactive;
}

/* ❌ Wrong - border adds to dimensions */
.card {
  @apply border-2 border-gray-300;
}
```

**Use borders only when:**
- Border must participate in layout (table cells)
- Dimension impact is explicitly desired

### Variant System

**Use data attributes for component variants:**

**Button.module.css:**
```css
@layer components.l1 {
  .button {
    @apply px-m py-xs;
  }
}

@layer components.l2 {
  /* ✅ Use @variant blocks for conditional styling */
  .button {
    @variant color-info {
      @apply bg-interactive-bold fg-inverse-bold;
    }

    @variant color-critical {
      @apply outline-2 outline-critical-bold fg-critical-bold;
    }

    @variant size-large {
      @apply px-l py-s;
    }
  }
}

/* ❌ Wrong - attribute selectors */
/*
.button[data-color="primary"] {
  @apply bg-interactive-bold;
}
*/
```

**Button.tsx:**
```tsx
import styles from './Button.module.css';

export function Button({ children, color = 'primary', size = 'medium' }) {
  return (
    <button
      className={styles.button}
      data-color={color}
      data-size={size}
    >
      {children}
    </button>
  );
}
```

## Response Pattern

When applying this skill, structure the answer around the user's actual request:

1. Briefly state the design foundation concern you are addressing.
2. If setup might be broken, verify or fix setup before you propose token-level changes.
3. Show the concrete code or class changes.
4. Briefly explain the design foundation reason for the change only when it helps the user avoid the same mistake again.
5. Mention any required follow-up checks, such as `@reference`, PostCSS plugin presence, root CSS import order, or the `data-*` attributes needed for variants.

**Common variants:**
- `data-color`: `info`, `success`, `warning`, `danger`
- `data-size`: `small`, `medium`, `large`
- `data-state`: `active`, `disabled`, `loading`

### CSS Layer Hierarchy

**Always use layers in CSS modules:**

```css
/* ✅ Correct - layered for predictable specificity */
@layer components.l1 {
  .base-styles { /* Base component styles */ }
}

@layer components.l2 {
  .variant-styles { /* Variant styles */ }
}

@layer components.l3 {
  .state-styles { /* State styles */ }
}

/* ❌ Wrong - no layers causes specificity issues */
.component {
  background: var(--bg-surface-default);
}
```

**Layer order:** l1 (base) < l2 (variants) < l3 (states)

### Overriding Design Toolkit Components

**Use className prop for overrides:**

```tsx
// ✅ Correct - override with inline class
<DesignToolkitButton className="mb-l">
  Action
</DesignToolkitButton>

// ✅ Correct - use classNames prop for internal elements
<DesignToolkitButton classNames={{ icon: 'icon-override' }}>
  Action
</DesignToolkitButton>
```

## Common Issues

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

**Fix 2:** Check `postcss.config.mjs` includes `@accelint/postcss-tailwind-css-modules` plugin:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {}, // Add this
  },
};
```

### Issue: "group-hover/button: selector not working"

**Cause:** Missing `@accelint/postcss-tailwind-css-modules` plugin.

**Fix:** Add plugin to `postcss.config.mjs` (see above).

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

**Or** change @reference to direct path:

```css
@reference './styles/globals.css';
```

**Or** use design-foundation directly:

```css
@reference '@accelint/design-foundation/styles';
```

## Important Notes

- **Tailwind defaults are removed** - Design foundation resets Tailwind's default theme. Do not rely on default colors, spacing, shadows, or typography. Use only what the design system defines explicitly.
- **Semantic tokens are CSS variables** - All semantic tokens compile to CSS custom properties like `var(--bg-surface-default)`. You can use them in custom CSS when utilities are not sufficient, but prefer utilities.
- **Token fallback chain exists** - Utility classes (`bg-*`, `fg-*`, `icon-*`, `outline-*`) check semantic tokens first, then fall back to `domain-*` and `primitive-*` tokens. This fallback is intentional for rare cases where designs exceed the design system, but semantic tokens should stay the default for consistency and theming.
- **Spacing scale is semantic, not pixel-mapped** - Do not think "m = 16px". Think "m = medium spacing for this context". The scale adapts to different contexts, such as button padding versus section margin. Numeric classes use a 1:1 relationship (`p-1` = 1px, not 4px) but are fallbacks for non-conforming designs only.
- **Theme variants use `@` directives** - The `@theme static` and `@variant light/dark` syntax is custom. Do not confuse it with standard CSS media queries. Themes are applied through a class or attribute on the root element.
- **Design Toolkit components are React Aria** - They use React Aria for accessibility. Do not fight React Aria state management or variants. Work with `className` and `classNames` props.
- **Setup is not optional** - The PostCSS plugin and `@reference` directives are required, not conveniences. Missing setup causes cryptic build errors like "undefined variable" and "@variant not found". Always verify setup before debugging styling issues.
