import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StreamingCode } from './streaming-code.js';

describe('StreamingCode', () => {
  it('renders the code body', () => {
    render(<StreamingCode code="const x = 1;" language="ts" />);
    expect(document.body.textContent ?? '').toContain('const x = 1;');
  });

  it('shows the language badge', () => {
    render(<StreamingCode code="x" language="tsx" />);
    expect(screen.getByText(/tsx/i)).toBeInTheDocument();
  });

  it('shows the filename when provided', () => {
    render(<StreamingCode code="x" filename="chat.tsx" language="tsx" />);
    expect(screen.getByText('chat.tsx')).toBeInTheDocument();
  });

  it('exposes a copy button when copyable', () => {
    render(<StreamingCode code="x" language="ts" copyable />);
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('hides the copy button when copyable={false}', () => {
    render(<StreamingCode code="x" language="ts" copyable={false} />);
    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
  });

  it('shows a trailing cursor when streaming', () => {
    const { container } = render(<StreamingCode code="x" language="ts" streaming />);
    expect(container.textContent ?? '').toMatch(/▍|█/);
  });
});
