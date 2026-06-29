"use client";

import type { ContactInfo } from "@/types";

interface ContactTabProps {
  contactList: ContactInfo[];
}

export default function ContactTab({ contactList }: ContactTabProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">联系人列表</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {contactList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无联系人</div>
        ) : (
          contactList.map((contact, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">{contact.name}</span>
              <span className="text-gray-600">{contact.phoneNumber}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
