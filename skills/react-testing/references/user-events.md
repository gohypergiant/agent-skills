# User Events

Using `@testing-library/user-event` over `fireEvent` simulates realistic user interactions with proper event sequences, timing, and browser behavior.

## Core Principle

**fireEvent dispatches single DOM events. userEvent simulates complete user interactions.**

Real users trigger sequences of events (focus → mousedown → mouseup → click). Testing with fireEvent misses bugs that occur in the event sequence.

---

## Rule: Use userEvent for All User Interactions

**Principle:** userEvent simulates how real users interact with your application.

**❌ Incorrect: fireEvent for user interactions

```tsx
import { fireEvent, screen } from '@testing-library/react';

// Single click event, missing focus/mousedown/mouseup
fireEvent.click(screen.getByRole('button'));

// Direct input change without typing simulation
fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

// Hover without proper mouse events
fireEvent.mouseOver(screen.getByRole('tooltip'));
```

**Problems:**
- Missing event sequences users actually trigger
- No timing delays between events
- Keyboard navigation not simulated properly
- Pointer events not in correct order

**✅ Correct: userEvent for realistic simulation

```tsx
import userEvent from '@testing-library/user-event';

// Full click sequence: focus → mousedown → mouseup → click
await userEvent.click(screen.getByRole('button'));

// Realistic typing with per-character events
await userEvent.type(screen.getByRole('textbox'), 'test');

// Proper hover simulation
await userEvent.hover(screen.getByRole('button'));
```

**Benefits:**
- Catches bugs in event handlers that fireEvent misses
- Simulates timing between events
- Handles focus management automatically
- Tests keyboard and pointer interactions correctly

---

## Rule: Always Await userEvent Calls

**Principle:** userEvent methods are async and return promises. Forgetting await causes race conditions.

**❌ Incorrect: Not awaiting userEvent

```tsx
// No await - test continues before interaction completes
userEvent.click(button); // ❌ Promise ignored
expect(screen.getByText('Clicked')).toBeInTheDocument(); // ❌ Might not be rendered yet

// Interaction happens after assertion
userEvent.type(input, 'text'); // ❌ No await
expect(input).toHaveValue('text'); // ❌ Input still empty
```

**Problems:**
- Assertions run before interaction completes
- State updates happen after test finishes
- Causes "act" warnings
- Creates flaky tests

**✅ Correct: Always await userEvent

```tsx
// Wait for click to complete
await userEvent.click(button);
expect(screen.getByText('Clicked')).toBeInTheDocument();

// Wait for typing to finish
await userEvent.type(input, 'text');
expect(input).toHaveValue('text');

// Chain interactions with await
await userEvent.click(button1);
await userEvent.click(button2);
expect(screen.getByText('Both clicked')).toBeInTheDocument();
```

**Benefits:**
- Interactions complete before assertions
- No race conditions
- No act warnings
- Predictable test execution

---

## Rule: Use setup() for Test Isolation

**Principle:** Call userEvent.setup() per test for proper isolation and realistic delays.

**❌ Incorrect: Importing userEvent directly

```tsx
// Default import skips setup
import userEvent from '@testing-library/user-event';

test('button click', async () => {
  render(<Button />);
  await userEvent.click(screen.getByRole('button')); // Works but not isolated
});
```

**Problems:**
- State might leak between tests
- Can't configure delay or other options
- Less explicit about test setup

**✅ Correct: setup() per test

```tsx
import userEvent from '@testing-library/user-event';

test('button click', async () => {
  const user = userEvent.setup();
  render(<Button />);
  
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});

test('with custom delay', async () => {
  const user = userEvent.setup({ delay: 100 }); // 100ms between keystrokes
  render(<Input />);
  
  await user.type(screen.getByRole('textbox'), 'slow typing');
});
```

**Benefits:**
- Explicit test setup
- Configurable delays and options
- Better test isolation
- Can mock clipboard, pointer lock, etc.

---

## Common Interactions

### Click

```tsx
const user = userEvent.setup();

// Single click
await user.click(screen.getByRole('button'));

// Double click
await user.dblClick(screen.getByRole('button'));

// Right click
await user.pointer({ keys: '[MouseRight]', target: element });
```

### Type and Keyboard

```tsx
const user = userEvent.setup();
const input = screen.getByRole('textbox');

// Type text (triggers focus, keydown, keypress, input, keyup)
await user.type(input, 'Hello world');

// Clear input
await user.clear(input);

// Type with special keys
await user.type(input, 'Test{Enter}'); // Press Enter
await user.type(input, '{Shift}hello{/Shift}'); // HELLO

// Keyboard shortcuts
await user.keyboard('{Control>}a{/Control}'); // Ctrl+A
await user.keyboard('{Alt>}{Shift>}k{/Shift}{/Alt}'); // Alt+Shift+K
```

