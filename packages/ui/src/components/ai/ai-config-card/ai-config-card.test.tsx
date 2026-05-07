import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AIConfigCard } from './ai-config-card.js';

describe('AIConfigCard', () => {
  it('renders the composed configuration surface', () => {
    render(<AIConfigCard />);
    // Composes provider + model triggers (buttons) and at least 2 sliders (temperature, top-p).
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole('slider').length).toBeGreaterThanOrEqual(2);
  });

  it('honours hideApiKey', () => {
    const { container } = render(<AIConfigCard hideApiKey />);
    // No password-typed input should be visible.
    expect(container.querySelector('input[type="password"]')).toBeNull();
  });

  it('honours hideSystemPrompt', () => {
    render(<AIConfigCard hideSystemPrompt />);
    expect(screen.queryByText(/^System prompt$/)).not.toBeInTheDocument();
  });

  it('seeds defaultConfig values into the form', () => {
    render(
      <AIConfigCard
        defaultConfig={{
          systemPrompt: 'You are a helpful assistant.',
        }}
      />,
    );
    expect(screen.getByDisplayValue('You are a helpful assistant.')).toBeInTheDocument();
  });
});
