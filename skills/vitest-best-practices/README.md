# Vitest Best Practices

Expert patterns for writing maintainable, effective vitest tests. This skill provides comprehensive guidance on test organization, assertions, mocking, async testing, and performance optimization.

**For complete guidance, see [SKILL.md](SKILL.md)**

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
    clearMocks: true      
    resetMocks: true      
    restoreMocks: true    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

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
    "test:coverage": "vitest run --coverage"
  }
}
```

## What You'll Learn

This skill covers expert-level guidance on:
- Test organization and AAA pattern
- Strict assertions to catch bugs
- Test doubles hierarchy (fakes > stubs > mocks)
- Async testing and timer mocking
- Performance optimization and global configuration
- Vitest-specific features and setup file discovery

**See [SKILL.md](SKILL.md) for complete patterns and examples.**

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [AGENTS.md](AGENTS.md) - Quick reference for all rules

## Version Compatibility

- **Vitest**: v1.0.0+
- **Node.js**: v18.0.0+
- **TypeScript**: v5.0.0+
