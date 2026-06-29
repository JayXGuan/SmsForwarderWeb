"use client";

import { useState } from "react";
import type { CallInfo } from "@/types";

interface CallTabProps {
  callList: CallInfo[];
  onLoadCall: (type: number) => void;
}

export default function CallTab({ callList, onLoadCall }: CallTabProps) {
  const [activeType, setActiveType] = useState(1);

  const handleTypeChange = (type: number) => {
    setActiveType(type);
    onLoadCall(type);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">通话记录</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange(1)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeType === 1
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            来电
          </button>
          <button
            onClick={() => handleTypeChange(2)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeType === 2
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            去电
          </button>
          <button
            onClick={() => handleTypeChange(3)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeType === 3
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            未接
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {callList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无通话记录</div>
        ) : (
          callList.map((call, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {call.name || call.number}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(call.dateLong).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                通话时长：{call.duration}秒
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
