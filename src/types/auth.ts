export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    // Add any other user properties from your backend
  }
  
  export interface MFALoginResponse {
    success: boolean;
    mfaEnabled: boolean;
    mfaRequired: boolean;
    message: string;
    userId: string;
    qrCodeUrl?: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<User | MFALoginResponse>;
    logout: () => void;
    getToken: () => string | null;
    mfaPending: boolean;
    setMfaPending: (value: boolean) => void;
    setUser: (user: User | null) => void;
  }