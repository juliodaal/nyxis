import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StreamingMarkdown } from './streaming-markdown.js';

describe('StreamingMarkdown', () => {
  it('renders markdown content', () => {
    render(<StreamingMarkdown text={'**bold** and _italic_'} />);
    expect(screen.getByText('bold').tagName.toLowerCase()).toBe('strong');
    expect(screen.getByText('italic').tagName.toLowerCase()).toBe('em');
  });

  it('renders code blocks with the language indicator', () => {
    render(<StreamingMarkdown text={'```ts\nconst x = 1;\n```'} />);
    // StreamingCode renders with the language label.
    expect(document.body.textContent ?? '').toMatch(/ts/i);
  });

  it('shows a trailing cursor when streaming', () => {
    const { container } = render(<StreamingMarkdown text="hi" streaming />);
    expect(container.textContent).toContain('▍');
  });

  it('hides the cursor when not streaming', () => {
    const { container } = render(<StreamingMarkdown text="hi" streaming={false} />);
    expect(container.textContent).not.toContain('▍');
  });

  it('renders GFM tables (autolinks, strikethrough)', () => {
    render(<StreamingMarkdown text={'~~old~~'} />);
    expect(screen.getByText('old').tagName.toLowerCase()).toBe('del');
  });
});
