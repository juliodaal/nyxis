import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea.js';

describe('Textarea', () => {
  it('renders as a textarea element', () => {
    render(<Textarea aria-label="notes" />);
    const el = screen.getByLabelText('notes');
    expect(el.tagName).toBe('TEXTAREA');
  });
});
