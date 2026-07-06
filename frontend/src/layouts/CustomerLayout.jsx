import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Footer } from '../components/layout/Footer/Footer';
import styles from './CustomerLayout.module.css';

export const CustomerLayout = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
