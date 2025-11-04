import '@testing-library/jest-dom';

// Mock Wails runtime
if (typeof window === 'undefined') {
  // @ts-ignore - Mock window for testing
  globalThis.window = {};
}

export {};
