import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ToolCall } from './tool-call.js';

describe('ToolCall', () => {
  it('renders the tool name with the default pending status', () => {
    const { container } = render(<ToolCall name="search_documents" />);

    expect(screen.getByText('search_documents')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-status', 'pending');
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('renders the appropriate badge label for each status', () => {
    const { rerender, container } = render(<ToolCall name="t" status="running" />);
    expect(screen.getByText('running')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-status', 'running');

    rerender(<ToolCall name="t" status="completed" />);
    expect(screen.getByText('done')).toBeInTheDocument();

    rerender(<ToolCall name="t" status="errored" />);
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('expands the args block when the trigger is clicked', () => {
    render(<ToolCall name="search" args={{ query: 'cats' }} />);

    const trigger = screen.getByRole('button', { name: /search/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/Arguments/i)).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Arguments/i)).toBeInTheDocument();
    expect(screen.getByText(/"query": "cats"/)).toBeInTheDocument();
  });

  it('renders pre-expanded when defaultOpen is true', () => {
    render(<ToolCall name="search" args={{ q: 1 }} defaultOpen />);

    expect(screen.getByText(/Arguments/i)).toBeInTheDocument();
  });

  it('disables the trigger when there are no args', () => {
    render(<ToolCall name="ping" />);

    const trigger = screen.getByRole('button', { name: /ping/i });
    expect(trigger).toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  it('renders the duration once a status is past pending', () => {
    render(<ToolCall name="t" status="completed" durationMs={420} />);

    expect(screen.getByText('420ms')).toBeInTheDocument();
  });

  it('applies a smaller padding when compact', () => {
    render(<ToolCall name="ping" compact />);

    const trigger = screen.getByRole('button', { name: /ping/i });
    expect(trigger.className).toMatch(/py-1\.5/);
    expect(trigger.className).toMatch(/text-xs/);
  });
});
