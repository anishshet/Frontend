import axios from 'axios';
import { type User } from '../types/auth';
import { getAuthHeaders } from '../utils/authUtils';

export const USER_KEY = 'USER';
export const TOKEN_KEY = 'token';

export const userService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      // Mock login for development
      const mockUser = {
        _id: '123',
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        token: 'mock-token-123'
      };

      localStorage.setItem(TOKEN_KEY, mockUser.token);
      userService.setUser(mockUser);
      
      return mockUser;
      
      // Uncomment this for real API integration:
      /*
      const response = await axios.post('api/authorization/login', { email, password });
      const data = response.data;
      
      let token: string | null = null;
      let userData: User | null = null;

      if (typeof data === 'object' && data !== null) {
        // Extract token
        if ('access_token' in data || 'token' in data) {
          token = data.access_token || data.token;
          userData = 'user' in data ? data.user : { ...data };
        } else {
          // If response is just the user object with token
          if ('token' in data) {
            token = data.token;
            const { token: _, ...rest } = data;
            userData = rest;
          } else {
            // If response is just the user object
            userData = data;
          }
        }

        if (userData) {
          // Store token in local storage if available
          if (token) {
            localStorage.setItem(TOKEN_KEY, token);
          }

          // Store user data
          const userToStore = token ? { ...userData, token } : userData;
          userService.setUser(userToStore);
          return userToStore;
        }
      }

      throw new Error('Invalid response format');
      */
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
  
  getAuthHeader(): { Authorization?: string } {
    const token = userService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export async function logoutService() {
  try {
    // For now, just clear local data
    userService.clearUser();
    return { success: true };
    
    // Uncomment for API integration
    /*
    const token = userService.getToken();
    const response = await axios.post(
      "/api/user/logout",
      {},
      { headers: getAuthHeaders(token) }
    );
    userService.clearUser();
    return response.data;
    */
  } catch (error) {
    userService.clearUser();
    throw error;
  }
}
