import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { Skill } from '@nyxis/core';
import { SkillCard } from './skill-card.js';

const BASE: Skill = {
  id: 'sk-1',
  name: 'GitHub',
  description: 'Search repos and read issues.',
  version: '1.4.0',
  author: 'nyxis',
  authState: 'connected',
  status: 'enabled',
  scopes: [
    { kind: 'read', resource: 'repos' },
    { kind: 'write', resource: 'issues' },
  ],
};

describe('SkillCard', () => {
  it('renders name, version, and author', () => {
    render(<SkillCard skill={BASE} />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('v1.4.0')).toBeInTheDocument();
    expect(screen.getByText('nyxis')).toBeInTheDocument();
  });

  it('renders the auth pill', () => {
    render(<SkillCard skill={BASE} />);

    expect(screen.getByLabelText('Connected')).toBeInTheDocument();
  });

  it('renders the scopes preview', () => {
    render(<SkillCard skill={BASE} />);

    expect(screen.getByText('repos')).toBeInTheDocument();
    expect(screen.getByText('issues')).toBeInTheDocument();
  });

  it('fires onToggle when the toggle switch is clicked', () => {
    const onToggle = vi.fn();
    render(<SkillCard skill={BASE} toggleable onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('switch', { name: /Disable skill/i }));

    expect(onToggle).toHaveBeenCalledWith('sk-1', false);
  });

  it('marks the card as selected when selected=true', () => {
    const { container } = render(<SkillCard skill={BASE} onSelect={() => {}} selected />);

    expect(container.firstChild).toHaveAttribute('data-selected');
    expect(container.firstChild).toHaveAttribute('aria-pressed', 'true');
  });
});
