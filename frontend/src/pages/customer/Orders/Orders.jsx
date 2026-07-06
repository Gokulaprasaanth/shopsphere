import { useState, useEffect } from 'react';
import { OrderService } from '../../../services/order.service';
import { Loader } from '../../../components/ui/Loader/Loader';
import { PackageOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
import styles from './Orders.module.css';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className={styles.statusIcon} style={{ color: 'var(--accent)' }} />;
      case 'DELIVERED':
        return <CheckCircle className={styles.statusIcon} style={{ color: 'var(--secondary)' }} />;
      case 'CANCELLED':
        return <XCircle className={styles.statusIcon} style={{ color: 'var(--danger)' }} />;
      default:
        return <PackageOpen className={styles.statusIcon} style={{ color: 'var(--primary)' }} />;
    }
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <PackageOpen size={64} className={styles.emptyIcon} />
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Order History</h1>
      
      <div className={styles.ordersList}>
        {orders.map(order => (
          <div key={order.orderId} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>Order #{order.orderId}</span>
                <span className={styles.orderDate}>
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <div className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </div>
            </div>
            
            <div className={styles.orderBody}>
              <div className={styles.itemsList}>
                {order.items?.map(item => (
                  <div key={item.productId} className={styles.itemRow}>
                    <img 
                      src={item.productImage || 'https://via.placeholder.com/60'} 
                      alt={item.productName} 
                      className={styles.itemImage}
                      onError={(e) => {e.target.src = 'https://via.placeholder.com/60'}}
                    />
                    <div className={styles.itemDetails}>
                      <h4>{item.productName}</h4>
                      <p>Qty: {item.quantity} x ₹{item.price?.toFixed(2)}</p>
                    </div>
                    <div className={styles.itemSubtotal}>
                      ₹{item.subtotal?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.orderFooter}>
              <div className={styles.deliveryInfo}>
                <strong>Deliver to:</strong> {order.deliveryAddress} ({order.contactNumber})
              </div>
              <div className={styles.totalAmount}>
                Total: <span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
