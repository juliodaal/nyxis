import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the Nyxis docs site.
 *
 * Strategy:
 * - Tests live under `tests/e2e/` and assume the docs site is reachable
 *   on the configured `baseURL`. Locally, Playwright spins up the Astro
 *   dev server itself; in CI, we build once and `astro preview`.
 * - Targets a single Chromium configuration on every run. Adding more
 *   browsers (Firefox, Safari) is fine but multiplies CI minutes 3x —
 *   defer until something actually breaks per-engine.
 * - Retries are disabled locally to surface flake immediately; CI gets
 *   one retry to absorb network blips.
 */

const PORT = 4321;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['list']] : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: isCI ? 'pnpm preview --port 4321 --host' : 'pnpm dev --port 4321 --host',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
