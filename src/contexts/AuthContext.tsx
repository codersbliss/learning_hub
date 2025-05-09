import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const res = await axios.get(`https://learning-hub-ciio.onrender.com/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(res.data);
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`https://learning-hub-ciio.onrender.com/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(`https://learning-hub-ciio.onrender.com/api/auth/register`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;