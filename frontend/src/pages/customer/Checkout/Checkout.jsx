import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { OrderService } from '../../../services/order.service';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { CheckCircle, CreditCard, Wallet, Landmark, Banknote } from 'lucide-react';
import styles from './Checkout.module.css';

export const Checkout = () => {
  const { cart, clearCartState } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    contactNumber: '',
    paymentMethod: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart?.items?.length) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.deliveryAddress || !formData.contactNumber) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const order = await OrderService.placeOrder(formData);
      clearCartState(); // local clear since backend clears the cart on placeOrder
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Checkout</h1>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2>Delivery Details</h2>
            {error && <div className={styles.errorAlert}>{error}</div>}
            <form onSubmit={handlePlaceOrder} className={styles.form}>
              <Input
                label="Delivery Address *"
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Enter your full address"
              />
              <Input
                label="Contact Number *"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="e.g. 1234567890"
              />
              <div className={styles.paymentSection}>
                <h3>Payment Method</h3>
                <div className={styles.paymentOptions}>
                  <label className={`${styles.paymentOption} ${formData.paymentMethod === 'CARD' ? styles.activeOption : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="CARD" 
                      checked={formData.paymentMethod === 'CARD'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <CreditCard size={20} className={styles.paymentIcon} />
                    <span>Credit / Debit Card</span>
                  </label>
                  
                  <label className={`${styles.paymentOption} ${formData.paymentMethod === 'UPI' ? styles.activeOption : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="UPI" 
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <Wallet size={20} className={styles.paymentIcon} />
                    <span>UPI (Google Pay, PhonePe)</span>
                  </label>

                  <label className={`${styles.paymentOption} ${formData.paymentMethod === 'NETBANKING' ? styles.activeOption : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="NETBANKING" 
                      checked={formData.paymentMethod === 'NETBANKING'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <Landmark size={20} className={styles.paymentIcon} />
                    <span>Net Banking</span>
                  </label>

                  <label className={`${styles.paymentOption} ${formData.paymentMethod === 'COD' ? styles.activeOption : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className={styles.radioInput}
                    />
                    <Banknote size={20} className={styles.paymentIcon} />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
            <div className={styles.itemsList}>
              {cart.items.map(item => (
                <div key={item.cartItemId} className={styles.itemRow}>
                  <span>{item.quantity}x {item.productName}</span>
                  <span>₹{item.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{cart.totalPrice?.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{cart.totalPrice?.toFixed(2)}</span>
            </div>
            <Button 
              className={styles.placeOrderBtn} 
              size="lg"
              onClick={handlePlaceOrder}
              isLoading={loading}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.successContainer}>
      <CheckCircle size={80} className={styles.successIcon} />
      <h1>Order Placed Successfully!</h1>
      <p>Your order has been confirmed and is being processed.</p>
      <div className={styles.actions}>
        <Button onClick={() => navigate('/orders')}>View Orders</Button>
        <Button variant="outline" onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    </div>
  );
};
