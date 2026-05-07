import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { MCPCapability } from '../../../ai/types.js';
import { MCPCapabilityBadge } from './mcp-capability-badge.js';

const CAPABILITIES: readonly MCPCapability[] = [
  'tools',
  'prompts',
  'resources',
  'sampling',
  'roots',
  'logging',
];

describe('MCPCapabilityBadge', () => {
  it('renders the canonical label for each capability', () => {
    for (const capability of CAPABILITIES) {
      const { unmount } = render(<MCPCapabilityBadge capability={capability} />);
      expect(screen.getByText(capability)).toBeInTheDocument();
      unmount();
    }
  });

  it('exposes the capability via a data attribute', () => {
    const { container } = render(<MCPCapabilityBadge capability="tools" />);
    expect(container.firstElementChild).toHaveAttribute('data-capability', 'tools');
  });

  it('hides the label and shrinks when compact', () => {
    const { container } = render(<MCPCapabilityBadge capability="tools" compact />);

    // Label text is not rendered in compact mode (only the icon + title).
    expect(screen.queryByText('tools', { selector: 'span' })).not.toBeInTheDocument();
    // The wrapper still has a title attribute for tooltip access.
    expect(container.firstElementChild).toHaveAttribute('title', 'tools');
    expect(container.firstElementChild?.className).toMatch(/justify-center/);
  });

  it('mutes the badge when enabled is false', () => {
    const { container } = render(<MCPCapabilityBadge capability="prompts" enabled={false} />);

    const el = container.firstElementChild;
    expect(el?.className).toMatch(/opacity-70/);
    expect(el).not.toHaveAttribute('data-enabled');
  });
});
