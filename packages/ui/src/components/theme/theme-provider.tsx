'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ThemeContext } from '../../lib/theme/theme-context.js';
import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  subscribeToTheme,
} from '../../lib/theme/theme-store.js';
import { type ResolvedTheme, type Theme } from '../../lib/theme/theme-types.js';

export interface ThemeProviderProps {
  /** Initial theme. Defaults to `system`. The FOUC script reads localStorage
   *  before this provider hydrates, so the visual theme is correct immediately. */
  defaultTheme?: Theme;
  children: ReactNode;
}

/**
 * Optional provider for apps that want a single, shared React tree managing
 * the theme (Next.js, Vite, Remix, single-page React apps).
 *
 * It is **not required**: `useTheme` and components that depend on it work
 * correctly without a provider, falling back to a DOM/localStorage external
 * store. In Astro, where each interactive island is its own React tree,
 * skip the provider entirely and let each island use the standalone path.
 */
export function ThemeProvider({ defaultTheme = 'system', children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === 'undefined' ? defaultTheme : readStoredTheme(defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(typeof window === 'undefined' ? defaultTheme : theme),
  );

  // Keep DOM, storage, and resolvedTheme in sync whenever theme changes.
  useEffect(() => {
    const next = applyTheme(theme);
    persistTheme(theme);
    setResolvedTheme(next);
  }, [theme]);

  // Listen to changes coming from outside (other tabs, OS preference).
  useEffect(() => {
    const unsubscribe = subscribeToTheme(() => {
      const stored = readStoredTheme(defaultTheme);
      setThemeState(stored);
    });
    return unsubscribe;
  }, [defaultTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
