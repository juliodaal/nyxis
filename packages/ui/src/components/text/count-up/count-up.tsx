'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import { createElement } from 'react';
import { useReducedMotion } from '../../../lib/animation/use-reduced-motion.js';
import { cn } from '../../../lib/utils.js';

export interface CountUpProps {
  /** Target value. */
  to: number;
  /** Starting value. Default 0. */
  from?: number;
  /** Duration in seconds. */
  duration?: number;
  /** Display format. */
  format?: 'number' | 'currency' | 'percent' | 'compact';
  /** Currency code, e.g. 'EUR'. Used when format is 'currency'. */
  currency?: string;
  /** BCP-47 locale. */
  locale?: string;
  /** Element type. */
  as?: ElementType;
  className?: string;
  /** Trigger on scroll into view. */
  trigger?: 'mount' | 'scroll';
  /** Decimal places. */
  decimals?: number;
}

function format(value: number, props: CountUpProps): string {
  const { format: f = 'number', currency = 'EUR', locale, decimals = 0 } = props;

  switch (f) {
    case 'currency':
      return value.toLocaleString(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: decimals,
      });
    case 'percent':
      return value.toLocaleString(locale, {
        style: 'percent',
        maximumFractionDigits: decimals,
      });
    case 'compact':
      return value.toLocaleString(locale, {
        notation: 'compact',
        maximumFractionDigits: decimals,
      });
    default:
      return value.toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      });
  }
}

/**
 * Animate a number counting up. Honours `prefers-reduced-motion` by
 * jumping to the target immediately. Supports currency, percent, and
 * compact (k/M) formatting via `Intl.NumberFormat`.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  trigger = 'mount',
  as = 'span',
  className,
  ...formatProps
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(reduced ? to : from);
  const [shouldRun, setShouldRun] = useState(trigger === 'mount');

  useEffect(() => {
    if (trigger !== 'scroll') return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [trigger]);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!shouldRun) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration, reduced, shouldRun]);

  return createElement(as, {
    ref,
    className: cn('tabular-nums', className),
    children: format(value, { to, from, duration, ...formatProps }),
  });
}
