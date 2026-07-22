import "@testing-library/jest-dom";

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
    dispatchEvent: () => {},
  }),
});

// jsdom implements neither observer API. framer-motion reaches for
// IntersectionObserver on mount, and the Radix-based UI primitives use
// ResizeObserver, so rendering any real component fails without these.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockObserver,
});

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockObserver,
});

globalThis.IntersectionObserver =
  window.IntersectionObserver as unknown as typeof globalThis.IntersectionObserver;
globalThis.ResizeObserver =
  window.ResizeObserver as unknown as typeof globalThis.ResizeObserver;

window.scrollTo = () => {};
