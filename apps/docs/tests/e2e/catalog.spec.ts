import { expect, test } from '@playwright/test';

/**
 * Catalog smoke tests. Validates the master /components grid renders
 * and the search island hydrates. Behavior tests for filtering live
 * in unit tests against `CatalogGrid` directly — they would be flaky
 * here because of `useDeferredValue` timing.
 */

test.describe('component catalog', () => {
  test('renders the page header and search input', async ({ page }) => {
    await page.goto('/components');

    await expect(page.getByRole('heading', { level: 1, name: /all components/i })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: /search components/i })).toBeVisible();
  });

  test('renders at least 100 component cards on initial load', async ({ page }) => {
    await page.goto('/components');

    // Each catalog card is an anchor with an h3 inside.
    const cards = page.locator('a').filter({ has: page.getByRole('heading', { level: 3 }) });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(100);
  });
});
