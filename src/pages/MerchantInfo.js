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
  const API_URL = "https://merchant.somee.com/api";

  const handleUpdateField = async (field, value) => {
    if (!merchant?.merchantId) {
      alert('Merchant information is missing. Please try logging out and logging back in.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/Merchant/${merchant.merchantId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ [field]: value })
      });

      if (res.ok) {
        const updatedMerchant = await res.json();
        setMerchantData(updatedMerchant);
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
        if (field === 'password') setMerchantPassword('');
      } else {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert(errorJson.message || `Failed to update ${field}`);
        } catch {
          alert(`Failed to update ${field}. Status: ${res.status}`);
        }
      }
    } catch (err) {
      console.error(`Network error updating ${field}:`, err);
      alert(`Error connecting to server: ${err.message}`);
    }
  };

  const handleMerchantNameUpdate = (e) => {
    e.preventDefault();
    handleUpdateField('name', merchantName);
  };

  const handleMerchantEmailUpdate = (e) => {
    e.preventDefault();
    handleUpdateField('email', merchantEmailState);
  };

  const handleMerchantPasswordUpdate = (e) => {
    e.preventDefault();
    handleUpdateField('password', merchantPassword);
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
