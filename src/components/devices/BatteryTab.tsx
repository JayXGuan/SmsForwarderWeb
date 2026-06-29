"use client";

import type { BatteryInfo } from "@/types";

interface BatteryTabProps {
  battery: BatteryInfo | null;
}

export default function BatteryTab({ battery }: BatteryTabProps) {
  if (!battery) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500 py-8">无法获取电量信息</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">电量状态</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{battery.level}%</p>
          <p className="text-sm text-gray-500 mt-1">电量</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xl font-semibold text-gray-900">
            {battery.status === 2
              ? "放电中"
              : battery.status === 3
                ? "满电"
                : "充电中"}
          </p>
          <p className="text-sm text-gray-500 mt-1">状态</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xl font-semibold text-gray-900">
            {battery.temperature / 10}°C
          </p>
          <p className="text-sm text-gray-500 mt-1">温度</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xl font-semibold text-gray-600">
            {battery.voltage}mV
          </p>
          <p className="text-sm text-gray-500 mt-1">电压</p>
        </div>
      </div>
    </div>
  );
}
