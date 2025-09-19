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

  const API_BASE = "https://merchant.somee.com/api";

  const fetchProducts = async () => {
    if (!merchant?.id) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Product`, {
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${merchant.accessToken}`
        },
      });

      if (res.ok) {
        const allProducts = await res.json();
        const filteredProducts = allProducts.filter(p =>
          parseInt(p.merchantId) === parseInt(merchant.id)
        );
        setProducts(filteredProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [merchant?.id]);

  const handleEditClick = (index, product) => {
    setEditingProduct({ ...product, index });
  };

  const handleCancelEdit = () => setEditingProduct(null);

  const handleDeleteProduct = async (index) => {
    const product = products[index];
    if (!product?.productId) return alert('Product ID not found');
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_BASE}/Product/${product.productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${merchant.accessToken}` }
      });

      if (res.ok) {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);

        if (editingProduct && editingProduct.index === index) handleCancelEdit();
        else if (editingProduct && editingProduct.index > index)
          setEditingProduct({ ...editingProduct, index: editingProduct.index - 1 });
      } else {
        const errorText = await res.text();
        console.error('Delete failed:', errorText);
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting product');
    }
  };

  const handleAddProductClick = () => setShowAddProduct(true);
  const handleCancelAdd = () => setShowAddProduct(false);

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
    <section>
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
                <tr key={product.productId || index} style={{ background: index % 2 === 0 ? '#fff' : '#fafbfc' }}>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>{product.name}</td>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>${product.price?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>{product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}</td>
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
    </section>
  );
}

export default ProductSection;
