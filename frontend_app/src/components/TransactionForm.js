import React, { useState } from 'react';
import FormField from './FormField';

// PUBLIC_INTERFACE
export default function TransactionForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.amount) return;
    onSubmit?.({ ...form, amount: Number(form.amount) });
    setForm({ type: 'expense', amount: '', description: '' });
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="row">
        <FormField label="Type">
          <select className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </FormField>
        <FormField label="Amount">
          <input className="input" type="number" step="0.01" value={form.amount} onChange={(e) => update('amount', e.target.value)} required />
        </FormField>
        <FormField label="Description">
          <input className="input" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Optional" />
        </FormField>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>}
        <button className="btn" type="submit">Add</button>
      </div>
    </form>
  );
}
