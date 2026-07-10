"use client";

import { useState, useEffect } from "react";
import type { MultiSimConfig } from "@/types";
import { parseSubNumbers } from "@/lib/multiSimUtils";
import {
  SUB_NUMBER_TYPES,
  SUB_NUMBER_TYPE_NAMES,
  ALL_SUB_NUMBER_TYPES,
} from "@/lib/subNumberTypes";

interface MultiSimConfigFormProps {
  config?: MultiSimConfig | null;
  onSubmit: (data: { main_number: string; sub_type: string; sub_numbers: string[] }) => void;
  onCancel: () => void;
  loading: boolean;
}

/**
 * 单卡多副卡配置表单
 *
 * 支持新增和编辑模式，表单字段包括：
 * - 主号（必填）
 * - 副号类型（目前支持移动和多号）
 * - 副号列表（可增删）
 */
export default function MultiSimConfigForm({
  config,
  onSubmit,
  onCancel,
  loading,
}: MultiSimConfigFormProps) {
  const [mainNumber, setMainNumber] = useState("");
  const [subType, setSubType] = useState<string>(SUB_NUMBER_TYPES.CMCC_MULTI);
  const [subNumbers, setSubNumbers] = useState<string[]>([""]);
  const [error, setError] = useState("");

  // 编辑模式时初始化表单数据
  useEffect(() => {
    if (config) {
      setMainNumber(config.main_number);
      setSubType(config.sub_type || SUB_NUMBER_TYPES.CMCC_MULTI);
      setSubNumbers(parseSubNumbers(config.sub_numbers));
    } else {
      setMainNumber("");
      setSubType(SUB_NUMBER_TYPES.CMCC_MULTI);
      setSubNumbers([""]);
    }
    setError("");
  }, [config]);

  const handleAddSubNumber = () => {
    setSubNumbers([...subNumbers, ""]);
  };

  const handleRemoveSubNumber = (index: number) => {
    if (subNumbers.length > 1) {
      setSubNumbers(subNumbers.filter((_, i) => i !== index));
    }
  };

  const handleSubNumberChange = (index: number, value: string) => {
    const updated = [...subNumbers];
    updated[index] = value;
    setSubNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!mainNumber.trim()) {
      setError("主号不能为空");
      return;
    }

    const validSubNumbers = subNumbers.filter((n) => n.trim());
    if (validSubNumbers.length === 0) {
      setError("至少需要添加一个副号");
      return;
    }

    onSubmit({
      main_number: mainNumber.trim(),
      sub_type: subType,
      sub_numbers: validSubNumbers,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 主号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          主号
        </label>
        <input
          type="text"
          value={mainNumber}
          onChange={(e) => setMainNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入主号号码"
          required
        />
      </div>

      {/* 副号类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          副号类型
        </label>
        <select
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ALL_SUB_NUMBER_TYPES.map((type) => (
            <option key={type} value={type}>
              {SUB_NUMBER_TYPE_NAMES[type]}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          选择运营商提供的副号服务类型
        </p>
      </div>

      {/* 副号列表 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          副号列表
        </label>
        <div className="space-y-2">
          {subNumbers.map((number, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={number}
                onChange={(e) => handleSubNumberChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`副号 ${index + 1}`}
              />
              {subNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSubNumber(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  删除
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddSubNumber}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
        >
          + 添加副号
        </button>
      </div>

      {/* 错误提示 */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "保存中..." : config ? "更新" : "保存"}
        </button>
      </div>
    </form>
  );
}