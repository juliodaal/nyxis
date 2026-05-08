'use client';

import { useEffect, useRef } from 'react';

export interface DotWaveProps {
  /** Spacing in pixels between dots in the grid. */
  spacing?: number;
  /** Base radius of each dot in pixels. */
  dotRadius?: number;
  /** Vertical wave amplitude in pixels. */
  amplitude?: number;
  /** Wavelength as a multiplier of the canvas width. Smaller = more waves visible. */
  wavelength?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Optional CSS className. */
  className?: string;
}

/**
 * Subtle dot-grid background with a traveling sine wave.
 *
 * - Pure canvas, GPU-friendly. No DOM nodes per dot.
 * - Color is read from `--color-brand` so theme switches just work.
 * - Honours `prefers-reduced-motion` — paints a static grid.
 * - Resizes responsively via `ResizeObserver`.
 *
 * Place absolutely-positioned inside a `relative` container; children
 * render above through `z-10` on their wrapper.
 */
export function DotWave({
  spacing = 32,
  dotRadius = 1.4,
  amplitude = 12,
  wavelength = 0.55,
  speed = 1,
  className,
}: DotWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function readBrand(): string {
      const styles = getComputedStyle(document.documentElement);
      const brand = styles.getPropertyValue('--color-brand').trim();
      return brand || 'oklch(0.55 0.16 277)';
    }

    function setSize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      if (!ctx) return;
      const brand = readBrand();
      ctx.clearRect(0, 0, width, height);

      // Mid-row index — wave amplitude tapers towards top and bottom
      // so the effect feels grounded instead of distracting.
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const midRow = (rows - 1) / 2;
      const phase = reduce ? 0 : (time / 1000) * speed;

      for (let r = 0; r < rows; r += 1) {
        const y0 = r * spacing - spacing;
        // Distance from middle, normalised 0..1 → fade dots far from center.
        const distFromMid = Math.abs(r - midRow) / midRow;
        const fade = Math.max(0, 1 - distFromMid * 1.1);
        if (fade <= 0) continue;

        for (let c = 0; c < cols; c += 1) {
          const x = c * spacing - spacing;
          const k = (x / Math.max(width, 1)) * (Math.PI * 2) * wavelength;
          const wave = reduce ? 0 : Math.sin(k * 4 + phase + r * 0.18) * amplitude * fade;
          const y = y0 + wave;

          // Per-dot opacity peaks in the center band and trails off.
          const alpha = 0.18 + fade * 0.42;
          ctx.beginPath();
          ctx.fillStyle = colorWithAlpha(brand, alpha);
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function loop(time: number) {
      draw(time);
      if (!reduce) {
        rafRef.current = window.requestAnimationFrame(loop);
      }
    }

    setSize();
    if (reduce) {
      draw(0);
    } else {
      rafRef.current = window.requestAnimationFrame(loop);
    }

    const resizeObserver = new ResizeObserver(() => {
      setSize();
      if (reduce) draw(0);
    });
    resizeObserver.observe(canvas);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [spacing, dotRadius, amplitude, wavelength, speed]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

/**
 * Compose an alpha channel into a CSS color string. Handles oklch(),
 * rgb(), and hex; for anything else, fall back to wrapping in
 * `color-mix` to preserve the underlying color.
 */
function colorWithAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  // oklch(L C H) or oklch(L C H / A) → inject / alpha
  if (color.startsWith('oklch(')) {
    const inner = color.slice(6, -1).trim();
    const head = inner.split('/')[0]?.trim() ?? inner;
    return `oklch(${head} / ${a})`;
  }
  // hex / rgb fallback: color-mix is widely supported in modern browsers.
  return `color-mix(in oklch, ${color} ${Math.round(a * 100)}%, transparent)`;
}
