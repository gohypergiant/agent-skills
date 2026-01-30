# Codebase Analysis

How to parse and understand code for documentation purposes.

---

## Scoping the Analysis

### Starting Point

Always start from the directory containing the README, not the repository root.

```
monorepo/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md      ← Analysis starts here, scoped to core/
│   └── utils/
│       ├── src/
│       ├── package.json
│       └── README.md      ← Separate analysis, scoped to utils/
└── README.md              ← Analysis covers entire monorepo
```

### Package Boundaries

Respect `package.json` boundaries:

- Only analyze files within the package directory
- Don't document imports from sibling packages as "your" API
- Note peer dependencies that users need to install

---

## Identifying Entry Points

### Check package.json First

Look for entry point definitions:

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.js"
    }
  }
}
```

This tells you:

- `index.ts` is the main entry point
- `utils.ts` is a secondary entry point at `package-name/utils`

### Common Entry Point Patterns

Check these files in order:

1. `src/index.ts` or `src/index.js`
2. `index.ts` or `index.js` at package root
3. `src/main.ts` or `src/main.js`
4. File specified in `package.json` `main` field

---

## Mapping Public API

### What Counts as Public

Only document exports that are accessible to package consumers:

**✅ Public (document these)**
```typescript
// src/index.ts
export { parse } from './parser';
export { validate } from './validator';
export type { Config, Options } from './types';
```

**❌ Internal (don't document)**
```typescript
// src/parser.ts
// This is only used internally, not re-exported from index
export function tokenize(input: string) { ... }
```

### Tracing Re-exports

Follow the export chain to find the actual implementation:

```typescript
// src/index.ts
export { parse } from './parser';

// src/parser.ts
export function parse(path: string): Promise<Config> {
  // implementation
}
```

Document the function as it appears in `parser.ts`, but note it's accessed via the main entry point.

### Export Patterns to Recognize

```typescript
// Named exports
export function foo() {}
export const bar = 'bar';
export type Baz = string;

// Re-exports
export { foo } from './foo';
export { foo as bar } from './foo';
export * from './types';
export * as utils from './utils';

// Default exports (discourage in documentation)
export default function foo() {}
```

---

## Extracting Signatures

### Function Signatures

Capture complete type information:

```typescript
// Source
export async function parse<T extends Config>(
  path: string,
  options?: ParseOptions
): Promise<T> {
  // ...
}

// Document as
### `parse<T>(path, options?)`

Parse a configuration file.

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Path to config file |
| `options` | `ParseOptions` | Optional parsing settings |

**Type Parameters:**
- `T extends Config` - The expected config shape

**Returns:** `Promise<T>` - Parsed configuration object
```

### Overloaded Functions

Document all overloads:

```typescript
// Source
export function format(value: string): string;
export function format(value: number, decimals?: number): string;
export function format(value: Date, pattern?: string): string;

// Document as
### `format(value)`

Format a value as a string. Accepts strings, numbers, or dates.

**Overloads:**

| Signature | Description |
|-----------|-------------|
| `format(value: string): string` | Returns string unchanged |
| `format(value: number, decimals?): string` | Format number with optional decimal places |
| `format(value: Date, pattern?): string` | Format date with optional pattern |
```

### Class Signatures

Document constructor and public methods:

```typescript
// Source
export class Parser {
  constructor(options?: ParserOptions);
  parse(input: string): Result;
  validate(result: Result): boolean;
}

// Document as
### `Parser`

Configuration parser with validation support.

#### Constructor

```typescript
new Parser(options?: ParserOptions)
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `parse(input)` | `Result` | Parse input string |
| `validate(result)` | `boolean` | Validate a parse result |
```

---

## Finding Existing Documentation

### JSDoc/TSDoc Comments

Extract documentation from source:

```typescript
/**
 * Parse a configuration file.
 *
 * @param path - Path to the config file
 * @param options - Parsing options
 * @returns Parsed configuration object
 * @throws {ParseError} If file cannot be read or parsed
 *
 * @example
 * const config = await parse('./app.config.yaml');
 */
export async function parse(path: string, options?: Options): Promise<Config> {
```

Use JSDoc as the primary source for:

- Parameter descriptions
- Return value descriptions
- Thrown errors
- Usage examples

### Inline Examples

Look for example usage in:

1. JSDoc `@example` tags
2. Test files (`*.test.ts`, `*.spec.ts`)
3. `examples/` directory
4. `__examples__/` directory

### Test Files as Documentation

Tests often show real usage:

```typescript
// src/parser.test.ts
describe('parse', () => {
  it('reads JSON config', async () => {
    const config = await parse('./fixtures/config.json');
    expect(config.database.host).toBe('localhost');
  });

  it('interpolates environment variables', async () => {
    process.env.DB_HOST = 'production.db';
    const config = await parse('./fixtures/config.yaml');
    expect(config.database.host).toBe('production.db');
  });
});
```

Extract patterns from tests for the Examples section.

---

## Comparing Code to Documentation

### Building the Comparison

1. **Parse exports from code:**
   - List all exports from entry points
   - Include types, functions, classes, constants

2. **Parse documented API from README:**
   - Extract all items in API section
   - Note function signatures, type names

3. **Generate diff:**

```markdown
## Documentation Audit

### Missing from README
- `ValidationError` class - exported but not documented
- `Options` type - exported but not documented
- `validate()` function - exported but not documented

### Stale in README
- `legacyParse()` - documented but no longer exported

### Signature Changes
- `parse(path)` → `parse(path, options?)` - new optional parameter added

### Potentially Outdated Examples
- Quick Start uses `parse()` without await (async function)
```

### Staleness Indicators

Flag documentation as potentially stale when:

- Function signatures don't match
- Documented exports don't exist in code
- Import paths in examples are wrong
- Package manager doesn't match lockfile
- Version numbers are outdated

---

## Handling Common Patterns

### Barrel Exports

When `index.ts` re-exports everything:

```typescript
export * from './parser';
export * from './validator';
export * from './types';
```

Trace each `export *` to find actual definitions.

### Conditional Exports

When different entry points exist for different environments:

```json
{
  "exports": {
    ".": {
      "node": "./dist/node.js",
      "browser": "./dist/browser.js",
      "default": "./dist/index.js"
    }
  }
}
```

Document the default behavior, note environment-specific differences.

### Namespace Exports

When exports are grouped:

```typescript
export * as parsers from './parsers';
export * as validators from './validators';
```

Document as namespaced API:

```markdown
### `parsers`

Parser utilities.

- `parsers.json(input)` - Parse JSON
- `parsers.yaml(input)` - Parse YAML

### `validators`

Validation utilities.

- `validators.schema(config, schema)` - Validate against schema
```
