import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TooltipWrapper from './TooltipWrapper';

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TooltipWrapper Component', () => {
  it('renders children correctly', () => {
    render(
      <TooltipWrapper content='Test tooltip'>
        <button>Test Button</button>
      </TooltipWrapper>,
    );

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders tooltip content', () => {
    render(
      <TooltipWrapper content='Test tooltip'>
        <button>Test Button</button>
      </TooltipWrapper>,
    );

    expect(screen.getByText('Test tooltip')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <TooltipWrapper content='Test tooltip'>
        <button>Test Button</button>
      </TooltipWrapper>,
    );

    const wrapper = screen.getByText('Test Button').closest('div');
    expect(wrapper).toHaveClass('relative', 'group');
  });
});
