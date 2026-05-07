import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { Skill } from '../../../ai/types.js';
import { SkillMarketplace } from './skill-marketplace.js';

const SKILLS: Skill[] = [
  {
    id: 's1',
    name: 'GitHub',
    description: 'Repos and issues',
    author: 'nyxis',
    category: 'dev',
    rating: 4.7,
    ratingCount: 320,
    installs: 12000,
    installed: false,
  },
  {
    id: 's2',
    name: 'Calendar',
    description: 'Calendar integration',
    author: 'nyxis',
    category: 'productivity',
    installed: true,
  },
  {
    id: 's3',
    name: 'Email',
    description: 'Email integration',
    author: 'nyxis',
    category: 'productivity',
    installed: false,
  },
];

describe('SkillMarketplace', () => {
  it('renders one card per skill', () => {
    render(<SkillMarketplace skills={SKILLS} />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows Install for not-yet-installed skills and Installed for installed ones', () => {
    render(<SkillMarketplace skills={SKILLS} onInstall={() => {}} />);

    // Calendar is installed
    expect(screen.getByText('Installed')).toBeInTheDocument();
    // GitHub + Email show "Install"
    expect(screen.getAllByRole('button', { name: /^Install$/i }).length).toBe(2);
  });

  it('shows Installing... when installingId matches', () => {
    render(<SkillMarketplace skills={SKILLS} installingId="s1" onInstall={() => {}} />);

    expect(screen.getByText(/Installing/i)).toBeInTheDocument();
  });

  it('filters by the category pill', () => {
    render(<SkillMarketplace skills={SKILLS} />);

    fireEvent.click(screen.getByRole('button', { name: /^dev/i }));

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
  });

  it('fires onInstall with the skill id', () => {
    const onInstall = vi.fn();
    render(<SkillMarketplace skills={SKILLS} onInstall={onInstall} />);

    const installButtons = screen.getAllByRole('button', { name: /^Install$/i });
    fireEvent.click(installButtons[0]!);

    expect(onInstall).toHaveBeenCalled();
    expect(['s1', 's3']).toContain(onInstall.mock.calls[0]![0]);
  });
});
