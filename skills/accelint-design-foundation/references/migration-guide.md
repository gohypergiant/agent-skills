# Migration Guide

How to convert vanilla Tailwind styling to `@accelint/design-foundation` conventions.

## Core Differences

| Aspect | Vanilla Tailwind | Design Foundation |
|--------|------------------|-------------------|
| **Colors** | `bg-gray-100`, `text-blue-500` | `bg-surface-default`, `fg-primary-bold` |
| **Spacing** | `p-4`, `gap-6`, `m-8` | `p-m`, `gap-l`, `m-xl` |
| **Borders** | `border-2 border-gray-300` | `outline-2 outline-primary` |
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
<div className="bg-surface-default fg-primary-bold outline-1 outline-primary">
  <h2 className="fg-interactive-primary">Heading</h2>
  <p className="fg-primary-default">Body text</p>
</div>
```

**Strategy:**
1. `bg-white/bg-gray-*` → `bg-surface-*` (default, secondary, tertiary)
2. `text-gray-*` → `fg-primary-*` (bold, default, subtle)
3. `text-blue-*` (interactive) → `fg-interactive-primary`
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
- `p-1` → `p-xxs`
- `p-2` → `p-xs`
- `p-3` → `p-s`
- `p-4` → `p-m`
- `p-6` → `p-l`
- `p-8` → `p-xl`
- `p-12` → `p-xxl`

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
<button className="outline-2 outline-interactive hover:outline-primary">
  Action
</button>

<input className="outline-1 outline-primary focus:outline-focus" />
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
<Button className={clsx(isActive && 'bg-surface-active')}>
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
<Card className="shadow-m bg-surface-default">
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
<button className="bg-interactive-primary fg-inverse px-m py-xs" data-color="primary">
  Primary
</button>

<button className="outline-2 outline-interactive fg-interactive-primary px-m py-xs" data-color="secondary">
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
<div className="bg-surface-default outline-1 outline-primary p-m shadow-m">
  <h3 className="text-l font-bold fg-primary-bold">Title</h3>
  <p className="fg-primary-default">Content</p>
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
  className="outline-1 outline-primary focus:outline-focus px-s py-xs"
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
<div className="bg-status-info outline-l-4 outline-status-info p-m" data-color="info">
  <div className="flex gap-s">
    <InfoIcon className="icon-primary-default" />
    <p className="fg-primary-default">Info message</p>
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
<nav className="bg-surface-default outline-b-1 outline-primary">
  <div className="flex gap-m px-m py-s">
    <a className="fg-interactive-primary hover:fg-primary-bold">Home</a>
    <a className="fg-primary-default hover:fg-primary-bold">About</a>
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
<h1 className="text-xxl font-bold fg-primary-bold">Heading</h1>
<p className="text-m fg-primary-default">Body text</p>
<span className="text-s fg-primary-subtle">Caption</span>
```

**Font size mapping:**
- `text-xs` → `text-xs` (same)
- `text-sm` → `text-s`
- `text-base` → `text-m`
- `text-lg` → `text-l`
- `text-xl` through `text-4xl` → `text-xl` or `text-xxl`

## Shadow Migration

**Before:**
```tsx
<div className="shadow">Default</div>
<div className="shadow-md">Medium</div>
<div className="shadow-lg">Large</div>
<div className="shadow-xl">Extra Large</div>
```

**After:**
```tsx
<div className="shadow-s">Small</div>
<div className="shadow-m">Medium</div>
<div className="shadow-l">Large</div>
<div className="shadow-xl">Extra Large</div>
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
<Card className="shadow-m">Content</Card>
```
