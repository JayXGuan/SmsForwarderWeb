"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout } from "@/actions/auth";
import { getDevices, addDevice, deleteDevice } from "@/actions/devices";
import DeviceCard from "@/components/devices/DeviceCard";
import AddDeviceModal from "@/components/devices/AddDeviceModal";
import Loading from "@/components/shared/Loading";
import type { DeviceRecord } from "@/types";

export default function HomePage() {
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isLoggedIn();
      setIsAuth(auth);
      setAuthLoading(false);
      if (!auth) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  // 获取设备列表
  useEffect(() => {
    if (isAuth) {
      const fetchDevices = async () => {
        setLoading(true);
        const result = await getDevices();
        if (result.success) {
          setDevices(result.data);
        }
        setLoading(false);
      };
      fetchDevices();
    }
  }, [isAuth]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleAddDevice = async (
    deviceData: Omit<DeviceRecord, "id" | "user" | "created" | "updated">,
  ) => {
    const result = await addDevice(deviceData);
    if (result.success) {
      const devicesResult = await getDevices();
      if (devicesResult.success) {
        setDevices(devicesResult.data);
      }
      setShowAddModal(false);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (confirm("确定要删除这个设备吗？")) {
      const result = await deleteDevice(id);
      if (result.success) {
        setDevices(devices.filter((d) => d.id !== id));
      }
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
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  SmsForwarder
                </h1>
                <p className="text-xs text-gray-500">短信转发管理平台</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题和添加按钮 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">设备列表</h2>
            <p className="text-gray-500 mt-1">共 {devices.length} 台设备</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
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

        {/* 设备列表 */}
        {loading ? (
          <Loading text="加载设备列表..." />
        ) : devices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无设备</h3>
            <p className="text-gray-500 mb-6">点击上方按钮添加您的第一台设备</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onDelete={handleDeleteDevice}
              />
            ))}
          </div>
        )}
      </main>

      {/* 添加设备弹窗 */}
      <AddDeviceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDevice}
      />
    </div>
  );
}
