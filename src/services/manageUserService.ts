import { type User } from '../types/auth';

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('jwtToken'); // Ensure this matches your AuthContext token key
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  };
}

export class ManageUserService {
  async getAllUsers(queryParams?: Record<string, string>): Promise<UsersResponse> {
    try {
      const queryString = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
      
      const response = await fetch(`/api/user${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
