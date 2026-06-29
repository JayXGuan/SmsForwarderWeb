"use client";

import { useState } from "react";
import { addContact } from "@/actions/deviceApi";
import type { DeviceRecord } from "@/types";

interface AddContactFormProps {
  device: DeviceRecord;
  onSuccess: () => void;
}

export default function AddContactForm({
  device,
  onSuccess,
}: AddContactFormProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await addContact(device, { name, phoneNumber });
    if (result.code === 200) {
      onSuccess();
    } else {
      setError(result.msg || "添加失败");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          联系人姓名
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          电话号码
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="多个号码用分号分隔"
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "添加中..." : "添加"}
      </button>
    </form>
  );
}
