import { useState, useEffect } from 'react';
import { AdminService } from '../../../services/admin.service';
import { Loader } from '../../../components/ui/Loader/Loader';
import { Shield, User as UserIcon } from 'lucide-react';
import styles from './AdminUsers.module.css';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await AdminService.getAllUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading && users.length === 0) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className={styles.boldCell}>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.admin : styles.user}`}>
                    {user.role === 'ADMIN' ? <Shield size={14} /> : <UserIcon size={14} />}
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className={styles.emptyState}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
