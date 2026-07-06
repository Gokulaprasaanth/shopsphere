# E-Commerce React Frontend

A production-ready React 19 frontend built with Vite, seamlessly integrating with a Spring Boot backend.

## Features Included
- **Modern UI**: Clean, responsive aesthetic using plain CSS modules and Lucide React icons.
- **State Management**: React Context API for global `Auth` and `Cart` state.
- **Routing**: React Router with protected route handling based on JWT roles (`USER`, `ADMIN`).
- **Axios Interceptors**: Automated Bearer token injection and expired token handling.
- **Customer Pages**: Products browsing, product details, cart management, checkout flow, and order history.
- **Admin Dashboard**: Comprehensive dashboard for viewing stats, managing products, orders, and viewing users.
- **Missing Backend Features Skipped**: As per instructions, Wishlist, Addresses, and Password Reset were skipped as they lacked backend endpoints.

## Folder Structure
```text
src/
 ├── assets/         # Static assets (if any)
 ├── components/     
 │    ├── layout/    # Navbar, Footer
 │    └── ui/        # Button, Input, Loader (Generic UI elements)
 ├── context/        # AuthContext, CartContext
 ├── layouts/        # CustomerLayout, AdminLayout
 ├── pages/
 │    ├── admin/     # Admin Dashboard, Products, Orders, Users
 │    ├── customer/  # Products list, Details, Cart, Checkout, Orders
 │    └── public/    # Login, Register
 ├── routes/         # ProtectedRoute wrappers
 ├── services/       # Axios API services
 ├── App.jsx         # Main router configuration
 ├── main.jsx        # Entry point
 └── index.css       # Global styles and variables
```

## How to Run

1. **Start the Backend**: Make sure your Spring Boot backend is running on `http://localhost:8080`.
2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Start the Frontend**:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173`.

## Authentication Flow
- By default, `GET /products` on the backend requires a logged-in user. The homepage redirects to `/products`, which in turn redirects guests to `/login`.
- Register a new account or log in with an existing one.
- To access the admin panel, login through the `/admin/login` page (link available on standard login page) using an account with `ADMIN` role.

## Technologies Used
- React 19
- Vite
- React Router v6
- Axios
- Lucide React (Icons)
- CSS Modules
