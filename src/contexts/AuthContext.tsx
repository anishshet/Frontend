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
    localStorage.getItem('token') || 'mock-token-123'
  );

  const isAuthenticated = !!token;

  const login = async (email: string, password: string): Promise<User> => {
    try {
      // Mock login for now
      const mockUser: User = {
        _id: '123',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        token: 'mock-token-123'
      };
      
      // Save to localStorage
      localStorage.setItem('token', mockUser.token);
      setToken(mockUser.token);
      setUser(mockUser);
      
      return mockUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const getToken = () => {
    return token || localStorage.getItem('token');
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
