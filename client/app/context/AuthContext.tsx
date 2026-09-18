'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, loginUser, registerUser, updateUserNotification, fetchUserProfile } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ message: string; user: User }>;
  register: (name: string, email: string, password: string) => Promise<{ message: string; user: User }>;
  logout: () => void;
  updateNotificationSetting: (enabled: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('cjt_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser) as User;
          setUser(parsed);
          // Try to fetch fresh data from backend
          try {
            const freshUser = await fetchUserProfile(parsed.id);
            setUser(freshUser);
            localStorage.setItem('cjt_user', JSON.stringify(freshUser));
          } catch (e) {
            console.warn('Could not refresh user from backend:', e);
          }
        }
      } catch (err) {
        console.error('Failed to restore auth state:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    setUser(res.user);
    localStorage.setItem('cjt_user', JSON.stringify(res.user));
    return res;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password);
    setUser(res.user);
    localStorage.setItem('cjt_user', JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cjt_user');
  };

  const updateNotificationSetting = async (enabled: boolean) => {
    if (!user) {
      throw new Error('User not logged in');
    }
    // Optimistic local update
    const prev = user;
    setUser({ ...prev, sendNotification: enabled });

    try {
      const res = await updateUserNotification(user.id, enabled);
      setUser(res.user);
      localStorage.setItem('cjt_user', JSON.stringify(res.user));
    } catch (err) {
      // Revert if failed
      setUser(prev);
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const freshUser = await fetchUserProfile(user.id);
      setUser(freshUser);
      localStorage.setItem('cjt_user', JSON.stringify(freshUser));
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateNotificationSetting,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
