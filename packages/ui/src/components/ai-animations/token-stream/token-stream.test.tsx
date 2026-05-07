import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

import { TokenStream } from './token-stream.js';

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

describe('TokenStream', () => {
  beforeEach(() => {
    setMatchMedia(false);
  });

  it('renders without crashing when active=true', () => {
    const { container } = render(<TokenStream active />);

    expect(container.firstChild).toBeTruthy();
  });

  it('renders without crashing when active=false', () => {
    const { container } = render(<TokenStream active={false} />);

    expect(container.firstChild).toBeTruthy();
  });

  it('applies the height prop via inline style', () => {
    const { container } = render(<TokenStream height={48} />);

    const root = container.firstChild as HTMLElement;
    expect(root.style.height).toBe('48px');
  });

  it('forwards className to the root', () => {
    const { container } = render(<TokenStream className="ts-cls" />);

    expect(container.firstChild).toHaveClass('ts-cls');
  });
});
