"use client";

import type { LocationInfo } from "@/types";

interface LocationTabProps {
  location: LocationInfo | null;
}

export default function LocationTab({ location }: LocationTabProps) {
  if (!location) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500 py-8">无法获取位置信息</div>
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
