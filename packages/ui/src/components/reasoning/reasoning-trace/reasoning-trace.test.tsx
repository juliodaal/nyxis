import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ReasoningTrace } from './reasoning-trace.js';

describe('ReasoningTrace', () => {
  it('renders the disclosure with default label and shows the summary while collapsed', () => {
    render(<ReasoningTrace text="step one ... step two ..." summary="planning the answer" />);

    const trigger = screen.getByRole('button', { name: /reasoning/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(/planning the answer/i)).toBeInTheDocument();
    // Body is hidden while collapsed.
    expect(screen.queryByText(/step one/i)).not.toBeInTheDocument();
  });

  it('renders the body when defaultOpen is true', () => {
    render(<ReasoningTrace text="visible body content" defaultOpen />);

    const trigger = screen.getByRole('button', { name: /reasoning/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('visible body content')).toBeInTheDocument();
  });

  it('toggles open when the trigger is clicked', () => {
    render(<ReasoningTrace text="lazy body" />);

    const trigger = screen.getByRole('button', { name: /reasoning/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('lazy body')).toBeInTheDocument();
  });

  it('renders the "thinking" badge while streaming', () => {
    render(<ReasoningTrace text="partial..." streaming />);

    expect(screen.getByText(/thinking/i)).toBeInTheDocument();
  });

  it('renders the formatted duration when not streaming', () => {
    render(<ReasoningTrace text="done" durationMs={2400} />);

    // 2400ms => "2.4s"
    expect(screen.getByText('2.4s')).toBeInTheDocument();
  });

  it('hides the duration while streaming is true', () => {
    render(<ReasoningTrace text="partial" streaming durationMs={1200} />);

    expect(screen.queryByText('1.2s')).not.toBeInTheDocument();
  });
});
