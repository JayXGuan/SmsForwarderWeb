"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, hasUsers, initializeSystem } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 登录表单
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 初始化表单
  const [initEmail, setInitEmail] = useState("");
  const [initPassword, setInitPassword] = useState("");
  const [initConfirmPassword, setInitConfirmPassword] = useState("");

  // 检查系统是否已初始化
  useEffect(() => {
    hasUsers().then((result) => {
      setIsInitialized(result);
    });
  }, []);

  // 登录
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "登录失败");
    }
    setLoading(false);
  }

  // 初始化系统
  async function handleInitialize(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (initPassword !== initConfirmPassword) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }

    const result = await initializeSystem(initEmail, initPassword);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "初始化失败");
    }
    setLoading(false);
  }

  // 正在检查初始化状态
  if (isInitialized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isInitialized ? "SmsForwarder 管理端" : "初始化系统"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isInitialized
              ? "登录以管理您的短信转发设备"
              : "创建第一个管理员账户"}
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 登录表单 */}
        {isInitialized && (
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="密码"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        )}

        {/* 初始化表单 */}
        {!isInitialized && (
          <form onSubmit={handleInitialize} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="init-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  管理员邮箱
                </label>
                <input
                  id="init-email"
                  name="init-email"
                  type="email"
                  required
                  value={initEmail}
                  onChange={(e) => setInitEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="init-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  密码
                </label>
                <input
                  id="init-password"
                  name="init-password"
                  type="password"
                  required
                  minLength={6}
                  value={initPassword}
                  onChange={(e) => setInitPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="至少6位密码"
                />
              </div>
              <div>
                <label
                  htmlFor="init-confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  确认密码
                </label>
                <input
                  id="init-confirm-password"
                  name="init-confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={initConfirmPassword}
                  onChange={(e) => setInitConfirmPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="再次输入密码"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "初始化中..." : "创建管理员账户"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
