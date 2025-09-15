import React, { useState } from 'react';

function LoginRegisterPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isLogin ? 'login' : 'register';
    const requestBody = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(
        `https://merchant-backend2-afbdgva6d4d9c4g0.francecentral-01.azurewebsites.net/api/MerchantAuth/${endpoint}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let errorMessage = isLogin ? 'Login Failed' : 'Register Failed';
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
      
      if (isLogin) {
        onLogin(data.merchant);
      } else {
        setSuccess('Register Successful');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Register'} error:`, err);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
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
        <h2 style={{ color: '#222', fontSize: 22, marginBottom: 24, textAlign: 'center' }}>
          {isLogin ? 'Merchant Login' : 'Merchant Register'}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Name"
              style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
            />
          )}
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Email"
            style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
          />
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Password"
            style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
          />
          
          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: 14 }}>{success}</div>}
          
          <button
            type="button"
            onClick={handleSubmit}
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
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            type="button"
            onClick={switchMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterPage;