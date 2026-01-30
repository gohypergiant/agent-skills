# Anti-patterns

Avoid these common mistakes that make tests brittle, hard to maintain, or provide false confidence.

## Rule: Never Test Implementation Details

**Principle:** Test what users experience (outputs, rendered content), not how components achieve it internally (state, function calls, private methods).

**❌ Incorrect: Testing implementation

```tsx
// ❌ Testing state variable
test('counter increments', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1); // Testing internal state
});

// ❌ Testing function was called
test('calls handler', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} />);
  // Component refactored to call onClick twice internally
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1); // Breaks if implementation changes
});

// ❌ Testing component instance methods
test('validates input', () => {
  const ref = React.createRef();
  render(<Form ref={ref} />);
  expect(ref.current.validateEmail('test')).toBe(false); // Testing private API
});
```

**Problems:**
- Tests break during safe refactoring (useState → useReducer)
- No confidence in user experience
- Couples tests to implementation

**✅ Correct: Test user-observable behavior

```tsx
// ✅ Test rendered output
test('counter increments', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

// ✅ Test effect of click
test('submits form', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
});

// ✅ Test validation feedback
test('shows validation error', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  await user.type(screen.getByLabelText(/email/i), 'invalid');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

---

## Rule: Always Use screen, Never container

**Principle:** The `screen` export never goes stale after re-renders. Destructured queries from render() can miss updates.

**❌ Incorrect: Using container or destructured queries

```tsx
// ❌ Destructured queries go stale
const { getByText, rerender } = render(<Counter count={0} />);
rerender(<Counter count={1} />);
getByText('Count: 1'); // ❌ Searches old snapshot, might fail

// ❌ container is implementation detail
const { container } = render(<Component />);
const button = container.querySelector('.btn'); // ❌ Tests CSS class

// ❌ container.firstChild
const { container } = render(<Component />);
expect(container.firstChild).toHaveClass('active'); // ❌ Fragile
```

**Problems:**
- Destructured queries search initial render snapshot
- container queries test DOM structure, not user experience
- querySelector couples tests to CSS classes

**✅ Correct: Always use screen

```tsx
// ✅ screen always queries current DOM
render(<Counter count={0} />);
expect(screen.getByText('Count: 0')).toBeInTheDocument();

// After state update
await userEvent.click(screen.getByRole('button', { name: /increment/i }));
expect(screen.getByText('Count: 1')).toBeInTheDocument();

// ✅ Query by role, not class
const button = screen.getByRole('button', { name: /submit/i });
expect(button).toBeEnabled();
```

---

## Rule: Don't Use rerender() for State Changes

**Principle:** Update state through user actions, not by forcing re-renders.

**❌ Incorrect: Forcing re-render with rerender()

```tsx
// ❌ Manually forcing re-render
const { rerender } = render(<Counter count={0} />);
rerender(<Counter count={1} />); // Not how users interact
expect(screen.getByText('Count: 1')).toBeInTheDocument();

