"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { queryConfig } from "@/actions/deviceApi";
import type { Device } from "@/actions/devices";
import type { ConfigQueryData, SimInfo } from "@/types";

interface DeviceCardProps {
  device: Device;
  onDelete: (id: number) => void;
}

export default function DeviceCard({ device, onDelete }: DeviceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [config, setConfig] = useState<ConfigQueryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchConfig = async () => {
    if (loading) return;
    try {
      setError(null);
      setLoading(true);
      const result = await queryConfig(device);
      if (result.code === 200 && result.data) {
        setConfig(result.data);
      } else {
        setError(result.msg || "获取设备信息失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络错误");
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时自动获取设备信息
  useEffect(() => {
    fetchConfig();
  }, []);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  console.log("config", config);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* 卡片头部 */}
      <div
        className="px-5 py-4 cursor-pointer flex items-center justify-between"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
            <h3 className="text-lg font-semibold text-gray-900">
              {device.name}
            </h3>
            <p className="text-sm text-gray-500">
              {device.ip}:{device.port}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/devices/${device.id}`}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            详情
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(device.id);
            }}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            删除
          </button>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* 折叠时的简要信息 */}
      {!expanded && (
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2">
            {loading && (
              <span className="text-sm text-gray-400">加载中...</span>
            )}
            {config?.sim_info_list &&
              Object.values(config.sim_info_list).map(
                (sim: SimInfo, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 text-sm rounded-lg"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {sim.mNumber || "未知号码"}
                  </span>
                ),
              )}
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        </div>
      )}

      {/* 展开时的详细信息 */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-50">
          {loading && (
            <div className="py-8 text-center text-gray-500">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              加载设备信息...
            </div>
          )}

          {error && (
            <div className="py-4 text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchConfig();
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                重试
              </button>
            </div>
          )}

          {config && !loading && (
            <div className="pt-4 space-y-4">
              {/* SIM卡信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  SIM 卡信息
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(config.sim_info_list || {}).map(
                    ([key, sim]: [string, SimInfo]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            SIM{parseInt(key) + 1}
                          </span>
                          <span className="text-xs text-gray-500">
                            {sim.mCarrierName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {sim.mNumber || "未知号码"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* 备注 */}
              {(config.extra_sim1 ||
                config.extra_sim2 ||
                config.extra_device_mark) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    备注信息
                  </h4>
                  <div className="space-y-1">
                    {config.extra_device_mark && (
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-500">设备备注：</span>
                        {config.extra_device_mark}
                      </p>
                    )}
                    {config.extra_sim1 && (
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-500">SIM1备注：</span>
                        {config.extra_sim1}
                      </p>
                    )}
                    {config.extra_sim2 && (
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-500">SIM2备注：</span>
                        {config.extra_sim2}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* API 功能开关 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  API 功能状态
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "enable_api_sms_send", label: "发送短信" },
                    { key: "enable_api_sms_query", label: "查询短信" },
                    { key: "enable_api_call_query", label: "通话记录" },
                    { key: "enable_api_contact_query", label: "查询联系人" },
                    { key: "enable_api_contact_add", label: "添加联系人" },
                    { key: "enable_api_battery_query", label: "电量查询" },
                    { key: "enable_api_location", label: "位置查询" },
                    { key: "enable_api_wol", label: "WOL唤醒" },
                  ].map(({ key, label }) => (
                    <span
                      key={key}
                      className={`inline-flex items-center px-2.5 py-1 text-xs rounded-lg ${
                        config[key as keyof ConfigQueryData]
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          config[key as keyof ConfigQueryData]
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* 版本信息 */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                <span>版本：{config.version_name || "未知"}</span>
                <span>版本号：{config.version_code || "未知"}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
