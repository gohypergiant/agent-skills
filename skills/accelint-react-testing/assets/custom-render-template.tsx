// test-utils.tsx
// Reusable test utilities with all common providers
// Customize this template based on your project's needs

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import { getQueryClient } from '~/configs/query-client';
// import { ThemeProvider } from '~/configs/theme'; // Uncomment if using themes

// Re-export Testing Library utilities for convenience
export { 
  screen, 
  waitFor, 
  within, 
  waitForElementToBeRemoved 
} from '@testing-library/react';

/**
 * Custom render options extending RTL's RenderOptions
 * Add your project-specific provider options here
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Redux
  // preloadedState?: PreloadedState<RootState>;
  // store?: ReturnType<typeof configureStore>;
  
  // React Query
  queryClient?: QueryClient;
  
  // Theme
  // theme?: Theme;
}

/**
 * Custom render result including test utilities
 */
interface CustomRenderResult extends RenderResult {
  // Return store for assertions
  // store: ReturnType<typeof configureStore>;
  
  // Return query client for cache inspection
  queryClient: QueryClient;
  
  // Return configured userEvent for interactions
  user: ReturnType<typeof userEvent.setup>;
}

const defaultQueryClient = getQueryClient({
  defaultOptions: {
    queries: { 
      retry: false, 
      cacheTime: 0,
      staleTime: 0
    },
    mutations: { 
      retry: false 
    },
  },
})

/**
 * Custom render function that wraps components with all necessary providers
 * 
 * @example
 * ```tsx
 * test('example', async () => {
 *   const { user, queryClient } = renderWithProviders(<MyComponent />, {
 *     queryClient: new QueryClient(...),
 *   });
 *   
 *   await user.click(screen.getByRole('button'));
 *   expect(screen.getByText('Clicked')).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    // Redux setup
    // preloadedState = {},
    // store = configureStore({ 
    //   reducer: rootReducer, 
    //   preloadedState 
    // }),
    
    // React Query setup - disable retries for faster tests
    queryClient = defaultQueryClient,
    
    // Theme setup
    // theme = defaultTheme,

    ...options
  }: CustomRenderOptions = {}
): CustomRenderResult {
  
  /**
   * Wrapper component with all providers
   * Add/remove providers based on your project needs
   */
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider theme={theme}> */}
          {children}
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    );
  }

  return {
    // store,
    queryClient,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

/**
 * Export renderWithProviders as default render for convenience
 * This allows importing { render } instead of { renderWithProviders }
 */
export { renderWithProviders as render };

/**
 * Helper to create a test user for mocking authentication
 */
export function createTestUser(overrides = {}) {
  return {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

/**
 * Helper to create a fresh Query Client for isolated tests
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silence errors in tests
    },
  });
}

/**
 * Helper to wait for all React Query queries to settle
 */
export async function waitForQueryClient(queryClient: QueryClient) {
  await queryClient.refetchQueries();
  return new Promise(resolve => setTimeout(resolve, 0));
}
