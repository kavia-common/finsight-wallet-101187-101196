import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/apiClient';
import TransactionForm from '../components/TransactionForm';
import { formatCurrency, formatDate } from '../utils/format';

// PUBLIC_INTERFACE
export default function TransactionsPage() {
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [accounts, txs] = await Promise.all([
        api.accounts.list(),
        api.transactions.listByAccount(accountId),
      ]);
      setAccount(accounts.find((a) => a.id === accountId) || null);
      setTransactions(txs);
    } catch (e) {
      setError(e.message || 'Failed to load transactions');
    }
  };

  useEffect(() => { load(); }, [accountId]);

  const onAdd = async (payload) => {
    setError(null);
    try {
      await api.transactions.create(accountId, payload);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete transaction?')) return;
    await api.transactions.remove(id);
    await load();
  };

  const totals = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((s,t)=>s+t.amount,0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s,t)=>s+t.amount,0);
    return { income: inc, expense: exp };
  }, [transactions]);

  return (
    <div className="container" style={{ marginTop: 20 }}>
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row" style={{ alignItems: 'baseline' }}>
          <h2>Transactions</h2>
          <span className="badge">{account?.name || '...'}</span>
        </div>
        <Link className="App-link" to="/accounts">← Back to Accounts</Link>
      </div>
      {error && <div style={{ color: 'tomato', marginBottom: 8 }}>{error}</div>}

      <div className="row" style={{ marginTop: 12 }}>
        <div className="col">
          <div className="card">
            <div className="label">Income</div>
            <div className="kpi"><div /> <div className="value">{formatCurrency(totals.income, account?.currency)}</div></div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="label">Expense</div>
            <div className="kpi"><div /> <div className="value">{formatCurrency(totals.expense, account?.currency)}</div></div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="label">Balance</div>
            <div className="kpi"><div /> <div className="value">{formatCurrency(account?.balance || 0, account?.currency)}</div></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <TransactionForm onSubmit={onAdd} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <table className="list">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{formatDate(t.date)}</td>
                <td><span className="badge">{t.type}</span></td>
                <td style={{ color: t.type === 'income' ? 'green' : 'tomato' }}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, account?.currency)}
                </td>
                <td>{t.description || '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-outline" onClick={() => onDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
