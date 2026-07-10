"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMultiSimConfigs,
  createMultiSimConfig,
  updateMultiSimConfig,
  deleteMultiSimConfig,
} from "@/actions/multiSimConfigs";
import type { MultiSimConfig, MultiSimConfigFormData } from "@/types";

/**
 * 单卡多副卡配置数据管理 Hook
 *
 * 封装配置列表的获取、新增、编辑、删除操作，
 * 并提供统一的 refreshConfigs 方法消除重复的列表刷新逻辑。
 *
 * @param enabled - 是否启用数据获取（通常依赖认证状态）
 * @returns configs - 当前配置列表
 * @returns loading - 数据是否加载中
 * @returns addConfig - 新增配置并自动刷新列表
 * @returns editConfig - 编辑配置并自动刷新列表
 * @returns removeConfig - 删除配置并自动刷新列表
 * @returns refreshConfigs - 手动刷新配置列表
 */
export function useMultiSimConfigs(enabled: boolean) {
  const [configs, setConfigs] = useState<MultiSimConfig[]>([]);
  const [loading, setLoading] = useState(true);

  /** 刷新配置列表（内部共享函数，消除 CRUD 操作中的重复调用） */
  const refreshConfigs = useCallback(async () => {
    const result = await getMultiSimConfigs();
    if (result.success) {
      setConfigs(result.data);
    }
  }, []);

  // 认证通过后自动获取配置列表
  useEffect(() => {
    if (enabled) {
      setLoading(true);
      refreshConfigs().finally(() => setLoading(false));
    }
  }, [enabled, refreshConfigs]);

  /** 新增配置 */
  const addConfig = async (data: MultiSimConfigFormData) => {
    const result = await createMultiSimConfig(data);
    if (result.success) {
      await refreshConfigs();
    }
    return result;
  };

  /** 编辑配置 */
  const editConfig = async (id: number, data: MultiSimConfigFormData) => {
    const result = await updateMultiSimConfig(id, data);
    if (result.success) {
      await refreshConfigs();
    }
    return result;
  };

  /** 删除配置 */
  const removeConfig = async (id: number) => {
    const result = await deleteMultiSimConfig(id);
    if (result.success) {
      setConfigs((prev) => prev.filter((c) => c.id !== id));
    }
    return result;
  };

  return {
    configs,
    loading,
    addConfig,
    editConfig,
    removeConfig,
    refreshConfigs,
  };
}