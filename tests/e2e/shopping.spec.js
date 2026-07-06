import { test, expect } from '@playwright/test';
import { ensureProducts, newCustomer } from '../utils/api.js';
import { registerAndLogin } from '../utils/ui.js';

test.describe('Customer shopping journey', () => {
  test('register → add to cart → update qty → checkout → order appears in history', async ({ page, request }) => {
    const [product] = await ensureProducts(request, 1);
    const price = product.price;

    // 1. New customer signs up and logs in.
    await registerAndLogin(page, newCustomer('shop'));

    // 2. Open the product and add it to the cart.
    await page.goto(`/products/${product.id}`);
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // 3. Cart shows the item.
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByRole('heading', { name: product.name })).toBeVisible();

    // 4. Increase quantity to 2 and confirm the subtotal recalculates.
    await page.getByRole('button', { name: '+', exact: true }).click();
    await expect(page.getByText(`₹${(price * 2).toFixed(2)}`).first()).toBeVisible();

    // 5. Proceed to checkout (SPA navigation keeps the loaded cart).
    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // 6. Fill delivery details (COD is selected by default) and place the order.
    await page.fill('input[name="deliveryAddress"]', '1 Test Lane, Testville, 12345');
    await page.fill('input[name="contactNumber"]', '9876543210');
    await page.getByRole('button', { name: /Place Order/i }).click();

    // 7. Order-success screen is shown (regression guard for the checkout redirect bug).
    await expect(page).toHaveURL(/\/order-success/);
    await expect(page.getByRole('heading', { name: /Order Placed Successfully/i })).toBeVisible();

    // 8. The order shows up in the customer's order history.
    await page.getByRole('button', { name: /View Orders/i }).click();
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: /Order History/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: product.name })).toBeVisible();
    await expect(page.getByText('PENDING').first()).toBeVisible();
  });

  test('viewing the cart as a brand-new user shows an empty cart (no error)', async ({ page }) => {
    // Regression guard for the GET /cart 404-for-new-users bug: a fresh user
    // has no cart row yet, and the cart page must render the empty state
    // without logging a failed cart-fetch error.
    const cartErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /cart/i.test(msg.text())) cartErrors.push(msg.text());
    });

    await registerAndLogin(page, newCustomer('emptycart'));
    await page.goto('/cart');

    await expect(page.getByRole('heading', { name: /Your Cart is Empty/i })).toBeVisible();
    expect(cartErrors).toHaveLength(0);
  });
});
