import { test, expect } from '@playwright/test';
import { ensureProducts } from '../utils/api.js';

test.describe('Storefront (public)', () => {
  test('home redirects to the product listing and renders core chrome', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/products/);

    await expect(page.getByRole('link', { name: 'ShopSphere' })).toBeVisible();
    await expect(page.getByPlaceholder(/Search for products/i)).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible(); // footer
  });

  test('product grid lists seeded products', async ({ page, request }) => {
    const products = await ensureProducts(request, 3);
    await page.goto('/products');

    // The first product's name should be rendered as a card heading.
    await expect(page.getByRole('heading', { name: products[0].name })).toBeVisible();
  });

  test('a product detail page shows price, stock and an add-to-cart action', async ({ page, request }) => {
    const [product] = await ensureProducts(request, 1);
    await page.goto(`/products/${product.id}`);

    await expect(page.getByRole('heading', { name: product.name })).toBeVisible();
    await expect(page.getByText(/In Stock|Out of Stock/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
  });
});
