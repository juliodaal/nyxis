import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AIHaloBorder } from './ai-halo-border.js';

describe('AIHaloBorder', () => {
  it('renders children inside the border', () => {
    render(
      <AIHaloBorder>
        <span>inner</span>
      </AIHaloBorder>,
    );

    expect(screen.getByText('inner')).toBeInTheDocument();
  });

  it('marks the root with data-active when active=true', () => {
    const { container } = render(
      <AIHaloBorder>
        <span>x</span>
      </AIHaloBorder>,
    );

    expect(container.firstChild).toHaveAttribute('data-active');
  });

  it('omits data-active when active=false', () => {
    const { container } = render(
      <AIHaloBorder active={false}>
        <span>x</span>
      </AIHaloBorder>,
    );

    expect(container.firstChild).not.toHaveAttribute('data-active');
  });

  it('applies custom thickness and radius via inline style', () => {
    const { container } = render(
      <AIHaloBorder thickness={4} radius={20}>
        <span>x</span>
      </AIHaloBorder>,
    );

    const root = container.firstChild as HTMLElement;
    expect(root.style.padding).toBe('4px');
    expect(root.style.borderRadius).toBe('20px');
  });
});
