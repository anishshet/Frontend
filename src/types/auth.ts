export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
    // Add any other user properties from your backend
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
    getToken: () => string | null;
  }