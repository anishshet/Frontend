import axios from 'axios';
import type { User, LoginCredentials, AuthResponse, ApiResponse } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_STORAGE_KEY = 'token';
const USER_STORAGE_KEY = 'user';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token dynamically before each request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (token && config.headers) {
    // Ensure token format exactly matches what works in Swagger UI
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      userService.logoutLocal();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/api/login', credentials);
    const { user, access_token } = data.data;
    
    sessionStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return user;
  },

  async logout() {
    try {
      await api.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
    } finally {
      this.logoutLocal();
    }
  },

  logoutLocal() {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getUser(): User | null {
    const stored = sessionStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
