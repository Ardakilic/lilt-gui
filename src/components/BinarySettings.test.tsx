import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { invoke } from '@tauri-apps/api/tauri';
import BinarySettings from './BinarySettings';
import { LiltConfig } from '../types/index';

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Tauri API
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn(),
}));

describe('BinarySettings Component', () => {
  const mockOnConfigChange = vi.fn();

  const defaultConfig: LiltConfig = {
    liltPath: '',
    soxPath: '',
    soxNgPath: '',
    ffmpegPath: '',
    ffprobePath: '',
    useDocker: false,
    dockerImage: 'ardakilic/sox_ng:latest',
    sourceDir: '',
    targetDir: '',
    copyImages: true,
    noPreserveMetadata: false,
    enforceOutputFormat: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the binary settings form', () => {
    render(
      <BinarySettings
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />,
    );

    expect(screen.getByText('settings.binaries')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => {
        return element?.textContent === 'settings.lilt_path *';
      }),
    ).toBeInTheDocument();
  });

  it('shows lilt path input always', () => {
    render(
      <BinarySettings
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />,
    );

    const liltInput = screen.getByPlaceholderText('settings.lilt_path');
    expect(liltInput).toBeInTheDocument();
  });

  it('shows additional binary path inputs when Docker is disabled', () => {
    render(
      <BinarySettings
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />,
    );

    expect(
      screen.getByPlaceholderText('settings.sox_path'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('settings.ffmpeg_path'),
    ).toBeInTheDocument();
  });

  it('hides additional binary path inputs when Docker is enabled', () => {
    render(
      <BinarySettings
        config={{ ...defaultConfig, useDocker: true }}
        onConfigChange={mockOnConfigChange}
      />,
    );

    expect(
      screen.queryByPlaceholderText('settings.sox_path'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('settings.ffmpeg_path'),
    ).not.toBeInTheDocument();
  });

  it('calls identify binaries when button is clicked', async () => {
    const mockInvoke = vi.mocked(invoke);
    mockInvoke.mockResolvedValue('/usr/bin/lilt');

    render(
      <BinarySettings
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />,
    );

    const identifyButtons = screen.getAllByText('settings.identify');
    if (identifyButtons.length > 0) {
      fireEvent.click(identifyButtons[0]);
      expect(mockInvoke).toHaveBeenCalledWith('find_binary_in_path', {
        binaryName: 'lilt',
      });
    }
  });

  it('updates lilt path when input changes', () => {
    render(
      <BinarySettings
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
      />,
    );

    const liltInput = screen.getByPlaceholderText('settings.lilt_path');
    fireEvent.change(liltInput, { target: { value: '/custom/lilt' } });

    expect(mockOnConfigChange).toHaveBeenCalledWith({
      liltPath: '/custom/lilt',
    });
  });
});
