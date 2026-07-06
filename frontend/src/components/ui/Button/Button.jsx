import styles from './Button.module.css';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading = false, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span> : children}
    </button>
  );
};
