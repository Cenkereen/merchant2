import React, { useEffect, useState } from 'react';
import EditProduct from './EditProductPage';
import AddProduct from './AddProductPage';

function ProductSection({
  products,
  setProducts,
  productName,
  setProductName,
  productPrice,
  setProductPrice,
  handleAddProduct,
  merchant
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const API_BASE = "https://merchant.somee.com/api";

  // Replaces alert and confirm for a better user experience
  const displayMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchProducts = async () => {
    if (!merchant?.id) {
      setProducts([]);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found');
      setProducts([]);
      displayMessage('Your session has expired. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Product`, {
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (res.ok) {
        const allProducts = await res.json();
        const filteredProducts = allProducts.filter(
          p => parseInt(p.merchantId) === parseInt(merchant.id)
        );
        setProducts(filteredProducts);
      } else {
        if (res.status === 401) {
          displayMessage('Your session has expired. Please log in again.');
        } else {
          displayMessage('Failed to fetch products.');
        }
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      displayMessage('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [merchant?.id, fetchProducts]);

  const handleEditClick = (index, product) => {
    setEditingProduct({ ...product, index });
  };

  const handleCancelEdit = () => setEditingProduct(null);

  const handleDeleteProduct = async (index) => {
    const product = products[index];
    if (!product?.id) {
      displayMessage('Product ID not found');
      return;
    }

    // Use a state-based confirmation instead of window.confirm
    setConfirmingDelete(product);
  };

  const confirmDelete = async () => {
    const product = confirmingDelete;
    if (!product) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      displayMessage('Authentication token missing. Please log in again.');
      return;
    }

    setLoading(true);
    setConfirmingDelete(null); // Close confirmation message

    try {
      const res = await fetch(`${API_BASE}/Product/${product.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        // Refresh the product list after a successful deletion
        await fetchProducts();
        if (editingProduct && editingProduct.id === product.id) {
            handleCancelEdit();
        }
        displayMessage('Product deleted successfully.');
      } else {
        const errorText = await res.text();
        console.error('Delete failed:', errorText);
        displayMessage('Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      displayMessage('Error deleting product.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => setConfirmingDelete(null);

  const handleAddProductClick = () => setShowAddProduct(true);
  const handleCancelAdd = () => setShowAddProduct(false);

  // Return EditProductPage or AddProductPage if they are active
  if (editingProduct) {
    return (
      <EditProduct
        editingProduct={editingProduct}
        products={products}
        setProducts={setProducts}
        onCancel={handleCancelEdit}
        merchant={merchant}
        onSave={fetchProducts}
      />
    );
  }

  if (showAddProduct) {
    return (
      <AddProduct
        products={products}
        setProducts={setProducts}
        onCancel={handleCancelAdd}
        productName={productName}
        setProductName={setProductName}
        productPrice={productPrice}
        setProductPrice={setProductPrice}
        handleAddProduct={handleAddProduct}
        merchant={merchant}
        onSave={fetchProducts}
      />
    );
  }

  return (
    <section style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ color: '#222', fontSize: 20, margin: 0 }}>Your Products</h2>
        <button onClick={handleAddProductClick} style={{
          padding: '10px 20px',
          background: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer'
        }}>+ Add Product</button>
      </div>

      {message && (
        <div style={{ padding: '10px', backgroundColor: '#e9f7ef', color: '#28a745', borderRadius: '4px', marginBottom: '16px' }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ color: '#666', fontSize: 15, marginTop: 8 }}>Loading products...</div>
      ) : products.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 500, color: '#666', textAlign: 'left' }}>Name</th>
                <th style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 500, color: '#666', textAlign: 'left' }}>Price</th>
                <th style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 500, color: '#666', textAlign: 'left' }}>Created</th>
                <th style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 500, color: '#666', textAlign: 'center', width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id || index} style={{ background: index % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>{product.name}</td>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>${product.price?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>
                    {product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}
                  </td>
                  <td style={{ padding: 8, verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <button onClick={() => handleEditClick(index, product)} style={{
                        padding: '4px 8px',
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 3,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 500
                      }}>Edit</button>
                      <button onClick={() => handleDeleteProduct(index)} style={{
                        padding: '4px 8px',
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 3,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 500
                      }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: 15, marginTop: 8 }}>No products found for your merchant account.</div>
      )}

      {confirmingDelete && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <p style={{ margin: '0 0 16px' }}>Are you sure you want to delete "{confirmingDelete.name}"?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={confirmDelete} style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Yes, Delete</button>
            <button onClick={handleCancelDelete} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductSection;
