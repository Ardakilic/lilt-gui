import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { Header } from '../Header';
import { theme } from '../../styles/theme';
import i18n from '../../i18n/i18n';

// Mock electron API
const mockElectronAPI = {
  getAppVersion: jest.fn().mockResolvedValue('1.0.0'),
};

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </ThemeProvider>
  );
};

describe('Header Component', () => {
  const defaultProps = {
    onLanguageChange: jest.fn(),
    currentLanguage: 'en',
    onDownloadLilt: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to suppress expected error messages in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders title and version', async () => {
    renderWithProviders(<Header {...defaultProps} />);
    
    expect(screen.getByText('Lilt GUI')).toBeInTheDocument();
    
    // Wait for version to load
    await screen.findByText(/Version 1.0.0/);
    expect(screen.getByText(/Version 1.0.0/)).toBeInTheDocument();
  });

  it('calls onDownloadLilt when download button is clicked', () => {
    const onDownloadLilt = jest.fn();
    renderWithProviders(<Header {...defaultProps} onDownloadLilt={onDownloadLilt} />);
    
    const downloadButton = screen.getByText(/Download Lilt/i);
    fireEvent.click(downloadButton);
    
    expect(onDownloadLilt).toHaveBeenCalledTimes(1);
  });

  it('calls onLanguageChange when language is changed', () => {
    const onLanguageChange = jest.fn();
    renderWithProviders(<Header {...defaultProps} onLanguageChange={onLanguageChange} />);
    
    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'tr' } });
    
    expect(onLanguageChange).toHaveBeenCalledWith('tr');
  });

  it('shows current language as selected', () => {
    renderWithProviders(<Header {...defaultProps} currentLanguage="de" />);
    
    const languageSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(languageSelect.value).toBe('de');
  });
});
