import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { MCPConnectionState } from '../../../ai/types.js';
import { MCPConnectionStatus } from './mcp-connection-status.js';

const STATES: readonly MCPConnectionState[] = ['disconnected', 'connecting', 'connected', 'error'];

describe('MCPConnectionStatus', () => {
  it('renders the canonical label for every state', () => {
    for (const state of STATES) {
      const { unmount } = render(<MCPConnectionStatus state={state} />);
      expect(screen.getByText(state)).toBeInTheDocument();
      unmount();
    }
  });

  it('renders the latency suffix only when connected', () => {
    const { rerender } = render(<MCPConnectionStatus state="connected" latencyMs={42} />);
    expect(screen.getByText(/42ms/)).toBeInTheDocument();

    rerender(<MCPConnectionStatus state="connecting" latencyMs={42} />);
    expect(screen.queryByText(/42ms/)).not.toBeInTheDocument();
  });

  it('uses an explicit label override when provided', () => {
    render(<MCPConnectionStatus state="connected" label="online" />);
    expect(screen.getByText('online')).toBeInTheDocument();
    expect(screen.queryByText('connected')).not.toBeInTheDocument();
  });

  it('hides the text when compact', () => {
    render(<MCPConnectionStatus state="connected" compact latencyMs={42} />);

    expect(screen.queryByText('connected')).not.toBeInTheDocument();
    expect(screen.queryByText(/42ms/)).not.toBeInTheDocument();
    // Still exposes the state via aria-label on role=status.
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'connected');
  });

  it('exposes the state via a data-state attribute', () => {
    const { container } = render(<MCPConnectionStatus state="error" />);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'error');
  });
});
