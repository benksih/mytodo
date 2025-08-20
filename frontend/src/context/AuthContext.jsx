import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.login({ email, password });
      setToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      alert('登录失败！');
    }
  };

  const register = async (email, password) => {
    try {
      await api.register({ email, password });
      alert('注册成功！请登录。');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      alert('注册失败！');
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  const value = { token, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
