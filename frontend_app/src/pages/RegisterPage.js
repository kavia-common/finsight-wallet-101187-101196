import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      nav('/');
    } catch (e) {
      setError(e.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 40 }}>
      <h2>Create your account</h2>
      <p className="label">Start managing your finances</p>
      <form onSubmit={submit} className="card" style={{ marginTop: 16 }}>
        <FormField label="Name" htmlFor="name">
          <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <input id="email" className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <input id="password" className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </FormField>
        {error && <div style={{ color: 'tomato', marginBottom: 8 }}>{error}</div>}
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="btn" type="submit">Sign up</button>
          <Link className="App-link" to="/login">Have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}
