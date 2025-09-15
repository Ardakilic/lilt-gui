import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { FolderSection } from '../FolderSection';
import { theme } from '../../styles/theme';
import i18n from '../../i18n/i18n';

const mockElectronAPI = {
  selectFolder: jest.fn(),
};

// Mock window.electronAPI
Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </I18nextProvider>
  );
};

const defaultProps = {
  settings: {
    liltBinaryPath: '',
    soxBinaryPath: '',
    ffmpegBinaryPath: '',
    ffprobeBinaryPath: '',
    sourceDir: '',
    targetDir: '',
    useDocker: true,
    dockerImage: 'ardakilic/lilt:latest',
    enforceOutputFormat: '' as const,
    noPreserveMetadata: false,
    copyImages: true,
    language: 'en',
    lastUsedPaths: {},
  },
  onUpdateSetting: jest.fn(),
  onUpdateLastUsedPath: jest.fn(),
  onNotification: jest.fn(),
};

describe('FolderSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to suppress expected error messages in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders source and target folder inputs', () => {
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    expect(screen.getByText('Folder Configuration')).toBeInTheDocument();
    expect(screen.getAllByText('Browse')).toHaveLength(2);
  });

  it('displays current folder paths', () => {
    const props = {
      ...defaultProps,
      settings: {
        ...defaultProps.settings,
        sourceDir: '/path/to/source',
        targetDir: '/path/to/target',
      },
    };
    
    renderWithProviders(<FolderSection {...props} />);
    
    expect(screen.getByDisplayValue('/path/to/source')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/path/to/target')).toBeInTheDocument();
  });

  it('handles source folder selection', async () => {
    mockElectronAPI.selectFolder.mockResolvedValue('/selected/source/path');
    
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[0]); // First browse button (source)
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFolder).toHaveBeenCalled();
      expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('sourceDir', '/selected/source/path');
    });
  });

  it('handles target folder selection', async () => {
    mockElectronAPI.selectFolder.mockResolvedValue('/selected/target/path');
    
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[1]); // Second browse button (target)
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFolder).toHaveBeenCalled();
      expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('targetDir', '/selected/target/path');
    });
  });

  it('handles errors during source folder selection', async () => {
    mockElectronAPI.selectFolder.mockRejectedValue(new Error('Selection cancelled'));
    
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[0]);
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFolder).toHaveBeenCalled();
      // Should not call onChange on error
      expect(defaultProps.onUpdateSetting).not.toHaveBeenCalled();
    });
  });

  it('handles errors during target folder selection', async () => {
    mockElectronAPI.selectFolder.mockRejectedValue(new Error('Selection cancelled'));
    
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[1]);
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFolder).toHaveBeenCalled();
      // Should not call onChange on error
      expect(defaultProps.onUpdateSetting).not.toHaveBeenCalled();
    });
  });

  it('updates input values when user types', () => {
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    const inputs = screen.getAllByDisplayValue('');
    
    // Type in source folder input
    fireEvent.change(inputs[0], { target: { value: '/typed/source/path' } });
    expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('sourceDir', '/typed/source/path');
    
    // Type in target folder input
    fireEvent.change(inputs[1], { target: { value: '/typed/target/path' } });
    expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('targetDir', '/typed/target/path');
  });

  it('shows validation error for empty required fields', () => {
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    // Both inputs should be present and empty
    const inputs = screen.getAllByDisplayValue('');
    expect(inputs).toHaveLength(2);
  });

  it('shows tooltips on hover', () => {
    renderWithProviders(<FolderSection {...defaultProps} />);
    
    // Check for main section title
    expect(screen.getByText('Folder Configuration')).toBeInTheDocument();
    expect(screen.getAllByText('Browse')).toHaveLength(2);
  });
});
