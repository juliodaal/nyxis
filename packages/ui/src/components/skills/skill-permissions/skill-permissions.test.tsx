import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { SkillScope } from '@nyxis/core';
import { SkillPermissions } from './skill-permissions.js';

const SCOPES: SkillScope[] = [
  { kind: 'read', resource: 'files' },
  { kind: 'write', resource: 'calendar' },
  { kind: 'admin', resource: 'billing' },
];

describe('SkillPermissions', () => {
  it('renders one chip per scope kind', () => {
    render(<SkillPermissions scopes={SCOPES} />);

    expect(screen.getByText('files')).toBeInTheDocument();
    expect(screen.getByText('calendar')).toBeInTheDocument();
    expect(screen.getByText('billing')).toBeInTheDocument();
  });

  it('exposes data-kind attributes for read/write/admin', () => {
    const { container } = render(<SkillPermissions scopes={SCOPES} />);

    expect(container.querySelector('[data-kind="read"]')).toBeTruthy();
    expect(container.querySelector('[data-kind="write"]')).toBeTruthy();
    expect(container.querySelector('[data-kind="admin"]')).toBeTruthy();
  });

  it('hides the resource label in compact mode', () => {
    render(<SkillPermissions scopes={SCOPES} compact />);

    // compact uses sr-only labels; visible text "files" / "calendar" should not appear as the chip text
    expect(screen.queryByText('files')).not.toBeInTheDocument();
    expect(screen.queryByText('calendar')).not.toBeInTheDocument();
  });

  it('collapses overflow scopes into a +N chip when limit is set', () => {
    render(<SkillPermissions scopes={SCOPES} limit={1} />);

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders the no-permissions placeholder when empty', () => {
    render(<SkillPermissions scopes={[]} />);

    expect(screen.getByText(/No special permissions/i)).toBeInTheDocument();
  });
});