// ❌ Testing prop changes directly
const { rerender } = render(<Toggle enabled={false} />);
rerender(<Toggle enabled={true} />);
expect(screen.getByRole('switch')).toBeChecked();
```

**Problems:**
- Doesn't test how state actually changes
- Skips event handlers and side effects
- Tests unrealistic scenarios

**✅ Correct: Trigger state changes through interactions

```tsx
// ✅ User clicks button
test('counter increments', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

// ✅ Test prop changes from parent interaction
test('toggle switch', async () => {
  const user = userEvent.setup();
  render(<SettingsPanel />);
  
  const toggle = screen.getByRole('switch', { name: /notifications/i });
  await user.click(toggle);
  
  expect(toggle).toBeChecked();
});
```

**When rerender() is OK:**
- Testing how component responds to prop changes from parent
- Integration tests where parent passes different props
- But still prefer testing through realistic user interactions

---

## Rule: Don't Mock Your Own Components

**Principle:** Mocking internal components hides integration bugs and reduces test value.

**❌ Incorrect: Mocking internal components

```tsx
// ❌ Mocking internal component
vi.mock('./UserAvatar', () => ({
  UserAvatar: () => <div data-testid="mock-avatar" />
}));

test('profile page', () => {
  render(<ProfilePage />);
  expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
  // Doesn't test if UserAvatar actually works with ProfilePage
});
```

**Problems:**
- Integration bugs slip through
- Doesn't test real component interactions
- Mock gets out of sync with real component

**✅ Correct: Test with real components

```tsx
// ✅ Use real component
test('profile page', async () => {
  render(<ProfilePage user={mockUser} />);
  
  // Test actual rendered output
  const avatar = screen.getByRole('img', { name: mockUser.name });
  expect(avatar).toHaveAttribute('src', mockUser.avatarUrl);
});

// ✅ Mock external dependencies, not internals
vi.mock('./api', () => ({
  fetchUser: vi.fn(() => Promise.resolve(mockUser))
}));
```

**What to mock:**
- External APIs (fetch, axios)
- Third-party services
- Browser APIs (localStorage, navigator)
- Expensive operations (image processing, crypto)

**What NOT to mock:**
- Your own React components
- Your own custom hooks
- Redux actions/reducers
- Context providers

---

## Rule: Avoid Testing Library Internal APIs

**Principle:** If you're importing from `@testing-library/react/internal` or using `debug()` in production tests, you're doing it wrong.

**❌ Incorrect: Using internal APIs

```tsx
// ❌ Internal imports
import { buildQueries } from '@testing-library/react/internal';

// ❌ debug() in committed tests
test('example', () => {
  render(<Component />);
  screen.debug(); // ❌ Left in committed code
});
```

**✅ Correct: Use public API

```tsx
// ✅ Use documented Testing Library exports
import { render, screen, within, waitFor } from '@testing-library/react';

// ✅ Remove debug() before committing
test('example', () => {
  render(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

---

## Rule: Use getBy for Better Error Messages, Not queryBy

**Principle:** queryBy returns null silently. getBy throws with helpful suggestions about what's actually in the DOM.

**❌ Incorrect: queryBy with toBeInTheDocument

```tsx
// ❌ null + expect gives unhelpful errors
const button = screen.queryByRole('button', { name: /submit/i });
expect(button).toBeInTheDocument();
// When fails: "Expected null to be in document" - no hints about what roles exist
```

**Problems:**
- Error message just says "null" without context
- Doesn't suggest similar elements or available roles
- Adds extra line of code for no benefit

**✅ Correct: getBy for presence, queryBy only for absence

```tsx
// ✅ getBy throws with helpful error immediately
const button = screen.getByRole('button', { name: /submit/i });
// When fails: "Unable to find button with name /submit/i
//              Here are the available roles: link (2), heading (1)..."

// ✅ queryBy only for asserting absence
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
```

**Benefits:**
- getBy error messages suggest what queries would work
- queryBy reserved for its one valid use case
- Less code, better debugging experience

---

## Rule: Never Perform Side Effects Inside waitFor

**Principle:** waitFor retries its callback multiple times. Side effects get executed repeatedly, causing unpredictable behavior.

**❌ Incorrect: Actions inside waitFor

```tsx
// ❌ Click runs on every retry
await waitFor(() => {
  fireEvent.click(incrementButton);
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});
// Button clicked 10+ times before assertion passes

// ❌ Multiple queries and actions
await waitFor(() => {
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(input).toHaveValue('test');
});
// Value set multiple times as waitFor retries
```

**Problems:**
- Actions execute on every retry (could be 10+ times)
- Unpredictable behavior based on timing
- Hard to debug flaky tests

**✅ Correct: Actions outside waitFor, only assertions inside

```tsx
// ✅ Click once, then wait for result
await userEvent.click(incrementButton);
await waitFor(() => {
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});

// ✅ Or better: use findBy
await userEvent.click(incrementButton);
expect(await screen.findByText('Count: 5')).toBeInTheDocument();

// ✅ Setup outside, assertion inside
const input = screen.getByRole('textbox');
await userEvent.type(input, 'test');
await waitFor(() => {
  expect(input).toHaveValue('test');
});
```

**Benefits:**
- Actions execute exactly once
- Predictable test behavior
- waitFor only retries assertions, not side effects

---

## Rule: Don't Add ARIA Attributes Just for Tests

**Principle:** If you need to add aria-label or role to make tests pass, the component has an accessibility problem.

**❌ Incorrect: Adding test-only ARIA

```tsx
// ❌ Component code
function SubmitButton() {
  return (
    <div
      onClick={handleSubmit}
      aria-label="submit-button" // ❌ Added only for tests
      role="button" // ❌ Should use <button> element
    >
      Submit
    </div>
  );
}

// Test works but component is inaccessible
const button = screen.getByRole('button', { name: /submit/i });
```

**Problems:**
- Masks underlying accessibility issues
- Manual ARIA attributes often wrong or incomplete
- Test passes while real users struggle

**✅ Correct: Fix the component semantics

```tsx
// ✅ Component code
function SubmitButton() {
  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
}

// ✅ Test works because component is properly semantic
const button = screen.getByRole('button', { name: /submit/i });

// ✅ Icon button needs aria-label (this is OK)
function DeleteButton() {
  return (
    <button onClick={handleDelete} aria-label="Delete item">
      <TrashIcon />
    </button>
  );
}
```

**When ARIA is acceptable:**
- Icon-only buttons need accessible names
- Complex custom components (after trying semantic HTML)
- Enhancing existing semantic elements

**Never:**
- Adding role="button" instead of using `<button>`
- Adding aria-label to avoid using `<label>` for forms
- Any ARIA added only because tests failed

---

## Key Takeaways

- **Test behavior, not implementation** - what users see, not how code achieves it
- **Always use screen** - never container or destructured queries
- **Avoid large snapshots** - use targeted assertions
- **Don't force re-renders** - trigger updates through user interactions
- **Don't mock your own code** - mock external dependencies only
- **Use public Testing Library API** - avoid internal imports
