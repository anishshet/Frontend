import axios from 'axios';
import { type User } from '../types/auth';
import { getAuthHeaders } from '../utils/authUtils';

export const USER_KEY = 'USER';
export const TOKEN_KEY = 'jwtToken'; // This key remains unchanged.
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

let inactivityTimer: NodeJS.Timeout;

export const userService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post('api/authorization/login', { email, password });
      const data = response.data;
      
      console.log('Login response:', data);

      // Extract token and user data based on response structure
      let token: string | null = null;
      let userData: User | null = null;

      if (typeof data === 'object' && data !== null) {
        // If response includes token and user separately
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
          // Store token in session storage if available
          if (token) {
            sessionStorage.setItem(TOKEN_KEY, token);
            console.log('Token stored in session storage:', token);
          }

          // Store user data in local storage as before
          const userToStore = token ? { ...userData, token } : userData;
          userService.setUser(userToStore);
          
          userService.setupInactivityListeners();
          return userToStore;
        }
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  },

  // New MFA verification function
  async verifyMfa(userId: string, otp: string): Promise<any> {
    try {
      const response = await axios.post('api/authorization/verify-mfa', { userId, token: otp });
      console.log('MFA verify response:', response.data);
      return response.data;
    } catch (error) {
      console.error('MFA verification failed:', error);
      throw error;
    }
  },

  async regenerateMfa(userId: string): Promise<any> {
    try {
      const response = await axios.post('/api/authorization/regenerate-mfa', { userId });
      console.log('Regenerate MFA response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Regenerate MFA failed:', error);
      throw error;
    }
  },

  setUser(user: User): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    userService.resetInactivityTimer();
  },

  getUser(): User | null {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Now retrieve the token from session storage
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  clearUser(): void {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
  },

  resetInactivityTimer(): void {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
      userService.clearUser();
      window.location.href = '/login';
    }, INACTIVITY_TIMEOUT);
  },

  setupInactivityListeners(): void {
    const events = ['mousedown', 'keydown', 'mousemove', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, userService.resetInactivityTimer);
    });
  },
  
  getAuthHeader(): { Authorization?: string } {
    const token = userService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export async function logoutService(token: string | null) {
  try {
    const response = await axios.post(
      "/api/user/logout",
      {},
      { headers: getAuthHeaders(token) }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
