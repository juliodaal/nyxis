import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge.js';

describe('Badge', () => {
  it('renders the label', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders a status dot when dot is true', () => {
    const { container } = render(<Badge dot>Live</Badge>);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
