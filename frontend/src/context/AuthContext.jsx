import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('homeease_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProviderDetails(res.data.providerDetails);
      }
    } catch (err) {
      localStorage.removeItem('homeease_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('homeease_token', res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      const res = await API.post('/auth/register', { name, email, password, phone, role });
      if (res.data.success) {
        localStorage.setItem('homeease_token', res.data.token);
        setUser(res.data.user);
        toast.success('Account created successfully!');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('homeease_token');
    setUser(null);
    setProviderDetails(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, providerDetails, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
