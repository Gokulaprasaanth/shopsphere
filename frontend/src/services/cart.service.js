import api from './api';

export const CartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  updateQuantity: async (cartItemId, quantity) => {
    const response = await api.put('/cart/update', { cartItemId, quantity });
    return response.data;
  },

  removeItem: async (cartItemId) => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  }
};
