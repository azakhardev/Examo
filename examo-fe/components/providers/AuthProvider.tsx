import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { storage } from "@/utils";
import useMe from "@/api/auth/useMe";
import { AuthUser } from "@/types/AuthResponse";
import { router } from "expo-router";

const TOKEN_KEY = "examo_jwt_token";
const USER_ID_KEY = "examo_user_id";

type AuthContextType = {
  user?: AuthUser;
  token?: string;
  isReady: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const [isStoreLoaded, setIsStoreLoaded] = useState(false);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await storage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to load auth data", error);
      } finally {
        setIsStoreLoaded(true); // Signal that we checked the device storage
      }
    };

    loadAuthData();
  }, []);

  const {
    data: authData,
    isSuccess,
    isError,
  } = useMe({ retry: false, enabled: isStoreLoaded && !!token });

  useEffect(() => {
    if (isSuccess && authData) {
      setUser(authData.user);
    }

    if (isError) {
      logout();
    }
  }, [isSuccess, isError, authData]);

  const hasToken = !!token;
  const isReady = isStoreLoaded && (!hasToken || isSuccess || isError);

  async function login(newToken: string, user: AuthUser) {
    await storage.setItem(TOKEN_KEY, newToken);
    await storage.setItem(USER_ID_KEY, user.userId.toString());

    setToken(newToken);
    setUser(user);
  }

  async function logout() {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_ID_KEY);

    setToken(undefined);
    setUser(undefined);

    router.replace("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, isReady, login, logout }}>
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
