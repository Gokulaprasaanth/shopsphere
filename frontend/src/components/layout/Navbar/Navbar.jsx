import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { ShoppingBag, Search, Heart, User, MapPin, LogOut, LayoutDashboard, Menu, Sun, Moon, X, Package } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import styles from './Navbar.module.css';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Navigate to products and pass the search keyword via URL query params
      navigate(`/products?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate(`/products`);
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    
    // If user completely clears the input while on the search page, automatically clear the search results
    if (value.trim() === '' && location.pathname === '/products' && location.search.includes('search=')) {
      navigate('/products');
    }
  };

  const handleClear = () => {
    setKeyword('');
    if (location.pathname === '/products' && location.search.includes('search=')) {
      navigate('/products');
    }
  };

  return (
    <header className={styles.header}>
      {/* Main Navbar */}
      <div className={styles.mainNav}>
        <div className={styles.container}>
          
          <Link to="/" className={styles.logo}>
            <ShoppingBag size={28} className={styles.logoIcon} />
            <span>ShopSphere</span>
          </Link>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search for products, brands and more..." 
                value={keyword}
                onChange={handleKeywordChange}
              />
              {keyword && (
                <button type="button" className={styles.clearBtn} onClick={handleClear}>
                  <X size={16} />
                </button>
              )}
              <button type="submit" className={styles.searchBtn}>Search</button>
            </div>
          </form>

          <div className={styles.actions}>
            {/* Mobile Search Toggle */}
            <button 
              className={styles.mobileSearchBtn} 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search size={20} />
            </button>
            <button 
              className={styles.themeToggleBtn}
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Orders Link in Main Nav */}
            {user && (
              <Link to="/orders" className={styles.actionItem}>
                <Package size={20} />
                <div className={styles.actionText}>
                  <span className={styles.smallText}>Track</span>
                  <strong>Orders</strong>
                </div>
              </Link>
            )}

            <Link to="/cart" className={styles.actionItem}>
              <div className={styles.cartIconWrapper}>
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemCount}</span>
                )}
              </div>
              <div className={styles.actionText}>
                <span className={styles.smallText}>Your</span>
                <strong>Cart</strong>
              </div>
            </Link>

            {user ? (
              <div 
                className={styles.userMenu}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className={styles.actionItem} style={{ cursor: 'pointer' }}>
                  <User size={20} />
                  <div className={styles.actionText}>
                    <span className={styles.smallText}>Hello,</span>
                    <strong>{user.fullName || 'User'}</strong>
                  </div>
                </div>
                <div className={`${styles.dropdown} ${isUserMenuOpen ? styles.showDropdown : ''}`}>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className={styles.dropdownItem}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={styles.actionItem}>
                <User size={20} />
                <div className={styles.actionText}>
                  <span className={styles.smallText}>Sign In</span>
                  <strong>My Account</strong>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Wrapper */}
      {isMobileSearchOpen && (
        <div className={styles.mobileSearchContainer}>
          <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={keyword}
              onChange={handleKeywordChange}
              autoFocus
            />
            {keyword && (
              <button type="button" className={styles.clearBtn} onClick={handleClear}>
                <X size={16} />
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>
      )}

    </header>
  );
};
