import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Package, Sun, Moon } from 'lucide-react';
import styles from './Auth.module.css'; // Shared CSS for auth pages

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're trying to login as admin
  const isAdminPath = location.pathname.includes('admin');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(formData, isAdminPath);
    setIsLoading(false);

    if (result.success) {
      navigate(isAdminPath ? '/admin' : '/products');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle Dark Mode"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <Package size={48} className={styles.logo} />
          <h2>{isAdminPath ? 'Admin Login' : 'Welcome Back'}</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          
          <Button type="submit" className={styles.submitBtn} isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {!isAdminPath && (
          <div className={styles.footer}>
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};
