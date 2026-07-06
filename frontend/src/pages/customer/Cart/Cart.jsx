import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { Button } from '../../../components/ui/Button/Button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import styles from './Cart.module.css';

export const Cart = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleUpdateQty = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateQuantity(itemId, newQty);
    } else {
      removeItem(itemId);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>
          <ShoppingBag size={64} />
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => navigate('/products')} size="lg" className={styles.shopBtn}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Shopping Cart</h1>

      <div className={styles.content}>
        <div className={styles.cartItems}>
          <div className={styles.tableHeader}>
            <div className={styles.colProduct}>Product</div>
            <div className={styles.colPrice}>Price</div>
            <div className={styles.colQty}>Quantity</div>
            <div className={styles.colTotal}>Total</div>
            <div className={styles.colAction}></div>
          </div>

          {cart.items.map((item) => (
            <div key={item.cartItemId} className={styles.cartItemRow}>
              <div className={styles.colProduct}>
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/150'} 
                  alt={item.productName} 
                  className={styles.productImage}
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
                />
                <div className={styles.productInfo}>
                  <h3 onClick={() => navigate(`/products/${item.productId}`)}>
                    {item.productName}
                  </h3>
                  <span className={styles.category}>Product</span>
                </div>
              </div>

              <div className={styles.colPrice}>
                ₹{item.price?.toFixed(2)}
              </div>

              <div className={styles.colQty}>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleUpdateQty(item.cartItemId, item.quantity, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQty(item.cartItemId, item.quantity, 1)}>+</button>
                </div>
              </div>

              <div className={styles.colTotal}>
                ₹{item.subtotal?.toFixed(2)}
              </div>

              <div className={styles.colAction}>
                <button 
                  className={styles.removeBtn} 
                  onClick={() => removeItem(item.cartItemId)}
                  title="Remove Item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
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
              className={styles.checkoutBtn} 
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
