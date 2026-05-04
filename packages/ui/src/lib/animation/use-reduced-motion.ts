'use client';

import { useEffect, useState } from 'react';

/**
 * Track the user's `prefers-reduced-motion` setting. Returns `true` if the
 * user has requested reduced motion. SSR-safe: returns `false` on the server.
 *
 * Animations should always check this and either skip the animation
 * entirely or fall back to a near-instant transition (~10ms).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
