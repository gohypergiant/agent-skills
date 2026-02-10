# React Testing Library Best Practices

Expert guidance for writing maintainable, user-centric React component tests with Testing Library.

## Overview

This skill provides comprehensive best practices for testing React components with [@testing-library/react](https://testing-library.com/react). It focuses on accessibility-first testing, realistic user interactions, and avoiding common anti-patterns.

## Installation

```bash
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

## What's Included

### Core Guidance (SKILL.md)
- Query priority hierarchy (role > label > text > testId)
- User interaction patterns with userEvent
- Async testing strategies
- Thinking frameworks for test design

### Implementation Rules (AGENTS.md)
- Query selection guidelines
- Custom render setup
- Accessibility testing patterns
- Anti-patterns to avoid

### Reference Documentation
- **query-priority.md** - Accessible query hierarchy and when to use each
- **query-variants.md** - getBy vs findBy vs queryBy selection
- **user-events.md** - userEvent vs fireEvent patterns and interactions
- **async-testing.md** - Handling promises, waitFor, avoiding act warnings
- **custom-render.md** - Setting up providers (Context, Redux, Router)
- **accessibility-queries.md** - Role-based queries and ARIA patterns
- **anti-patterns.md** - Implementation details, container usage to avoid

### Utilities

**Scripts:**
- `check-query-priority.sh` - Find suboptimal query patterns (testId before role)
- `find-fire-event.sh` - Detect fireEvent that should be userEvent
- `detect-wrapper-queries.sh` - Find deprecated wrapper/container patterns

**Assets:**
- `custom-render-template.tsx` - Boilerplate for test utils with providers

## Quick Start

### Example Test

```tsx
import { render, screen } from './test-utils';

test('user can submit form', async () => {
  const { user } = render(<ContactForm />);
  
  // Query by accessible labels
  await user.type(screen.getByLabelText(/email/i), 'user@example.com');
  await user.type(screen.getByLabelText(/message/i), 'Hello world');
  
  // Interact realistically
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  // Assert on user-visible outcomes
  expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
});
```

### Setup test-utils.tsx

Copy [assets/custom-render-template.tsx](assets/custom-render-template.tsx) to your project as `test-utils.tsx` and customize with your providers.

### Run Audits

```bash
# Check query priority
./scripts/check-query-priority.sh

# Find fireEvent usage
./scripts/find-fire-event.sh

# Detect deprecated patterns
./scripts/detect-wrapper-queries.sh
```

## Key Principles

**Accessibility First**: Query elements the way users find them (roles, labels, text). If queries are hard, the UI is hard to use.

**User-Centric**: Test what users experience (rendered output, interactions) not implementation details (state variables, function calls).

**Realistic Interactions**: Use `userEvent` to simulate complete user interactions, not `fireEvent` which only dispatches single events.

**Explicit Async**: Always `await` async operations. Use `findBy*` for elements that load asynchronously.

## Configuration

Vitest setup:
```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

Jest setup:
```ts
// jest.setup.ts
import '@testing-library/jest-dom';
```

## License

Apache-2.0

## Author

gohypergiant
