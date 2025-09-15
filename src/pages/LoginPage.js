import React, { useState } from 'react';

// Use environment variable for backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  "https://merchant-backend-hcww2wxzu-cenkereens-projects.vercel.app";

function LoginRegisterPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isLogin ? 'login' : 'register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`${BACKEND_URL}/api/MerchantAuth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // only if backend uses cookies/session
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let msg = isLogin ? 'Login Failed' : 'Register Failed';
        try {
          const data = await response.json();
          msg = data.message || msg;
        } catch {}
        setError(msg);
        return;
      }

      const data = await response.json();
      if (isLogin) {
        onLogin(data.merchant);
      } else {
        setSuccess('Registration Successful!');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => { setIsLogin(true); setSuccess(''); }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(`${isLogin ? 'Login' : 'Register'} failed. Please try again.`);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#f7f7f7',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: 32,
        minWidth: 320,
        width: '100%',
        maxWidth: 340,
      }}>
        <h2 style={{ fontSize: 22, marginBottom: 24, textAlign: 'center', color: '#222' }}>
          {isLogin ? 'Merchant Login' : 'Merchant Register'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
              style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            style={{ padding: '10px 12px', borderRadius: 4, border: '1px solid #ddd', fontSize: 15 }}
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
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
