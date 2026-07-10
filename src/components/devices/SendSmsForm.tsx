"use client";

import { useState, useEffect } from "react";
import { sendSms } from "@/actions/deviceApi";
import type { Device } from "@/actions/devices";
import type { ConfigQueryData, MultiSimConfig } from "@/types";
import {
  checkSubNumberSupport,
  parseSubNumbers,
  formatSubNumberPhone,
  getFormatDescription,
} from "@/lib/multiSimUtils";

interface SendSmsFormProps {
  device: Device;
  config?: ConfigQueryData | null;
  multiSimConfigs?: MultiSimConfig[];
  onSuccess: () => void;
}

/**
 * 短信发送表单
 *
 * 支持选择 SIM 卡槽，当 SIM 卡号码匹配单卡多副卡配置的主号时，
 * 可选择使用副号发送短信。号码格式根据副号类型自动处理。
 */
export default function SendSmsForm({
  device,
  config,
  multiSimConfigs = [],
  onSuccess,
}: SendSmsFormProps) {
  const [simSlot, setSimSlot] = useState(1);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 副号选择相关状态
  const [matchedConfig, setMatchedConfig] = useState<MultiSimConfig | null>(null);
  const [subNumberList, setSubNumberList] = useState<string[]>([]);
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);

  // 当 SIM 卡槽变化时，检查是否支持副号发送
  useEffect(() => {
    if (config && multiSimConfigs.length > 0) {
      const matched = checkSubNumberSupport(
        config.sim_info_list,
        simSlot,
        multiSimConfigs,
        config.extra_sim1,
        config.extra_sim2,
      );
      setMatchedConfig(matched);
      if (matched) {
        setSubNumberList(parseSubNumbers(matched.sub_numbers));
      } else {
        setSubNumberList([]);
      }
      setSelectedSubIndex(null);
    } else {
      setMatchedConfig(null);
      setSubNumberList([]);
      setSelectedSubIndex(null);
    }
  }, [simSlot, config, multiSimConfigs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 处理目标号码：如果选择了副号，需要格式化号码
    let finalPhoneNumbers = phoneNumbers;
    if (matchedConfig && selectedSubIndex !== null && selectedSubIndex >= 1) {
      // 对每个号码进行格式化（支持分号分隔的多个号码）
      const numbers = phoneNumbers.split(";").filter((n) => n.trim());
      finalPhoneNumbers = numbers
        .map((n) => formatSubNumberPhone(matchedConfig, n.trim(), selectedSubIndex))
        .join(";");
    }

    const result = await sendSms(device, {
      sim_slot: simSlot,
      phone_numbers: finalPhoneNumbers,
      msg_content: content,
    });
    if (result.code === 200) {
      onSuccess();
    } else {
      setError(result.msg || "发送失败");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SIM卡槽
        </label>
        <select
          value={simSlot}
          onChange={(e) => setSimSlot(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>SIM1</option>
          <option value={2}>SIM2</option>
        </select>
      </div>

      {/* 副号选择：当 SIM 卡匹配配置时显示 */}
      {matchedConfig && subNumberList.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            发送方式
          </label>
          <select
            value={selectedSubIndex ?? 0}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setSelectedSubIndex(value === 0 ? null : value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>使用主号 ({matchedConfig.main_number})</option>
            {subNumberList.map((sub, index) => (
              <option key={index} value={index + 1}>
                使用副号{index + 1} ({sub})
              </option>
            ))}
          </select>
          {selectedSubIndex !== null && (
            <p className="text-xs text-gray-500 mt-1.5">
              {getFormatDescription(matchedConfig, selectedSubIndex)}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          接收号码
        </label>
        <input
          type="text"
          value={phoneNumbers}
          onChange={(e) => setPhoneNumbers(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="多个号码用分号分隔"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          短信内容
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "发送中..." : "发送"}
      </button>
    </form>
  );
}
