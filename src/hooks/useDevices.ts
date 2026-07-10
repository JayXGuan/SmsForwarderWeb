"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  type Device,
} from "@/actions/devices";

/** 设备表单数据结构，与 createDevice / updateDevice 的入参一致 */
export interface DeviceFormData {
  name: string;
  ip: string;
  port?: number;
  sign_key?: string;
  security_mode?: number;
}

/**
 * 设备数据管理 Hook
 *
 * 封装设备列表的获取、新增、编辑、删除操作，
 * 并提供统一的 refreshDevices 方法消除重复的列表刷新逻辑。
 *
 * @param enabled - 是否启用数据获取（通常依赖认证状态）
 * @returns devices - 当前设备列表
 * @returns loading - 数据是否加载中
 * @returns addDevice - 新增设备并自动刷新列表
 * @returns editDevice - 编辑设备并自动刷新列表
 * @returns removeDevice - 删除设备并自动刷新列表
 * @returns refreshDevices - 手动刷新设备列表
 */
export function useDevices(enabled: boolean) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  /** 刷新设备列表（内部共享函数，消除 CRUD 操作中的重复调用） */
  const refreshDevices = useCallback(async () => {
    const result = await getDevices();
    if (result.success) {
      setDevices(result.data);
    }
  }, []);

  // 认证通过后自动获取设备列表
  useEffect(() => {
    if (enabled) {
      setLoading(true);
      refreshDevices().finally(() => setLoading(false));
    }
  }, [enabled, refreshDevices]);

  /** 新增设备 */
  const addDevice = async (data: DeviceFormData) => {
    const result = await createDevice(data);
    if (result.success) {
      await refreshDevices();
    }
    return result;
  };

  /** 编辑设备 */
  const editDevice = async (id: number, data: DeviceFormData) => {
    const result = await updateDevice(id, data);
    if (result.success) {
      await refreshDevices();
    }
    return result;
  };

  /** 删除设备 */
  const removeDevice = async (id: number) => {
    const result = await deleteDevice(id);
    if (result.success) {
      setDevices((prev) => prev.filter((d) => d.id !== id));
    }
    return result;
  };

  return {
    devices,
    loading,
    addDevice,
    editDevice,
    removeDevice,
    refreshDevices,
  };
}
