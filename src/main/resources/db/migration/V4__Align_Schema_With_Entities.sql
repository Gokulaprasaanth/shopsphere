-- V4: Align the database schema with the JPA entities.
--
-- Several columns are mapped by the entities but were never created by the
-- earlier migrations. With `spring.jpa.hibernate.ddl-auto=validate`, Hibernate
-- validates the mapped columns against the live schema at startup, so every one
-- of these gaps prevented the application from booting
-- (e.g. "Schema-validation: missing column [total_price] in table [cart]").
--
-- These statements are additive and idempotent (IF NOT EXISTS), so they are safe
-- on both a fresh database and one where V1-V3 already ran.

-- Cart.totalPrice
ALTER TABLE cart        ADD COLUMN IF NOT EXISTS total_price      DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CartItem.subtotal
ALTER TABLE cart_items  ADD COLUMN IF NOT EXISTS subtotal         DOUBLE PRECISION;

-- OrderItem.subtotal
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS subtotal         DOUBLE PRECISION;

-- Order.orderDate / Order.deliveryAddress / Order.paymentMethod
-- (V1 created an unused `shipping_address`; the entity maps `delivery_address`.)
ALTER TABLE orders      ADD COLUMN IF NOT EXISTS order_date       TIMESTAMP;
ALTER TABLE orders      ADD COLUMN IF NOT EXISTS delivery_address TEXT;
ALTER TABLE orders      ADD COLUMN IF NOT EXISTS payment_method   VARCHAR(100);
