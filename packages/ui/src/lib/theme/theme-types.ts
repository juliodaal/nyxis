/**
 * Available theme modes. `system` resolves at runtime to `light` or `dark`
 * based on `prefers-color-scheme`; it never appears as the value of
 * `data-theme` on the document.
 */
export type Theme = 'light' | 'dark' | 'dim' | 'high-contrast' | 'system';

/** Resolved theme actually applied to the document. */
export type ResolvedTheme = Exclude<Theme, 'system'>;

export const THEMES: readonly Theme[] = [
  'light',
  'dark',
  'dim',
  'high-contrast',
  'system',
] as const;

export const RESOLVED_THEMES: readonly ResolvedTheme[] = [
  'light',
  'dark',
  'dim',
  'high-contrast',
] as const;

export const THEME_STORAGE_KEY = 'nyxis-theme';
export const THEME_ATTRIBUTE = 'data-theme';
