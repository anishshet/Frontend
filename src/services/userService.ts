import axios from 'axios';
import type { User, LoginCredentials, AuthResponse, ApiResponse } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_STORAGE_KEY = 'access_token';
const USER_STORAGE_KEY = 'user';
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

let inactivityTimer: ReturnType<typeof setTimeout>;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token dynamically before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token && config.headers) {
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
    const { data } = await api.post<ApiResponse<AuthResponse>>('/api/user/login', credentials);
    const { user, access_token } = data.data;
    
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    setupInactivity();
    return user;
  },

  async logout() {
    try {
      await api.post('/api/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
    } finally {
      this.logoutLocal();
    }
  },

  logoutLocal() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    clearTimeout(inactivityTimer);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getUser(): User | null {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

function setupInactivity(): void {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    userService.logoutLocal();
    window.location.href = '/login';
  }, INACTIVITY_TIMEOUT);

  ['mousedown', 'keydown', 'mousemove', 'touchstart'].forEach((evt) =>
    document.addEventListener(evt, () => {
      clearTimeout(inactivityTimer);
      setupInactivity();
    })
  );
}
