"use client";

import { useState } from "react";
import Modal from "@/components/shared/Modal";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (device: {
    name: string;
    ip: string;
    port?: number;
    sign_key?: string;
    security_mode?: number;
  }) => Promise<void>;
}

export default function AddDeviceModal({
  isOpen,
  onClose,
  onSubmit,
}: AddDeviceModalProps) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("5000");
  const [signKey, setSignKey] = useState("");
  const [securityMode, setSecurityMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        name,
        ip,
        port: parseInt(port, 10),
        sign_key: signKey || undefined,
        security_mode: securityMode,
      });
      // 重置表单
      setName("");
      setIp("");
      setPort("5000");
      setSignKey("");
      setSecurityMode(0);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加设备失败");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setIp("");
    setPort("5000");
    setSignKey("");
    setSecurityMode(0);
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="添加设备">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            设备名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="例如：我的手机"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IP 地址 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="例如：192.168.1.100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            端口 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="默认：5000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            安全模式
          </label>
          <select
            value={securityMode}
            onChange={(e) => setSecurityMode(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value={0}>无安全措施</option>
            <option value={1}>签名验证</option>
          </select>
        </div>

        {securityMode === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              签名密钥 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={signKey}
              onChange={(e) => setSignKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="请输入签名密钥"
              required={securityMode === 1}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "添加中..." : "添加设备"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
