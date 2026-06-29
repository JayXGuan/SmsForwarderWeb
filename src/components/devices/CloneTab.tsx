"use client";

import { useState, useEffect } from "react";
import { clonePull } from "@/actions/deviceApi";
import type { Device } from "@/actions/devices";
import type { ConfigQueryData } from "@/types";

interface CloneTabProps {
  device: Device;
  config: ConfigQueryData;
}

export default function CloneTab({ device, config }: CloneTabProps) {
  const [cloneData, setCloneData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 首次挂载时加载
  useEffect(() => {
    loadCloneData();
  }, []);

  const loadCloneData = async () => {
    setLoading(true);
    setError(null);
    const result = await clonePull(device, {
      version_code: config.version_code,
    });
    console.log("result", result);
    if (result.code === 200 && result.data) {
      setCloneData(result.data);
    } else {
      setError(result.msg || "无法获取克隆配置");
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

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-gray-500 py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">克隆配置</h3>
      <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 overflow-auto max-h-[600px]">
        {JSON.stringify(cloneData, null, 2)}
      </pre>
    </div>
  );
}
