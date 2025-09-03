import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('demo@finsight.test');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      nav('/');
    } catch (e) {
      setError(e.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, marginTop: 40 }}>
      <h2>Welcome back</h2>
      <p className="label">Sign in to your account</p>
      <form onSubmit={submit} className="card" style={{ marginTop: 16 }}>
        <FormField label="Email" htmlFor="email">
          <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </FormField>
        {error && <div style={{ color: 'tomato', marginBottom: 8 }}>{error}</div>}
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="btn" type="submit">Login</button>
          <Link className="App-link" to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
