import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { BinarySection } from '../BinarySection';
import { theme } from '../../styles/theme';
import i18n from '../../i18n/i18n';

const mockElectronAPI = {
  selectFile: jest.fn(),
  identifyBinary: jest.fn(),
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

describe('BinarySection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to suppress expected error messages in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all binary path inputs', () => {
    renderWithProviders(<BinarySection {...defaultProps} />);
    
    const inputs = screen.getAllByDisplayValue('');
    expect(inputs).toHaveLength(4); // Should have 4 binary inputs
    expect(screen.getByText('Binary Configuration')).toBeInTheDocument();
    expect(screen.getByText(/Lilt Binary/)).toBeInTheDocument();
    expect(screen.getByText(/SoX Binary/)).toBeInTheDocument();
    expect(screen.getByText(/FFmpeg Binary/)).toBeInTheDocument();
    expect(screen.getByText(/FFprobe Binary/)).toBeInTheDocument();
  });

  it('disables Sox/FFmpeg inputs when useDocker is true', () => {
    const props = {
      ...defaultProps,
      settings: { ...defaultProps.settings, useDocker: true }
    };
    renderWithProviders(<BinarySection {...props} />);
    
    const inputs = screen.getAllByDisplayValue('');
    // First input is Lilt (enabled), others should be disabled
    expect(inputs[0]).not.toBeDisabled();
    expect(inputs[1]).toBeDisabled(); // Sox
    expect(inputs[2]).toBeDisabled(); // FFmpeg  
    expect(inputs[3]).toBeDisabled(); // FFprobe
  });

  it('enables all inputs when useDocker is false', () => {
    const props = {
      ...defaultProps,
      settings: { ...defaultProps.settings, useDocker: false }
    };
    renderWithProviders(<BinarySection {...props} />);
    
    const inputs = screen.getAllByDisplayValue('');
    inputs.forEach(input => {
      expect(input).not.toBeDisabled();
    });
  });

  it('handles file selection for Lilt binary', async () => {
    mockElectronAPI.selectFile.mockResolvedValue('/path/to/lilt');
    
    renderWithProviders(<BinarySection {...defaultProps} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[0]); // First browse button (Lilt)
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFile).toHaveBeenCalledWith([
        { name: 'Executable Files', extensions: ['exe', ''] },
        { name: 'All Files', extensions: ['*'] }
      ]);
      expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('liltBinaryPath', '/path/to/lilt');
    });
  });

  it('handles binary identification for Lilt', async () => {
    mockElectronAPI.identifyBinary.mockResolvedValue({ isAvailable: true, path: '/usr/local/bin/lilt' });
    
    renderWithProviders(<BinarySection {...defaultProps} />);
    
    const identifyButtons = screen.getAllByText('Identify');
    fireEvent.click(identifyButtons[0]); // First identify button (Lilt)
    
    await waitFor(() => {
      expect(mockElectronAPI.identifyBinary).toHaveBeenCalledWith('lilt');
      expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('liltBinaryPath', '/usr/local/bin/lilt');
    });
  });

  it('handles Sox binary selection when Docker is disabled', async () => {
    mockElectronAPI.selectFile.mockResolvedValue('/path/to/sox');
    
    const props = {
      ...defaultProps,
      settings: { ...defaultProps.settings, useDocker: false }
    };
    renderWithProviders(<BinarySection {...props} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[1]); // Second browse button (Sox)
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFile).toHaveBeenCalled();
      expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('soxBinaryPath', '/path/to/sox');
    });
  });

  it('handles FFmpeg binary identification when Docker is disabled', async () => {
    mockElectronAPI.identifyBinary.mockResolvedValue({ isAvailable: true, path: '/usr/local/bin/ffmpeg' });
    
    const props = {
      ...defaultProps,
      settings: { ...defaultProps.settings, useDocker: false }
    };
    renderWithProviders(<BinarySection {...props} />);
    
    const identifyButtons = screen.getAllByText('Identify');
    fireEvent.click(identifyButtons[2]); // Third identify button (FFmpeg)
    
    await waitFor(() => {
      expect(mockElectronAPI.identifyBinary).toHaveBeenCalledWith('ffmpeg');
      expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('ffmpegBinaryPath', '/usr/local/bin/ffmpeg');
    });
  });

  it('handles errors during file selection', async () => {
    mockElectronAPI.selectFile.mockRejectedValue(new Error('Selection cancelled'));
    
    renderWithProviders(<BinarySection {...defaultProps} />);
    
    const browseButtons = screen.getAllByText('Browse');
    fireEvent.click(browseButtons[0]);
    
    await waitFor(() => {
      expect(mockElectronAPI.selectFile).toHaveBeenCalled();
      // Should not call onChange on error
      expect(defaultProps.onUpdateSetting).not.toHaveBeenCalled();
    });
  });

  it('handles errors during binary identification', async () => {
    mockElectronAPI.identifyBinary.mockRejectedValue(new Error('Binary not found'));
    
    renderWithProviders(<BinarySection {...defaultProps} />);
    
    const identifyButtons = screen.getAllByText('Identify');
    fireEvent.click(identifyButtons[0]);
    
    await waitFor(() => {
      expect(mockElectronAPI.identifyBinary).toHaveBeenCalled();
      // Should not call onChange on error
      expect(defaultProps.onUpdateSetting).not.toHaveBeenCalled();
    });
  });

  it('displays current binary paths', () => {
    const props = {
      ...defaultProps,
      settings: {
        ...defaultProps.settings,
        liltBinaryPath: '/path/to/lilt',
        soxBinaryPath: '/path/to/sox',
        ffmpegBinaryPath: '/path/to/ffmpeg',
        ffprobeBinaryPath: '/path/to/ffprobe',
        useDocker: false,
      },
    };
    
    renderWithProviders(<BinarySection {...props} />);
    
    expect(screen.getByDisplayValue('/path/to/lilt')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/path/to/sox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/path/to/ffmpeg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/path/to/ffprobe')).toBeInTheDocument();
  });
});
