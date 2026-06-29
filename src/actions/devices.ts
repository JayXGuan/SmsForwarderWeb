"use server";

import pb from "@/lib/pocketbase";
import { cookies } from "next/headers";
import type { DeviceRecord } from "@/types";

// 初始化认证
async function initAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");

  if (!authCookie?.value) {
    return false;
  }

  try {
    const authData = JSON.parse(authCookie.value);
    pb.authStore.save(authData.token, authData.model);
    return pb.authStore.isValid;
  } catch {
    return false;
  }
}

// 获取设备列表
export async function getDevices() {
  const isAuth = await initAuth();
  if (!isAuth) {
    return { success: false, error: "未登录", data: [] };
  }

  try {
    const records = await pb.collection("devices").getFullList({
      sort: "-created",
    });
    return { success: true, data: records as unknown as DeviceRecord[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取设备列表失败",
      data: [],
    };
  }
}

// 获取单个设备
export async function getDevice(id: string) {
  const isAuth = await initAuth();
  if (!isAuth) {
    return { success: false, error: "未登录", data: null };
  }

  try {
    const record = await pb.collection("devices").getOne(id);
    return { success: true, data: record as unknown as DeviceRecord };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取设备失败",
      data: null,
    };
  }
}

// 添加设备
export async function addDevice(
  device: Omit<DeviceRecord, "id" | "user" | "created" | "updated">,
) {
  const isAuth = await initAuth();
  if (!isAuth) {
    return { success: false, error: "未登录" };
  }

  try {
    await pb.collection("devices").create(device);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "添加设备失败",
    };
  }
}

// 删除设备
export async function deleteDevice(id: string) {
  const isAuth = await initAuth();
  if (!isAuth) {
    return { success: false, error: "未登录" };
  }

  try {
    await pb.collection("devices").delete(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除设备失败",
    };
  }
}

// 更新设备
export async function updateDevice(
  id: string,
  device: Partial<Omit<DeviceRecord, "id" | "user" | "created" | "updated">>,
) {
  const isAuth = await initAuth();
  if (!isAuth) {
    return { success: false, error: "未登录" };
  }

  try {
    await pb.collection("devices").update(id, device);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新设备失败",
    };
  }
}
