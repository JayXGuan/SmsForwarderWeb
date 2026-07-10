"use server";

import db from "@/lib/db";
import { getAuthUser } from "./auth";
import type { MultiSimConfig, MultiSimConfigFormData } from "@/types";

/**
 * 获取用户的所有单卡多副卡配置
 */
export async function getMultiSimConfigs(): Promise<{
  success: boolean;
  data: MultiSimConfig[];
  error?: string;
}> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, data: [], error: "未登录" };
    }

    const configs = db
      .prepare(
        "SELECT * FROM multi_sim_config WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(user.id) as MultiSimConfig[];

    return { success: true, data: configs };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "获取配置列表失败",
    };
  }
}

/**
 * 获取单个单卡多副卡配置
 */
export async function getMultiSimConfig(
  id: number,
): Promise<{ success: boolean; data?: MultiSimConfig; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    const config = db
      .prepare("SELECT * FROM multi_sim_config WHERE id = ? AND user_id = ?")
      .get(id, user.id) as MultiSimConfig | undefined;

    if (!config) {
      return { success: false, error: "配置不存在" };
    }

    return { success: true, data: config };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取配置失败",
    };
  }
}

/**
 * 创建单卡多副卡配置
 */
export async function createMultiSimConfig(
  data: MultiSimConfigFormData,
): Promise<{ success: boolean; config?: MultiSimConfig; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    if (!data.main_number) {
      return { success: false, error: "主号不能为空" };
    }

    if (!data.sub_numbers || data.sub_numbers.length === 0) {
      return { success: false, error: "副号列表不能为空" };
    }

    const subNumbersJson = JSON.stringify(data.sub_numbers);

    const result = db
      .prepare(
        "INSERT INTO multi_sim_config (user_id, main_number, sub_type, sub_numbers) VALUES (?, ?, ?, ?)",
      )
      .run(user.id, data.main_number, data.sub_type || "multi", subNumbersJson);

    const config = db
      .prepare("SELECT * FROM multi_sim_config WHERE id = ?")
      .get(result.lastInsertRowid) as MultiSimConfig;

    return { success: true, config };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建配置失败",
    };
  }
}

/**
 * 更新单卡多副卡配置
 */
export async function updateMultiSimConfig(
  id: number,
  data: MultiSimConfigFormData,
): Promise<{ success: boolean; config?: MultiSimConfig; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    if (!data.main_number) {
      return { success: false, error: "主号不能为空" };
    }

    if (!data.sub_numbers || data.sub_numbers.length === 0) {
      return { success: false, error: "副号列表不能为空" };
    }

    const subNumbersJson = JSON.stringify(data.sub_numbers);

    const existing = db
      .prepare("SELECT * FROM multi_sim_config WHERE id = ? AND user_id = ?")
      .get(id, user.id);

    if (!existing) {
      return { success: false, error: "配置不存在" };
    }

    db.prepare(
      "UPDATE multi_sim_config SET main_number = ?, sub_type = ?, sub_numbers = ? WHERE id = ?",
    ).run(data.main_number, data.sub_type || "multi", subNumbersJson, id);

    const config = db
      .prepare("SELECT * FROM multi_sim_config WHERE id = ?")
      .get(id) as MultiSimConfig;

    return { success: true, config };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新配置失败",
    };
  }
}

/**
 * 删除单卡多副卡配置
 */
export async function deleteMultiSimConfig(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: "未登录" };
    }

    const result = db
      .prepare("DELETE FROM multi_sim_config WHERE id = ? AND user_id = ?")
      .run(id, user.id);

    if (result.changes === 0) {
      return { success: false, error: "配置不存在" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除配置失败",
    };
  }
}
