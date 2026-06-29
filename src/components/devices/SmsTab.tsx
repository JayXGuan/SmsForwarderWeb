"use client";

import { useState, useEffect } from "react";
import { querySms } from "@/actions/deviceApi";
import type { SmsInfo } from "@/types";
import type { Device } from "@/actions/devices";

interface SmsTabProps {
  device: Device;
}

export default function SmsTab({ device }: SmsTabProps) {
  const [smsList, setSmsList] = useState<SmsInfo[]>([]);
  const [activeType, setActiveType] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageSize = 20;

  // 首次挂载时加载
  useEffect(() => {
    loadSmsList(activeType, 1);
  }, []);

  const loadSmsList = async (type: number, page: number) => {
    setLoading(true);
    const result = await querySms(device, {
      type,
      page_num: page,
      page_size: pageSize,
    });
    if (result.code === 200 && result.data) {
      const newData = result.data as unknown as SmsInfo[];
      setSmsList((prev) => [...prev, ...newData]);
      if (newData.length < pageSize) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  const handleTypeChange = (type: number) => {
    setActiveType(type);
    setPageNum(1);
    setHasMore(true);
    setSmsList([]);
    loadSmsList(type, 1);
  };

  const handleLoadMore = () => {
    const nextPage = pageNum + 1;
    setPageNum(nextPage);
    loadSmsList(activeType, nextPage);
  };

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
        {smsList.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">暂无短信记录</div>
        ) : (
          smsList.map((sms, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {sms.number}
                  {sms.name && (
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      ({sms.name})
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(sms.date).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{sms.content}</p>
            </div>
          ))
        )}
        {loading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            加载中...
          </div>
        )}
      </div>
      {/* 底部加载更多 */}
      <div className="p-4 border-t border-gray-100 text-center">
        {hasMore && smsList.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        )}
        {!hasMore && smsList.length > 0 && (
          <span className="text-sm text-gray-400">没有更多数据了</span>
        )}
      </div>
    </div>
  );
}
