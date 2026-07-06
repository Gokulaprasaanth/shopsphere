import { createContext, useState, useEffect, useContext } from 'react';
import { CartService } from '../services/cart.service';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    
    try {
      setLoading(true);
      const data = await CartService.getCart();
      setCart(data || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await CartService.addToCart(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to add to cart' };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await CartService.updateQuantity(cartItemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await CartService.removeItem(cartItemId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove item' };
    }
  };

  const clearCartState = () => {
    setCart({ items: [], totalPrice: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, fetchCart, clearCartState }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
