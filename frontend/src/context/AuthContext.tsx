import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  apiRequest,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  setUnauthorizedHandler,
} from "../api/client";

export type UserRole =
  | "ADMIN"
  | "SALES"
  | "WAREHOUSE"
  | "ACCOUNTS";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  createdAt?: string;
  phone?: string;
  lastLogin?: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await apiRequest<AuthUser>(
        "/auth/me",
      );

      setUser(currentUser);
    } catch {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };

    void initialize();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiRequest<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      setAccessToken(response.token);
      setUser(response.user);

      return response.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await apiRequest("/auth/logout", {
          method: "POST",
        });
      }
    } catch {
      // Clear local session even if server logout fails.
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}
