import { authService } from "@/services";
import { tokenCache } from "@/utils";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserSession {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenCache.getAccessToken();
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.user);
          tokenCache.updateUser(response.user);
        } catch (error) {
          tokenCache.clear();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await authService.loginNormal(credentials);
      tokenCache.setAuthData(response.accessToken, response.refreshToken, response.user);
      setUser(response.user);
      navigate("/");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      throw error;
    } finally {
      tokenCache.clear();
      setUser(null);
      navigate("/login");
    }
  };

  const refreshUserInfo = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.user);
      tokenCache.updateUser(response.user);
    } catch (error) {
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!tokenCache.getAccessToken(),
    isLoading,
    login,
    logout,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
