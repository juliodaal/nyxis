import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { GradientAura } from './gradient-aura.js';

describe('GradientAura', () => {
  it('renders children inside the aura', () => {
    render(
      <GradientAura>
        <button>Hello</button>
      </GradientAura>,
    );

    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });

  it('applies the intensity prop to the aura opacity', () => {
    const { container } = render(
      <GradientAura intensity={0.3}>
        <span>x</span>
      </GradientAura>,
    );

    const aura = container.querySelector('[aria-hidden]') as HTMLElement | null;
    expect(aura).toBeTruthy();
    // intensity 0.3 → opacity "0.3"
    expect(aura!.style.opacity).toBe('0.3');
  });

  it('clamps intensity above 1 to 1', () => {
    const { container } = render(
      <GradientAura intensity={2}>
        <span>x</span>
      </GradientAura>,
    );

    const aura = container.querySelector('[aria-hidden]') as HTMLElement | null;
    expect(aura!.style.opacity).toBe('1');
  });

  it('applies custom colors via the conic gradient', () => {
    const { container } = render(
      <GradientAura colors={['#111111', '#222222', '#333333']}>
        <span>x</span>
      </GradientAura>,
    );

    const aura = container.querySelector('[aria-hidden]') as HTMLElement | null;
    expect(aura!.style.background).toContain('#111111');
    expect(aura!.style.background).toContain('#222222');
    expect(aura!.style.background).toContain('#333333');
  });

  it('marks the aura with data-active when active=true', () => {
    const { container } = render(
      <GradientAura active>
        <span>x</span>
      </GradientAura>,
    );

    const aura = container.querySelector('[aria-hidden]');
    expect(aura).toHaveAttribute('data-active');
  });
});
