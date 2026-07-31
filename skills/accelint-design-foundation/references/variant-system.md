# Variant System

Custom variant system using data attributes for component state and styling in `@accelint/design-foundation`.

## How Variants Work

Variants are driven by data attributes in markup and authored with `@variant` blocks in CSS modules. Under the hood, the system uses variant definitions that resolve those data attributes for you.

```css
@layer components.l2 {
  .badge {
    @variant color-info {
      @apply bg-info-muted outline-1 outline-info-bold;
    }
  }
}
```

```tsx
<div className={styles.badge} data-color="info">
  Info content
</div>
```

**Benefit:** Reusable, consistent states without arbitrary Tailwind variants or raw attribute-selector styling as your default pattern.

## Available Variants

### Color Variants

Apply color context to components:

```tsx
data-color="info"        Info/informational context (blue)
data-color="success"     Success context (green)
data-color="warning"     Warning context (yellow)
data-color="danger"      Danger/error context (red)
data-color="neutral"     Neutral context (gray)
data-color="primary"     Primary brand color
data-color="secondary"   Secondary brand color
```

**Usage:**
```tsx
<Badge data-color="success">Active</Badge>
<Alert data-color="warning">Warning message</Alert>
<Button data-color="danger">Delete</Button>
```

### Size Variants

Control component sizing:

```tsx
data-size="small"        Small variant (compact UI)
data-size="medium"       Medium variant (default)
data-size="large"        Large variant (prominent)
```

**Usage:**
```tsx
<Button data-size="small">Compact</Button>
<Input data-size="large" />
<Icon data-size="medium" />
```

### State Variants

Component interaction states:

```tsx
data-state="active"      Active/selected state
data-state="inactive"    Inactive/unselected state
data-state="disabled"    Disabled state
data-state="loading"     Loading state
data-state="error"       Error state
```

**Usage:**
```tsx
<Tab data-state="active">Current Tab</Tab>
<Button data-state="loading">Saving...</Button>
<Input data-state="error" />
```

### Layout Variants

Component layout modes:

```tsx
data-layout="horizontal" Horizontal arrangement
data-layout="vertical"   Vertical arrangement
data-layout="grid"       Grid arrangement
data-layout="stack"      Stacked arrangement
```

**Usage:**
```tsx
<ButtonGroup data-layout="horizontal">
  <Button>First</Button>
  <Button>Second</Button>
</ButtonGroup>
```

### Orientation Variants

Directional variants:

```tsx
data-orientation="horizontal"  Horizontal orientation
data-orientation="vertical"    Vertical orientation
```

**Usage:**
```tsx
<Slider data-orientation="vertical" />
<Divider data-orientation="horizontal" />
```

### Position Variants

Placement variants:

```tsx
data-position="top"      Top position
data-position="right"    Right position
data-position="bottom"   Bottom position
data-position="left"     Left position
data-position="center"   Center position
```

**Usage:**
```tsx
<Tooltip data-position="top">Hover text</Tooltip>
<Popover data-position="right" />
```

## Styling with Variants

### Preferred Authoring Pattern

Use `data-*` attributes in markup and `@variant` blocks in CSS modules. This is the package's default recommendation because it keeps variant styling aligned with design foundation conventions.

```tsx
// Component HTML
<button className={styles.button} data-color="primary" data-size="large">
  Action
</button>
```

```css
@layer components.l1 {
  .button {
    @apply px-m py-s;
  }
}

@layer components.l2 {
  .button {
    @variant size-large {
      @apply px-l py-m;
    }

    @variant color-primary {
      @apply bg-interactive-bold fg-inverse-bold;
    }
  }
}
```

### Avoid as the default pattern

Attribute selectors can explain how the underlying data attributes work, but they should not be your default authoring pattern for component variants in this stack.

### Combining Variants

Multiple variants compose naturally:

```tsx
<Card
  data-color="info"
  data-size="large"
  data-state="active"
>
  Content
</Card>
```

Use separate `@variant` blocks for each concern so the styles compose predictably:
```css
@layer components.l2 {
  .card {
    @variant color-info { /* info styles */ }
    @variant size-large { /* large styles */ }
    @variant state-active { /* active styles */ }
  }
}
```

### Variant with Utility Classes

```tsx
// ✅ Correct - variants + utility classes
<Button
  data-color="primary"
  data-size="large"
  className="shadow-elevation-raised-muted"
>
  Submit
</Button>

// ❌ Wrong - arbitrary Tailwind variants instead
<Button className="data-[color=primary]:bg-blue-500 hover:[&>svg]:opacity-50">
  Submit
</Button>
```

## React Aria Integration

Design Toolkit components use React Aria, which provides built-in data attributes:

```tsx
// React Aria automatically adds data attributes
<Button>
  {/* Results in data-hovered, data-pressed, data-focused when interactive */}
  Click me
</Button>
```

```css
/* Style these states with layered variant rules */
@layer components.l3 {
  .custom-button {
    @variant hovered {
      @apply bg-surface-hover;
    }

    @variant pressed {
      @apply bg-surface-raised;
    }
  }
}
```

**Common React Aria data attributes:**
- `data-hovered` - Hover state
- `data-pressed` - Press/click state
- `data-focused` - Focus state
- `data-focus-visible` - Keyboard focus (not mouse)
- `data-disabled` - Disabled state
- `data-selected` - Selected state (checkboxes, tabs)
- `data-open` - Open state (modals, dropdowns)

Use these attributes as the runtime signal, then author the styling through the design foundation variant pattern in CSS modules.

## Creating Custom Variants

When built-in variants don't cover your needs:

```css
/* Define custom variant in CSS */
@custom-variant severity-critical (&:where([data-severity="critical"]));

/* Use in components */
@layer components.l2 {
  .alert {
    @variant severity-critical {
      @apply bg-critical-muted fg-inverse-bold outline-critical-bold;
    }
  }
}
```

```tsx
// Apply in component
<Alert data-severity="critical">
  Critical alert message
</Alert>
```

## Anti-Patterns

### ❌ Don't Use Arbitrary Variants

```tsx
// ❌ Wrong - arbitrary Tailwind variant
<div className="data-[color=info]:bg-blue-500">
  Content
</div>

// ✅ Correct - defined variant
<div data-color="info" className="color-info:bg-surface-default">
  Content
</div>
```

### ❌ Don't Use Inline Styles for States

```tsx
// ❌ Wrong - inline styles
<Button style={{ backgroundColor: isActive ? 'blue' : 'gray' }}>
  Action
</Button>

// ✅ Correct - variant attribute
<Button data-state={isActive ? 'active' : 'inactive'}>
  Action
</Button>
```

### ❌ Don't Create Variants for One-Off Styles

```tsx
// ❌ Wrong - variant for unique case
<div data-special-snowflake="true">Content</div>

// ✅ Correct - use className for one-offs
<div className="bg-special-case">Content</div>
```

## Conditional Variant Application

Use `clsx` for dynamic variants:

```tsx
import { clsx } from '@accelint/design-foundation/lib/utils';

<Button
  data-color={isDestructive ? 'danger' : 'primary'}
  data-size={isCompact ? 'small' : 'medium'}
  data-state={isLoading ? 'loading' : 'active'}
  className={clsx(
    'custom-class',
    isHighlighted && 'outline-2'
  )}
>
  Action
</Button>
```
