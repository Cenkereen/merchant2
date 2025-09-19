import React, { useState } from 'react';

function LoginRegisterPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Backend base URLs
  const API_AUTH = "https://merchant.somee.com/api/Auth";
  const API_MERCHANT = "https://merchant.somee.com/api/Merchant";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let response;

      if (isLogin) {
        // Login via Auth controller
        response = await fetch(`${API_AUTH}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
      } else {
        // Register via Merchant controller
        response = await fetch(API_MERCHANT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `${isLogin ? 'Login' : 'Register'} failed`);
        return;
      }

      const data = await response.json();

      if (isLogin) {
        // Save tokens for future API calls
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Notify parent component of logged-in merchant
        onLogin(data.merchant);
      } else {
        setSuccess('Registration successful! You can now login.');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
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
      <div style={{ background: '#fff', borderRadius: 8, padding: 32, width: '100%', maxWidth: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isLogin ? 'Merchant Login' : 'Merchant Register'}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
              required
            />
          )}
          
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
            required
          />
          
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
            required
          />

          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: 14 }}>{success}</div>}

          <button
            type="button"
            onClick={handleSubmit}
            style={{ padding: '10px 0', background: '#222', color: '#fff', borderRadius: 4, cursor: 'pointer' }}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={switchMode} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#666' }}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterPage;
