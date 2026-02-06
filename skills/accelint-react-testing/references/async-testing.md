# Async Testing

Handling asynchronous operations correctly is critical for reliable React tests. Understanding when and how to wait for async updates prevents flaky tests and act warnings.

## Core Principle

React state updates are asynchronous. Tests must wait for updates to complete before asserting on the result.

---

## Rule: Use findBy* for Elements That Appear Asynchronously

**Principle:** findBy* queries wait for elements loaded via useEffect, API calls, or timers.

**❌ Incorrect: Synchronous query for async content

```tsx
test('loads user data', () => {
  render(<UserProfile id={123} />);
  
  // ❌ Throws immediately - data not loaded yet
  const name = screen.getByText('John Doe');
});
```

**✅ Correct: Async query waits for content

```tsx
test('loads user data', async () => {
  render(<UserProfile id={123} />);
  
  // ✅ Waits up to 1000ms for element to appear
  const name = await screen.findByText('John Doe');
  expect(name).toBeInTheDocument();
});
```

---

## Rule: Use waitFor for Complex Assertions

**Principle:** waitFor retries callback until it succeeds or times out. Use for assertions that can't be expressed as findBy queries.

**❌ Incorrect: Synchronous assertions on async state

```tsx
// ❌ Assertion runs before state updates
await userEvent.click(button);
expect(callback).toHaveBeenCalled(); // Might not be called yet

// ❌ Element might still be visible
await userEvent.click(closeButton);
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
```

**✅ Correct: waitFor for non-query assertions

```tsx
// ✅ Waits for callback invocation
await userEvent.click(button);
await waitFor(() => expect(callback).toHaveBeenCalled());

// ✅ Or use findBy for element queries
await userEvent.click(button);
await screen.findByText('Success');
```

**Prefer findBy* over waitFor + getBy when possible.**

---

## Rule: Avoid Act Warnings with Proper Awaiting

**Principle:** Act warnings mean state updates happened outside Testing Library's awareness.

**❌ Incorrect: Missing await on async operations

```tsx
// ❌ No await - state update after test finishes
userEvent.click(button);
expect(screen.getByText('Clicked')).toBeInTheDocument();

// ❌ Promise resolves after assertion
fetchData().then(data => setState(data));
expect(screen.getByText('Data')).toBeInTheDocument();
```

**✅ Correct: Await all async operations

```tsx
// ✅ Wait for click to complete
await userEvent.click(button);
expect(screen.getByText('Clicked')).toBeInTheDocument();

// ✅ Wait for data to load and render
await screen.findByText('Data');
```

---

## Rule: Use waitForElementToBeRemoved for Disappearance

**Principle:** When elements should disappear, waitForElementToBeRemoved is more explicit than queryBy.

**❌ Incorrect: queryBy without waiting

```tsx
await userEvent.click(closeButton);
// ❌ Might still be visible due to animation
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
```

**✅ Correct: Wait for removal

```tsx
const dialog = screen.getByRole('dialog');
await userEvent.click(closeButton);
await waitForElementToBeRemoved(dialog);
```

---

## Common Async Patterns

### Loading state → Success

```tsx
test('shows loading then data', async () => {
  render(<DataList />);
  
  // Loading appears immediately
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // Wait for data to replace loading
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(5);
  
  // Loading gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

### Error handling

```tsx
test('shows error on failure', async () => {
  server.use(
    http.get('/api/users', () => HttpResponse.error())
  );
  
  render(<UserList />);
  
  const error = await screen.findByRole('alert');
  expect(error).toHaveTextContent(/failed to load/i);
});
```

### Debounced input

```tsx
test('debounced search', async () => {
  const user = userEvent.setup();
  render(<Search />);
  
  const input = screen.getByRole('searchbox');
  await user.type(input, 'react');
  
  // Wait for debounce + API call
  const results = await screen.findAllByRole('listitem');
  expect(results).toHaveLength(3);
});
```

### Polling/retry

```tsx
test('retries failed request', async () => {
  let attempts = 0;
  server.use(
    http.get('/api/data', () => {
      attempts++;
      return attempts < 3 
        ? HttpResponse.error() 
        : HttpResponse.json({ data: 'success' });
    })
  );
  
  render(<RetryComponent />);
  
  // Eventually succeeds after retries
  expect(await screen.findByText('success')).toBeInTheDocument();
}, { timeout: 10000 }); // Increase timeout for retry logic
```

---

## Rule: Never Put Side Effects in waitFor Callbacks

**Principle:** waitFor retries its callback multiple times. Side effects inside get executed repeatedly.

**❌ Incorrect: Actions inside waitFor

```tsx
// ❌ Button clicked on every retry (10+ times)
await waitFor(() => {
  fireEvent.click(button);
  expect(callback).toHaveBeenCalled();
});

// ❌ API called repeatedly
await waitFor(async () => {
  const data = await fetchData(); // ❌ Fetches on every retry
  expect(data).toBeDefined();
});

// ❌ State mutations on every retry
await waitFor(() => {
  setItems(prev => [...prev, newItem]); // ❌ Adds item multiple times
  expect(screen.getByText('Item added')).toBeInTheDocument();
});
```

**Problems:**
- Actions execute 10+ times as waitFor retries
- Network requests duplicated unnecessarily
- State mutations accumulate unpredictably
- Tests become flaky and slow

**✅ Correct: Side effects outside, assertions inside

```tsx
// ✅ Click once, wait for callback
await userEvent.click(button);
await waitFor(() => {
  expect(callback).toHaveBeenCalled();
});

// ✅ Or better: use findBy
await userEvent.click(button);
expect(await screen.findByText('Success')).toBeInTheDocument();

// ✅ Fetch once, wait for result
const dataPromise = fetchData();
await waitFor(async () => {
  const data = await dataPromise; // Same promise, not re-fetching
  expect(data).toBeDefined();
});

// ✅ State change once, wait for UI update
setItems(prev => [...prev, newItem]);
await waitFor(() => {
  expect(screen.getByText('Item added')).toBeInTheDocument();
});
```

**Rule of thumb:** If it changes state, calls an API, or triggers events, it belongs OUTSIDE waitFor.

---

## Rule: Prefer findBy Over waitFor + getBy

**Principle:** findBy queries are specifically designed for waiting. waitFor + getBy is verbose and less clear.

**❌ Incorrect: waitFor wrapping getBy

```tsx
// ❌ Verbose and less intention-revealing
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Even worse
await waitFor(() => {
  const element = screen.getByText('Loaded');
  expect(element).toBeInTheDocument();
});
```

**✅ Correct: Use findBy directly

```tsx
// ✅ Concise and clear
expect(await screen.findByText('Loaded')).toBeInTheDocument();

// ✅ Or just
await screen.findByText('Loaded');
```

**Use waitFor only when:**
- Asserting on something that's not a DOM query (callback called, attribute changed)
- Waiting for element to disappear (use waitForElementToBeRemoved instead)
- Complex assertions that can't be expressed as queries

---

## Timeout Configuration

Default timeout is 1000ms. Configure per query or globally:

```tsx
// Per query
await screen.findByText('Slow content', {}, { timeout: 3000 });

// Per waitFor
await waitFor(() => expect(element).toBeVisible(), { timeout: 5000 });

// Globally in setup
import { configure } from '@testing-library/react';
configure({ asyncUtilTimeout: 2000 });
```

---

## Key Takeaways

- **findBy*** for elements that load asynchronously
- **waitFor** for complex assertions not expressible as queries
- **Always await** userEvent calls and async queries
- **waitForElementToBeRemoved** for elements that should disappear
- Act warnings = missing await or state update after test finishes
