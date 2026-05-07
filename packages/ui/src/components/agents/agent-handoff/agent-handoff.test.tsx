import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AgentHandoff } from './agent-handoff.js';
import type { HandoffEvent } from '../../../ai/types.js';

const handoff: HandoffEvent = {
  fromAgentId: 'a1',
  fromAgentName: 'Researcher Rita',
  toAgentId: 'a2',
  toAgentName: 'Coder Carl',
  reason: 'Needs implementation',
  state: 'pending',
};

describe('AgentHandoff', () => {
  it('renders from and to agent names', () => {
    render(<AgentHandoff handoff={handoff} />);
    expect(screen.getByText('Researcher Rita')).toBeInTheDocument();
    expect(screen.getByText('Coder Carl')).toBeInTheDocument();
  });

  it('renders reason in default (non-compact) mode', () => {
    render(<AgentHandoff handoff={handoff} />);
    expect(screen.getByText(/Needs implementation/)).toBeInTheDocument();
  });

  it('renders the lifecycle pill with state text', () => {
    const { rerender } = render(<AgentHandoff handoff={{ ...handoff, state: 'pending' }} />);
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    rerender(<AgentHandoff handoff={{ ...handoff, state: 'accepted' }} />);
    expect(screen.getByText(/accepted/i)).toBeInTheDocument();
    rerender(<AgentHandoff handoff={{ ...handoff, state: 'rejected' }} />);
    expect(screen.getByText(/rejected/i)).toBeInTheDocument();
  });

  it('hides status when hideStatus', () => {
    render(<AgentHandoff handoff={handoff} hideStatus />);
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
  });

  it('hides reason in compact mode', () => {
    render(<AgentHandoff handoff={handoff} compact />);
    expect(screen.queryByText(/Needs implementation/)).not.toBeInTheDocument();
  });
});
