import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";

// jsdom gaps that react-router and Chakra/Ark rely on. Skipped for
// `@jest-environment node` tests (e.g. API tests), which have no window.
if (typeof window !== "undefined") {
  Object.assign(globalThis, { TextEncoder, TextDecoder });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.assign(globalThis, { ResizeObserver: ResizeObserverStub });
}
