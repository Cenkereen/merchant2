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

  // Fetch real products from backend on mount
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://cardmanagement-awfgh2ewgqbxa4dy.francecentral-01.azurewebsites.net/api/Product');
      const data = await res.json();
      // Filter products by merchantId
      const filtered = data.filter(p => p.merchantId === merchant.merchantId);
      setProducts(filtered);
    } catch (err) {
      // Optionally show error
    }
  };
  fetchProducts();
  // eslint-disable-next-line
}, [merchant]);

  const handleEditClick = (index, product) => {
    setEditingProduct({ ...product, index });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (index) => {
    const product = products[index];
    if (!product || !product.productId) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`https://cardmanagement-awfgh2ewgqbxa4dy.francecentral-01.azurewebsites.net/api/Product/${product.productId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          // Remove product from local state
          const updatedProducts = products.filter((_, i) => i !== index);
          setProducts(updatedProducts);
          if (editingProduct && editingProduct.index === index) {
            handleCancelEdit();
          } else if (editingProduct && editingProduct.index > index) {
            setEditingProduct({ ...editingProduct, index: editingProduct.index - 1 });
          }
        } else {
          alert('Failed to delete product');
        }
      } catch {
        alert('Error deleting product');
      }
    }
  };

  const handleAddProductClick = () => {
    setShowAddProduct(true);
  };

  const handleCancelAdd = () => {
    setShowAddProduct(false);
  };

  if (editingProduct) {
    return (
      <EditProduct
        editingProduct={editingProduct}
        products={products}
        setProducts={setProducts}
        onCancel={handleCancelEdit}
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
      />
    );
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ color: '#222', fontSize: 20, margin: 0 }}>Products</h2>
        <button
          onClick={handleAddProductClick}
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
      <h3 style={{ color: '#444', fontSize: 17, margin: '24px 0 10px 0' }}>All Products</h3>
      {products.length > 0 ? (
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
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>
                    ${product.price.toFixed(2)}
                  </td>
                  <td style={{ padding: 8, verticalAlign: 'middle' }}>
                    {product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}
                  </td>
                  <td style={{ padding: 8, verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEditClick(index, product)}
                        style={{
                          padding: '4px 8px',
                          background: '#007bff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 3,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(index)}
                        style={{
                          padding: '4px 8px',
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 3,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: '#888', fontSize: 15, marginTop: 8 }}>No products yet.</div>
      )}
    </section>
  );
}

export default ProductSection;