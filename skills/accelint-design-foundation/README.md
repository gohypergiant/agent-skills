# accelint-design-foundation

Agent skill for styling React components with `@accelint/design-foundation` and `@accelint/design-toolkit`. Guides you through semantic tokens, spacing conventions, CSS module patterns, and the `@variant` system that replaces standard Tailwind patterns.

## Installation

Install this skill using the skills CLI:

```bash
npx skills add gohypergiant/agent-skills
```

Select `accelint-design-foundation` from the interactive picker, choose Project scope, and use Symlink method.

## What It Does

This skill helps you write component styles that fit the design foundation conventions:

- Use semantic color tokens (`bg-surface-default`, `fg-primary-bold`) instead of raw Tailwind colors
- Apply the semantic spacing scale (`xxs` through `oversized`) instead of numeric classes
- Put component styles in CSS modules with `@layer` directives instead of inline className strings
- Use `outline` classes instead of `border` classes to avoid layout shifts
- Style component variants with `@variant` blocks and data attributes instead of attribute selectors

It also catches setup issues like missing `@reference` directives, incorrect PostCSS config, or wrong import order.

## Quick Start

Once installed, the skill activates automatically when you work with design foundation components. Use natural language prompts:

```
Style this Button using design foundation tokens
Convert this vanilla Tailwind card to design foundation
Fix the @variant not found build error
Add hover and active states to this component
```

## What's Included

- **SKILL.md** — Core styling patterns, anti-patterns, setup requirements, and response guidelines
- **AGENTS.md** — Quick reference for tokens, spacing, and variant patterns
- **references/** — Detailed guides for specific topics:
  - `setup.md` — PostCSS config, @reference directives, and CSS entrypoint setup
  - `token-reference.md` — Complete catalog of semantic, domain, and primitive tokens
  - `variant-system.md` — Data attribute variants and @variant block syntax
  - `spacing-scale.md` — Semantic scale usage and numeric fallback behavior
  - `migration-guide.md` — Converting vanilla Tailwind to design foundation
  - `troubleshooting.md` — Common build errors and fixes
- **assets/** — Example React component with correct CSS module setup
- **evals/** — Test cases for styling, migration, setup, and troubleshooting scenarios

## Key Concepts

### CSS Modules First

Component styles belong in CSS modules (`.module.css`), not inline `className` props. Inline Tailwind classes are only for minor one-off overrides.

```tsx
// ✅ Correct
import styles from './Card.module.css';
<div className={styles.card}>{content}</div>

// ❌ Wrong
<div className="bg-surface-default outline-1 outline-interactive p-m">{content}</div>
```

### Semantic Tokens

Use semantic tokens that adapt to light and dark themes automatically:

```css
/* ✅ Correct */
.card {
  @apply bg-surface-default fg-primary-bold outline-1 outline-interactive;
}

/* ❌ Wrong */
.card {
  @apply bg-gray-100 text-gray-900 border border-gray-300 dark:bg-gray-800;
}
```

### Semantic Spacing

Use the eight-step scale (`xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`, `oversized`) instead of numeric classes:

```css
/* ✅ Correct */
.button {
  @apply px-m py-xs gap-s;
}

/* ❌ Wrong */
.button {
  @apply px-4 py-2 gap-2;
}
```

Note: Numeric classes work differently in design foundation. `p-1` means 1px exactly, not 4px like vanilla Tailwind. Use them only for non-conforming designs.

### Outlines Over Borders

Outlines don't affect element dimensions, so they prevent layout shifts:

```css
/* ✅ Correct */
.card {
  @apply outline-1 outline-interactive;
}

/* ❌ Wrong */
.card {
  @apply border-2 border-gray-300;
}
```

### @variant System

Use data attributes and `@variant` blocks for component variants instead of attribute selectors:

```tsx
// Component
<button className={styles.button} data-color="info" data-size="large">
  Click
</button>
```

```css
/* ✅ Correct */
@layer components.l2 {
  .button {
    @variant color-info {
      @apply bg-interactive-bold fg-inverse-bold;
    }
    
    @variant size-large {
      @apply px-l py-s;
    }
  }
}

/* ❌ Wrong */
.button[data-color="info"] {
  @apply bg-interactive-bold;
}
```

## Setup Requirements

Design foundation needs specific configuration to work. The skill checks for these automatically:

1. **PostCSS plugin** — Add `@accelint/postcss-tailwind-css-modules` to `postcss.config.mjs`
2. **@reference directive** — Every CSS module must reference the design system at the top
3. **CSS entrypoint import** — Import globals or design-foundation styles first in your root layout

See `references/setup.md` for complete setup instructions.

## Example Component

Here's a properly styled card with variants:

**Card.tsx**
```tsx
import styles from './Card.module.css';

export function Card({ children, size = 'medium' }) {
  return (
    <div className={styles.card} data-size={size}>
      {children}
    </div>
  );
}
```

**Card.module.css**
```css
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .card {
    @apply bg-surface-default outline-1 outline-interactive shadow-elevation-raised-muted p-m;
  }
}

@layer components.l2 {
  .card {
    @variant size-large {
      @apply p-l;
    }

    @variant size-small {
      @apply p-s;
    }
  }
}
```

The `@reference` directive at the top is required. Without it, semantic tokens and `@variant` blocks are undefined and cause build errors.

## Common Issues

**"undefined variable --bg-surface-default"**

Missing `@reference` directive. Add this to the top of your CSS module:

```css
@reference '@accelint/design-foundation/styles';
```

**"@variant directive not recognized"**

Missing PostCSS plugin or `@reference` directive. Check that `@accelint/postcss-tailwind-css-modules` is in your `postcss.config.mjs`.

**"group-hover/button: selector not working"**

Missing PostCSS plugin. Named group selectors need `@accelint/postcss-tailwind-css-modules` to resolve correctly in CSS modules.

See `references/troubleshooting.md` for more common issues and fixes.

## Architecture & Development Guides

- [ARCHITECTURE.md](../../ARCHITECTURE.md) — Repository structure and system architecture

## License

Apache-2.0
