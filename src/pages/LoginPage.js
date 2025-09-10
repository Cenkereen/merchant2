import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(
        'https://merchant-backend2-afbdgva6d4d9c4g0.francecentral-01.azurewebsites.net/api/MerchantAuth/login',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include', // needed if your API uses cookies or auth headers
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        let errorMessage = 'Giriş başarısız';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      onLogin(data.merchant);
    } catch (err) {
      console.error('Login error:', err);
      setError('Sunucuya bağlanılamıyor - CORS hatası olabilir');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f7f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: 32,
          minWidth: 320,
          width: '100%',
          maxWidth: 340,
        }}
      >
        <h2 style={{ color: '#222', fontSize: 22, marginBottom: 24, textAlign: 'center' }}>Merchant Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
          />
          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          <button
            type="submit"
            style={{
              padding: '10px 0',
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
