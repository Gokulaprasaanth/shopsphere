# ShopSphere — End-to-End Tests

Playwright integration tests that drive the **whole stack** (React frontend →
Spring Boot backend → PostgreSQL) through a real browser and cover the complete
user and admin flows.

## What is covered

| Spec | Flow |
|------|------|
| `e2e/storefront.spec.js` | Home → product listing, product grid, product detail page |
| `e2e/auth.spec.js` | Register, login, bad-credentials error, protected-route redirect, USER blocked from admin, admin login |
| `e2e/shopping.spec.js` | Register → add to cart → update quantity → checkout → **order placed** → order history; plus empty-cart-for-new-user regression check |
| `e2e/admin.spec.js` | Admin dashboard stats, add product, update order status (PENDING→SHIPPED), users list |

Tests create their own data (unique emails, timestamped product names) and use
the API to set up preconditions, so they are independent and repeatable.

## Prerequisites

The stack must be running before you run the tests:

1. **PostgreSQL** with database `ecommerce_db` reachable by the backend.
2. **Backend** on `http://localhost:8080`:
   ```bash
   # from the repo root
   JAVA_HOME=/opt/homebrew/opt/openjdk@25/libexec/openjdk.jdk/Contents/Home \
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/ecommerce_db \
   DB_PASSWORD=post123 \
   ./mvnw spring-boot:run
   ```
3. **Frontend** on `http://localhost:5173`:
   ```bash
   cd frontend && npm run dev -- --port 5173 --strictPort
   ```

`globalSetup` checks both servers are reachable and seeds a few products if the
catalog is empty; if a server is down it fails immediately with a clear message.

## Install & run

```bash
cd tests
npm install
npx playwright install chromium   # one-time: download the browser
npm test                          # run all e2e tests (headless)
```

Other commands:

```bash
npm run test:headed   # watch the browser
npm run test:ui       # Playwright UI mode
npm run report        # open the HTML report after a run
npx playwright test e2e/shopping.spec.js   # run one file
```

## Configuration

Override endpoints/credentials via env vars (defaults in `utils/config.js`):

- `FRONTEND_URL` (default `http://localhost:5173`)
- `BACKEND_URL` (default `http://localhost:8080`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default `admin@ecommerce.com` / `Admin@123`)
