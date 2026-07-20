# Accessibility Queries

Testing with accessible queries ensures your components work for all users, including those using assistive technologies. Query difficulty reveals accessibility problems before they reach production.

## Core Principle

If you can't query an element by its accessible properties (role, label, text), users with disabilities can't interact with it either.

---

## Rule: Query Interactive Elements by Role

**Principle:** All interactive elements should have appropriate ARIA roles and accessible names.

**❌ Incorrect: Non-semantic queries for interactive elements

```tsx
// ❌ Test ID doesn't verify accessibility
const button = screen.getByTestId('submit-btn');

// ❌ Class name tests implementation
const button = container.querySelector('.btn-primary');

// ❌ Text query doesn't verify it's a button
const button = screen.getByText('Submit');
```

**Problems:**
- Button might lack proper role for screen readers
- No verification of accessible name
- Doesn't test user/AT experience

**✅ Correct: Role-based queries

```tsx
// ✅ Verifies button role and accessible name
const button = screen.getByRole('button', { name: /submit/i });

// ✅ Verifies link role and destination
const link = screen.getByRole('link', { name: /learn more/i });

// ✅ Verifies heading role and level
const heading = screen.getByRole('heading', { name: /welcome/i, level: 1 });
```

**Benefits:**
- Fails if role is missing or wrong
- Fails if accessible name is missing
- Tests what screen readers announce

---

## Rule: Use getByLabelText for Form Inputs

**Principle:** Form inputs must have associated labels for accessibility.

**❌ Incorrect: Unlabeled or poorly labeled inputs

```tsx
// ❌ No label verification
const input = screen.getByRole('textbox');

// ❌ Placeholder is not a label
const input = screen.getByPlaceholderText('Enter email');

// ❌ Test ID bypasses label check
const input = screen.getByTestId('email-input');
```

**Problems:**
- Screen readers can't identify field purpose
- Touch targets unclear for motor-impaired users
- Fails WCAG 2.1 Level A

**✅ Correct: Label-based queries

```tsx
// ✅ via <label htmlFor="...">
const input = screen.getByLabelText('Email address');

// ✅ via aria-label
const input = screen.getByRole('textbox', { name: /email address/i });

// ✅ via aria-labelledby
const input = screen.getByRole('searchbox', { name: /search products/i });
```

**Component examples:**

```tsx
// ✅ Explicit label
<>
  <label htmlFor="email">Email address</label>
  <input id="email" type="email" />
</>

// ✅ Wrapped label
<label>
  Email address
  <input type="email" />
</label>

// ✅ aria-label
<input type="search" aria-label="Search products" />

// ✅ aria-labelledby
<>
  <span id="email-label">Email address</span>
  <input type="email" aria-labelledby="email-label" />
</>
```

---

## Rule: Test Accessible Names Match User Expectations

**Principle:** The accessible name should match what users see or what makes sense in context.

**❌ Incorrect: Mismatched or missing names

```tsx
// ❌ Button text doesn't match accessible name
<button aria-label="Delete item">
  <TrashIcon />
</button>
// Screen readers say "Delete item" but query by icon fails

// ❌ Generic label
<button aria-label="Button">Click here</button>
// Screen readers announce "Button button" - not helpful

// ❌ Missing name
<button><CloseIcon /></button>
// Screen readers say "button" - no context
```

**✅ Correct: Descriptive accessible names

```tsx
// ✅ Icon button with descriptive label
<button aria-label="Delete user account">
  <TrashIcon />
</button>

// Test:
const deleteButton = screen.getByRole('button', { name: /delete user account/i });

// ✅ Text visible and matches accessible name
<button>Save changes</button>

// Test:
const saveButton = screen.getByRole('button', { name: /save changes/i });

// ✅ Image with descriptive alt
<img src="avatar.jpg" alt="User profile picture" />

// Test:
const avatar = screen.getByRole('img', { name: /user profile picture/i });
```

---

## Common ARIA Patterns

### Dialogs/Modals

```tsx
// ✅ Dialog with accessible name
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm deletion</h2>
  <p>Are you sure you want to delete this item?</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>

// Test:
const dialog = screen.getByRole('dialog', { name: /confirm deletion/i });
const deleteButton = within(dialog).getByRole('button', { name: /delete/i });
```

