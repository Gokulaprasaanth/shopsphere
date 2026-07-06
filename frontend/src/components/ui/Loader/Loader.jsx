import styles from './Loader.module.css';

export const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className="spinner"></div>
    </div>
  );
};
