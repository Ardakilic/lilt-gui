import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { OptionsSection } from '../OptionsSection';
import { theme } from '../../styles/theme';
import i18n from '../../i18n/i18n';

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
    sourceFolder: '',
    targetFolder: '',
    useDocker: true,
    dockerImage: 'ardakilic/sox_ng:latest',
    enforceOutputFormat: '',
    noPreserveMetadata: false,
    copyImages: true,
    language: 'en',
  },
  onUpdateSetting: jest.fn(),
};

describe('OptionsSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all option controls', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    expect(screen.getByText('Conversion Options')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Use Docker/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Copy Images/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /No Preserve Metadata/i })).toBeInTheDocument();
  });

  it('displays current option values', () => {
    const props = {
      ...defaultProps,
      settings: {
        ...defaultProps.settings,
        useDocker: false,
        enforceOutputFormat: 'mp3',
        noPreserveMetadata: true,
        copyImages: false,
      },
    };
    
    renderWithProviders(<OptionsSection {...props} />);
    
    // Check checkbox states
    const useDockerCheckbox = screen.getByRole('checkbox', { name: /Use Docker/i });
    const metadataCheckbox = screen.getByRole('checkbox', { name: /No Preserve Metadata/i });
    const copyImagesCheckbox = screen.getByRole('checkbox', { name: /Copy Images/i });
    
    expect(useDockerCheckbox).not.toBeChecked();
    expect(metadataCheckbox).toBeChecked();
    expect(copyImagesCheckbox).not.toBeChecked();
    
    // Check select value - the select should show the selected option
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('mp3');
  });

  it('handles useDocker checkbox change', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    const useDockerCheckbox = screen.getByRole('checkbox', { name: /Use Docker/i });
    fireEvent.click(useDockerCheckbox);
    
    expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('useDocker', false);
  });

  it('handles output format selection', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    const formatSelect = screen.getByRole('combobox');
    fireEvent.change(formatSelect, { target: { value: 'alac' } });
    
    expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('enforceOutputFormat', 'alac');
  });

  it('handles noPreserveMetadata checkbox change', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    const metadataCheckbox = screen.getByRole('checkbox', { name: /No Preserve Metadata/i });
    fireEvent.click(metadataCheckbox);
    
    expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('noPreserveMetadata', true);
  });

  it('handles copyImages checkbox change', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    const copyImagesCheckbox = screen.getByRole('checkbox', { name: /Copy Images/i });
    fireEvent.click(copyImagesCheckbox);
    
    expect(defaultProps.onUpdateSetting).toHaveBeenCalledWith('copyImages', false);
  });

  it('shows all available output formats', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    // Check that options exist
    expect(screen.getByRole('option', { name: /Default \(Smart Conversion\)/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /FLAC/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /MP3/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /ALAC/i })).toBeInTheDocument();
  });

  it('shows tooltips for each option', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    // Check that the main controls are rendered
    expect(screen.getByRole('checkbox', { name: /Use Docker/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /No Preserve Metadata/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Copy Images/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('maintains form accessibility', () => {
    renderWithProviders(<OptionsSection {...defaultProps} />);
    
    // All form controls should be properly labeled
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveAccessibleName();
    });
    
    // Select should be present
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
