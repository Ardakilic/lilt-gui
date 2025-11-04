import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OutputConsole from '../../components/OutputConsole';

describe('OutputConsole', () => {
  it('renders output console title', () => {
    render(<OutputConsole />);
    expect(screen.getByText(/Output Console/i)).toBeTruthy();
  });

  it('renders placeholder when no output', () => {
    render(<OutputConsole />);
    expect(screen.getByText(/Output will appear here/i)).toBeTruthy();
  });

  it('renders clear button', () => {
    render(<OutputConsole />);
    expect(screen.getByText(/Clear/i)).toBeTruthy();
  });
});
