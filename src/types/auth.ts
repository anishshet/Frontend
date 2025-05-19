export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // Add any other user properties from your backend
}
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  getToken: () => string | null;
  setUser: (user: User | null) => void;
}