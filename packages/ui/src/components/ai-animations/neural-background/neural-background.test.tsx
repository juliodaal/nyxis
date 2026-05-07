import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { NeuralBackground } from './neural-background.js';

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

describe('NeuralBackground', () => {
  beforeEach(() => {
    setMatchMedia(false);
  });

  it('renders a canvas element', () => {
    const { container } = render(<NeuralBackground />);

    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('renders children above the canvas', () => {
    render(
      <NeuralBackground>
        <h1>Hero</h1>
      </NeuralBackground>,
    );

    expect(screen.getByRole('heading', { name: 'Hero' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<NeuralBackground className="bg-cls" />);

    expect(container.firstChild).toHaveClass('bg-cls');
  });

  it('renders without crashing when animate=false', () => {
    const { container } = render(<NeuralBackground animate={false} />);

    expect(container.querySelector('canvas')).toBeTruthy();
  });
});
