"use server";

import pb from "@/lib/pocketbase";
import { cookies } from "next/headers";

export async function login(email: string, password: string) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    // 保存认证信息到 cookie
    const cookieStore = await cookies();
    const authDataJson = JSON.stringify({
      token: authData.token,
      model: authData.record,
    });
    cookieStore.set("pb_auth", authDataJson, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return { success: true, user: authData.record };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登录失败",
    };
  }
}

export async function logout() {
  try {
    pb.authStore.clear();
    const cookieStore = await cookies();
    cookieStore.delete("pb_auth");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "退出失败",
    };
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("pb_auth");

    if (!authCookie?.value) {
      return null;
    }

    // 解析 auth data
    const authData = JSON.parse(authCookie.value);

    // 设置 authStore
    pb.authStore.save(authData.token, authData.model);

    if (!pb.authStore.isValid) {
      return null;
    }

    // 刷新认证状态
    await pb.collection("users").authRefresh();

    return pb.authStore.model;
  } catch (error) {
    return null;
  }
}

export async function isLoggedIn() {
  const user = await getAuthUser();
  return !!user;
}
