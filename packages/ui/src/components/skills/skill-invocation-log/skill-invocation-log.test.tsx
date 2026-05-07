import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import type { SkillInvocation } from '../../../ai/types.js';
import { SkillInvocationLog } from './skill-invocation-log.js';

const NOW = new Date('2026-05-06T12:30:00Z');

const INVOCATIONS: SkillInvocation[] = [
  {
    id: 'i1',
    skillId: 's1',
    skillName: 'GitHub',
    action: 'search_repos',
    status: 'completed',
    startedAt: NOW,
    durationMs: 320,
    input: { query: 'foo' },
    result: { count: 4 },
  },
  {
    id: 'i2',
    skillId: 's2',
    skillName: 'Calendar',
    action: 'create_event',
    status: 'errored',
    startedAt: NOW,
    error: 'rate limited',
  },
  {
    id: 'i3',
    skillId: 's3',
    skillName: 'Email',
    action: 'list_inbox',
    status: 'running',
    startedAt: NOW,
  },
];

describe('SkillInvocationLog', () => {
  it('renders one entry per invocation', () => {
    render(<SkillInvocationLog invocations={INVOCATIONS} />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('exposes status icons via aria-label', () => {
    render(<SkillInvocationLog invocations={INVOCATIONS} />);

    expect(screen.getByLabelText('completed')).toBeInTheDocument();
    expect(screen.getByLabelText('errored')).toBeInTheDocument();
    expect(screen.getByLabelText('running')).toBeInTheDocument();
  });

  it('expands the payload on click when input/result/error are present', () => {
    render(<SkillInvocationLog invocations={INVOCATIONS} />);

    fireEvent.click(screen.getByRole('button', { name: /GitHub/i }));

    expect(screen.getByText('input')).toBeInTheDocument();
    expect(screen.getByText('result')).toBeInTheDocument();
  });

  it('shows the empty state when invocations is empty', () => {
    render(<SkillInvocationLog invocations={[]} />);

    expect(screen.getByText(/No skill invocations/i)).toBeInTheDocument();
  });

  it('renders the +N footer when limit is below the count', () => {
    render(<SkillInvocationLog invocations={INVOCATIONS} limit={1} />);

    expect(screen.getByText(/\+ 2 earlier invocations/i)).toBeInTheDocument();
  });
});
