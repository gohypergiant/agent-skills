# Custom Render

Components using Context, Redux, React Router, or other providers need wrapped renders for tests. Centralizing provider setup in test utils prevents duplication and ensures consistency.

## Core Principle

Don't repeat provider setup in every test. Create custom render utilities that wrap components automatically.

---

## Rule: Create Custom Render for Providers

**Principle:** Centralize provider setup in test utils instead of duplicating in every test file.

### ❌ Incorrect: Repeating provider setup

```tsx
// ❌ Every test file repeats this
test('component with theme', () => {
  render(
    <ThemeProvider theme={theme}>
      <Component />
    </ThemeProvider>
  );
});

// ❌ Duplicated in another test file
test('other component', () => {
  render(
    <ThemeProvider theme={theme}>
      <OtherComponent />
    </ThemeProvider>
  );
});
```

**Problems:**
- Provider setup duplicated across test files
- Hard to update when providers change
- Easy to forget required providers

### ✅ Correct: Custom render utility

```tsx
// test-utils.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from './theme';

export function renderWithTheme(ui: React.ReactElement, theme = defaultTheme) {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
}

// component.test.tsx
import { renderWithTheme } from './test-utils';

test('component with theme', () => {
  renderWithTheme(<Component />);
  // Test assertions...
});
```

---

## Common Provider Patterns

### Theme Provider

```tsx
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { theme } from './theme';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: typeof theme;
}

export function renderWithTheme(
  ui: React.ReactElement,
  { theme: customTheme = theme, ...options }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Usage
test('uses theme colors', () => {
  renderWithTheme(<Button />, { theme: darkTheme });
  // ...
});
```

### Redux Store

```tsx
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: RootState;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithStore(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
    ...options
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

// Usage
test('dispatches action', async () => {
  const { store } = renderWithStore(<TodoList />, {
    preloadedState: { todos: [] }
  });
  
  await userEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(store.getState().todos).toHaveLength(1);
});
```

### React Router

```tsx
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

interface RouterRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

export function renderWithRouter(
  ui: React.ReactElement,
  { initialEntries = ['/'], ...options }: RouterRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Usage
test('navigates to detail page', async () => {
  renderWithRouter(<App />, { initialEntries: ['/items/123'] });
  expect(await screen.findByRole('heading', { name: /item 123/i })).toBeInTheDocument();
});
```

### Multiple Providers

```tsx
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from './theme';

interface AllProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  preloadedState?: RootState;
  queryClient?: QueryClient;
  theme?: Theme;
}

export function renderWithAllProviders(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    preloadedState = {},
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    theme = defaultTheme,
    ...options
  }: AllProvidersOptions = {}
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter initialEntries={initialEntries}>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    );
  }

  return { store, queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
```

---

## Rule: Export Custom Render with Screen

**Principle:** Re-export Testing Library utilities from test-utils for consistent imports.

### ❌ Incorrect: Mixed imports

```tsx
// ❌ Mixing custom and standard imports
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';

test('example', () => {
  renderWithProviders(<Component />);
  // ...
});
```

### ✅ Correct: Single import source

```tsx
// test-utils.tsx
export { screen, waitFor, within } from '@testing-library/react';
export * from '@testing-library/user-event';

// component.test.tsx
import { renderWithProviders, screen, waitFor } from './test-utils';

test('example', async () => {
  renderWithProviders(<Component />);
  expect(await screen.findByText('Content')).toBeInTheDocument();
});
```

---

## Complete Test Utils Example

```tsx
// test-utils.tsx
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from './theme';
import { rootReducer, RootState } from './store';
import { defaultTheme, Theme } from './theme';

// Re-export Testing Library utilities
export { screen, waitFor, within, waitForElementToBeRemoved } from '@testing-library/react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
  queryClient?: QueryClient;
  theme?: Theme;
  initialEntries?: string[];
}

interface CustomRenderResult extends RenderResult {
  store: ReturnType<typeof configureStore>;
  queryClient: QueryClient;
  user: ReturnType<typeof userEvent.setup>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
        mutations: { retry: false },
      },
    }),
    theme = defaultTheme,
    initialEntries = ['/'],
    ...options
  }: CustomRenderOptions = {}
): CustomRenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter initialEntries={initialEntries}>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    );
  }

  return {
    store,
    queryClient,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

// Export as default render for convenience
export { renderWithProviders as render };
```

### Usage

```tsx
import { render, screen } from './test-utils';

test('full app integration', async () => {
  const { user, store } = render(<App />, {
    preloadedState: { user: mockUser },
    initialEntries: ['/dashboard']
  });

  await user.click(screen.getByRole('button', { name: /logout/i }));
  
  expect(store.getState().user).toBeNull();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
```

---

## Key Takeaways

- **Centralize provider setup** in test-utils.tsx
- **Accept options** for customizing providers per test
- **Re-export Testing Library** utilities for consistent imports
- **Return useful objects** (store, queryClient) for assertions
- **Include userEvent.setup()** in render result for convenience
