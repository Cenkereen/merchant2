import React, { useState } from 'react';

function AddProduct({ 
  products, 
  setProducts, 
  onCancel,
  productName,
  setProductName,
  productPrice,
  setProductPrice,
  handleAddProduct,
  merchant,
  onSave
}) {
  const [localName, setLocalName] = useState(productName || '');
  const [localPrice, setLocalPrice] = useState(productPrice || '');
  const [loading, setLoading] = useState(false);

  const API_URL = "https://merchant-backend2-afbdgva6d4d9c4g0.francecentral-01.azurewebsites.net";

  const handleSaveProduct = async () => {
    if (!localName.trim() || !localPrice || parseFloat(localPrice) < 0) return;
    setLoading(true);

    try {
      // Add product
      const res = await fetch(`${API_URL}/api/Product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          merchantId: merchant.merchantId,
          name: localName.trim(),
          price: parseFloat(localPrice)
        })
      });

      if (res.ok) {
        // Use the same approach as ProductSection - fetch all products and filter
        const productsRes = await fetch(`${API_URL}/api/Product`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include'
        });
        
        if (productsRes.ok) {
          const allProducts = await productsRes.json();
          const filteredProducts = allProducts.filter(product => 
            parseInt(product.merchantId) === parseInt(merchant.merchantId)
          );
          setProducts(filteredProducts);
        }
        
        // Clear the form and go back
        setLocalName('');
        setLocalPrice('');
        if (onSave) onSave(); // Call onSave callback if provided
        onCancel();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }

    setLoading(false);
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 8px',
            background: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          ← Back
        </button>
        <h2 style={{ color: '#222', fontSize: 20, margin: 0 }}>Add Product</h2>
      </div>
      <div style={{ 
        background: '#f9f9f9', 
        padding: 20, 
        borderRadius: 8, 
        border: '1px solid #e5e5e5',
        maxWidth: 400
      }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#333' }}>
            Product Name
          </label>
          <input
            type="text"
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              fontSize: 15,
              boxSizing: 'border-box'
            }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#333' }}>
            Price ($)
          </label>
          <input
            type="number"
            value={localPrice}
            onChange={e => setLocalPrice(e.target.value)}
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              fontSize: 15,
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSaveProduct}
            disabled={!localName.trim() || !localPrice || parseFloat(localPrice) < 0 || loading}
            style={{
              padding: '10px 20px',
              background: (!localName.trim() || !localPrice || parseFloat(localPrice) < 0 || loading) ? '#ccc' : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 500,
              cursor: (!localName.trim() || !localPrice || parseFloat(localPrice) < 0 || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddProduct;