import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Notification } from '../Notification';
import { theme } from '../../styles/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Notification Component', () => {
  const defaultProps = {
    message: 'Test notification',
    type: 'info' as const,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with message', () => {
    renderWithTheme(<Notification {...defaultProps} />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('shows correct icon for each type', () => {
    const { rerender } = renderWithTheme(<Notification {...defaultProps} type="success" />);
    expect(screen.getByText('✓')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Notification {...defaultProps} type="error" />
      </ThemeProvider>
    );
    // Use getAllByText since both icon and close button have ✕ symbol
    const errorSymbols = screen.getAllByText('✕');
    expect(errorSymbols).toHaveLength(2); // Icon and close button

    rerender(
      <ThemeProvider theme={theme}>
        <Notification {...defaultProps} type="warning" />
      </ThemeProvider>
    );
    expect(screen.getByText('⚠')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Notification {...defaultProps} type="info" />
      </ThemeProvider>
    );
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    renderWithTheme(<Notification {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    // The close handler uses setTimeout, so we need to wait for it
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('auto-closes after specified duration', async () => {
    const onClose = jest.fn();
    renderWithTheme(
      <Notification 
        {...defaultProps} 
        onClose={onClose} 
        autoClose={true} 
        duration={100}
      />
    );
    
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it('does not auto-close when autoClose is false', async () => {
    const onClose = jest.fn();
    renderWithTheme(
      <Notification 
        {...defaultProps} 
        onClose={onClose} 
        autoClose={false}
        duration={100}
      />
    );
    
    // Wait for longer than duration
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(onClose).not.toHaveBeenCalled();
  });
});
