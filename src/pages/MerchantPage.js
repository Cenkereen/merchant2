import React, { useState, useEffect } from 'react';
import MerchantInfo from './MerchantInfo';
import ProductSection from './ProductSection';
import TransactionsSection from './TransactionsSection';

function SidebarButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? '#fff' : 'transparent',
        color: active ? '#232526' : '#fff',
        border: 'none',
        borderLeft: active ? '5px solid #4f8cff' : '5px solid transparent',
        borderRadius: '0 6px 6px 0',
        padding: '10px 20px',
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        margin: 0,
        textAlign: 'left',
        outline: 'none',
        transition: 'background 0.18s, color 0.18s, border 0.18s',
        boxShadow: active ? '0 2px 8px 0 rgba(79,140,255,0.07)' : undefined,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </button>
  );
}

function MerchantPage({ merchant, onLogout }) {
  const [merchantData, setMerchantData] = useState(merchant);
  const [merchantName, setMerchantName] = useState(merchant?.name || '');
  const [merchantEmailState, setMerchantEmailState] = useState(merchant?.email || '');
  const [merchantPassword, setMerchantPassword] = useState('');

  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const [activeSection, setActiveSection] = useState('merchant');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (merchant) {
      setMerchantData(merchant);
      setMerchantName(merchant.name || '');
      setMerchantEmailState(merchant.email || '');
    }
  }, [merchant]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productName || !productPrice) return;
    setProducts([
      ...products,
      {
        name: productName,
        price: parseFloat(productPrice),
        createdAt: new Date(),
      },
    ]);
    setProductName('');
    setProductPrice('');
  };

  const updateInputStyle = {
    padding: '6px 8px',
    borderRadius: 4,
    border: '1px solid #ddd',
    fontSize: 14,
    flex: 3,
    minWidth: 0,
    boxSizing: 'border-box',
  };
  const updateButtonStyle = {
    padding: '6px 8px',
    background: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    flex: 1,
    minWidth: 0,
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f7f7f7',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 210,
          background: 'linear-gradient(180deg, #232526 0%, #414345 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 16,
          paddingBottom: 16,
          boxShadow: '2px 0 16px 0 rgba(0,0,0,0.07)',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 1,
            textAlign: 'center',
            marginBottom: 24,
            color: '#fff',
            userSelect: 'none',
          }}
        >
          Merchant Panel
        </div>
        <SidebarButton
          active={activeSection === 'merchant'}
          onClick={() => setActiveSection('merchant')}
        >
          <span role="img" aria-label="info" style={{ marginRight: 8 }}>
            👤
          </span>
          Merchant Info
        </SidebarButton>
        <SidebarButton
          active={activeSection === 'product'}
          onClick={() => setActiveSection('product')}
        >
          <span role="img" aria-label="product" style={{ marginRight: 8 }}>
            📦
          </span>
          Products
        </SidebarButton>
        <SidebarButton
          active={activeSection === 'transactions'}
          onClick={() => setActiveSection('transactions')}
        >
          <span role="img" aria-label="transactions" style={{ marginRight: 8 }}>
            💳
          </span>
          Transactions
        </SidebarButton>
        <div style={{ flex: 1 }} />
        <button
          onClick={onLogout}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? 'red' : 'rgba(255,255,255,0.08)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 0',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            margin: '16px',
            transition: 'background 0.2s',
            marginTop: 'auto',
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 600,
            width: '100%',
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {activeSection === 'merchant' && (
            <MerchantInfo
              merchant={merchantData}
              merchantName={merchantName}
              setMerchantName={setMerchantName}
              merchantEmailState={merchantEmailState}
              setMerchantEmailState={setMerchantEmailState}
              merchantPassword={merchantPassword}
              setMerchantPassword={setMerchantPassword}
              setMerchantData={setMerchantData}
              updateInputStyle={updateInputStyle}
              updateButtonStyle={updateButtonStyle}
            />
          )}

          {activeSection === 'product' && (
            <ProductSection
              merchant={merchantData}
              products={products}
              setProducts={setProducts}
              productName={productName}
              setProductName={setProductName}
              productPrice={productPrice}
              setProductPrice={setProductPrice}
              handleAddProduct={handleAddProduct}
            />
          )}

          {activeSection === 'transactions' && (
            <TransactionsSection merchant={merchantData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MerchantPage;
