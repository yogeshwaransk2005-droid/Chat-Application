import React, { createContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext();

const STORAGE_KEY = "chatAuthUser";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setAuthToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setAuthToken(userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user), loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;