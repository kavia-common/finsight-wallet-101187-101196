import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

// PUBLIC_INTERFACE
function App() {
  /** App shell with routing and global theme toggle */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <header className="navbar" role="navigation" aria-label="Main navigation" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', background:'var(--bg-secondary)', borderBottom:'1px solid var(--border-color)'}}>
        <div style={{display:'flex', gap:'14px', alignItems:'center'}}>
          <Link className="App-link" to="/" style={{fontWeight:700, textDecoration:'none'}}>Finsight Wallet</Link>
          <NavLinks />
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <UserArea />
        </div>
      </header>
      <main className="container" style={{padding:'16px'}}>
        <Routes>
          <Route path="/" element={<RequireAuth><InsightsPage /></RequireAuth>} />
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
          <Route path="/accounts" element={<RequireAuth><AccountsPage /></RequireAuth>} />
          <Route path="/accounts/:accountId/transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

function NavLinks() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <nav style={{display:'flex', gap:12}}>
      <Link className="App-link" to="/">Insights</Link>
      <Link className="App-link" to="/accounts">Accounts</Link>
    </nav>
  );
}

function UserArea() {
  const { user, logout } = useAuth();
  if (!user) {
    return (
      <div style={{display:'flex', gap:8}}>
        <Link className="App-link" to="/login">Login</Link>
        <Link className="App-link" to="/register">Sign up</Link>
      </div>
    );
  }
  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <span aria-label="Current user" title={user.email} style={{opacity:0.8}}>👤 {user.name || user.email}</span>
      <button className="theme-toggle" onClick={logout} aria-label="Logout">Logout</button>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

// PUBLIC_INTERFACE
function AppWithProviders() {
  /** App entry with providers and router */
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppWithProviders;
