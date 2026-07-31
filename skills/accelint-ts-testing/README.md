# Vitest Best Practices

`accelint-ts-testing` is this repository's skill for maintainable, effective Vitest and Vitest-style TypeScript tests. It covers test organization, strict assertions, async testing, mocking strategy, and property-based testing opportunities.

**For complete guidance, see [SKILL.md](SKILL.md).**

---

## Quick Start

### Installation

```bash
npm install -D vitest @vitest/coverage-v8
```

### Basic Configuration

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
```

Keep these three mock-cleanup settings in config instead of repeating them in `beforeEach` or `afterEach` hooks.

### Your First Test

```ts
// math.test.ts
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

---

```bash
npx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-testing
pnpm dlx skills add https://github.com/gohypergiant/agent-skills --skill accelint-ts-testing
```

## Common Commands

```bash
vitest              # Watch mode
vitest run          # Run once
vitest --coverage   # With coverage
vitest --ui         # Visual UI
```

## Package.json Integration

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:typecheck": "vitest typecheck"
  }
}
```

---

## What You'll Learn

This skill provides expert guidance on:

- **Test organization** — File placement, describe blocks, and AAA pattern
- **Strict assertions** — Catch bugs with intent-revealing matchers
- **Test doubles** — Fakes > stubs > spies > mocks hierarchy
- **Async testing** — Promises, timers, and fake-timer mocking
- **Performance** — Global config and fast test design
- **Vitest features** — Coverage, setup files, and config discovery
- **Property-based testing** — fast-check opportunities for encode/decode pairs, normalizers, validators, and invariants

**See [SKILL.md](SKILL.md) for full patterns and examples.**

---

## References

- **[SKILL.md](SKILL.md)** — Complete skill guidance with progressive loading
- **[AGENTS.md](AGENTS.md)** — Quick rule index and required workflows
- **[references/](references/)** — Detailed topic-specific guidance
- **[assets/output-report-template.md](assets/output-report-template.md)** — Audit report template

---

## Evaluation Suite

This skill includes a 32-case eval suite covering:

- Vitest authoring, async testing, strict assertions
- Mocking boundaries and test-doubles hierarchy
- Property-based testing recommendations
- Reference-loading behavior and near-miss triggers

See [evals/evals.json](evals/evals.json) for the full suite.

---

## Version Compatibility

This skill is designed for modern Vitest workflows. Compatibility targets (not verified in this package):

- **Vitest**: Recent stable versions (1.x+)
- **Node.js**: v18+
- **TypeScript**: v5+

---

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Repository ARCHITECTURE.md](../../ARCHITECTURE.md) — System overview
- [Repository AGENTS.md](../../AGENTS.md) — Repo-wide agent behavior rules
