# Assertions

jest-dom provides semantic matchers that make test assertions more readable and expressive than generic `expect()` matchers.

## Setup

```bash
npm install -D @testing-library/jest-dom
```

```ts
// vitest.setup.ts or test-setup.ts
import '@testing-library/jest-dom/vitest';
```

---

## Document Presence

### toBeInTheDocument()

Most common assertion - element exists in document body.

```tsx
const button = screen.getByRole('button', { name: /submit/i });
expect(button).toBeInTheDocument();

// After removal
await userEvent.click(closeButton);
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
```

### toBeVisible()

Element is not only present but visible (not `display: none`, `visibility: hidden`, etc).

```tsx
expect(screen.getByText('Loading...')).toBeVisible();

// Hidden but in document
expect(screen.getByTestId('hidden')).toBeInTheDocument();
expect(screen.getByTestId('hidden')).not.toBeVisible();
```

### toBeEmptyDOMElement()

Element exists but has no content.

```tsx
const container = screen.getByRole('region');
expect(container).toBeEmptyDOMElement();
```

---

## Form Elements

### toBeDisabled() / toBeEnabled()

```tsx
const submitButton = screen.getByRole('button', { name: /submit/i });
expect(submitButton).toBeDisabled();

await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
expect(submitButton).toBeEnabled();
```

### toHaveValue()

Current value of form input.

```tsx
const input = screen.getByLabelText(/email/i);
await userEvent.type(input, 'user@example.com');
expect(input).toHaveValue('user@example.com');

const select = screen.getByRole('combobox');
await userEvent.selectOptions(select, 'option2');
expect(select).toHaveValue('option2');
```

### toHaveDisplayValue()

Displayed value (what user sees in the input).

```tsx
const input = screen.getByDisplayValue('Initial value');
expect(input).toHaveDisplayValue('Initial value');
```

### toBeChecked() / toBePartiallyChecked()

```tsx
const checkbox = screen.getByRole('checkbox', { name: /agree/i });
expect(checkbox).not.toBeChecked();

await userEvent.click(checkbox);
expect(checkbox).toBeChecked();

// Indeterminate state
expect(checkbox).toBePartiallyChecked();
```

### toHaveFormValues()

Assert all form values at once.

```tsx
const form = screen.getByRole('form');
expect(form).toHaveFormValues({
  username: 'john',
  email: 'john@example.com',
  newsletter: true
});
```

---

## Text Content

### toHaveTextContent()

Text content including nested elements.

```tsx
const heading = screen.getByRole('heading');
expect(heading).toHaveTextContent('Welcome back');

// Regex
expect(heading).toHaveTextContent(/welcome/i);

// Partial match
expect(screen.getByText(/user/)).toHaveTextContent('Username: john');
```

### toContainHTML()

Check if element contains specific HTML.

```tsx
const container = screen.getByRole('article');
expect(container).toContainHTML('<strong>Important</strong>');
```

### toContainElement()

Check if element contains another element.

```tsx
const form = screen.getByRole('form');
const submitButton = screen.getByRole('button', { name: /submit/i });
expect(form).toContainElement(submitButton);
```

---

## Attributes

### toHaveAttribute()

```tsx
const link = screen.getByRole('link', { name: /home/i });
expect(link).toHaveAttribute('href', '/home');

// Just check attribute exists
expect(link).toHaveAttribute('target');

// Regex
expect(link).toHaveAttribute('href', /^\/home/);
```

### toHaveClass()

```tsx
const button = screen.getByRole('button');
expect(button).toHaveClass('btn-primary');

// Multiple classes
expect(button).toHaveClass('btn', 'btn-primary');

// NOT checking specific order or all classes
expect(button).toHaveClass('btn-primary'); // passes even if has other classes
```

### toHaveStyle()

```tsx
const element = screen.getByTestId('styled');
expect(element).toHaveStyle({
  display: 'flex',
  backgroundColor: 'rgb(255, 0, 0)'
});

// Single style
expect(element).toHaveStyle('display: flex');
```

---

## Accessibility

### toHaveAccessibleName()

The computed accessible name (what screen readers announce).

