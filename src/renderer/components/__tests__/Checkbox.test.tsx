import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Checkbox } from '../common/Checkbox';
import { theme } from '../../styles/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Checkbox Component', () => {
  it('renders with label', () => {
    renderWithTheme(<Checkbox label="Check me" />);
    expect(screen.getByText('Check me')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders without label', () => {
    renderWithTheme(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('handles check/uncheck', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('can be checked by default', () => {
    renderWithTheme(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('can be disabled', () => {
    renderWithTheme(<Checkbox disabled label="Disabled checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox onChange={handleChange} label="Click me" />);
    
    const label = screen.getByText('Click me');
    fireEvent.click(label);
    
    expect(handleChange).toHaveBeenCalled();
  });
});
