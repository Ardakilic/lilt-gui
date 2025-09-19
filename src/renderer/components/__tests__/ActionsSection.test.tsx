import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import i18n from '../../i18n/i18n';
import { theme } from '../../styles/theme';
import { ActionsSection } from '../ActionsSection';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
    </ThemeProvider>
  );
};

describe('ActionsSection Component', () => {
  const defaultProps = {
    isProcessRunning: false,
    onStart: jest.fn(),
    onStop: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders start and stop buttons', () => {
    renderWithProviders(<ActionsSection {...defaultProps} />);

    expect(screen.getByText(/Start Transcoding/i)).toBeInTheDocument();
    expect(screen.getByText(/Stop Transcoding/i)).toBeInTheDocument();
  });

  it('enables start button when process is not running', () => {
    renderWithProviders(<ActionsSection {...defaultProps} isProcessRunning={false} />);

    const startButton = screen.getByText(/Start Transcoding/i);
    expect(startButton).not.toBeDisabled();
  });

  it('disables start button when process is running', () => {
    renderWithProviders(<ActionsSection {...defaultProps} isProcessRunning={true} />);

    const startButton = screen.getByText(/Start Transcoding/i);
    expect(startButton).toBeDisabled();
  });

  it('disables stop button when process is not running', () => {
    renderWithProviders(<ActionsSection {...defaultProps} isProcessRunning={false} />);

    const stopButton = screen.getByText(/Stop Transcoding/i);
    expect(stopButton).toBeDisabled();
  });

  it('enables stop button when process is running', () => {
    renderWithProviders(<ActionsSection {...defaultProps} isProcessRunning={true} />);

    const stopButton = screen.getByText(/Stop Transcoding/i);
    expect(stopButton).not.toBeDisabled();
  });

  it('calls onStart when start button is clicked', () => {
    const onStart = jest.fn();
    renderWithProviders(<ActionsSection {...defaultProps} onStart={onStart} />);

    const startButton = screen.getByText(/Start Transcoding/i);
    fireEvent.click(startButton);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when stop button is clicked', () => {
    const onStop = jest.fn();
    renderWithProviders(
      <ActionsSection {...defaultProps} onStop={onStop} isProcessRunning={true} />
    );

    const stopButton = screen.getByText(/Stop Transcoding/i);
    fireEvent.click(stopButton);

    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('shows running status when process is running', () => {
    renderWithProviders(<ActionsSection {...defaultProps} isProcessRunning={true} />);

    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('shows ready status when process is not running', () => {
    renderWithProviders(<ActionsSection {...defaultProps} isProcessRunning={false} />);

    expect(screen.getByText('Ready')).toBeInTheDocument();
  });
});
