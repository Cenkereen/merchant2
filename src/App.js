import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import MerchantPage from './pages/MerchantPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [merchant, setMerchant] = useState(null);

  const handleLogin = (merchantObj) => {
    setIsLoggedIn(true);
    setMerchant(merchantObj);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMerchant(null);
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MerchantPage merchant={merchant} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;