import { request } from '@playwright/test';
import { BACKEND_URL, FRONTEND_URL } from './utils/config.js';
import { ensureProducts } from './utils/api.js';

/**
 * Runs once before the whole suite:
 *  1. Verifies the backend and frontend are reachable (clear error if not).
 *  2. Ensures the catalog has products so the shopping flow has data to use.
 */
export default async function globalSetup() {
  const ctx = await request.newContext();

  const backend = await ctx.get(`${BACKEND_URL}/products`).catch(() => null);
  if (!backend || !backend.ok()) {
    throw new Error(
      `\n\nBackend is not reachable at ${BACKEND_URL}.\n` +
      `Start the stack before running the tests (see tests/README.md).\n`,
    );
  }

  const frontend = await ctx.get(FRONTEND_URL).catch(() => null);
  if (!frontend || !frontend.ok()) {
    throw new Error(
      `\n\nFrontend is not reachable at ${FRONTEND_URL}.\n` +
      `Start the Vite dev server on port 5173 (see tests/README.md).\n`,
    );
  }

  await ensureProducts(ctx, 3);
  await ctx.dispose();
}
