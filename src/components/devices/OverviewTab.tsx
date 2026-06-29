"use client";

import type { ConfigQueryData, SimInfo } from "@/types";

interface OverviewTabProps {
  config: ConfigQueryData;
  onSendSms: () => void;
  onAddContact: () => void;
  onWol: () => void;
}

export default function OverviewTab({
  config,
  onSendSms,
  onAddContact,
  onWol,
}: OverviewTabProps) {
  const simInfoList = config.sim_info_list || {};

  return (
    <div className="space-y-6">
      {/* SIM卡信息 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SIM 卡信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(simInfoList).map(([key, sim]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  SIM{parseInt(key) + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {(sim as SimInfo).mCarrierName}
                </span>
              </div>
              <p className="text-gray-600">
                {(sim as SimInfo).mNumber || "未知号码"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {config.enable_api_sms_send && (
            <button
              onClick={onSendSms}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="text-sm font-medium text-blue-600">
                发送短信
              </span>
            </button>
          )}
          {config.enable_api_contact_add && (
            <button
              onClick={onAddContact}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span className="text-sm font-medium text-green-600">
                添加联系人
              </span>
            </button>
          )}
          {config.enable_api_wol && (
            <button
              onClick={onWol}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-purple-600">
                WOL唤醒
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 版本信息 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">版本信息</h3>
        <div className="flex items-center gap-4 text-gray-600">
          <span>版本名称：{config.version_name || "未知"}</span>
          <span>版本号：{config.version_code || "未知"}</span>
        </div>
      </div>
    </div>
  );
}
