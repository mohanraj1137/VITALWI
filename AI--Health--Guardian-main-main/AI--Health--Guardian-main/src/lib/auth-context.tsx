'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone: string;
  gender: string;
  bloodType: string;
  address: string;
  avatarUrl: string;
  allergies: string[];
  chronicConditions: string[];
  specialty?: string;
  hospital?: string;
  bio?: string;
  isOnline?: boolean;
  emergencyContact?: { name: string; relationship: string; phone: string };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  specialty?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('telemed_token');
    const storedUser = localStorage.getItem('telemed_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('telemed_token', data.data.token);
        localStorage.setItem('telemed_user', JSON.stringify(data.data.user));
        return { success: true, message: 'Login successful' };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('telemed_token', data.data.token);
        localStorage.setItem('telemed_user', JSON.stringify(data.data.user));
        return { success: true, message: 'Registration successful' };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('telemed_token');
    localStorage.removeItem('telemed_user');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('telemed_user', JSON.stringify(data.data));
        return { success: true, message: 'Profile updated' };
      }
      return { success: false, message: data.message || 'Update failed' };
    } catch {
      return { success: false, message: 'Network error.' };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
