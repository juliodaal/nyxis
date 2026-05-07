import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { VoiceWaveform } from './voice-waveform.js';

describe('VoiceWaveform', () => {
  it('renders the requested number of bars', () => {
    const { container } = render(<VoiceWaveform barCount={12} />);
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(12);
  });

  it('uses the destructive fill while recording', () => {
    const { container } = render(<VoiceWaveform isRecording barCount={6} />);
    const rect = container.querySelector('rect');
    expect(rect?.getAttribute('class') ?? '').toMatch(/fill-destructive/);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Recording audio');
  });

  it('fills bars up to progress while playing', () => {
    const bars = [0.5, 0.5, 0.5, 0.5];
    const { container } = render(<VoiceWaveform bars={bars} isPlaying progress={0.5} />);
    const rects = container.querySelectorAll('rect');
    // First two bars (positions 0.125 and 0.375) are <= 0.5 → filled.
    expect(rects[0]?.getAttribute('class')).toMatch(/fill-primary/);
    expect(rects[1]?.getAttribute('class')).toMatch(/fill-primary/);
    // Last two are above 0.5 → muted-foreground.
    expect(rects[3]?.getAttribute('class')).toMatch(/fill-muted-foreground/);
  });

  it('renders idle state with a generic aria-label', () => {
    render(<VoiceWaveform />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Audio waveform');
  });
});
