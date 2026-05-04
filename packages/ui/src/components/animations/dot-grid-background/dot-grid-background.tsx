'use client';

import { useEffect, useRef, type HTMLAttributes } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface DotGridBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Spacing between dots (px). */
  spacing?: number;
  /** Dot radius (px). */
  dotSize?: number;
  /** Influence radius around the cursor (px). */
  influence?: number;
}

/**
 * Canvas-rendered grid of dots that gently shift and brighten around the
 * cursor. Works on retina displays and respects `prefers-reduced-motion`
 * (renders the static grid only).
 */
export function DotGridBackground({
  className,
  children,
  spacing = 28,
  dotSize = 1.4,
  influence = 120,
  ...props
}: DotGridBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouseX = -9999;
    let mouseY = -9999;
    let raf = 0;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const rect = wrapper.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const baseColor = 'oklch(0.6 0.02 275)';
      const hotColor = 'oklch(0.78 0.22 300)';
      for (let x = spacing / 2; x < rect.width; x += spacing) {
        for (let y = spacing / 2; y < rect.height; y += spacing) {
          const dx = x - mouseX;
          const dy = y - mouseY;
          const d = Math.hypot(dx, dy);
          const t = reduced ? 0 : Math.max(0, 1 - d / influence);
          ctx.beginPath();
          ctx.arc(x, y, dotSize + t * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = t > 0 ? hotColor : baseColor;
          ctx.globalAlpha = 0.3 + t * 0.6;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    const onMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    if (!reduced) {
      wrapper.addEventListener('mousemove', onMove);
      wrapper.addEventListener('mouseleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrapper.removeEventListener('mousemove', onMove);
      wrapper.removeEventListener('mouseleave', onLeave);
    };
  }, [spacing, dotSize, influence, reduced]);

  return (
    <div ref={wrapperRef} className={cn('relative isolate overflow-hidden', className)} {...props}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 -z-10" />
      {children}
    </div>
  );
}
