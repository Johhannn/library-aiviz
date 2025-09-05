import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) setCurrentUser(JSON.parse(user));
      setLoading(false);
    };
    init();
  }, []);

  const login = async (username, password) => {
    if (!username || !password) return { success: false, error: "Enter username and password" };
    try {
      const res = await api.post('/accounts/login/', { username, password });
      const { access, refresh, user } = res.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (err) {
      let errorMsg = "Something went wrong";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else {
          errorMsg = Object.values(err.response.data).flat().join(" ");
        }
      }
      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/accounts/register/', userData);
      const { access, refresh, user } = res.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    } catch (err) {
      let errorMsg = "Something went wrong";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else {
          errorMsg = Object.values(err.response.data).flat().join(" ");
        }
      }
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  return <AuthContext.Provider value={{ currentUser, login, register, logout }}>{!loading && children}</AuthContext.Provider>;
};
