import { test, expect } from '@playwright/test';
import { ADMIN } from '../utils/config.js';
import { loginViaUi } from '../utils/ui.js';
import { createPendingOrderViaApi } from '../utils/api.js';

test.describe('Admin panel', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUi(page, ADMIN, { admin: true });
    // Wait for the real post-login landing (`/admin`). Note: `/\/admin/` would
    // also match `/admin/login` and pass before the async login finished,
    // letting a later page.goto() abort the in-flight login.
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('dashboard shows the summary stat cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Dashboard Overview/i })).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('Total Orders')).toBeVisible();
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Total Products')).toBeVisible();
  });

  test('admin can create a product and see it in the table', async ({ page }) => {
    const name = `E2E Admin Product ${Date.now()}`;

    await page.goto('/admin/products');
    await page.getByRole('button', { name: 'Add Product' }).click();

    await page.fill('input[name="name"]', name);
    await page.fill('input[name="description"]', 'Created by the admin e2e test.');
    await page.fill('input[name="price"]', '42.50');
    await page.fill('input[name="stock"]', '7');
    await page.getByRole('combobox').selectOption('Electronics');
    await page.fill('input[name="imageUrl"]', 'https://placehold.co/400x300?text=Admin');
    await page.getByRole('button', { name: 'Save Product' }).click();

    await expect(page.getByRole('row').filter({ hasText: name })).toBeVisible();
  });

  test('admin can update an order status from PENDING to SHIPPED', async ({ page, request }) => {
    // Precondition: a fresh PENDING order created directly via the API.
    const order = await createPendingOrderViaApi(request);
    const orderRow = page.getByRole('row').filter({ hasText: `#${order.orderId}` });

    await page.goto('/admin/orders');
    await expect(orderRow).toBeVisible();

    await orderRow.getByRole('button', { name: 'Update Status' }).click();
    // When the modal is open there is exactly one <select> on the page.
    await page.getByRole('combobox').selectOption('SHIPPED');
    // The modal's submit button is the last "Update Status" button in the DOM.
    await page.getByRole('button', { name: 'Update Status' }).last().click();

    await expect(orderRow.getByText('SHIPPED')).toBeVisible();
  });

  test('admin can view the users list including the seeded admin', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('cell', { name: ADMIN.email })).toBeVisible();
  });
});
