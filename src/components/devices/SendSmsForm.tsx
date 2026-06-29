"use client";

import { useState } from "react";
import { sendSms } from "@/actions/deviceApi";
import type { Device } from "@/actions/devices";

interface SendSmsFormProps {
  device: Device;
  onSuccess: () => void;
}

export default function SendSmsForm({ device, onSuccess }: SendSmsFormProps) {
  const [simSlot, setSimSlot] = useState(1);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await sendSms(device, {
      sim_slot: simSlot,
      phone_numbers: phoneNumbers,
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value={1}>SIM1</option>
          <option value={2}>SIM2</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          接收号码
        </label>
        <input
          type="text"
          value={phoneNumbers}
          onChange={(e) => setPhoneNumbers(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={4}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "发送中..." : "发送"}
      </button>
    </form>
  );
}
