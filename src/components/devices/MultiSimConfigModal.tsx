"use client";

import { useState } from "react";
import Modal from "@/components/shared/Modal";
import MultiSimConfigForm from "@/components/devices/MultiSimConfigForm";
import type { MultiSimConfig } from "@/types";
import { getSubNumberTypeName } from "@/lib/subNumberTypes";
import { parseSubNumbers } from "@/lib/multiSimUtils";

interface MultiSimConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configs: MultiSimConfig[];
  onAdd: (data: { main_number: string; sub_type: string; sub_numbers: string[] }) => void;
  onEdit: (id: number, data: { main_number: string; sub_type: string; sub_numbers: string[] }) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

/**
 * 单卡多副卡配置管理弹窗
 *
 * 展示配置列表，支持新增、编辑、删除操作
 */
export default function MultiSimConfigModal({
  isOpen,
  onClose,
  configs,
  onAdd,
  onEdit,
  onDelete,
  loading,
}: MultiSimConfigModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<MultiSimConfig | null>(null);

  const handleOpenAdd = () => {
    setEditingConfig(null);
    setShowForm(true);
  };

  const handleOpenEdit = (config: MultiSimConfig) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingConfig(null);
  };

  const handleSubmit = async (data: { main_number: string; sub_type: string; sub_numbers: string[] }) => {
    if (editingConfig) {
      await onEdit(editingConfig.id, data);
    } else {
      await onAdd(data);
    }
    setShowForm(false);
    setEditingConfig(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个配置吗？")) {
      await onDelete(id);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="单卡多副卡配置">
      {showForm ? (
        <MultiSimConfigForm
          config={editingConfig}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          loading={loading}
        />
      ) : (
        <div className="space-y-4">
          {/* 配置列表 */}
          {configs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>暂无配置</p>
              <p className="text-sm mt-2">点击下方按钮添加单卡多副卡配置</p>
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      主号：{config.main_number}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      副号类型：{getSubNumberTypeName(config.sub_type)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      副号列表：{parseSubNumbers(config.sub_numbers).join("、")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(config)}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 添加按钮 */}
          <button
            onClick={handleOpenAdd}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            添加配置
          </button>
        </div>
      )}
    </Modal>
  );
}