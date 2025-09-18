import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock Tauri APIs
const mockInvoke = vi.fn();
const mockListen = vi.fn();
const mockOpen = vi.fn();

vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: mockInvoke,
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: mockListen,
}));

vi.mock('@tauri-apps/api/dialog', () => ({
  open: mockOpen,
}));

vi.mock('@tauri-apps/api/fs', () => ({
  readTextFile: vi.fn(),
  writeTextFile: vi.fn(),
  createDir: vi.fn(),
  BaseDirectory: {
    AppData: 'AppData',
  },
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: (key: string, options?: any) => {
      if (options && typeof options === 'object') {
        return key.replace(
          /\{\{(\w+)\}\}/g,
          (match, prop) => options[prop] || match,
        );
      }
      return key;
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Setup global test utilities
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mockInvoke = mockInvoke;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mockListen = mockListen;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mockOpen = mockOpen;

// Clean up mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
