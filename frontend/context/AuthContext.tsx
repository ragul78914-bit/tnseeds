'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'FARMER';
  seller?: any;
  farmer?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: { token: string; _id: string; name: string; email: string; role: 'ADMIN' | 'SELLER' | 'FARMER'; seller?: any; farmer?: any }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('tnseeds_token');
    const savedUser = localStorage.getItem('tnseeds_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (data: { token: string; _id: string; name: string; email: string; role: 'ADMIN' | 'SELLER' | 'FARMER'; seller?: any; farmer?: any }) => {
    localStorage.setItem('tnseeds_token', data.token);
    const userInfo: User = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      seller: data.seller,
      farmer: data.farmer
    };
    localStorage.setItem('tnseeds_user', JSON.stringify(userInfo));
    setToken(data.token);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('tnseeds_token');
    localStorage.removeItem('tnseeds_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
