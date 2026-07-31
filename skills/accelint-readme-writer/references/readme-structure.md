# README Structure

Detailed guide for README section order, content requirements, and formatting.

---

## Section Order

Package and library READMEs MUST follow this section order. Users expect to find information in predictable places.

```
1.  Heading Area
2.  Table of Contents (if > 200 lines)
3.  Installation
4.  Quick Start
5.  What
6.  Why
7.  API
8.  Examples
9.  Further Reading (optional)
10. License
11. Architecture & Development Guides (optional)
12. Contributing (optional)
```

For app, service, CLI, or monorepo-root READMEs, keep the same reader-first flow but adapt the middle sections to the actual public surface. Do not force a package-style API section when setup, commands, workflows, or operations are the main value.

---

## 1. Heading Area

The heading area establishes the package identity at a glance.

### Required elements

- **Package title** as H1 heading
- Brief tagline (one sentence describing what it does)

### Optional elements

- Banner image
- Badges (npm version, build status, coverage, license)

**❌ Incorrect: cluttered, no clear title**
```markdown
![Build](badge) ![Coverage](badge) ![npm](badge) ![Downloads](badge) ![License](badge) ![Stars](badge) ![Forks](badge)

A utility library for parsing configuration files in various formats including JSON, YAML, TOML, and INI with schema validation support.
```

