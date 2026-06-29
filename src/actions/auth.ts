"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

// Session 有效期：7天
const SESSION_EXPIRY_DAYS = 7;

// 用户类型
export interface User {
  id: number;
  email: string;
  created_at: string;
}

// 检查是否存在用户
export async function hasUsers(): Promise<boolean> {
  const result = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
    count: number;
  };
  return result.count > 0;
}

// 初始化系统（创建第一个用户）
export async function initializeSystem(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查是否已有用户
    if (await hasUsers()) {
      return { success: false, error: "系统已初始化，无法重复创建" };
    }

    // 验证输入
    if (!email || !password) {
      return { success: false, error: "邮箱和密码不能为空" };
    }

    if (password.length < 6) {
      return { success: false, error: "密码长度至少6位" };
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
      email,
      hashedPassword,
    );

    // 自动登录
    const user = db
      .prepare("SELECT id, email, created_at FROM users WHERE email = ?")
      .get(email) as User;

    await createSession(user.id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "初始化失败",
    };
  }
}

// 登录
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 验证输入
    if (!email || !password) {
      return { success: false, error: "邮箱和密码不能为空" };
    }

    // 查找用户
    const user = db
      .prepare(
        "SELECT id, email, password, created_at FROM users WHERE email = ?",
      )
      .get(email) as
      | { id: number; email: string; password: string; created_at: string }
      | undefined;

    if (!user) {
      return { success: false, error: "用户不存在" };
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "密码错误" };
    }

    // 创建 session
    await createSession(user.id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登录失败",
    };
  }
}

// 创建 session
async function createSession(userId: number) {
  const sessionId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  // 保存到数据库
  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(sessionId, userId, expiresAt.toISOString());

  // 保存到 cookie
  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

// 获取当前用户
export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
      return null;
    }

    // 查找 session
    const session = db
      .prepare("SELECT user_id, expires_at FROM sessions WHERE id = ?")
      .get(sessionId) as { user_id: number; expires_at: string } | undefined;

    if (!session) {
      return null;
    }

    // 检查是否过期
    if (new Date(session.expires_at) < new Date()) {
      // 清理过期 session
      db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
      return null;
    }

    // 获取用户信息
    const user = db
      .prepare("SELECT id, email, created_at FROM users WHERE id = ?")
      .get(session.user_id) as User | undefined;

    return user || null;
  } catch (error) {
    return null;
  }
}

// 检查是否已登录
export async function isLoggedIn(): Promise<boolean> {
  const user = await getAuthUser();
  return !!user;
}

// 退出登录
export async function logout(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      // 删除 session
      db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
    }

    // 清除 cookie
    cookieStore.delete("session_id");

    return { success: true };
  } catch (error) {
    return { success: true }; // 即使出错也返回成功，确保用户可以退出
  }
}
