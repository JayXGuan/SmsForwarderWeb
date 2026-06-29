import type {
  ApiResponse,
  ApiRequest,
  ConfigQueryData,
  SmsInfo,
  CallInfo,
  ContactInfo,
  BatteryInfo,
  LocationInfo,
  SmsQueryParams,
  CallQueryParams,
  ContactQueryParams,
  SmsSendParams,
  ContactAddParams,
  WolSendParams,
  DeviceRecord,
} from "@/types";

// HMAC-SHA256 签名计算
async function calcSign(timestamp: number, signKey: string): Promise<string> {
  const stringToSign = `${timestamp}\n${signKey}`;

  // 使用 Web Crypto API 计算 HMAC-SHA256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(signKey);
  const messageData = encoder.encode(stringToSign);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return encodeURIComponent(base64);
}

// 构建请求体
async function buildRequest<T>(
  data: T,
  device: DeviceRecord,
): Promise<ApiRequest<T>> {
  const timestamp = Date.now();
  let sign: string | undefined;

  if (device.security_mode === 1 && device.sign_key) {
    sign = await calcSign(timestamp, device.sign_key);
  }

  return {
    data,
    timestamp,
    sign,
  };
}

// 发送 API 请求
async function sendRequest<T, R>(
  device: DeviceRecord,
  endpoint: string,
  data: T,
): Promise<ApiResponse<R>> {
  const baseUrl = `http://${device.ip}:${device.port}`;
  const requestBody = await buildRequest(data, device);

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return {
        code: response.status,
        msg: `HTTP Error: ${response.statusText}`,
        timestamp: Date.now(),
      };
    }

    const result: ApiResponse<R> = await response.json();
    return result;
  } catch (error) {
    return {
      code: 500,
      msg: error instanceof Error ? error.message : "Network error",
      timestamp: Date.now(),
    };
  }
}

// 查询服务器配置
export async function queryConfig(
  device: DeviceRecord,
): Promise<ApiResponse<ConfigQueryData>> {
  return sendRequest(device, "/config/query", { version_code: 100038 });
}

// 发送短信
export async function sendSms(
  device: DeviceRecord,
  params: SmsSendParams,
): Promise<ApiResponse<never>> {
  return sendRequest(device, "/sms/send", params);
}

// 查询短信
export async function querySms(
  device: DeviceRecord,
  params: SmsQueryParams = {},
): Promise<ApiResponse<SmsInfo[]>> {
  return sendRequest(device, "/sms/query", {
    type: params.type ?? 1,
    page_num: params.page_num ?? 1,
    page_size: params.page_size ?? 10,
    keyword: params.keyword ?? "",
  });
}

// 查询通话记录
export async function queryCall(
  device: DeviceRecord,
  params: CallQueryParams = {},
): Promise<ApiResponse<CallInfo[]>> {
  return sendRequest(device, "/call/query", {
    type: params.type ?? 1,
    page_num: params.page_num ?? 1,
    page_size: params.page_size ?? 10,
    phone_number: params.phone_number ?? "",
  });
}

// 查询联系人
export async function queryContact(
  device: DeviceRecord,
  params: ContactQueryParams = {},
): Promise<ApiResponse<ContactInfo[]>> {
  return sendRequest(device, "/contact/query", {
    page_num: params.page_num ?? 1,
    page_size: params.page_size ?? 10,
    phone_number: params.phone_number ?? "",
    name: params.name ?? "",
  });
}

// 添加联系人
export async function addContact(
  device: DeviceRecord,
  params: ContactAddParams,
): Promise<ApiResponse<never>> {
  return sendRequest(device, "/contact/add", params);
}

// 查询电量
export async function queryBattery(
  device: DeviceRecord,
): Promise<ApiResponse<BatteryInfo>> {
  return sendRequest(device, "/battery/query", { version_code: 100038 });
}

// 查询位置
export async function queryLocation(
  device: DeviceRecord,
): Promise<ApiResponse<LocationInfo>> {
  return sendRequest(device, "/location/query", { version_code: 100038 });
}

// 发送 WOL 唤醒包
export async function sendWol(
  device: DeviceRecord,
  params: WolSendParams,
): Promise<ApiResponse<never>> {
  return sendRequest(device, "/wol/send", {
    mac: params.mac,
    ip: params.ip ?? "255.255.255.255",
    port: params.port ?? 9,
  });
}
