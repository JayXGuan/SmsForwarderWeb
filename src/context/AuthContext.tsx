"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import pb from "@/lib/pocketbase";

interface AuthContextType {
  isLoggedIn: boolean;
  user: unknown;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const checkAuth = () => {
      if (pb.authStore.isValid) {
        setUser(pb.authStore.model);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();

    // 监听认证状态变化
    const removeListener = pb.authStore.onChange(() => {
      if (pb.authStore.isValid) {
        setUser(pb.authStore.model);
      } else {
        setUser(null);
      }
    });

    return () => {
      removeListener?.();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await pb.collection("users").authWithPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: pb.authStore.isValid,
        user,
        loading,
        login,
        logout,
      }}
    >
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