**✅ Correct: clean, focused**
```markdown
# config-parser

Parse configuration files with schema validation.

[![npm version](https://img.shields.io/npm/v/config-parser)](https://npmjs.com/package/config-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

### Badge guidelines

- Keep badges to 3-4 at most.
- Most useful: npm version, license, and build status.
- Avoid download counts, star counts, and redundant badges.

---

## 2. Table of Contents

Include this section only for READMEs over about 200 lines. Place it after the heading area.

**✅ Correct format**
```markdown
## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [What is config-parser?](#what-is-config-parser)
- [Why config-parser?](#why-config-parser)
- [API](#api)
  - [parse](#parse)
  - [validate](#validate)
- [Examples](#examples)
- [License](#license)
```

Keep the TOC to 2 levels deep at most.

---

## 3. Installation

Explain how to add this package to a project.

### Required content

- Install command with correct package manager
- Any peer dependencies
- TypeScript note (if types included)

**✅ Correct: complete installation section**
```markdown
## Installation

```bash
pnpm add config-parser
```

### Peer Dependencies

If you're using schema validation, you'll also need:

```bash
pnpm add zod
```

TypeScript types are included — no separate `@types` package needed.
```

---

## 4. Quick Start

Provide a minimal working example. Help users reach a working result quickly.

### Requirements

- Complete, copy-pasteable code
- Runnable without modification
- Shows the primary use case
- Under 20 lines of code

**❌ Incorrect: too complex for quick start**
```markdown
## Quick Start

```typescript
import { createParser, registerFormat, validate, loadSchema } from 'config-parser';

const schema = await loadSchema('./config.schema.json');
const parser = createParser({
  formats: ['json', 'yaml', 'toml'],
  validation: { schema, strict: true },
  transforms: [normalizeKeys, expandEnvVars],
});

registerFormat('ini', iniPlugin);

const config = await parser.parse('./config.yaml');
const result = validate(config, schema);
```
```

**✅ Correct: minimal working example**
```markdown
## Quick Start

```typescript
import { parse } from 'config-parser';

const config = await parse('./config.yaml');
console.log(config);
// { database: { host: 'localhost', port: 5432 } }
```
```

---

## 5. What Section

Explain what this package is in 2 to 4 sentences.

### Requirements

- Clear, jargon-free explanation
- What problem domain it addresses
- What form the solution takes (library, CLI, framework)

**✅ Correct**
```markdown
## What is config-parser?

config-parser is a TypeScript library for reading configuration files. It supports JSON, YAML, and TOML formats out of the box, and can validate configs against a schema. It handles environment variable interpolation automatically.
```

---

## 6. Why Section

Explain why this package was created and what makes it different.

### Requirements

- The problem that motivated its creation
- What alternatives exist and why this package is different
- Who should use this and who should not

**✅ Correct**
```markdown
## Why config-parser?

Most config libraries make you choose: simple API or powerful features. We wanted both.

- **Simpler than alternatives**: One function call for common cases
- **Type-safe by default**: Full TypeScript support with inference
- **Zero dependencies**: No bloat in your bundle
- **Extensible when needed**: Plugin system for custom formats

If you just need to read JSON, use `JSON.parse`. If you need multi-format support with validation, config-parser saves you from writing the glue code.
```

---

## 7. API Section

Document all public exports with signatures and descriptions.

### Format for Functions

```markdown
### `functionName(param1, param2)`

Brief description of what it does.

| Parameter | Type | Description |
|-----------|------|-------------|
| `param1` | `string` | What this parameter is for |
| `param2` | `Options` | Optional configuration |

**Returns:** `Promise<Result>` - Description of return value

**Throws:** `ParseError` - When the file cannot be parsed

**Example:**
```typescript
const result = await functionName('input.yaml', { strict: true });
```
```

### Format for Types/Interfaces

```markdown
### `Config`

Configuration object passed to the parser.

```typescript
interface Config {
  /** File formats to support */
  formats: Format[];
  /** Enable strict mode validation */
  strict?: boolean;
}
```
```

### Format for Constants

```markdown
### `DEFAULT_OPTIONS`

Default configuration options.

```typescript
const DEFAULT_OPTIONS = {
  formats: ['json', 'yaml'],
  strict: false,
} as const;
```
```

---

## 8. Examples Section

Practical usage examples beyond the quick start.

### For Utility Packages

Document examples inline with API entries when examples are short.

### For Pipeline Packages

Use a standalone Examples section with complete workflows:

```markdown
## Examples

### Reading a Config File

```typescript
import { parse } from 'config-parser';

const config = await parse('./app.config.yaml');
```

### Validating Against a Schema

```typescript
import { parse, validate } from 'config-parser';
import { configSchema } from './schema';

const config = await parse('./app.config.yaml');
const result = validate(config, configSchema);

if (!result.success) {
  console.error('Invalid config:', result.errors);
  process.exit(1);
}
```

### Using Environment Variables

```typescript
// config.yaml
// database:
//   host: ${DB_HOST}
//   port: ${DB_PORT:5432}  # with default

const config = await parse('./config.yaml');
// Environment variables are interpolated automatically
```
```

---

## 9. Further Reading (Optional)

Links to extended documentation, related projects, or background reading.

**✅ Correct**
```markdown
## Further Reading

- [API Reference](./docs/api.md) - Complete API documentation
- [Migration Guide](./docs/migration.md) - Upgrading from v1 to v2
- [YAML Spec](https://yaml.org/spec/) - Understanding YAML syntax
```

---

## 10. License

State the license. Link to LICENSE file if present.

**✅ Correct**
```markdown
## License

MIT - see [LICENSE](./LICENSE) for details.
```

---

## 11. Architecture & Development Guides (Optional)

<!-- Include this section only if any of these files exist: openspec/config.yml, openspec/config.yaml, ARCHITECTURE.md, AGENTS.md, CLAUDE.md -->

Links to deeper technical and behavioral documentation that complement the README.

**✅ Correct**
```markdown
## Architecture & Development Guides

For deeper technical and behavioral context:

- **[openspec/config.yml](./openspec/config.yml)** — Tech stack, coding patterns, and domain concepts
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — System architecture, deployment, and data flows
- **[AGENTS.md](./AGENTS.md)** — How AI agents should behave when working in this codebase

These documents form a layered guidance system: config.yml defines what the project is, ARCHITECTURE.md explains how it's structured and deployed, and AGENTS.md governs how agents collaborate on it.
```

Note: include only files that actually exist. Check for `openspec/config.yml` or `openspec/config.yaml`, `ARCHITECTURE.md`, and `AGENTS.md` or `CLAUDE.md` before you add this section. If none exist, omit this section entirely.

---

## 12. Contributing (Optional)

How to contribute to the project.

**✅ Correct**
```markdown
## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting PRs.

```bash
# Run tests
pnpm test

# Run linting
pnpm lint
```
```
