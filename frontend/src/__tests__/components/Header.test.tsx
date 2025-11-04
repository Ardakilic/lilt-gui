import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import type { main } from '../../wailsjs/go/models';

const mockOnSaveConfig = () => {};

const mockConfigData: main.ConfigData = {
  lastConfig: {
    liltBinary: '',
    soxBinary: '',
    soxNgBinary: '',
    ffmpegBinary: '',
    ffprobeBinary: '',
    useDocker: true,
    outputFormat: 'flac',
    noPreserveMetadata: false,
    copyImages: true,
    sourceDir: '',
    targetDir: '',
  },
  language: 'en',
};

describe('Header', () => {
  it('renders app title', () => {
    render(<Header onSaveConfig={mockOnSaveConfig} currentLanguage="en" />);
    expect(screen.getByText(/Lilt GUI/i)).toBeTruthy();
  });

  it('renders help button', () => {
    render(<Header onSaveConfig={mockOnSaveConfig} currentLanguage="en" />);
    expect(screen.getByText(/Help/i)).toBeTruthy();
  });

  it('renders download lilt button', () => {
    render(<Header onSaveConfig={mockOnSaveConfig} currentLanguage="en" />);
    expect(screen.getByText(/Download Lilt/i)).toBeTruthy();
  });
});
