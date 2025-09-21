import React, { useEffect, useState } from 'react';
import EditProductPage from './EditProductPage';
import AddProductPage from './AddProductPage';

function ProductSection({ products, setProducts, merchant }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = "https://merchant.somee.com/api";

  const displayMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const getProductId = (product) => product.productId || product.ProductId || product.id || product.Id;

  const fetchProducts = async () => {
    if (!merchant?.id) {
      setProducts([]);
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      displayMessage('No authentication token found. Please log in again.');
      setProducts([]);
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

      if (!res.ok) throw new Error('Failed to fetch products');
      const allProducts = await res.json();
      console.log("Fetched products:", allProducts);

      const filteredProducts = allProducts.filter(
        p => parseInt(p.merchantId) === parseInt(merchant.id)
      );
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      displayMessage('Error connecting to server.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [merchant?.id]);

  const handleEditClick = (product) => setEditingProduct(product);
  const handleCancelEdit = () => setEditingProduct(null);

  const handleDeleteProduct = async (product) => {
    const productId = getProductId(product);
    if (!productId) {
      displayMessage('Product ID missing. Cannot delete.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      displayMessage('Authentication token missing. Please log in again.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/Product/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchProducts();
        if (editingProduct && getProductId(editingProduct) === productId) {
          handleCancelEdit();
        }
      } else {
        const errorText = await res.text();
        console.error('Delete failed:', errorText);
        displayMessage('Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      displayMessage('Error deleting product.');
    }
  };

  if (editingProduct) {
    return (
      <EditProductPage
        editingProduct={editingProduct}
        onCancel={handleCancelEdit}
        onSave={fetchProducts}
      />
    );
  }

  if (showAddProduct) {
    return (
      <AddProductPage
        onCancel={() => setShowAddProduct(false)}
        merchant={merchant}
        onSave={fetchProducts}
      />
    );
  }

  return (
    <section style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ color: '#222', fontSize: 20, margin: 0 }}>Your Products</h2>
        <button
          onClick={() => setShowAddProduct(true)}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          + Add Product
        </button>
      </div>

      {message && (
        <div style={{ padding: '10px', backgroundColor: '#ffe9e9', color: '#dc3545', borderRadius: '4px', marginBottom: '16px' }}>
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
              {products.map((product) => {
                const productId = getProductId(product);
                return (
                  <tr key={productId}>
                    <td style={{ padding: 8, verticalAlign: 'middle' }}>{product.name}</td>
                    <td style={{ padding: 8, verticalAlign: 'middle' }}>${product.price?.toFixed(2) || '0.00'}</td>
                    <td style={{ padding: 8, verticalAlign: 'middle' }}>
                      {product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}
                    </td>
                    <td style={{ padding: 8, verticalAlign: 'middle', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button onClick={() => handleEditClick(product)} style={{
                          padding: '4px 8px',
                          background: '#007bff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 3,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 500
                        }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product)} style={{
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
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: 15, marginTop: 8 }}>No products found for your merchant account.</div>
      )}
    </section>
  );
}

export default ProductSection;
