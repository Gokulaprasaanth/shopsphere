# Walkthrough

## Summary of Fixes

### Priority 1: Critical (App won't start)
- Added a new Flyway migration `V3__Rename_Product_Table.sql` to gracefully handle the discrepancy in table naming (`product` vs `products`). The script includes an `IF EXISTS` check to prevent errors on previously upgraded databases.

### Priority 2: Security
- Externalized JWT secrets in `JwtService` and `application.properties`. 
- Modified `application.properties` to allow defining `DB_PASSWORD` and `JWT_SECRET` via environment variables.
- Removed sensitive console logging in `JwtAuthenticationFilter` and altered Spring Security debug log level in properties.
- Addressed the Insecure Direct Object Reference (IDOR) issue in `CartService` by verifying whether the `cartItem` belongs to the `cart` of the currently authenticated `User`. 

### Priority 3: API Correctness
- Implemented proper `ResponseEntity` objects to ensure accurate HTTP status codes are returned (e.g. `201 Created` for adding products/registering users and `204 No Content` for deletions).
- Appended request payload validations (`@NotNull`, `@Min`, `@NotBlank`) into `AddToCartRequest`, `UpdateCartRequest`, and `PlaceOrderRequest`, along with incorporating `@Valid` in `CartController` and `OrderController`.

### Priority 4: Testing
- Engineered full unit tests within `OrderServiceTest` checking logic for placing and cancelling orders as well as expected `BadRequestException` scenarios.
- Crafted unit tests in `DashboardServiceTest` for obtaining dashboard statistics and order statuses, adding a `setId` method in the `Order` entity to facilitate correct object reflection.

### Priority 5: Frontend Fixes
- Added `<option value="CONFIRMED">CONFIRMED</option>` to `AdminOrders.jsx` dropdown, rendering a complete mapping to the Java Enum.
- Cleaned up obsolete code by scrubbing away unused states such as `setCategories` in `Products.jsx`.
- Replaced hard-coded `localhost:8080` API URLs dynamically with `import.meta.env.VITE_API_BASE_URL` in `api.js`. Added a default fallback and generated both `.env` and `.env.example` records.

### Priority 6: Hygiene / Docs
- Eliminated unwanted build caches and IDE folders such as `target/` and `.idea/`. Deleted `PasswordGenerator.java`.
- Written `README.md` containing prerequisite lists, configuration guides, steps to start, REST endpoints outline, and initial admin credentials.

All backend tests pass (`mvn test`). The frontend is ready to interact dynamically via `VITE_API_BASE_URL` with improved payload validations.
