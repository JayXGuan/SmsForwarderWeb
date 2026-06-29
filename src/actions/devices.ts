"use server";

import db from "@/lib/db";
import { getAuthUser } from "./auth";

// 设备类型
export interface Device {
  id: number;
  name: string;
  ip: string;
  port: number;
  sign_key: string | null;
  security_mode: number;
  user_id: number;
  created_at: string;
}

// 获取用户的所有设备
export async function getDevices(): Promise<Device[]> {
  const user = await getAuthUser();
  if (!user) {
    return [];
  }

  const devices = db
    .prepare("SELECT * FROM devices WHERE user_id = ? ORDER BY created_at DESC")
    .all(user.id) as Device[];

  return devices;
}

// 获取单个设备
export async function getDevice(id: number): Promise<Device | null> {
  const user = await getAuthUser();
  if (!user) {
    return null;
  }

  const device = db
    .prepare("SELECT * FROM devices WHERE id = ? AND user_id = ?")
    .get(id, user.id) as Device | undefined;

  return device || null;
}

// 创建设备
export async function createDevice(data: {
  name: string;
  ip: string;
  port: number;
  sign_key?: string;
  security_mode?: number;
}): Promise<{ success: boolean; device?: Device; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    // 验证必填字段
    if (!data.name || !data.ip) {
      return { success: false, error: "设备名称和IP地址不能为空" };
    }

    // 插入设备
    const result = db
      .prepare(
        "INSERT INTO devices (name, ip, port, sign_key, security_mode, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run(
        data.name,
        data.ip,
        data.port || 5000,
        data.sign_key || null,
        data.security_mode || 0,
        user.id,
      );

    const device = db
      .prepare("SELECT * FROM devices WHERE id = ?")
      .get(result.lastInsertRowid) as Device;

    return { success: true, device };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建设备失败",
    };
  }
}

// 更新设备
export async function updateDevice(
  id: number,
  data: {
    name?: string;
    ip?: string;
    port?: number;
    sign_key?: string;
    security_mode?: number;
  },
): Promise<{ success: boolean; device?: Device; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    // 检查设备是否存在且属于当前用户
    const existingDevice = db
      .prepare("SELECT * FROM devices WHERE id = ? AND user_id = ?")
      .get(id, user.id) as Device | undefined;

    if (!existingDevice) {
      return { success: false, error: "设备不存在" };
    }

    // 构建更新语句
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      values.push(data.name);
    }
    if (data.ip !== undefined) {
      updates.push("ip = ?");
      values.push(data.ip);
    }
    if (data.port !== undefined) {
      updates.push("port = ?");
      values.push(data.port);
    }
    if (data.sign_key !== undefined) {
      updates.push("sign_key = ?");
      values.push(data.sign_key || null);
    }
    if (data.security_mode !== undefined) {
      updates.push("security_mode = ?");
      values.push(data.security_mode);
    }

    if (updates.length === 0) {
      return { success: true, device: existingDevice };
    }

    values.push(id, user.id);

    db.prepare(
      `UPDATE devices SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    ).run(...values);

    const device = db
      .prepare("SELECT * FROM devices WHERE id = ?")
      .get(id) as Device;

    return { success: true, device };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新设备失败",
    };
  }
}

// 删除设备
export async function deleteDevice(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    const result = db
      .prepare("DELETE FROM devices WHERE id = ? AND user_id = ?")
      .run(id, user.id);

    if (result.changes === 0) {
      return { success: false, error: "设备不存在" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除设备失败",
    };
  }
}
