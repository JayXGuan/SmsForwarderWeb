"use client";

import { useState } from "react";
import type { SmsInfo } from "@/types";

interface SmsTabProps {
  smsList: SmsInfo[];
  onLoadSms: (type: number) => void;
}

export default function SmsTab({ smsList, onLoadSms }: SmsTabProps) {
  const [activeType, setActiveType] = useState(1);

  const handleTypeChange = (type: number) => {
    setActiveType(type);
    onLoadSms(type);
  };
  console.log("SmsTab", "activeType", smsList, activeType);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">短信记录</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange(1)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeType === 1
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            收到的短信
          </button>
          <button
            onClick={() => handleTypeChange(2)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeType === 2
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            发送的短信
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {smsList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无短信记录</div>
        ) : (
          smsList.map((sms, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {sms.name || "未知联系人"}{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    ({sms.number})
                  </span>
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(sms.date).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{sms.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
