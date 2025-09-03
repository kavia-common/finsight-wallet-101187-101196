import React, { useState } from 'react';
import FormField from './FormField';

// PUBLIC_INTERFACE
export default function AccountForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    type: initial.type || 'checking',
    currency: initial.currency || 'USD',
    startingBalance: initial.balance ?? initial.startingBalance ?? 0,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="row">
        <FormField label="Account Name" htmlFor="accName">
          <input id="accName" className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </FormField>
        <FormField label="Type" htmlFor="accType">
          <select id="accType" className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit</option>
            <option value="investment">Investment</option>
          </select>
        </FormField>
        <FormField label="Currency" htmlFor="accCcy">
          <select id="accCcy" className="input" value={form.currency} onChange={(e) => update('currency', e.target.value)}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </FormField>
        <FormField label="Starting Balance" htmlFor="accBal">
          <input id="accBal" className="input" type="number" step="0.01" value={form.startingBalance}
                 onChange={(e) => update('startingBalance', e.target.value)} />
        </FormField>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>}
        <button className="btn" type="submit">Save</button>
      </div>
    </form>
  );
}
