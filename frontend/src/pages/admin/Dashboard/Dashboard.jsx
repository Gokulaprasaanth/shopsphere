import { useState, useEffect } from 'react';
import { AdminService } from '../../../services/admin.service';
import { Loader } from '../../../components/ui/Loader/Loader';
import { Users, ShoppingBag, Coins, Package } from 'lucide-react';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await AdminService.getDashboard();
        setStats(dashboardData);
        
        // Fetch recent orders as well
        const allOrders = await AdminService.getAllOrders();
        // Sort by ID descending (mocking newest first) and take top 5
        const sortedOrders = allOrders.sort((a, b) => b.orderId - a.orderId).slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  if (!stats) return <div>Failed to load dashboard statistics.</div>;

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toFixed(2) || '0.00'}`, icon: <Coins size={24} />, color: 'var(--secondary)' },
    { title: 'Total Orders', value: stats.totalOrders || 0, icon: <ShoppingBag size={24} />, color: 'var(--primary)' },
    { title: 'Total Users', value: stats.totalUsers || 0, icon: <Users size={24} />, color: 'var(--accent)' },
    { title: 'Total Products', value: stats.totalProducts || 0, icon: <Package size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.statInfo}>
              <h3 className={styles.statTitle}>{card.title}</h3>
              <p className={styles.statValue}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity Grid */}
      <div className={styles.dashboardGrid}>
        {/* CSS Bar Chart */}
        <div className={styles.chartCard}>
          <h3>Revenue Analytics (Last 7 Days)</h3>
          <div className={styles.chartContainer}>
            <div className={styles.yAxis}>
              <span>₹150k</span>
              <span>₹100k</span>
              <span>₹50k</span>
              <span>0</span>
            </div>
            <div className={styles.barsArea}>
              {[40, 65, 45, 80, 55, 90, 100].map((height, i) => (
                <div key={i} className={styles.barColumn}>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}></div>
                  </div>
                  <span className={styles.barLabel}>Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className={styles.chartCard}>
          <h3>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <div className={styles.emptyState}>No orders yet.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.orderId}>
                      <td className={styles.orderId}>#{order.orderId}</td>
                      <td>{order.customerName}</td>
                      <td className={styles.orderAmount}>₹{order.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[order.status?.toLowerCase()] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
