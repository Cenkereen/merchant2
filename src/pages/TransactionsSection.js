import React, { useState } from 'react';

function TransactionsSection({ merchant }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use the same API base as other components
const API_BASE = 'http://merchant.somee.com';

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!fromDate || !toDate) {
      setError('Please select both from and to dates');
      setLoading(false);
      return;
    }

    if (!merchant?.merchantId) {
      setError('Merchant ID is missing');
      setLoading(false);
      return;
    }

    try {
      const fromISO = new Date(fromDate).toISOString();
      const toISO = new Date(toDate).toISOString();

      const res = await fetch(`${API_BASE}/api/Report/transactions/filter`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          merchantId: merchant.merchantId,
          from: fromISO,
          to: toISO
        })
      });

      if (!res.ok) {
        if (res.status === 404) {
          setTransactions([]);
          setLoading(false);
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Transaction fetch error:', err);
      setError('Error fetching transactions: ' + err.message);
      setTransactions([]);
    }

    setLoading(false);
  };

  return (
    <section>
      <h2 style={{ color: '#222', fontSize: 20, marginBottom: 12 }}>Transactions</h2>

      {error && <div style={{ background: '#fee', color: '#c00', padding: '8px 12px', borderRadius: 4, marginBottom: 12, fontSize: 14 }}>{error}</div>}

      <form onSubmit={handleFilter} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#666' }}>From:</label>
          <input type="datetime-local" value={fromDate} onChange={e => setFromDate(e.target.value)} required style={{ padding: '8px 10px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#666' }}>To:</label>
          <input type="datetime-local" value={toDate} onChange={e => setToDate(e.target.value)} required style={{ padding: '8px 10px', borderRadius: 4, border: '1px solid #ddd', fontSize: 14 }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '8px 18px', background: loading ? '#ccc' : '#222', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, border: '1px solid #eee' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #eee', fontWeight: 600, color: '#555', textAlign: 'left' }}>Transaction ID</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #eee', fontWeight: 600, color: '#555', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #eee', fontWeight: 600, color: '#555', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #eee', fontWeight: 600, color: '#555', textAlign: 'left' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? transactions.map((tx, idx) => (
            <tr key={tx.transactionId || idx} style={{ background: idx % 2 === 0 ? '#fff' : '#fafbfc', borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 8px' }}>{tx.transactionId || '-'}</td>
              <td style={{ padding: '10px 8px', fontWeight: 500 }}>${tx.totalAmount?.toFixed(2) || '0.00'}</td>
              <td style={{ padding: '10px 8px' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                  background: tx.status === 'Completed' ? '#e8f5e8' : tx.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                  color: tx.status === 'Completed' ? '#0f5132' : tx.status === 'Pending' ? '#664d03' : '#721c24'
                }}>
                  {tx.status || 'Unknown'}
                </span>
              </td>
              <td style={{ padding: '10px 8px', color: '#666' }}>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '-'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} style={{ color: '#888', fontSize: 14, padding: 20, textAlign: 'center', fontStyle: 'italic' }}>
                {loading ? 'Loading transactions...' : 'No transactions found for the selected date range.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default TransactionsSection;