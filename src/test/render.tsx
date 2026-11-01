import type { ReactElement, ReactNode } from "react";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

interface TProvidersOptions {
  /** Initial URL for the in-memory router */
  route?: string;
}

/**
 * The app's providers (Chakra, react-query, router). Each call gets a fresh
 * QueryClient with retries off so failures surface immediately.
 */
function createProviders({ route = "/" }: TProvidersOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      // retryDelay: 0 covers hooks that set their own `retry` (e.g. useFetchPatient),
      // so their retries don't add seconds of backoff to a test
      queries: { retry: false, retryDelay: 0 },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </ChakraProvider>
    );
  }

  return { queryClient, Wrapper };
}

type TRenderWithProvidersOptions = TProvidersOptions &
  Omit<RenderOptions, "wrapper">;

/** render() wrapped in the app's providers */
function renderWithProviders(
  ui: ReactElement,
  { route, ...options }: TRenderWithProvidersOptions = {},
) {
  const { queryClient, Wrapper } = createProviders({ route });

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

type TRenderHookWithProvidersOptions<TProps> = TProvidersOptions &
  Omit<RenderHookOptions<TProps>, "wrapper">;

/** renderHook() wrapped in the app's providers */
function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  { route, ...options }: TRenderHookWithProvidersOptions<TProps> = {},
) {
  const { queryClient, Wrapper } = createProviders({ route });

  return {
    queryClient,
    ...renderHook(hook, { wrapper: Wrapper, ...options }),
  };
}

export { renderWithProviders, renderHookWithProviders };
