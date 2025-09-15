import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

// Mock electron API
const mockSettings = {
  sourceDir: '',
  targetDir: '',
  copyImages: true,
  useDocker: true,
  dockerImage: 'ardakilic/sox_ng:latest',
  noPreserveMetadata: false,
  enforceOutputFormat: 'flac' as const,
  liltBinaryPath: '',
  soxBinaryPath: '',
  ffmpegBinaryPath: '',
  ffprobeBinaryPath: '',
  language: 'en',
  lastUsedPaths: {}
};

const mockElectronAPI = {
  getSettings: jest.fn().mockResolvedValue(mockSettings),
  saveSettings: jest.fn().mockResolvedValue(mockSettings),
  selectFolder: jest.fn(),
  selectFile: jest.fn(),
  identifyBinary: jest.fn(),
  checkBinary: jest.fn(),
  startLilt: jest.fn(),
  stopLilt: jest.fn(),
  getProcessStatus: jest.fn(),
  downloadLilt: jest.fn(),
  openExternal: jest.fn(),
  getAppVersion: jest.fn().mockResolvedValue('1.0.0'),
  getPlatformInfo: jest.fn().mockResolvedValue({ platform: 'darwin', arch: 'x64' }),
  onLiltOutput: jest.fn(),
  onLiltFinished: jest.fn(),
  onLiltError: jest.fn(),
  removeAllListeners: jest.fn(),
};

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options) {
        return key.replace(/\{\{(\w+)\}\}/g, (match, p1) => String(options[p1] || match));
      }
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to suppress expected error messages in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows loading spinner initially', () => {
    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('loads and displays the main interface', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('app.title')).toBeInTheDocument();
    });
    
    // Check if main sections are rendered
    expect(screen.getByText('Binary Configuration')).toBeInTheDocument();
    expect(screen.getByText('Folder Configuration')).toBeInTheDocument();
    expect(screen.getByText('Conversion Options')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('handles settings loading error gracefully', async () => {
    mockElectronAPI.getSettings.mockRejectedValueOnce(new Error('Settings error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // App should still render even if settings fail to load
    expect(mockElectronAPI.getSettings).toHaveBeenCalled();
  });

  it('sets up event listeners on mount', () => {
    render(<App />);
    
    expect(mockElectronAPI.onLiltOutput).toHaveBeenCalled();
    expect(mockElectronAPI.onLiltFinished).toHaveBeenCalled();
    expect(mockElectronAPI.onLiltError).toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<App />);
    
    unmount();
    
    expect(mockElectronAPI.removeAllListeners).toHaveBeenCalledWith('lilt-output');
    expect(mockElectronAPI.removeAllListeners).toHaveBeenCalledWith('lilt-finished');
    expect(mockElectronAPI.removeAllListeners).toHaveBeenCalledWith('lilt-error');
  });
});
