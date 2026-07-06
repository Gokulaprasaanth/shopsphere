import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProductService } from '../../../services/product.service';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Loader } from '../../../components/ui/Loader/Loader';
import { Search, ShoppingCart, Star, Truck, RefreshCcw, ShieldCheck, Headphones, Package, ShoppingBag, Check } from 'lucide-react';
import styles from './Products.module.css';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories] = useState([
    'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Health', 
    'Sports & Outdoors', 'Books & Stationery', 'Toys & Games', 'Automotive'
  ]); 
  const [addingIds, setAddingIds] = useState({});

  const heroMessages = [
    { title: 'Upgrade Your Tech: New Arrivals', subtitle: 'Discover the latest gadgets with top quality and best prices.' },
    { title: 'Level Up Your Gaming Experience', subtitle: 'Explore high-performance gear designed for every type of gamer.' },
    { title: 'Smart Home, Smart Life', subtitle: 'Automate your living space with our top-rated connected devices.' },
    { title: 'Premium Audio Collection', subtitle: 'Immerse yourself in crystal clear sound with our new headphones and speakers.' },
    { title: 'Work From Home Essentials', subtitle: 'Create the perfect productive workspace with our ergonomic accessories.' }
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 48,
        keyword: searchQuery || undefined,
        category: category || undefined,
      };
      const response = await ProductService.getAllProducts(params);
      
      let fetchedProducts = response.content || [];
      
      // Frontend-only smart filtering:
      // 1. Prefix match for name (so "sam" matches "samsung")
      // 2. Exact word match for description (so "car" doesn't match "carrying")
      if (searchQuery) {
        const nameRegex = new RegExp(`\\b${searchQuery}`, 'i'); // Word starts with query
        const descRegex = new RegExp(`\\b${searchQuery}\\b`, 'i'); // Exact word only
        
        fetchedProducts = fetchedProducts.filter(p => 
          nameRegex.test(p.name) || (p.description && descRegex.test(p.description))
        );
      }
      
      setProducts(fetchedProducts);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      const interval = setInterval(() => {
        setHeroIndex(prev => (prev + 1) % heroMessages.length);
        setFadeKey(prev => prev + 1);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingIds(prev => ({...prev, [productId]: 'adding'}));
    await addToCart(productId, 1);
    
    setAddingIds(prev => ({...prev, [productId]: 'success'}));
    setTimeout(() => {
      setAddingIds(prev => ({...prev, [productId]: null}));
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* Horizontal Categories Row */}
      <div className={styles.topCategories}>
        <button 
          className={`${styles.categoryPill} ${!category ? styles.activePill : ''}`}
          onClick={() => { setCategory(''); setPage(0); }}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button 
            key={c}
            className={`${styles.categoryPill} ${category === c ? styles.activePill : ''}`}
            onClick={() => { setCategory(c); setPage(0); }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Hero Section - Hide if searching */}
      {!searchQuery && (
        <div className={styles.hero}>
          <div className={`${styles.heroContent} ${styles.fadeTransition}`} key={fadeKey}>
            <span className={styles.heroBadge}>BEST DEALS</span>
            <h1>{heroMessages[heroIndex].title}</h1>
            <p>{heroMessages[heroIndex].subtitle}</p>
          </div>
          <div className={styles.heroVideoContainer}>
            <div className={styles.heroGraphics}>
              <div className={`${styles.floatingElement} ${styles.laptop}`}>
                <Package size={120} color="var(--primary)" />
              </div>
              <div className={`${styles.floatingElement} ${styles.bag}`}>
                <ShoppingBag size={80} color="#10B981" />
              </div>
              <div className={`${styles.floatingElement} ${styles.tag}`}>
                <Star size={60} color="#F59E0B" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Banner */}
      <div className={styles.featuresBanner}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Truck size={24} color="var(--primary)" />
          </div>
          <div className={styles.featureText}>
            <strong>Free Shipping</strong>
            <span>On orders above ₹499</span>
          </div>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <RefreshCcw size={24} color="var(--primary)" />
          </div>
          <div className={styles.featureText}>
            <strong>Easy Returns</strong>
            <span>30 days return policy</span>
          </div>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <ShieldCheck size={24} color="var(--primary)" />
          </div>
          <div className={styles.featureText}>
            <strong>Secure Payment</strong>
            <span>100% secure checkout</span>
          </div>
        </div>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Headphones size={24} color="var(--primary)" />
          </div>
          <div className={styles.featureText}>
            <strong>24/7 Support</strong>
            <span>Dedicated support</span>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {searchQuery && (
          <h2 className={styles.searchResultTitle} style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Search results for "{searchQuery}"
          </h2>
        )}
        
        {/* Product Grid */}
        <div className={styles.productsArea}>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No products found</h2>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {products.map(product => (
                  <div 
                    key={product.id} 
                    className={styles.card}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className={styles.imageWrapper}>
                      <img 
                        src={product.imageUrl || 'https://placehold.co/300x300/F3E8FF/7C3AED?text=Image+Not+Available'} 
                        alt={product.name} 
                        className={styles.image}
                        onError={(e) => {e.target.src = 'https://placehold.co/300x300/F3E8FF/7C3AED?text=Image+Not+Available'}}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.categoryBadge}>{product.category}</span>
                      <h3 className={styles.productName}>{product.name}</h3>
                      {/* Rating removed as requested */}
                      <div className={styles.cardFooter}>
                        <span className={styles.price}>₹{product.price?.toFixed(2)}</span>
                        <Button 
                          size="sm" 
                          onClick={(e) => handleAddToCart(e, product.id)}
                          disabled={product.stock === 0 || addingIds[product.id] === 'adding'}
                          isLoading={addingIds[product.id] === 'adding'}
                          style={{ backgroundColor: addingIds[product.id] === 'success' ? 'var(--secondary)' : '' }}
                        >
                          {addingIds[product.id] === 'success' ? (
                            <Check size={16} />
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
