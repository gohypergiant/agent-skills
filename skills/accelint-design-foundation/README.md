# Accelint Design Foundation

Agent skill for styling with `@accelint/design-foundation` and `@accelint/design-toolkit` packages. Provides expert knowledge of opinionated Tailwind conventions including semantic tokens, custom spacing scale, outline-based borders, @variant system, and CSS module patterns.

## Installation

**npm**
```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-design-foundation
```

**pnpm**
```bash
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-design-foundation
```

## Usage

This skill automatically activates when working with components that use `@accelint/design-foundation` or `@accelint/design-toolkit`.

**Example prompts that trigger the skill:**

```
Style this Button component using Design Foundation tokens
Add styling to this card with the design system
Theme this component for light and dark mode
Update the spacing in this component to use the semantic scale
```

## What's Included

- **SKILL.md** - Core patterns, anti-patterns, and styling workflows
- **AGENTS.md** - Quick reference for tokens, spacing, and variants
- **references/** - Detailed catalogs and migration guide:
  - `token-reference.md` - Complete token catalog with examples
  - `variant-system.md` - @variant system usage patterns
  - `spacing-scale.md` - Semantic spacing scale guide
  - `migration-guide.md` - Converting from vanilla Tailwind
- **assets/** - Example component showing correct patterns

## Key Concepts

### CSS Modules First
Component styles belong in CSS modules (`.module.css`), not inline className props. Inline Tailwind classes should only be used for minor one-off overrides.

### Semantic Tokens
Use semantic tokens like `bg-surface-default` and `fg-primary-bold` instead of raw Tailwind colors. Semantic tokens automatically adapt to light/dark themes.

### Semantic Spacing
Use the seven-step semantic scale (`xxs` → `xs` → `s` → `m` → `l` → `xl` → `xxl`) instead of numeric Tailwind spacing (`p-4`, `gap-2`).

### Outlines Over Borders
Prefer `outline` classes over `border` classes. Outlines don't affect element dimensions, preventing layout shifts.

### @variant System
Use `@variant` directive blocks in CSS modules for conditional styling based on data attributes.

## Examples

### Basic Card Component

**Card.tsx**
```typescript
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

## Requirements

- `@accelint/design-foundation` package installed
- Tailwind CSS configured to use design foundation
- CSS modules support in build system

## Learn More

- [AGENTS.md](AGENTS.md) - Quick reference guide
- [SKILL.md](SKILL.md) - Complete styling patterns
- [references/](references/) - Detailed catalogs and guides

## License

Apache-2.0
