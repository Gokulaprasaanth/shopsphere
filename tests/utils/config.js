/**
 * Shared configuration for the e2e suite.
 * Override via env vars when the stack runs on non-default hosts/ports.
 */
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Seeded by the backend's AdminInitializer on first startup.
export const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123',
};
