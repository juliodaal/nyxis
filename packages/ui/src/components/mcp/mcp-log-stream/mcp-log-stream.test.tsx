import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { MCPLogEntry } from '../../../ai/types.js';
import { MCPLogStream } from './mcp-log-stream.js';

const NOW = new Date('2024-01-01T12:00:00Z');

const ENTRIES: readonly MCPLogEntry[] = [
  {
    id: '1',
    timestamp: NOW,
    direction: 'out',
    method: 'tools/call',
    payload: { name: 'search', args: { q: 'cats' } },
    level: 'info',
  },
  {
    id: '2',
    timestamp: NOW,
    direction: 'in',
    method: 'tools/result',
    payload: { hits: 3 },
  },
  {
    id: '3',
    timestamp: NOW,
    direction: 'event',
    method: 'notifications/message',
    level: 'warn',
  },
];

describe('MCPLogStream', () => {
  it('renders an empty state when no entries are provided', () => {
    render(<MCPLogStream entries={[]} />);

    expect(screen.getByText('No traffic yet.')).toBeInTheDocument();
  });

  it('renders every entry method when provided', () => {
    render(<MCPLogStream entries={ENTRIES} />);

    expect(screen.getByText('tools/call')).toBeInTheDocument();
    expect(screen.getByText('tools/result')).toBeInTheDocument();
    expect(screen.getByText('notifications/message')).toBeInTheDocument();
  });

  it('collapses older entries with a "+N earlier" footer when limit is set', () => {
    render(<MCPLogStream entries={ENTRIES} limit={1} />);

    expect(screen.getByText('tools/call')).toBeInTheDocument();
    expect(screen.queryByText('tools/result')).not.toBeInTheDocument();
    expect(screen.getByText(/\+\s*2 earlier entr/i)).toBeInTheDocument();
  });

  it('expands a row to reveal the JSON payload', () => {
    render(<MCPLogStream entries={ENTRIES} />);

    const trigger = screen.getByRole('button', { name: /tools\/call/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/"name": "search"/)).toBeInTheDocument();
  });

  it('disables the row when an entry has no payload', () => {
    render(<MCPLogStream entries={ENTRIES} />);

    const noPayloadRow = screen.getByRole('button', {
      name: /notifications\/message/,
    });
    expect(noPayloadRow).toBeDisabled();
    expect(noPayloadRow).not.toHaveAttribute('aria-expanded');
  });
});
