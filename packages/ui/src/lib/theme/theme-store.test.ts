import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applyTheme, persistTheme, readStoredTheme, resolveTheme } from './theme-store.js';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme-types.js';

describe('theme-store', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  describe('readStoredTheme', () => {
    it('returns the default when nothing is stored', () => {
      expect(readStoredTheme()).toBe('system');
    });

    it('returns the stored value when valid', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      expect(readStoredTheme()).toBe('dark');
    });

    it('falls back to default when stored value is invalid', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');
      expect(readStoredTheme('light')).toBe('light');
    });
  });

  describe('resolveTheme', () => {
    it('returns the same theme for non-system values', () => {
      expect(resolveTheme('light')).toBe('light');
      expect(resolveTheme('dark')).toBe('dark');
      expect(resolveTheme('dim')).toBe('dim');
      expect(resolveTheme('high-contrast')).toBe('high-contrast');
    });

    it('resolves system to the OS preference', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaQueryList);

      expect(resolveTheme('system')).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    it('writes data-theme on the html element', () => {
      const resolved = applyTheme('dark');
      expect(resolved).toBe('dark');
      expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    });
  });

  describe('persistTheme', () => {
    it('writes to localStorage and dispatches a custom event', () => {
      const handler = vi.fn();
      window.addEventListener('nyxis-theme-change', handler);

      persistTheme('high-contrast');

      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('high-contrast');
      expect(handler).toHaveBeenCalledOnce();

      window.removeEventListener('nyxis-theme-change', handler);
    });
  });
});
