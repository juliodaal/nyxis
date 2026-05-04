'use client';

import { THEME_ATTRIBUTE, THEME_STORAGE_KEY, THEMES } from './theme-types.js';
import type { ResolvedTheme, Theme } from './theme-types.js';

const SAME_TAB_EVENT = 'nyxis-theme-change';

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

export function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? resolveSystemTheme() : theme;
}

export function readStoredTheme(defaultTheme: Theme = 'system'): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

export function applyTheme(theme: Theme): ResolvedTheme {
  const resolved = resolveTheme(theme);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, resolved);
  }
  return resolved;
}

/**
 * Persist the theme and broadcast the change to listeners in the same tab
 * (via a CustomEvent) and other tabs (via the `storage` event fired by
 * `localStorage.setItem`).
 */
export function persistTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable; broadcast anyway so in-memory
    // listeners can still update.
  }
  window.dispatchEvent(new CustomEvent<Theme>(SAME_TAB_EVENT, { detail: theme }));
}

/**
 * Subscribe to theme changes from any source (other tabs, other islands,
 * OS preference change for `system`).
 */
export function subscribeToTheme(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) callback();
  };
  const onSameTab = () => callback();

  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystem = () => {
    // Re-apply if currently following system.
    if (readStoredTheme() === 'system') {
      applyTheme('system');
      callback();
    }
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener(SAME_TAB_EVENT, onSameTab);
  mq.addEventListener('change', onSystem);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(SAME_TAB_EVENT, onSameTab);
    mq.removeEventListener('change', onSystem);
  };
}
