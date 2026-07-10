"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/actions/auth";

/**
 * 认证状态管理 Hook
 *
 * 封装登录状态检查与未登录时的自动重定向逻辑，
 * 避免在每个需要认证的页面中重复编写相同的 useEffect。
 *
 * @returns isAuth - 是否已登录
 * @returns authLoading - 认证检查是否正在进行中
 */
export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isLoggedIn();
      setIsAuth(auth);
      setAuthLoading(false);
      if (!auth) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return { isAuth, authLoading };
}
