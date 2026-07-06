/**
 * Backend API helpers used to set up preconditions and to exercise the API
 * directly (some tests need a specific server-side state, e.g. an existing
 * order to update). Every helper takes a Playwright APIRequestContext.
 */
import { BACKEND_URL, ADMIN } from './config.js';

/** A unique email so registration never collides with existing data. */
export function uniqueEmail(prefix = 'user') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}@test.com`;
}

/** A fresh customer object with a valid 10-digit phone (required by the backend). */
export function newCustomer(prefix = 'user') {
  return {
    fullName: 'E2E Buyer',
    email: uniqueEmail(prefix),
    password: 'Passw0rd!',
    phone: '9876543210',
  };
}

export async function adminLogin(request) {
  const res = await request.post(`${BACKEND_URL}/admin/login`, { data: ADMIN });
  if (!res.ok()) throw new Error(`Admin login failed: HTTP ${res.status()}`);
  return (await res.json()).token;
}

export async function getProducts(request) {
  const res = await request.get(`${BACKEND_URL}/products?size=50`);
  if (!res.ok()) throw new Error(`GET /products failed: HTTP ${res.status()}`);
  return (await res.json()).content ?? [];
}

export async function createProduct(request, token, product) {
  const res = await request.post(`${BACKEND_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
    data: product,
  });
  if (!res.ok()) throw new Error(`Create product failed: HTTP ${res.status()}`);
  return res.json();
}

const SEED_PRODUCTS = [
  { name: 'E2E Wireless Headphones', description: 'Noise cancelling over-ear headphones.', price: 129.99, imageUrl: 'https://placehold.co/400x300?text=Headphones', category: 'Electronics', stock: 50, rating: 4.5 },
  { name: 'E2E Mechanical Keyboard', description: 'Hot-swappable RGB keyboard.', price: 89.5, imageUrl: 'https://placehold.co/400x300?text=Keyboard', category: 'Electronics', stock: 50, rating: 4.7 },
  { name: 'E2E Coffee Mug', description: 'Ceramic 350ml mug.', price: 12.99, imageUrl: 'https://placehold.co/400x300?text=Mug', category: 'Home', stock: 200, rating: 4.0 },
];

/** Ensure the catalog has at least `min` products; seed some if not. Returns the products. */
export async function ensureProducts(request, min = 3) {
  let products = await getProducts(request);
  if (products.length >= min) return products;

  const token = await adminLogin(request);
  for (const p of SEED_PRODUCTS) {
    if ((await getProducts(request)).length >= min) break;
    await createProduct(request, token, p);
  }
  products = await getProducts(request);
  if (products.length < 1) throw new Error('Failed to seed any products');
  return products;
}

export async function registerViaApi(request, user) {
  const res = await request.post(`${BACKEND_URL}/auth/register`, { data: user });
  if (!res.ok()) throw new Error(`Register failed: HTTP ${res.status()}`);
  return res.json();
}

export async function loginViaApi(request, { email, password }) {
  const res = await request.post(`${BACKEND_URL}/auth/login`, { data: { email, password } });
  if (!res.ok()) throw new Error(`Login failed: HTTP ${res.status()}`);
  return res.json(); // { token, refreshToken, role, ... }
}

/**
 * Create a brand-new customer, add one product to their cart, and place an
 * order — entirely via the API. Returns the placed OrderResponse (has orderId,
 * status PENDING). Used as a precondition for the admin order-status test.
 */
export async function createPendingOrderViaApi(request) {
  const products = await ensureProducts(request, 1);
  const user = newCustomer('apiorder');
  await registerViaApi(request, user);
  const { token } = await loginViaApi(request, user);
  const auth = { Authorization: `Bearer ${token}` };

  const addRes = await request.post(`${BACKEND_URL}/cart/add`, {
    headers: auth,
    data: { productId: products[0].id, quantity: 1 },
  });
  if (!addRes.ok()) throw new Error(`Add to cart failed: HTTP ${addRes.status()}`);

  const orderRes = await request.post(`${BACKEND_URL}/orders/place`, {
    headers: auth,
    data: { deliveryAddress: 'API Setup Lane 1', contactNumber: '9876543210', paymentMethod: 'COD' },
  });
  if (!orderRes.ok()) throw new Error(`Place order failed: HTTP ${orderRes.status()}`);
  return orderRes.json();
}
