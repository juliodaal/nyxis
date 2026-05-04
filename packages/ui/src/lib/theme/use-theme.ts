'use client';

import { useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

import { ThemeContext } from './theme-context.js';
import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  subscribeToTheme,
} from './theme-store.js';
import type { ResolvedTheme, Theme } from './theme-types.js';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

/**
 * Read and update the current theme. Works **with or without** a surrounding
 * `<ThemeProvider>`:
 *
 * - When inside a Provider, the centralised React state is used (preferred
 *   for SSR-rendered apps so the initial render matches the persisted theme).
 * - Otherwise it falls back to a DOM/localStorage-backed external store so
 *   the same hook can be used inside multiple Astro islands and stay in sync
 *   across them via `storage` and a custom event.
 *
 * In both cases, theme changes use the View Transitions API for a smooth
 * cross-fade where supported and `prefers-reduced-motion` is not set.
 */
export function useTheme(): UseThemeReturn {
  const ctx = useContext(ThemeContext);

  const standalone = useStandaloneTheme(ctx === null);

  const theme = ctx ? ctx.theme : standalone.theme;
  const resolvedTheme = ctx ? ctx.resolvedTheme : standalone.resolvedTheme;
  const rawSetTheme = ctx ? ctx.setTheme : standalone.setTheme;

  const setTheme = useCallback(
    (next: Theme) => {
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      if (typeof document !== 'undefined' && 'startViewTransition' in document && !reduceMotion) {
        (
          document as Document & { startViewTransition: (cb: () => void) => unknown }
        ).startViewTransition(() => rawSetTheme(next));
        return;
      }

      rawSetTheme(next);
    },
    [rawSetTheme],
  );

  return { theme, resolvedTheme, setTheme };
}

/**
 * Stand-alone implementation for components rendered outside a Provider.
 * Backed by `useSyncExternalStore` so multiple components stay in sync
 * without prop drilling. The store reads/writes `localStorage` and
 * `data-theme` directly.
 */
function useStandaloneTheme(active: boolean): UseThemeReturn {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    () => readStoredTheme(),
    () => 'system' as Theme,
  );
  const resolvedTheme = resolveTheme(theme);

  // Keep the document attribute in sync with the read value, in case
  // another component or hook only updated localStorage.
  useEffect(() => {
    if (!active) return;
    applyTheme(theme);
  }, [active, theme]);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    persistTheme(next);
  }, []);

  return { theme, resolvedTheme, setTheme };
}
