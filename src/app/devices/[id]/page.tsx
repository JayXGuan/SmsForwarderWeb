"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { useAuth } from "@/context/AuthContext";
import {
  queryConfig,
  querySms,
  queryCall,
  queryContact,
  queryBattery,
  queryLocation,
  sendSms,
  addContact,
  sendWol,
} from "@/lib/deviceApi";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import type {
  DeviceRecord,
  ConfigQueryData,
  SmsInfo,
  CallInfo,
  ContactInfo,
  BatteryInfo,
  LocationInfo,
  SimInfo,
} from "@/types";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, logout } = useAuth();

  const [device, setDevice] = useState<DeviceRecord | null>(null);
  const [config, setConfig] = useState<ConfigQueryData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 数据列表状态
  const [smsList, setSmsList] = useState<SmsInfo[]>([]);
  const [callList, setCallList] = useState<CallInfo[]>([]);
  const [contactList, setContactList] = useState<ContactInfo[]>([]);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);

  // 弹窗状态
  const [showSendSmsModal, setShowSendSmsModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showWolModal, setShowWolModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  const fetchDevice = useCallback(async () => {
    if (!id) return;
    try {
      const record = await pb.collection("devices").getOne(id as string);
      setDevice(record as unknown as DeviceRecord);

      // 获取设备配置
      const configResult = await queryConfig(record as unknown as DeviceRecord);
      if (configResult.code === 200 && configResult.data) {
        setConfig(configResult.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取设备信息失败");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchDevice();
    }
  }, [isLoggedIn, id, fetchDevice]);

  // 加载各类数据
  const loadSmsList = async (type: number = 1) => {
    if (!device) return;
    try {
      const result = await querySms(device, {
        type,
        page_num: 1,
        page_size: 20,
      });
      if (result.code === 200 && result.data) {
        setSmsList(result.data);
      }
    } catch (err) {
      console.error("Failed to load SMS:", err);
    }
  };

  const loadCallList = async (type: number = 1) => {
    if (!device) return;
    try {
      const result = await queryCall(device, {
        type,
        page_num: 1,
        page_size: 20,
      });
      if (result.code === 200 && result.data) {
        setCallList(result.data);
      }
    } catch (err) {
      console.error("Failed to load calls:", err);
    }
  };

  const loadContactList = async () => {
    if (!device) return;
    try {
      const result = await queryContact(device, { page_num: 1, page_size: 50 });
      if (result.code === 200 && result.data) {
        setContactList(result.data);
      }
    } catch (err) {
      console.error("Failed to load contacts:", err);
    }
  };

  const loadBattery = async () => {
    if (!device) return;
    try {
      const result = await queryBattery(device);
      if (result.code === 200 && result.data) {
        setBattery(result.data);
      }
    } catch (err) {
      console.error("Failed to load battery:", err);
    }
  };

  const loadLocation = async () => {
    if (!device) return;
    try {
      const result = await queryLocation(device);
      if (result.code === 200 && result.data) {
        setLocation(result.data);
      }
    } catch (err) {
      console.error("Failed to load location:", err);
    }
  };

  // Tab切换时加载对应数据
  useEffect(() => {
    if (!device || activeTab === "overview") return;

    switch (activeTab) {
      case "sms":
        loadSmsList();
        break;
      case "call":
        loadCallList();
        break;
      case "contact":
        loadContactList();
        break;
      case "battery":
        loadBattery();
        break;
      case "location":
        loadLocation();
        break;
    }
  }, [activeTab, device]);

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading text="加载中..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading text="加载设备信息..." />
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "设备不存在"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {device.name}
                </h1>
                <p className="text-xs text-gray-500">
                  {device.ip}:{device.port}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Tab导航 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {[
              { key: "overview", label: "概览" },
              {
                key: "sms",
                label: "短信",
                enabled: config?.enable_api_sms_query,
              },
              {
                key: "call",
                label: "通话",
                enabled: config?.enable_api_call_query,
              },
              {
                key: "contact",
                label: "联系人",
                enabled: config?.enable_api_contact_query,
              },
              {
                key: "battery",
                label: "电量",
                enabled: config?.enable_api_battery_query,
              },
              {
                key: "location",
                label: "位置",
                enabled: config?.enable_api_location,
              },
            ].map(({ key, label, enabled }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                disabled={key !== "overview" && !enabled}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === key
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : enabled
                      ? "text-gray-600 hover:text-gray-900"
                      : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 概览Tab */}
        {activeTab === "overview" && config && (
          <div className="space-y-6">
            {/* SIM卡信息 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                SIM 卡信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(config.sim_info_list || {}).map(
                  ([key, sim]: [string, SimInfo]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          SIM{parseInt(key) + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          {sim.mCarrierName}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {sim.mNumber || "未知号码"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                快捷操作
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {config.enable_api_sms_send && (
                  <button
                    onClick={() => setShowSendSmsModal(true)}
                    className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span className="text-sm font-medium text-blue-600">
                      发送短信
                    </span>
                  </button>
                )}
                {config.enable_api_contact_add && (
                  <button
                    onClick={() => setShowAddContactModal(true)}
                    className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-600">
                      添加联系人
                    </span>
                  </button>
                )}
                {config.enable_api_wol && (
                  <button
                    onClick={() => setShowWolModal(true)}
                    className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                  >
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-purple-600">
                      WOL唤醒
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* 版本信息 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                版本信息
              </h3>
              <div className="flex items-center gap-4 text-gray-600">
                <span>版本名称：{config.version_name || "未知"}</span>
                <span>版本号：{config.version_code || "未知"}</span>
              </div>
            </div>
          </div>
        )}

        {/* 短信Tab */}
        {activeTab === "sms" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">短信记录</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => loadSmsList(1)}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  收到的短信
                </button>
                <button
                  onClick={() => loadSmsList(2)}
                  className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  发送的短信
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {smsList.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  暂无短信记录
                </div>
              ) : (
                smsList.map((sms, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {sms.name || sms.number}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(sms.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{sms.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 通话Tab */}
        {activeTab === "call" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">通话记录</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => loadCallList(1)}
                  className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  来电
                </button>
                <button
                  onClick={() => loadCallList(2)}
                  className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  去电
                </button>
                <button
                  onClick={() => loadCallList(3)}
                  className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  未接
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {callList.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  暂无通话记录
                </div>
              ) : (
                callList.map((call, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {call.name || call.number}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(call.dateLong).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      通话时长：{call.duration}秒
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 联系人Tab */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                联系人列表
              </h3>
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
                    <span className="font-medium text-gray-900">
                      {contact.name}
                    </span>
                    <span className="text-gray-600">{contact.phoneNumber}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 电量Tab */}
        {activeTab === "battery" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              电量状态
            </h3>
            {battery ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {battery.level}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">电量</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xl font-semibold text-gray-900">
                    {battery.status === 2
                      ? "放电中"
                      : battery.status === 3
                        ? "满电"
                        : "充电中"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">状态</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xl font-semibold text-gray-900">
                    {battery.temperature / 10}°C
                  </p>
                  <p className="text-sm text-gray-500 mt-1">温度</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xl font-semibold text-gray-900">
                    {battery.voltage}mV
                  </p>
                  <p className="text-sm text-gray-500 mt-1">电压</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                无法获取电量信息
              </div>
            )}
          </div>
        )}

        {/* 位置Tab */}
        {activeTab === "location" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              位置信息
            </h3>
            {location ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">地址</p>
                  <p className="text-gray-900">
                    {location.address || "未知地址"}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">纬度</p>
                    <p className="text-gray-900">{location.latitude}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">经度</p>
                    <p className="text-gray-900">{location.longitude}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">精度</p>
                    <p className="text-gray-900">{location.accuracy}米</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">更新时间</p>
                    <p className="text-gray-900">
                      {new Date(location.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                无法获取位置信息
              </div>
            )}
          </div>
        )}
      </main>

      {/* 发送短信弹窗 */}
      <Modal
        isOpen={showSendSmsModal}
        onClose={() => setShowSendSmsModal(false)}
        title="发送短信"
      >
        <SendSmsForm
          device={device}
          config={config}
          onSuccess={() => setShowSendSmsModal(false)}
        />
      </Modal>

      {/* 添加联系人弹窗 */}
      <Modal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        title="添加联系人"
      >
        <AddContactForm
          device={device}
          onSuccess={() => {
            setShowAddContactModal(false);
            loadContactList();
          }}
        />
      </Modal>

      {/* WOL唤醒弹窗 */}
      <Modal
        isOpen={showWolModal}
        onClose={() => setShowWolModal(false)}
        title="WOL唤醒"
      >
        <WolForm device={device} onSuccess={() => setShowWolModal(false)} />
      </Modal>
    </div>
  );
}

// 发送短信表单组件
function SendSmsForm({
  device,
  config,
  onSuccess,
}: {
  device: DeviceRecord;
  config: ConfigQueryData | null;
  onSuccess: () => void;
}) {
  const [simSlot, setSimSlot] = useState(1);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    } finally {
      setLoading(false);
    }
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

// 添加联系人表单组件
function AddContactForm({
  device,
  onSuccess,
}: {
  device: DeviceRecord;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await addContact(device, { name, phoneNumber });
      if (result.code === 200) {
        onSuccess();
      } else {
        setError(result.msg || "添加失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加失败");
    } finally {
      setLoading(false);
    }
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

// WOL唤醒表单组件
function WolForm({
  device,
  onSuccess,
}: {
  device: DeviceRecord;
  onSuccess: () => void;
}) {
  const [mac, setMac] = useState("");
  const [ip, setIp] = useState("255.255.255.255");
  const [port, setPort] = useState("9");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await sendWol(device, { mac, ip, port: parseInt(port) });
      if (result.code === 200) {
        onSuccess();
      } else {
        setError(result.msg || "发送失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    } finally {
      setLoading(false);
    }
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
