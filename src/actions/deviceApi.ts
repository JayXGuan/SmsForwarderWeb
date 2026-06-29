"use server";

import type { DeviceRecord, ApiResponse, ConfigQueryData } from "@/types";

// 通用请求函数
async function deviceRequest<T>(
  device: DeviceRecord,
  endpoint: string,
  data: Record<string, unknown> = {},
): Promise<ApiResponse<T>> {
  const url = `http://${device.ip}:${device.port}${endpoint}`;
  const timestamp = Date.now();

  // 构建请求体
  const requestBody: Record<string, unknown> = {
    data,
    timestamp,
  };

  // 如果需要签名验证
  if (device.security_mode === 1 && device.sign_key) {
    const sign = await calcSign(timestamp, device.sign_key);
    requestBody.sign = sign;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    return result as ApiResponse<T>;
  } catch (error) {
    return {
      code: 500,
      msg: error instanceof Error ? error.message : "网络请求失败",
      timestamp,
    };
  }
}

// 计算签名
async function calcSign(timestamp: number, signKey: string): Promise<string> {
  const stringToSign = `${timestamp}\n${signKey}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(stringToSign),
  );
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return encodeURIComponent(base64);
}

// 查询服务器配置
export async function queryConfig(device: DeviceRecord) {
  return deviceRequest<ConfigQueryData>(device, "/config/query");
}

// 发送短信
export async function sendSms(
  device: DeviceRecord,
  params: {
    sim_slot: number;
    phone_numbers: string;
    msg_content: string;
  },
) {
  return deviceRequest(device, "/sms/send", params);
}

// 查询短信
export async function querySms(
  device: DeviceRecord,
  params: {
    type?: number;
    page_num?: number;
    page_size?: number;
    keyword?: string;
  } = {},
) {
  return deviceRequest(device, "/sms/query", params);
}

// 查询通话记录
export async function queryCall(
  device: DeviceRecord,
  params: {
    type?: number;
    page_num?: number;
    page_size?: number;
    phone_number?: string;
  } = {},
) {
  return deviceRequest(device, "/call/query", params);
}

// 查询联系人
export async function queryContact(
  device: DeviceRecord,
  params: {
    page_num?: number;
    page_size?: number;
    phone_number?: string;
    name?: string;
  } = {},
) {
  return deviceRequest(device, "/contact/query", params);
}

// 添加联系人
export async function addContact(
  device: DeviceRecord,
  params: {
    name: string;
    phoneNumber: string;
  },
) {
  return deviceRequest(device, "/contact/add", params);
}

// 查询电量
export async function queryBattery(device: DeviceRecord) {
  return deviceRequest<Record<string, unknown>>(device, "/battery/query");
}

// 查询位置
export async function queryLocation(device: DeviceRecord) {
  return deviceRequest<Record<string, unknown>>(device, "/location/query");
}

// 发送WOL唤醒包
export async function sendWol(
  device: DeviceRecord,
  params: {
    mac: string;
    ip?: string;
    port?: number;
  },
) {
  return deviceRequest(device, "/wol/send", params);
}
