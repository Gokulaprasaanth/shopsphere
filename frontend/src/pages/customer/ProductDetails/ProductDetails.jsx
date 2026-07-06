import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService } from '../../../services/product.service';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button/Button';
import { Loader } from '../../../components/ui/Loader/Loader';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, Check } from 'lucide-react';
import styles from './ProductDetails.module.css';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    await addToCart(product.id, quantity);
    setAddingToCart(false);
    
    // Show success feedback
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  if (loading) return <Loader fullScreen />;

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/products')}>
        <ArrowLeft size={20} /> Back to Products
      </button>

      <div className={styles.grid}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/600?text=No+Image'} 
              alt={product.name} 
              className={styles.image}
              onError={(e) => {e.target.src = 'https://via.placeholder.com/600?text=No+Image'}}
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.categoryBadge}>{product.category}</span>
          <h1 className={styles.title}>{product.name}</h1>
          
          {/* Rating removed as requested */}

          <div className={styles.price}>
            ₹{product.price?.toFixed(2)}
          </div>

          <p className={styles.description}>
            {product.description}
          </p>

          <div className={styles.stockInfo}>
            Status: <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.stock > 0 && <span className={styles.stockCount}>({product.stock} available)</span>}
          </div>

          {product.stock > 0 && (
            <div className={styles.actionSection}>
              <div className={styles.quantityControl}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className={styles.qtyBtn}
                >-</button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className={styles.qtyBtn}
                >+</button>
              </div>

              <Button 
                size="lg" 
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                isLoading={addingToCart}
                style={{ backgroundColor: addedSuccess ? 'var(--secondary)' : '' }}
              >
                {addedSuccess ? (
                  <><Check size={20} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={20} /> Add to Cart</>
                )}
              </Button>
            </div>
          )}

          <div className={styles.features}>
            <div className={styles.feature}>
              <Truck size={24} className={styles.featureIcon} />
              <div>
                <h4>Free Delivery</h4>
                <p>On orders over ₹50</p>
              </div>
            </div>
            <div className={styles.feature}>
              <ShieldCheck size={24} className={styles.featureIcon} />
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
