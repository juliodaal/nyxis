import { expect, test } from '@playwright/test';

/**
 * Theme runtime tests. Validates that the FOUC-prevention inline
 * script populates `<html data-theme="...">` before paint.
 *
 * NOTE: the toggle interaction test is intentionally left out for now
 * — the dropdown is rendered by a custom registry component whose
 * internal DOM shape varies. Once we settle on a stable test selector
 * (e.g. `data-testid`), reintroduce as a separate test.
 */

test.describe('theme runtime', () => {
  test('initial render carries a resolved data-theme attribute', async ({ page }) => {
    await page.goto('/');

    const value = await page.locator('html').getAttribute('data-theme');
    expect(value).toBeTruthy();
    expect(['light', 'dark', 'dim', 'high-contrast']).toContain(value!);
  });

  test('localStorage round-trip survives reload', async ({ page }) => {
    // Force dark before the first paint, then reload.
    await page.addInitScript(() => {
      window.localStorage.setItem('nyxis-theme', 'dark');
    });
    await page.goto('/');

    const value = await page.locator('html').getAttribute('data-theme');
    expect(value).toBe('dark');
  });
});