### Select/Dropdown

```tsx
const user = userEvent.setup();

// Select by label text
await user.selectOptions(
  screen.getByRole('combobox'),
  'Option Label'
);

// Select by value
await user.selectOptions(
  screen.getByRole('combobox'),
  'option-value'
);

// Multi-select
await user.selectOptions(
  screen.getByRole('listbox'),
  ['Option 1', 'Option 2']
);
```

### Checkbox/Radio

```tsx
const user = userEvent.setup();

// Check checkbox
await user.click(screen.getByRole('checkbox'));

// Or more explicit
const checkbox = screen.getByRole('checkbox');
if (!checkbox.checked) {
  await user.click(checkbox);
}

// Radio button
await user.click(screen.getByRole('radio', { name: /option a/i }));
```

### Upload File

```tsx
const user = userEvent.setup();
const file = new File(['content'], 'test.txt', { type: 'text/plain' });

const input = screen.getByLabelText(/upload file/i);
await user.upload(input, file);

// Multiple files
await user.upload(input, [file1, file2]);
```

### Hover and Unhover

```tsx
const user = userEvent.setup();

// Hover over element
await user.hover(screen.getByRole('button'));
expect(screen.getByRole('tooltip')).toBeInTheDocument();

// Unhover
await user.unhover(screen.getByRole('button'));
expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
```

### Copy/Paste

```tsx
const user = userEvent.setup();

// Copy
await user.copy();

// Paste
await user.paste('pasted text');

// Cut
await user.cut();
```

### Tab Navigation

```tsx
const user = userEvent.setup();

// Tab to next focusable element
await user.tab();

// Shift+Tab to previous
await user.tab({ shift: true });

// Tab multiple times
await user.tab();
await user.tab();
await user.tab();
```

---

## When fireEvent Is Acceptable

fireEvent is acceptable only for events that have no user interaction equivalent:

### ✅ Acceptable fireEvent usage

```tsx
// Scroll events (no userEvent.scroll yet)
fireEvent.scroll(window, { target: { scrollY: 100 } });

// Window resize
fireEvent.resize(window, { innerWidth: 500 });

// Focus/blur when testing programmatic focus
fireEvent.focus(element);
fireEvent.blur(element);

// Animation/transition end events
fireEvent.animationEnd(element);
fireEvent.transitionEnd(element);
```

But even for these, check if userEvent has added support in newer versions.

---

## Common Patterns

### Form submission

```tsx
test('submits form', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();
  
  render(<Form onSubmit={handleSubmit} />);
  
  await user.type(screen.getByLabelText(/username/i), 'john');
  await user.type(screen.getByLabelText(/password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(handleSubmit).toHaveBeenCalledWith({
    username: 'john',
    password: 'secret123'
  });
});
```

### Keyboard navigation

```tsx
test('navigates with keyboard', async () => {
  const user = userEvent.setup();
  render(<Menu />);
  
  const menu = screen.getByRole('menu');
  menu.focus();
  
  // Arrow down to first item
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: /first/i })).toHaveFocus();
  
  // Arrow down to second item
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: /second/i })).toHaveFocus();
  
  // Enter to select
  await user.keyboard('{Enter}');
  expect(screen.getByText(/selected: second/i)).toBeInTheDocument();
});
```

### Async state updates

```tsx
test('shows loading then success', async () => {
  const user = userEvent.setup();
  render(<AsyncButton />);
  
  await user.click(screen.getByRole('button', { name: /save/i }));
  
  // Loading state
  expect(screen.getByText(/saving/i)).toBeInTheDocument();
  
  // Wait for success
  expect(await screen.findByText(/saved/i)).toBeInTheDocument();
});
```

---

## Key Differences: userEvent vs fireEvent

| Feature | userEvent | fireEvent |
|---------|-----------|-----------|
| Event sequence | Complete (focus → mousedown → mouseup → click) | Single event |
| Async | Yes (returns Promise) | No (synchronous) |
| Timing delays | Simulates real timing | Instant |
| Focus management | Automatic | Manual |
| Keyboard input | Character-by-character with delays | Direct value change |
| Browser behavior | Simulates accurately | Basic event dispatch |
| Use case | All user interactions | Non-user events only |

---

## Key Takeaways

- **Always use userEvent for user interactions** (clicks, typing, selecting)
- **Always await userEvent calls** - they return promises
- **Use userEvent.setup()** at the start of each test
- **fireEvent only for non-user events** (scroll, resize, animation end)
- **userEvent catches more bugs** by simulating complete interaction sequences
