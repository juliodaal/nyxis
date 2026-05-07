import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StreamingText } from './streaming-text.js';

describe('StreamingText', () => {
  it('renders the supplied text', () => {
    render(<StreamingText text="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('shows the cursor while streaming', () => {
    const { container } = render(<StreamingText text="hi" streaming />);
    expect(container.textContent).toContain('▍');
  });

  it('hides the cursor when not streaming', () => {
    const { container } = render(<StreamingText text="hi" streaming={false} />);
    expect(container.textContent).not.toContain('▍');
  });

  it('honours a custom cursor', () => {
    const { container } = render(<StreamingText text="hi" cursor="█" streaming />);
    expect(container.textContent).toContain('█');
  });
});
