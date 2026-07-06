import { defineConfig, devices } from '@playwright/test';
import { FRONTEND_URL } from './utils/config.js';

/**
 * Playwright configuration for the ShopSphere end-to-end integration tests.
 *
 * These tests drive the real running stack (frontend + backend + PostgreSQL),
 * so the stack must be up before running them. See README.md for how to start
 * it. `globalSetup` fails fast with a clear message if the backend is down.
 */
export default defineConfig({
  testDir: './e2e',
  // Integration tests share one backend/database, so run them serially for
  // deterministic results rather than in parallel.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './global-setup.js',
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
