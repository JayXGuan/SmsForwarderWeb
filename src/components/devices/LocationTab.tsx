"use client";

import { useState, useEffect } from "react";
import { queryLocation } from "@/actions/deviceApi";
import type { LocationInfo } from "@/types";
import type { Device } from "@/actions/devices";

interface LocationTabProps {
  device: Device;
}

export default function LocationTab({ device }: LocationTabProps) {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 首次挂载时加载
  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    setLoading(true);
    setError(null);
    const result = await queryLocation(device);
    if (result.code === 200 && result.data) {
      setLocation(result.data as unknown as LocationInfo);
    } else {
      setError("无法获取位置信息");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500 py-8">
          <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          加载中...
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500 py-8">
          {error || "无法获取位置信息"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">位置信息</h3>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">地址</p>
          <p className="text-gray-900">{location.address || "未知地址"}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">纬度</p>
            <p className="text-gray-900">{location.latitude}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">经度</p>
            <p className="text-gray-900">{location.longitude}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">精度</p>
            <p className="text-gray-900">{location.accuracy}米</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">更新时间</p>
            <p className="text-gray-900">
              {new Date(location.time).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
