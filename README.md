# ShopSphere Backend

This is the Spring Boot backend for the ShopSphere e-commerce application.

## Prerequisites
- Java 25
- PostgreSQL
- Maven

## Configuration
The application is configured using `application.properties` (or `application.yml`). For production deployments, you MUST override the database password and JWT secret using environment variables:
- `DB_PASSWORD`: The database password (defaults to `post123` for local development).
- `JWT_SECRET`: A strong secret key used for signing JWTs (default provided for local dev).

Example:
```bash
export DB_PASSWORD=my_secure_db_password
export JWT_SECRET=my_very_long_secure_jwt_secret_key_12345
```

## Database Migrations
We use Flyway for database version control. Migrations run automatically when the application starts. 
- Migration scripts are located in `src/main/resources/db/migration/`.
- Ensure your local PostgreSQL instance has a database named `ecommerce_db` running on `localhost:5432`.

## Starting the Application
You can start the application using the Maven wrapper:
```bash
./mvnw spring-boot:run
```

## Default Admin Credentials
When the application runs for the first time, an `AdminInitializer` creates a default admin account. **WARNING: This account is for local development only and MUST NOT be used as-is in production.**

- **Email**: admin@ecommerce.com
- **Password**: Admin@123

## REST Endpoints Summary

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /admin/login` - Admin login
- `POST /auth/refresh` - Refresh JWT token

### Products
- `GET /products` - Get all products (Public, supports search, filter, pagination)
- `GET /products/{id}` - Get product by ID (Public)
- `POST /products` - Add a new product (Admin)
- `PUT /products/{id}` - Update a product (Admin)
- `DELETE /products/{id}` - Delete a product (Admin)

### Cart
- `GET /cart` - View current user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update item quantity in cart
- `DELETE /cart/remove/{cartItemId}` - Remove item from cart

### Orders
- `GET /orders` - Get current user's orders
- `GET /orders/{id}` - Get specific order by ID
- `POST /orders/place` - Place a new order
- `PUT /orders/{id}/cancel` - Cancel an order

### Admin Dashboard
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/{id}/status` - Update order status

### Users
- `GET /users/me` - Get current user's profile
- `GET /users` - Get all users (Admin)
