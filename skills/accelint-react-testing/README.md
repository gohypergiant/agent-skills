# React Testing Library Best Practices

Guidance for writing maintainable, user-centric React component tests with Testing Library.

## Overview

This skill provides best practices for testing React components with [@testing-library/react](https://testing-library.com/react). It focuses on accessibility-first testing, realistic user interactions, and avoiding common anti-patterns.

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
- `output-report-template.md` - Template for audit reports

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

Run scripts from the repository root:

```bash
# Check query priority
./skills/accelint-react-testing/scripts/check-query-priority.sh

# Find fireEvent usage
./skills/accelint-react-testing/scripts/find-fire-event.sh

# Detect deprecated patterns
./skills/accelint-react-testing/scripts/detect-wrapper-queries.sh
```

## Key Principles

**Accessibility First**: Query elements the way users find them (roles, labels, text). If queries are hard, the UI is hard to use.

**User-Centric**: Test what users experience (rendered output, interactions) not implementation details (state variables, function calls).

**Realistic Interactions**: Use `userEvent` to simulate complete user interactions, not `fireEvent` which only dispatches single events.

**Explicit Async**: Always `await` async operations. Use `findBy*` for elements that load asynchronously.

## Query Selection Decision Tree

Use this hierarchy when selecting queries - try options from top to bottom:

```
1. getByRole          ← Preferred: Accessible, reflects how users & ATs interact
   ↓ Can't find role?
   
2. getByLabelText     ← For form fields: matches how users read forms
   ↓ No label?
   
3. getByPlaceholderText  ← For inputs: less accessible than labels
   ↓ No placeholder?
   
4. getByText          ← For non-interactive content: headings, paragraphs
   ↓ Text not unique?
   
5. getByDisplayValue  ← For form inputs: current value
   ↓ No display value?
   
6. getByAltText       ← For images: alt attribute
   ↓ No alt text?
   
7. getByTitle         ← For title attribute: less accessible
   ↓ No title?
   
8. getByTestId        ← Last resort: no accessibility verification
```

**Key principles:**
- Higher queries = more confidence in accessibility
- If you can't query by role/label, fix the component's accessibility first
- getByTestId means "I've verified accessibility is impossible here"

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

## Important Notes

- **The `screen` export is `getQueriesForElement(document.body)`.** Prefer `screen.*` consistently because it queries the current DOM and makes tests easier to maintain.
- **Testing Library encourages accessibility by making accessible elements easiest to query.** If queries are hard, the UI is hard to use. Query difficulty is a UX smell.
- **Use `screen.debug()` or `screen.logTestingPlaygroundURL()` when queries fail.** Inspect the rendered DOM or let Testing Playground suggest better queries instead of guessing selectors.
- **`queryBy*` returns `null` silently; use `getBy*` for presence.** When an element should exist, `getBy*` gives better errors and role suggestions. Reserve `queryBy*` for absence assertions.
- **Act warnings usually mean a missing `await` or async work finishing after the assertion.** Check un-awaited `userEvent` calls, async queries, and state updates before adding manual `act(...)`.
- **`userEvent` methods are async; `fireEvent` is mostly a fallback for non-user events.** Always `await` `userEvent` calls, and prefer them over `fireEvent` for clicks, typing, selection, keyboard input, hover, and tabbing.

## License

Apache-2.0

## Author

accelint
