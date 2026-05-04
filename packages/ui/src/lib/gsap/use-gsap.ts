'use client';

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Run a GSAP setup function scoped to a container element. The setup runs
 * after layout, has access to the scoped element via `ref.current`, and
 * any selectors used inside `gsap.context(setup, scope)` are scoped too.
 *
 * The hook automatically calls `ctx.revert()` on unmount or when any of
 * the dependencies change, ensuring no orphaned animations or timelines.
 *
 * GSAP is loaded dynamically so consumers who don't use animation
 * components don't pay the bundle cost.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useGsap(ref, ({ gsap, scope }) => {
 *   gsap.from('.target', { y: 20, opacity: 0, stagger: 0.05 });
 * }, []);
 * ```
 */
export function useGsap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (api: { gsap: typeof import('gsap').default; scope: T }) => void | (() => void),
  deps: ReadonlyArray<unknown> = [],
): void {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const scope = ref.current;
    let cleanup: void | (() => void);
    let cancelled = false;

    let ctx: ReturnType<typeof import('gsap').default.context> | null = null;

    void import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        cleanup = setupRef.current({ gsap, scope });
      }, scope);
    });

    return () => {
      cancelled = true;
      if (typeof cleanup === 'function') cleanup();
      if (ctx) ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
