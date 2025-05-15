import React, { createContext, useContext, useState, useEffect } from "react";
import { userService } from "../services/userService";
import { User, MFALoginResponse, AuthContextType } from "../types/auth";

// Type guard for MFA responses.
function isMFALoginResponse(response: any): response is MFALoginResponse {
  return (
    response &&
    typeof response.mfaEnabled === "boolean" &&
    typeof response.mfaRequired === "boolean" &&
    typeof response.message === "string" &&
    typeof response.userId === "string"
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userService.getUser());
  // mfaPending flag is true when an MFA response was returned during login.
  const [mfaPending, setMfaPending] = useState<boolean>(false);

  useEffect(() => {
    userService.setupInactivityListeners();
  }, []);

  const login = async (email: string, password: string): Promise<User | MFALoginResponse> => {
    try {
      const response = await userService.login(email, password);
      if (!response) {
        throw new Error("Invalid credentials");
      }
      if (isMFALoginResponse(response)) {
        // MFA flow required.
        setMfaPending(true);
        return response;
      } else {
        setUser(response);
        setMfaPending(false);
        return response;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    userService.clearUser();
    setUser(null);
    setMfaPending(false);
  };

  const getToken = (): string | null => {
    return userService.getToken();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, getToken, mfaPending, setMfaPending, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
