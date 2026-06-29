"use client";

import type { ConfigQueryData } from "@/types";

interface DeviceTabNavProps {
  activeTab: string;
  config: ConfigQueryData | null;
  onTabChange: (tab: string) => void;
}

export default function DeviceTabNav({
  activeTab,
  config,
  onTabChange,
}: DeviceTabNavProps) {
  const tabs = [
    { key: "overview", label: "概览" },
    { key: "sms", label: "短信", enabled: config?.enable_api_sms_query },
    { key: "call", label: "通话", enabled: config?.enable_api_call_query },
    {
      key: "contact",
      label: "联系人",
      enabled: config?.enable_api_contact_query,
    },
    {
      key: "battery",
      label: "电量",
      enabled: config?.enable_api_battery_query,
    },
    { key: "location", label: "位置", enabled: config?.enable_api_location },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1">
          {tabs.map(({ key, label, enabled }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              disabled={key !== "overview" && !enabled}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : enabled
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-400 cursor-not-allowed"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
