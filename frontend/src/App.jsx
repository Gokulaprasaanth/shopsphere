import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Routes
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoutes';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

// Customer Pages
import { Products } from './pages/customer/Products/Products';
import { ProductDetails } from './pages/customer/ProductDetails/ProductDetails';
import { Cart } from './pages/customer/Cart/Cart';
import { Checkout, OrderSuccess } from './pages/customer/Checkout/Checkout';
import { Orders } from './pages/customer/Orders/Orders';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard/Dashboard';
import { AdminProducts } from './pages/admin/Products/AdminProducts';
import { AdminOrders } from './pages/admin/Orders/AdminOrders';
import { AdminUsers } from './pages/admin/Users/AdminUsers';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<Login />} />
              </Route>

              {/* Customer Routes */}
              <Route element={<CustomerLayout />}>
                {/* Public Customer Routes */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                
                {/* Requires Login (Any role) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/orders" element={<Orders />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
              </Route>

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/products" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                  <h1>404 - Page Not Found</h1>
                  <a href="/" style={{ color: 'var(--primary)' }}>Go to Home</a>
                </div>
              } />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
