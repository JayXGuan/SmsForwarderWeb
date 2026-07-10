"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDevices, type DeviceFormData } from "@/hooks/useDevices";
import { useMultiSimConfigs } from "@/hooks/useMultiSimConfigs";
import type { Device } from "@/actions/devices";
import AppHeader from "@/components/shared/AppHeader";
import DeviceList from "@/components/devices/DeviceList";
import AddDeviceModal from "@/components/devices/AddDeviceModal";
import MultiSimConfigModal from "@/components/devices/MultiSimConfigModal";
import Loading from "@/components/shared/Loading";

export default function HomePage() {
  const { isAuth, authLoading } = useAuth();
  const { devices, loading, addDevice, editDevice, removeDevice } =
    useDevices(isAuth);
  const {
    configs: multiSimConfigs,
    loading: configLoading,
    addConfig,
    editConfig,
    removeConfig,
  } = useMultiSimConfigs(isAuth);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  const handleOpenAdd = () => {
    setEditingDevice(null);
    setShowAddModal(true);
  };

  const handleOpenConfig = () => {
    setShowConfigModal(true);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingDevice(null);
  };

  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
  };

  const handleSubmit = async (data: DeviceFormData) => {
    if (editingDevice) {
      await editDevice(editingDevice.id, data);
    } else {
      await addDevice(data);
    }
    setShowAddModal(false);
    setEditingDevice(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个设备吗？")) {
      await removeDevice(id);
    }
  };

  if (authLoading || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading text="加载中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">设备列表</h2>
            <p className="text-gray-500 mt-1">共 {devices.length} 台设备</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOpenConfig}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.74 3.258.406 3.258 2.073a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.74 1.543-.406 3.258-2.073 3.258a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.74-3.258-.406-3.258-2.073a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.74-1.543.406-3.258 2.073-3.258a1.724 1.724 0 002.573-1.066z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              单卡多副卡配置
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              添加设备
            </button>
          </div>
        </div>

        <DeviceList
          devices={devices}
          loading={loading}
          onAdd={handleOpenAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <AddDeviceModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editDevice={editingDevice}
      />

      <MultiSimConfigModal
        isOpen={showConfigModal}
        onClose={handleCloseConfigModal}
        configs={multiSimConfigs}
        onAdd={addConfig}
        onEdit={editConfig}
        onDelete={removeConfig}
        loading={configLoading}
      />
    </div>
  );
}
