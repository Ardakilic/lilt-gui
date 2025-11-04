import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import * as AppModule from '../wailsjs/go/main/App';

vi.mock('../wailsjs/go/main/App');

describe('App', () => {
  it('renders loading state initially', () => {
    vi.spyOn(AppModule, 'LoadConfig').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<App />);
    expect(screen.getByRole('progressbar', { hidden: true })).toBeTruthy();
  });

  it('loads config on mount', async () => {
    const mockConfig = {
      lastConfig: {
        liltBinary: '/usr/bin/lilt',
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

    vi.spyOn(AppModule, 'LoadConfig').mockResolvedValue(mockConfig);

    render(<App />);

    // Wait for config to load
    await screen.findByText(/Lilt GUI/i);
    expect(AppModule.LoadConfig).toHaveBeenCalled();
  });
});
