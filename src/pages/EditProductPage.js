import React, { useState } from 'react';

function EditProductPage({ editingProduct, products, setProducts, onCancel, merchant, onSave }) {
  const [editName, setEditName] = useState(editingProduct?.name || '');
  const [editPrice, setEditPrice] = useState(editingProduct?.price?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Somee hosted backend API
  const API_URL = "https://merchant.somee.com/api";

  const displayMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editPrice || parseFloat(editPrice) < 0) return;
    setLoading(true);

    // ✅ FIX: Retrieve token from localStorage, not from the merchant prop
    const token = localStorage.getItem('accessToken');
    if (!token) {
      displayMessage('Authentication token missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/Product/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Use the retrieved token
        },
        body: JSON.stringify({
          name: editName.trim(),
          price: parseFloat(editPrice),
        }),
      });

      if (res.ok) {
        // Since the onSave prop is provided, we'll let the parent component refresh the data
        if (onSave) onSave(); 
        onCancel();
      } else {
        const errorData = await res.json().catch(() => ({}));
        displayMessage(errorData.message || 'Failed to update product');
      }
    } catch (err) {
      console.error(err);
      displayMessage('Error connecting to server');
    }

    setLoading(false);
  };

  return (
    <section style={{ padding: '20px' }}>
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
            gap: 4,
          }}
        >
          ← Back
        </button>
        <h2 style={{ color: '#222', fontSize: 20, margin: 0 }}>Edit Product</h2>
      </div>

      {message && (
        <div style={{ padding: '10px', backgroundColor: '#ffe9e9', color: '#dc3545', borderRadius: '4px', marginBottom: '16px' }}>
          {message}
        </div>
      )}

      <div
        style={{
          background: '#f9f9f9',
          padding: 20,
          borderRadius: 8,
          border: '1px solid #e5e5e5',
          maxWidth: 400,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 500,
              color: '#333',
            }}
          >
            Product Name
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              fontSize: 15,
              boxSizing: 'border-box',
            }}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 500,
              color: '#333',
            }}
          >
            Price ($)
          </label>
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              fontSize: 15,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSaveEdit}
            disabled={!editName.trim() || !editPrice || parseFloat(editPrice) < 0 || loading}
            style={{
              padding: '10px 20px',
              background:
                !editName.trim() || !editPrice || parseFloat(editPrice) < 0 || loading
                  ? '#ccc'
                  : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 500,
              cursor:
                !editName.trim() || !editPrice || parseFloat(editPrice) < 0 || loading
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
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
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

export default EditProductPage;
