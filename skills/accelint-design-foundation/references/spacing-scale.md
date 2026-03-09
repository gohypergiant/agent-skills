# Spacing Scale

Semantic spacing scale in `@accelint/design-foundation` with numeric fallback for edge cases.

## The Scale

```
xxs → xs → s → m → l → xl → xxl → oversized
```

Eight steps from extra-extra-small to oversized.

## Key Principle

**Think semantic meaning, not pixel values.**

The spacing scale is contextual. `m` means "medium for this context", not a specific pixel value. A medium gap between buttons is different from medium padding inside a card.

## Spacing System Architecture

**Strong preference: Semantic scale**
- Use `p-m`, `gap-s`, `mb-l` for design system consistency
- Provides contextual, meaningful spacing that adapts to use case

**Fallback: Numeric classes (rare)**
- Design foundation implements `--spacing: 1px;` for numeric classes
- `p-1` = 1px (NOT 4px like vanilla Tailwind)
- `p-12` = 12px (1:1 relationship)
- Use ONLY for non-conforming designs where semantic scale doesn't fit

**The choice:**
```css
/* ✅ Preferred - semantic scale */
.card {
  @apply p-m space-y-s;
}

/* ⚠️  Acceptable but rare - numeric fallback */
.nonStandardLayout {
  @apply p-13; /* 13px exactly - edge case only */
}

/* ❌ Wrong - using numeric when semantic exists */
.button {
  @apply px-16 py-8; /* Should use px-m py-xs */
}
```

## Spacing Classes

### Padding

```
p-xxs       All sides, extra extra small
p-xs        All sides, extra small
p-s         All sides, small
p-m         All sides, medium (common default)
p-l         All sides, large
p-xl        All sides, extra large
p-xxl       All sides, extra extra large
p-oversized All sides, oversized

px-[size] Horizontal padding (left + right)
py-[size] Vertical padding (top + bottom)
pt-[size] Top padding
pr-[size] Right padding
pb-[size] Bottom padding
pl-[size] Left padding
```

### Margin

```
m-xxs       All sides, extra extra small
m-xs        All sides, extra small
m-s         All sides, small
m-m         All sides, medium
m-l         All sides, large
m-xl        All sides, extra large
m-xxl       All sides, extra extra large
m-oversized All sides, oversized

mx-[size] Horizontal margin (left + right)
my-[size] Vertical margin (top + bottom)
mt-[size] Top margin
mr-[size] Right margin
mb-[size] Bottom margin
ml-[size] Left margin
```

### Gap (Flexbox/Grid)

```
gap-xxs       Gap between flex/grid children, extra extra small
gap-xs        Gap between flex/grid children, extra small
gap-s         Gap between flex/grid children, small
gap-m         Gap between flex/grid children, medium
gap-l         Gap between flex/grid children, large
gap-xl        Gap between flex/grid children, extra large
gap-xxl       Gap between flex/grid children, extra extra large
gap-oversized Gap between flex/grid children, oversized

gap-x-[size] Horizontal gap (column gap)
gap-y-[size] Vertical gap (row gap)
```

### Space Between

```
space-x-xxs       Horizontal space between children
space-x-xs
space-x-s
space-x-m
space-x-l
space-x-xl
space-x-xxl
space-x-oversized

space-y-xxs       Vertical space between children
space-y-xs
space-y-s
space-y-m
space-y-l
space-y-xl
space-y-xxl
space-y-oversized
```

## Usage Patterns

### Button Padding

```tsx
// Compact button
<button className="px-s py-xxs">
  Small
</button>

// Standard button
<button className="px-m py-xs">
  Default
</button>

// Large button
<button className="px-l py-s">
  Large
</button>
```

### Card Layout

```tsx
// Card with consistent spacing
<div className="p-m space-y-s">
  <h2>Heading</h2>
  <p>Content paragraph</p>
  <button>Action</button>
</div>

// Nested card with tighter spacing
<div className="p-l">
  <div className="p-s bg-surface-secondary">
    Nested content
  </div>
</div>
```

### Form Spacing

```tsx
// Form with semantic spacing
<form className="space-y-m">
  <div className="space-y-xs">
    <label>Email</label>
    <input className="px-s py-xs" />
  </div>

  <div className="space-y-xs">
    <label>Password</label>
    <input className="px-s py-xs" />
  </div>

  <button className="px-m py-s mt-l">
    Submit
  </button>
</form>
```

### List Spacing

```tsx
// List with items
<ul className="space-y-s">
  <li className="p-xs">Item 1</li>
  <li className="p-xs">Item 2</li>
  <li className="p-xs">Item 3</li>
</ul>

// Horizontal list (navigation)
<nav className="flex gap-m">
  <a className="px-s py-xs">Home</a>
  <a className="px-s py-xs">About</a>
  <a className="px-s py-xs">Contact</a>
</nav>
```

### Grid Layout

```tsx
// Grid with consistent gaps
<div className="grid grid-cols-3 gap-m">
  <Card className="p-m" />
  <Card className="p-m" />
  <Card className="p-m" />
</div>

// Tight grid
<div className="grid grid-cols-4 gap-xs">
  <Thumbnail />
  <Thumbnail />
  <Thumbnail />
  <Thumbnail />
</div>
```

