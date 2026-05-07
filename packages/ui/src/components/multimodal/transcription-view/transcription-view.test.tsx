import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TranscriptionView } from './transcription-view.js';
import type { TranscriptSegment } from '@nyxis/core';

const segments: TranscriptSegment[] = [
  { id: 's1', start: 0, end: 5, text: 'Hello there', speaker: 'Alice' },
  { id: 's2', start: 5, end: 10, text: 'General Kenobi', speaker: 'Bob' },
  { id: 's3', start: 10, end: 15, text: 'You are a bold one', speaker: 'Alice' },
];

describe('TranscriptionView', () => {
  it('renders all segment texts', () => {
    render(<TranscriptionView segments={segments} />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('General Kenobi')).toBeInTheDocument();
    expect(screen.getByText('You are a bold one')).toBeInTheDocument();
  });

  it('marks the active segment with aria-current', () => {
    render(<TranscriptionView segments={segments} currentTime={7} />);
    const buttons = screen.getAllByRole('button');
    const active = buttons.find((b) => b.getAttribute('aria-current') === 'true');
    expect(active).toBeDefined();
    expect(active!.textContent).toMatch(/General Kenobi/);
  });

  it('fires onSelect with the clicked segment', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TranscriptionView segments={segments} onSelect={onSelect} />);
    await user.click(screen.getByText('Hello there'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 's1', text: 'Hello there' }),
    );
  });

  it('hides speaker labels when hideSpeakers', () => {
    render(<TranscriptionView segments={segments} hideSpeakers />);
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('hides timestamps when hideTimestamps', () => {
    render(<TranscriptionView segments={segments} hideTimestamps />);
    // Default (not hidden) renders <time> elements; hidden = none.
    expect(document.querySelector('time')).toBeNull();
  });
});
