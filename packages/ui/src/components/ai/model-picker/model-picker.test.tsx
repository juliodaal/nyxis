import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ModelPicker } from './model-picker.js';

describe('ModelPicker', () => {
  it('renders a button trigger', () => {
    render(<ModelPicker />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('reflects the controlled model on the trigger', () => {
    render(<ModelPicker value="claude-sonnet-4-5" />);
    expect(screen.getByRole('button')).toHaveTextContent(/claude/i);
  });

  it('disables the trigger when disabled', () => {
    render(<ModelPicker disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('respects the provider filter without crashing', () => {
    render(<ModelPicker provider="anthropic" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('respects requireCapabilities filter without crashing', () => {
    render(<ModelPicker requireCapabilities={['tools', 'vision']} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
