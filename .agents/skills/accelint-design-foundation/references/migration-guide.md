# Migration Guide

How to convert vanilla Tailwind styling to `@accelint/design-foundation` conventions.

## Core Differences

| Aspect | Vanilla Tailwind | Design Foundation |
|--------|------------------|-------------------|
| **Colors** | `bg-gray-100`, `text-blue-500` | `bg-surface-default`, `fg-primary-bold` |
| **Spacing** | `p-4`, `gap-6`, `m-8` | `p-m`, `gap-l`, `m-xl` |
| **Borders** | `border-2 border-gray-300` | `outline-2 outline-interactive` |
| **Themes** | `dark:bg-gray-900` | Automatic with semantic tokens |
| **Variants** | Arbitrary `hover:[&>svg]:opacity-50` | Data attributes `data-color="info"` |

## Step-by-Step Migration

### Step 1: Replace Color Classes

**Before (Vanilla Tailwind):**
```tsx
<div className="bg-white text-gray-900 border-gray-200">
  <h2 className="text-blue-600">Heading</h2>
  <p className="text-gray-600">Body text</p>
</div>
```

**After (Design Foundation):**
```tsx
<div className="bg-surface-default fg-primary-bold outline-1 outline-interactive">
  <h2 className="fg-accent-primary-bold">Heading</h2>
  <p className="fg-primary-bold">Body text</p>
</div>
```

**Strategy:**
1. `bg-white/bg-gray-*` → `bg-surface-*` (default, secondary, tertiary)
2. `text-gray-*` → `fg-primary-*` (bold, default, subtle)
3. `text-blue-*` (interactive) → `fg-accent-primary-bold`
4. `border-*` → `outline-*`

### Step 2: Replace Spacing Classes

**Before (Vanilla Tailwind):**
```tsx
<button className="px-6 py-2">
  Click
</button>

<div className="p-4 gap-2">
  <Card />
  <Card />
</div>
```

**After (Design Foundation):**
```tsx
<button className="px-m py-xs">
  Click
</button>

<div className="p-m gap-xs">
  <Card />
  <Card />
</div>
```

**Mapping:**
- `p-0.5` → `p-xxs`
- `p-1` → `p-xs`
- `p-2` → `p-s`
- `p-3` → `p-m`
- `p-4` → `p-l`
- `p-6` → `p-xl`
- `p-10` → `p-xxl`

### Step 3: Replace Dark Mode Handling

**Before (Vanilla Tailwind):**
```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>

// Or with manual theme
<div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
  Content
</div>
```

**After (Design Foundation):**
```tsx
<div className="bg-surface-default fg-primary-bold">
  Content
</div>
// Automatically adapts to light/dark theme
```

**No manual theme handling needed.** Semantic tokens adapt automatically.

### Step 4: Replace Border with Outline

**Before (Vanilla Tailwind):**
```tsx
<button className="border-2 border-blue-500 hover:border-blue-700">
  Action
</button>

<input className="border border-gray-300 focus:border-blue-500" />
```

**After (Design Foundation):**
```tsx
<button className="outline-2 outline-interactive hover:outline-interactive">
  Action
</button>

<input className="outline-1 outline-interactive focus:outline-interactive" />
```

**Why:** Outlines don't affect element dimensions, making layouts more predictable.

### Step 5: Replace Arbitrary Variants with Data Attributes

**Before (Vanilla Tailwind):**
```tsx
<Button className="hover:[&>svg]:opacity-50 data-[state=active]:bg-blue-600">
  <Icon />
  Action
</Button>
```

**After (Design Foundation):**
```tsx
<Button data-state="active" data-color="primary">
  <Icon />
  Action
</Button>
```

**Or with conditional classes:**
```tsx
<Button className={clsx(isActive && 'bg-surface-raised')}>
  <Icon className={clsx(isHovered && 'opacity-50')} />
  Action
</Button>
```

### Step 6: Remove Default Tailwind Assumptions

**Before (Vanilla Tailwind):**
```tsx
// Relying on default shadow-md, default colors
<Card className="shadow-md">
  Content
</Card>
```

**After (Design Foundation):**
```tsx
// Explicitly use design system shadows and colors
<Card className="shadow-elevation-raised-muted bg-surface-default">
  Content
</Card>
```

**Why:** Design Foundation removes Tailwind defaults. Always specify explicitly.

## Common Component Migrations

### Button Component

**Before:**
```tsx
<button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded">
  Primary
</button>

<button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded">
  Secondary
</button>
```

**After:**
```tsx
<button className="bg-interactive-bold fg-inverse-bold px-m py-xs" data-color="primary">
  Primary
</button>

<button className="outline-2 outline-interactive fg-accent-primary-bold px-m py-xs" data-color="secondary">
  Secondary
</button>
```

### Card Component

**Before:**
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
  <h3 className="text-xl font-bold text-gray-900">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

**After:**
```tsx
<div className="bg-surface-default outline-1 outline-interactive p-m shadow-elevation-raised-muted">
  <h3 className="text-body-l font-bold fg-primary-bold">Title</h3>
  <p className="fg-primary-bold">Content</p>
</div>
```

