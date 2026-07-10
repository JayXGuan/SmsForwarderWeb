"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isLoggedIn } from "@/actions/auth";
import { getDevice, type Device } from "@/actions/devices";
import { getMultiSimConfigs } from "@/actions/multiSimConfigs";
import { queryConfig } from "@/actions/deviceApi";
import Loading from "@/components/shared/Loading";
import Modal from "@/components/shared/Modal";
import DeviceHeader from "@/components/devices/DeviceHeader";
import DeviceTabNav from "@/components/devices/DeviceTabNav";
import OverviewTab from "@/components/devices/OverviewTab";
import SmsTab from "@/components/devices/SmsTab";
import CallTab from "@/components/devices/CallTab";
import ContactTab from "@/components/devices/ContactTab";
import BatteryTab from "@/components/devices/BatteryTab";
import LocationTab from "@/components/devices/LocationTab";
import CloneTab from "@/components/devices/CloneTab";
import SendSmsForm from "@/components/devices/SendSmsForm";
import AddContactForm from "@/components/devices/AddContactForm";
import WolForm from "@/components/devices/WolForm";
import type { ConfigQueryData, MultiSimConfig } from "@/types";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [device, setDevice] = useState<Device | null>(null);
  const [config, setConfig] = useState<ConfigQueryData | null>(null);
  const [multiSimConfigs, setMultiSimConfigs] = useState<MultiSimConfig[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 弹窗状态
  const [showSendSmsModal, setShowSendSmsModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showWolModal, setShowWolModal] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isLoggedIn();
      setIsAuth(auth);
      setAuthLoading(false);
      if (!auth) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  // 获取设备信息和单卡多副卡配置
  useEffect(() => {
    if (isAuth && id) {
      const fetchDevice = async () => {
        setLoading(true);
        // 获取设备信息
        const result = await getDevice(Number(id));
        if (result.success && result.data) {
          setDevice(result.data);
          // 获取设备配置
          const configResult = await queryConfig(result.data);
          if (configResult.code === 200 && configResult.data) {
            setConfig(configResult.data as unknown as ConfigQueryData);
          } else {
            setError(configResult.msg || "获取设备配置失败");
          }
        } else {
          setError(result.error || "获取设备信息失败");
        }
        // 获取单卡多副卡配置
        const configsResult = await getMultiSimConfigs();
        console.log('configsResult',configsResult);
        
        if (configsResult.success) {
          setMultiSimConfigs(configsResult.data);
        }
        setLoading(false);
      };
      fetchDevice();
    }
  }, [isAuth, id]);

  if (authLoading || !isAuth) {
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
      <DeviceHeader device={device} />

      {/* Tab导航 */}
      <DeviceTabNav
        activeTab={activeTab}
        config={config}
        onTabChange={setActiveTab}
      />

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && config && (
          <OverviewTab
            config={config}
            multiSimConfigs={multiSimConfigs}
            onSendSms={() => setShowSendSmsModal(true)}
            onAddContact={() => setShowAddContactModal(true)}
            onWol={() => setShowWolModal(true)}
          />
        )}

        {activeTab === "sms" && <SmsTab device={device} />}

        {activeTab === "call" && <CallTab device={device} />}

        {activeTab === "contact" && <ContactTab device={device} />}

        {activeTab === "battery" && <BatteryTab device={device} />}

        {activeTab === "location" && <LocationTab device={device} />}

        {activeTab === "clone" && config && (
          <CloneTab device={device} config={config} />
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
          multiSimConfigs={multiSimConfigs}
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
          onSuccess={() => setShowAddContactModal(false)}
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
