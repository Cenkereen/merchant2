import React from 'react';

function MerchantInfo({
  merchantName,
  setMerchantName,
  merchantEmailState,
  setMerchantEmailState,
  merchantPassword,
  setMerchantPassword,
  handleMerchantNameUpdate,
  handleMerchantEmailUpdate,
  handleMerchantPasswordUpdate,
  updateInputStyle,
  updateButtonStyle
}) {
  return (
    <section>
      <h2 style={{ color: '#222', fontSize: 20, marginBottom: 12 }}>Merchant Info</h2>
      <form style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={merchantName}
          onChange={e => setMerchantName(e.target.value)}
          placeholder="Merchant Name"
          style={updateInputStyle}
          required
        />
        <button
          onClick={handleMerchantNameUpdate}
          style={updateButtonStyle}
        >
          Update Name
        </button>
      </form>
      <form style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="email"
          value={merchantEmailState}
          onChange={e => setMerchantEmailState(e.target.value)}
          placeholder="Merchant Email"
          style={updateInputStyle}
          required
        />
        <button
          onClick={handleMerchantEmailUpdate}
          style={updateButtonStyle}
        >
          Update Email
        </button>
      </form>
      <form style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          value={merchantPassword}
          onChange={e => setMerchantPassword(e.target.value)}
          placeholder="New Password"
          style={updateInputStyle}
          required
        />
        <button
          onClick={handleMerchantPasswordUpdate}
          style={updateButtonStyle}
        >
          Update Password
        </button>
      </form>
    </section>
  );
}

export default MerchantInfo;