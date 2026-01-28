# Query Priority

The query hierarchy reflects how users and assistive technologies interact with your UI. Higher priority queries provide stronger guarantees about accessibility.

## Priority Hierarchy

**Query by:**
1. **Role** - How assistive technologies identify elements
2. **Label** - How users understand form fields
3. **Placeholder** - Less accessible fallback for inputs
4. **Text** - Visible content users read
5. **Display Value** - Current form input values
6. **Alt Text** - Image descriptions
7. **Title** - Tooltip attribute (limited accessibility)
8. **Test ID** - No accessibility verification (last resort)

---

## Rule: Use getByRole as Default Query

**Principle:** Role queries verify both presence and accessibility in one assertion.

### ❌ Incorrect: Skipping accessible queries

```tsx
// Using test ID first bypasses accessibility checks
const button = screen.getByTestId('submit-button');

// Using text without role doesn't verify semantic meaning
const heading = screen.getByText('Dashboard');

// Using class names tests implementation
const modal = container.querySelector('.modal-overlay');
```

**Problems:**
- Test passes even if button lacks accessible name for screen readers
- getByText can match any element - no semantic verification
- querySelector tests CSS implementation, not user experience

### ✅ Correct: Role-first approach

```tsx
// Verify button role AND accessible name
const button = screen.getByRole('button', { name: /submit/i });

// Verify heading role AND level
const heading = screen.getByRole('heading', { name: /dashboard/i, level: 1 });

// Verify dialog role AND label
const modal = screen.getByRole('dialog', { name: /confirm delete/i });
```

**Benefits:**
- Test fails if element lacks proper ARIA role
- Test fails if accessible name is missing or wrong
- Changing CSS classes doesn't break tests
- Forces components to be accessible by design

---

## Rule: Use getByLabelText for Form Fields

**Principle:** Form fields should always have associated labels for accessibility.

### ❌ Incorrect: Querying inputs without labels

```tsx
// Placeholder is not a label replacement
const input = screen.getByPlaceholderText('Enter email');

// Name attribute is for form submission, not accessibility
const input = screen.getByRole('textbox', { name: '' });

// Test ID bypasses label verification
const input = screen.getByTestId('email-input');
```

**Problems:**
- Screen readers can't identify unlabeled form fields
- Placeholders disappear when user types
- Missing labels reduce usability for all users

### ✅ Correct: Label-first for form fields

```tsx
// Label via <label> element
const input = screen.getByLabelText('Email address');

// Or query by role if label exists
const input = screen.getByRole('textbox', { name: /email address/i });

// For aria-label
const input = screen.getByRole('searchbox', { name: /search products/i });
```

**Benefits:**
- Test fails if label is missing or disconnected
- Works with `<label>`, aria-label, aria-labelledby
- Ensures form is usable by screen reader users

---

## Rule: Reserve getByTestId for Truly Dynamic Content

**Principle:** Test IDs should be last resort when semantic queries are impossible.

### ❌ Incorrect: Test IDs as default

```tsx
// Static button doesn't need test ID
const button = screen.getByTestId('save-button');

// Headings have semantic role
const title = screen.getByTestId('page-title');

// Generated content could use text or role
const item = screen.getByTestId(`item-${id}`);
```

**Problems:**
- No accessibility verification
- Test IDs add maintenance burden to components
- Doesn't reflect how users interact with UI

### ✅ Correct: Semantic queries with test ID fallback

```tsx
// Use role for interactive elements
const button = screen.getByRole('button', { name: /save/i });

// Use role + level for headings
const title = screen.getByRole('heading', { name: /settings/i, level: 1 });

// Test ID acceptable for dynamic content without stable text
const avatar = screen.getByTestId(`user-avatar-${userId}`);
// But prefer: getByRole('img', { name: userName }) if alt text is set
```

**When test IDs are acceptable:**
- Dynamically generated IDs where text/role isn't stable
- Third-party components you can't modify
- Non-semantic containers (grid layouts, wrappers)

---

## Rule: Query by Text for Static Content

**Principle:** Text queries work well for non-interactive content when role isn't specific.

### ❌ Incorrect: Text queries for interactive elements

```tsx
// Button might have icon, state text, etc.
const button = screen.getByText('Delete');

// Link text might be inside nested spans
const link = screen.getByText('View details');

// Headings need semantic verification
const heading = screen.getByText('Error');
```

**Problems:**
- Breaks if button text changes slightly
- Doesn't verify semantic meaning
- Fails if text is split across elements

### ✅ Correct: Text for paragraphs, role for interactive

```tsx
// Text query fine for static content
const message = screen.getByText(/your order has been confirmed/i);

// But use role for interactive elements
const button = screen.getByRole('button', { name: /delete/i });
const link = screen.getByRole('link', { name: /view details/i });

// Role for semantic elements
const heading = screen.getByRole('heading', { name: /error/i });
```

**Benefits:**
- getByText works for paragraphs, list items, labels
- getByRole verifies semantics for interactive elements
- Regex makes text queries flexible

---

## Common Roles Reference

Quick reference for most-used ARIA roles:

| Element Type | Role | Example Query |
|--------------|------|---------------|
| Button | `button` | `getByRole('button', { name: /submit/i })` |
| Link | `link` | `getByRole('link', { name: /home/i })` |
| Heading | `heading` | `getByRole('heading', { name: /title/i, level: 1 })` |
| Text input | `textbox` | `getByRole('textbox', { name: /email/i })` |
| Checkbox | `checkbox` | `getByRole('checkbox', { name: /agree/i })` |
| Radio | `radio` | `getByRole('radio', { name: /option a/i })` |
| Select | `combobox` or `listbox` | `getByRole('combobox', { name: /country/i })` |
| Dialog/Modal | `dialog` | `getByRole('dialog', { name: /confirm/i })` |
| Alert | `alert` | `getByRole('alert')` |
| List | `list` | `getByRole('list')` |
| List item | `listitem` | `getByRole('listitem', { name: /item 1/i })` |
| Navigation | `navigation` | `getByRole('navigation', { name: /main/i })` |
| Main content | `main` | `getByRole('main')` |
| Image | `img` | `getByRole('img', { name: /logo/i })` |

---

## When to Move Down the Hierarchy

Start with getByRole and move down only when necessary:

```tsx
// 1st choice: Role (semantic + accessible)
screen.getByRole('button', { name: /submit/i })

// 2nd choice: Label (for form fields)
screen.getByLabelText('Email address')

// 3rd choice: Text (for static content)
screen.getByText(/confirmation message/i)

// Last choice: Test ID (when semantic query impossible)
screen.getByTestId('dynamic-widget-123')
```

**Each step down = less confidence in accessibility.**
