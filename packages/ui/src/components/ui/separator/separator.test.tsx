import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from './separator.js';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass('h-px');
  });

  it('renders a vertical separator when requested', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toHaveClass('w-px');
  });
});
