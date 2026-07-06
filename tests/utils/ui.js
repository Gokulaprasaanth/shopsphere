/** UI helpers that drive the React frontend through the browser. */
import { expect } from '@playwright/test';

export async function registerViaUi(page, user) {
  await page.goto('/register');
  await page.fill('input[name="fullName"]', user.fullName);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="phone"]', user.phone);
  await page.getByRole('button', { name: 'Sign Up' }).click();
  // On success the app routes to the login page.
  await expect(page).toHaveURL(/\/login$/);
}

export async function loginViaUi(page, { email, password }, { admin = false } = {}) {
  await page.goto(admin ? '/admin/login' : '/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

/** Register a fresh customer and log them in via the UI. */
export async function registerAndLogin(page, user) {
  await registerViaUi(page, user);
  await loginViaUi(page, user);
  await expect(page).toHaveURL(/\/products/);
}
