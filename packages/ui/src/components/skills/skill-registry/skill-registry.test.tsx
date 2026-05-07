import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { Skill } from '../../../ai/types.js';
import { SkillRegistry } from './skill-registry.js';

const SKILLS: Skill[] = [
  {
    id: 's1',
    name: 'GitHub',
    description: 'Repos and issues',
    category: 'dev',
    status: 'enabled',
  },
  {
    id: 's2',
    name: 'Calendar',
    description: 'Calendar events',
    category: 'productivity',
    status: 'enabled',
  },
  {
    id: 's3',
    name: 'Email',
    description: 'Read your email',
    category: 'productivity',
    status: 'disabled',
  },
];

describe('SkillRegistry', () => {
  it('renders all skills', () => {
    render(<SkillRegistry skills={SKILLS} />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('filters by the search input', () => {
    render(<SkillRegistry skills={SKILLS} />);

    fireEvent.change(screen.getByPlaceholderText(/Search skills/i), {
      target: { value: 'github' },
    });

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
  });

  it('filters by the category pill', () => {
    render(<SkillRegistry skills={SKILLS} />);

    fireEvent.click(screen.getByRole('button', { name: /^dev/i }));

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
  });

  it('fires onChange with the new enabled set when a skill is toggled', () => {
    const onChange = vi.fn();
    render(<SkillRegistry skills={SKILLS} onChange={onChange} />);

    // Email starts disabled — toggle it on
    const switches = screen.getAllByRole('switch');
    // Find the one with aria-checked false → Email
    const emailSwitch = switches.find((s) => s.getAttribute('aria-checked') === 'false');
    expect(emailSwitch).toBeTruthy();
    fireEvent.click(emailSwitch!);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1]![0];
    expect(lastCall).toContain('s3');
  });
});
