import api from './api';

export const AdminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};
