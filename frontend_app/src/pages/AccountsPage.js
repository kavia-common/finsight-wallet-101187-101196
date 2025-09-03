import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import AccountForm from '../components/AccountForm';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

// PUBLIC_INTERFACE
export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await api.accounts.list();
      setAccounts(data);
    } catch (e) {
      setError(e.message || 'Failed to load accounts');
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (payload) => {
    setError(null);
    try {
      await api.accounts.create(payload);
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onUpdate = async (payload) => {
    setError(null);
    try {
      await api.accounts.update(editing.id, payload);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete account?')) return;
    await api.accounts.remove(id);
    await load();
  };

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Accounts</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Close' : 'New Account'}
          </button>
        </div>
      </div>
      {error && <div style={{ color: 'tomato', marginBottom: 8 }}>{error}</div>}
      {showForm && <AccountForm onSubmit={onCreate} onCancel={() => setShowForm(false)} />}
      {editing && <AccountForm initial={editing} onSubmit={onUpdate} onCancel={() => setEditing(null)} />}

      <div className="card" style={{ marginTop: 16 }}>
        <table className="list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Currency</th>
              <th>Balance</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td><span className="badge">{a.type}</span></td>
                <td>{a.currency}</td>
                <td>{formatCurrency(a.balance, a.currency)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="row" style={{ justifyContent: 'flex-end' }}>
                    <Link className="App-link" to={`/accounts/${a.id}/transactions`}>Transactions</Link>
                    <button className="btn btn-outline" onClick={() => setEditing(a)}>Edit</button>
                    <button className="btn btn-outline" onClick={() => onDelete(a.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                  No accounts yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
