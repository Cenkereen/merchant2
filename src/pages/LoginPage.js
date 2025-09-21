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

  // Base URLs
  const API_AUTH = "https://merchant.somee.com/api/Auth";
  const API_MERCHANT = "https://merchant.somee.com/api/Merchant";

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

    try {
      let response;

      if (isLogin) {
        // Login
        response = await fetch(`${API_AUTH}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
      } else {
        // Register
        response = await fetch(API_MERCHANT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || (isLogin ? 'Login failed' : 'Register failed'));
        return;
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        onLogin(data.merchant);
      } else {
        setSuccess('Register successful');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', minWidth: 320, width: '100%', maxWidth: 340 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isLogin ? 'Merchant Login' : 'Merchant Register'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
              style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
            style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
          />
          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: 14 }}>{success}</div>}
          <button onClick={handleSubmit} style={{ padding: 10, background: '#222', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={switchMode} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterPage;
