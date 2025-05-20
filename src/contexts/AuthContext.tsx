import React, { createContext, useContext, useState } from 'react';
import { type User } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize with mock admin user
  const [user, setUser] = useState<User | null>({
    _id: '123',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    token: 'mock-token-123'
  });
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('token') || 'mock-token-123'
  );

  const isAuthenticated = !!token;

  const login = async (email: string, password: string): Promise<User> => {
    try {
      // Make a real API call to your backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const userData = await response.json();
      
      // Ensure the response contains a token
      if (!userData.token) {
        throw new Error('No authentication token received');
      }

      // Save received JWT token to sessionStorage
      sessionStorage.setItem('token', userData.token);
      setToken(userData.token);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(typeof error === 'object' && error !== null && 'message' in error
        ? (error as Error).message
        : "Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
  };

  const getToken = () => {
    return token || sessionStorage.getItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
