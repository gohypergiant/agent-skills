# README Template

Copy-pasteable template for new README files. Replace placeholders with actual content.

---

## The Template

````markdown
# package-name

Brief one-line description of what this package does.

[![npm version](https://img.shields.io/npm/v/package-name)](https://npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<!-- Include Table of Contents only if README exceeds ~200 lines -->
<!--
## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What is package-name?](#what-is-package-name)
- [Why package-name?](#why-package-name)
- [API](#api)
- [Examples](#examples)
- [License](#license)
-->

## Installation

```bash
pnpm add package-name
```

<!-- Add peer dependencies section if needed -->
<!--
### Peer Dependencies

```bash
pnpm add required-peer-dep
```
-->

<!-- Add TypeScript note if types are included -->
TypeScript types are included.

## Quick Start

```typescript
import { mainFunction } from 'package-name';

const result = mainFunction('input');
console.log(result);
// Expected output here
```

## What is package-name?

2-4 sentences explaining what this package is. Cover:

- What problem domain it addresses
- What form the solution takes (library, CLI, framework)
- Key capabilities at a high level

## Why package-name?

Explain why this package was created:

- The problem that motivated its creation
- How it differs from alternatives
- Who should use this (and who might prefer something else)

## API

### `mainFunction(input, options?)`

Description of what this function does.

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `string` | What this parameter is for |
| `options` | `Options` | Optional configuration |

**Returns:** `ReturnType` - Description of return value

**Example:**

```typescript
const result = mainFunction('input', { option: true });
```

---

### `SecondaryClass`

Description of this class.

#### Constructor

```typescript
new SecondaryClass(config: Config)
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `process(data)` | `Result` | Process input data |
| `validate()` | `boolean` | Validate current state |

**Example:**

```typescript
const instance = new SecondaryClass({ setting: 'value' });
const result = instance.process(data);
```

---

### `HelperType`

Type definition for configuration.

```typescript
interface HelperType {
  /** Required field description */
  required: string;
  /** Optional field description */
  optional?: number;
}
```

## Examples

### Basic Usage

```typescript
import { mainFunction } from 'package-name';

const result = mainFunction('simple input');
```

### With Configuration

```typescript
import { mainFunction } from 'package-name';

const result = mainFunction('input', {
  verbose: true,
  format: 'json',
});
```

### Error Handling

```typescript
import { mainFunction, PackageError } from 'package-name';

try {
  const result = mainFunction('input');
} catch (error) {
  if (error instanceof PackageError) {
    console.error('Package error:', error.message);
  }
  throw error;
}
```

<!-- Include Further Reading only if you have external resources -->
<!--
## Further Reading

- [Full API Documentation](./docs/api.md)
- [Migration Guide](./docs/migration.md)
- [Related Project](https://example.com)
-->

## License

MIT - see [LICENSE](./LICENSE) for details.

<!-- Include Contributing only if accepting contributions -->
<!--
## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

```bash
# Run tests
pnpm test

# Run linting
pnpm lint
```
-->
````

---

## Template Customization Guide

### For Utility Packages

Utility packages have many small, independent functions. Customize by:

- Keeping API section comprehensive with all exports
- Including examples inline with each API entry
- Removing standalone Examples section if API examples are sufficient

### For Pipeline Packages

Pipeline packages have one main workflow. Customize by:

- Keeping API section focused on main entry points
- Expanding Examples section with complete workflows
- Adding step-by-step guides for common tasks

### For CLI Tools

CLI packages need command documentation. Add:

```markdown
## Usage

```bash
package-name <command> [options]
```

### Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize a new project |
| `build` | Build the project |
| `serve` | Start development server |

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--config, -c` | `./config.json` | Path to config file |
| `--verbose, -v` | `false` | Enable verbose output |
| `--help, -h` | | Show help |

### Examples

```bash
# Initialize with defaults
package-name init

# Build with custom config
package-name build --config ./my-config.json

# Start server in verbose mode
package-name serve --verbose
```
```

### For Monorepo Packages

When documenting a package within a monorepo, add context:

```markdown
## Installation

This package is part of the `@org/monorepo` monorepo.

```bash
# From monorepo root
pnpm add @org/package-name

# Or if using workspace protocol
pnpm add @org/package-name@workspace:*
```
```

---

## Section Length Guidelines

| Section | Target Length | Notes |
|---------|---------------|-------|
| Heading Area | 3-5 lines | Title, tagline, badges |
| Installation | 5-15 lines | Commands + notes |
| Quick Start | 10-20 lines | Minimal working example |
| What | 3-6 lines | Brief explanation |
| Why | 5-10 lines | Motivation and differentiation |
| API | Variable | Complete but concise |
| Examples | 20-50 lines | 2-4 practical examples |
| License | 1-2 lines | License name + link |

Total target: 100-300 lines for most packages.

---

## Checklist Before Publishing

Use this checklist to verify README completeness:

- [ ] Package name in title matches `package.json`
- [ ] Install command uses correct package manager
- [ ] Quick Start code is copy-pasteable and runs
- [ ] All public exports are documented in API section
- [ ] Examples use current API (not deprecated patterns)
- [ ] License matches `package.json` license field
- [ ] No broken internal links
- [ ] No placeholder text remaining
- [ ] TOC included if > 200 lines
- [ ] Badges link to correct URLs
