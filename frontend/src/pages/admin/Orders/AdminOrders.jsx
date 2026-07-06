import { useState, useEffect } from 'react';
import { AdminService } from '../../../services/admin.service';
import { Loader } from '../../../components/ui/Loader/Loader';
import { Edit } from 'lucide-react';
import styles from './AdminOrders.module.css';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Status update modal state
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setCurrentOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await AdminService.updateOrderStatus(currentOrder.orderId, newStatus);
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  if (loading && orders.length === 0) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
              <tr>
                <th>Order ID</th>
                <th>Product(s)</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
              <tr key={order.orderId}>
                <td className={styles.boldCell}>#{order.orderId}</td>
                <td className={styles.boldCell} title={order.productNames}>
                  {order.productNames && order.productNames.length > 30 
                    ? order.productNames.substring(0, 30) + '...' 
                    : order.productNames || 'N/A'}
                </td>
                <td>{order.customerName || 'N/A'}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className={styles.boldCell}>₹{order.totalAmount?.toFixed(2)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[order.status?.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className={styles.actionBtn}
                    onClick={() => handleOpenStatusModal(order)}
                    title="Update Status"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className={styles.emptyState}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Update Order Status</h2>
            <p>Order #{currentOrder?.orderId}</p>
            
            <form onSubmit={handleUpdateStatus} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className={styles.select}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
