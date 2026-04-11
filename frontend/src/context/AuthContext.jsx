import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer le user au chargement si token existe
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api
        .get('/users/me')
        .then(res => {
          setUser(res.data.data);
          setError(null);
        })
        .catch(err => {
          console.error('Erreur récupération user:', err);
          localStorage.removeItem('access_token');
          setError(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data.data;
      
      localStorage.setItem('access_token', access_token);
      setUser(userData);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Erreur connexion';
      setError(message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', userData);
      const { access_token, user: userInfo } = res.data.data;
      
      localStorage.setItem('access_token', access_token);
      setUser(userInfo);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Erreur inscription';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isClient: user?.role === 'client',
        isProducteur: user?.role === 'producteur',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};