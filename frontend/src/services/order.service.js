import api from './api';

export const OrderService = {
  placeOrder: async (orderData) => {
    const response = await api.post('/orders/place', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};
