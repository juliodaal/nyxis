import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './skeleton.js';

describe('Skeleton', () => {
  it('animates with pulse class', () => {
    const { container } = render(<Skeleton className="h-10 w-40" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
