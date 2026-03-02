# Token Reference

Complete catalog of design tokens in `@accelint/design-foundation`.

## Token Architecture

**Three-tier system with fallback chain:**
1. **Semantic tokens** - Contextual names (e.g., `bg-surface-default`, `fg-primary-bold`) - **STRONGLY PREFERRED**
2. **Domain tokens** - Domain-specific values (e.g., `domain-brand`) - fallback for edge cases
3. **Primitive tokens** - Raw color values (e.g., `primitive-neutral-50`) - fallback for edge cases

```css
/* Primitive - building block */
--primitive-neutral-50: #ffffff;

/* Semantic - contextual usage */
--bg-surface-default: var(--primitive-neutral-100, #eff1f2); /* light */
--bg-surface-default: var(--primitive-neutral-900, #151517); /* dark */
```

**Utility fallback chain:**
```css
/* bg-*, fg-*, icon-*, outline-* utilities check in order: */
--bg-value: --value(--bg-*, --domain-*, --primitive-*);
/* 1. Semantic token (--bg-surface-default) - use first
   2. Domain token (--domain-brand) - fallback
   3. Primitive token (--primitive-blue-500) - last resort */
```

**Strongly prefer semantic tokens** - Use `domain-*` and `primitive-*` only for rare cases where design exceeds the design system. Semantic tokens provide theming and consistency.

## Color Token Categories

### Background Tokens (`bg-*`)

Surface and interactive backgrounds:

```
bg-surface-default       Primary surface color (page/card background)
bg-surface-secondary     Secondary surface (nested panels)
bg-surface-tertiary      Tertiary surface (deepest nesting)
bg-surface-inverse       Inverted surface (tooltips, high contrast)
bg-surface-active        Active/selected state background
bg-surface-hover         Hover state background
bg-interactive-primary   Primary action background
bg-interactive-secondary Secondary action background
bg-status-info           Info message background
bg-status-success        Success message background
bg-status-warning        Warning message background
bg-status-danger         Danger/error message background
```

### Foreground Tokens (`fg-*`)

Text and content colors:

```
fg-primary-bold          Primary text (headlines, important content)
fg-primary-default       Default text (body, standard content)
fg-primary-subtle        Subtle text (captions, metadata)
fg-secondary-bold        Secondary text hierarchy (bold)
fg-secondary-default     Secondary text hierarchy (default)
fg-tertiary-default      Tertiary text hierarchy (least emphasis)
fg-inverse               Inverted text (on dark backgrounds)
fg-interactive-primary   Primary action text/links
fg-interactive-secondary Secondary action text
fg-status-info           Info message text
fg-status-success        Success message text
fg-status-warning        Warning message text
fg-status-danger         Danger/error message text
```

### Icon Tokens (`icon-*`)

Icon colors matching foreground hierarchy:

```
icon-primary-bold        Primary icon emphasis
icon-primary-default     Default icon color
icon-primary-subtle      Subtle icon color
icon-secondary-default   Secondary icon hierarchy
icon-interactive-primary Interactive icon (primary)
icon-interactive-secondary Interactive icon (secondary)
icon-inverse             Inverted icon (on dark backgrounds)
```

### Outline Tokens (`outline-*`)

Outline/border colors:

```
outline-primary          Primary outline (borders, dividers)
outline-secondary        Secondary outline (subtle borders)
outline-focus            Focus state outline
outline-interactive      Interactive element outline
outline-status-info      Info state outline
outline-status-success   Success state outline
outline-status-warning   Warning state outline
outline-status-danger    Danger state outline
```

### Shadow Tokens (`shadow-*`)

Elevation shadows:

```
shadow-xs                Extra small elevation
shadow-s                 Small elevation
shadow-m                 Medium elevation (cards)
shadow-l                 Large elevation (modals)
shadow-xl                Extra large elevation (overlays)
```

## Typography Tokens

### Font Size Classes

```
text-xs                  Extra small (captions, metadata)
text-s                   Small (secondary content)
text-m                   Medium (body text) - default
text-l                   Large (subheadings)
text-xl                  Extra large (headings)
text-xxl                 Extra extra large (hero text)
```

Each size includes coordinated `font-size`, `line-height`, `letter-spacing`, and `font-weight`.

### Font Weight

```
font-regular             Regular weight (400)
font-medium              Medium weight (500)
font-semibold            Semibold weight (600)
font-bold                Bold weight (700)
```

## Usage Examples

### Semantic Token Selection

**Card component:**
```tsx
<div className="bg-surface-default outline-1 outline-primary shadow-m">
  <h2 className="fg-primary-bold text-l">Heading</h2>
  <p className="fg-primary-default text-m">Body text</p>
  <span className="fg-primary-subtle text-s">Metadata</span>
</div>
```

**Button variants:**
```tsx
// Primary button
<button className="bg-interactive-primary fg-inverse">
  Primary Action
</button>

// Secondary button
<button className="bg-interactive-secondary fg-interactive-primary">
  Secondary Action
</button>

// Danger button
<button className="bg-status-danger fg-inverse">
  Delete
</button>
```

**Status messages:**
```tsx
<div className="bg-status-info outline-1 outline-status-info">
  <Icon className="icon-primary-default" />
  <span className="fg-primary-default">Info message</span>
</div>
```

### Theme Adaptation

All semantic tokens automatically adapt when theme changes:

```tsx
// No manual theme handling needed
<div className="bg-surface-default fg-primary-bold">
  {/* Automatically light in light theme, dark in dark theme */}
</div>

// ❌ Don't do this
<div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
  {/* Manual theme handling breaks the system */}
</div>
```

## Token Lookup Pattern

**When choosing a token:**

1. **Identify element purpose** - Is this a surface, text, icon, or outline?
2. **Determine hierarchy** - Primary, secondary, or tertiary emphasis?
3. **Consider state** - Default, hover, active, disabled?
4. **Check status** - Info, success, warning, danger?

Example: "I need text color for a secondary heading"
→ Purpose: text (`fg-*`)
→ Hierarchy: secondary with emphasis (`secondary-bold`)
→ Result: `fg-secondary-bold`

Example: "I need background for a hover state on a surface"
→ Purpose: background (`bg-*`)
→ State: hover on surface (`surface-hover`)
→ Result: `bg-surface-hover`
