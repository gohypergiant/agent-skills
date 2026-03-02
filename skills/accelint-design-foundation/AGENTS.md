# Accelint Design Foundation

> **Note:**
> This document is mainly for agents and LLMs to follow when styling components with `@accelint/design-foundation` or `@accelint/design-toolkit`. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

Quick-reference guide for styling with Accelint's opinionated Tailwind implementation. This guide provides token catalogs, spacing scales, and variant patterns organized for progressive disclosure. Each rule includes one-line summaries with links to detailed examples in the `references/` folder.

**Token efficiency principle:** This guide assumes Claude knows standard Tailwind and CSS concepts. Focus is on what's different about Design Foundation's opinionated approach: semantic tokens vs raw colors, semantic spacing vs numeric, outlines vs borders, data attributes vs arbitrary variants.

---

## How to Use This Guide

1. **Start here**: Scan the quick reference to identify relevant tokens and patterns
2. **Load references as needed**: Click through to detailed catalogs only when implementing
3. **Progressive loading**: Each reference file is self-contained with complete examples

This structure minimizes context usage while providing complete implementation guidance when needed.

---

## Quick Reference

- [1.1 Color Tokens](#11-color-tokens) - Semantic tokens for backgrounds, text, icons, outlines
- [1.2 Spacing Scale](#12-spacing-scale) - Seven-step semantic scale (xxs through xxl)
- [1.3 Variant System](#13-variant-system) - Data attribute variants for component states
- [1.4 CSS Layer Structure](#14-css-layer-structure) - Layer hierarchy for custom component styles
- [1.5 Typography & Shadows](#15-typography--shadows) - Text sizing and elevation scales

---

## 1. Core Token System

### 1.1 Color Tokens

Semantic tokens that adapt to light/dark themes automatically. Never use raw Tailwind colors or manual theme handling.

**Token categories:**
```
bg-*       Backgrounds (surface-default, surface-raised, interactive-bold, info-muted, critical-muted)
fg-*       Text (primary-bold, primary-muted, inverse-bold, accent-primary-bold, critical-bold)
icon-*     Icons (inherits from fg-*, uses same token names)
outline-*  Outlines/borders (interactive, static, info-bold, critical-bold, advisory-bold)
shadow-*   Elevation (elevation-raised-muted, elevation-raised-bold, elevation-overlay-muted)
```

**Common patterns:**
```tsx
// Card
bg-surface-default outline-1 outline-interactive shadow-elevation-raised-muted

// Primary button
bg-interactive-bold fg-inverse-bold

// Body text
fg-primary-bold

// Link
fg-accent-primary-bold

// Alert
bg-info-muted outline-1 outline-info-bold
```

[View complete token catalog](references/token-reference.md)

### 1.2 Spacing Scale

Eight-step semantic scale (strongly preferred). Numeric classes available as fallback with 1:1 relationship (p-1 = 1px).

**Scale:** `xxs` → `xs` → `s` → `m` → `l` → `xl` → `xxl` → `oversized`

**Classes:**
- Padding: `p-m`, `px-s`, `py-xs`, `pt-l`, `p-oversized`
- Margin: `m-l`, `mx-m`, `my-s`, `mb-xl`, `m-oversized`
- Gap: `gap-m`, `gap-x-s`, `gap-y-l`, `gap-oversized`
- Space: `space-x-s`, `space-y-m`, `space-y-oversized`

**Common usage:**
```tsx
// ✅ Preferred - semantic scale
// Standard button: px-m py-xs
// Card padding: p-m
// Form field gaps: space-y-m
// Button group: gap-s

// ⚠️  Rare fallback - numeric (1:1 px)
// Non-conforming: p-13 (13px exactly)
```

**Numeric fallback:** Design foundation implements `--spacing: 1px;` so `p-1` = 1px (NOT 4px). Use only for non-conforming designs.

[View spacing scale details](references/spacing-scale.md)

### 1.3 Variant System

Data attributes for component variants instead of arbitrary Tailwind variants.

**Common variants:**
```tsx
data-color="info|success|warning|danger|primary|secondary"
data-size="small|medium|large"
data-state="active|inactive|disabled|loading|error"
data-layout="horizontal|vertical|grid|stack"
data-position="top|right|bottom|left|center"
```

**Usage:**
```tsx
<Button data-color="primary" data-size="large">Submit</Button>
<Alert data-color="warning" data-state="active">Warning</Alert>
<Badge data-color="success" data-size="small">New</Badge>
```

**React Aria states:** Components also get `data-hovered`, `data-pressed`, `data-focused`, `data-selected` automatically.

[View variant catalog](references/variant-system.md)

### 1.4 CSS Layer Structure

Custom CSS must use layer hierarchy for predictable specificity.

**Layers:**
```css
@layer components.l1 { /* Base component styles */ }
@layer components.l2 { /* Variant styles */ }
@layer components.l3 { /* State styles */ }
```

Lower numbers = lower specificity. Use l1 for base, l2 for variants, l3 for states.

### 1.5 Typography & Shadows

**Typography scale:**
```
text-body-xxs     Tiny body text
text-body-xs      Extra small body
text-body-s       Small body text
text-body-m       Medium body text (default)
text-body-l       Large body text

text-header-xs    Extra small headers
text-header-s     Small headers
text-header-m     Medium headers
text-header-l     Large headers
text-header-xl    Extra large headers
text-header-xxl   Huge headers

text-button-xs    Extra small button text
text-button-s     Small button text
text-button-m     Medium button text
text-button-l     Large button text
```

Each size includes coordinated font-size, line-height, letter-spacing, font-weight.

**Shadow scale:**
```
shadow-elevation-raised-muted     Subtle raised elevation (cards)
shadow-elevation-raised-bold      Prominent raised elevation
shadow-elevation-overlay-muted    Subtle overlay elevation (popovers)
shadow-elevation-overlay-bold     Prominent overlay elevation (modals)
```

---

## 2. Key Patterns

### Pattern: Outline vs Border

**Use outlines, not borders.** Outlines don't affect element dimensions, preventing layout shifts.

```tsx
// ✅ Correct - outline doesn't add to size
<button className="outline-2 outline-interactive px-m py-xs">
  Click
</button>

// ❌ Wrong - border adds to dimensions
<button className="border-2 border-blue-500 px-m py-xs">
  Click
</button>
```

**Exception:** Use borders only when the border must participate in layout (table cells, explicit separators).

### Pattern: Automatic Theming

**Never use manual theme handling.** Semantic tokens adapt automatically.

```tsx
// ✅ Correct - automatic theming
<div className="bg-surface-default fg-primary-bold">
  Content
</div>

// ❌ Wrong - manual theme logic
<div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
  Content
</div>
```

### Pattern: Semantic vs Primitive

**Use semantic tokens in components, never primitives.**

Primitives (`--primitive-neutral-50`) are for theme definitions only. Components use semantic tokens (`bg-surface-default`) that map to primitives.

### Pattern: Overriding Design Toolkit Components

**Use `className` or `classNames` props, not custom CSS files.**

```tsx
// ✅ Correct - use provided props
<DesignToolkitButton
  className="custom-override"
  classNames={{ icon: 'icon-override' }}
>
  Action
</DesignToolkitButton>
```

---

## 3. Migration from Vanilla Tailwind

**Quick conversion:**

| Vanilla Tailwind | Design Foundation |
|------------------|-------------------|
| `bg-gray-100` | `bg-surface-default` |
| `text-gray-900` | `fg-primary-bold` |
| `p-4` | `p-m` |
| `gap-2` | `gap-xs` |
| `border-2 border-gray-300` | `outline-2 outline-interactive` |
| `dark:bg-gray-900` | Remove - automatic with tokens |

[View complete migration guide](references/migration-guide.md)
