"use client";

import type { Device } from "@/actions/devices";
import DeviceCard from "@/components/devices/DeviceCard";
import EmptyDeviceState from "@/components/devices/EmptyDeviceState";
import Loading from "@/components/shared/Loading";

/**
 * 设备列表区域
 *
 * 根据加载状态和设备数量展示不同的 UI：
 * - 加载中 → Loading 组件
 * - 无设备 → 空状态引导
 * - 有设备 → 设备卡片列表
 *
 * @param devices - 设备数据数组
 * @param loading - 是否正在加载
 * @param onAdd - 添加设备的回调（空状态下使用）
 * @param onEdit - 编辑设备的回调
 * @param onDelete - 删除设备的回调
 */
interface DeviceListProps {
  devices: Device[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (device: Device) => void;
  onDelete: (id: number) => void;
}

export default function DeviceList({
  devices,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: DeviceListProps) {
  if (loading) {
    return <Loading text="加载设备列表..." />;
  }

  if (devices.length === 0) {
    return <EmptyDeviceState onAdd={onAdd} />;
  }

  return (
    <div className="space-y-4">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
