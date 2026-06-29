"use client";

import { useState } from "react";
import { sendWol } from "@/actions/deviceApi";
import type { Device } from "@/actions/devices";

interface WolFormProps {
  device: Device;
  onSuccess: () => void;
}

export default function WolForm({ device, onSuccess }: WolFormProps) {
  const [mac, setMac] = useState("");
  const [ip, setIp] = useState("255.255.255.255");
  const [port, setPort] = useState("9");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await sendWol(device, { mac, ip, port: parseInt(port) });
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
          MAC地址
        </label>
        <input
          type="text"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="例如：AA:BB:CC:DD:EE:FF"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          广播IP
        </label>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          端口
        </label>
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "发送中..." : "发送唤醒包"}
      </button>
    </form>
  );
}
