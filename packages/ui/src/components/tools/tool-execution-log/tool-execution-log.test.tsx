import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ToolExecutionLog, type ToolExecution } from './tool-execution-log.js';

const NOW = new Date('2024-01-01T12:34:56Z');

const EXECUTIONS: readonly ToolExecution[] = [
  {
    id: 'a',
    name: 'search_documents',
    args: { q: 'cats' },
    result: { hits: 3 },
    status: 'completed',
    startedAt: NOW,
    durationMs: 250,
  },
  {
    id: 'b',
    name: 'fetch_url',
    args: { url: 'https://example.com' },
    status: 'running',
    startedAt: NOW,
  },
  {
    id: 'c',
    name: 'send_email',
    error: 'rate limited',
    status: 'errored',
    startedAt: NOW,
  },
];

describe('ToolExecutionLog', () => {
  it('renders an empty state when no executions are passed', () => {
    render(<ToolExecutionLog executions={[]} />);

    expect(screen.getByText('No tool calls yet.')).toBeInTheDocument();
  });

  it('renders all execution rows with their tool names', () => {
    render(<ToolExecutionLog executions={EXECUTIONS} />);

    expect(screen.getByText('search_documents')).toBeInTheDocument();
    expect(screen.getByText('fetch_url')).toBeInTheDocument();
    expect(screen.getByText('send_email')).toBeInTheDocument();
  });

  it('renders status badges from the underlying ToolCall', () => {
    render(<ToolExecutionLog executions={EXECUTIONS} />);

    expect(screen.getByText('done')).toBeInTheDocument();
    expect(screen.getByText('running')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
  });

  it('collapses with a +N footer when limit is below the total', () => {
    render(<ToolExecutionLog executions={EXECUTIONS} limit={1} />);

    expect(screen.getByText('search_documents')).toBeInTheDocument();
    expect(screen.queryByText('fetch_url')).not.toBeInTheDocument();
    expect(screen.getByText(/\+\s*2 more execution/i)).toBeInTheDocument();
  });

  it('renders a custom empty state when provided', () => {
    render(<ToolExecutionLog executions={[]} emptyState={<span>nothing yet</span>} />);

    expect(screen.getByText('nothing yet')).toBeInTheDocument();
  });
});