## Scale Selection Guide

### When to Use Each Size

**xxs** - Minimal separation
- Icon padding in small buttons
- Tight list item spacing
- Badge padding

**xs** - Compact spacing
- Button vertical padding
- Small card padding
- Form field internal spacing

**s** - Small but comfortable
- Button horizontal padding
- List item spacing
- Section gaps in compact layouts

**m** - Default spacing (most common)
- Card padding
- Form field gaps
- Standard component spacing

**l** - Generous spacing
- Large card padding
- Section separation
- Page margins

**xl** - Large spacing
- Hero section padding
- Major page sections
- Prominent component separation

**xxl** - Extra large spacing
- Page-level margins
- Major layout sections
- Landing page hero spacing

**oversized** - Maximum spacing
- Exceptional large spacing needs
- Dramatic section separation
- Special layout requirements

## Migration from Numeric Scale

**Strongly prefer semantic equivalents. Numeric classes work with 1:1 relationship (p-1 = 1px) but should only be used for non-conforming designs.**

### Vanilla Tailwind → Design Foundation (Semantic - Preferred)

```
p-1  → p-xxs   (vanilla 4px  → use semantic)
p-2  → p-xs    (vanilla 8px  → use semantic)
p-3  → p-s     (vanilla 12px → use semantic)
p-4  → p-m     (vanilla 16px → use semantic)
p-6  → p-l     (vanilla 24px → use semantic)
p-8  → p-xl    (vanilla 32px → use semantic)
p-12 → p-xxl   (vanilla 48px → use semantic)

gap-2 → gap-xs
gap-4 → gap-m
gap-6 → gap-l

m-4  → m-m
m-8  → m-l
m-12 → m-xl
```

### Numeric Classes in Design Foundation (1:1 Relationship - Rare Fallback)

**Design foundation implements `--spacing: 1px;` which changes how numeric classes work:**

```
/* In design foundation (NOT vanilla Tailwind): */
p-1  = 1px   (not 4px)
p-4  = 4px   (not 16px)
p-12 = 12px  (not 48px)
p-13 = 13px  (not 52px)
```

**Use numeric classes ONLY for non-conforming designs:**
```tsx
// ✅ Preferred - semantic scale
<div className="p-m">Content</div>

// ⚠️  Acceptable but rare - exact pixel needed for edge case
<div className="p-13">
  {/* 13px exactly - design doesn't fit semantic scale */}
</div>

// ❌ Wrong - using numeric when semantic exists
<div className="p-16">
  {/* Should use p-m */}
</div>
```

**Important:** Don't think in pixels with semantic scale. The semantic scale may map to different values in different contexts or future versions.

## Combining Spacing

```tsx
// ✅ Correct - consistent scale usage
<div className="p-m space-y-s">
  <section className="mb-l">
    <h2 className="mb-s">Section</h2>
    <p>Content</p>
  </section>
</div>

// ❌ Wrong - mixing semantic and numeric
<div className="p-4 space-y-s">
  <section className="mb-6">
    <h2 className="mb-2">Section</h2>
    <p>Content</p>
  </section>
</div>
```

## Anti-Patterns

### ❌ Don't Use Numeric Classes as First Choice

```tsx
// ❌ Wrong - using numeric when semantic exists
<button className="px-16 py-8">Click</button>

// ✅ Correct - semantic scale
<button className="px-m py-xs">Click</button>

// ⚠️  Acceptable but rare - numeric for non-conforming design
<button className="px-17 py-9">
  {/* 17px/9px exactly needed for edge case */}
  Click
</button>
```

### ❌ Don't Create Arbitrary Spacing Values

```tsx
// ❌ Wrong - arbitrary value (not supported)
<div className="p-[13px]">Content</div>

// ✅ Correct - use closest semantic value
<div className="p-s">Content</div>

// ⚠️  Acceptable alternative - numeric class for exact value
<div className="p-13">
  {/* 13px exactly (1:1 relationship) - for edge cases only */}
  Content
</div>
```

### ❌ Don't Mix Semantic and Numeric Scales

```tsx
// ❌ Wrong - mixing semantic and numeric inconsistently
<div className="p-m gap-16">
  {/* Inconsistent - use all semantic or all numeric (if needed) */}
  Content
</div>

// ✅ Correct - consistent semantic scale (preferred)
<div className="p-m gap-m">
  Content
</div>

// ⚠️  Acceptable if necessary - all numeric for edge case
<div className="p-16 gap-16">
  {/* All numeric for non-conforming design - rare */}
  Content
</div>
```

## Responsive Spacing

Apply different spacing at breakpoints:

```tsx
// Responsive padding
<div className="p-s md:p-m lg:p-l">
  Content adapts to viewport
</div>

// Responsive gap
<div className="flex gap-xs md:gap-s lg:gap-m">
  <Card />
  <Card />
</div>
```

Breakpoints follow Tailwind conventions: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
