import { test, expect } from '@playwright/test';
import { ADMIN } from '../utils/config.js';
import { newCustomer } from '../utils/api.js';
import { registerViaUi, loginViaUi } from '../utils/ui.js';

test.describe('Authentication & route protection', () => {
  test('a new customer can register and then log in', async ({ page }) => {
    const user = newCustomer('auth');

    await registerViaUi(page, user);
    await loginViaUi(page, user);

    await expect(page).toHaveURL(/\/products/);
    // The navbar greets the logged-in user by name.
    await expect(page.getByText(user.fullName)).toBeVisible();
  });

  test('logging in with wrong credentials shows an error and stays on login', async ({ page }) => {
    await loginViaUi(page, { email: 'nobody@nowhere.test', password: 'wrong-pass' });

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/invalid|bad credentials|failed|incorrect/i)).toBeVisible();
  });

  test('an anonymous user is redirected from a protected route to login', async ({ page }) => {
    await page.goto('/orders');
    await expect(page).toHaveURL(/\/login/);
  });

  test('a customer cannot reach the admin dashboard', async ({ page }) => {
    const user = newCustomer('nonadmin');
    await registerViaUi(page, user);
    await loginViaUi(page, user);
    await expect(page).toHaveURL(/\/products/);

    // Admin route is role-gated; a USER gets bounced back to the storefront.
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/products/);
  });

  test('the admin can log into the admin panel', async ({ page }) => {
    await loginViaUi(page, ADMIN, { admin: true });

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: /Dashboard Overview/i })).toBeVisible();
  });
});
