import React, { createContext, useState, useContext, ReactNode } from "react";

// 1. Define the User type separately for cleaner code
export type User = {
  userId: number;
  username: string;
};

// 2. Add login and logout actions to your Context Type
type AuthContextType = {
  user?: User;
  token?: string;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// 3. Initialize with undefined to enforce strict null-checking
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Define the Provider props to accept children
type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  // 5. Create state to hold the current user and token
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();

  //TODO: Check if logged in - if not redirect to login page. On every render check credentials validity - if not valid logou + redirect

  // 6. Define the actions to update the state
  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    // Note: In a real app, you would also save the token to SecureStore/AsyncStorage here
  };

  const logout = () => {
    setToken(undefined);
    setUser(undefined);
    // Note: Remove token from SecureStore/AsyncStorage here
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
