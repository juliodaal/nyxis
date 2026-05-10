import { expect, test } from '@playwright/test';

/**
 * Homepage smoke tests. Lightweight — assert the critical content is
 * reachable, not the exact DOM shape (which churns).
 */

test.describe('homepage', () => {
  test('renders without errors and shows the headline', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: /component toolkit for AI products/i }),
    ).toBeVisible();

    expect(errors, 'page emitted no console errors').toEqual([]);
  });

  test('lists every supported framework somewhere on the page', async ({ page }) => {
    await page.goto('/');

    for (const framework of ['Next.js', 'Astro', 'SvelteKit', 'Hono', 'Express']) {
      await expect(page.getByText(framework, { exact: true }).first()).toBeVisible();
    }
  });

  test('install command points at the canonical registry URL', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByText(/npx shadcn@latest add https:\/\/nyxisai\.vercel\.app/i).first(),
    ).toBeVisible();
  });
});
