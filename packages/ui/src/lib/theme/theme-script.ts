import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme-types.js';

/**
 * Returns a string of JavaScript that, when injected as the very first
 * `<script>` in `<head>`, applies the persisted theme before the browser
 * paints. This prevents the flash of unstyled (or wrong-themed) content.
 *
 * Usage in Astro:
 * ```astro
 * <script is:inline set:html={getThemeScript()} />
 * ```
 *
 * Usage in Next.js App Router:
 * ```tsx
 * <script
 *   dangerouslySetInnerHTML={{ __html: getThemeScript() }}
 *   suppressHydrationWarning
 * />
 * ```
 */
export function getThemeScript(): string {
  // The script is wrapped in an IIFE and parameterized with the actual
  // attribute and storage key so callers can override them if needed
  // without re-implementing the script itself.
  const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var a=${JSON.stringify(THEME_ATTRIBUTE)};var t=localStorage.getItem(k)||'system';var r=t;if(t==='system'){r=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute(a,r);if(t==='system'){document.documentElement.setAttribute('data-theme-source','system');}}catch(e){document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},'light');}})();`;
  return script;
}
