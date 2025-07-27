'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = Cookies.get('access');
      const userEmail = Cookies.get('userEmail');
      
      if (accessToken) {
        setIsAuthenticated(true);
        setUser({ email: userEmail || 'user@example.com' });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      
      if (res.data && res.data.tokens) {
        Cookies.set('access', res.data.tokens.access, { 
          expires: 1, 
          secure: false, // set to true in production with HTTPS
          sameSite: 'lax'
        });
        Cookies.set('refresh', res.data.tokens.refresh, { 
          expires: 7, 
          secure: false, 
          sameSite: 'lax'
        });
      }
      
      const userEmail = res.data?.email || email;
      Cookies.set('userEmail', userEmail, { 
        expires: 7, 
        secure: false, 
        sameSite: 'lax'
      });
      
      setIsAuthenticated(true);
      setUser({ email: userEmail });
      
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (email, password) => {
    try {
      const res = await api.signup(email, password);
      
      if (res.data && res.data.tokens) {
        Cookies.set('access', res.data.tokens.access, { 
          expires: 1,
          secure: false, 
          sameSite: 'lax'
        });
        Cookies.set('refresh', res.data.tokens.refresh, { 
          expires: 7, 
          secure: false, 
          sameSite: 'lax'
        });
      }
      
      const userEmail = res.data?.email || email;
      Cookies.set('userEmail', userEmail, { 
        expires: 7, 
        secure: false, 
        sameSite: 'lax'
      });
      
      setIsAuthenticated(true);
      setUser({ email: userEmail });
      
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('userEmail');
      Cookies.remove('access');
      Cookies.remove('refresh');
      
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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