### Tab Panels

```tsx
// ✅ Tabs with proper ARIA
<div>
  <div role="tablist" aria-label="Settings sections">
    <button role="tab" aria-selected="true" aria-controls="general-panel">
      General
    </button>
    <button role="tab" aria-selected="false" aria-controls="privacy-panel">
      Privacy
    </button>
  </div>
  <div id="general-panel" role="tabpanel" aria-labelledby="general-tab">
    General settings content
  </div>
</div>

// Test:
const generalTab = screen.getByRole('tab', { name: /general/i });
expect(generalTab).toHaveAttribute('aria-selected', 'true');

const panel = screen.getByRole('tabpanel', { name: /general/i });
expect(panel).toBeVisible();
```

### Combobox/Select

```tsx
// ✅ Accessible select
<>
  <label id="country-label">Country</label>
  <select aria-labelledby="country-label">
    <option>United States</option>
    <option>Canada</option>
  </select>
</>

// Test:
const select = screen.getByRole('combobox', { name: /country/i });
await userEvent.selectOptions(select, 'Canada');
expect(select).toHaveValue('Canada');
```

### Loading States

```tsx
// ✅ Announce loading to screen readers
<div role="status" aria-live="polite">
  Loading user data...
</div>

// Test:
const status = screen.getByRole('status');
expect(status).toHaveTextContent(/loading/i);

// After load:
await waitForElementToBeRemoved(() => screen.getByRole('status'));
```

### Alerts

```tsx
// ✅ Error alert
<div role="alert" aria-live="assertive">
  Invalid email address
</div>

// Test:
const alert = screen.getByRole('alert');
expect(alert).toHaveTextContent(/invalid email/i);
```

---

## Testing Keyboard Navigation

```tsx
test('menu keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<Menu />);
  
  const menu = screen.getByRole('menu');
  menu.focus();
  
  // Navigate with arrow keys
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: /first/i })).toHaveFocus();
  
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: /second/i })).toHaveFocus();
  
  // Select with Enter
  await user.keyboard('{Enter}');
  expect(screen.getByText(/selected: second/i)).toBeInTheDocument();
});
```

---

## Testing Focus Management

```tsx
test('modal traps focus', async () => {
  const user = userEvent.setup();
  render(<Page />);
  
  // Open modal
  await user.click(screen.getByRole('button', { name: /open modal/i }));
  
  const modal = screen.getByRole('dialog');
  
  // Focus should be in modal
  expect(modal).toContainElement(document.activeElement);
  
  // Tab stays within modal
  await user.tab();
  expect(modal).toContainElement(document.activeElement);
  
  // Close modal
  await user.keyboard('{Escape}');
  
  // Focus returns to trigger button
  expect(screen.getByRole('button', { name: /open modal/i })).toHaveFocus();
});
```

---

## Common Roles Reference

| Element | Role | Required Attributes |
|---------|------|---------------------|
| `<button>` | button | Accessible name (text content or aria-label) |
| `<a href="...">` | link | Accessible name (text content or aria-label) |
| `<input type="text">` | textbox | Label (via label, aria-label, or aria-labelledby) |
| `<input type="checkbox">` | checkbox | Label |
| `<input type="radio">` | radio | Label |
| `<select>` | combobox | Label |
| `<textarea>` | textbox (multiline) | Label |
| `<h1>` - `<h6>` | heading (level 1-6) | Text content |
| `<img>` | img | alt attribute (accessible name) |
| `<nav>` | navigation | Optional aria-label for multiple navs |
| `<main>` | main | None (only one per page) |
| `<dialog>` | dialog | aria-labelledby or aria-label |

---

## Key Takeaways

- **Query by role** for interactive elements (buttons, links, inputs)
- **Query by label** for form fields via getByLabelText or role + name
- **Accessible name required** for all interactive elements
- **Use within()** to scope queries to specific regions (dialogs, menus)
- **Test keyboard navigation** to verify tab order and keyboard shortcuts
- **Test focus management** especially for modals and dynamic content
- Query difficulty = accessibility problem - fix the component, not the test
