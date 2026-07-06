import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Package, Sun, Moon } from 'lucide-react';
import styles from './Auth.module.css';

export const Register = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    phone: '',
    role: 'USER' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      navigate('/login');
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
          <h2>Create an Account</h2>
          <p>Join us today to start shopping.</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name *"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <Input
            label="Email Address *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            label="Password *"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 1234567890"
          />
          
          <Button type="submit" className={styles.submitBtn} isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <div className={styles.footer}>
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};
