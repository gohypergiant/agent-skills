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
bg-surface-default        Primary surface color (page/card background)
bg-surface-secondary      Secondary surface (nested panels)
bg-surface-tertiary       Tertiary surface (deepest nesting)
bg-surface-inverse        Inverted surface (tooltips, high contrast)
bg-surface-raised         Raised/elevated surface
bg-surface-hover          Hover state background
bg-interactive-bold       Primary action background
bg-interactive-muted      Secondary action background
bg-info-muted             Info message background
bg-normal-muted           Success message background
bg-advisory-muted         Warning message background
bg-critical-muted         Danger/error message background
```

### Foreground Tokens (`fg-*`)

Text and content colors:

```
fg-primary-bold           Primary text (headlines, body text)
fg-primary-muted          Subtle text (captions, metadata, secondary content)
fg-inverse-bold           Inverted text (on dark backgrounds)
fg-accent-primary-bold    Interactive text/links
fg-info-bold              Info message text
fg-normal-bold            Success message text
fg-advisory-bold          Warning message text
fg-critical-bold          Danger/error message text
```

### Icon Tokens (`icon-*`)

Icon colors inherit from foreground tokens (same token names):

```
icon-primary-bold         Primary icon emphasis
icon-primary-muted        Subtle icon color
icon-inverse-bold         Inverted icon (on dark backgrounds)
icon-accent-primary-bold  Interactive icon color
icon-critical-bold        Error/danger icon color
```

**Note:** The `fg-*` utility classes automatically set `--icon-color`, so icons inherit text colors.

### Outline Tokens (`outline-*`)

Outline/border colors:

```
outline-interactive       Interactive outlines (buttons, inputs)
outline-static            Static outlines (borders, dividers)
outline-info-bold         Info state outline
outline-normal-bold       Success state outline
outline-advisory-bold     Warning state outline
outline-critical-bold     Danger state outline
```

### Shadow Tokens (`shadow-*`)

Elevation shadows:

```
shadow-elevation-raised-muted      Subtle raised elevation (cards)
shadow-elevation-raised-bold       Prominent raised elevation
shadow-elevation-overlay-muted     Subtle overlay elevation (popovers)
shadow-elevation-overlay-bold      Prominent overlay elevation (modals)
```

## Typography Tokens

### Font Size Classes

```
text-body-xxs             Tiny body text
text-body-xs              Extra small body text
text-body-s               Small body text
text-body-m               Medium body text (default)
text-body-l               Large body text

text-header-xs            Extra small headers
text-header-s             Small headers
text-header-m             Medium headers
text-header-l             Large headers
text-header-xl            Extra large headers
text-header-xxl           Huge headers

text-button-xs            Extra small button text
text-button-s             Small button text
text-button-m             Medium button text
text-button-l             Large button text
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
<div className="bg-surface-default outline-1 outline-interactive shadow-elevation-raised-muted">
  <h2 className="fg-primary-bold text-body-l">Heading</h2>
  <p className="fg-primary-bold text-body-m">Body text</p>
  <span className="fg-primary-muted text-body-s">Metadata</span>
</div>
```

**Button variants:**
```tsx
// Primary button
<button className="bg-interactive-bold fg-inverse-bold">
  Primary Action
</button>

// Secondary button
<button className="bg-interactive-muted fg-accent-primary-bold">
  Secondary Action
</button>

// Danger button
<button className="bg-critical-muted fg-inverse-bold">
  Delete
</button>
```

**Status messages:**
```tsx
<div className="bg-info-muted outline-1 outline-info-bold">
  <Icon className="icon-primary-default" />
  <span className="fg-primary-bold">Info message</span>
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
→ Result: `fg-primary-muted`

Example: "I need background for a hover state on a surface"
→ Purpose: background (`bg-*`)
→ State: hover on surface (`surface-hover`)
→ Result: `bg-surface-hover`
