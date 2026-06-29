"use client";

import { useState, useEffect } from "react";
import { queryCall } from "@/actions/deviceApi";
import type { CallInfo } from "@/types";
import type { Device } from "@/actions/devices";

interface CallTabProps {
  device: Device;
}

export default function CallTab({ device }: CallTabProps) {
  const [callList, setCallList] = useState<CallInfo[]>([]);
  const [activeType, setActiveType] = useState(1);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageSize = 20;

  // 首次挂载时加载
  useEffect(() => {
    loadCallList(activeType, 1);
  }, []);

  const loadCallList = async (type: number, page: number) => {
    setLoading(true);
    const result = await queryCall(device, {
      type,
      page_num: page,
      page_size: pageSize,
    });
    if (result.code === 200 && result.data) {
      const newData = result.data as unknown as CallInfo[];
      setCallList((prev) => [...prev, ...newData]);
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
    setCallList([]);
    loadCallList(type, 1);
  };

  const handleLoadMore = () => {
    const nextPage = pageNum + 1;
    setPageNum(nextPage);
    loadCallList(activeType, nextPage);
  };
  console.log("callList", callList);
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
        {callList.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">暂无通话记录</div>
        ) : (
          callList.map((call, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {call.number}
                  {call.name && (
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      ({call.name})
                    </span>
                  )}
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
        {loading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            加载中...
          </div>
        )}
      </div>
      {/* 底部加载更多 */}
      <div className="p-4 border-t border-gray-100 text-center">
        {hasMore && callList.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        )}
        {!hasMore && callList.length > 0 && (
          <span className="text-sm text-gray-400">没有更多数据了</span>
        )}
      </div>
    </div>
  );
}
