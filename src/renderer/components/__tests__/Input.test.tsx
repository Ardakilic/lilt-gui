import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Input } from '../common/Input';
import { theme } from '../../styles/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Input Component', () => {
  it('renders correctly', () => {
    renderWithTheme(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    renderWithTheme(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('shows error state', () => {
    renderWithTheme(<Input hasError />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('accepts different input types', () => {
    const { rerender } = renderWithTheme(<Input type="text" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Input type="password" />
      </ThemeProvider>
    );
    // Password inputs don't have textbox role, so we query by input element directly
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('can have default value', () => {
    renderWithTheme(<Input defaultValue="default text" />);
    const input = screen.getByDisplayValue('default text');
    expect(input).toBeInTheDocument();
  });
});
