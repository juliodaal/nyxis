import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AIProviderSelector } from './ai-provider-selector.js';

describe('AIProviderSelector', () => {
  it('renders a button trigger with the current provider', () => {
    render(<AIProviderSelector />);
    expect(screen.getByRole('button', { name: /Provider:/ })).toBeInTheDocument();
  });

  it('reflects the controlled value in the trigger label', () => {
    render(<AIProviderSelector value="openai" onValueChange={() => undefined} />);
    expect(screen.getByRole('button', { name: /OpenAI/i })).toBeInTheDocument();
  });

  it('still renders when only a subset of providers is allowed', () => {
    render(<AIProviderSelector providers={['anthropic', 'openai']} />);
    expect(screen.getByRole('button', { name: /Provider:/ })).toBeInTheDocument();
  });

  it('disables the trigger when disabled', () => {
    render(<AIProviderSelector disabled />);
    expect(screen.getByRole('button', { name: /Provider:/ })).toBeDisabled();
  });

  it('keeps the onValueChange callback referenced (smoke)', () => {
    const onValueChange = vi.fn();
    render(<AIProviderSelector defaultValue="anthropic" onValueChange={onValueChange} />);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
