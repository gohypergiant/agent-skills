# Query Variants

Understanding when to use getBy*, findBy*, or queryBy* is critical for reliable tests. Each variant has specific use cases based on timing and expected presence.

## Query Variant Matrix

| Variant | Timing | Returns | Throws | Use Case |
|---------|--------|---------|--------|----------|
| `getBy*` | Synchronous | Element | Yes (if not found) | Element should exist now |
| `findBy*` | Async (waits) | Promise\<Element\> | Yes (after timeout) | Element will appear after async operation |
| `queryBy*` | Synchronous | Element \| null | No | Need to assert element absence |

---

## Rule: Use getBy* for Immediate Presence

**Principle:** When element should already be in DOM, use getBy* for immediate failure feedback.

### ❌ Incorrect: Async query for sync content

```tsx
// Element renders immediately, no need for async
const heading = await screen.findByRole('heading', { name: /welcome/i });

// Static text doesn't need waiting
const button = await screen.findByRole('button', { name: /click me/i });

// queryBy hides missing element error
const title = screen.queryByText('Dashboard');
expect(title).toBeInTheDocument();
```

**Problems:**
- findBy adds unnecessary timeout delay to fast tests
- queryBy + expect masks helpful error message from getBy
- Tests run slower without gaining reliability

### ✅ Correct: getBy for synchronous content

```tsx
// Element in initial render
const heading = screen.getByRole('heading', { name: /welcome/i });

// Button rendered immediately
const button = screen.getByRole('button', { name: /click me/i });

// Descriptive error if missing
const title = screen.getByText('Dashboard');
```

**Benefits:**
- Test fails immediately if element missing
- No artificial timeout delay
- Clear error messages pinpoint missing elements

---

## Rule: Use findBy* for Async Appearance

**Principle:** Elements loaded via useEffect, API calls, or timers need async queries.

### ❌ Incorrect: getBy for async content

```tsx
// useEffect loads data - might not be ready
const item = screen.getByText('Loaded item'); // ❌ Throws before data loads

// Timeout not guaranteed to finish
await new Promise(r => setTimeout(r, 100));
const result = screen.getByText('Result'); // ❌ Race condition

// Manual waiting less clear than findBy
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}); // ❌ Verbose, less intention-revealing
```

**Problems:**
- getBy throws immediately, missing elements loaded async
- setTimeout creates race conditions
- waitFor + getBy more verbose than findBy

### ✅ Correct: findBy for async content

```tsx
// Waits for element loaded in useEffect
const item = await screen.findByText('Loaded item');

// API call returns data
const result = await screen.findByRole('heading', { name: /success/i });

// User action triggers async state update
await userEvent.click(button);
const message = await screen.findByText(/saved successfully/i);
```

**Benefits:**
- Automatically retries until element appears or timeout
- Clear intention: "this element loads asynchronously"
- Single line instead of waitFor + getBy

---

## Rule: Use queryBy* to Assert Absence

**Principle:** To verify element is NOT present, queryBy returns null instead of throwing.

### ❌ Incorrect: Expecting getBy to not find element

```tsx
// getBy throws, can't catch in expect
expect(() => screen.getByText('Hidden')).toThrow(); // ❌ Awkward

// findBy waits full timeout before failing
await expect(screen.findByText('Hidden')).rejects.toThrow(); // ❌ Slow

// Using try/catch obscures intent
try {
  screen.getByText('Error message');
  // Not reached if found
} catch {
  // Element absent - success?
} // ❌ Confusing control flow
```

**Problems:**
- getBy throws, not designed for absence testing
- findBy wastes time waiting for element that shouldn't appear
- try/catch makes intent unclear

### ✅ Correct: queryBy for absence assertions

```tsx
// Element not present initially
const error = screen.queryByText('Error message');
expect(error).not.toBeInTheDocument();

// Element removed after action
await userEvent.click(closeButton);
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

// Conditional rendering based on props
render(<Component showDetails={false} />);
expect(screen.queryByText('Details')).toBeNull();
```

**Benefits:**
- Returns null instead of throwing
- Intent clear: "checking element is absent"
- Fast - no retry logic

---

## Rule: waitForElementToBeRemoved for Disappearance

**Principle:** When element should disappear after action, waitForElementToBeRemoved is clearer than queryBy.

### ❌ Incorrect: queryBy in waitFor for removal

```tsx
// Verbose and less clear
await waitFor(() => {
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Manual polling
while (screen.queryByRole('progressbar')) {
  await new Promise(r => setTimeout(r, 50));
} // ❌ Reimplementing waitFor

// No waiting - might still be present
await userEvent.click(button);
expect(screen.queryByRole('dialog')).toBeNull(); // ❌ Race condition
```

**Problems:**
- waitFor + queryBy is verbose for common pattern
- Manual polling error-prone
- No waiting creates race conditions

### ✅ Correct: waitForElementToBeRemoved

