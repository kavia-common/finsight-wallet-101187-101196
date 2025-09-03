import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { storage } from '../services/storage';

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the application and provides user auth state and actions.
 */
export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async (_email, _password) => {},
  register: async (_payload) => {},
  logout: () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provider to manage auth state persisted in localStorage */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // hydrate user from storage
  useEffect(() => {
    const saved = storage.get('auth_user');
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    setUser(res.user);
    storage.set('auth_user', res.user);
    return res.user;
  };

  const register = async ({ name, email, password }) => {
    const res = await api.auth.register({ name, email, password });
    setUser(res.user);
    storage.set('auth_user', res.user);
    return res.user;
  };

  const logout = () => {
    storage.remove('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to use Auth context */
  return useContext(AuthContext);
}
