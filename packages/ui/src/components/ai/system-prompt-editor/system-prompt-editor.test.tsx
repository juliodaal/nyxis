import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { SystemPromptEditor } from './system-prompt-editor.js';

describe('SystemPromptEditor', () => {
  it('renders the textarea with default value', () => {
    render(<SystemPromptEditor defaultValue="You are an assistant." />);
    expect(screen.getByRole('textbox')).toHaveValue('You are an assistant.');
  });

  it('reflects the controlled value', () => {
    render(<SystemPromptEditor value="hello" />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('fires onValueChange on input', () => {
    const onValueChange = vi.fn();
    render(<SystemPromptEditor value="" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New prompt' } });
    expect(onValueChange).toHaveBeenCalledWith('New prompt');
  });

  it('detects {{variables}} and renders chips', () => {
    render(<SystemPromptEditor value={'You are {{role}} for {{company}}.'} />);
    // The textarea also contains the literal {{role}}, so look for the chip
    // specifically inside the utility bar (rendered as a code-style chip).
    const chips = document.querySelectorAll('span.font-mono, code');
    const labels = Array.from(chips).map((c) => c.textContent ?? '');
    expect(labels.some((l) => l.includes('{{role}}'))).toBe(true);
    expect(labels.some((l) => l.includes('{{company}}'))).toBe(true);
  });

  it('hides utility bar when hideUtilityBar', () => {
    render(<SystemPromptEditor value="hi" hideUtilityBar />);
    expect(screen.queryByText(/tokens/)).not.toBeInTheDocument();
  });
});
