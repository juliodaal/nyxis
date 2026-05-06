'use client';

import { Download, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useId, useRef, useState, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';
import { VoiceWaveform } from '../voice-waveform/voice-waveform.js';

export interface AudioPlayerProps extends HTMLAttributes<HTMLDivElement> {
  /** Audio source URL. */
  src: string;
  /** Title shown above the controls (e.g. "Voice reply"). */
  title?: string;
  /** Pre-computed waveform amplitudes (0..1). */
  waveform?: readonly number[];
  /** Auto-play on mount. */
  autoPlay?: boolean;
  /** Show download button. */
  downloadable?: boolean;
  /** Available playback speeds. */
  speeds?: readonly number[];
}

const DEFAULT_SPEEDS: readonly number[] = [0.75, 1, 1.25, 1.5, 2];

/**
 * Compact audio player tuned for AI voice output: synthesised replies,
 * transcribed user audio, generated music. Pair with `<VoiceWaveform>`
 * for the visual track and `<TranscriptionView>` for synced text.
 */
export function AudioPlayer({
  src,
  title,
  waveform,
  autoPlay = false,
  downloadable = true,
  speeds = DEFAULT_SPEEDS,
  className,
  ...props
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const reactId = useId();
  const labelId = `nyxis-audio-${reactId}`;

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onTime = () => setTime(el.currentTime);
    const onLoaded = () => setDuration(el.duration || 0);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoaded);
    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoaded);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Number(event.target.value);
  };

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length] ?? 1;
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const toggleMute = () => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const progress = duration > 0 ? time / duration : 0;

  return (
    <div
      className={cn('border-border bg-card flex flex-col gap-2 rounded-lg border p-3', className)}
      aria-labelledby={title ? labelId : undefined}
      {...props}
    >
      {title && (
        <p id={labelId} className="text-foreground text-xs font-semibold">
          {title}
        </p>
      )}

      <audio ref={audioRef} src={src} autoPlay={autoPlay} preload="metadata" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="bg-primary text-primary-foreground hover:bg-primary/90 grid size-9 shrink-0 place-items-center rounded-full transition-colors"
        >
          {playing ? (
            <Pause className="size-4" aria-hidden />
          ) : (
            <Play className="ml-0.5 size-4" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <VoiceWaveform
            {...(waveform ? { bars: waveform } : {})}
            isPlaying={playing}
            progress={progress}
            height={28}
            barCount={48}
          />
          <div className="text-muted-foreground mt-0.5 flex items-center justify-between font-mono text-[10px] tabular-nums">
            <span>{formatTime(time)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={cycleSpeed}
            aria-label={`Playback speed ${speed}x — click to cycle`}
            className="text-muted-foreground hover:text-foreground rounded px-1.5 py-1 font-mono text-[11px] font-semibold tabular-nums transition-colors"
          >
            {speed}x
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
          >
            {muted ? (
              <VolumeX className="size-3.5" aria-hidden />
            ) : (
              <Volume2 className="size-3.5" aria-hidden />
            )}
          </button>
          {downloadable && (
            <a
              href={src}
              download
              aria-label="Download audio"
              className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            >
              <Download className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 1}
        step={0.01}
        value={time}
        onChange={seek}
        aria-label="Seek"
        className="accent-primary h-1 w-full cursor-pointer"
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