```tsx
// Button with text content
const button = screen.getByRole('button');
expect(button).toHaveAccessibleName('Submit form');

// Icon button with aria-label
const closeButton = screen.getByRole('button', { name: /close/i });
expect(closeButton).toHaveAccessibleName('Close dialog');

// Input with label
const input = screen.getByRole('textbox');
expect(input).toHaveAccessibleName('Email address');
```

### toHaveAccessibleDescription()

Accessible description (via aria-describedby).

```tsx
const input = screen.getByRole('textbox', { name: /password/i });
expect(input).toHaveAccessibleDescription('Must be at least 8 characters');
```

### toHaveAccessibleErrorMessage()

ARIA error message for invalid inputs.

```tsx
const input = screen.getByRole('textbox', { name: /email/i });
expect(input).toHaveAccessibleErrorMessage('Invalid email format');
```

---

## Focus

### toHaveFocus()

Element currently has keyboard focus.

```tsx
const input = screen.getByRole('textbox');
input.focus();
expect(input).toHaveFocus();

await userEvent.tab();
expect(screen.getByRole('button')).toHaveFocus();
```

---

## ARIA Attributes

### toHaveRole()

Verify element's ARIA role.

```tsx
expect(screen.getByRole('button')).toHaveRole('button');
```

### Generic Attribute Checks

For any ARIA attribute:

```tsx
const button = screen.getByRole('button');
expect(button).toHaveAttribute('aria-expanded', 'false');
expect(button).toHaveAttribute('aria-controls', 'menu-id');
expect(button).toHaveAttribute('aria-haspopup', 'true');

// After click
await userEvent.click(button);
expect(button).toHaveAttribute('aria-expanded', 'true');
```

---

## Common Patterns

### Form validation

```tsx
test('shows validation errors', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  const input = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  
  // Invalid input
  await user.type(input, 'invalid');
  expect(input).toHaveValue('invalid');
  expect(input).toBeInvalid(); // HTML5 validation
  expect(submitButton).toBeDisabled();
  
  // Valid input
  await user.clear(input);
  await user.type(input, 'valid@example.com');
  expect(input).toHaveValue('valid@example.com');
  expect(input).toBeValid();
  expect(submitButton).toBeEnabled();
});
```

### Loading states

```tsx
test('loading state', async () => {
  render(<DataList />);
  
  // Initially loading
  const loadingIndicator = screen.getByRole('status');
  expect(loadingIndicator).toBeInTheDocument();
  expect(loadingIndicator).toHaveTextContent(/loading/i);
  
  // After load
  const items = await screen.findAllByRole('listitem');
  expect(items).toHaveLength(5);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
```

### Conditional rendering

```tsx
test('shows details when expanded', async () => {
  const user = userEvent.setup();
  render(<Accordion />);
  
  const button = screen.getByRole('button', { name: /expand/i });
  expect(button).toHaveAttribute('aria-expanded', 'false');
  
  // Details not visible
  expect(screen.queryByText(/detailed content/i)).not.toBeInTheDocument();
  
  // Expand
  await user.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(/detailed content/i)).toBeVisible();
});
```

### Accessibility verification

```tsx
test('button is accessible', () => {
  render(<IconButton icon={<TrashIcon />} label="Delete item" />);
  
  const button = screen.getByRole('button');
  expect(button).toHaveAccessibleName('Delete item');
  expect(button).toBeEnabled();
  expect(button).not.toHaveAttribute('disabled');
});
```

---

## Combining with Regular Matchers

jest-dom matchers work alongside standard Jest/Vitest matchers:

```tsx
const items = screen.getAllByRole('listitem');

// Length
expect(items).toHaveLength(3);

// Each element assertion
items.forEach(item => {
  expect(item).toBeVisible();
  expect(item).toHaveClass('list-item');
});

// toContainElement
const list = screen.getByRole('list');
expect(list).toContainElement(items[0]);
```

---

## Key Takeaways

- **toBeInTheDocument()** - most common, element exists
- **toBeVisible()** - element is not hidden
- **toHaveValue()** - for form inputs
- **toHaveTextContent()** - rendered text
- **toHaveAccessibleName()** - verify screen reader announcements
- **toHaveFocus()** - keyboard focus management
- **toHaveAttribute()** - ARIA and HTML attributes

Use semantic matchers over generic ones for better error messages and readability.
