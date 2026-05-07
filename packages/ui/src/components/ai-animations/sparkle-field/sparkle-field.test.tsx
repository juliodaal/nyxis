import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { SparkleField } from './sparkle-field.js';

function setMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('SparkleField', () => {
  beforeEach(() => {
    setMatchMedia(false);
  });

  it('renders children above the sparkle layer', () => {
    render(
      <SparkleField>
        <button>Click me</button>
      </SparkleField>,
    );

    const button = screen.getByRole('button', { name: /Click me/i });
    expect(button).toBeInTheDocument();

    // The wrapper around children has z-10
    const childWrapper = button.parentElement;
    expect(childWrapper?.className).toMatch(/z-10/);
  });

  it('renders static stars when prefers-reduced-motion is enabled', () => {
    setMatchMedia(true);
    const { container } = render(<SparkleField density={6} />);

    // Reduced-motion path renders some static svgs
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('forwards className to the root', () => {
    const { container } = render(<SparkleField className="custom-cls" />);

    expect(container.firstChild).toHaveClass('custom-cls');
  });
});
