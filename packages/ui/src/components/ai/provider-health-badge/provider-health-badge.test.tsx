import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ProviderHealthBadge } from './provider-health-badge.js';

describe('ProviderHealthBadge', () => {
  it('renders the operational label', () => {
    render(<ProviderHealthBadge status="operational" />);
    expect(screen.getByText('Operational')).toBeInTheDocument();
  });

  it.each([
    ['operational', 'Operational'],
    ['degraded', 'Degraded'],
    ['down', 'Down'],
    ['unknown', 'Unknown'],
  ] as const)('shows the %s label', (status, label) => {
    render(<ProviderHealthBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('shows latency when provided', () => {
    render(<ProviderHealthBadge status="operational" latencyMs={210} />);
    expect(screen.getByText('210ms')).toBeInTheDocument();
  });

  it('hides label when compact', () => {
    render(<ProviderHealthBadge status="degraded" compact />);
    expect(screen.queryByText('Degraded')).not.toBeInTheDocument();
  });

  it('exposes a data-status attribute for styling hooks', () => {
    const { container } = render(<ProviderHealthBadge status="down" />);
    expect(container.firstChild).toHaveAttribute('data-status', 'down');
  });
});
