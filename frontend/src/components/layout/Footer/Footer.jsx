import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>E-Shop</h3>
            <p>Your one-stop destination for everything you need. Quality products, competitive prices.</p>
          </div>
          <div className={styles.section}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/products">Products</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>
          <div className={styles.section}>
            <h3>Contact</h3>
            <p>Email: support@eshop.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
