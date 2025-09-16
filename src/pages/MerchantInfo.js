import React from 'react';

function MerchantInfo({
  merchant,
  merchantName,
  setMerchantName,
  merchantEmailState,
  setMerchantEmailState,
  merchantPassword,
  setMerchantPassword,
  setMerchantData,
  updateInputStyle,
  updateButtonStyle
}) {
  const API_URL = "https://merchant.somee.com"; // <-- Updated URL

  const handleMerchantNameUpdate = async (e) => {
    e.preventDefault();

    if (!merchant || !merchant.merchantId) {
      alert('Merchant information is missing. Please try logging out and logging back in.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/MerchantAuth/${merchant.merchantId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name: merchantName })
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.merchant) {
          setMerchantData(responseData.merchant);
          alert('Name updated successfully');
        } else {
          alert(responseData.message || 'Failed to update name');
        }
      } else {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert(errorJson.message || 'Failed to update name');
        } catch {
          alert(`Failed to update name. Status: ${res.status}`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Error connecting to server: ' + err.message);
    }
  };

  const handleMerchantEmailUpdate = async (e) => {
    e.preventDefault();

    if (!merchant || !merchant.merchantId) {
      alert('Merchant information is missing. Please try logging out and logging back in.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/MerchantAuth/${merchant.merchantId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: merchantEmailState })
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.merchant) {
          setMerchantData(responseData.merchant);
          alert('Email updated successfully');
        } else {
          alert(responseData.message || 'Failed to update email');
        }
      } else {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert(errorJson.message || 'Failed to update email');
        } catch {
          alert(`Failed to update email. Status: ${res.status}`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Error connecting to server: ' + err.message);
    }
  };

  const handleMerchantPasswordUpdate = async (e) => {
    e.preventDefault();

    if (!merchant || !merchant.merchantId) {
      alert('Merchant information is missing. Please try logging out and logging back in.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/MerchantAuth/${merchant.merchantId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ password: merchantPassword })
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success) {
          alert('Password updated successfully');
          setMerchantPassword('');
        } else {
          alert(responseData.message || 'Failed to update password');
        }
      } else {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert(errorJson.message || 'Failed to update password');
        } catch {
          alert(`Failed to update password. Status: ${res.status}`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Error connecting to server: ' + err.message);
    }
  };

  return (
    <section>
      <h2 style={{ color: '#222', fontSize: 20, marginBottom: 12 }}>Merchant Info</h2>

      <form style={{ display: 'flex', gap: 8, marginBottom: 8 }} onSubmit={handleMerchantNameUpdate}>
        <input
          type="text"
          value={merchantName}
          onChange={e => setMerchantName(e.target.value)}
          placeholder="Merchant Name"
          style={updateInputStyle}
          required
        />
        <button type="submit" style={updateButtonStyle}>Update Name</button>
      </form>

      <form style={{ display: 'flex', gap: 8, marginBottom: 8 }} onSubmit={handleMerchantEmailUpdate}>
        <input
          type="email"
          value={merchantEmailState}
          onChange={e => setMerchantEmailState(e.target.value)}
          placeholder="Merchant Email"
          style={updateInputStyle}
          required
        />
        <button type="submit" style={updateButtonStyle}>Update Email</button>
      </form>

      <form style={{ display: 'flex', gap: 8 }} onSubmit={handleMerchantPasswordUpdate}>
        <input
          type="password"
          value={merchantPassword}
          onChange={e => setMerchantPassword(e.target.value)}
          placeholder="New Password"
          style={updateInputStyle}
          required
        />
        <button type="submit" style={updateButtonStyle}>Update Password</button>
      </form>
    </section>
  );
}

export default MerchantInfo;
