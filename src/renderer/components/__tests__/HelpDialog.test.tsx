import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import i18n from '../../i18n/i18n';
import { theme } from '../../styles/theme';
import { HelpDialog } from '../HelpDialog';

// Mock electron API
const mockElectronAPI = {
  openExternal: jest.fn(),
};

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
    </ThemeProvider>
  );
};

describe('HelpDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to suppress expected error messages in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders help dialog when open', () => {
    renderWithProviders(<HelpDialog {...defaultProps} />);

    // Check for actual translated content
    expect(screen.getByText('About Lilt GUI')).toBeInTheDocument();
    expect(screen.getByText('What is Lilt GUI?')).toBeInTheDocument();
    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('How to Use')).toBeInTheDocument();
    expect(screen.getByText('About the Author')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(<HelpDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('About Lilt GUI')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    renderWithProviders(<HelpDialog {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    renderWithProviders(<HelpDialog {...defaultProps} onClose={onClose} />);

    const overlay = screen.getByTestId('help-dialog-overlay');
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when dialog content is clicked', () => {
    const onClose = jest.fn();
    renderWithProviders(<HelpDialog {...defaultProps} onClose={onClose} />);

    const dialogContent = screen.getByText('About Lilt GUI');
    fireEvent.click(dialogContent);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders all help sections', () => {
    renderWithProviders(<HelpDialog {...defaultProps} />);

    // Check that all main sections are present
    expect(screen.getByText('What is Lilt GUI?')).toBeInTheDocument();
    expect(screen.getByText('Key Features')).toBeInTheDocument();
    expect(screen.getByText('How to Use')).toBeInTheDocument();
    expect(screen.getByText('About the Author')).toBeInTheDocument();

    // Check that feature items are present
    expect(screen.getByText('Modern interface with dark/light theme support')).toBeInTheDocument();
    expect(
      screen.getByText('Built-in Docker integration for hassle-free transcoding')
    ).toBeInTheDocument();
    expect(screen.getByText('Support for FLAC, ALAC, and MP3 output formats')).toBeInTheDocument();

    // Check that usage steps are present
    expect(screen.getByText('1. Configure binary paths or enable Docker mode')).toBeInTheDocument();
    expect(
      screen.getByText('2. Select source folder containing your audio files')
    ).toBeInTheDocument();
    expect(screen.getByText('3. Choose target folder for converted files')).toBeInTheDocument();
  });

  it('opens external links when clicked', () => {
    renderWithProviders(<HelpDialog {...defaultProps} />);

    // Find a link (GitHub link in author section)
    const githubLink = screen.getByText('github.com/Ardakilic');
    fireEvent.click(githubLink);

    expect(mockElectronAPI.openExternal).toHaveBeenCalledWith('https://github.com/Ardakilic');
  });

  it('opens project links when clicked', () => {
    renderWithProviders(<HelpDialog {...defaultProps} />);

    // Find project link
    const projectLink = screen.getByText('github.com/Ardakilic/lilt-gui');
    fireEvent.click(projectLink);

    expect(mockElectronAPI.openExternal).toHaveBeenCalledWith(
      'https://github.com/Ardakilic/lilt-gui'
    );
  });

  it('opens lilt project link when clicked', () => {
    renderWithProviders(<HelpDialog {...defaultProps} />);

    // Find lilt project link
    const liltLink = screen.getByText('github.com/Ardakilic/lilt');
    fireEvent.click(liltLink);

    expect(mockElectronAPI.openExternal).toHaveBeenCalledWith('https://github.com/Ardakilic/lilt');
  });
});
