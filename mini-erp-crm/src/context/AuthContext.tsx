import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  import type { User } from "../types";
  
  interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    login: (
      email: string,
      password: string,
    ) => Promise<boolean>;
    logout: () => void;
  }
  
  const AuthContext =
    createContext<AuthContextValue | undefined>(
      undefined,
    );
  
  const STORAGE_KEY =
    "mini-erp-auth-user";
  
  export function AuthProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [user, setUser] =
      useState<User | null>(null);
  
    useEffect(() => {
      const storedUser =
        localStorage.getItem(
          STORAGE_KEY,
        );
  
      if (!storedUser) {
        return;
      }
  
      try {
        const parsedUser =
          JSON.parse(
            storedUser,
          ) as User;
  
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(
          STORAGE_KEY,
        );
      }
    }, []);
  
    const login = async (
      email: string,
      password: string,
    ) => {
      /*
       * TEMPORARY FRONTEND AUTH
       *
       * This will later be replaced with:
       *
       * POST /api/auth/login
       *
       * The backend will return the
       * authenticated user + JWT.
       */
  
      if (
        email ===
          "subham@minierp.com" &&
        password === "admin123"
      ) {
        const loggedInUser: User = {
          id: "USR-001",
          name: "Subham Rout",
          email: "subham@minierp.com",
          phone: "+91 98765 43210",
          role: "ADMIN",
          status: "ACTIVE",
          lastLogin:
            new Date().toISOString(),
          createdAt:
            "2026-01-10",
        };
  
        setUser(
          loggedInUser,
        );
  
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            loggedInUser,
          ),
        );
  
        return true;
      }
  
      return false;
    };
  
    const logout = () => {
      setUser(null);
  
      localStorage.removeItem(
        STORAGE_KEY,
      );
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated:
            user !== null,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context =
      useContext(
        AuthContext,
      );
  
    if (!context) {
      throw new Error(
        "useAuth must be used inside AuthProvider",
      );
    }
  
    return context;
  }