### Form Input

**Before:**
```tsx
<input
  className="border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 rounded"
  placeholder="Enter text"
/>
```

**After:**
```tsx
<input
  className="outline-1 outline-interactive focus:outline-interactive px-s py-xs"
  placeholder="Enter text"
/>
```

### Alert/Notification

**Before:**
```tsx
<div className="bg-blue-50 border-l-4 border-blue-500 p-4">
  <div className="flex">
    <InfoIcon className="text-blue-500" />
    <p className="text-blue-700">Info message</p>
  </div>
</div>
```

**After:**
```tsx
<div className="bg-info-muted outline-l-4 outline-info-bold p-m" data-color="info">
  <div className="flex gap-s">
    <InfoIcon className="icon-primary-default" />
    <p className="fg-primary-bold">Info message</p>
  </div>
</div>
```

### Navigation

**Before:**
```tsx
<nav className="bg-white border-b border-gray-200">
  <div className="flex gap-4 px-6 py-3">
    <a className="text-blue-600 hover:text-blue-800">Home</a>
    <a className="text-gray-600 hover:text-gray-900">About</a>
  </div>
</nav>
```

**After:**
```tsx
<nav className="bg-surface-default outline-b-1 outline-interactive">
  <div className="flex gap-m px-m py-s">
    <a className="fg-accent-primary-bold hover:fg-primary-bold">Home</a>
    <a className="fg-primary-bold hover:fg-primary-bold">About</a>
  </div>
</nav>
```

## Typography Migration

**Before:**
```tsx
<h1 className="text-4xl font-bold text-gray-900">Heading</h1>
<p className="text-base text-gray-600">Body text</p>
<span className="text-sm text-gray-500">Caption</span>
```

**After:**
```tsx
<h1 className="text-header-xxl font-bold fg-primary-bold">Heading</h1>
<p className="text-body-m fg-primary-bold">Body text</p>
<span className="text-body-s fg-primary-muted">Caption</span>
```

**Font size mapping:**
- `text-body-xs` → `text-body-xs` (same)
- `text-sm` → `text-body-s`
- `text-base` → `text-body-m`
- `text-lg` → `text-body-l`
- `text-header-xl` through `text-4xl` → `text-header-xl` or `text-header-xxl`

## Shadow Migration

**Before:**
```tsx
<div className="shadow">Default</div>
<div className="shadow-elevation-raised-mutedd">Medium</div>
<div className="shadow-lg">Large</div>
<div className="shadow-elevation-overlay-bold">Extra Large</div>
```

**After:**
```tsx
<div className="shadow-elevation-raised-muted">Small</div>
<div className="shadow-elevation-raised-muted">Medium</div>
<div className="shadow-elevation-overlay-muted">Large</div>
<div className="shadow-elevation-overlay-bold">Extra Large</div>
```

## Migration Checklist

- [ ] Replace all color classes with semantic tokens
- [ ] Replace numeric spacing with semantic scale
- [ ] Remove manual dark mode handling
- [ ] Replace borders with outlines (where appropriate)
- [ ] Replace arbitrary variants with data attributes
- [ ] Explicitly specify all styling (no Tailwind defaults)
- [ ] Update typography classes to design system scale
- [ ] Test in both light and dark themes
- [ ] Verify responsive spacing works correctly
- [ ] Check that outlines don't break layouts

## Testing After Migration

```tsx
// Test both themes
<div data-theme="light">
  {/* Component should look correct */}
</div>

<div data-theme="dark">
  {/* Component should look correct */}
</div>

// Test all states
<Button data-state="default">Default</Button>
<Button data-state="hover">Hover</Button>
<Button data-state="active">Active</Button>
<Button data-state="disabled">Disabled</Button>

// Test all color variants
<Alert data-color="info">Info</Alert>
<Alert data-color="success">Success</Alert>
<Alert data-color="warning">Warning</Alert>
<Alert data-color="danger">Danger</Alert>
```

## Common Pitfalls

### ❌ Keeping Numeric Spacing

```tsx
// ❌ Wrong - still using numeric
<div className="p-4 gap-2">Content</div>

// ✅ Correct - semantic scale
<div className="p-m gap-xs">Content</div>
```

### ❌ Using Tailwind Color Classes

```tsx
// ❌ Wrong - Tailwind colors don't exist
<div className="bg-gray-100 text-gray-800">Content</div>

// ✅ Correct - semantic tokens
<div className="bg-surface-default fg-primary-bold">Content</div>
```

### ❌ Manual Theme Switching

```tsx
// ❌ Wrong - manual theme logic
<div className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
  Content
</div>

// ✅ Correct - automatic with semantic tokens
<div className="bg-surface-default">Content</div>
```

### ❌ Assuming Tailwind Defaults

```tsx
// ❌ Wrong - assuming default shadow exists
<Card className="shadow">Content</Card>

// ✅ Correct - explicit design system shadow
<Card className="shadow-elevation-raised-muted">Content</Card>
```
