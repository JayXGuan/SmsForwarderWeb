"use client";

import { useState, useEffect } from "react";
import { queryContact } from "@/actions/deviceApi";
import type { ContactInfo } from "@/types";
import type { Device } from "@/actions/devices";

interface ContactTabProps {
  device: Device;
}

export default function ContactTab({ device }: ContactTabProps) {
  const [contactList, setContactList] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // 首次挂载时加载
  useEffect(() => {
    loadContactList();
  }, []);

  const loadContactList = async () => {
    setLoading(true);
    const result = await queryContact(device);
    if (result.code === 200 && result.data) {
      setContactList(result.data as unknown as ContactInfo[]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">联系人列表</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {contactList.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-500">暂无联系人</div>
        ) : (
          contactList.map((contact, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">{contact.name}</span>
              <span className="text-gray-600">{contact.phone_number}</span>
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
    </div>
  );
}
