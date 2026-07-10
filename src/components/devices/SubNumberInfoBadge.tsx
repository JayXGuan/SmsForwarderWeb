"use client";

import type { MultiSimConfig } from "@/types";
import { getSubNumberTypeName } from "@/lib/subNumberTypes";
import { parseSubNumbers } from "@/lib/multiSimUtils";

interface SubNumberInfoBadgeProps {
  /** 匹配的单卡多副卡配置 */
  config: MultiSimConfig;
  /** 是否使用紧凑模式（用于卡片折叠状态） */
  compact?: boolean;
}

/**
 * 副卡信息展示徽章
 *
 * 当 SIM 卡号码匹配单卡多副卡配置时，展示副卡信息。
 * 支持紧凑模式和完整模式。
 */
export default function SubNumberInfoBadge({
  config,
  compact = false,
}: SubNumberInfoBadgeProps) {
  const subNumbers = parseSubNumbers(config.sub_numbers);
  const typeName = getSubNumberTypeName(config.sub_type);

  if (compact) {
    // 紧凑模式：显示一个小标签
    return (
      <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full ml-2">
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {typeName} ({subNumbers.length}个副号)
      </span>
    );
  }

  // 完整模式：显示详细信息
  return (
    <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
      <div className="flex items-center gap-2 mb-1.5">
        <svg
          className="w-4 h-4 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span className="text-sm font-medium text-purple-700">
          {typeName} - 副卡服务
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {subNumbers.map((num, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 bg-white text-purple-600 text-xs rounded border border-purple-200"
          >
            副号{index + 1}: {num}
          </span>
        ))}
      </div>
    </div>
  );
}