```tsx
// Wait for loading spinner to disappear
const spinner = screen.getByRole('progressbar');
await waitForElementToBeRemoved(spinner);

// Wait for modal to close
const modal = screen.getByRole('dialog');
await userEvent.click(closeButton);
await waitForElementToBeRemoved(modal);

// Or get + wait in one line
await waitForElementToBeRemoved(() => screen.getByText('Saving...'));
```

**Benefits:**
- Single-purpose utility for disappearance
- Self-documenting: element should be removed
- Handles timing automatically

---

## Multiple Elements: getAllBy*, findAllBy*, queryAllBy*

Same patterns apply for multiple elements:

### ❌ Incorrect: Wrong variant for multiple elements

```tsx
// getAll for async list
const items = screen.getAllByRole('listitem'); // ❌ Throws if loading

// findAll for sync list
const items = await screen.findAllByRole('listitem'); // ❌ Unnecessary wait

// queryAll without length check
const errors = screen.queryAllByRole('alert');
// ❌ Empty array if absent - need to check length
```

### ✅ Correct: Matching variant to scenario

```tsx
// getAllBy for synchronous lists
const items = screen.getAllByRole('listitem');
expect(items).toHaveLength(5);

// findAllBy for async loaded lists
const items = await screen.findAllByRole('listitem');
expect(items.length).toBeGreaterThan(0);

// queryAllBy to assert no elements
const errors = screen.queryAllByRole('alert');
expect(errors).toHaveLength(0);
```

---

## Rule: Prefer getBy Over queryBy for Better Errors

**Principle:** getBy throws immediately with helpful suggestions. queryBy returns null with no hints.

### ❌ Incorrect: queryBy + expect for presence checks

```tsx
// ❌ Unhelpful error: "Expected null to be in document"
const button = screen.queryByRole('button', { name: /submitt/i }); // Typo
expect(button).toBeInTheDocument();

// ❌ Extra boilerplate with queryBy
const heading = screen.queryByRole('heading');
expect(heading).toBeInTheDocument();
expect(heading).toHaveTextContent('Welcome');
```

**Problems:**
- Error message shows "null" without context
- No suggestions about available roles or similar text
- Extra line of code for assertion

### ✅ Correct: getBy for presence, queryBy only for absence

```tsx
// ✅ Helpful error: "Unable to find button with name /submitt/i
//    Did you mean 'submit'? Here are the available roles..."
const button = screen.getByRole('button', { name: /submitt/i });

// ✅ Concise and clear
const heading = screen.getByRole('heading');
expect(heading).toHaveTextContent('Welcome');

// ✅ queryBy only when asserting absence
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
expect(screen.queryByText(/error/i)).toBeNull();
```

**When to use each:**
- **getBy**: Element should exist now (90% of queries)
- **queryBy**: Only when asserting element does NOT exist
- **findBy**: Element will appear asynchronously

---

## Rule: Use screen.debug() When Queries Fail

**Principle:** When you can't figure out the right query, let Testing Library show you what's available.

### ❌ Incorrect: Guessing at queries

```tsx
// ❌ Trying random queries until one works
screen.getByTestId('submit');
screen.getByClassName('submit-button');
screen.getByRole('submit');
container.querySelector('.btn-primary');
```

**Problems:**
- Wastes time guessing
- Might use suboptimal query that works by accident
- Misses accessibility issues

### ✅ Correct: Debug to see available queries

```tsx
// ✅ See current DOM
screen.debug();
// Prints: <button>Submit form</button>

// ✅ Get interactive query builder
screen.logTestingPlaygroundURL();
// Opens: https://testing-playground.com with your DOM
// Click element → see suggested queries

// Then use the suggested query
const button = screen.getByRole('button', { name: /submit form/i });
```

**Benefits:**
- See exactly what's rendered
- Get query suggestions from Testing Playground
- Learn which queries are most accessible

---

## Decision Matrix

Use this to select the right query variant:

```
Is element present synchronously?
├─ YES → Use getBy* (throws if missing)
│
└─ NO → Is it loaded asynchronously?
    ├─ YES → Use findBy* (waits for element)
    │
    └─ NO (checking absence) → Use queryBy* (returns null)

Does element disappear after action?
└─ Use waitForElementToBeRemoved
```

---

## Common Patterns

**Initial render check:**
```tsx
render(<Component />);
const heading = screen.getByRole('heading'); // Synchronous
```

**After async data load:**
```tsx
render(<UserProfile id={123} />);
const name = await screen.findByText('John Doe'); // Async
```

**Conditional rendering:**
```tsx
render(<Alert show={false} />);
expect(screen.queryByRole('alert')).toBeNull(); // Absence
```

**Element removal:**
```tsx
await userEvent.click(dismissButton);
await waitForElementToBeRemoved(screen.getByRole('alert')); // Disappearance
```

---

## Key Takeaways

- **getBy*** = "element should be here now"
- **findBy*** = "element will appear after async operation"
- **queryBy*** = "element might not be here"
- **waitForElementToBeRemoved** = "element should disappear"
