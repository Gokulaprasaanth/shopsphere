import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Users, ShoppingBag, LayoutDashboard, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './AdminLayout.module.css';
import { useState } from 'react';

export const AdminLayout = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
  ];

  return (
    <div className={styles.layout}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.fullName}</p>
            <p className={styles.userRole}>Administrator</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className={styles.headerTitle}>
              {navItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
            </div>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.themeToggleBtn}
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/" className={styles.storeLink}>View Store</Link>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
