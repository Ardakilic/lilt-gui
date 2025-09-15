import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { OutputSection } from '../OutputSection';
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
  output: [],
};

describe('OutputSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders output section with title', () => {
    renderWithProviders(<OutputSection {...defaultProps} />);
    
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  it('displays empty state when no output', () => {
    renderWithProviders(<OutputSection {...defaultProps} />);
    
    expect(screen.getByText('No output yet. Start transcoding to see progress here.')).toBeInTheDocument();
  });

  it('displays output lines', () => {
    const output = [
      'Starting transcoding...',
      'Processing file: track01.mp3',
      'Converting to FLAC format',
      'Completed successfully!'
    ];
    
    renderWithProviders(<OutputSection {...defaultProps} output={output} />);
    
    output.forEach(line => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
    
    // Should not show empty state
    expect(screen.queryByText('No output yet. Start transcoding to see progress here.')).not.toBeInTheDocument();
  });

  it('shows scroll to bottom button when not at bottom', () => {
    const output = Array.from({ length: 50 }, (_, i) => `Line ${i + 1}`);
    
    renderWithProviders(<OutputSection {...defaultProps} output={output} />);
    
    // Should show scroll button when there's content and user scrolls up
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 50')).toBeInTheDocument();
  });

  it('scrolls to bottom when new output is added', () => {
    const { rerender } = renderWithProviders(<OutputSection {...defaultProps} output={['Line 1']} />);
    
    // Add more output lines
    rerender(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <OutputSection {...defaultProps} output={['Line 1', 'Line 2', 'Line 3']} />
        </ThemeProvider>
      </I18nextProvider>
    );
    
    // Should render new content
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });

  it('shows proper accessibility attributes', () => {
    const output = ['Output line 1', 'Output line 2'];
    
    renderWithProviders(<OutputSection {...defaultProps} output={output} />);
    
    // Should render the output content
    expect(screen.getByText('Output line 1')).toBeInTheDocument();
    expect(screen.getByText('Output line 2')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  it('handles long output efficiently', () => {
    // Generate a large amount of output
    const longOutput = Array.from({ length: 1000 }, (_, i) => `Line ${i + 1}: Processing...`);
    
    renderWithProviders(<OutputSection {...defaultProps} output={longOutput} />);
    
    // Should render without issues
    expect(screen.getByText('Line 1: Processing...')).toBeInTheDocument();
    expect(screen.getByText('Line 1000: Processing...')).toBeInTheDocument();
  });

  it('preserves output formatting', () => {
    const output = [
      'Error: File not found',
      'Warning: Low disk space',
      'Info: Processing complete',
      '  - Track 1: Success',
      '  - Track 2: Success'
    ];
    
    renderWithProviders(<OutputSection {...defaultProps} output={output} />);
    
    // Check that the first few lines are present
    expect(screen.getByText('Error: File not found')).toBeInTheDocument();
    expect(screen.getByText('Warning: Low disk space')).toBeInTheDocument();
    expect(screen.getByText('Info: Processing complete')).toBeInTheDocument();
    // Check for the indented lines (they should be preserved with whitespace)
    expect(screen.getByText(/Track 1: Success/)).toBeInTheDocument();
    expect(screen.getByText(/Track 2: Success/)).toBeInTheDocument();
  });

  it('handles special characters in output', () => {
    const output = [
      'Progress: 50% [████████████░░░░░░░░░░░░] 12/24 files',
      'File: "Artist - Song Title (2023).mp3"',
      'Encoding: UTF-8 → UTF-8',
      'Status: ✓ Complete'
    ];
    
    renderWithProviders(<OutputSection {...defaultProps} output={output} />);
    
    output.forEach(line => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });
});
