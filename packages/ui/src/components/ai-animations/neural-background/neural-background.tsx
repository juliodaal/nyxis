'use client';

import { useEffect, useMemo, useRef, type HTMLAttributes } from 'react';

import { cn } from '../../../lib/utils.js';

export interface NeuralBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of nodes scattered in the network. */
  nodeCount?: number;
  /** Maximum distance (0..1) between nodes that draw an edge. */
  edgeRadius?: number;
  /** Whether the network animates. */
  animate?: boolean;
  /** Animation speed multiplier. */
  speed?: number;
  /** Override the line / dot colour. Defaults to `currentColor`. */
  color?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Pulse phase 0..2π — drives a subtle brightness wave. */
  phase: number;
}

/**
 * Animated neural-network backdrop — a soft drifting field of
 * connected nodes. Use as a hero or section background for AI
 * products. Pure canvas, GPU-accelerated, honours
 * `prefers-reduced-motion` (renders a static snapshot when reduced).
 */
export function NeuralBackground({
  nodeCount = 36,
  edgeRadius = 0.18,
  animate = true,
  speed = 1,
  color = 'currentColor',
  className,
  ...props
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number | null>(null);

  const seedNodes = useMemo<Node[]>(() => {
    return Array.from({ length: nodeCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [nodeCount]);

  useEffect(() => {
    nodesRef.current = seedNodes.map((n) => ({ ...n }));
  }, [seedNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const resolveColor = () => {
      // currentColor → resolve via getComputedStyle on the container.
      if (color === 'currentColor') {
        const computed = getComputedStyle(container).color;
        return computed || '#888';
      }
      return color;
    };

    const draw = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const stroke = resolveColor();
      const nodes = nodesRef.current;
      const er2 = edgeRadius * edgeRadius;

      // Edges
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!;
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < er2) {
            const alpha = 0.25 * (1 - Math.sqrt(d2) / edgeRadius);
            ctx.strokeStyle = withAlpha(stroke, alpha);
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(n.phase));
        ctx.fillStyle = withAlpha(stroke, pulse);
        ctx.beginPath();
        ctx.arc(n.x * width, n.y * height, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    if (!animate || reduced) {
      draw();
      return () => {
        ro.disconnect();
      };
    }

    const tick = () => {
      const nodes = nodesRef.current;
      const dt = speed;
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.phase += 0.04 * dt;
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [animate, color, edgeRadius, speed]);

  return (
    <div
      ref={containerRef}
      className={cn('text-foreground/40 relative overflow-hidden', className)}
      {...props}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />
    </div>
  );
}

function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const expand =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    const r = parseInt(expand.slice(0, 2), 16);
    const g = parseInt(expand.slice(2, 4), 16);
    const b = parseInt(expand.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${a})`);
  }
  if (color.startsWith('rgba(')) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${a})`);
  }
  // Fallback: assume named / hsl / oklch — wrap with color-mix.
  return `color-mix(in oklch, ${color} ${Math.round(a * 100)}%, transparent)`;
}
