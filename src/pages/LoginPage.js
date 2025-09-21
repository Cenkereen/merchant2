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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      let response;

      if (isLogin) {
        // Login with improved headers
        response = await fetch(`${API_AUTH}/login`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
      } else {
        // Register with improved headers
        response = await fetch(API_MERCHANT, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
        // Store tokens securely
        if (data.accessToken && data.refreshToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('tokenExpiry', data.expiresAt || new Date(Date.now() + 15 * 60 * 1000).toISOString());
          
          onLogin(data.merchant);
        } else {
          setError('Invalid response from server');
        }
      } else {
        setSuccess('Registration successful! Please login.');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      console.error('Request failed:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (err.message.includes('CORS')) {
        setError('Connection blocked by security policy. Please contact support.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
      background: '#f7f7f7',
      padding: '20px'
    }}>
      <div style={{ 
        background: '#fff', 
        padding: 32, 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
        minWidth: 320, 
        width: '100%', 
        maxWidth: 400 
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: 24,
          color: '#333'
        }}>
          {isLogin ? 'Merchant Login' : 'Merchant Register'}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              disabled={isLoading}
              style={{ 
                padding: 12, 
                borderRadius: 4, 
                border: '1px solid #ddd',
                fontSize: 14,
                opacity: isLoading ? 0.6 : 1
              }}
            />
          )}
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            required
            disabled={isLoading}
            style={{ 
              padding: 12, 
              borderRadius: 4, 
              border: '1px solid #ddd',
              fontSize: 14,
              opacity: isLoading ? 0.6 : 1
            }}
          />
          
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
            disabled={isLoading}
            style={{ 
              padding: 12, 
              borderRadius: 4, 
              border: '1px solid #ddd',
              fontSize: 14,
              opacity: isLoading ? 0.6 : 1
            }}
          />
          
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              fontSize: 14,
              padding: 8,
              backgroundColor: '#ffebee',
              borderRadius: 4,
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              color: '#2e7d32', 
              fontSize: 14,
              padding: 8,
              backgroundColor: '#e8f5e8',
              borderRadius: 4,
              border: '1px solid #c8e6c9'
            }}>
              {success}
            </div>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ 
              padding: 12, 
              background: isLoading ? '#ccc' : '#222', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 4, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: '500'
            }}
          >
            {isLoading 
              ? (isLogin ? 'Logging in...' : 'Registering...') 
              : (isLogin ? 'Login' : 'Register')
            }
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button 
            onClick={switchMode} 
            disabled={isLoading}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isLoading ? '#ccc' : '#666', 
              textDecoration: 'underline', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterPage;