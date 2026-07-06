import { useState, useEffect } from 'react';
import { ProductService } from '../../../services/product.service';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Loader } from '../../../components/ui/Loader/Loader';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import styles from './AdminProducts.module.css';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '', description: '', price: '', category: '', stock: '', imageUrl: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await ProductService.getAllProducts({ keyword, size: 50 }); // Fetch more for admin list
      setProducts(res.content || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setEditMode(true);
    } else {
      setCurrentProduct({ name: '', description: '', price: '', category: '', stock: '', imageUrl: '' });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentProduct,
        price: parseFloat(currentProduct.price),
        stock: parseInt(currentProduct.stock, 10),
      };

      if (editMode) {
        await ProductService.updateProduct(currentProduct.id, payload);
      } else {
        await ProductService.addProduct(payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. Please check all fields.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading && products.length === 0) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenModal()} className={styles.addBtn}>
          <Plus size={20} /> Add Product
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} className={styles.productImg} />
                </td>
                <td className={styles.nameCell}>{product.name}</td>
                <td><span className={styles.categoryBadge}>{product.category}</span></td>
                <td>₹{product.price?.toFixed(2)}</td>
                <td>
                  <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => handleOpenModal(product)} className={styles.editBtn}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className={styles.emptyState}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <Input label="Product Name *" name="name" value={currentProduct.name} onChange={handleChange} required />
              <Input label="Description" name="description" value={currentProduct.description} onChange={handleChange} />
              
              <div className={styles.formRow}>
                <Input label="Price *" type="number" step="0.01" name="price" value={currentProduct.price} onChange={handleChange} required />
                <Input label="Stock *" type="number" name="stock" value={currentProduct.stock} onChange={handleChange} required />
              </div>
              
              <div className={styles.formGroup}>
                <label>Category *</label>
                <select 
                  name="category" 
                  value={currentProduct.category} 
                  onChange={handleChange} 
                  required
                  className={styles.select}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Beauty & Health">Beauty & Health</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Books & Stationery">Books & Stationery</option>
                  <option value="Toys & Games">Toys & Games</option>
                  <option value="Automotive">Automotive</option>
                </select>
              </div>
              <Input label="Image URL" name="imageUrl" value={currentProduct.imageUrl} onChange={handleChange} />
              
              <div className={styles.modalActions}>
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">{editMode ? 'Update Product' : 'Save Product'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
