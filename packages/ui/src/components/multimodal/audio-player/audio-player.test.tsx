import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AudioPlayer } from './audio-player.js';

describe('AudioPlayer', () => {
  it('renders the audio element with the provided src', () => {
    const { container } = render(<AudioPlayer src="https://example.test/audio.mp3" />);
    const audio = container.querySelector('audio');
    expect(audio).not.toBeNull();
    expect(audio).toHaveAttribute('src', 'https://example.test/audio.mp3');
  });

  it('renders play, mute, and speed controls', () => {
    render(<AudioPlayer src="x.mp3" />);
    // Play button has the exact aria-label "Play"; the Playback-speed button
    // also matches /Play/i, so anchor with `^Play$` to disambiguate.
    expect(screen.getByRole('button', { name: /^Play$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mute/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Playback speed/i })).toBeInTheDocument();
  });

  it('cycles the speed label on click', async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src="x.mp3" />);
    const speedBtn = screen.getByRole('button', { name: /Playback speed 1x/i });
    expect(speedBtn.textContent).toMatch(/1x/);
    await user.click(speedBtn);
    expect(speedBtn.textContent).toMatch(/1\.25x/);
  });

  it('toggles the mute icon on click', async () => {
    const user = userEvent.setup();
    render(<AudioPlayer src="x.mp3" />);
    const muteBtn = screen.getByRole('button', { name: /Mute/i });
    await user.click(muteBtn);
    expect(screen.getByRole('button', { name: /Unmute/i })).toBeInTheDocument();
  });

  it('renders a download link when downloadable', () => {
    render(<AudioPlayer src="https://example.test/voice.mp3" downloadable />);
    const link = screen.getByRole('link', { name: /Download audio/i });
    expect(link).toHaveAttribute('href', 'https://example.test/voice.mp3');
    expect(link).toHaveAttribute('download');
  });
});
